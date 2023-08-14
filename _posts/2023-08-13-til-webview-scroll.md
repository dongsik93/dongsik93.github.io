---
layout: post
title: "[Android] NestedScrollWebView"
subtitle: "WebView 중첩스크롤 문제 해결"
date: 2023-08-13 18:00:00 +0900
categories: til
tags: android webview viewpager
comments: true
---



# [Android] NestedScrollWebView

> 이슈가 많은 웹뷰 화면 스크롤링과 스와이프 문제 해결





문제가 되는 기존 구조는 다음과 같다.

![nsv_1.png](/img/in-post/nsv_1.png)

문제점 1. 가로스크롤 바

- WebView의 가로스크롤은 ScrollView의 최하단에 나타남

문제점 2. WebView 확대

- WebView 확대시 내용이 잘려서 보임

문제점 3. ViewPager Scroll

- ViewPager와 WebView의 스크롤 중첩 문제

이러한 문제점들을 해결하기 위해 작업을 진행했다.
변경된 구조는 다음과 같다.

![nsv_2.png](/img/in-post/nsv_2.png)

WebView의 가로스크롤 바를 고정된 위치에 노출시키기 위해서 ScrollView 대신 CoordinatorLayout, AppBarLayout, CollapsingToolbarLayout으로 변경했다.
변경을 해놓고 나니 이제 세로 스크롤 중첩 문제가 발생했다. CoordinatorLayout을 사용할때 사용하는 `appbar_scrolling_view_behavior` 가 제대로 동작하지 않아 발생하는 문제였다.
올바른 동작은, 위로 스크롤할 때 AppBarLayout이 접히고, 다 접히고 난 뒤 WebView의 스크롤이 동작하게끔 작업이 필요했고 NestedScrollView로 WebView를 감싸면 애초에 ScrollView에서 CoordinatorLayout으로 변경한 이유가 없어지기 때문에, NestedScrollView 처럼 동작하는 WebView를 만들어야 한다.



## 1. 세로 스크롤 문제

### NestedScrollWebView

NestedScroll이 적용된 WebView를 만들기 위해서는 NestedScrollingChild를 WebView에 적용하고 WebView의 onTouchEvent 에서 NestedScrollingChildHelper로 이벤트를 전달해야 한다. (처음에는 customBehavior를 만들어서 해결해보려고 했으나, 잘 되지 않았....)
따라서 NestedScroll 적용을 위해 NestedScrollingChild3를 구현한다

### NestedScrollingChild3

NestedScrollingChild3, 주석에는 다음과 같은 설명이 되어있다.

인터페이스는 부모의 ViewGroup에 NestedScrolling을 전달하고자 하는 View의 subclass에 의해 구현 되어야 한다. 또한 해당 인터페이스를 구현하는 클래스는 **NestedScrollingChildHelper의 최종 인스턴스를 필드로 생성하고, 모든 View 메서드를 NestedScrollingChildHelper 메서드로 위임**해야 한다.

설명에 따르면 WebView에 NestedScrollingChild3를 구현하고, NestScrollingChildHelper에 WebView의 메서드를 위임해야 한다는 이야기다.

```kotlin
class NestedScrollWebView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = android.R.attr.webViewStyle
) : WebView(context, attrs, defStyleAttr), NestedScrollingChild3 {
    private val childHelper: NestedScrollingChildHelper = NestedScrollingChildHelper(this)
    
    // view 
    override fun stopNestedScroll() {
        childHelper.stopNestedScroll()
    }
		// NestedScrollingChild
    override fun stopNestedScroll(type: Int) {
        childHelper.stopNestedScroll(type)
    }
		// view 
    override fun hasNestedScrollingParent(): Boolean {
        return childHelper.hasNestedScrollingParent()
    }
		// NestedScrollingChild
    override fun hasNestedScrollingParent(type: Int): Boolean {
        return childHelper.hasNestedScrollingParent(type)
    }
		// view 
    override fun dispatchNestedScroll(
        dxConsumed: Int, dyConsumed: Int, dxUnconsumed: Int,
        dyUnconsumed: Int, offsetInWindow: IntArray?
    ): Boolean {
        return childHelper.dispatchNestedScroll(
            dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed,
            offsetInWindow
        )
    }
		// NestedScrollingChild
    override fun dispatchNestedScroll(
        dxConsumed: Int, dyConsumed: Int, dxUnconsumed: Int,
        dyUnconsumed: Int, offsetInWindow: IntArray?, type: Int
    ): Boolean {
        return childHelper.dispatchNestedScroll(
            dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed,
            offsetInWindow, type
        )
    }
}
```

NestedScrollingChild의 메서드에는 View의 메서드의 파라미터에 추가로 **type**이 추가된 모습인데, 이 type을 통해 어떤 스크롤이 해당 이벤트를 발생시켰는지를 알려준다.
이렇게 구현하면 웹뷰 스크롱 중복 이슈는 해결이 되었지만…. 이제 웹뷰를 확대 / 축소 했을 때 ViewPager와의 스크롤 간섭 문제를 해결해야 한다.



## 2. 가로 스크롤

웹뷰가 확대/축소가 되었을 때(웹뷰 좌우 스크롤이 가능한 상황) 좌우 해당 스크롤의 마지막 영역까지 이동한 후 ViewPager 좌우로 이동할 수 있게끔 만들어야 한다.
처음엔 웹뷰에 touchListener를 달아서 이전 x좌표, 현재 x좌표를 비교해 좌/우 스크롤인지 판단한 후 웹뷰 내의 좌/우 스크롤이 가능한지 판단하는 식으로 처리를 했었다.

```kotlin
override fun onTouch(view: View, motionEvent: MotionEvent): Boolean {
    val locationX = motionEvent.x
    when (motionEvent.action) {
        MotionEvent.ACTION_DOWN -> setVpSwipeStatus(false)
        MotionEvent.ACTION_MOVE ->
            setVpSwipeStatus(
                (view.canScrollHorizontally(1).not() && oldLocationX > locationX)
                    || (view.canScrollHorizontally(-1).not() && oldLocationX < locationX)
            )
        MotionEvent.ACTION_UP -> setVpSwipeStatus(true)
    }
    oldLocationX = locationX
    return false
}
```

위처럼 구현을 하면 동작은 하지만… 이제 좌우 스크롤을 했을 때 위아래로 넘어가버리는 문제가 발생했다.
사실 보통 사람들이 상하좌우 스크롤을 할 때 정확하게 위아래, 또는 좌우로 스크롤을 하는게 아니라 대각선으로 스크롤 동작을 하기 때문에 생기는 문제라고 생각했다.
상하 스크롤을 할 때 어느정도 이동했는지를 판단해 좌우 스와이프를 막아주고, 움직인 거리가 x좌표가 y좌표값보다 크다면 좌우스크롤로 판단해 조건처리를 해주었다.

```kotlin
private val scrollGestureListener = object : GestureDetector.SimpleOnGestureListener() {
    override fun onScroll(
        e1: MotionEvent,
        e2: MotionEvent,
        distanceX: Float,
        distanceY: Float
    ): Boolean {
        // x 축 스크롤 민감도 조정
        if (abs(distanceX) > abs(distanceY)) {
            val status = if (e1.x > e2.x) {
                // 우 -> 좌
                (e1.x - SCROLL_Y_BUFFER * 10 > e2.x) && view.canScrollHorizontally(1).not()
            } else {
                // 좌 -> 우
                (e2.x - SCROLL_Y_BUFFER * 10 > e1.x) && view.canScrollHorizontally(-1).not()
            }
            setVpSwipeStatus(status)
            // y 축 스크롤 민감도 조정
        } else if (abs(distanceY) > SCROLL_Y_BUFFER) {
            setVpSwipeStatus(false)
        }
        return super.onScroll(e1, e2, distanceX, distanceY)
    }
}
```



해당 예제 소스 : [dongsik93 git hub](https://github.com/dongsik93/blog-source/tree/master/nestedWebView){: class="underlineFill"}



### 참고사이트

- [NestedScrollWebView](https://github.com/tobiasrohloff/NestedScrollWebView){: class="underlineFill"}
- [Disable ViewPager paging when child recyclerview scrolls to last item](https://stackoverflow.com/questions/38466413/disable-viewpager-paging-when-child-recyclerview-scrolls-to-last-item){: class="underlineFill"}