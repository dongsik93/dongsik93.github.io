---
layout: post
title: "FakeInsta"
subtitle: "fake-insta5"
date: 2019-04-12 18:00:00 +0900
categories: pro
tags: FakeInsta
comments: true
---

## 좋아요 기능 구현

## 190412

### fake-insta5



- #### 좋아요 기능 구현

  - m:n 관계로

  - ##### 먼저 클래스를 하나 더 추가하는 방식으로 진행

```python
# posts-models.py
class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
```

- migrate진행

- 좋아요 기능을 위한 링크

```python
# posts-urls.py
## url에 create를 안 붙이는 이유 : 버튼 경로는 하나지만, on/off버튼처럼 만들거니까
path('<int:id>/like/', views.likst, name="like"),
```

- 사용자가 좋아요를 안눌렀다면 좋아요를 추가, 이미 눌렀다면 좋아요 취소

```python
# posts-views.py
from .models import Like

@login_required    
def like(request, id):
    user = request.user
    post = Post.objects.get(id=id)
    likes = post.like_set.all()
    
    check = 0
    for like in likes:
        if user == like.user:
            check = 1
            like_post = like
    
    if check == 1:
        # 사용자가 눌렀을 때
        like_post.delete()
    else:
        # 사용자가 안눌렀을 때
        like = Like(user=user, post=post)
        like.save()
    
    return redirect('posts:list')
```

- 버튼달기

```html
# _post.html
<a href="{% raw %}{% url 'posts:like' post.id %}{% endraw %}">좋아요</a>
```



- ##### ManyToManyFIeld를 이용한 m:n관계

```python
# posts-models.py

class Post(models.Model):
    content = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    ## m2m 추가
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_post_set', blank=True)
```

- ManyToManyField는 `remove`와 `add`를 사용한다

```python
# posts-views.py
@login_required    
def like(request, id):
    user = request.user
    post = Post.objects.get(id=id)
    
    # 사용자가 좋아요를 눌렀다면
    if user in post.likes.all():
        post.likes.remove(user)
    # 사용자가 좋아요를 누르지 않았다면
    else:
        post.likes.add(user)
    return redirect('posts:list')
```

- 버튼달기

```html
# _post.html
 <div class="card-body">
    <!--좋아요 버튼-->
    {% raw %}{% if user in post.likes.all %}{% endraw %}
      <a href="{% raw %}{% url 'posts:like' post.id %}{% endraw %}">취소</a>
    {% raw %}{% else %}{% endraw %}
      <a href="{% raw %}{% url 'posts:like' post.id %}{% endraw %}">좋아요</a>
    {% raw %}{% endif %}{% endraw %}
    <!--//좋아요 버튼-->
    <p class="card-text">{{post.content}}</p>
    {% raw %}{% if post.user == user %}{% endraw %}
    <a href="{% raw %}{% url 'posts:update' post.id %}{% endraw %}" class="btn btn-warning">수정</a>
    <a href="{% raw %}{% url 'posts:delete' post.id %}{% endraw %}" class="btn btn-danger">삭제</a>
    {% raw %}{% endif %}{% endraw %}
  </div>
```

- 좋아요 버튼 꾸미기

```html
{% raw %}{% if user in post.likes.all %}{% endraw %}
<a href="{% raw %}{% url 'posts:like' post.id %}{% endraw %}"><i class="fas fa-heart" style="color:#ed4956"></i></a>
{% raw %}{% else %}{% endraw %}
<a href="{% raw %}{% url 'posts:like' post.id %}{% endraw %}"><i class="far fa-heart" style="color:black"></i></a>
{% raw %}{% endif %}{% endraw %}
```

- 좋아요 개수

```html
<p class="card-text">좋아요 {{post.likes.count}}개</p>
```













