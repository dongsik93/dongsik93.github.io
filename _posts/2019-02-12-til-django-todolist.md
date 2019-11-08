---
layout: post
title: "django"
subtitle: "django todolist"
date: 2019-02-12 18:00:00 +0900
categories: til
tags: django
comments: true
---

## 190212



### todolist



- app 2개 : account // todo



account - 회원가입 로직

todo - crud 





##### todo



```python
#todo urls.py
from django.url import path
from . import views

app_name = "todos"

urlpatterns = [
    path("", views.list, name="list"),
]
```



```python
#todo views.py
from django.shortcuts import render

def list(request):
    return render(request, "todo/list.html")
```



```html
# base.html은 todolist에 templates폴더내에 따로 만들어서 account와 todo가 같이 접근하게 
```



```html
#todo list.html
{% raw %}{% extends "base.html" %}{% endraw %}
## setting.py에 TEMPLATES_DIR로 설정을 해줬으니까 접근이 쉬움
{% raw %}{% block bb %}{% endraw %}

    <h1>list page</h1>

{% raw %}{% endblock %}{% endraw %}
```



##### account



```python
#account urls.py
from django.url import path
from . import views

app_name = "accounts"

urlpatterns = [
    path("signup/", views.signup, name="signup"),
]
```



```python
#account views.py
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm

def signup(request):
    if(request.method == "POST"):
        form = UserCreationForm(request.POST)
        if(form.is_valid()):
            user = form.save()
            auth_login(request, user)
            return redirect("todos:list")
    else:
        form = UserCreationForm()
    return render(request, "account/form.html", {"form":form})
```



```shell
# model설정 안해주고 migrate만 해주기
$ python manage.py migrate
```



```html
#account signup.html
{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% block bb %}{% endraw %}

    {{form.as_p}}

{% raw %}{% endblock %}{% endraw %}
```



```html
# base.html 추가
 <ul>
     <li><a href="{% raw %}{% url 'accounts:signup' %}{% endraw %}">회원가입</a></li>
     <li><a href="{% raw %}{% url 'accounts:login' %}{% endraw %}">로그인</a></li>
     <li></li>
</ul>
```



```python
#account urls.py
path("login/", views.login, name="login"),
```



```python
#account views.py
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login

def login(request):
    if(request.method == "POST"):
        form = AuthenticationForm(request, request.POST)
        if(form.is_valid()):
            # form.save는 데이터베이스에 저장하는게 아니라 session에 저장
            auth_login(request, form.get_user())
            return redirect("todos:list")
    else:
        form = AuthenticationForm()
        
    return render(request, "account/form.html", {"form":form})
```



```html
# base.html 추가
<ul>
    {% raw %}{% if user.is_authenticated %}
    <p>로그인함!!!</p>
    <p>{{user}}님 안녕하세요</p>
    <li><a href="{% raw %}{% url 'accounts:logout' %}{% endraw %}">로그아웃</a></li>
    {% raw %}{% else %}
    <li><a href="{% raw %}{% url 'accounts:signup' %}{% endraw %}">회원가입</a></li>
    <li><a href="{% raw %}{% url 'accounts:login' %}{% endraw %}">로그인</a></li>
    {% raw %}{% endif %}
    <li><a href=""></a></li>
</ul>
```

- if문 : login 상태면 true



```python
#account urls.py

path("logout/", views.logout, name="logout"),
```



```python
#account views.py
from django.contrib.auth import logout as auth_logout

def logout(request):
    auth_logout(request)
    return redirect("accounts:login")
```



##### todo



```python
#todo models.py
from django.db import models
from django.conf import settings

class Todo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    
    def __str__(self):
        return self.title
```



```python
#todo urls.py
path("create/", views.create, name="create"),
```



```python
#todo views.py
def create(request):
    if(request.method == "POST"):
        form = TodoModelForm(request.POST)
        if(form.is_valid()):
            todo = form.save(commit=False)
            todo.user = request.user
            todo.save()
            return redirect("todos:list")
    else:
        form = TodoModelForm()
    return render(request, "todo/create.html", {"form":form})
```



```python
#todo forms.py
from django import forms
from .models import Todo

class TodoModelForm(forms.ModelForm):
    class Meta:
        model = Todo
        # fields = '__all__' 로 해주면 사용자에게 모든 유저정보가 나타남
        ## list형태로 원하는 column만 넣을 수 있음
        fields = ['title']
```



```html
#todo create.html

{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% block bb %}{% endraw %}
    
    <form method="POST">
        {% raw %}{% csrf_token %}{% endraw %}
        {{form.as_p}}
        <input type="submit" value="Submit"/>
    </form>

{% raw %}{% endblock %}{% endraw %}
```



- 로그인을 한 유저만 create할 수 있게

```python
from django.contrib.auth.decorators import login_required

@login_required    
def create(request):
    
# 데코레이터라는 이름으로 함수를 실행하기 전에 먼저 실행해줌
## 로그인을 했으면 그대로 create를 실행시키고 로그인이 안되어 있으면 로그인 페이지로 보여줌
```



```html
# base.html
<li><a href="{% raw %}{% url 'todos:create' %}{% endraw %}">글작성</a></li>

## 글작성을 눌러도 로그인이 안되어 있으면 해당 링크로 안넘어가짐
### @login_required의 기능
```



- list 페이지에 현재 로그인한 사람의 정보만 보주기
- 로그인 안한사람은 글도 못보게하기

```python
#todo views.py 수정
@login_required
def list(request):
    # todos = Todo.objects.all()
    todos = request.user.todo_set
    return render(request, "todo/list.html", {"todos":todos})todos = request.user.todo_set

```



##### delete



```python
#todo urls.py
path("<int:id>/delete/", views.delete, name="delete"),
```



```python
#todo views.py
def delete(request, id):
    todo = Todo.objects.get(pk=id)
    todo.delete()
    return redirect("todos:list")
```



```html
# list.html 추가
<a href="{% raw %}{% url 'todos:delete' todo.id %}{% endraw %}">삭제</a>
```









