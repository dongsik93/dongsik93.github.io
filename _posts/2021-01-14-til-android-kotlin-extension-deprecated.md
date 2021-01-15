---
layout: post
title: "[Android] Kotlin extensions deprecated"
subtitle: "kotlin etensions deprecated"
date: 2021-01-15 20:30:00 +0900
categories: til
tags: kotlin android
comments: true

---



# [Android] Kotlin extensions deprecated



>  **Kotlin Extension**
>
> xml의 view와 코드를 연결해주는 findViewById() 메서드 대신 뷰의 id를 통해 뷰 프로퍼티를 바로 적용할 수 있게 해주는 plugin



Kotlin `1.4.20-M2` 에서 다음과 같이 변경 되었다

- [1.4.20-M2](https://github.com/JetBrains/kotlin/releases/tag/v1.4.20-M2){: class="underlineFill"}

- [`KT-42121`](https://youtrack.jetbrains.com/issue/KT-42121){: class="underlineFill"} Deprecate Kotlin Android Extensions compiler plugin
- [`KT-42267`](https://youtrack.jetbrains.com/issue/KT-42267){: class="underlineFill"} `Platform declaration clash` error in IDE when using `kotlinx.android.parcel.Parcelize`
- [`KT-42406`](https://youtrack.jetbrains.com/issue/KT-42406){: class="underlineFill"} Long or infinite code analysis on simple files modification



이에 따라서 kotlin extensions을 걷어내야 하는 상황

프로젝트에서 아래와 같은 코드들을 다 지워줘야 한다

```kotlin
import kotlinx.android.synthetic.main.view
```



저번에 만들었던 CustomView를 한번 수정해보도록 하겠다

<br/>

[[Android] CustomView 만들기](https://dongsik93.github.io/til/2021/01/05/til-android-customview/){: class="underlineFill"}

<br/>

```kotlin
inflate(context, R.layout.seek_bar_view, this).apply {
    seekBarView = seekBar
    icon = vw_icon
    infoLayout = ll_info
}
```

- 위 코드에서 `seekBar`, `vw_icon`, `ll_info` 이 부분이 kotlin extensions을 통한 view를 참조해주는 부분이다

<br/>

- 이 부분을 `Databinding` 을 이용해 수정해 보자
- 데이터 바인딩은 아래 포스팅 참고 !
  - [[Android] Databinding](https://dongsik93.github.io/til/2020/05/02/til-jetpack-databinding/){: class="underlineFill"}

```kotlin
val inflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
val binding = DataBindingUtil.inflate<SeekBarViewBinding>(inflater, R.layout.seek_bar_view), this, false)

seekBarView = binding.seekBar
icon = binding.vwIcon
infoLayout = binding.llInfo
```

- 끝



