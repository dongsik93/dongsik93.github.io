---
layout: post
title: "[Android] Paging3 load all pages at once"
subtitle: "Paging3 troubleshooting"
date: 2022-03-22 19:00:00 +0900
categories: til
tags: android paging3
comments: true



---



# [Android] Paging3 load all pages at once



문제점 : 페이징3 로드시 모든 페이지 데이터를 한번에 가져오는 문제

- 현재 문제가 생긴 구조

Activity - ViewPager - NestedScrollView - RecyclerView

![paging3_1.png](/img/in-post/paging3_1.png)



문제점

- PagerFragment내의 RecyclerView를 감싸고있는 NestedScrollView의 문제
- 뷰페이저 내의 리사이클러뷰 스크롤링을 위해서 NestedScrollView를 감싸서 스크롤을 해결했으나 페이지 로딩 시 페이징처리가 되지 않고 모든 데이터를 한꺼번에 불러오는 문제가 발생



과정

- Paging LocalDataSource가 잘못된게 아닌가 싶어서 1차적으로 확인
- 데이터 로드쪽 문제가 아님을 확인하고 뷰를 2차적으로 확인



해결

- StackOverflow 답변
    - in the nested scrolling case you must be careful not to give RV an infinite height as otherwise it will try to layout / load all items
    - If you give RV an infinite height, it will try to bind every item because it thinks every item is visible. Nested scrolling is just not a supported use-case, you need to give RV a finite / bounded height
    - NestedScroll의 경우 리사이클러뷰가 모든 아이템을 로드하려고 하기 때문에 리사이클러뷰에 높이를 지정해줘야 한다
    - 리사이클러뷰에 높이를 무한대로 설정하면 모든아이템이 보이는것으로 생각하기 때문에 모든 아이템을 바인드하려고 한다. 따라서 높이를 지정해 주어야 한다
- 그렇다면, 해결방법은 감싸주고있던 NestedScrollView를 없애주거나 리아시클러뷰의 높이를 지정해주는 것
- NestedScrollView를 없애고 RecyclerView내의 메서드인 nestedScrollingEnabled를 사용해서 중첩스크롤을 해결 (default true)



그렇다면 NestedScrollView를 사용했을 경우와 RecyclerView의 nestedScrollingEnabled를 사용했을 경우 어떤점이 다르기 때문에 이렇게 동작하는 것일까..?



일단 이번 이슈는 무지성으로 RecyclerView를 NestedScrollView로 감싼것이 문제였다. ~~(사실 NestedScrollView 필요 없는 화면이였던건 안비밀)~~

RecyclerView가 NestedScrollView 안에 들어가는 경우 NestedScrollView의 LinearLayout은 자녀 항목의 높이합에 해당하는 길이를 지니게 되는데, RecyclerView에 높이 값을 특정 숫자로 주지 않는 이상 match_parent든 wrap_content든 자신의 모든 데이터를 불러온 크기에 해당하는 길이로 설정되는 것을 몰랐기 때문에 발생한 문제였다



RecyclerView 내부 코드를 살펴보면

```kotlin
boolean nestedScrollingEnabled = true;
if (Build.VERSION.SDK_INT >= 21) {
    a = context.obtainStyledAttributes(attrs, NESTED_SCROLLING_ATTRS,
            defStyleAttr, 0);
    ViewCompat.saveAttributeDataForStyleable(this,
            context, NESTED_SCROLLING_ATTRS, attrs, a, defStyleAttr, 0);
    nestedScrollingEnabled = a.getBoolean(0, true);
    a.recycle();
}
// Re-set whether nested scrolling is enabled so that it is set on all API levels
setNestedScrollingEnabled(nestedScrollingEnabled);
```

sdk버전에 따라서 해당 속성을 사용할수 있는 분기처리가 되어있고, setNestedScrollingEnabled에 해당 값을 넘겨주고 있다



### 참고사이트

- [Android Paging (3) load all pages at once](https://stackoverflow.com/questions/66023893/android-paging-3-load-all-pages-at-once){: class="underlineFill"}