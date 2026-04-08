---
layout: post
title: "[Android] 온디바이스 AI 삽질기 - 6편: LiteRT-LM으로 갈아타는데 Gemma 4가 나왔다"
subtitle: "파인튜닝 열심히 했더니 세상이 바뀌어 있었다"
date: 2026-03-25 18:00:00 +0900
categories: til
tags: android ai llm on-device gemma litert mediapipe migration
comments: true
---



# [Android] 온디바이스 AI 삽질기 - 6편: LiteRT-LM으로 갈아타는데 Gemma 4가 나왔다

> 삽질의 끝에서 더 큰 삽질이 기다리고 있었다



## MediaPipe로 돌아가긴 했는데

5편에서 `.task` 변환까지 마쳤다. 기기에서 동작도 했다. 그런데 결과가 영 마음에 안 들었다.

**TTFT 2~3초. 전체 응답 10초. 스트리밍 없음.**

응답이 나올 때까지 화면이 멈춰있었다. 사용자 입장에서 보면 앱이 죽었나, 싶은 경험이다.

GPU 가속을 붙이면 해결될 것 같아서 시도했다.

```kotlin
.setPreferredBackend(LlmInference.Backend.GPU)
```

```
VRAM 부족: 필요 1.12GB > 가용 0.87GB
```

int8 모델이 1GB가 넘어서 GPU 메모리에 안 들어갔다. 테스트 기기가 Galaxy Z Flip5였는데, 폼팩터 특성상 VRAM이 넉넉하지 않았다.

막혔다. 그리고 찾다 보니 그제야 보였다.

**MediaPipe LLM Inference API가 deprecated되고 있었다.**



## LiteRT-LM이 뭔데

구글이 LLM 추론 부분을 MediaPipe에서 떼어내서 **LiteRT-LM**이라는 독립 SDK로 만들고 있었다. 모델 포맷도 `.task` → `.litertlm`으로 바뀌었다.

```gradle
// MediaPipe (deprecated)
implementation("com.google.mediapipe:tasks-genai:0.10.33")

// LiteRT-LM (현재)
implementation("com.google.ai.edge.litertlm:litertlm-android:0.9.0")
```

API도 완전히 달라졌다. `LlmInference` → `Engine`, `generateResponseAsync` → `createConversation().sendMessageAsync()`.

그리고 결정적으로 **스트리밍을 Flow로 지원**한다.

일단 붙여보기로 했다.



## LiteRT-LM 세팅 삽질

### 삽질 1: Kotlin 버전 충돌

`litertlm-android:0.9.0`이 Kotlin 2.3.0으로 컴파일되어 있었다. 프로젝트 Kotlin 버전이 낮으면 빌드가 깨진다.

```
build-logic:convention:compileKotlin 실패
```

Kotlin, AGP, Gradle 버전을 전부 올려야 했다.

```
kotlin: 2.1.20 → 2.3.0
agp: 8.9.2 → 8.13.2
gradle: 8.11.1 → 8.13
```

### 삽질 2: GPU가 또 안 됨

모델을 `.litertlm` 포맷(`gemma3-1b-it-int4.litertlm`, 584MB)으로 바꾸고 GPU 백엔드를 시도했다.

```
Can not find OpenCL library on this device
```

Galaxy Z Flip5에 OpenCL 라이브러리가 없었다. GPU 가속 자체가 불가능한 기기였다.

CPU로 돌리면? int4라서 조금 낫긴 한데 여전히 느렸다.

```
Z Flip5 CPU: 첫 실행 12초 (XNNPACK 캐시 빌드 포함), 이후 7초
```

### 삽질 3: 프롬프트 래핑 이중 적용

```kotlin
// 이렇게 하면 안 됨
val prompt = "<start_of_turn>user\n...<end_of_turn>\n<start_of_turn>model\n"
conversation.sendMessageAsync(AiMessage.of(prompt))
```

`AiMessage.of()`를 쓰면 엔진이 chat template을 자동으로 감싸준다. 직접 `<start_of_turn>`을 넣으면 두 번 들어가서 모델이 이상한 출력을 낸다.

```kotlin
// 이렇게 해야 함
conversation.sendMessageAsync(plainTextPrompt)
```



## 플래그십 기기에서 테스트

Z Flip5가 아닌 Galaxy S26 Ultra (Snapdragon 8 Elite, Adreno 830)로 테스트했다.

| 기기 | 백엔드 | 응답 시간 |
|---|---|---|
| Galaxy Z Flip5 | CPU | 7초 (엔진 재사용 시) |
| Galaxy S26 Ultra | CPU | 5초 |
| Galaxy S26 Ultra | GPU | **2.8초** |

GPU에서 TTFT 492ms, 전체 2.8초. 스트리밍으로 첫 글자가 0.5초 안에 나오니까 체감이 완전히 달랐다.

목표였던 3초 이내 달성.



## 요약 품질 확인

베이스 모델(`gemma3-1b-it-int4`)로 돌려보니 품질도 나쁘지 않았다.

| 입력 | 결과 |
|---|---|
| 한국어 일반 텍스트 | 정확한 요약 |
| 영어/한국어 혼합 | 가끔 hallucination, 무한 반복 |
| 항목 나열형 텍스트 | 마크다운 리스트로 출력 |

hallucination 문제는 최대 토큰 수 제한으로 막았다. 마크다운 출력은 프롬프트에 글머리 기호나 목록 없이를 명시해서 해결했다.

```
다음 내용을 글머리 기호나 목록 없이 2~3문장의 자연스러운 한국어 문장으로만 요약해주세요.
```



## 그런데 이 시점에 Gemma 4가 나왔다

LiteRT-LM 세팅을 마무리하고 있던 타이밍에 구글이 **Google AI Gallery**를 공개했다.

그리고 거기 올라온 모델 목록에 **Gemma 4**가 있었다.

Gemma 3 1B를 몇 주 동안 파인튜닝하고, 변환하고, MediaPipe deprecated인 거 알고 LiteRT-LM으로 갈아탔더니 — 모델 자체가 한 세대 넘어가 있었다.

내가 파인튜닝한 Gemma 3 1B는요?

현타가 이중으로 왔다.



## 그래서 파인튜닝이 의미 없었나

결론부터 말하면, **의미는 있었다.**

파인튜닝 없이 베이스 모델로 돌려보니 출력 포맷이 들쑥날쑥하고 요약이 아닌 대화를 시작하려는 경우가 있었다. 파인튜닝한 모델은 지시를 훨씬 잘 따랐다.

다만 **파인튜닝 모델을 `.litertlm`으로 변환하는 공식 도구가 아직 없었다.** `.task` 포맷으로는 변환했는데, `.litertlm`은 구글 내부 툴이 필요한 상태였다. (AI Edge Portal 접근 필요)

그래서 베이스 모델을 쓰기로 했는데, 여기서 `litert-community/Gemma3-1B-IT`를 발견했다.

HuggingFace에 올라온 커뮤니티 변환 모델인데, `gemma3-1b-it-int4.litertlm` 포맷으로 이미 변환이 되어 있었다. 크기는 584MB. 내가 파인튜닝해서 `.task`로 변환한 모델이 1GB였는데 반토막이다.

int4 양자화 덕분에 용량이 줄었고, `.litertlm` 포맷이라 LiteRT-LM에서 바로 쓸 수 있었다.

그럼 내가 파인튜닝한 모델이 이 베이스 모델보다 실제로 더 나은가? 솔직히 확신이 서지 않았다. 단순 요약 태스크에서는 파인튜닝 효과가 있었지만, int4로 양자화된 베이스 모델과 비교하면 차이가 크지 않을 수도 있다. 파인튜닝 모델을 `.litertlm`으로 변환할 수 있게 되면 그때 제대로 비교해볼 생각이다.

일단 지금은 이 베이스 모델로 진행하기로 했다.



## 정리

**파인튜닝 시리즈 전체 흐름**

```
모델 선정 (Gemma 3 1B)
    ↓
합성 데이터 5만건 생성 (Gemini CLI, 하루 소요)
    ↓
M1 Mac Mini 16GB로 QLoRA 파인튜닝
    ↓
.safetensors → .task 변환 (삽질 3종 세트)
    ↓
MediaPipe로 기기 테스트 → 느림, deprecated
    ↓
LiteRT-LM 전환 → GPU에서 TTFT 492ms
    ↓
파인튜닝 모델 .litertlm 변환 도구 없음
    ↓
litert-community/Gemma3-1B-IT 발견 (int4, 584MB)
    ↓
이 타이밍에 Gemma 4 + AI Gallery 등장
    ↓
현타 x2
```

돌아보면 이 모든 삽질이 헛된 건 아니다. 각 단계에서 왜 이렇게 동작하는지, 어디서 막히는지를 직접 부딪히면서 이해하게 됐다. 그리고 LiteRT-LM이 어떻게 동작하는지를 제대로 파악하게 된 것도 이 과정 덕분이다.

다음 시리즈에서는 LiteRT-LM 자체를 처음부터 정리한다.



---

*LiteRT-LM 시리즈로 이어집니다 →*
*[LiteRT-LM 1편 - 왜 온디바이스인가](/2026/04/03/android-on-device-ai-1/)*



#### 참고사이트

- [LiteRT-LM GitHub](https://github.com/google-ai-edge/LiteRT-LM){: class="underlineFill"}
- [litert-community/Gemma3-1B-IT - HuggingFace](https://huggingface.co/litert-community/Gemma3-1B-IT){: class="underlineFill"}
- [litert-community Android 모델 컬렉션](https://huggingface.co/collections/litert-community/android-models){: class="underlineFill"}
- [Google AI Gallery](https://aistudio.google.com/gallery){: class="underlineFill"}
