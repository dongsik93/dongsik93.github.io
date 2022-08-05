---
layout: post
title: "[Android] Native Degub Symbol"
subtitle: "PlayStore 경고문구 !!"
date: 2022-08-05 18:50:00 +0900
categories: til
tags: android playstore
comments: true


---



# [Android] Native Debug Symbol



> 매번 심사제출 때마다 떨린다. 혹시나 앱이 리젝먹지는 않을까.... 앱을 올렸는데 이상한 파일이 올라가서(실제로 hello world apk를 올린적이 있다😂) 큰일 나지않을까 하는데, 정작 경고문구는 무시하고있던 나를 반성하면서 이 글을 작성한다



![ndk_1.png](/img/in-post/ndk_1.png)



심사 제출할때마다 나타났던 경고창.

문제없이 심사제출이 완료되고, 게시가 되었기 때문에 이제는 무심코 지나치는게 자연스러워졌다.

하지만 이번에 Android13에 관련한 경고창이 하나 더 생기면서 좀 더 알아봐야겠다라는 생각이 들어서 찾아보게 되었다.

일단 구글 자세히 알아보기 버튼을 눌러서 [공식 문서](https://developer.android.com/studio/build/shrink-code#native-crash-support){: class="underlineFill"}를 살펴보자



Gradle Plugin 4.1 이상과 4.0 이하로 나뉘어져있다.

4.1이상을 사용하고 있기 때문에 먼저 봐보자면 앱 수준 gradle파일에 `android.buildTypes.release.ndk.debugSymbolLevel = { **SYMBOL_TABLE** | **FULL** }` 를 추가하라고 나와있다.

이렇게 추가하게 되면 네이티브 디버기 기호 파일을 생성하고 업로드 할 수 있다고 한다.

실제로 앱에 적용해보자



### 예제

앱 수준 build.gradle

```kotlin
// build.gradle (app)
...
buildTypes {
		debug { ... }
		release { 
				...
				debugSymbolLevel 'FULL'
		}
}
// build.gradle.kts
buildTypes {
    release {
        ndk.debugSymbolLevel = "FULL"
    }
}
```

위 처럼 사용하고있는 앱의 환경에 따라서 build.gradle에 추가해주고 빌드를 하면 끝!



### **결과**

![ndk_2.png](/img/in-post/ndk_2.png)

빌드를 하고나면 이렇게 aab 파일 안에 디버그 정보가 들어가있다

다음 스토어 출시때에는 ndk를 추가하고 출시해서 한번 얼마나 유용할지 지켜봐야겠다



