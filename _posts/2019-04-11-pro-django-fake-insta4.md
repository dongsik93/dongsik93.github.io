---
layout: post
title: "FakeInsta"
subtitle: "fake-insta4"
date: 2019-04-11 18:00:00 +0900
categories: pro
tags: FakeInsta
comments: true
---

## 댓글기능 추가

## 190411

### fake-insta4

- #### 댓글기능추가

  - 좋아요 기능은 m:n 으로 관계를 설정(manytomanyfield)
  - `CharField`와 `TextField`의 차이점 
    - `CharField`는 `input태그`
    - `TextField`는 `textarea`

  - auto_now_add : 글을 처음 작성했을 때만
  - auto_now : 글을 수정할 때마다 시간이 바뀜

```python
# posts-models.py

class Comment(models.Model):
    # 댓글과 1:n
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    # 유저와 1:n
    user = models.ForeignKey(settings.AUT_USER_MODEL, on_delete=models.CASCADE)
    content = models.CharField(max_length=100)
    # 생성날짜
    created_at = models.DateTimeField(auto_now_add=True)
```

- migrations



- 댓글작성 url 뚫어주기

```python
# posts-urls.py
path('<int:post_id>/comment/create/',views.comment_create, name="comment_create"),
```

- ##### 댓글 생성

  - Commentform으로

```python
# posts-forms.py
from .models import Comment

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        # 사용자에게 보여줄 정보는 content뿐
        fields = ['content',]
```

- commet전용 페이지는 안만들고 현재의 list페이지에 comment form을 각각 달아서 구현
  - list페이지에 댓글 입력 구현

```python
# posts-views.py

def list(request):
    posts = Post.objects.all()
    comment_form = CommentForm()
    return render(request, "posts/list.html", {'posts':posts, 'comment_form':comment_form})
```

- `action`에 추가하는 이유
  - 폼을 입력하는 주소는 `posts/`라는 경로인데 저장하는 페이지의 주소는 ``<int:id>` / comment/create/이므로 다르기 때문에 actions에 url주소를 넘겨주어야 함

```html
# _post.html

<div class="card-body">
    <form action="{% raw %}{% url 'posts:comment_create' post.id %}{% endraw %}" method="post">
        {% raw %}{% csrf_token %}{% endraw %}
		{{comment_form.content}}
        <input type="submit">
    </form>
</div>
```

- 저장은 comment_create로 따로 구현

```python
# posts-views.py

@login_required
def comment_create(request, post_id):
    if(request.method == "POST"):
        comment_form = CommentForm(request.POST)
        if(comment_form.is_valid()):
            comment = comment_form.save(commit=False)
            comment.user = request.user
            comment.post = Post.objects.get(id=post_id)
            comment.save()
            return redirect("posts:list")
```

- list페이지 보기쉽게

```html
# list.html
{% raw %}{% extends 'base.html' %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    <div class="row">
        <div class="col-6">
        {% raw %}{% for post in posts %}{% endraw %}
            {% raw %}{% include 'posts/_post.html' %}{% endraw %}
        {% raw %}{% endfor %}{% endraw %}
        </div>
    </div>
{% raw %}{% endblock %}{% endraw %}
```

- ##### 댓글창 꾸미기

  - `empty` : 돌아갈 for문이 없으면 실행

```html
# _post.html
<div class="card-body">
    {% raw %}{% for comment in post.comment_set.all %}{% endraw %}
      <p class="card-text"><strong style="color:skyblue;">{{comment.user}}</strong> {{comment.content}}</p>
    {% raw %}{% empty %}{% endraw %}
      <p class="card-text">댓글이 없어요</p>
    {% raw %}{% endfor %}{% endraw %}
</div>
```

- comment가 아닐때는 안돌아가도록

```python
# posts-views.py
from django.views.decorators.http import require_POST

@require_POST
def comment_create(request, post_id):
```





- ##### 댓글 삭제

``` python
# posts-urls.py
path('<int:post_id>/comment/<int:comment_id>/delete/', views.comment_delete, name="comment_delete"),
```

```python
# posts-views.py
@login_required
def comment_delete(request, post_id, comment_id):
    comment = Comment.objects.get(id=comment_id)
    if(comment.user == request.user):
        comment.delete()
    else:
        return redirect("posts:list")
    return redirect("posts:list")
```

-  삭제버튼

```html
# _post.html
  <div class="card-body">
    {% raw %}{% for comment in post.comment_set.all %}{% endraw %}
      <p class="card-text"><strong style="color:skyblue;">{{comment.user}}</strong> {{comment.content}}</p>
      {% raw %}{% if comment.user == user %}{% endraw %}
      <a href="{% raw %}{% url 'posts:comment_delete' post.id comment.id %}{% endraw %}">삭제</a>
      {% raw %}{% endif %}{% endraw %}
    {% raw %}{% empty %}{% endraw %}
      <p class="card-text">댓글이 없어요</p>
    {% raw %}{% endfor %}{% endraw %}
  </div>
```



- ##### 좋아요 기능
  - m2m관계 연습(ManyToMany)
    - `student`와 `lecture` 클래스를 이용해 연습

```python
# students-models.py
from django.db import models

# Create your models here.
class Student(models.Model):
    name = models.CharField(max_length=100)

    # 쉽게 알아볼수 있도록 ( admin 페이지에서 )
    def __str__(self):
        return self.name
        

class Lecture(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

# 조인클래스 / 조인테이블
class Enrolment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.tudent}, {self.lecture}"

```



```python
# students-views.py
from django.shortcuts import render
from .models import Student, Lecture, Enrolment

# Create your views here.
def list(request):
    ## 학생id가 1인 학생이 듣는 모든 수업을 출력
    # student = Student.objects.get(id=1)
    # enrolments = student.enrolment_set.all()
    # for enrolment in enrolments:
    #     print(enrolment.lecture.name)
    
    # 수업id가4인 수업을 듣는 모든 학생을 출력
    lecture = Lecture.objects.get(id=4)
    enrolments = lecture.enrolment_set.all()
    for enrolment in enrolments:
        print(enrolment.student.name)
        
    #첫번째 수강신청을 한 사람과 똑같은 과목을 신청한 사람
    enrolment = Enrolment.objects.get(id=1)
    for i in enrolment.lecture.enrolment_set.all():
        print(i.student.name)
    ## 위와 같은 코드
    enrolment = Enrolment.objects.get(id=1)
    lecture = enrolment.lecture
    for en in lecture.enrolment_set.all():
        print(en.student.name)
    
```



