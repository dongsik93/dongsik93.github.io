---
layout: post
title: "FakeInsta"
subtitle: "fake-insta3"
date: 2019-04-10 18:00:00 +0900
categories: pro
tags: FakeInsta
comments: true
---

## 회원가입, 로그인기능 추가

## 190410



- `__init__.py` :  패키지화 시켜줌



### fake-insta3

- 회원가입 / 로그인 기능 추가



- ##### 회원가입 

  - 새로운 app을 만들면서 시작 : `$ django-admin startapp accounts`
    - 앱 만들면 `settings.py` 에 `installed_apps` 에 추가해 줘야 함
      - 원래 앱을 `accounts`로 추가하는걸 권장하지 않음 : `accounts.app.AccountsConfig` 
    - 혹시 app이름을 잘못한 경우 해당 앱에 `apps.py`에 들어가서 클래스 이름과 안의 이름을 같이 수정해야 함



```python
# insta-urls.py
## 추가
path('accounts/', include('accounts.urls')),
```

- `accounts` 에 `urls.py` 생성

```python
# accounts-urls.py
from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    # 회원가입
    path('signup/', views.signup, name="signup"),
]
```

- 모델 정의
  - 기존에 만들어진걸 가져다 씀, 나중에 커스터마이징
  - 장고에서는 암호화 과정이 잘 되어 있어서 따로 라이브러리를 불러서 암호화 할 필요가 없음
  - password는 안건드림

```python
# accounts-views.py
## 라이브러리 불러오기
from django.contrib.auth.forms import  UserCreationForm

def signup(request):
    if(request.method == "POST"):
        pass
    else:
        form = UserCreationForm()
        
    return render(request, "accounts/signup.html", {"form":form})
```

- `UserCreationForm` 에 저장되어있는 정보들

```html
<tr><th><label for="id_username">Username:</label></th><td><input type="text" name="username" maxlength="150" autofocus required id="id_username"><br><span class="helptext">Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.</span></td></tr>
<tr><th><label for="id_password1">Password:</label></th><td><input type="password" name="password1" required id="id_password1"><br><span class="helptext"><ul><li>Your password can&#39;t be too similar to your other personal information.</li><li>Your password must contain at least 8 characters.</li><li>Your password can&#39;t be a commonly used password.</li><li>Your password can&#39;t be entirely numeric.</li></ul></span></td></tr>
<tr><th><label for="id_password2">Password confirmation:</label></th><td><input type="password" name="password2" required id="id_password2"><br><span class="helptext">Enter the same password as before, for verification.</span></td></tr>
```

```html
# signup.html
{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    <form action="" method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        {{form}}
        <input type="submit" name=""/>
    </form>
{% raw %}{% endblock %}{% endraw %}
```

- `form`은 왜 `form태그`와 `csrf_token` 를 포함하지 않고 있을까?
  - 하나의 폼에서 `post_form`과`image_form`을 동시에 보여줄 때 포함하고 있으면 안됨
  - 따라서 여러개의 폼을 필요로 할 때를 위해 `input`만 가지고 있음

```python
# accounts-views.py
from django.shortcuts import render, redirect
from django.contrib.auth.forms import  UserCreationForm

def signup(request):
    if(request.method == "POST"):
        # post방식
        form = UserCreationForm(request.POST)
        if(form.is_valid()):
            form.save()
            return redirect("posts:list")
    else:
        # get방식
        form = UserCreationForm()
        
    return render(request, "accounts/signup.html", {"form":form})
```

- 회원가입 test해보고 `admin페이지`에서 확인

- signup.html 꾸미기

```html
# singup.html
{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% load bootstrap4 %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    <form action="" method="post">
       {% raw %} {% csrf_token %}{% endraw %}
        {% raw %}{% bootstrap_form form %}{% endraw %}
        <input type="submit" name=""/>
    </form>
{% raw %}{% endblock %}{% endraw %}
```

- 한글로 하고싶으면 `settings.py` 에서 `language code`를 `ko-kr`로 수정
  - 국제화 : Internationalization

- commit



- ##### 로그인

  - migrate할 때 사용자 로그인 정보를 저장하기위해 `django_sessions`라는 테이블을 만듦
  - session을 이용해 로그인 로그아웃관리
  - django의 default설정인 `login`으로 ..
  - Authentication : 인증
  - Authorization : 권한부여
  - signup.html을 form.html로 수정해서 하나의 html로 회원가입과 로그인을 사용
    - 이때 하나의 페이지를 공유하는데 어떻게 `login`페이지 인지`singup`페이지인지 ?
      - 분기처리를 통해서
      - 아니면 html페이지를 두개 만들면 해결~

```python
# accounts-urls.py
path('login/', views.login, name="login"),
```

```python
# accounts-views.py
## 라이브러리 가져오기
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login

def login(request):
    if(request.method == "POST"):
        form = AuthenticationForm(request, request.POST) # AuthenticationForm은 앞에 request를 넣어줘야 함
        if(form.is_valid()):
            auth_login(request, form.get_user())
            return redirect("posts:list")
    else:
        
        form = AuthenticationForm()
    
    return render(request, "accounts/form.html", {"form":form})
```

```html
# accounts-form.html
{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% load bootstrap4 %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    {% raw %}{% if request.resolver_match.url_name == 'signup' %}{% endraw %}
        <h1>signup</h1>
    {% raw %}{% else %}{% endraw %}
        <h1>login</h1>
    {% raw %}{% endif %}{% endraw %}
    <form action="" method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        {% raw %}{% bootstrap_form form %}{% endraw %}
        <input type="submit" name=""/>
    </form>
{% raw %}{% endblock %}{% endraw %}
```



- ##### 로그아웃

  - 유저가 가지고 있는 session을 없애는것

```python 
# accounts-urls.py
path('logout/', views.logout, name="logout"),
```



```python
# accounts-views.py
from django.contrib.auth import logout as auth_logout

def logout(request):
    auth_logout(request)
    return redirect("posts:list")
```



- 상태바 꾸미기

```html
# base.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Instagram</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
</head>
<body>
    <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light px-5">
        <a class="navbar-brand" href="{% raw %}{% url 'posts:list' %}{% endraw %}">
            <i class="fab fa-instagram"></i> | Instagram
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
    
        <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul class="navbar-nav">
                {% raw %}{% if user.is_authenticated %}{% endraw %}
                <!--글쓰기, 마이페이지, 로그아웃-->
                    <li class="nav-item">
                        <a class="nav-link" href="{% raw %}{% url 'posts:create' %}{% endraw %}">New</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">MyPage</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{% raw %}{% url 'accounts:logout %}{% endraw %}">Logout</a>
                    </li>
                {% raw %}{% else %}{% endraw %}
                <!--로그인, 회원가입-->
                    <li class="nav-item">
                        <a class="nav-link" href="{% raw %}{% url 'accounts:login %}{% endraw %}">Login</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{% raw %}{% url 'accounts:signup %}{% endraw %}">Signup</a>
                    </li>
                {% raw %}{% endif %}{% endraw %}
            </ul>
        </div>
    </nav>
    <div class="container">
      {% raw %}{% block body %}{% endraw %}
      {% raw %}{% endblock %}{% endraw %}
    </div>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>
</html>
```

- commit



- ##### 로그인한 상태에서 게시물 불러올수있게

  - 이제 `create`는 로그인을 하지 않으면 접근할 수 없게 바뀜

```python
# posts-views.py
from django.contrib.auth.decorators import login_required

## 요기에 데코레이터를 붙여주면 됨
### create를 실행하기 전에 login_required를 실행시켜줌
@login_required
def create(request):
```



- ##### 사용자가 자기가 게시물을 여러개 가질 수 있게 관계 설정

```python
# posts-models.py
from django.conf import settings

class Post(models.Model):
    content = models.CharField(max_length=100)
    # 추가
    ## 실제로 user = settings.AUTH_USER_MODEL는 user = 'User'와 같은 말
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

```

- makemigrations -> 하고나면 오류가 나옴 
  - 그 이유는 이미 게시물이 생성되어있고 거기에 추가로 넣어줘야 하는데 

```
1) Provide a one-off default now (will be set on all existing rows with a null value for this column) 
2) Quit, and let me add a default in models.py
Select an option: 1
# 1은 유저의 값이 없을 때 default값을 1로 주겠다라는 의미
```

- 

```python
# insta-forms.py
## '__all__'을 수정
fields = ['content',]
```



- 누가 작성했는지에 대한 정보를 추가

```python
# posts-views.py
## 수정
if(post_form.is_valid()):
    post = post_form.save(commit=False)
    post.user = request.user
    post.save()
```



```html
# _post.html
## 추가
 <div class="card-header">
    <h5 class="card-text">{{post.user}}</h5>
  </div>
```

- 수정요청을 자기 자신거만 가능하게끔

```python
# posts-views.py
## 추가
@login_required
def update(request, id):
    post = Post.objects.get(id=id)
    if(post.user == request.user):
        if(request.method == "POST"):
            post_form = PostForm(request.POST, instance=post)
            if(post_form.is_valid()):
                post_form.save()
                return redirect("posts:list")
        else:
            # post를 인스턴스로 
            post_form = PostForm(instance=post)
             
        return render(request, 'posts/form.html', {"post_form":post_form})
    else:
        # 다른사람이 수정 요청을 보냈을 때
        return redirect('posts:list')

```

- 권한이 있는 사람에게만 수정요청을 가능하게

```html
# _post.html

{% raw %}{% if %}{% endraw %}
<a href="{% raw %}{% url 'posts:update' post.id %}{% endraw %}" class="btn btn-warning">수정</a>
<a href="{% raw %}{% url 'posts:delete' post.id %}{% endraw %}" class="btn btn-danger">삭제</a>
{% raw %}{% endif %}{% endraw %}
```

```python
# posts-views.py
## delete
@login_required
def delete(request, id):
    post = Post.objects.get(id=id)
    if (post.user == request.user):
        post.delete()
    else:
        # 다른 사람일 때
        return redirect("posts:list")
    return redirect("posts:list")
```

