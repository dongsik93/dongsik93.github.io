---
layout: post
title: "FakeInsta"
subtitle: "fake-insta2"
date: 2019-04-09 18:00:00 +0900
categories: pro
tags: FakeInsta
comments: true
---

## 모델수정, 이미지 추가

## 190409

### fake-insta2



- 포스트 하나에 이미지 여러개 : 1대n관계
- 모델 수정

```python
# models.py
## column 추가
    image = models.ImageField(blank=True)
```

- 이미지 동작 라이브러리 설치

```terminal
$ pip install Pillow
```

- 설치 후 makemigrations / migrate

- 이미지 추가 - 폼안에 파일을 담아서 전송



```html
# form.html
    <form action="" method="post" enctype="multipart/form-data">
```

- ##### 이미지 저장

  - 이미지는 Files에 image라는 변수로 저장되기 때문에 코드를 수정
  - 경로수정 (django media file settings)

```python
# views.py 
## 이미지 코드수정
        form = PostForm(request.POST, request.FILES) 
```

```python
# setting.py
## 이미지 저장결로 수정을 위해 코드 추가
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

```python
# insta-urls.py
## django media url
### settings.py의 여러 변수들을 접근 하려면
from django.conf import settings
### 정적파일을 넣으려면 
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

```

- 이미지 출력

```html
# _post.html
{% raw %}{% if post.image %}{% endraw %}
    <img src="{{post.image.url}}" class="card-img-top" alt="...">
  {% raw %}{% else %}{% endraw %}
    <img src="..." class="card-img-top" alt="...">
  {% raw %}{% endif %}{% endraw %}
```

- 이미지 픽셀 수정(resizing)
  - 라이브러리 설치
  - 설치 후 추가
  - 모델 수정

```terminal
$ pip install pilkit
$ pip install django-imagekit
```

```python
# setting.py
## imagekit을 사용하기위해 pilkit을 설치함 (의존성)
### 그래서 installed_app에는 imagekit만 추가해주면 됨
INSTALLED_APPS = [
   'imagekit', 
]
```

```python
# models.py
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill

class Post(models.Model):
    content = models.CharField(max_length=100)
    # image = models.ImageField(blank=True)
    image = ProcessedImageField(
            upload_to='posts/images', # 저장위치
            processors=[ResizeToFill(600,600)], # 크기 지정
            format='JPEG', # 확장자 변경
            options={'quality':90}, # 원본의 90퍼센트 품질로 저장
        )
    

```



- 폼에 이미지를 업로드할 때 가려서 받는 방법 : accept 설정

```html
# form.html
<form action="" method="post" enctype="multipart/form-data" accept="image/*">
```



resize to fill ?  resize to fit?

- 모델 수정후 makemigrations / migrate

- commit



- ##### 이미지를 여러장 업로드 하기(1:N)
  - 1:n 관계를 통해
  - post 테이블과 image테이블을 분리

```python
# model.py
from django.db import models
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill

class Post(models.Model):
    content = models.CharField(max_length=100)
    # image = models.ImageField(blank=True)
    

class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE) # 1인 친구가 지워지면 n인친구까지 같이 지울 때 cascade
    file = ProcessedImageField(
            upload_to='posts/images', # 저장위치
            processors=[ResizeToFill(600,600)], # 크기 지정
            format='JPEG', # 확장자 변경
            options={'quality':90}, # 원본의 90퍼센트 품질로 저장
    	)
```

- ##### 이미지를 위한 이미지 폼 정의

```python
# form.py (모델폼 정의)
from .models import Post, Image ## 위에서 만든 이미지클래스 불러옴

class ImageForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = '__all__'
```

- ##### 현재 postform과 imageform을 분리시켰기 때문에 imageform이 출력이 안되어 있음

- ##### 이를 위해 imageform을 보여줘야 함

```python
# views.py
from .forms import PostForm, ImageForm

# create로직에 
## post_form과 image_form을 인스턴스화 시켜서 저장
post_form = PostForm()
image_form = ImageForm()
```

- ##### form.html 수정

```html
# form.html

{% raw %}{% bootstrap_form post_form %}{% endraw %}
{% raw %}{% bootstrap_form image_form %}{% endraw %}
```

- ##### 현재 imageform의 모든 정보가 출력 되기 때문에 수정이 필요

```python
# forms.py
class ImageForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = ['file',] # 여기를 수정

```

- ##### creat 수정 

```python
# views.py 
## create로직

def creat(request):
     if(request.method == "POST"):
            ### 내용과 이미지를 각각 저장
            post_form = PostForm(request.POST)
            # 이미지폼에도 csrf토큰을 넣어주기위해 두개 다 필요
        	image_form = ImageForm(request.POST, request.FILES) 
            if(post_form.is_valid()):
                post = post_form.save()
                image = image_form.save(commit=False) # 저장하지말고 기다려
                image.post = post # 저장된 게시물 post를 1:n관계로 설정한 post에 저장함
                image.save()
```

- ##### 이미지 여러개 넣기(input태그에  multiple 추가인데 모델폼은 다름)

```python
# forms.py
## 이미지 폼 수정
class ImageForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = ['file',]
        # 
        widgets = {
            'file' : forms.FileInput(attrs={'multiple':True}),
        }
```

```python
# views.py
def create(request):
    if(request.method == "POST"):
        post_form = PostForm(request.POST)
        image_form = ImageForm(request.POST, request.FILES)
        if(post_form.is_valid()):
            post = post_form.save()
            ## 이부분 수정
            for image in request.FILES.getlist('file'):
                request.FILES['file'] = image
                image_form = ImageForm(request.POST, request.FILES)
                if(image_form.is_valid()):
                    image = image_form.save(commit=False) 
                    image.post = post 
                    image.save()
            return redirect("posts:list")
    else:
        post_form = PostForm()
        image_form = ImageForm()

    return render(request, "posts/form.html", {"post_form":post_form, "image_form":image_form})
```

- 이미지 여러개 출력(Carousel사용)
  - carousel의 active 설정은 1개여야 사진이 움직임
  - id수정해야 여러개의 글이 입력 되어도 각각이 움직임

```html
# _post.html
<div class="card">
  {% raw %}{% if post.image_set %}{% endraw %}
    <div id="post{{post.id}}" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
        {% raw %}{% for image in post.image_set.all %}{% endraw %}
          <div class="{% raw %}carousel-item {% if forloop.counter == 1 %} active {% endif %}{% endraw %}">
            <img src="{{image.file.url}}" class="d-block w-100" alt="...">
          </div>
        {% raw %}{% endfor %}
      </div>
      <a class="carousel-control-prev" href="#post{{post.id}}" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#post{{post.id}}" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  {% raw %}{% else %}{% endraw %}
    <img src="..." class="card-img-top" alt="...">
  {% raw %}{% endif %}{% endraw %}
  <div class="card-body">
    <p class="card-text">{{post.content}}</p>
    <a href="{% raw %}{% url 'posts:update' post.id %}{% endraw %}" class="btn btn-warning">수정</a>
    <a href="{% raw %}{% url 'posts:delete' post.id %}{% endraw %}" class="btn btn-danger">삭제</a>
  </div>
</div>
```

- update도 위에서 수정한 것 처럼 바꿔줘야 함
  - 실제 인스타는 사진 수정이 x : 사실 사진 수정은 너무 어려움 ㅎㅎ...
    - 기존에 있는 사진을 선택적으로 몇개를 삭제 / 변경해야 하기 때문에 일단은 제외
  - 내용수정만 가능하게

```python
def update(request, id):
    post = Post.objects.get(id=id)
    if(request.method == "POST"):
        post_form = PostForm(request.POST, instance=post)
        if(post_form.is_valid()):
            post_form.save()
            return redirect("posts:list")
    else:
        # post를 인스턴스로 
        post_form = PostForm(instance=post)
         
    return render(request, 'posts/form.html', {"post_form":post_form})
```



```html
# forms.py
{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% load bootstrap4 %}{% endraw %}
{% raw %}{% block body %}{% endraw %}

    <form action="" method="post" enctype="multipart/form-data">
        {% raw %}{% csrf_token %}{% endraw %}
        {% raw %}{% bootstrap_form post_form %}{% endraw %}
        {% raw %}{% if image_form %}{% endraw %}
           {% raw %} {% bootstrap_form image_form %}{% endraw %}
        {% raw %}{% endif %}{% endraw %}
        <input type="submit">
    </form>

{% raw %}{% endblock %}{% endraw %}


```













