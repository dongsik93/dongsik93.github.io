---
layout: post
title: "django start"
subtitle: "django start"
date: 2019-01-24 18:00:00 +0900
categories: til
tags: django
comments: true
---

## django start

### 버전관리 중요

python 설치

c9에서는 rc로 아니면 _profile로

- macos는 rc대신 _profile로

```python
# pyenv 설치
$ git clone https://github.com/pyenv/pyenv.git ~/.pyenv
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
$ echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bashrc
$ exec $SHELL # shell새로고침

# virtualenv intall
$ git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv
$ echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc
$ exec "$SHELL"

$ pyenv install 3.6.7

$ pyenv global 3.6.7
$ python -V
```



### django 설치

```python
$ pip install django
설치 후
$ django-admin startproject django_intro
# 프로젝트 생성 명령어
## django_intro는 폴더이름

$ cd django_intro/
$ pip list
# 내가 pip로 설치한 모듈이 나옴


$ pyenv virtualenv 3.6.7 django_intro
# django_intro라는 이름으로 3.6.7을 분기처리 virtualenv를 이용해서 추가
$ pyenv versions

$ pyenv local django_intro
# 이 폴더내에서는 django_intro를 python 버전으로 관리하겠다
## .python-version이라는 파일이 생김 

$ pip  list
# 설치 결과가 local에 설치한것과 다르게 나옴 (local에는 django가 설치되어 있지만 현재 폴더에는 설치가 안됨 -- local과 현재폴더의 버전을 다르게 관리)
$ pip install django

$ touch .gitignore
# 이제 gitignore는 무조건!

$ python manage.py runserver $IP:$PORT
# 실행
```



#### DisallowedHost at /

허용되지 않은 호스트로 접속했으 때

whitelisting : 너만돼 / 허용하는 리스트를 추가해줘야 들어갈 수 있음

##### <span style="color:red">setting.py</span>에서 28번째줄 ALLOWED_HOSTS = []여기에 오류에 나온 django-test-dongsik93.c9users.io를 넣어줘야 함



#### project 구조

- 하나하나 분리되어 있음

- `manage.py` : 명령
- `__init__.py` : 폴더 자체를 모듈처럼 사용할 수 있게
- `setting.py` : 여러가지 설정파일을 넣을 수 있는
- `urls.py` : @app.route(/)를 주워서 따로만든.  
- `wsgi.py` : 
- 



##### urls.py

```python
# 리스트
urlpatterns = [
    path("index/", views.index),
    # 항상 마지막에 , 넣어야함
]
```



views파일은 mtv라는 어쩌고~ 저쩌고~



##### views.py 생성

```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello!!")
```



생성 후 urls.py에 

```python
from . import views
```



후에 서버주소에 /index를 붙이고 새로고침 해주면 Hello!!가 뜸



#### MVC

<span style="color:red">model</span> - <span style="color:blue">controller </span>- view

<span style="color:red">class User():</span> - <span style="color:blue">app.py </span> -  templates안에 .html



#### MTV(django만 이 패턴) - 패턴은 똑같지만 이름만 바꾼....장고만...

<span style="color:red">model</span> - <span style="color:blue">views</span>- templates

그래서 django에서는 <span style="color:blue">views.py</span>에서 다 통제



#### flask와는 흐름이 비슷 / django에서는 분리가 되어있을 뿐



### 예시



##### urls.py

```python
# 리스트
urlpatterns = [
    path("html_tag/", views.html_tag),
    # 항상 마지막에 , 넣어야함
]
```

##### views.py

```python
def html_tag(request):
    s = "<h1>안녕하세요</h1>"
    return HttpResponse(s)
```



#### django에서 render

```python
from django.shortcuts import render

def html_file(request):
    
    return render(request,"html_file.html")
```

상위 폴더에서 새 폴더 추가 templates - .html

이 폴더를 잡을 수 있도록 설정을 줘야 함



#### setting.py

54번째 줄인 TEMPLATES = {~~~} 안에 'DIRS' : []가 비어있어서 그럼

[] 사이에 변수를 넣어줘야 함



16번째 줄에 BASE_DIR  밑에 변수 생성

##### TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

--> BASE_DIR과 templates를 연결시켜주는 ? 알려주는 ?



변수 생성 후  []안에 TEMPLATES_DIR 넣어줌



그 후 .html에 들어가서 작성해주면 끝



### <django 맛보기 끝>



#### bootstrap 활용 시간~~



### Utilities

- Flex
- Sizing
- Spacing
- Text
- Borders
- Color

### Content

- Images

### Layout

- grid





















