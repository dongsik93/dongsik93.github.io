---
layout: post
title: "django"
subtitle: "django relationship"
date: 2019-04-17 18:00:00 +0900
categories: til
tags: django
comments: true
---

## 190417



### Relationship



- ##### User는 Post와 1:n , Post는 Comment와 1:n, Commet는 각각 1:n관계

```python
# models.py
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=30)
    
class Post(models.Model):
    title = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Comment(models.Model):
    content = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
```

- 확장프로그램 설치 후 `installed_app`에 추가

```
pip install django_extensions
```

```
python manage.py shell_plus
# 이렇게 하면 django_extensions으로 인해 설치했던 models들을 자동으로 import해줌
```

- 이름이 싸피인 User를 생성하여 변수 user에 저장

```
(1)
user = User.objects.create(name="싸피")
(2)
user = User(name="싸피")
user.save()
(3)
user = User()
user.name = "싸피"
user.save()

## 모두 같은 결과
```

- User가 "안녕하세요"라는 제목의 Post를 생성하여 변수 post에 저장

```
(1) 
# user라는 정보를 통째로 넘김
post = Post.objects.create(title="안녕하세요", user=user) 
(2)
p = Post()
p.title="안녕하세요"
p.user = user
p.save()
(3)
# user_id가 가능
post = Post.objects.create(title="안녕하세요", user_id=1) 

## user에는 instance객체가 들어와야 하고 user_id에는 숫자가 와야 함
```

- User가 반갑습니다 라는 제목의 Comment

```
(1)
Comment.objects.create(content="반갑습니다", post_id=1, user_id=1)
(2)
Comment.objects.create(content="반갑습니다", post=Post.objects.get(id=1), user_id=1)
```

- python manage.py shell_plus에 추가
  - 문제 실습 !!!

```
user1 = User.objects.create(name='Kim')
user2 = User.objects.create(name='Lee')
post1 = Post.objects.create(title='1글', user=user1)
post2 = Post.objects.create(title='2글', user=user1)
post3 = Post.objects.create(title='3글', user=user2)
c1 = Comment.objects.create(content='1글1댓글', user=user1, post=post1)
c2 = Comment.objects.create(content='1글2댓글', user=user2, post=post1)
c3 = Comment.objects.create(content='1글3댓글', user=user1, post=post1)
c4 = Comment.objects.create(content='1글4댓글', user=user2, post=post1)
c5 = Comment.objects.create(content='2글1댓글', user=user1, post=post2)
c6 = Comment.objects.create(content='!1글5댓글', user=user2, post=post1)
c7 = Comment.objects.create(content='!2글2댓글', user=user2, post=post2)
```

- id가 1인 유저

```
(1)
User.objects.get(id=1)
(2)
User.objects.get(pk=1)
```

- 1번 사람이 작성한 게시글은?

```
(1)
user1.post_set.all()
# QuerySet 형식(리스트와 흡사)
```

- 1번 사람의 모든 게시글에 달린 모든 댓글의 내용을 출력

```
for post in user1.post_set.all():
	for comment in post.comment_set.all():
		print(comment.content)
```

- 2번 댓글을 쓴 사람의 이름

```
c2.user.name
```

- 2번 댓글을 쓴 사람의 모든 게시물

```
c2.user.post_set.all()
or
user2.post_set.all()
or
User.objects.get(name=c2.user.name).post_set.all()
```

- 1번글의 첫번째 댓글을 쓴 사람의 이름

```
post1.comment_set.all()[0].user.name
# QuerySet이기 때문에 리스트 접근 가능
or
post1.comment_set.first().user.name
# first, last만 있음
```

- 1번글의 2번째부터 4번째 까지의 댓글

```
post1.comment_set.all()[1:4]
```

- 1번글의 두번째 댓글을 쓴 사람의 첫번째 게시물의 작성자의 이름

```
post1.comment_set.all()[1].user.post_set.all()[0].user.name
```

- 1번 댓글의 user정보만?

```
(1)
c1.user
(2)
Comment.objects.values('user').get(id=1)
```

- 2번 사람이 작성한 댓글을 content의 내림차순으로

```
user2.comment_set.order_by('-content')
or
user2.comment_set.order_by('-content').all()
```

- 제목이 '1글'인 게시물

```
Post.objects.get(title='1글') # 첫번째 값
or
Post.objects.filter(title='1글') # 모두 가져와
```

- "글"이 포함된 글

```
Post.objects.filter(title__contains="글") # 언더바 2개
```

- 댓글 중에 해당 글의 제목이 '1글'인 댓글

```
Comment.objects.filter(post__title='1글')
```

- 댓글 중 해당 글의 제목에 1이 들어가 있는 댓글

```
Comment.objects.filter(post__title__contains="1")
```





##### - One to One(1:1관계)

```python
# models.py
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=30)
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=20, blank=True)
```

- shell_plus실행

```
(1)
user=User(name="동식")
user.save()
(2)
User.objects.create(name="동식")
```



```
(1)
Profile.objects.create(user=user, nickname="동동")
(2)
profile= Profile()
profile.nickname="동동"
profile.user = user
profile.save()
```



- ##### ManyToMany(n:m)



```python
# models.py
from django.db import models

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    
class Patient(models.Model):
    name = models.CharField(max_length=100)

class Reservation(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
```

- 생성

```
Doctor.objects.create(name="Kim")
Patient.objects.create(name="Park")
p = Patient.objects.get(name="Park")
d = Doctor.objects.get(name="Kim")
Reservation.objects.create(doctor=d, patient=p)
```

- 

```
d.reservation_set.all() # 예약차트
for r in d.reservation_set.all():
	r.patient.name
```



```python
# models.py 변경
class Patient(models.Model):
    name = models.CharField(max_length=100)
    doctors = models.ManyToManyField(Doctor, through="Reservation")
```



```
p = Patient.objects.get(id=1)

p.reservation_set.all()
>>> <QuerySet [<Reservation: Reservation object (1)>]>
p.doctors.all()
>>> <QuerySet [<Doctor: Doctor object (1)>]>
```

- 역참조

```
d = Doctor.objects.get(id=1)
d.patient_set.all()
```

- 역참조의 불편함 해소

```python
# models.py
doctors = models.ManyToManyField(Doctor, through="Reservation", related_name="patients")
```

- 복잡한 구조를 간단하게 재구성(중간 모델 없이)

```python
# models.py
from django.db import models

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    
class Patient(models.Model):
    name = models.CharField(max_length=100)
    doctors = models.ManyToManyField(Doctor, related_name="patients")
```

```
d = Doctor.objects.create(name="kim")
p = Patient.objects.create(name="박")
p2 = Patient.objects.create(name="이")
d.patients.add(p,p2) # 연결
d.patients.remove(p) # 삭제
```



##### 모델을 보여주고 이를 보고 데이터를 어떻게 조작하는지?



