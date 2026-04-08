---
layout: post
title: "[Android] 온디바이스 AI 개발기 - 3편: LiteRT-LM 실전 세팅 (Hilt, GPU, 스트리밍)"
subtitle: "의존성 주입부터 GPU 백엔드 초기화, 스트리밍 응답 처리까지"
date: 2026-04-05 18:00:00 +0900
categories: til
tags: android ai llm on-device litert gemma hilt gpu streaming
comments: true
---



# [Android] 온디바이스 AI 개발기 - 3편: LiteRT-LM 실전 세팅 (Hilt, GPU, 스트리밍)

> 설치하고 모델 불러오고 응답 받기까지, 실제로 어떻게 짜는지



## 이 글은

2편에서 MediaPipe → LiteRT-LM으로 넘어온 이유를 정리했다. 이번엔 실제로 앱에 세팅하는 코드를 정리한다.

- 의존성 추가
- Hilt로 LLM 엔진 주입
- GPU 백엔드 초기화
- 스트리밍 응답 처리



## 의존성 추가

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.google.ai.edge.litertlm:litertlm-android:0.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-guava:1.8.1")
}
```

`kotlinx-coroutines-guava`는 LiteRT-LM이 내부적으로 `ListenableFuture`를 쓰기 때문에 필요하다. `await()`로 코루틴에서 편하게 쓸 수 있다.



## 모델 파일 준비

모델은 Google AI Gallery에서 받는다. 테스트엔 `gemma3-1b-it-int4.litertlm`을 썼다.

개발/테스트 단계에서는 adb로 기기에 직접 밀어 넣는 게 편하다.

```bash
adb push gemma3-1b-it-int4.litertlm /data/local/tmp/
```

배포용이라면 런타임 다운로드 구조로 가야 한다. 1GB짜리를 앱에 번들링할 수는 없으니까.



## LLM 엔진 인터페이스 정의

Hilt로 주입할 수 있도록 인터페이스로 추상화한다.

```kotlin
interface LlmEngine {
    suspend fun initialize()
    fun generateResponse(prompt: String): Flow<String>
    fun close()
}
```

`generateResponse`를 `Flow<String>`으로 정의한 이유는 스트리밍 응답을 토큰 단위로 내보내기 위해서다.



## LiteRT-LM 구현체

```kotlin
class LiteRtLmEngine(
    private val modelPath: String,
) : LlmEngine {

    private var session: LlmInference? = null

    override suspend fun initialize() {
        val options = LlmInference.LlmInferenceOptions.builder()
            .setModelPath(modelPath)
            .setMaxTokens(1024)
            .setPreferredBackend(Backend.GPU)
            .build()

        session = withContext(Dispatchers.IO) {
            LlmInference.createFromOptions(context, options)
        }
    }

    override fun generateResponse(prompt: String): Flow<String> = callbackFlow {
        val session = checkNotNull(session) { "LlmEngine not initialized" }

        session.generateResponseAsync(prompt) { partialResult, done ->
            trySend(partialResult ?: "")
            if (done) close()
        }

        awaitClose()
    }

    override fun close() {
        session?.close()
        session = null
    }
}
```

`generateResponseAsync`의 콜백을 `callbackFlow`로 감싸서 Flow로 변환했다. `done`이 `true`가 되면 채널을 닫는다.



## Hilt 모듈 구성

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object LlmEngineModule {

    @Provides
    @Singleton
    fun provideLlmEngine(): LlmEngine {
        return LiteRtLmEngine(
            modelPath = "/data/local/tmp/gemma3-1b-it-int4.litertlm"
        )
    }
}
```

`@Singleton`으로 등록한다. LLM 세션은 초기화 비용이 크기 때문에 앱 생명주기 동안 하나만 유지하는 게 맞다.



## GPU 백엔드 초기화

`Backend.GPU`를 지정하면 OpenCL 기반 GPU 가속이 붙는다. 단, GPU를 지원하지 않는 기기에서는 초기화가 실패한다.

안전하게 처리하려면 fallback 로직이 필요하다.

```kotlin
private suspend fun createSession(modelPath: String): LlmInference {
    return try {
        val gpuOptions = LlmInference.LlmInferenceOptions.builder()
            .setModelPath(modelPath)
            .setMaxTokens(1024)
            .setPreferredBackend(Backend.GPU)
            .build()
        LlmInference.createFromOptions(context, gpuOptions)
    } catch (e: Exception) {
        // GPU 초기화 실패 시 CPU로 fallback
        val cpuOptions = LlmInference.LlmInferenceOptions.builder()
            .setModelPath(modelPath)
            .setMaxTokens(1024)
            .setPreferredBackend(Backend.CPU)
            .build()
        LlmInference.createFromOptions(context, cpuOptions)
    }
}
```

GPU 지원 여부에 따라 응답 속도 차이가 크다. GPU에서는 TTFT 492ms였는데, CPU에서는 수 초 이상 걸린다.



## ViewModel에서 스트리밍 수신

```kotlin
@HiltViewModel
class AiViewModel @Inject constructor(
    private val llmEngine: LlmEngine,
) : ViewModel() {

    private val _response = MutableStateFlow("")
    val response: StateFlow<String> = _response.asStateFlow()

    fun ask(prompt: String) {
        viewModelScope.launch {
            _response.value = ""
            llmEngine.generateResponse(prompt)
                .collect { token ->
                    _response.value += token
                }
        }
    }
}
```

`StateFlow`에 토큰을 누적해서 UI에 흘려보낸다. 첫 토큰이 오는 순간부터 화면에 글자가 나타나기 시작한다.



## Fragment에서 수신

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.response.collect { text ->
            binding.textResponse.text = text
        }
    }
}
```

`repeatOnLifecycle`로 감싸서 화면이 백그라운드로 가면 수집을 멈춘다.



## 실제로 돌려보면

초기화(`initialize()`)는 앱 시작 시점에 한 번 해두는 게 좋다. 모델 로딩에 몇 초가 걸리기 때문에 사용자가 질문하는 시점에 하면 늦다.

GPU 백엔드 기준으로 측정한 수치:

| 항목 | 측정값 |
|---|---|
| 모델 초기화 | ~3초 |
| TTFT (첫 토큰) | 492ms |
| 전체 응답 (짧은 문장) | 2.7초 |

초기화가 완료되기 전에는 UI에서 로딩 상태를 보여주고, 완료 후에 입력을 받도록 하면 자연스럽다.



## 정리

- `LlmInference` 세션은 `@Singleton`으로 앱 전체에서 하나만 유지
- GPU 초기화 실패 시 CPU로 fallback 처리 필요
- `callbackFlow`로 스트리밍 콜백을 Flow로 변환
- ViewModel에서 토큰 누적, StateFlow로 UI에 흘리기

다음 편에서는 GPU 가속이 실제로 어떤 기기에서 되는지, 지원 여부를 어떻게 확인하는지 정리한다.



---

*[4편 - GPU 가속, 어떤 기기에서 되나](#) 에서 계속*



#### 참고사이트

- [LiteRT-LM Kotlin Getting Started](https://github.com/google-ai-edge/LiteRT-LM/blob/main/docs/api/kotlin/getting_started.md){: class="underlineFill"}
- [kotlinx-coroutines-guava](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-guava/){: class="underlineFill"}
