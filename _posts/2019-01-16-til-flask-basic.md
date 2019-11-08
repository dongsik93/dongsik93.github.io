---
layout: post
title: "flask basic"
subtitle: "flask"
date: 2019-01-16 18:00:00 +0900
categories: til
tags: flask
comments: true
---

## Flask

vim  :  https://vim-adventures.com/

flask : http://flask.pocoo.org/

### flask시작

- pip install Flask
- 

app.py에 붙여넣기

```python
from flask import Flask
app = Flask(__name__)

@app.route("/") 		# 라우팅 처리를 했다 ~
def hello():
    return "Hello World!"

# flask에서 Flask함수(클래스)를 가져옴
# rout함수를 실행하고 / 적용시키고 ~
```

- 해당 위치디렉토리로 가서 
- FLAKS_APP=app.py flask run --host=$IP --port=$PORT

`/` : 루트주소

### route





### 디버그 모드

```python
if(_name__ == "__main__"):
    app.run(debug=True,host="0.0.0.0",port=8080) 
# app은 Flask객체 / debug모드로 호스트, 포트를 설정
```

- 이거 해주면 이제 터미널에 python app.py로 자동으로 돌려줌 

- 자동으로 재시작을 해줘서 껐다 켰다 안해도 됨
- 오류 발생시 에러코드 알려줌



### html 보내주기

- render_tamplate() : 현재 폴더 내의 templates폴더를 찾고 그 안의 html문서를 가져옴
- 폴더이름은 꼭 templates로 해주어야 함



### variable routing

- 여러가지 경우의 수를 처리해 주는 것 url을 변수화

```python
@app.route("/student/<string:name>")
# name이라는 변수에 받음 
def student(name):
    return render_template("student.html", name = name)   
```



### 공통페이지

- html 페이지간 <span style="color:red">상속</span>을 통해 

```html
<!--베이스 html파일에 넣기-->
{% raw %}{% block body_block %}{% endraw %}
{% raw %}{% endblock %}{% endraw %}

<!--상속받는 html파일에-->
{% raw %}{% extends'base.html' %}{% endraw %}
{% raw %}{% block body_block %}{% endraw %}
	<!--보여주고 싶은 태그를 제외한건 다 지우기-->
    <h1>오늘은 {{one_pick}} !! 이거먹어라 !! </h1>
    <a href="/index">홈 화면으로 돌아가기</a>
{% raw %}{% endblock %}{% endraw %}
```


