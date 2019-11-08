---
layout: post
title: "FakeInsta"
subtitle: "fake-insta7"
date: 2019-04-22 18:00:00 +0900
categories: pro
tags: FakeInsta
comments: true
---

## Hashtag기능 추가

## 190422



### fake-insta7



- ##### hashtag기능 추가

```python
# posts-urls.py
path('hashtag/<int:id>/', views.hashtag, name="hashtag"),
```

```python
# posts-views.py
def hashtag(request, id):
    hashtag = Hashtag.objects.get(id=id)
    # related name이 설정이 되지 않았기 때문
    ## 설정이 되어 있다면 post_set대신에 그 related name을 넣어주면 됨
    posts = hashtag.post_set.all()
    comment_form = CommentForm()
    
    return render(request, 'posts/list.html', {"posts":posts, "comment_form":comment_form, "hashtag":hashtag})
```

```html
# list.html
{% raw %}{% if request.resolver_match.url_name == "hashtag" %}{% endraw %}
        <h2>{{hashtag.content}}</h2>
{% raw %}{% endif %}{% endraw %}
```

- ` template filter` 

```python
# templatetags 폴더 생성 후 __init__.py, posts_templatetag.py 생성
## posts_templatetag.py
from django import template

register = template.Library()

@register.filter
def hashtag_link(post):
    content = post.content     # '#하이 #안녕 # 인스타'와같은 덩어리로 들어가있음
    hashtags = post.hashtags.all()    # <queryset [hashtag1, hashtag6]>
    
    for hashtag in hashtags:
        content = content.replace(f"{hashtag.content}", f"<a href='/posts/hashtag/{hashtag.id}'> {hashtag.content}</a>")
    
    
    return content
```



```html
# _post.html
## 35번라인
{% raw %}{% load posts_template %}{% endraw %}

<p class="card-text"><strong>{{post.user}}</strong> {{post|hashtag_link|safe}}</p>
```





- #### 카카오 로그인 기능 달기

  - `django allauth`라이브러리 설치
    - 공식문서 따라서 수정해주기
  - 카카오개발자 가입
    - 설정 - 일반 - 플랫폼에 추가
      - `redirect path` : /accounts/kakao/login/callback/
      - 사이트도메인 : 내 주소(8080을 넣을때 / 안넣을때 랜덤)
    - 사용자관리
      - 프로필정보 / 카카오계정 ON
    - 고급
      - 코드활성화 - 적용
  - 클라이언트아이디 : `rest api key`
  - 비밀 키 : `고급` - `client secret`

```html
# accounts-form.html
## 추가
{% raw %}{% load socialaccount %}{% endraw %}
{% raw %}{% if request.resolver_match.url_name == 'signup' %}{% endraw %}
	<a href="{% raw %}{% provider_login_url 'kakao' method='oauth2' %}{% endraw %}">카카오로그인</a>
{% raw %}{% endif %}{% endraw %}
```



```python
# setting.py
## 추가
LOGIN_REDIRECT_URL  = 'posts:list'
```



- 추가적으로 해야하는 것
  - 비밀번호 찾기
  - 회원탈퇴













