---
layout: post
title: "django"
subtitle: "django QnA"
date: 2019-01-30 18:00:00 +0900
categories: til
tags: django
comments: true
---


## QnA 게시판 만들기



#### Restful

<사용자 시점에서>

Create = post

Read = get

Update = patch & put방식  -- django에서는 지원하지 않기 때문에 get / post로 우회해서

delete = delete방식 -- 

index = get

- url방식으로 가는건 get방식
- method ="post"가 없는 다 get방식



#### 모델링

```python
# question models.py
from django.db import models

class Question(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    # 자동으로 현재시간을 저장시켜주는
    def __str__(self):
        return self.title
```



```python
$ python manage.py makemigrations
$ python manage.py migrate
```



##### admin

```python
$ python manage.py createsuperuser

# question admin.py

from django.contrib import admin
from .models import Question

admin.site.register(Question)

# admin페이지에서 created_at정보를 확인할 수 없음
```



##### 확인

```python
$ python manage.py shell
from question.models import Question
Question.object.first()
>>> 입력한 거
Question.object.first().title
Question.object.first().content
Question.object.first().created_at
```



##### 시간바꾸기

```python
# setting.py
TIME_ZONE = 'Asia/Seoul'
USE_TZ = False
```



##### 확인

```python
# shell
Question.objects.all()[1]
Question.objects.get(pk=2)
## 같은말임
### 두번째 get방법을 주로 사용
```



```python
# question admin.py
## admin 페이지에 created_at 보이게 하기
from django.contrib import admin
from .models import Question

class QuestionModelAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at',)
	# 수정할수 없는건 무조건 readonly_fields로 사용하게 django에서 고정해놓음
    ## ('created_at',)은 튜플로 들어가야 하기 때문에 ,가 있어야 한다!!!!
admin.site.register(Question, QuestionModelAdmin)
```



##### 시작

```python
# question views.py
from django.shortcuts import render
from .models import Question

def index(request):
    questions = Question.objects.all()
    
    return render(request, "question/index.html", {"questions":questions})
```



```html
# index.html // base.html 생성
```



##### New / Create만들기

```python
# question urls.py
path("new/", views.new),
path("create/", views.create),
```



```python
# question views.py
# new만들기
def new(request):
    return render(request, "question/new.html")
```



```html
# new.html 작성
{% raw %}{% extends "question/base.html" %}{% endraw %}

{% raw %}{% block body %}{% endraw %}

    <form action="/questions/create/" method="post">
        # questions 앞에 / 이건 앞에 싹다 지우고 root url부터 시작한다는 의미!
        {% raw %}{% csrf_token %}{% endraw %}
        <input type="text" name="title"/>
        <input type="text" name="content"/>
        <input type="submit" value="Submit"/>
    </form>

{% raw %}{% endblock %}{% endraw %}
```



```python
# question views.py
# create만들기
def create(request):
    
    title = request.POST.get("title")
    content = request.POST.get("content")
    
    # question = Question(title=title, content=content)
    # question.save()
    Question.objects.create(title=title, content=content)
    
    return redirect("/questions/")
```



#### Read

```python
# question urls.py
path("<int:id>/", views.read),
```



```python
# question views.py
def read(request, id):
    question = Question.objects.get(pk=id)
    return render(request, "question/read.html", {"question":question})
```



```html
# read.html
{% raw %}{% extends "question/base.html" %}{% endraw %}

{% raw %}{% block body %}{% endraw %}

    <h1>{{question.title}}</h1>
    <h3>{{question.content}}</h3>
    <h5>{{question.created_at}}</h5>

{% raw %}{% endblock %}{% endraw %}
```



### 1:N 관계 - 댓글달기



#### DB날리기

- migrations안에 `__init__` 제외하고 다지움



##### 모델링

```python
# question models.py

class Comment(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    # N쪽 테이블에 나 어디 속해있어~ 라고 알려주는 코드 (ForeignKey라고)
    # 1의 테이블이 삭제되면 N쪽 테이블 정보도 같이 삭제되도록 옵션을 넣어줌
    ## on_delete는 필수로 들어가야함
    content = models.CharField(max_length=50)
    
    def __str__(self):
        return self.content
```



```python
 $ python manage.py makemigrations
 $ python manage.py migrate
```



```python
# question admin.py
from .models import Comment

admin.site.register(Comment)
```



```python
# shell
$ python manage.py shell

from question.models import Question, Comment

q = Question.objects.first
Comment.objects.create(question=q, content="아니 그게 정말이야?")
# question 에는 인스턴스를 넣어줘야 함
q.comment_set.all()
```



##### 1이 N을 찾을 때

```python
q.comment_set.all()
# 전체가 리스트에 담겨서 나옴
## 1이 key값을 통해 N에 접근하는게 아니라 1이라는 전체를 가지고 N에 접근
```



```python
# 1 : Question의 첫번째 데이터 셋을 q에 담고 question에 그 데이터 셋을 지정해줌
q = Question.objects.first
Comment.objects.create(question=q, content="아니 그게 정말이야?")

# 2 : pk가 id값과 같은 데이터 셋을 question에 담아줌
question = Question.objects.get(pk==id)

## 1과 2가 같은 의미이기 때문에 1:N에서 1의 전체를 가지고 N에 접근한다
```





##### 댓글달기 구현



###### Create

```html
# read.html에 구현
<form action="/questions/{{question.id}}/comment/create/" method="post">
        <input type="text" name="content"/>
        <input type="submit" />
</form>
```



```python
# question urls.py
path("<int:id>/comment/create/", views.comment_create)
```



```python
# question views.py
def comment_create(request, id):
    question = Question.objects.get(pk=id)
    content = request.POST.get("content")
    
    Comment.objects.create(question=question, content=content)
    
    return redirect(f"/questions/{id}/")
```



###### Read

```python
# read.html
{% raw %}{% for comment in question.comment_set.all %}{% endraw %}
    <h4>{{comment.content}}</h4>
{% raw %}{% endfor %}{% endraw %}
```



###### delete











