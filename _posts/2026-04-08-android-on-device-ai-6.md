---
layout: post
title: "[Android] 온디바이스 AI 개발기 - 6편: Play Asset Delivery로 모델 배포하기"
subtitle: "1GB 모델을 앱에 어떻게 넣나 — 구글이 AI Gallery로 직접 보여준 방법"
date: 2026-04-08 18:00:00 +0900
categories: til
tags: android ai llm on-device litert gemma play-asset-delivery dynamic-delivery
comments: true
---



# [Android] 온디바이스 AI 개발기 - 6편: Play Asset Delivery로 모델 배포하기

> 1GB짜리 모델 파일, 앱에 번들링할 수는 없다. 그럼 어떻게 배포하나.



## 이 글은

5편에서 1B 모델의 실제 한계를 정리했다. 이번엔 모델 파일 자체를 어떻게 앱에 제공하는지를 다룬다.

`gemma3-1b-it-int4.litertlm`은 약 1GB다. APK나 AAB에 번들링하는 건 처음부터 불가능하다. AAB의 base module 압축 다운로드 크기 제한이 200MB이기 때문이다.

방법은 크게 두 가지다.

1. **직접 다운로드** — 앱 서버나 CDN에서 직접 받아오기
2. **Play Asset Delivery** — Google Play 인프라를 활용해 배포



## Google AI Gallery를 보면 답이 보인다

얘기를 시작하기 전에 Google AI Gallery 얘기를 잠깐 하고 싶다.

Google AI Gallery는 LiteRT-LM 모델들을 직접 체험해볼 수 있는 앱인데, 흥미로운 UX가 있다. **사용자가 모델을 직접 선택하고 다운로드**할 수 있다.

Gemma 1B, Gemma 3B, Gemma 4B... 모델마다 용량이 다르고, 사용자가 원하는 걸 골라서 받는 구조다.

이게 그냥 UX 선택이 아닌 것 같다. 구글이 직접 만든 레퍼런스 앱이 이 방식을 채택했다는 건, **온디바이스 AI 모델은 이렇게 배포해라** 는 가이드를 행동으로 보여주는 거라고 생각한다. 공식 문서보다 직관적인 레퍼런스다.

그리고 이 구조를 구현하기에 딱 맞는 게 Play Asset Delivery다.



## Play Asset Delivery란

Play Asset Delivery(PAD)는 Google Play 인프라를 통해 대용량 에셋을 런타임에 배포할 수 있는 기능이다. 게임에서 대용량 리소스를 나눠서 제공하던 방식인데, LLM 모델 배포에도 그대로 쓸 수 있다.

**직접 다운로드 vs Play Asset Delivery 비교**

| | 직접 다운로드 | Play Asset Delivery |
|---|---|---|
| 인프라 | 직접 구축 (S3, CDN 등) | Google Play 인프라 |
| 비용 | 트래픽 비용 발생 | Play 정책 내 무료 |
| 무결성 검증 | 직접 구현 | 자동 처리 |
| 델타 업데이트 | 직접 구현 | 지원 |
| 구현 복잡도 | 낮음 | 중간 |
| 오프라인 설치 | 불가 | 설치 시 포함 가능 |
| pack당 최대 크기 | 제한 없음 (서버 설정에 따라) | **1.5GB** |

모델 업데이트가 잦거나 여러 모델을 제공할 계획이라면 PAD가 유리하다.



## PAD 구성 방식

PAD는 에셋 전달 방식에 따라 세 가지로 나뉜다.

```
install-time  → 앱 설치 시 함께 설치 (용량 제한 있음)
fast-follow   → 설치 직후 자동 다운로드
on-demand     → 앱 실행 중 필요할 때 다운로드
```

모델 파일은 `on-demand`가 적합하다. 사용자가 AI 기능을 사용하려 할 때 그때 받는 구조다. AI Gallery처럼 여러 모델을 제공한다면 사용자가 선택한 모델만 받으면 된다.



## 구현

### 1. asset pack 모듈 생성

프로젝트에 asset pack 전용 모듈을 추가한다.

```
app/
ai-model-pack/          ← 새 모듈
  build.gradle.kts
  src/
    main/
      assets/
        gemma3-1b-it-int4.litertlm
```

```kotlin
// ai-model-pack/build.gradle.kts
plugins {
    id("com.android.asset-pack")
}

assetPack {
    packName.set("ai_model_pack")
    dynamicDelivery {
        deliveryType.set("on-demand")
    }
}
```

```kotlin
// app/build.gradle.kts
android {
    assetPacks += [":ai-model-pack"]
}
```

### 2. 의존성 추가

```kotlin
// app/build.gradle.kts
dependencies {
    implementation("com.google.android.play:asset-delivery-ktx:2.2.2")
}
```

### 3. 다운로드 요청

```kotlin
class ModelDownloader(private val context: Context) {

    private val assetPackManager = AssetPackManagerFactory.getInstance(context)

    fun downloadModel(): Flow<ModelDownloadState> = callbackFlow {
        val packName = "ai_model_pack"

        val listener = AssetPackStateUpdateListener { state ->
            when (state.status()) {
                AssetPackStatus.DOWNLOADING -> {
                    val progress = state.bytesDownloaded() * 100 / state.totalBytesToDownload()
                    trySend(ModelDownloadState.Downloading(progress.toInt()))
                }
                AssetPackStatus.COMPLETED -> {
                    trySend(ModelDownloadState.Completed(getModelPath(packName)))
                    close()
                }
                AssetPackStatus.FAILED -> {
                    trySend(ModelDownloadState.Failed(state.errorCode()))
                    close()
                }
                AssetPackStatus.REQUIRES_USER_CONFIRMATION -> {
                    // 대용량 다운로드 시 사용자 확인 필요
                    assetPackManager.showConfirmationDialog(activity)
                }
                else -> Unit
            }
        }

        assetPackManager.registerListener(listener)
        assetPackManager.fetch(listOf(packName))

        awaitClose { assetPackManager.unregisterListener(listener) }
    }

    private fun getModelPath(packName: String): String {
        val location = assetPackManager.getPackLocation(packName)
        return "${location?.assetsPath()}/gemma3-1b-it-int4.litertlm"
    }
}

sealed interface ModelDownloadState {
    data class Downloading(val progress: Int) : ModelDownloadState
    data class Completed(val modelPath: String) : ModelDownloadState
    data class Failed(val errorCode: Int) : ModelDownloadState
}
```

### 4. 이미 다운로드됐는지 확인

```kotlin
suspend fun isModelReady(): Boolean {
    val location = assetPackManager.getPackLocation("ai_model_pack")
    return location != null
}
```

앱 시작 시점에 이미 다운로드된 모델이 있으면 바로 초기화하고, 없으면 다운로드 화면을 보여주면 된다.



## 여러 모델을 선택할 수 있게 하려면

AI Gallery처럼 사용자가 모델을 선택하는 구조라면, 모델마다 asset pack을 분리한다.

```
ai-model-gemma-1b/     → "ai_model_gemma_1b"
ai-model-gemma-3b/     → "ai_model_gemma_3b"
ai-model-gemma-4b/     → "ai_model_gemma_4b"
```

사용자가 선택한 모델의 pack만 `fetch()`하면 된다. 나머지는 다운로드하지 않는다.

이 구조가 AI Gallery가 보여주는 방식이고, 실제로 LLM을 앱에 배포할 때 가장 현실적인 방법이기도 하다. 구글이 직접 만든 앱이 이렇게 한다는 건, 이 패턴을 권장한다는 신호로 읽힌다.



## 주의할 점

**테스트 환경**

PAD는 Google Play를 통해 배포되는 구조라 로컬 개발 환경에서 테스트하기 까다롭다. 개발 중에는 adb로 모델을 직접 밀어 넣고, PAD 연동은 내부 테스트 트랙에서 별도로 검증하는 게 현실적이다.

```bash
adb push gemma3-1b-it-int4.litertlm /data/local/tmp/
```

**용량 안내**

1GB 다운로드를 사용자에게 예고 없이 시작하면 안 된다. Wi-Fi 환경 확인, 용량 안내, 사용자 동의 흐름이 필요하다.

**저장 공간 확인**

다운로드 전 기기 여유 공간을 확인하고 부족하면 안내해줘야 한다.



## 정리

- 1GB 모델은 번들링 불가 → 런타임 배포 필요
- Play Asset Delivery: Google Play 인프라 활용, 무결성 검증 자동
- `on-demand` 방식으로 사용자가 필요할 때 다운로드
- 여러 모델 제공 시 pack 분리 → 사용자가 선택한 것만 받는 구조
- AI Gallery가 이 패턴의 레퍼런스 — 구글이 직접 보여주는 방법



---

*이 시리즈는 여기서 마무리. 1편부터 읽어주신 분들 감사합니다.*



#### 참고사이트

- [Play Asset Delivery - Android Developers](https://developer.android.com/guide/playcore/asset-delivery){: class="underlineFill"}
- [Google Play 앱 크기 제한](https://support.google.com/googleplay/android-developer/answer/9859372){: class="underlineFill"}
- [Google AI Gallery](https://aistudio.google.com/gallery){: class="underlineFill"}
