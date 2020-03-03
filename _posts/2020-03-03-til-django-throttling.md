---
layout: post
title: "Django Throttling"
subtitle: "django throttling"
date: 2020-03-03 18:00:00 +0900
categories: til
tags: django throttling
comments: true
---

## Django Throttling

> Django 공부중 처음보는 용어가 나와서 정리하게 됨



### Throttle이란?

- 특정 조건 하에 최대 호출 회수를 결정하는 클래스이다
- `Throttling`은 request가 승인되어야하는지 여부를 결정하는 점에서 permissions와 유사하다



### Throttling Setting

- setting.py를 통해 전역으로 설정할 수 있다

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '1000/day'
    }
}
```

- `AnonRateThrottle`

  - 인증요청에는 제한을 두지 않고 비인증요청에는 IP 횟수 별로 제한
  - Throttle 클래스 별로 scope 1개만 지정 가능하다
  - default : anon

- `UserRateThrottle`

  - 인증요청에는 유저별로 횟수를 제한하고, 비인증요청에는 IP별로 횟수 제한
  - Throttle 클래스 별로 scope 1개만 지정 가능하다
  - default : user

- `ScoptedRateThrottle`

  - 인증요청에는 유저별로 횟수를 제한하고, 비인증 요청에는 IP별로 횟수 제한
  - 여러 APIView내 throttle_scope값을 읽어들여 APIView 별로 다른 Scope를 적용

  ```python
  # APIVew 예
  # views.py
  
  from rest_framework.throttling import UserRateThrottle
  
  class PostViewSet(ModelViewSet):
      queryset = Post.objects.all()
      serializer_class = PostSerializer
      throttle_classes = UserRateThrottle
  ```

- `Rate`

  - 지정 기간 내의 최대 호출 횟수를 말한다
  - **{숫자}/{간격}** 처럼 표현한다
  - 숫자는 지정한 간격 내의 최대 요청 제한 횟수를 뜻한다
  - 간격은 횟수를 초기화하는 시간을 말한다
  - 간격 키워드로는 `s(초), m(분), h(시), d(일)`이 있다



### 클라이언트 식별 방법

- `X-Forwarded_For`와 `Remote-Addr` HTTP 헤더는 throttling을 위해 클라이언트 IP 주소를 고유하게 식별하는데 사용된다
- `X-Forwarded_For`헤더가 있으면 사용되고, 없으면 `Remote-Addr` 헤더 값이 사용된다
  - 비인증요청에 대해서는 IP를 기준으로 카운트하게되는데, 이 때 `Remote-Addr` WSGI 변수값을 참조하게 되면 문제가 발생하게 된다
  - 로드 밸런서를 통할 경우 여러 유저들의 `Remote-Addr` 의 값이 동일해지고, 이는 여러 유저가 같은 timestamp를 가지게 되기 때문이다
  - 그렇기 때문에 `X-Forwarded_For` 헤더값이 `Remote-Addr` 값에 우선하게 된다



### 캐시(Cache)

- REST Framework가 제공하는 throttle 클래스는 Django의 캐시 백엔드를 사용한다
- 매 요청시마다 cache에서 `timestamp list`값을 get/set 하므로 cache 성능이 중요하다

```python
# SimpleRAteThrottle의 defaul cache
from django.core.cache import cache as default_cache

class SimpleRateThrottle(BaseThrottle):
    cache = default_cache
```



참고사이트

- [Django REST framework - Throttling](https://www.django-rest-framework.org/api-guide/throttling/){: class="underlineFill"} 
- [Django Throttling](https://ssungkang.tistory.com/entry/Django-Throttling?category=366160){: class="underlineFill"} 

