---
layout: post
title: "django basic"
subtitle: "django basic"
date: 2019-01-28 18:00:00 +0900
categories: til
tags: django
comments: true
---

## django-basic


### C9 template 생성

- 앞으로 c9 워크스페이스를 생성할 때마다 만들기 귀찮으니까 환경을 만들어 놓고 클론해서 쓰기위해



#### docker 

- 베이스 이미지를 만들어놓고 복사해서 쓰는  / 환경설정하기 편함



```terminal
# pyenv install
git clone https://github.com/pyenv/pyenv.git ~/.pyenv

echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc

echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bashrc

exec "$SHELL"

pyenv install 3.6.7

pyenv global 3.6.7

python -V

pip install django

pip install flask

pip list
```



### clone하기

- clone workspace선택



### Django Start 

- CRUD를 활용한 board(게시판) 만들기



```terminal
$ django-admin startproject mysite
$ cd mysite

$ django-admin startapp board
$ django-admin startapp first
```



- mysite : 전체 프로젝트 단위 , 메인 프로젝트(ex. twitter)
- board : 개개인으로 돌아갈 수 있는 app (ex. 게시물의 crud, 로그인 처럼 각각 들어가는거)



#### 개발을 할 때는 app단위로 쪼개서 관리



```python
# setting.py 
# 17line에 추가
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

# 28line ALLOWED_HOSTS에 "*" 추가
ALLOWED_HOSTS = ["*"]

# 33line INSTALLED_APPS에 위에서 만든 app추가
'first',
'board',

# 55line에 TEMPLATES 안에 'DIRS'에 추가
'DIRS': [TEMPLATES_DIR],
```





```python
# urls.py
## 모든 url관리
# route설정

from django.contrib import admin
from django.urls import path, include # include 추가

urlpatterns = [
    path('admin/', admin.site.urls),
    path("first/", include("first.urls"))  
    # first/뒤에 뭐가 되든간에 first.url에 넘겨준다라는 뜻
]
```



```python
# fisrt 폴더 내에 urls.py 생성

from django.urls import path
from . import views
# 현재폴더 내의 view.py에 정의된 index
urlpatterns = [
    path("index/", views.index),
]
```



```python
# first폴더 내 views.py
from django.shortcuts import render

def index(request):
    return render(request, "index.html")
```



```python
# first폴더 내 templates폴더 생성하고 그 안에 index.html 만들기
```



```terminal
# 서버 구동
python manage.py runserver $IP:$PORT

# first/index 로 이동하기
```



```python
# variable routing
# first폴더 내의 urls.py에
path("greeting/<str:name>/", views.greeting),
```



```python
# first폴더 내의 views.py에 정의
def greeting(request, name):
    return render(request, "greeting.html", {"name":name})    
# 장고에서는 name을 넘겨줄 때 딕셔너리로 넘겨줌
```



``` python
# templates폴더 내 greeting.html 만들어서 {{name}}으로 받아주기
```



#### templates폴더 탐색

seting.py에 templates_dir 설정해준 dir중 base에있는거 먼저 탐색하고 그후 APP들 안에 있는 (INSTALLED_APP)먼저 찾음 



해결 :  templates안에 해당 앱과 똑같은 이름의 폴더를 만들고, 그곳에 html파일을 만들어줌 그리고 views.py에 board/index.html로 위치를 표시해줌



#### 모델링

```python
# models.py

from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=100) # CharField 는 꼭 max_length가 필요
    content = models.TextField()
    
```



#### Migration

```terminal
$  python manage.py makemigrations

>>>Migrations for 'board':
      board/migrations/0001_initial.py
        - Create model Post
# 파이썬 코드를 읽어 반영

$ python manage.py migrate
# migrate
```



```python
# 콘솔창
$ python manage.py shell

from board.models import Post
post = Post(title="첫번째 게시물", content="내용")
post.save()

Post.objects.all()
# 쿼리셋이라는게 반환이 됨

# SELECT * FROM post == Post.objects.all()

# 하나만 선택해서 가져오기
post = Post.objects.first()
post
>>> <Post : Post object (1)>

post.title
>>> 첫번째 게시물
post.content

# 임이의 id값을 가진걸 가져오기
Post.objects.get(pk=2)
post = Post.objects.get(pk=2)
post.title
>>> 두번째 게시물
```



```terminal
$ python manage.py createsuperuser
# 생성 후
$ python manage.py runserver $IP:$PORT
# 서버 열고

/admin으로 접속 후 로그인
```



board의 admin으로 들어가서 방금 만든 모델을 추가

```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```



다시 admin/으로 들어가서 post가 추가된걸 알 수 있음

post에 들어가면 방금 위에서 만든 Post obejct(1) / Post obejct(2)가 추가된걸 확인 할 수 있다.



##### index.html 정의 // 저장된 데이터 읽어오기

```python
# views.py
from django.shortcuts import render
from .models import Post

def index(request):
    Post.objects.order_by('-id').all()
    # id 내림차순
    return render(request,"board/index.html")
```



##### 데이터를 새로 작성하기(get)

1.

```python
# board디렉토리 내 urls.py에 추가
path("new/", views.new), 
```

2.

```python
# board 디렉토리 내 views.py에 추가
def new(request):
    return render(request, "board/new.html")
```

3.

```html
<!-- new.html 폼태그를 이용해 데이터를 넣어주는거  생성 -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="/posts/create">
        <input type="text" name="title"/>
        <input type="text" name="content"/>
        <input type="submit" value="Submit"/>
    </form>
</body>
</html>
```

4.

```python
# board내  urls.py에 create요청에 대한 route 열어주기
path("create/", views.create),
```

5.

```python
# views.py
## 사용자가 데이터를 어떻게 넣는지를 봐야 함

def create(request):
    # 사용자가 입력한 데이터를 get방식으로 받아서 title / content에 저장
    title = request.GET.get("title")
    content = request.GET.get("content")
    post = Post(title=title, content=content)
    post.save()
    
    return render(request, "board/breate.html")
```



#####  저장된 데이터 하나만 불러오기(get)

1.

```python
# board내 urls.py에 추가
path("<int:id>/", views.read),
```

2.

```python
# board내 view.py에 추가
def read(request, id):
    post = Post.objects.get(pk=id)
    # id값이 pk인 거 하나만 가져오기
    return render(request, "board/read.html", {"post":post})
```

3.

```html
<!-- read.html을 board/ 에 생성 -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>{{post.title}}</h1>
    <h3>{{post.content}}</h3>
</body>
</html>
```

확인 : /posts/1 하면 1번글이 나타남

4.

```html
# index.html창에서 a태그를 추가해서 글 보기를 누르면 해당 글을 보는 페이지로 이동하게
#for문 안에 추가

<a href="/posts/{{post.id}}/">글보기</a>
```



### django는 최대한 분리시키려고 함



##### 데이터를 새로 작성하기(post)

1.

```python
# board - urls.py
path("post_new/", views.post_new),
path("post_create/", views.post_create),
```

2.

```python
# board - views.py
    
def post_new(request):
    return render(request, "board/post_new.html")

def post_create(request):
    # POST는 POST방식으로 받아오기 때문에 
    title = request.POST.get("title")
    content = request.POST.get("content")
    
    # Post는 게시판 Post, 대소문자에 유의
    post = Post(title=title, content=content)
    post.save()
    
    return render(request, "board/post_create.html")
```

3.

```html
# post_new.html 및 post_creat.html

form 부분에 method = "post"추가
<form action="/posts/post_create/" method = "post">
```

확인 : 403error



##### csrf 토큰 추가

위의 403error는 django가 csrf를 자동으로 막아주기 때문에 발생하는 에러

애초에 폼을 생성 할때 form에 토큰값을 추가해서 인증함

```html
<!-- post_new.html에 csrf 토큰추가 -->
<form action="/posts/post_create/" method = "post">
        {% raw %}{% csrf_token %}{% endraw %}
        <input type="text" name="title"/>
        <input type="text" name="content"/>
        <input type="submit" value="Submit"/>
    </form>

추가해주면 새로운 input태그에 hidden이라는 타입으로 토큰값이 들어감
```



##### 저장된 데이터 하나만 불러오기(post)











