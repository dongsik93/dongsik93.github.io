---
layout: post
title: "FakeInsta"
subtitle: "fake-insta6"
date: 2019-04-15 18:00:00 +0900
categories: pro
tags: FakeInsta
comments: true
---

## User모델 확장

## 190415

### fake-insta6



- ##### django 정규표현식

- #### User모델 확장

  - User모델은 사용하지 않더라도 미리 확장해놓는게 좋다 !!
  - 팔로우기능 추가
  - AbstractUser 모델 상속한 사용자 정의 User 모델 사용하기
    - `db.sqlite3`삭제(root폴더 내)
    - `migrations` 파일 삭제 후 진행(posts폴더 내)
    - 새로운 user모델을 만들고 다시 migrate하기 위해

```python
# accounts-models.py
from django.contrib.auth.models import AbstracUser

# 만들어져있는 user를 그대로 사용할수는 없음
## Customize
class User(AbstractUser):
    pass

    def __str__(self):
        return self.username
```

- 기존 `posts-models.py`에 `user_model`을 사용하고 있는데 위처럼 수정하면 `settings.py`에 추가적으로 해줘야 함

```python
# setting.py
## accounts.User == 기존 장고 유저모델
AUTH_USER_MODEL = 'accounts.User'
```

- makemigrations / migrate
- createsuperuser를 통해 `User model`이 잘 적용이 됐나 확인
- `models.py` 수정
  - `related_name` : 나를 팔로우 하는 사람을 알아보기 위해, 즉 역참조
  - `related_name`이 없어도 상관 없음, 설정 안해줬을 때 default는 `모델_set.all()`로 해주면 됨

```python
# accounts-models.py
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# 만들어져있는 user를 그대로 사용할수는 없음
## Customize
class User(AbstractUser):
    # 'self'를 넣거나
    ## settings.AUTH_USER_MODEL을 넣어주면 됨
    followings = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="followers", blank=True)

    def __str__(self):
        return self.username
```

- makemigrations / migrate
- admin페이지 에서 확인하기

```python
# accounts-admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

admin.site.register(User, UserAdmin)
```

- 이상태로 회원가입을 하면 오류 발생

  - ```
    Manager isn't available; 'auth.User' has been swapped for 'accounts.User'
    ```

  - `Signup`페이지의` UserCreationForm`이 오류

    - `UserCreationForm`은 가져다 쓴 모델폼인데 , 얘가 기본적으로 장고 기본 폼을 가져다 쓰기 때문에 이를 수정해줘야 함

```python
# accounts-forms.py 생성
from django.contrib.auth.forms import UserCreationForm
from .models import User

## 수정
class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm):
        model = User
        fields = ['username', 'email',]
```

```python
# accounts-views.py
from .forms import CustomUserCreationForm

# 기존에 UserCreationsForm을 교체해줌
def signup(request):
    if(request.method == "POST"):
        form = CustomUserCreationForm(request.POST)
        if(form.is_valid()):
            form.save()
            return redirect("posts:list")
    else:
        form = CustomUserCreationForm()
        
    return render(request, "accounts/form.html", {"form":form})
```

- #### 안될땐 서버를 껐다가 키자

- 위까지 해서 회원가입 후  로그인이 됨
  - 로그인은 수정 안했는데 왜 되는가?
    - 회원가입을 새로 할 때는 `CreationForm`을 `CustomUserCreationsForm`으로 바꿨는데, 이는 `Follow`기능을 추가하면서 `UserModel`을 바꿈. 
    - 로그인은` AuthenticationForm`은 수정을 안해줬는데 얘는 자동으로 `settings.py`에  바뀐걸 찾아줌
      - `AutehnticationsForm`은 내부적으로 함수가 구현이 되어있기 때문
        - `get_user_model`이라는 함수!!

- 초보몽키의 유저모델 클래스 획득 방법 참고 : <https://wayhome25.github.io/django/2017/05/18/django-auth/>

- ##### Userpage생성

  - 유저정보를 보여주고
  - 유저가 생성한 게시글을 보여줘야 함

```python
# accounts-urls.py
path('user_page/<int:id>/', views.user_page, name="user_page"),
```

```python
# accounts-views.py
from django.contrib.auth import get_user_model

def user_page(request, id):
    # get_user_model을 함수로 사용
    ## 원래대로라면 model을 import해서 가져와야 함
    ### models.py내의 User모델의 이름이 바뀔때 이렇게 하면 편하게 적용 가능
    User = get_user_model()
    user_info = User.objects.get(id=id)
    return render(request, "accounts/user_page.html", {"user_info":user_info})
```

```html
# accounts-user_page.html
{% raw %}{% extends "base.html" %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    
    <!--사용자 정보 출력 시작-->
    <div class="row">
        <div class="col-4">
            <!--프로필 이미지-->
            
        </div>
        <div class="col-8">
            <!--유저 정보-->
            <h1>{{user_info.username}}</h1>
        </div>
    </div>
    <!--사용자 정보 출력  끝-->
    
    <!--작성글 출력-->
    <div class="card-columns">
        {% raw %}{% for post in user_info.post_set.all %}{% endraw %}
            {% raw %}{% include 'posts/_post.html' %}{% endraw %}
        {% raw %}{% endfor %}{% endraw %}
    </div>
    <!--작성글 출력 끝-->
    
{% raw %}{% endblock %}{% endraw %}
```

- 현재상태에는 `Userpage`에서 댓글달기 구현x
  - 댓글을 달고 싶으면 Comment모델 가져와서 정보 주면 됨
- `base.html`수정
  -  `user.id`로 접근이 가능한 이유는 위에 if문에 `user.id_authenticated`가 설정 되어 있기 때문

```html
# base.html
<a class="nav-link" href="{% raw %}{% url 'accounts:user_page' user.id %}{% endraw %}">MyPage</a>
```

- 유저를 누르면 해당 유저의 유저페이지로 이동하게
  - 밑줄은 a:hover로 text-decoration을 설정

```html
# posts-_post.html
<a href="{% raw %}{% url 'accounts:user_page' post.user.id %}{% endraw %}" style="color:black"><h5 class="card-text">{{post.user}}</h5></a>
```



- #### 팔로우

  - 좋아요 구현과 코드가 비슷

```python
# accounts-urls.py
path('follow/<int:id>/', vies.follow, name="follow")
```

```python
# accounts-views.py
def follow(request, id):
    User = get_user_model()
    # 로그인이 되어있는 사람의 정보 : me
    me = request.user
    ## 상대방 : you
    you = User.objects.get(id=id)
    
    # 너가 내 팔로잉안에 있으면
    ## 단, 내가 나를 팔로우 할 수 없게
    if me != you:
        if(you in me.followings.all()):
            me.followings.remove(you)                                       
        else:
            me.followings.add(you)
    return redirect("accounts:user_page", id)
```

```html
# user_page.html
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

















