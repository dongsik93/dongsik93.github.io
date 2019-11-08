---
layout: post
title: "django"
subtitle: "django restful"
date: 2019-02-07 18:00:00 +0900
categories: til
tags: django
comments: true
---


### CRUD를 restful하게 바꿔보기 + image 업로드





#### crud = function based view     ||      class based view



### Restful

new / create 묶기

edit / update 묶기

```python
# photo urls.py
from django.urls import path
from . import views

app_name= "photos"

urlpatterns = [
    path("", views.list, name="list"),
    # / 오류 적게?
    ## class based view에서 list를 사용
]
```



```python
# photo views.py
from django.shortcuts import render

def list(request):
    return render(request, "photo/list.html")
```



```python
# base.html 생성 후 list.html 생성
```



```html
# base.html

	<!--예전에 쓰던 url 코드-->
<li><a href="/photos/list/">Home</a></li>

	<!--앞으로 바꿀 url 코드-->
	<!--변수처럼 사용! -->
<li><a href="{% raw %}{% url 'photos:list '%}{% endraw %}">Home</a></li>
<li><a href="{% raw %}{% url 'photos:create' %}{% endraw %}">Create</a></li>
```



#### 글작성(create)

```python
# photo urls.py

# new를 만들지 않는다~
# 하나로 통합! --> restful하다
path("create/", views.create, name="create"),
```



```python
# models.py
from django.db import models

class Photo(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    
```



```shell
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py createsuperuser
```



```python
# photo admin.py
from django.contrib import admin
from .models import Photo

admin.site.register(Photo)
```



```python
# photo views.py
## 지금껏 create / new라는 두개의 url로 create를 구현
### get방식 create 1개랑
### post방식 create 1개를 나누어서 분리 구현
def create(request):
    if(request.method == "POST"):
        # POST방식으로 들어왔을 때
        # 데이터를 저장
        
        pass
    else:
        # GET방식으로 들어왔을 때
        # 입력할 수 있게 폼을 제공
        return render(request, "photo/create.html")
```



get방식

```html
# create.html
{% raw %}{% extends "photo/base.html" %}{% endraw %}

{% raw %}{% block bb %}
	# action을 없애고 메소드만 POST로
    ## action을 지정해 주지 않아도 photos/create/로 ...
    ## 기본적을 지정해 주지 않았을 때 현재의 url로 방식만 POST로 바꿔서 		   그대로 보내주게 됨
    <form method="POST">
        {% raw %}{% csrf_token %}{% endraw %}
        <input type="text" name="title"/>
        <input type="text" name="content"/>
        <input type="submit" value="Submit"/>
    </form>

{% raw %}{% endblock %}{% endraw %}
```



```python
# photo views.py
## 지금껏 create / new라는 두개의 url로 create를 구현
### get방식 create 1개랑
### post방식 create 1개를 나누어서 분리 구현
def create(request):
    if(request.method == "POST"):
        # POST방식으로 들어왔을 때
        # 데이터를 저장
        title = request.POST.get("title")
        content = request.POST.get("content")
        
        Photo.objects.create(title=title, content=content)
        
        return redirect("photos:list")
    else:
        # GET방식으로 들어왔을 때
        # 입력할 수 있게 폼을 제공
        return render(request, "photo/create.html")

```



##### 리스트페이지에 보여주기

```python
# views.py
def list(request):
    photos = Photo.objects.all()
    return render(request, "photo/list.html", {"photos":photos})
```



```html
# list.html
{% raw %}{% extends "photo/base.html" %}{% endraw %}

{% raw %}{% block bb %}{% endraw %}

    <h1>여기는 리스트 페이지</h1>
    
    {% raw %}{% for photo in photos %}
    <h3>{{photo.title}}</h3>
    {% raw %}{% endfor %}{% endraw %}
{% raw %}{% endblock%}{% endraw %}
```



#### 읽기(read) - detail

```python
# photo urls.py
path("<int:id>/", views.detail, name="detail")
```



```python
# photo views.py
def detail(request, id):
    photo = Photo.objects.get(id=id)
    
    return render("photos/detail.html", {"photo":photo})
```



```html
# detail.html
{% raw %}{% extends "photo/base.html" %}{% endraw %}

{% raw %}{% block bb %}{% endraw %}

    <h2>{{photo.title}}</h2>
    <h3>{{photo.content}}</h3>
    <h4>{{photo.created_at}}</h4>
    <h4>{{photo.updated_at}}</h4>

{% raw %}{% endblock%}{% endraw %}
```



#### update



```python
# photo views.py
def update(request,id):
    if(request.method == "POST"):
        photo = Photo.objects.get(pk=id)
    
        title = request.POST.get("title")
        content = request.POST.get("content")
        
        photo.title = title
        photo.content = content
        photo.save()
        
        return redirect("photos:detail", photo.id)
    
    else:
        photo = Photo.objects.get(pk=id)
        return render(request, "photo/update.html", {"photo":photo} )
    
```



```html
# update.html
{% raw %}{% extends "photo/base.html" %}{% endraw %}

{% raw %}{% block bb %}{% endraw %}

    <form method="POST">
        {% raw %}{% csrf_token %}{% endraw %}
        <input type="text" name="title" value="{{photo.title}}"/>
        <input type="text" name="content" value="{{photo.content}}"/>
        <input type="submit" value="Submit"/>
    </form>

{% raw %}{% endblock %}{% endraw %}
```



#### delete



```python
# photo urls.py
path("<int:id>/delete/", views.delete, name="delete"),
```



```python
# photo views.py
def delete(request, id):
    photo = Photo.objects.get(pk=id)
    photo.delete()
    
    return redirect("photos:list")
```



```html
# detail.html
<a href="{% raw %}{% url 'photos:delete' photo.id %}{% endraw %}">삭제</a> 
```



### 정적파일 static



- static 폴더안에 base.css생성

- static 폴더안에 css , img, js, 폴더로 따로따로 만들어서 정리
- setting.py 안에 121 line STATIC_URL = 에 따로 경로



```css
# static base.css
h1 {
    color:red;
}
```



```html
# photo base.html
<!-- 맨 위에 -->
{% raw %}{% load static %}{% endraw %}

<!-- head부분에 추가 -->
<link rel="stylesheet" href="{% raw %}{% static 'base.css' %}{% endraw %}" type="text/css" />
```



```html
<!-- 파비콘 넣기 -->
<link rel="shortcut icon" href="{% raw %}{% static 'img/a.jpg' %}{% endraw %}">
```



#### 404 page



#### 사용자가  입력한 이미지 column 추가

##### 폼 구성

```python
# models.py
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill, ResizeToFit

image = models.ImageField(blank=True)
```



```shell
# 외부라이브러리 추가 (ImageField를 사용하기 위해)
$ pip install Pillow
$ pip install pilkit
$ pip install django-imagekit
```



```shell
$ python manage.py makemigrations
$ python manage.py migrate
```



```python
# photo create.html에 추가
## 파일 업로드시 form에 enctype 추가
<form method="POST" enctype="multipart/form-data">
## 이미지 형식 아니면 안받겠다
<input type="file" name="image" accept="image/*"/>
```



##### 저장

```python
# photo views.py
## create에 추가
image = request.FILES.get("image")
```



```html
# detail.html 추가
<img src="{{photo.image.url}}" alt="{{photo.image}}"></img>
```



```python
# setting.py
## 이미지 업로드된 장소를 지정해주기 위해
### 맨 밑에
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
```



```python
# mysite urls.py
# django static 파일을 넣으려면 추가
from django.conf.urls.static import static
from django.conf import settings

## 위에 urlpatterns에 추가 
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```



#### 이미지 리사이징

- 원본 / 서비스 / 섬네일 3가지 사이즈로 



- 이미지 리사이징을 위한 라이브러리 설치

```shell
$ pip install pilkit
$ pip install django-imagekit
```



```python
# setting.py
INSTALLED_APPS에 추가
'imagekit',
```



```python
# models.py
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill, ResizeToFit

# 기존 image를 주석
image = ProcessedImageField(
    upload_to = "photo/image",
    processors = [ResizeToFill(150, 150)],
    format = 'JPEG',
    options = {"quality":90}
)
```



makemigrations / migrate

- 필드가 바뀔때는 다시해야하지만 안의 함수를 수정할 때는 상관 없음



#### 댓글달기









