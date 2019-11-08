---
layout: post
title: "django"
subtitle: "django crud"
date: 2019-02-11 18:00:00 +0900
categories: til
tags: django
comments: true
---


## form이라는 클래스를 통해 많은양의 칼럼이 있을 때 쉽게 할수 있음



### 프로젝트 04에서의 불편함? 을 해소

#### Create / list



##### 기본설정

```python
# movie urls.py
from django.urls import path
from . import views

app_name = "moviews"
## name 을 써주기 위해 app_name설정

urlpatterns = [
    path("", views.list, name="list"),
    path("create/", views.create, name="create"),
]
```



```python
# movie views.py
from django.shortcuts import render


def list(request):
    pass

def create(request):
    pass
```



##### 모델

```python
# movie models.py
from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=100)
    title_en = models.CharField(max_length=100)
    audience = models.IntegerField()
    open_date = models.DateField()
    genre = models.CharField(max_length=100)
    watch_grade = models.CharField(max_length=100)
    score = models.FloatField()
    poster_url = models.TextField()
    description = models.TextField()
    
    def __str__(self):
        return self.title
```



```shell
$ python manage.py makemigrations
$ python manage.py migrate
```



##### create

```python
# movie views.py
def list(request):
    movies = Movie.objects.all()
    return render(request, "movie/list.html", {"movies":movies})
```



```html
# base.html // list.html 만들기
{% raw %}{% extends "movie/base.html" %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    
    {% raw %}{% for movie in movies %}{% endraw %}
    <h1>list page</h1>
    {% raw %}{% endfor %}{% endraw %}

{% raw %}{% endblock %}{% endraw %}
```



```python
# movie views.py
def create(request):
    if(request.method == "POST"):
        title = request.POST.get("title")
        title_en = request.POST.get("title_en")
        audience = request.POST.get("audience")
        open_date = request.POST.get("open_date")
        genre = request.POST.get("genre")
        watch_grade = request.POST.get("watch_grade")
        score = request.POST.get("score")
        poster_url = request.POST.get("poster_url")
        description = request.POST.get("description")
        
        Movie.objects.create(
            title=title, title_en=title_en, audience=audience, open_date=open_date,
            genre=genre, watch_grade=watch_grade, score=score, poster_url=poster_url, description=description
        )
        
        return redirect("movies:list")
        
    else:
        return render(request, "movie/create.html")
```





```html
# create.html
{% raw %}{% extends "movie/base.html" %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    <form method="POST">
        {% raw %}{% csrf_token %}{% endraw %}
        제목 : <input type="text" name="title" required /> <br>
        영문제목 : <input type="text" name="title_en" required /> <br>
        관객수 : <input type="number" name="audience"/> <br>
        개봉일 : <input type="date" name="open_date"/> <br>
        장  르 : <input type="text" name="genre"/> <br>
        관람등급 : <input type="text" name="watch_grade"/> <br>
        점  수 : <input type="number" step="0.01" name="score"/> <br>
        포스터 : <input type="text" name="poster_url"/> <br>
        상세설명 : <textarea name="description"></textarea> <br>
        <input type="submit" value="Submit"/>
    </form>
{% raw %}{% endblock %}{% endraw %}

```

##### 불편한점

- column이 많아서 작성 시간이 오래걸림
- 입력이 비어도 입력이 됨 (required를 붙여주면 해결) - 하지만 완벽한 해결이 아님.
- 유효성 검사가 필요



#### Form을 활용한 create (유효성 검사)



```python
# movie forms.py 생성
from django import forms
from django import forms

class MovieForm(forms.Form):
    title = forms.CharField(max_length=100)
    title_en = forms.CharField(max_length=100)
    audience = forms.IntegerField()
    open_date = forms.DateField(
                widget=forms.widgets.DateInput(attrs={"type":"date"})
                )
    genre = forms.CharField(max_length=100)
    watch_grade = forms.CharField(max_length=100)
    score = forms.FloatField()
    poster_url = forms.CharField(max_length=100)
    description = forms.CharField(widget=forms.Textarea())
    
# forms생성시 자동으로 label과 required가 자동으로
```



- django는 dateField를 지원하지 않음 - 브라우저별로 지원하거나 안하는게 있음
- 그래서 추가해줘야 함 ( open_date와 description )



```python
# movie urls.py
path("form_create/", views.form_create, name="form_create"),
```



```python
# movie views.py
from django import forms

def form_create(request):
    if(request.method == "POST"):
        form = MovieForm(request.POST)
        # MovieForm을 인스턴스화
        ## 할당된 form 은 유효성 검사에 사용
        if(form.is_valid()):
            title = form.cleaned_data.get("title")
            title_en = form.cleaned_data.get("title_en")
            audience = form.cleaned_data.get("audience")
            open_date = form.cleaned_data.get("open_date")
            genre = form.cleaned_data.get("genre")
            watch_grade = form.cleaned_data.get("watch_grade")
            score = form.cleaned_data.get("score")
            poster_url = form.cleaned_data.get("poster_url")
            description = form.cleaned_data.get("description")
            
            Movie.objects.create(
                        title=title, title_en=title_en, audience=audience, open_date=open_date,
                        genre=genre, watch_grade=watch_grade, score=score, poster_url=poster_url, description=description
                        )
            
            return redirect("movies:list")
            
    else:
        form = MovieForm()
    return render(request, "movie/form_create.html", {"form":form})
    
# forms생성시 자동으로 label과 required가 자동으로
```



```html
# form_create.html 생성

{% raw %}{% extends "movie/base.html" %}{% endraw %}
{% raw %}{% block body %}{% endraw %}

    <form method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        {{form.as_p}}
        <input type="submit" value="Submit"/>
    </form>

{% raw %}{% endblock %}{% endraw %}
```



- as_p // as_table // as_ul 이 있음

```html
<table>
    {{form.as_table}}
</table>
```



##### django-bootstrap4

```shell
$ pip install django-bootstrap4
```



```python
# setting.py

INSTALLED_APPS에 'bootstrap4', 추가
```



```html
# base.html
	맨위에
{% raw %}{% load bootstrap4 %}{% endraw %}
	head맨 밑에
{% raw %}{% bootstrap_css %}{% endraw %}
```



```html
# form_create.html 수정

{% raw %}{% extends "movie/base.html" %}{% endraw %}
{% raw %}{% load bootstrap4 %}{% endraw %}
{% raw %}{% block body %}{% endraw %}

    <form method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        {% raw %}{% bootstrap_form form %}{% endraw %}
        <input type="submit" value="Submit"/>
    </form>

{% raw %}{% endblock %}{% endraw %}
```



##### detail(read)



```python
# movie urls.py
path("<int:id>/", views.detail, name="detail"),
```



```python
# movie views.py
def detail(request, id):
    movie = Movie.objects.get(id=id)
    return render(request, "movie/detail.html", {"movie":movie})
```





##### update



```python
# movie urls.py
path("<int:id>/form_update/", views.form_update, name="form_update"),
```



```python
# movie views.py

def form_update(request, id):
   movie = Movie.objects.get(id=id)
   if(request.method == "POST"):
        form = MovieForm(request.POST)
        if(form.is_valid()):
            title = form.cleaned_data.get("title")
            title_en = form.cleaned_data.get("title_en")
            audience = form.cleaned_data.get("audience")
            open_date = form.cleaned_data.get("open_date")
            genre = form.cleaned_data.get("genre")
            watch_grade = form.cleaned_data.get("watch_grade")
            score = form.cleaned_data.get("score")
            poster_url = form.cleaned_data.get("poster_url")
            description = form.cleaned_data.get("description")
            
            
            movie.title = title
            movie.title_en = title_en
            movie.audience = audience
            movie.open_date = open_date
            movie.genre = genre
            movie.watch_grade = watch_grade
            movie.score = score
            movie.poster_url = poster_url
            movie.description = description
            
            movie.save()
                        
            return redirect("movies:detail", id)
   else:
       data = {
           "title":movie.title,
           "title_en":movie.title_en,
           "audience":movie.audience,
           "open_date":movie.open_date,
           "genre":movie.genre,
           "watch_grade":movie.watch_grade,
           "score":movie.score,
           "poster_url":movie.poster_url,
           "description":movie.description
       }
       form = MovieForm(data)
       return render(request, "movie/form_update.html", {"form":form})
```



```html
# form_update.html
## form_create.html과 코드가 동일
### 즉 form은 한개만 만들어도 됨

{% raw %}{% extends "movie/base.html" %}{% endraw %}
{% raw %}{% load bootstrap4 %}{% endraw %}
{% raw %}{% block body %}{% endraw %}

    <form method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        {% raw %}{% bootstrap_form form %}{% endraw %}
        <input type="submit" value="Submit"/>
    </form>

{% raw %}{% endblock %}{% endraw %}
```



#### 단순화

##### create



```python
# movie urls.py
    path("<int:id>/form_update/", views.form_update, name="form_update"),
```



```python
# movie views.py
from .forms import MovieModelForm

def model_form_create(request):
    if(request.method == "POST"):
        form = MovieModelForm(request.POST)
        if(form.is_valid()):
            form.save()
            return redirect("movies:list")
    else:
        form = MovieModelForm()
    return render(request, "movie/model_form_create.html",{"form":form})
```



```python
# movie forms.py에 새로운 class 추가
from .models ipmort Movie

class MovieModelForm(forms.ModelForm):
    # Meta클래스 오버라이딩
    class Meta:
        # 기본적으로 두가지 항목을 넣게 되어 있음      
        ## 모델을 알려주면 자동으로 어울리는 걸 매칭해줌
        model = Movie
        # 전체 필드를 가져오기
        fields = '__all__'
        ## open_date를 
        widgets = {
            "open_date":forms.DateInput(attrs={'type':'date'})
        }
        
```



```html
# model_form_create.html 생성
## 코드는 form코드와 동일

{% raw %}{% extends "movie/base.html" %}{% endraw %}
{% raw %}{% load bootstrap4 %}{% endraw %}
{% raw %}{% block body %}{% endraw %}

    <form method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        {% raw %}{% bootstrap_form form %}{% endraw %}
        <input type="submit" value="Submit"/>
    </form>

{% raw %}{% endblock %}{% endraw %}
```



##### update



```python
# movie urls.py

path("<int:id>/model_form_update/", views.model_form_update, name="model_form_update"),
```



```python
# movie views.py
def model_form_update(request, id):
    movie = Movie.objects.get(id=id)
    if(request.method == "POST"):
        form = MovieModelForm(request.POST, instance=movie)
        if(form.is_valid()):
            form.save()
            return redirect("movies:detail", id)
    else:
        form = MovieModelForm(instance=movie)
    return render(request, "movie/model_form_update.html", {"form":form})
```

