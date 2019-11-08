---
layout: post
title: "FakeInsta"
subtitle: "fake-insta1"
date: 2019-04-08 18:00:00 +0900
categories: pro
tags: FakeInsta
comments: true
---

## CRUD logic 

## 190408

### django fake-insta

#### CRUD 복습



- c9과 장고2.2버젼의 충돌로 버젼관리 필요

- 장고버젼 2.2에서 2.1.8으로 다운그레이드( 지우고 재설치)

```
$ pip uninstall django 
$ pip install django==2.1.8
```



- 기능이 추가될 때마다 git을 할 예정

```terminal
$ django-admin startproject insta
$ django-admin startapp posts
```



- ##### 기본 설정

```python
# setting.py
ALLOWED_HOSTS = ["*"]
INSTALLED_APPS = ['posts',] # 추가
```

 ```python
# insta-urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('posts/', include('posts.urls'))
]
 ```

```python
# posts-urls.py
from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    path('', views.list, name='list'),     
]
```

```python
# posts-views
from django.shortcuts import render

def list(request):
    pass
```

- 여기까지 기본 설정, commit 남기기
- 커밋시점은 개인적이나 기능이 추가될 때 하는게 일반적



- ##### 모델생성

```python
from django.db import models

class Post(models.Model):
    content = models.CharField(max_length=100)
```

- 모델생성 후 마이그레이션

```terminal
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py createsuperuser
$ python manage.py runserver $IP:$PORT
```

- commit



- 공용폴더 설정을 위해

```python
# setting.py
TEMPLATES = [
	'DIRS': [os.path.join(BASE_DIR, 'templates')],
]
```

- 루트에 templates폴더 생성
- templates폴더에 base.html 생성

```html
# base.html

```



```python
# views.py
from django.shortcuts import render

def list(request):
    return render(request, "posts/list.html")
```



- list.html 은 posts폴더 안에 templates생성후 posts폴더 안에 생성해야함

```html
# list.html
{% raw %}{% extends 'base.html' %}{% endraw %}
{% raw %}{% block body %}{% endraw %}

    <h1>여기는 리스트 페이지</h1>


{% raw %}{% endblock %}{% endraw %}
```



- ##### Nav bar만들기

  - bootstrap , fontawesome
  - new / mypage링크 달기

```html
# base.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>insta</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
</head>
<body>
    <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light px-5">
        <a class="navbar-brand" href="#">
            <i class="fab fa-instagram"></i> | Instagram
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
    
        <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="#">New</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">MyPage</a>
                </li>
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



- #### CRUD작성

- ##### Create

```python
# posts-urls.py
path('create/', views.create, name='create'), # 추가
```

- 모델폼 - forms.py생성
- ModelForm
  - 폼은 자동으로 html코드 작성 없이 form을 만들어줌
  - 많을수록 더 편함
  - input tag만 존재
  - 입력 시 오류가 발생하면 폼에 입력되어 있던 내용이 그대로 유지됨

```python
# posts-forms.py
# 선언
from django import forms
from .models import Post

class PostForm(forms.ModelForm): # forms안에 ModelForm을 상속
    class Meta:
        model = Post
        fields = '__all__'
```



```python
# posts-views.py
from .forms import PostForm
def create(request):
    # 1. get방식으로 데이터를 입력할 form을 요청한다
    if(request.method == "POST"):
        pass
    else:
        # 2. PostForm을 인스턴스화 시켜서 form이라는 변수에 저장
        form = PostForm()
    # 3. form을 담아서 create.html을 보내줌
    return render(request, "posts/list.html", {"form":form})
```



```html
# posts-create.html
{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    <form action="" method="post">
        # action이 ""인 이유 : post와 get방식 모두 create로 보내기만 하면 되기 때문에 
        ## action에 "" 비어있으면 자기 자신으로 다시 요청을 보냄 (posts/create로)
        ### 즉 get방식으로 들어오면 자기 자신을 다시 불러 post방식으로 처리
        #### 그리고 create와 update를 하나의 html로 관리하기 위해 action을 비워둠
       {% raw %}{% csrf_token %}{% endraw %}
        {{form}}   
        <input type="submit">
	</form>
{% raw %}{% endblock %}{% endraw %}
```



```python
# posts-views.py
def create(request):
        # 1번부터 순서대로
    # 1. get방식으로 데이터를 입력할 form을 요청한다
    # 4. 사용자는 데이터를 input에 입력해서 post방식으로 요청
    # 9. 사용자가 적절한 데이터를 입력해서 다시 post방식으로 요청
    if(request.method == "POST"):
        # 5. post방식으로 저장요청을 받고, 데이터를 받아 PostForm에 넣어서 인스턴스화 한다
        # 10. 5번과 동일
        form = PostForm(request.POST) # 앞의 PostForm은 모델폼이고 request.Post는 입력한 내용
        # 6. 데이터 validation (검증)
        # 11. 6번과 동일
        if(form.is_valid()):
            # 12. 적정한 데이터가 들어온 경우, 데이터를 저장하고 list페이지로 리다이렉트
            form.save()
            return redirect('posts:list')
        else:
            # 7. 적절하지 않은 데이터가 들어온 경우
            ## else는 생략해도 됨
            pass  
    else:
        # 2. PostForm을 인스턴스화 시켜서 form이라는 변수에 저장
        form = PostForm()
    
    # 3. form을 담아서 create.html을 보내줌
    # 8. 사용자가 입력한 데이터는 form에 담아진 상태로 다시 form을 담아서 create.html을 보내준다.
    ## 8번은 사용자가 잘못 입력 했을 때 그대로 담아진 내용을 보내주는 것(ModelForm의 장점?)
    return render(request, "posts/create.html", {"form":form})
```

- admin 페이지에서 확인

```python
# admin.py
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

- 폼을 예쁘게 바꾸기 위해

```terminal
$ pip install django-bootstrap4
```

- create.html 수정

```html
# create.html
{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% load bootstrap4 %}{% endraw %}
{% raw %}{% block body %}{% endraw %}

    <form action="" method="post">
       {% raw %} {% csrf_token %}{% endraw %}
        {% raw %}{% bootstrap_form form %}{% endraw %}
        <input type="submit">
    </form>

{% raw %}{% endblock %}{% endraw %}
```

- 리스트 페이지

```python
# views.py
from .models import Post

def list(request):
    posts = Post.objects.all()
    return render(request, "posts/list.html", {'posts':posts})
```



- include = posts/_post.html에 끼워넣기
- for문 만큼 

```html
# list.html
{% raw %}{% extends 'base.html' %}{% endraw %}
{% raw %}{% block body %}{% endraw %}

   {% raw %} {% for post in posts %}{% endraw %}
      {% raw %}  {% include 'posts/_post.html' %}{% endraw %}
    {% raw %}{% endfor %}{% endraw %}
    
{% raw %}{% endblock %}{% endraw %}
```

```html
# _post.html
<div class="card">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <p class="card-text">{{post.content}}</p>
  </div>
</div>
```

- commit



- #### Update



```python
# posts-urls.py
    path('<int:id>/update/', views.update, name="update"),
```

- create.html을 form.html로 수정

```python
# views.py
def update(request, id):
    post = Post.objects.get(id=id)
    if(request.method == "POST"):
        form = PostForm(request.POST, instance=post)
        if(form.is_valid()):
            form.save()
            return redirect("posts:list")
    else:
        # post를 인스턴스로 
        form = PostForm(instance=post)
         
    return render(request, 'posts/form.html', {"form":form})
```

- commit 



- base.html수정

```html
# base.html url 경로 수정
<a class="navbar-brand" href="{% raw %}{% url 'posts:list' %}{% endraw %}">
    <a class="nav-link" href="{% raw %}{% url 'posts:create' %}{% endraw %}">New</a>
```

```
# _post.html 수정버튼 달기
<a href="{% raw %}{% url 'posts:update' post.id %}{% endraw %}" class="btn btn-warning">수정</a>
```

- #### Delete

```python
# urls.py
    path('<int:id>/delete/', views.delete, name="delete"),
```

```python
# views.py
def delete(request, id):
    post = Post.objects.get(id=id)
    post.delete()
    return redirect("posts:list")
```

```html
# _post.html
    <a href="{% raw %}{% url 'posts:delete' post.id %}{% endraw %}" class="btn btn-danger">삭제</a>

```



