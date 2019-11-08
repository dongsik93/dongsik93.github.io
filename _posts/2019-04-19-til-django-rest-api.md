---
layout: post
title: "django"
subtitle: "django rest API"
date: 2019-04-19 18:00:00 +0900
categories: til
tags: django
comments: true
---

## 190419



### REST API



- postman 설치
- tmdb api 사용
  - 회원가입 후 api 권한 획득하기

##### test



- get-top-rated 요청 보내보기
  - movie/top_rated

```
## 서버주소
https://api.themoviedb.org/3/movie/top_rated
```

- 위 주소를 `postman`으로 요청보내기

- `required`인 api_key를 같이 보내줘야 함
  - `postman`에서 추가
  - JAON형식으로 응답이 옴



```
https://api.themoviedb.org/3/movie/top_rated?api_key=mykey
```

- url주소 뒤에 붙는건 `postman`에 입력한 api_key정보가 들어가서 요청

- `language` 추가 : `ko-kr`

```
https://api.themoviedb.org/3/movie/top_rated?api_key=mykey&language=ko-kr
```



- details 요청 보내보기
  - movie/{{movie.id}}

```
https://api.themoviedb.org/3/movie/278?api_key=mykey&language=ko-kr
```



- `AUTHENTICATION` : 인증, 내가 가지고 있는 계정이 이 서비스에 접근이 가능 하게, `OAuth` 
  - OAuth와 함게 춤을 이라는 좋은 글 : <https://d2.naver.com/helloworld/24942>

- Create  request token

  - `postman`을 통해 `api_key`를 넣어서 토큰을 발급 받는다

  - ```
    https://api.themoviedb.org/3/authentication/token/new?api_key=mykey
    ```

  - 결과값은 `success` / `expires_at` / `request_token`

- Ask the user for permission

  - ```
    https://www.themoviedb.org/authenticate/{REQUEST_TOKEN}
    ```

  - 결과 : 3rd Party Authentication Request

- Create a session ID (POST방식)

  - 얘는 `required`가 두개

  - `Request Body`는 JSON방식으로 token을 넣어줘야 함

    - `postsman`에서 `raw`를 누르고 보내주면 됨

    - ```
      {
      	"request_token":"토큰값"
      }
      ```

  - ```
    https://api.themoviedb.org/3/authentication/session/new?api_key=mykey
    ```

  - 결과 : `success` / `session_id`



- Rate Movie
  - `api_key`,`session id`를 `Query Parmas`에 추가
  - value(평점)을 JASON으로 추가





### api 서버 만들기

```
django-admin startproject rest
django-admin startapp movies
pip install django_rest_framework # 설치 후 installed_app에 추가(rest_framework)
```



```python
# models.py
from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=20)
        
class Movie(models.Model):
    title = models.CharField(max_length=30)
    audience = models.IntegerField()
    poster_url = models.TextField()
    description = models.TextField()
    genre = models.ForeignKey(Genre, related_name='movies', on_delete=models.CASCADE)
    
class Score(models.Model):
    content = models.CharField(max_length=140)
    score = models.IntegerField()
    movie = models.ForeignKey(Movie, related_name='scores', on_delete=models.CASCADE)
```

- 폴더 추가 - 파일 다운로드 후

```
python manage.py loaddata genre.json
python manage.py loaddata movie.json
```



```python
# rest-urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('movies.urls')),
    # 이 주소는 api를 위한 주소라는걸 명시
]
```



```python
# movies-urls.yp
## app_name설정을 안하는 이유는 api니까
### app_name은 html에서 편리하게 사용하기 위함이고, api는 html을 x니까
from django.urls import path
from . import views

urlpatterns=[
    path('movies/', views.movie_list),
    ]
```



```python
# movies-serializers.py
## 얘는 JSON형식으로 받기 위한것
### modelform과 구조가 매우 비슷
from rest_framework import serializers
from .models import Movie

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'
```



```python
# movies-views.py
from django.shortcuts import render
from .models import Movie
from rest_framework.decorators import api_view
from .serializers import MovieSerializer
from rest_framework.response import Response

# get방식으로 받겠다 라는 의미
@api_view(['GET'])
def movie_list(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True) # 데이터를 여러개 보여줄 때 주는 옵션
    return Response(serializer.data)
```

- ##### 문서화 하기

```
pip install django-rest-swagger # installed에 rest_framework_swagger로 추가
```



```python
# rest-urls
from rest_framework_swagger.views import get_swagger_view

schema = get_swagger_view(title="영화정보 API")

    path('', schema),
```

- 루트주소로 가게되면 위에서 해준 문서로 가게 됨



#### API서버는 html을 return하는게 아니라 JSON을 리턴 ! 







##### 




  

