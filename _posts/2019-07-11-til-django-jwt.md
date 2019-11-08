---
layout: post
title: "JWT를 사용한 REST API"
subtitle: "Django에 jwt 사용하기"
date: 2019-07-11 18:00:00 +0900
categories: til
tags: django
comments: true
---

## Django에 JWT 사용하기



### 왜 JWT를 사용하게 되었나 ?

- 프로젝트를 진행하는데 백엔드와 프론트엔드를 물리적, 논리적으로 분리하게 되면서 기존에 django에서 사용하던 사용자인증(`django.contrib.auth`)을 사용할 수 없게 되었다.
- django는 쿠키를 사용해서 유저를 식별하는데 쿠키라는게 site-a.com 에서 발행한 쿠키는 site-b.com에서 사용할 수 없다. 
- 따라서 다른 도메인에서 API를 호출해야 하는 지금의 상황에서는 JWT 토큰을 사용해야 한다

<br>

### JWT란 무엇인가 ?

- JSON 형태로 인증 토큰을 만들어 통신할 때 쓰는 인증방식
- Header에 Authorization값을 넣어서 인증을 진행
- 토큰 구성
  1. JSEO헤터(JSON Object Singing and Encryption) - Header
  2. JWT Claim Set - Payload
  3. Signature - Verify Signature
- 3개를 조합해서 `JWT token` 을 만든다

<br>

### django에서 JWT 사용하기

- 현재 DRF를 사용해서 API서버를 만들었고, 찾아보니 `django-rest-framework-jwt`라는게 있었다
- 자세한 사항은 공식 document에 상세히 기술되어 있다.
- [http://getblimp.github.io/django-rest-framework-jwt](http://getblimp.github.io/django-rest-framework-jwt){: class="underlineFill"}

> 이 글을 포스팅하는 현재 공식문서에 접속이 불가...

<br>

#### 설치

```
> pip install djangorestframework-jwt
```

#### 설정

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
        'rest_framework.permissions.IsAdminUser',
        'rest_framework.permissions.AllowAny',

    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
}
```

- `DEFAULT_PERMISSION_CLASSES` 설정을 통해 접근권한을 설정할 수 있다

  - IsAuthenticated : 인증된 사용자만 접근 가능
  - IsAdminUser : 관리자만 접근 가능
  - AllowAny : 누구나 접근 가능

  > 개발 당시 이 부분을 처음에 막 가져다 붙여서 IsAuthenticated, IsAdminUser를 설정해 놓고 왜 관리자권한이 있는 유저만 로그인이 되는지에 대해 몇시간동안 삽질을 했다... 가져다 쓰더라도 잘 가져다 쓰자...

- `DEFAULT_AUTHENTICATION_CLASSES` 설정을 통해 로그인과 관련된 클래스를 JWT를 사용하도록 설정

#### 추가적인 JWT_AUTH 설정

```python
# settings.py
JWT_AUTH = {
    'JWT_SECRET_KEY': SECRET_KEY,
    'JWT_ALGORITHM': 'HS256',
    'JWT_ALLOW_REFRESH': True,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=7),
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=28),
}
```

- JWT_ALGORITHM : JWT 암호화에 사용되는 알고리즘 설정
- JWT_ALLOW_REFRESH : JWT 토큰을 refresh할건지
- JWT_EXPIRATION_DELTA : JWT 토큰의 유효기간 설정
- JWT_REFRESH_EXPIRATION_DELTA : JWT 토큰의 갱신 유효기간

#### 기타 설정

```python
# settings.py
REST_USE_JWT = True
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = None
ACCOUNT_LOGOUT_ON_GET = True
```

- REST_USE_JWT : 로그인 전에 JWT를 사용하고 싶을 때
- ACCOUNT_EMAIL_REQUIRED / ACCOUNT_EMAIL_VERIFICATION :  로그인을 할 때 username, password, email이 필요한데 여기서 email을 사용하고 싶지 않을 때 위처럼 설정

- ACCOUNT_LOGOUT_ON_GET : 로그아웃 설정

<br>

#### URL설정

- 일단 토큰을 받아보자

```python
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('api-token-auth/', obtain_jwt_token),
]
```

- postman을 통한 테스트

  - 위에서 뚫어준 서버주소/api-token-auth 으로 username, password와 함께 POST요청을 보내면 토큰을 받을 수 있다.

    ![postman-obtain-token](/img/in-post/postman-obtain-token.png)


<br>

#### 로그인 설정

- 설치

```
> pip install django-rest-auth
```

- 설치 후 INSTALLED_APPS에 추가해준다

- URL 설정
  - `rest-auth/` 는 로그인, 로그아웃을 위한 url
  - `rest-auth/registration` 은 회원가입을 위한 url

```python
path('rest-auth/', include('rest_auth.urls')),
path('rest-auth/registration/', include('rest_auth.registration.urls')),
```

- _**registration**_ 은 rest-auth의 마이그레이션 이후에 실행할 수 있다

<br>

> jwt토큰을 사용하기 위해 drf-jwt를 설치하고,  세팅하고, 로그인 및 회원가입 세팅하는데 까지 프로젝트 4일 기간중 1.5일을 사용했다..... 우리조원들이 모두 다 기존 django 인증방식만을 사용해 봤기 때문에 오래걸리기도 했지만 새로운걸 찾고, 시도해보는 것 자체로 값진 경험이였다.



- 이제 프론트, Vue.js에서 요청을 보내면 응답을 해줄 REST API서버를 세팅했다...!



참고사이트

- [복습하는 programming 블로그](https://supplementary.tistory.com/291){: class="underlineFill"}
- [DEV-YAKUZA 블로그](https://dev-yakuza.github.io/ko/django/jwt/){: class="underlineFill"}











