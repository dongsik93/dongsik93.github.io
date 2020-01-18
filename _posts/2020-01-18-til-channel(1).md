---
layout: post
title: "Channels를 이용한 실시간 채팅 구현 - 튜토리얼 (1)"
subtitle: "django channel tutorial"
date: 2020-01-18 15:00:00 +0900
categories: til
tags: django channel
comments: true
---

# Channels를 이용한 실시간 채팅 구현 - 튜토리얼 (1)

> 취미 사이트 개발 중 카테고리별로 채팅방을 만들자 라고 아이디어가 나왔지만 개발 일정상 배제하고 진행하게 되었는데, 이제 시간이 여유로운 관계로 Django공부 겸 해서 알아봅시다 !



[Django Channels](https://channels.readthedocs.io/en/latest/index.html){: class="underlineFill"} 를 보고 튜토리얼을 따라했습니다.



### Channels란 ?

- 웹 소켓, 채팅 프로토콜, IoT 프로토콜 등을 다루는 HTTP 이상의 기능을 갖춘 프로젝트로서 **ASGI**라고 불리는 파이썬을 기반으로 만들어 졌다
  - `ASGI`는 비동기 요청인 웹 소켓을 처리하는 이벤트로서 connect, send, receive, disconnect가 있다
- Django 자체는 동기시이지만, Channels를 사용하면 연결과 소켓을 비동기 처리한다



자 이제 그럼 튜토리얼을 따라 해보며 어떻게 동작하고, 사용하는지를 알아보자



### 1. 프로젝트 생성

- 가장 먼저 가상환경 세팅을 해준다

```shell
# python3의 경로를 찾아
which python3

# channels라는 가상환경을 만들어준다
virtualenv --pyton='python3의 경로' channels

# 그 후 Django install
pip install django==2.2.9
```

- 프로젝트와 앱을 생성한다

```shell
django-admin startproject mysite
django-admin startapp chat
```

- 생성 후 아래와 같이 chat에서 필요없는 파일을 지운다

![chat(1)_1](/img/in-post/chat(1)/chat(1)_1.png)

- 생성한 앱을 추가해준다

```python
# mysite/setting.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'chat',
]
```

- 여기까지가 기본 환경세팅이다
  - app을 생성하는데 지금까지 **django-admin startapp**으로 생성했었는데, 공식문서에서 **python manage.py startapp**으로 하는 걸 보고 하나 배웠다



### 2. 기본적인 준비

- 이제 실시간 채팅을 위한 index.html 를 생성한다

```html
<!-- chat/templates/chat/index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Chat Rooms</title>
</head>
<body>
    What chat room would you like to enter?<br/>
    <input id="room-name-input" type="text" size="100"/><br/>
    <input id="room-name-submit" type="button" value="Enter"/>

    <script>
        document.querySelector('#room-name-input').focus();
        document.querySelector('#room-name-input').onkeyup = function(e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#room-name-submit').click();
            }
        };

        document.querySelector('#room-name-submit').onclick = function(e) {
            var roomName = document.querySelector('#room-name-input').value;
            window.location.pathname = '/chat/' + roomName + '/';
        };
    </script>
</body>
</html>
```

- 이제 만들 index 페이지를 위해 View를 설정한다

```python
# chat/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'index.html', {})
```

- URL 매핑을 위해 urls.py를 생성하고 연결시켜준다

```python
# chat/urls.py
from django.conf.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

- 그 후 mysite의 urls.py를 수정해준다

```python
from django.conf.urls import include
from django.urls import path
from django.contrib import admin

urlpatterns = [
    path('chat/', include('chat.urls')),
    path('admin/', admin.site.urls),
]
```



### 3. 테스트

- 서버를 돌려서 위의 사항들이 잘 적용이 되었는지 확인해본다

```shell
python manage.py runserver
```

![chat(1)_2](/img/in-post/chat(1)/chat(1)_2.png)

- 화면에서 채팅방 이름을 입력하고 엔터를 누르게 되면 http://127.0.0.1:8000/chat/lobby/로 이동한다. 하지만 아직 이에 대한 View를 작성하지 않았기 때문에 404에러를 나타내게 된다
- Django 기본 작업 끝



#### 4. Channels 라이브러리 통합

- channels 패키지 설치

```shell
pip install -U channels
```

- 이제 라우팅 config를 작성한다
  - 라우팅이란 

```python
# mysite/routing.py
from channels.routing import ProtocolTypeRouter

application = ProtocolTypeRouter({
    # (http->django views is added by default)
})
```

- 변경사항을 setting.py를 수정해준다
  - channels와 chat을 가장 위에 작성하는 이유는 **Channel 개발 서버**가 다른 서드 파티 앱과 충돌이 발생할 수 있기 때문

```python
# mysite/settings.py
INSTALLED_APPS = [
    'channels',
    'chat',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
ASGI_APPLICATION = 'mysite.routing.application'
```

- 여기까지 잘 적용이 되었는지 테스트

```shell
python manage.py runserver
```

![chat(1)_3](/img/in-post/chat(1)/chat(1)_3.png)

- Channels가 chat 앱에 포함되었기 때문에, 이 채널은 runserver 명령을 제어하여 표준 Django 개발 서버를 Channel 개발 서버로 대체하게 된다
- 그 결과로 `Starting ASGI/Channels version 2.4.0 development server at http://127.0.0.1:8000/`이라는 메세지가 출력된다



참고사이트

- [Django channel Tutorial Part 1](https://channels.readthedocs.io/en/latest/tutorial/part_1.htmlhttps://channels.readthedocs.io/en/latest/tutorial/part_1.html){: class="underlineFill"} 



