---
layout: post
title: "Django Class Based View (1)"
subtitle: "CBV에 대한 이해 (1)"
date: 2019-12-16 22:00:00 +0900
categories: til
tags: django cbv
comments: true
---

## Django Class Based views (1)

> CBV에 대한 이해

<br>

### Class Based view(CBV)란?

- 기존 View를 함수로 사용했었는데, 이를  `Function Based View(FBV)`라고 한다
- views는 함수가 아닌 **Callable Objects**, 즉 호출가능한 객체면 문제없이 작성할 수 있다
- **클래스**도 호출가능한 객체이기 때문에 클래스로도 views를 구성할 수 있다
- `Class Based View(CBV)`는 **상속**과 **믹스인** 기능을 이용하여 코드를 재사용하고, views를 체계적으로 구성할 수 있다

#### CBV의 장점

- 클래스의 장점인 상속, 오버라이딩 등등여러 방식과 제네릭 뷰, 믹스인 클래스 등으로 코드의 재사용과 효율을 높일 수 있다
- GET, POST 등 HTTP 메소드에 따른 처리코드를 작성할 때 if 함수 대신에 메소드 명을 사용해 코드의 구조가 깔끔해진다

#### CBV의 단점

- 이미 많은 부분이 정해져있다
  - 이미 정해져있는 부분을 이해하고 있지 않다면 이를 커스터마이징 하는데 어려움이 있다
- 클래스의 상속 등 여러 파이썬 문법에 대한 선행지식이 있어야 한다

#### CBV 사용 가이드라인

- View는 간단 명료해야 한다
- View의 코드 양은 적을수록 좋다
- View안에서 같은 코드를 반복적으로 사용하지 않는다
- View는 프레젠테이션 로직에서 관리하고, 비즈니스 로직은 Model에서 처리한다. 특별한 경우에만 Form에서처리한다

> **Presentation Logic**
>
> 말 그대로 보여주기 위한 로직, 화면상의 디자인 구성을 위한 로직을 일컫는다
>
> **Business Logic**
>
> 어떠한 특정한 값을 얻기 위해 데이터의 처리를 수행하는 응용프로그램의 일부, 원하는 값을 얻기 위해서 백엔드에서 일어나는 각종 처리를 일컫는다

- 403, 404, 500 에러 핸들링에는 CBV가 아닌 FBV를 이용한다
- 믹스인은 간단명료해야 한다

#### CBV의 동작과정

```python
# urls.py
urlpatterns = [
    path('posts/', PostListview.as_view())
]
```

![cbv](/img/in-post/cbv.png)

- `as_view()` 메소드에서 클래스의 인스턴스를 생성한다
- 생성된 인스턴스의 `dispatch()`  메소드를 호출한다
- `dispatch()` 메소드는 요청을 감사해서 HTTP 메소드(GET, POST)를 알아낸다
- 인스턴스 내에 해당 이름을 갖는 메소드로 요청을 중계한다
- 해당 메소드가 정의되어 있지 않으면 **http_response_not_allowed** 를 발생시킨다



참고사이트

- [django-클래스형 뷰](http://ruaa.me/django-view/){: class="underlineFill"}
- [django class based views for beginners](https://www.slideshare.net/spinlai/django-class-based-views-for-beginners){: class="underlineFill"}

