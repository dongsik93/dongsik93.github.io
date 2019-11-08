---
layout: post
title: "django"
subtitle: "django crud"
date: 2019-01-29 18:00:00 +0900
categories: til
tags: django
comments: true
---

### octotree 설치

- 트리구조로 좀 더 편리하게 볼 수 있음





#### `__str__` 

- 단순히 객체 자체를 찍어주는 친구인데 오버라이드를 통해 이름을 출력하게 해줌

```python
# models.py
from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=20)
    email = models.CharField(max_length=50)
    birthday = models.DateField()
    age = models.IntegerField()
    
    def __str__(self):
        return self.name
```



### 

### Todo list - CRUD



#### 기초 뼈대 만들기

```python
# mysite urls.py

path("todos/", include("todo.urls"))
```



```python
# todo라는 app안에 urls.py 생성 
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
    # todos/ 
]
```



```python
# todo views.py
from django.shortcuts import render

def index(request):
    return render(request, "todo/index.html")
```



```python
# todo 안에 templates폴더 생성하고 그 안에 todo폴더 하나 더 만들고 거기에 index.html
# base.html을 만들고 그거를 extends
```



```html
# base.

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Todoapp</title>
</head>
<body>
    {% raw %} {% block bodyblock %} {% endraw %}
    {% raw %} {% endblock %} {% endraw %}
</body>
</html>
```



```html
# index.html

{% raw %}{% extends "todo/base.html" %}{% endraw %}

{% raw %}{% block bodyblock %}{% endraw %}
<h1>여기는 인덱스</h1>
{% raw %}{% endblock %}{% endraw %}
```



#### 모델링



```python
# todo models.py
from django.db import models

class Todo(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    due_date = models.DateField()
    
    def __str__(self):
        return self.title
```



```python
# 데이터베이스 구조 만들기
$ python manage.py makemigrations
$ python manage.py migrate
```



```python
# todo admin.py
from django.contrib import admin
from .models import Todo

admin.stie.register(Todo)
```



#### 생성(post) - create



```python
# todo urls.py
path("new/", views.new),
```



```python
# todo views.py
def new(request):
    return render(request, "todo/new.html")
```



```html
# new.html 생성
{% raw %}{% extends "todo/base.html" %}{% endraw %}

{% raw %}{% block bodyblock %}{% endraw %}
    <form action="/todos/create/" method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        <input type="text" name="title"/>
        <input type="text" name="content"/>
        <input type="date" name="due_date"/>
        <input type="submit" value="Submit"/>
    </form>
{% raw %}{% endblock %}{% endraw %}
```



```python
# todo urls.py
path("create/", views.create),
```



```python
# todo views.py
# 받아온 데이터를 가져오고, 데이터베이스에 저장
def create(request):
    title = request.POST.get("title")
    content = request.POST.get("content")
    due_date = request.POST.get("due_date")
    
    todo = Todo(title=title, content=content, due_date=due_date)
    todo.save()
    
    ## 위 두줄을 줄인 형태
    #Todo.objects.create(title=title, content=content, due_date=due_date)
    
    return redirect("/todos")
```



```python
# mysite setting.py
LANGUAGE_CODE = 'ko-kr'
TIME_ZONE = 'Asia/Seoul'
```



#### 읽기 - read



```python 
# todo views.py
## index페이지에 전체 내용이 나오게 추가해줌
def index(request):
    todos = Todo.objects.all()
    return render(request, "todo/index.html", {"todos":todos})
```



```html
# index.html
{% raw %}{% for todo in todos %}{% endraw %}
        <h3>{{todo.title}}</h3>
        <p>{{todo.due_date}}</p>
        <hr>
{% raw %}{% endfor %}{% endraw %}
```



```python
# todo views.py
todos = Todo.objects.order_by("due_date").all()
```



```python
# todo urls.py
## variable routing
path("<int:id>/", views.read),
```



```python
# todo views.py
def read(request, id):
    todo = Todo.objects.get(pk=id)
    
    return render(request, "todo/read.html",{"todo":todo})
```



```html
# read.html
## read.html에 전체내용 추가
{% raw %}{% extends "todo/base.html" %}{% endraw %}

{% raw %}{% block bodyblock %}{% endraw %}
    <h1>{{todo.title}}</h1>
    <h3>{{todo.content}}</h3>
    <h4>{{todo.due_date}}</h4>
{% raw %}{% endblock %}{% endraw %}
```



```html
# index.html
## 누르면 read.html로 넘어가는 a태그 추가

<a href="/todos/{{todo.id}}/">할일보기</a>
or
<a href="/todos/{{todo.pk}}/">할일보기</a>
```



#### 지우기 - delete



```python
# todo urls.py
path("<int:id>/delete/", views.delete),
```



```python
# todo views.py
## 삭제 후 index페이지로
def delete(request, id):
    todo = Todo.objects.get(pk=id)
    todo.delete()
    
    return redirect("/todos")
```



```html
# read.html 에 삭제버튼 만들기
## 삭제 확인 메세지까지 
<a href="/todos/{{todo.id}}/delete/">삭제</a>
```



#### 수정하기 - update



```python
# todo urls.py
path("<int:id>/edit/", views.edit),
path("<int:id>/update/", views.update),
```



```python
# todo views.py

## 사용자에게 수정을 위한 정보를 불러다주는..
def edit(request, id):
    todo = Todo.objects.get(pk=id)
    return render(request, "todo/edit.html", {"todo":todo})
```



```html
# edit.html 생성
{% raw %}{% extends "todo/base.html" %}{% endraw %}

{% raw %}{% block bodyblock %}{% endraw %}
    <form action="/todos/{{todo.id}}/update/" method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        <input type="text" name="title" value="{{todo.title}}"/>
        <input type="text" name="content" value="{{todo.content}}"/>
        <input type="date" name="due_date" value="{{todo.due_date|date:'Y-m-d'}}"/>
        <input type="submit" value="Submit"/>
    </form>
{% raw %}{% endblock %}{% endraw %}
```



```python
# todo views.py 
## 수정된 내용을 update하는 내용

def update(request, id):
    todo = Todo.objects.get(pk=id)
    
    title = request.POST.get("title")
    content = request.POST.get("content")
    due_date = request.POST.get("due_date")
    
    # 수정된 내용을 원본에 저장
    todo.title = title
    todo.content = content
    todo.due_date = due_date
    todo.save()
    
    return redirect(f"/todos/{id}/")
```



```html
# read.html에 수정버튼 달기
<a href="/todos/{{todo.id}}/edit/">수정</a>
```





### Class 연습

pokemon.py

- 인스턴스를 다른 인스턴스의 변수로 넣기







































