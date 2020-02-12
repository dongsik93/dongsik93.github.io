---
layout: post
title: "Django Middleware (1)"
subtitle: "django middleware"
date: 2020-02-12 18:00:00 +0900
categories: til
tags: django middleware
comments: true
---

# Django middleware (1)

> setting.py에서만 봤던 middleware, 어디에서 쓰는건지 왜쓰는건지에 대해서 알아보자



### 미들웨어란?

- http 요청 / 응답 처리 중간에서 작동하는 시스템이다
- DJango는 **http 요청**이 들어오면 미들웨어를 거쳐서 해당 URL에 등록되어 있는 뷰로 연결해주고, **http 응답** 역시 미들웨어를 거쳐서 내보낸다

![middleware1](/img/in-post/middleware1.png)

- 따라서 Django에서 **미들웨어**는 http 요청 혹은 응답의 전처리에 사용이 된다



### 미들웨어 등록, 설정

- 미들웨어를 등록하는 방법은 setting.py에서 `MIDDLEWARE` 항목에 추가하고자 하는 미들웨어의 **full python path**를 추가해주면 된다
- django-admin startproject 명령어로 django project를 생성하면 기본적으로 미들웨어들이 등록되어 있다

```python
# setting.py 기본 등록 미들웨어
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```



### 미들웨어 순서

- 미들웨어 등록시 가장 중요한 것은 미들웨어를 등록하는 순서이다

- 미들웨어 등록 순서가가지는 의미는 다음과 같다
  - http request가 들어오면 **위에서부터 아래로** 미들웨어를 적용시킨다
  - http response가 나갈 때 **아래서부터 위로** 미들웨어를 적용시킨다



### 커스텀 미들웨어 작성하기

- Django에서 커스텀 미들웨어는 함수나 클래스로 작성할 수 있다



#### 함수로 작성하기

- 미들웨어를 함수로 작성하게 될 경우에는 **팩토리 형식**을 사용한다

> **팩토리 메소드 패턴 (Factory Method Pattern)**
>
> 팩토리는 뜻 그대로 '공장', 즉 틍정 역할을 가진 객체를 생산하는 기능을 수행한다고 볼 수 있으며, 다시 말해서 객체를 만들어 내는 부분을 서브  클래스에 위임하는 패턴이라고 생각해 볼 수 있다

```python
# custom middlewawre - factory method pattern
def my_middleware(get_response):
    # 최초 설정 및 초기화

    def middleware(request):
        # 뷰가 호출되기 전에 실행될 코드들

        response = get_response(request)

        # 뷰가 호출된 뒤에 실행될 코드들

        return response

    return middleware
```

- `my_middleware`는 `get_response` 함수를 받는 하나의 함수이며, `middleware` 라는 내부 함수를 반환하게 된다
- `my_middleware` 함수 상단에서는, 최초 설정 및 초기화를 진행하게 된다
- `middleware`  라는 내부 함수에서는, request를 받아서 최종적으로 response를 반환한다
- 이 함수는, 중간의 `get_response` 함수를 호출하기 전과 후로 나눠서 생각할 수 있는데, view가 호출되기 전과 view가 호출되고 난 후 처리할 일들을 나누어서 작성해 주면 된다



#### 클래스로 작성하기

- 클래스로 미들웨어를 작성하게 되면 보다 더 구조화된 미들웨어를 작성할 수 있게 된다

```python
# custom middleware - class
class MyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # 최초 설정 및 초기화

    def __call__(self, request):
        # 뷰가 호출되기 전에 실행될 코드들

        response = self.get_response(request)

        # 뷰가 호출된 뒤에 실행될 코드들

        return response
```

- 초기 생성자(`__init__`함수)와 호출 함수(`__call__` 함수) 두분으로 나뉜다
- `__init__` 함수에서는 최초 설정 및 초기화를 한다
- `__call__` 함수는 request를 받아서 response 를 리턴한다
- `get_response` 는 장고에서 미들웨어를 호출할 때 넘겨주는 하나의 함수이며, view이거나 다른 미들웨어 일 수 있다

##### 미들웨어 훅(Middleware Hook)

- 클래스 형식으로 미들웨어를 정의하게 되면, http 요청/응답에 대한 처리를 하게되는 메소드를 추가로 정의할 수 있는데 이를 **미들웨어 훅(Middleware Hook)**이라고 한다

- `http 요청 미들웨어`

  - 다음 두 가지의 훅 중 하나를 구현하면 된다

  ```python
  def process_request(request)
  
  # 장고가 view 를 호출하기 바로 직전에 불리는 훅이다
  # None 이나 HttpResponse 객체를 리턴해야 한다.
  # None 을 리턴하면, view 를 호출하고, HttpResponse 객체를 리턴하면,
  # 해당 HttpResponse 를 미들웨어로 다시 쏘아 올린다.
  def process_view(request, view_func, view_args, view_kwargs)
  ```

- `http 응답 미들웨어`

  - 세 가지의 훅 중 하나를 구현한다

  ```python
  # view 가 exception 을 발생시키면 호출된다.
  def process_exception(request, exception)
  
  # response 가 템플릿을 반환하는 경우에만
  def process_template_response(request, response)
  
  def process_response(request, response)
  ```



참고사이트

- [Django 공식 사이트](https://docs.djangoproject.com/en/2.2/topics/http/middleware/#){: class="underlineFill"} 
- [DJANGO 커스텀 미들웨어 만들기 + REST FRAMEWORK 를 위한 HTTP RESPONSE FORMATTING](https://gyukebox.github.io/blog/django-커스텀-미들웨어-만들기---rest-framework-를-위한-http-response-formatting/){: class="underlineFill"} 


