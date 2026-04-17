---
layout: post
title: "[Android] Gemma3/4 vs ML Kit GenAI"
subtitle: "온디바이스 텍스트/문서 요약 모델 비교"
date: 2026-04-18 18:00:00 +0900
categories: til
tags: android ai llm on-device gemma mlkit
comments: true
---

# [Android] Gemma3/4 vs ML Kit GenAI

> LiteRT로 직접 모델을 돌리다가 ML Kit GenAI로 갈아탄 이유

## 시작은 LiteRT였다

온디바이스 AI 텍스트/문서 요약을 구현할 때 처음 선택한 스택은 **Google LiteRT-LM + Gemma3-1B**였다.

선택 이유는 명확했다.

- Google이 공식 지원하는 온디바이스 추론 런타임
- int4 양자화로 584MB — 모바일 탑재 가능한 수준
- Galaxy S26 Ultra GPU 백엔드 기준 **2.8초 TTFT** 달성

실제로 성능은 괜찮았다. GPU 백엔드에서 2~3초면 문서 요약이 나왔고, Map-Reduce 패턴으로 긴 텍스트도 처리할 수 있었다.

문제는 **모델 배포**였다.

## LiteRT + Gemma 방식의 현실적인 문제

### 모델 파일 크기

Gemma3-1B int4: **584MB**
Gemma4-E2B int4: **약 2.4GB**

앱 본체를 30MB로 유지하면서 2.4GB 모델을 어떻게 배포할까? Play Asset Delivery를 검토했지만 2GB 넘는 파일 처리가 불안정하고, CDN 직접 배포로 가면 서버 비용과 운영 부담이 생긴다.

사용자 입장에서도 부담이 크다. Wi-Fi 환경에서도 500MB~2.4GB를 내려받아야 기능을 쓸 수 있다.

### 프롬프트 커스터마이징의 함정

LiteRT를 쓰면 프롬프트를 직접 설계할 수 있다. 처음엔 장점이라 생각했는데, 막상 해보니 생각보다 손이 많이 갔다.

- 한국어 문서 특화 요약을 위한 프롬프트 튜닝
- 챗봇 말투 제거 ("알겠습니다! 요약해드리겠습니다" 같은 표현)
- 불릿 포인트 형식 강제

파인튜닝 없이 베이스 모델만으로는 품질이 들쭉날쭉했다. 파인튜닝 파이프라인을 구축하고 실제로 돌려보니 개선은 됐지만, `.litertlm` 변환 툴이 아직 Early Access 상태라 변환 과정이 순탄하지 않았다.

## ML Kit GenAI를 발견하다

그러던 중 ML Kit의 **GenAI Summarization API**를 접했다.

```kotlin
implementation("com.google.mlkit:genai-summarization:1.0.0-beta1")
```

핵심 차이는 단 하나다 — **모델을 앱이 관리하지 않는다.**

ML Kit GenAI는 Android OS에 내장된 AICore가 모델을 관리한다. 앱은 API만 호출하면 된다.

```kotlin
val options = SummarizerOptions.builder(context)
    .setInputType(InputType.ARTICLE)
    .setOutputType(OutputType.THREE_BULLETS)
    .setLanguage(Language.KOREAN)
    .build()
val summarizer = Summarization.getClient(options)
```

## 두 방식 직접 비교

같은 텍스트/문서로 두 방식을 테스트했다.

### 테스트 환경
- 기기: Galaxy S26 Ultra
- 텍스트 길이: 약 2,000자 (실제 사용되는 긴 텍스트 문서)

### TTFT(First Token Time) 비교

| 방식 | TTFT |
|------|------|
| LiteRT + Gemma3-1B (GPU) | 약 490ms |
| ML Kit GenAI | 약 4,400ms |

속도는 LiteRT가 압도적이다.

### 요약 품질 비교

**LiteRT + Gemma3-1B (프롬프트 튜닝)**

```text
• 3월 24일 오후 2시 전략기획 회의 예정
• 참석자: 개발팀, 마케팅팀 필수 참석
• 사전 자료 22일까지 공유 요청
```

**ML Kit GenAI**

```text
• 3월 24일 오후 2시, 6층 대회의실에서 전략기획 회의 진행 예정
• 개발팀, 마케팅팀 전원 필수 참석 (재택 근무자 화상 연결)
• 발표 자료 및 분기 실적 데이터 3월 22일까지 공유 필요
```

내용의 밀도가 다르다. GenAI 결과가 더 구체적이고 누락이 적었다.

개인 정보나 민감한 내용이 담긴 경우 GenAI 내부 정책 필터로 요약이 거부되는 경우도 있었는데, 이건 어쩔 수 없는 한계다.

## 왜 GenAI를 선택했나

결국 가장 큰 이유는 **배포 복잡도**다.

LiteRT 방식은 모델 파일을 직접 배포, 관리, 업데이트해야 한다. Gemma3(584MB)와 Gemma4(2.4GB)를 안정적으로 배포하는 인프라를 만드는 것 자체가 상당한 엔지니어링 비용이다.

반면 GenAI는 OS가 모델을 관리한다. 앱 입장에서는 API 호출 한 줄로 끝난다.

| 항목 | LiteRT + Gemma | ML Kit GenAI |
|------|---------------|-------------|
| TTFT | 490ms | 4,400ms |
| 요약 품질 | 프롬프트 튜닝에 따라 가변 | 안정적으로 높음 |
| 모델 용량 | 앱/서버에서 직접 배포 | OS 관리 (앱 부담 없음) |
| 기기 지원 | GPU 지원 기기 (S22 이상) | Android 10+, Pixel 9 이상 우선 |
| 프롬프트 제어 | 완전 자유 | OutputType/Language 수준 |
| 오프라인 | 가능 | AICore 최초 초기화 필요 |
| 정책 필터 | 없음 | 민감 콘텐츠 거부 가능 |

속도 면에서는 LiteRT가 훨씬 낫다. 하지만 현시점에서 GenAI가 주는 **배포 단순성과 품질 안정성**이 더 매력적이었다.

## 현재 구조

두 방식을 공존시키는 쪽으로 방향을 잡았다.

- **GenAI (내장 모델)**: 기기 지원 여부 체크 후 노출. 설치 부담 없음.
- **Gemma3-1B (500MB 다운로드)**: 더 넓은 기기 지원, 빠른 응답 속도.
- **Gemma4-E2B (2.4GB 다운로드)**: 최고 품질, 고사양 기기 타겟.

사용자가 설정에서 모델을 직접 선택할 수 있게 했다. GenAI를 지원하지 않는 기기는 해당 옵션 자체가 보이지 않는다.

## 정리

TTFT 490ms vs 4,400ms라는 수치만 보면 LiteRT가 압승이다. 하지만 온디바이스 AI를 서비스로 제공할 때 속도가 전부는 아니다.

모델 배포, 업데이트, 기기 호환성, 품질 안정성 — 이 모든 걸 고려하면 GenAI 같은 OS 레벨 지원이 장기적으로 훨씬 지속 가능한 선택이다.

다만 GenAI는 아직 beta이고, 지원 기기 범위가 제한적이다. 당분간은 두 방식을 병행하다가 GenAI 커버리지가 넓어지면 자연스럽게 단일화할 계획이다.