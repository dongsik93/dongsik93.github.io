---
layout: post
title: "[Android] 온디바이스 LLM으로 긴 문서 요약하기"
subtitle: "4000자 균등 분할 Map-Reduce 패턴 적용기"
date: 2026-04-17 18:00:00 +0900
categories: til
tags: android ai llm on-device map-reduce
comments: true
---

# [Android] 온디바이스 LLM으로 긴 문서 요약하기

> 온디바이스 LLM은 컨텍스트 윈도우가 좁다. 긴 문서를 어떻게 요약할까?

## 배경

온디바이스 sLLM(소형 언어 모델)을 활용해 텍스트/문서 요약 기능을 개발하던 중 현실적인 한계에 부딪혔다.

**모델 컨텍스트 윈도우 제한.**

Gemma3-1B 기준으로 안전하게 처리할 수 있는 입력 토큰은 약 1024~2048 수준이다. 그런데 실제 다루는 문서는 길이가 길어지면 10,000자를 훌쩍 넘기기도 한다. 긴 문서를 그대로 넣으면 모델이 중간을 잘라버리거나, 최악의 경우 추론 자체가 실패한다.

해결 방법을 찾다가 **Map-Reduce** 패턴을 적용했다.

## Map-Reduce 요약이란

원래 분산 처리 개념이지만, LLM 요약에 그대로 적용된다.

```text
긴 텍스트
    ↓ [Map 단계]
청크1 요약 / 청크2 요약 / 청크3 요약
    ↓ [Reduce 단계]
부분 요약들을 합쳐서 최종 요약
```

각 청크는 모델이 처리할 수 있는 크기로 나누고, 청크별로 먼저 요약한 뒤, 그 결과를 다시 합쳐 최종 요약을 생성한다.

## 구현 방식

### 1. HTML 전처리 — TextExtractor

문서 본문이 HTML인 경우 태그 노이즈가 심해서 별도 모듈로 추출 처리를 했다.

- `<style>`, `<script>`, 인라인 CSS 제거
- 시그니처 패턴 감지 후 제거 (인용 블록 포함)
- 링크 URL은 제거하고 텍스트만 유지
- 연속 공백/개행 정리

최종적으로 **순수 텍스트**만 남기는 파이프라인이다.

### 2. 균등 분할

추출된 텍스트를 **4000자** 단위로 균등 분할한다.

단순히 4000자마다 자르면 문장 중간이 잘릴 수 있어서, 마지막 문장 경계(`.`, `!`, `?`, `\n`)를 찾아서 자른다.

```kotlin
fun splitIntoChunks(text: String, chunkSize: Int = 4000): List<String> {
    if (text.length <= chunkSize) return listOf(text)
    val chunks = mutableListOf<String>()
    var start = 0
    while (start < text.length) {
        var end = minOf(start + chunkSize, text.length)
        if (end < text.length) {
            val boundary = text.lastIndexOf('\n', end)
                .takeIf { it > start } ?: text.lastIndexOf('. ', end)
                .takeIf { it > start } ?: end
            end = if (boundary > start) boundary + 1 else end
        }
        chunks.add(text.substring(start, end).trim())
        start = end
    }
    return chunks
}
```

### 3. Map 단계 — 청크별 요약

각 청크에 요약 프롬프트를 붙여 순서대로 추론한다.

```kotlin
val chunkSummaries = chunks.mapIndexed { index, chunk ->
    val prompt = buildChunkPrompt(chunk, index, chunks.size)
    llmEngine.summarize(prompt)
}
```

프롬프트는 청크가 1개면 단순 요약 지시, 여러 개면 "이 문서의 {index+1}/{total} 부분입니다. 핵심 내용을 요약하세요." 식으로 문맥을 제공한다.

### 4. Reduce 단계 — 최종 통합 요약

청크 요약들을 합쳐 다시 한 번 요약 요청을 보낸다.

```kotlin
val combined = chunkSummaries.joinToString("\n\n")
val finalSummary = llmEngine.summarize(buildReducePrompt(combined))
```

청크가 1개뿐이면 Reduce 단계를 건너뛰고 Map 결과를 그대로 반환한다.

## 실측 결과

Galaxy S26 Ultra (Snapdragon 8 Elite, GPU 백엔드) 기준:

| 문서 길이 | 청크 수 | 총 처리 시간 |
|---------|--------|------------|
| 3,000자 이하 | 1 | 약 2.8초 |
| 5,000자 | 2 | 약 5.5초 |
| 12,000자 | 3 | 약 12초 |

12,000자짜리 긴 문서도 12초 안에 처리됐다. 문서 본문이 로딩되는 1~2초와 AI 추론이 병렬로 진행되기 때문에 사용자 체감 대기시간은 이보다 짧다.

## 트레이드오프

**장점**
- 길이 제한 없이 긴 문서 처리 가능
- 각 청크를 독립적으로 요약하므로 앞부분 정보 소실 최소화

**단점**
- 청크 경계에서 문맥이 끊길 수 있다
- 처리 시간이 청크 수에 비례해서 증가한다
- Reduce 단계에서 부분 요약들을 다시 합치면 중복 표현이 생기기도 한다

중복 표현 문제는 Reduce 프롬프트에 "중복 내용은 제거하고 핵심만 남겨라"는 지시를 추가해서 어느 정도 완화했다.

## 정리

온디바이스 LLM의 컨텍스트 한계를 우회하는 Map-Reduce 패턴은 생각보다 단순하게 구현 가능하다. 핵심은 두 가지다:

1. **HTML 전처리를 제대로 해야 한다** — 태그 노이즈가 많으면 모델이 엉뚱한 걸 요약한다
2. **청크 경계를 문장 단위로 잘라야 한다** — 단어 중간을 자르면 품질이 급격히 떨어진다

4000자 단위 분할은 Gemma3-1B 기준으로 튜닝된 값이다. 모델마다 컨텍스트 윈도우가 다르니 직접 실험해보는 것을 권장한다.