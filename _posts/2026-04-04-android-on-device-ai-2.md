---
layout: post
title: "[Android] 온디바이스 AI 개발기 - 2편: MediaPipe에서 LiteRT-LM으로 (삽질기)"
subtitle: "구글이 만든 MediaPipe인데 왜 deprecated? 그래서 어디로 갔나"
date: 2026-04-04 18:00:00 +0900
categories: til
tags: android ai llm on-device mediapipe litert gemma
comments: true
---



# [Android] 온디바이스 AI 개발기 - 2편: MediaPipe에서 LiteRT-LM으로 (삽질기)

> 구글이 만든 MediaPipe인데 왜 갑자기 deprecated? 그리고 대안은 뭔가



## 이 글은

1편에서 왜 온디바이스 AI를 쓰는지 정리했다. 이번엔 실제로 엔진을 고르면서 겪은 삽질기다.

처음엔 MediaPipe로 시작했다. 구글이 만든 프레임워크고, 문서도 있고, 예제도 있었다. 그런데 막상 파고들다 보니 상황이 좀 달랐다.



## MediaPipe Tasks GenAI

안드로이드에서 LLM을 온디바이스로 돌리는 방법을 찾다 보면 가장 먼저 나오는 게 MediaPipe다. 구글이 공식으로 밀던 ML 프레임워크고, 여기에 `Tasks GenAI`라는 LLM 추론 모듈이 있었다.

```gradle
implementation("com.google.mediapipe:tasks-genai:0.10.22")
```

모델은 `.task` 포맷을 쓴다. Gemma 모델의 경우 `gemma-1.1-2b-it-cpu-int4.bin` 같은 형태로 배포됐다.

처음엔 이걸로 PoC를 시작했다. 공식 문서 따라서 세팅하고, 모델 로드하고, 추론까지는 됐다.

근데 문제가 있었다.

**GPU 백엔드가 불안정했다.** Adreno GPU에서 OpenCL 가속이 붙어야 빠른데, 특정 기기에서 추론 결과가 이상하게 나오거나 아예 크래시가 났다. CPU로만 돌리면 안정적이지만 너무 느렸다.

그리고 더 큰 문제가 있었다.



## MediaPipe Tasks GenAI, deprecated

찾아보다 보니 구글이 MediaPipe의 LLM 관련 기능을 사실상 deprecated 처리하고 있었다.

공식 마이그레이션 가이드에는 이렇게 나와 있다:

> "The MediaPipe LLM Inference API has been deprecated. Please migrate to the LiteRT-LM SDK."

구글이 MediaPipe를 deprecated시킨 게 아니라, MediaPipe 안의 LLM 추론 부분만 새 SDK로 분리한 것이다. MediaPipe 자체(포즈 추정, 손 감지 같은 기능들)는 계속 유지된다.

LLM 추론만 따로 빼서 **LiteRT-LM**이라는 이름으로 독립 SDK가 됐다.

모델 포맷도 바뀌었다. `.task` → `.litertlm`



## LiteRT가 뭔가

LiteRT는 TensorFlow Lite의 후속 브랜드다.

```
TensorFlow Lite → LiteRT
```

구글이 2024년부터 TFLite를 LiteRT로 리브랜딩하면서, LLM 추론 전용 런타임을 **LiteRT-LM**이라는 이름으로 분리해 출시했다.

핵심 차이는 이렇다:

| | MediaPipe Tasks GenAI | LiteRT-LM |
|---|---|---|
| 상태 | Deprecated | 현재 주력 |
| 모델 포맷 | `.task` | `.litertlm` |
| GPU 백엔드 | 불안정 | OpenCL 안정 |
| 스트리밍 | 지원 | 지원 |
| 최소 SDK | 24 | 24 |

```gradle
// MediaPipe (deprecated)
implementation("com.google.mediapipe:tasks-genai:0.10.22")

// LiteRT-LM (현재)
implementation("com.google.ai.edge.litertlm:litertlm-android:0.9.0")
```



## AICore (ML Kit GenAI)도 있었다

엔진을 고르면서 AICore 기반의 ML Kit GenAI도 테스트해봤다.

```gradle
implementation("com.google.mlkit:genai-summarization:1.0.0-beta1")
```

AICore는 픽셀 기기에 내장된 AI 런타임이다. 모델을 앱이 직접 관리하지 않고 시스템 레벨에서 제공받는 구조라 용량 부담이 없다는 게 장점이다.

근데 테스트 결과가 좋지 않았다.

**실제 측정값 비교 (Samsung Galaxy S26 Ultra, Adreno 830 기준)**

| | LiteRT-LM | ML Kit GenAI (AICore) |
|---|---|---|
| TTFT | **492ms** | 2,600ms |
| 전체 응답 | **2.7초** | 10초 |
| 스트리밍 | ✅ | ❌ |

AICore는 내가 테스트한 `genai-summarization:1.0.0-beta1` 기준으로 스트리밍을 지원하지 않아서 응답이 완성될 때까지 아무것도 표시할 수가 없다. UX 관점에서 치명적이다.

LiteRT-LM은 TTFT가 492ms였다. 첫 글자가 0.5초 안에 나온다는 건 사용자 입장에서 즉각 반응한다는 느낌을 준다.



## 모델은 어디서 구하나

MediaPipe 시절엔 구글이 `.task` 포맷으로 올려두었는데, 지금은 `.litertlm` 포맷으로 전환됐다.

현재는 **Google AI Gallery**에서 배포한다. 올해 초에 공개됐는데, 여기에 Gemma 계열 모델들이 `.litertlm` 포맷으로 올라와 있다.

내가 테스트한 모델은 `gemma3-1b-it-int4.litertlm`이다. int4 양자화 기준 약 1GB 크기다.

참고로 이 시리즈를 작성하는 시점에는 Gemma 4가 이미 나온 상태다. 그런데 `.litertlm` 변환 생태계가 아직 Gemma 3 위주라서 이 시리즈는 Gemma 3 기준으로 작성한다.

앱에 번들링하기엔 너무 크니까 런타임에 다운로드하는 구조로 가야 한다.



## 정리

MediaPipe로 시작했다가 LiteRT-LM으로 갈아탄 이유를 정리하면:

1. **MediaPipe Tasks GenAI가 deprecated** — 구글이 공식적으로 LiteRT-LM으로 마이그레이션하라고 한다
2. **LiteRT-LM이 GPU 안정성이 더 좋다** — OpenCL 백엔드가 안정적으로 동작한다
3. **스트리밍 지원** — TTFT 492ms, 사용자 경험이 확연히 낫다
4. **AICore는 UX 문제** — 스트리밍 없이 10초 대기는 현실적이지 않다

다음 편에서는 LiteRT-LM을 실제로 앱에 세팅하는 방법을 정리한다. Hilt로 의존성 주입하는 구조, GPU 백엔드 초기화, 스트리밍 응답 처리까지.



---

*[3편 - LiteRT-LM 실전 세팅 (Hilt, GPU, 스트리밍)](#) 에서 계속*



#### 참고사이트

- [Google AI Edge - LiteRT-LM Overview](https://ai.google.dev/edge/litert-lm/overview){: class="underlineFill"}
- [MediaPipe LLM Inference - Migration Guide](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/migration_guide){: class="underlineFill"}
- [LiteRT-LM GitHub](https://github.com/google-ai-edge/LiteRT-LM){: class="underlineFill"}
