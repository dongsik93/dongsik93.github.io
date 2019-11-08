---
layout: post
title: "FakeInsta"
subtitle: "fake-insta8"
date: 2019-05-01 17:00:00 +0900
categories: pro
tags: FakeInsta
comments: true
---

## Axios를 사용해서 여러 기능 수정

 ##### fake-insta 좋아요 기능 수정

  - 페이지 요청을 다시하지 않고 그 해당 페이지에서 바뀌도록

```html
// posts-_post.html
{% raw %}{% if user in post.likes.all %}{% endraw %}
      <i class="like-btn fas fa-heart" style="color:#ed4956" data-id="{{post.id}}"></i>
{% raw %}{% else %}{% endraw %}
     <i class="like-btn far fa-heart" style="color:black" data-id="{{post.id}}"></i>
{% raw %}{% endif %}{% endraw %}
```

- then() : 성공했을 때
- catch() : 실패했을 때

```html
// list.html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script type="text/javascript">
        # 모든 하트버튼 가져옴
        let likeBtnList = document.querySelectorAll('.like-btn')
        // console.log(likeBtnList)
        for(const likeBtn of likeBtnList){
            // console.log(likeBtn)
            # 각각의 버튼에 리스너를 달아줌
            likeBtn.addEventListener('click', (e) => {
                console.log(e.target)
                const post_id = e.target.dataset.id
                # 게시글 번호에 따라 url에 axios요청
                ## urls에 <int:id>로 정해놨기 때문에
                axios.get(`/posts/${post_id}/like/`)
                .then(function(response){
                    # 여기의 response.data 는 views.py에서 해준 True, False값
                    ## 실제로 버튼을 바꾸는게 아니라 'far'/'fas' 클래스 조작을 통해 바꿔줌
                    if(response.data.is_like){
                        # 버튼을 누른 타겟
                        e.target.classList.remove('far') ## 빈하트
                        e.target.classList.add('fas') ## 채워진하트
                        e.target.style.color = "red"
                    }else{
                        e.target.classList.add('far')
                        e.target.classList.remove('fas')
                        e.target.style.color = "black"
                    }
                })
                .catch(function(error){
                    console.log(error)
                })
            })
        }
</script>
```

- 위와같이 수정을 하면 html파일이 넘어오기 때문에
- views.py에서 Json데이터로 받아올 수 있도록 처리

```python
# views.py
## def like의 return 수정
### response를 javascript object형태로 바꿔서 return해줌
from django.http import JsonResponse

    if user in post.likes.all(): 
        is_like = False
    else:
        post.likes.add(user)
        # 추가
        is_like = True

return JsonResponse({"is_like":is_like})
```

- 좋아요 수 수정

```python
# views.py
## def like수정
return JsonResponse({"is_like":is_like, "like_count":post.likes.count()})
```



```html
# _post.html
## span태그 추가
<p class="card-text">좋아요 <span id="like-count-{{post.id}}">{{post.likes.count}}</span>개</p>
```



```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script type="text/javascript">
    let likeBtnList = document.querySelectorAll('.like-btn')
    for(const likeBtn of likeBtnList){
        likeBtn.addEventListener('click', (e) => {
            const post_id = e.target.dataset.id
            axios.get(`/posts/${post_id}/like/`)
                .then(function(response){
                if(response.data.is_like){
                    e.target.classList.remove('far')
                    e.target.classList.add('fas')
                    e.target.style.color = "red"
                } else{
                    e.target.classList.add('far')
                    e.target.classList.remove('fas')
                    e.target.style.color = "black"
                }
                console.log(response.data.like_count)
                # 요기 추가
                document.querySelector(`#like-count-${post_id}`).innerHTML = response.data.like_count
            })
                .catch(function(error){
                console.log(error)
            })
        })
    }
</script>
```

- 팔로우 수정
