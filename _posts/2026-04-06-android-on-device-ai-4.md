---
layout: post
title: "[Android] 온디바이스 AI 개발기 - 4편: GPU 가속, 어떤 기기에서 되나"
subtitle: "libOpenCL.so가 있어야 GPU가 된다 — 지원 기기와 런타임 감지 방법"
date: 2026-04-06 18:00:00 +0900
categories: til
tags: android ai llm on-device litert gpu opencl adreno
comments: true
---



# [Android] 온디바이스 AI 개발기 - 4편: GPU 가속, 어떤 기기에서 되나

> `Backend.GPU`를 지정하면 끝인 줄 알았다. 그런데 기기마다 다르다.



## 이 글은

3편에서 LiteRT-LM 세팅 코드를 정리했다. GPU 백엔드 초기화 부분에서 fallback 처리가 필요하다고 했는데, 이번엔 왜 그런지, 어떤 기기에서 GPU가 되고 안 되는지를 정리한다.



## GPU 가속의 전제 조건

LiteRT-LM의 GPU 가속은 **OpenCL** 기반이다. OpenCL 연산을 위해 기기에 `libOpenCL.so` 라이브러리가 있어야 한다.

문제는 Android가 OpenCL을 표준 스펙에 포함시키지 않는다는 것이다. iOS가 Metal을 OS 레벨에서 제공하는 것과 달리, Android에서 OpenCL은 **OEM이 알아서 드라이버를 탑재해야 한다**.

즉, GPU 가속 가능 여부는 SoC가 뭐냐보다 OEM이 OpenCL 드라이버를 심었냐에 달려 있다.



## 어떤 기기에서 되나

화이트리스트 방식이 아니라서 공식 목록이 있는 건 아니다. 커뮤니티와 GitHub 이슈에서 확인된 내용을 정리하면 이렇다.

### 잘 되는 기기

| 기기 | 칩셋 | GPU |
|---|---|---|
| Samsung Galaxy S24 Ultra 이상 | Snapdragon 8 Gen 3+ | Adreno |
| Samsung Galaxy S25 / S26 시리즈 | Snapdragon 8 Elite | Adreno |
| Xiaomi 플래그십 (2023년 이후) | Snapdragon 8 Gen 2+ | Adreno |
| Google Pixel 8 이상 | Google Tensor G3+ | Immortalis-G715 |
| MediaTek Dimensity 9200+ 탑재 기기 | Dimensity 9200+ | Mali |

**Snapdragon Adreno 계열이 가장 안정적이다.** 구글 공식 벤치마크 기기도 Snapdragon 8 Gen 3 탑재 기기 기준으로 나온다.

### 안 되거나 불안정한 기기

| 기기 | 이유 |
|---|---|
| 보급형 기기 (A 시리즈 등) | OEM이 OpenCL 드라이버 미탑재 |
| Samsung Galaxy A34 (Exynos 1280) | `clGetCommandBufferInfoKHR` 심볼 오류 |
| Android 에뮬레이터 | OpenCL 미지원 |
| 구형 기기 (2021년 이전) | OpenCL 버전 낮거나 미탑재 |

Samsung Exynos 계열은 NPU 지원이 로드맵에 있긴 한데 아직 정식 지원 전이다.



## libOpenCL.so를 선택적으로 로드하려면

GPU를 쓰려면 `AndroidManifest.xml`에 OpenCL 라이브러리를 선택적으로 로드하도록 설정해야 한다.

```xml
<!-- AndroidManifest.xml -->
<application ...>
    <uses-native-library
        android:name="libOpenCL.so"
        android:required="false" />
    <uses-native-library
        android:name="libvndksupport.so"
        android:required="false" />
</application>
```

`android:required="false"`가 핵심이다. 이걸 `true`로 하면 OpenCL이 없는 기기에서 앱 자체가 설치되지 않는다.



## 런타임에 GPU 지원 여부 확인

앱 실행 시점에 GPU를 지원하는지 확인하는 방법은 두 가지다.

### 방법 1: try-catch로 GPU 초기화 시도

가장 단순한 방법이다. GPU 초기화를 시도하고, 실패하면 CPU로 떨어진다.

```kotlin
private suspend fun resolveBackend(): Backend {
    return try {
        val testOptions = LlmInference.LlmInferenceOptions.builder()
            .setModelPath(modelPath)
            .setMaxTokens(1)
            .setPreferredBackend(Backend.GPU)
            .build()
        LlmInference.createFromOptions(context, testOptions).also { it.close() }
        Backend.GPU
    } catch (e: Exception) {
        Backend.CPU
    }
}
```

초기화 시도 자체가 무거운 작업이라 실용적이지 않을 수 있다.

### 방법 2: TfLiteGpu API로 사전 확인

```kotlin
// 의존성 추가 필요
// implementation("com.google.android.gms:play-services-tflite-gpu:16.2.0")

TfLiteGpu.isGpuDelegateAvailable(context)
    .addOnSuccessListener { gpuAvailable ->
        val backend = if (gpuAvailable) Backend.GPU else Backend.CPU
        initializeEngine(backend)
    }
    .addOnFailureListener {
        initializeEngine(Backend.CPU)
    }
```

LiteRT-LM과 별개의 라이브러리지만, GPU 지원 여부를 가볍게 사전 확인할 수 있다.

실용적인 접근은 **앱 첫 실행 시 GPU 가능 여부를 확인하고 결과를 로컬에 저장**, 이후 실행부터는 저장된 값을 사용하는 것이다.

```kotlin
// DataStore나 SharedPreferences에 캐싱
val cachedBackend = preferences.getBoolean("gpu_available", false)
val backend = if (cachedBackend) Backend.GPU else Backend.CPU
```



## 실제로 어떤 차이가 나나

내가 직접 측정한 수치다. 모델은 `gemma3-1b-it-int4.litertlm` 기준.

| 백엔드 | TTFT | 전체 응답 |
|---|---|---|
| GPU (Adreno 830) | **492ms** | **2.7초** |
| CPU | 수 초 이상 | 10~20초 이상 |

GPU와 CPU 차이가 5~10배 이상 난다. CPU로 돌리면 UX가 사실상 불가능한 수준이다.

그래서 **GPU를 지원하지 않는 기기에서는 기능 자체를 비활성화하는 게 현실적인 선택**이다. CPU로 억지로 돌리는 것보다, 지원 기기에서만 기능을 노출하는 게 낫다.



## 정리

- LiteRT-LM GPU 가속은 `libOpenCL.so` 존재 여부에 달려 있다
- Android는 OpenCL을 표준 제공하지 않아서 기기마다 다르다
- Snapdragon Adreno 계열 플래그십(2022년 이후)은 대체로 잘 된다
- `AndroidManifest.xml`에 `android:required="false"` 설정 필수
- GPU 미지원 기기에서는 기능을 비활성화하는 게 현실적
- GPU vs CPU 성능 차이는 TTFT 기준 5~10배 이상

다음 편에서는 실제로 여러 작업을 돌려보면서 1B 모델이 잘 되는 것과 안 되는 것을 직접 비교해본다. 요약, 분류, 번역 등 태스크별로 결과가 꽤 다르다.



---

*[5편 - 온디바이스 AI 한계 실험기 (요약 / 분류 / 번역 직접 비교)](#) 에서 계속*



#### 참고사이트

- [GPU acceleration with LiteRT](https://ai.google.dev/edge/litert/next/gpu){: class="underlineFill"}
- [LiteRT-LM GitHub - Issue #886 (OpenCL undefined symbol)](https://github.com/google-ai-edge/LiteRT/issues/886){: class="underlineFill"}
- [litert-community Android 모델 컬렉션](https://huggingface.co/collections/litert-community/android-models){: class="underlineFill"}
- [AndroidManifest uses-native-library](https://developer.android.com/reference/android/R.attr#required){: class="underlineFill"}
