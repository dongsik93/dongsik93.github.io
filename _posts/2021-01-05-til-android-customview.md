---
layout: post
title: "[Android] CustomView 만들기"
subtitle: "Android CustomView"
date: 2021-01-05 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# [Android] CustomView 만들기 



> 안드로이드에서 기본적으로 제공하는 컴포넌트들을 잘 활용하면 View를 굉장히 쉽고 빠르게 만들 수 있다
>
> 하지만 기본적으로 제공하는 api 이외에 다양한 작업을 해야하는 경우가 많이 생긴다
>
> 또 layout를 만드는데 한 두개의 부분만 바뀌고 동일한 경우도 많이 생기게 되는데 
>
> 이 때 View를 직접 커스터마이징 하게 되면 ctrl+c/crtl+v 코드량도 줄게되고 원하는 view를 만들 수 있게 된다



- 이번 CustomView는 Seekbar를 상속받은 SeekBarView를 만들어 볼 생각이다

- [Android SeekBar](https://developer.android.com/reference/android/widget/SeekBar){: class="underlineFill"}



### 1. Layout xml 생성

- 가장 먼저 CustomView에 사용할 layout을 그려준다



**seek_bar_view.xml**

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/llContainer"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <LinearLayout
        android:id="@+id/ll_info"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_marginBottom="-3dp"
        android:gravity="center"
        android:orientation="vertical">

        <View
            android:id="@+id/vw_icon"
            android:layout_width="10dp"
            android:layout_height="10dp" />
    </LinearLayout>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <SeekBar
            android:id="@+id/seekBar"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:max="100"
            android:splitTrack="false" />
    </LinearLayout>
</LinearLayout>
```

- 내가 만들고자하는 SeekBarView는 SeekBar가 가지고 있는 Thumb 위에 텍스트나, 원하는 이미지를 위치시켜주고 싶어서 만들었다
- 부모 LinearLayout에 세로로 두 개의 layout을 만든다
- 첫 번째 layout은 텍스트, 이미지 등(원하는 것)이 들어가게될 layout
- 두 번째 layout은 SeekBar가 들어가게 된다





### 2. attrs.xml 생성

```xml
<SeekBar
    android:id="@+id/seekBar"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:max="100"
    android:splitTrack="false" />
```

- 위에 보이는 `android:id` , `android:max` 처럼 View에 내가 원하는 속성을 부여해서 입력한 값을 통해 View를 입맛대로 바꿀 수 있도록 **attrs.xml**에 해당 속성들을 추가해주어야 한다



**values - attrs.xml**

```xml
<resources>
    <declare-styleable name="SeekBarView">
        <attr name="thumbDrawable" format="reference"/>
        <attr name="progressDrawable" format="reference"/>
</declare-styleable>
```

- 각각의 속성과 포맷을 정해서 선언해준다
- 내가 원하는 SeekBar의 thubDrawable, progressDrawable 설정을 위한 속성을 추가한다
- reference는 @drawable/, @color/ 같은 reference를 넣어주기 위함이다





### 3. CustomView

- 이제 가장 중요한 CustomView를 만들어야한다

- 여기에서 위에서 만들었던 View(xml)를 할당하고

```kotlin
inflate(context, R.layout.seek_bar_view, this).apply {
    seekBarView = seekBar
    icon = vw_icon
    infoLayout = ll_info
}
```

- attrs에 설정해두었던 값들을 설정해준다

```kotlin
context.obtainStyledAttributes(attrs, R.styleable.SeekBarView, defStyleAttr, defStyleRes).apply {
    val thumbDrawable = getResourceId(R.styleable.SeekBarView_thumbDrawable, 0)
    val progressDrawable = getResourceId(R.styleable.SeekBarView_progressDrawable, 0)

    setThumbDrawable(thumbDrawable)
    setProgressDrawable(progressDrawable)

    recycle()
}
```

- 가장 중요한 코드인 thumb 위치에 따라서 변경해주는 코드

```kotlin
private fun setIconPosition(progress: Int) {
    seekBarView?.progress = progress
    val thumbXPosition = getSeekBarThumbPosX(seekBarView)
    val iconWidth = icon?.width?.div(2) ?: 0
    if (iconWidth != 0) {
        icon?.x = (thumbXPosition - iconWidth).toFloat()
    }
}

private fun getSeekBarThumbPosX(seekBar: SeekBar?): Int {
    val width = seekBar!!.width - seekBar.paddingLeft - seekBar.paddingRight
    return seekBar.paddingLeft + width * seekBar.progress / seekBar.max
}

override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
    setIconPosition(progress)
}
```

- SeekBar.OnSeekBarChangeListener 를 상속받아서 progress가 변경될때마다 icon 위치를 조정해 준다 



### 4. 마지막 View 사용

- 이제 뷰를 다 만들었으니 사용만 하면 된다

```xml
<com.test.ui.SeekBarView
    android:id="@+id/sb_approve"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginStart="@dimen/md_8"
    android:layout_marginEnd="@dimen/md_8"
    android:layout_marginBottom="@dimen/md_30"
    android:theme="@style/ProgressBar"
    app:progressDrawable="@drawable/bg_progress_bar"
    app:thumbDrawable="@drawable/bg_rect_transparent"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent"/>
```

- attr에서 선언해둔 속성을 `app:progressDrawable` 처럼 사용할 수 있다





- 전체 코드 소스
  - [dongsik93 github](https://github.com/dongsik93/SeekBarView){: class="underlineFill"}





- 참고사이트
  - [[안드로이드/Android]CustomView를 만들어서 재사용하기](https://gun0912.tistory.com/38){: class="underlineFill"}



















