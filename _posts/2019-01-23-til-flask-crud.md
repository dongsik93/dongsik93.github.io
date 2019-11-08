---
layout: post
title: "flask crud"
subtitle: "flask"
date: 2019-01-23 18:00:00 +0900
categories: til
tags: flask
comments: true
---

## flask crud



```terminal
$ git remote add origin(별명 아무거나 가능) https://~레포주소
$ git push -u origin(위에서 썼던 별명) master
```

- `-u` 옵션 :  upstream / 한번 주면 1번으로 잡아준 origin(별명)에 다음부터 push만해줘도 올라감
- master : branch중 하나, 분기점이 없는 상태에서 올리는거 ?

### github에 올려진 상태에서 gitlab에 올리기

```terminal
$ git remote -v							# 지금 원격저장소로 저장된 주소가 보임

$ git remote add gitlap https://lab.ssafy.com/dongsik93/01_python.git
# 명시적으로 origin을 gitlap으로 명시
## remote가 두개가 됨

$ git push gitlap master
```



## project movie review



#### 1. 주말 / 주간 박스오피스 api

- rest방식을 통해 .json url 로 요청을 보낸다
- url은 깔끔하게 만들어야 좋다  ( url 뒤에 key / targetDt를 쪼개서 다른 url변수에 담는다)
- 한번에 모든 10주 정보를 받아오는게 아니라, 한 주의 정보를 받아와서 어떻게 넘어오는지를 확인
- print찍는 습관을 들여라
- 넘어온 json파일을 영진위 홈페이지에서 응답에 대한 변수명을 확인한다
- datetime.datetime.striptime( 20190113, "%Y%m%d" ) :  a를 b형식으로 적었어 라고 넘겨주는

##### api사용할 때 요청변수가 필수인 경우는 무조건 넣어줘야 함

```termianl
$ tail ~/.bashrc
맨 아래쪽부터 10줄이 읽힘
```



#### 요청방식(verb) / crud

get = read

post = create

put / peach = update

delete = delete



## Crud 실습

- 파일을 두개로 나눠서 모델을 선언한 파일을 import하는식으로

```python
from flask import Flask
from flask_migrate import Migrate
from models import db, Todo

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///flask_db.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# db = SQLAlchemy(app)
db.init_app(app)
migrate = Migrate(app,db)


@app.route("/")
def hello():
    return "Hello World!"
    
    
if(__name__ == "__main__"): 
    app.run(debug=True,host="0.0.0.0",port=8080)
```

만들어주고

```terminal
$ flask db init
$ flask db migrate
$ flask db upgrade
```

#### c

/new

/index

#### r

/create

/<int : id>      #id값에 해당하는 걸 보여줘  

#### u

/<int : id> /edit

/<int  : id> /update

#### d

/<int:id>/delete