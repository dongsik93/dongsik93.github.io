---
layout: post
title: "[Android] Gradle BuildType"
subtitle: "BuildType.kt 뜯어보기"
date: 2022-12-05 18:00:00 +0900
categories: til
tags: android gradle
comments: true

---



# [Android] Gradle BuildType

> build.gradle을 Groovy에서 KTS로 마이그레이션을 하면서 gradle에 대한 무지함을 깨닫고.. 프로젝트 시작할 때 말고는 이 빌드 스크립트를 들여다보지 않았구나..라는 생각에 다시 한번 공부의 필요성을 느끼고 시작한다



먼저 build.gradle내의 `buildTypes` 에 대해 알아보자 (KTS)

```kotlin
// BuildType.kt
package com.android.build.api.dsl

import org.gradle.api.Incubating
import org.gradle.api.Named
import org.gradle.api.plugins.ExtensionAware

/** DSL object to configure build types. */
@Incubating
interface BuildType : Named, VariantDimension, ExtensionAware {

    var isTestCoverageEnabled: Boolean
    var isPseudoLocalesEnabled: Boolean
    var isJniDebuggable: Boolean
    var isRenderscriptDebuggable: Boolean
    var renderscriptOptimLevel: Int
    var isMinifyEnabled: Boolean
    var isShrinkResources: Boolean
    val matchingFallbacks: MutableList<String>

		--------------------------------------------------------------------------------

    @get:Incubating
    val postprocessing: PostProcessing
    @Incubating
    fun postprocessing(action: PostProcessing.() -> Unit)

    @Incubating
    fun initWith(that: BuildType)

    @Incubating
    @Deprecated("Replaced with property matchingFallbacks")
    fun setMatchingFallbacks(vararg fallbacks: String)

    @Incubating
    @Deprecated("Replaced with property matchingFallbacks")
    fun setMatchingFallbacks(fallbacks: List<String>)

    @get:Incubating
    @set:Incubating
    @Deprecated("Changing the value of isZipAlignEnabled no longer has any effect")
    var isZipAlignEnabled: Boolean
}
```

@Incubating 어노테이션이 달려있는것들은 **기능이 현재 진행 중이며 언제든지 변경될 수 있다라는걸 의미한다.**



먼저 안달려있는것들을 살펴보자

- isTestCoverageEnabled
    - 빌드 유형에 대해 테스트 범위를 사용할 수 있는지에 대한 여부
- isPseudoLocalesEnabled
    - 플러그인이 pseudoLocale 에 대한 리소스를 생성할지 여부
    - true로 설정하면 플러그인은 pseudoLocale 에 대한 리소스를 생성하고 연결된 디바이스의 언어 기본 설정(en-XA 및 ar-XB)에서 사용할 수 있도록 한다
- isJniDebuggable
    - Jni는 Java Native Interfacre의 약자로서 디버깅 가능한 네이티브 코드를 사용하여 APK를 생성하도록 구성되었는지에 대한 여부
- isRenderscriptDebuggable
    - RenderScript는 이기종 하드웨어를 활용하는 가속용 API를 제공하는 모바일 장치용 Android 운영 체제의 구성 요소로서 이에 대한 여부
- renderscriptOptimLevel
    - RenderScript 컴파일러에서 사용할 최적화 수준
- isMinifyEnabled
    - 코드 축소를 사용할지에 대한 여부
- isShrinkResources
    - 리소스 축소를 사용할지에 대한 여부
- matchingFallbacks
    - 로컬 모듈 종속성과의 직접적인 빌드 유형 일치가 불가능할 때 플러그인이 사용하려고 시도해야 하는 빌드 유형의 정렬된 목록을 지정한다



Incubating으로 마킹되어있는것들도 한번 살펴보자

- initWIth
    - 해당 타입을 기반으로 새 타입을 생성하겠다는 의미
    - 지정된 빌드 유형에서 모든 속성을 복사한다



실제로 이렇게 사용할 수 있다

```kotlin
buildTypes {
    release {
        isMinifyEnabled = true
				isShrinkResources = true
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }

		debug {
				...
		}
}
```



위의 예시처럼 relase, debug로 나누어 할 수 있는 이유는

CommonExtension에 extension이 정의되어 있기 때문이다

```kotlin
// CommonExtension.kt
interface CommonExtension<
        BuildFeaturesT : BuildFeatures,
        BuildTypeT : BuildType,
        DefaultConfigT : DefaultConfig,
        ProductFlavorT : ProductFlavor> {
    @Incubating
    fun NamedDomainObjectContainer<BuildTypeT>.debug(action: BuildTypeT.() -> Unit)

    @Incubating
    fun NamedDomainObjectContainer<BuildTypeT>.release(action: BuildTypeT.() -> Unit)
}
```

