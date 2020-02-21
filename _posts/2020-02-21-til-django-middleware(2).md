---
layout: post
title: "Django Middleware (2)"
subtitle: "django middleware"
date: 2020-02-21 18:00:00 +0900
categories: til
tags: django middleware
comments: true
---

# Django middleware (2)

> middleware를 직접 작성해보자



이번엔 직접 middleware를 구현하고, 테스트

참고 사이트 예시인 Rest Framework를 위한 HTTP Response Formatting을 따라서 해보자  



### Rest Framework를 위한 HTTP Response Formatting

- HTTP 응답 형식을 정해주는 미들웨어
- 많은 상용 API 처럼 http 응답 형태를 일관성있게 해주기 위해서
- Django에서 API 응답을 보내줄 때 형식

```python
# vieww.py 예시
class SampleView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({
            'success': True,
            'data': 'sample data'
        }
```

- 위처럼 모든 view 함수에서 일일이 http 응답 형태를 정할 수있지만 중복되는 코드가 많이 생기게 된다
- **미들웨어를 활용**하면 http 응답이 **미들웨어를 거쳐 자동으로 formatting 되도록** 해보자





#### 1. 미들웨어 클래스 만들기

- 미들웨어 클래스 이름을 `ResponseFormattingMiddleware`이라고 하고, 클래스 변수를 만들어 준다

```python
# middlware.py
import re
from rest_framework.status import is_client_error, is_success

class ResponseFormattingMiddleware:
    METHOD = ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')
```

- http의 요청중 `METHOD`에 포함되어 있는 형식에 대해서만 미들웨어가 작동하도록 하기 위해서 설정해준다
- 그 다음 `initializer`를 만들어 준다

```python
def __init__(self, get_response):
    self.get_response = get_response
    self.API_URLS = [
        re.compile(r'^(.*)/api'),
        re.compile(r'^api'),
    ]
```

- `re`는 정규표현식을 위한 파이썬 모듈이다
- URL에 `api`가 포함되어 있는 요청에 대해서만 미들웨어가 작동하도록 하기 위해서 `API_URLS`라는 인스턴스 변수를 생성



#### 2. `__call__` 메소드 만들기

- 클래스의 인스턴스가  함수처럼 호출될 때 불리는 메소드이다

```python
def __call__(self, request):
    response = self.get_response(request)
    if hasattr(self, 'process_response'):
        response = self.process_response(request, response)
    return response
```

- `process_response`가 `get_response`에 정의되어 있다면 이를  처리해주는 형식



#### 3. `process_response` 만들기

- **http 응답을 formatting 해주는 로직**을 구현한다
- 미들웨어가 작동할 조건은 **유효한 URL**인지,  **유효한 http 요청** 인지를 검사해야 한다

```python
# 검사를 위한 코드
path = request.path_info.lstrip('/')
valid_urls = (url.match(path) for url in self.API_URLS)

if request.method in self.METHOD and any(valid_urls):
    response_format = {
        'success': is_success(response.status_code),
        'result': {},
        'message': None
    }
```

- 검사 후 view에서 넘어온 response에 데이터가 있는지를 확인해야 한다. 
- 데이터가 있다면 정해둔 응답 format에 맞춰서 수정해주고,  없다면 response format 그대로 http 응답 데이터를 구성한다

```python
if hasattr(response, 'data') and getattr(response, 'data') is not None:
                data = response.data
                try:
                    response_format['message'] = data.pop('message')
                except (KeyError, TypeError):
                    response_format.update({
                        'result': data
                    })
                finally:
                    if is_client_error(response.status_code):
                        response_format['result'] = None
                        response_format['message'] = data
                    else:
                        response_format['result'] = data

                    response.data = response_format
                    response.content = response.render().rendered_content
            else:
                response.data = response_format
```

- 마지막으로 response를 return 해주면 된다



완성된 `middleware.py` 코드

```python
# middleware.py
import re
from rest_framework.status import is_client_error, is_success


class ResponseFormattingMiddleware:
    """
    Rest Framework 을 위한 전용 커스텀 미들웨어에 대해 response format 을 자동으로 세팅
    """
    METHOD = ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')

    def __init__(self, get_response):
        self.get_response = get_response
        self.API_URLS = [
            re.compile(r'^(.*)/api'),
            re.compile(r'^api'),
        ]

    def __call__(self, request):
        response = None
        if not response:
            response = self.get_response(request)
        if hasattr(self, 'process_response'):
            response = self.process_response(request, response)
        return response

    def process_response(self, request, response):
        """
        API_URLS 와 method 가 확인이 되면
        response 로 들어온 data 형식에 맞추어
        response_format 에 넣어준 후 response 반환
        """
        path = request.path_info.lstrip('/')
        valid_urls = (url.match(path) for url in self.API_URLS)

        if request.method in self.METHOD and any(valid_urls):
            response_format = {
                'success': is_success(response.status_code),
                'result': {},
                'message': None
            }

            if hasattr(response, 'data') and getattr(response, 'data') is not None:
                data = response.data
                try:
                    response_format['message'] = data.pop('message')
                except (KeyError, TypeError):
                    response_format.update({
                        'result': data
                    })
                finally:
                    if is_client_error(response.status_code):
                        response_format['result'] = None
                        response_format['message'] = data
                    else:
                        response_format['result'] = data

                    response.data = response_format
                    response.content = response.render().rendered_content
            else:
                response.data = response_format

        return response
```



#### 4. 미들웨어 등록

- `setting.py`에  만들어준 미들웨어를 추가해준다
- 추가할 위치는 **맨 밑**, 그 이유는 이 전 포스팅에서 미들웨어의 순서가 중요하기  때문이다

```python
# setting.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    '앱이름.middleware.ResponseFormattingMiddleware',
]
```

참고사이트

- [Django 공식 사이트](https://docs.djangoproject.com/en/2.2/topics/http/middleware/#){: class="underlineFill"} 
- [DJANGO 커스텀 미들웨어 만들기 + REST FRAMEWORK 를 위한 HTTP RESPONSE FORMATTING](https://gyukebox.github.io/blog/django-커스텀-미들웨어-만들기---rest-framework-를-위한-http-response-formatting/){: class="underlineFill"} 


