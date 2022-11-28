---
layout: post
title: "[Android] Reduce App Size"
subtitle: "Apk Analyze를 통한 app size 줄이기"
date: 2022-11-28 22:00:00 +0900
categories: til
tags: android apk size
comments: true

---



# [Android] Reduce App Size

> 너무너무너무너무 큰 앱 사이즈를 한번 줄여보자
>
> 굉장히 바보였다고 한다...



일단 앱 사이즈를 줄이기 전 앱 사이즈를 Android Studio의 APK Analyze를 통해 알아보자



![app_size_1.png](/img/in-post/app_size_1.png)

이상하다… 분명 이 앱은 기본적인 CRUD기능만 있는.. 앱 사이즈가 크면 안되는 앱인데 무려 76.9MB사이즈이다.

기능이 굉장히 많이 들어간, 주 서비스 앱의 경우 사이즈가 77.5MB인데 비교해보면 이해가 안되었기 때문에 알아보기 시작했다.

자세히 살펴보면 res에서 68.9MB.. 리소스파일이 비대하게 큰 걸 볼 수 있다.

어디서 많이 잡아먹고 있는지 한번 들어가보자



![app_size_2.png](/img/in-post/app_size_2.png)

놀랍게도 폰트가 원인이였다.

사용하고 있는 폰트는 무료 서체인 Spoqahansansneo인데, 하나당 7MB정도 하는 사이즈를 자랑하고 있다.

스포카 한 산스 네오 홈페이지에 들어가보면 **오리지날**과 **서브셋** 두 가지를 모두 다운 받을 수 있는데, 이 차이를 모르고 그냥 오리지날을 다운 받아서 쓴 결과이다.

서브셋 폰트는 폰트 파일에서 불필요한 글자를 제거하고 사용할 글자를 남겨둔 폰트로, 오리지날에 비해 경량화된 폰트이다.

문제가 되는 원인을 찾았으니, 해당 오리지날 폰트를 제거하고 서브셋으로 교체해서 앱 용량을 줄여보자.



![app_size_3.png](/img/in-post/app_size_3.png)

폰트를 서브셋으로 교체하니 76MB에 달하던 앱 용량이 12MB로 줄었다…

(사이즈가 큰 폰트는 OOM을 유발할 수도 있다 [[Android] Custom Font 적용 시 OutOfMemory 발생 및 해결](https://greedy0110.tistory.com/98){: class="underlineFill"})



사실 글을 쓰려는 의도는 폰트가 아니라 저 dex를 줄이려는 의도였는데 어쨌든, 이제 저 3개로 나뉘어진 dex 파일을 처리해보자

```kotlin
buildTypes {
    release {
        isMinifyEnabled = false
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
}
```

현재 앱수준 gradle.kts에 설정되어있는 세팅이다.

isMinifyEnabled가 false로 되어있는데, 이 설정은 **R8**이라 불리는 세번째 컴파일러로서 선택적으로 활성화하여 **코드 최적화 및 코드 축소**를 수행 할 수 있다.

해당 옵션을 켜서 얼마나 코드 최적화와 코드 축소가 됐는지 한번 알아보자



![app_size_4.png](/img/in-post/app_size_4.png)

폰트 정리 후 12MB에 달하던 앱 용량이 다시 6.7MB로 줄었다.

여기서 shrinkResources라는 설정을 true로 바꿔주면 리소스까지 축소를 추가로 해줄 수 있다.



#### 참고사이트

- [D8 과 R8](https://www.charlezz.com/?p=43966){: class="underlineFill"}

- [Spoqa Han Sans Neo - Spoqa 기술블로그](https://spoqa.github.io/spoqa-han-sans/){: class="underlineFill"}