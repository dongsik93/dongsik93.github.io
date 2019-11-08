---
layout: post
title: "django"
subtitle: "django m2m"
date: 2019-04-23 18:00:00 +0900
categories: til
tags: django
comments: true
---

# 190423

## 09-m2m



### 1. 모델설정(models)

#### 1) User

- 팔로우기능을 구현
- `id` // `from_user_id` // `to_user_id` 
  - `ManyToManyField`가 선언된 모델과 가리키는 모델이 동일하다면, 위와 같이 필드가 생성됨

```python
# accounts-models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from conf import settings

class User(AbstractUser):
    followings = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="followers", blank=True)
    def __str__(self):
        return self.username
```



#### 2) Movie, Genre, Score

- 

```python
from django.db import models
from django.conf import settings

class Genre(models.Model):
    name = models.CharField(max_length=20)
        
class Movie(models.Model):
    title = models.CharField(max_length=30)
    audience = models.IntegerField()
    poster_url = models.TextField()
    description = models.TextField()
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

class Score(models.Model):
    content = models.CharField(max_length=20)
    value = models.IntegerField()
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
```



### 2. `account`App

#### 1) 유저목록(`accounts/`)

- 사용자의 목록이 나타나도록

```python
# accounts-urls.py
path('', views.list, name='list'),
```

```python
# accountgs.views.py
from django.contrib.auth import get_user_model

def list(request):
    User = get_user_model()
    user_info = User.objects.all()
    return render(request, "accounts/list.html", {"user_info":user_info})
```

```html
# accounts-list.html
{% raw %}{% extends 'base.html' %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    {% raw %}{% for user in user_info %}{% endraw %}
       <a href="{% raw %}{% url 'accounts:user_page' user.id %}{% endraw %}"> <h2>{{user.username}}</h2></a>
    {% raw %}{% endfor %}{% endraw %}
{% raw %}{% endblock %}{% endraw %}
```

#### 2) 유저 상세보기 (`accounts/{user.pk}/`)

- 사용자 이름을 누르면 상세 페이지로 이동하도록

```python
# accounts-urls.py
path('user_page/<int:id>', views.user_page, name="user_page"),
```

```python
# accountgs.views.py
def user_page(request, id):
    User = get_user_model()
    user_info = User.objects.get(id=id)
    return render(request, "accounts/user_page.html", {"user_info":user_info})
```

```html
# accounts-user_page.html
{% raw %}{% extends 'base.html' %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    <h1>{{user_info.username}}</h1>
    <h3>{{user_info.password}}</h3>
    <h3>{{user_info.email}}</h3>
    <h3>{{user_info.first_name}}</h3>
    <h3>{{user_info.last_name}}</h3>
{% raw %}{% endblock %}{% endraw %}
```

- 로그인한 사람만이 팔로우 가능

- 팔로우, 팔로잉 사람 수  
  - 로그인이 되어있는 사람의 정보 : `me`
  - 상대방 : `you`
  - `if문`은 `you`가 내 팔로잉 안에 있으면 , 단 내가 나를 팔로우 할 수 없게

```python
# accounts-views.py
def follow(request, id):
    User = get_user_model()
    me = request.user
    you = User.objects.get(id=id)
    
    if(me != you):
        if(you in me.followings.all()):
            me.followings.remove(you)
        else:
            me.followings.add(you)
    return redirect("accounts:user_page", id)
```

```html
# accounts-user_page.html
## user.id가 아니라 user_info.id : user.id는 현재 로그인한 사람
{% raw %}{% if user.id != user_info.id  %}{% endraw %}
	{% raw %}{% if user_info.id in user.followings.all %}{% endraw %}
		<a href="{% raw %}{% url 'accounts:follow' user_info.id %}{% endraw %}" class="btn btn-light">팔로잉</a>
	{% raw %}{% else %}{% endraw %}
		<a href="{% raw %}{% url 'accounts:follow' user_info.id %}{% endraw %}" class="btn btn-primary">팔로우</a>
	{% raw %}{% endif %}{% endraw %}
{% raw %}{% endif %}{% endraw %}
<p class="card-text">팔로잉 :  {{user_info.followings.count}}명</p>
<p class="card-text">팔로워 :  {{user_info.followers.count}}명</p>
```

- 유저가 작성한 평점 정보 출력



### 3. `movies`App

#### 1) 평점작성

- 로그인한 사람만 작성 가능

```python
# movies-urls.py
path('<int:m_id>/scores/new/', views.new, name="new"),
```

```python
# movies-views.py
def new(request, m_id):
    if(request.method == "POST"):
        s_form = ScoreForm(request.POST)
        if(s_form.is_valid()):
            form = s_form.save(commit=False)
            # commite=False를 해주는 이유는 밑에서 movie와 user정보를 저장하기 위해서
            form.movie = Movie.objects.get(id=m_id)
            form.user = request.user
            form.save()
            return redirect("movies:detail", m_id)
        else:
            return redirect("movies:list")
```

```html
# movies-detail.html
<!-- form태그에 action이 없을때는 위치한 url로 해당 요청을 보낼때 그렇게 하고, 
	action에 url이 있으면 해당 url로 요청을 보내기 위해서 -->
<form action="{% raw %}{% url 'movies:new' movie.id %}{% endraw %}" method="post">
        {% raw %}{% csrf_token %}{% endraw %}
        <p>평점 : {{score_form.value}}</p>
        <p>내용 : {{score_form.content}}</p>
        <input type="submit">
</form>
```

#### 2) 평점 삭제

- 작성한 본인만 가능하게 구현

```python
# movies-urls.py
path('<int:m_id>/scores/<int:s_id>/s_delete/', views.s_delete, name="s_delete"),
```

```python
# movies-views.py
def s_delete(request, m_id, s_id):
    score = Score.objects.get(id=s_id)
    score.delete()
    return redirect("movies:detail", m_id)
```

```html
# movies-detail.html
<div class="card-body">
        {% raw %}{% for score in movie.score_set.all %}{% endraw %}
        <p class="card-text">
              <strong style="color:black;">{{score.content}}</strong> 
              {{score.value}} 
         <!--현재 로그인한 사람과 평점을 작성한 사람이 같을 때-->
         <!--html코드에서 user는 기본적으로 request에 담겨있는, 즉 현재 로그인한 user-->
              {% raw %}{% if user.id == score.user.id %}{% endraw %}
                  <a href="{% raw %}{% url 'movies:s_delete' movie.id score.id %}{% endraw %}">삭제</a>
              {% raw %}{% endif %}{% endraw %}
        </p>
        {% raw %}{% empty %}{% endraw %}
          <p class="card-text">평점이 없어요요</p>
        {% raw %}{% endfor %}{% endraw %}
</div>
```



















