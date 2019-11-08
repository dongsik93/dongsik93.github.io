---
layout: post
title: "Database basic"
subtitle: "database"
date: 2019-01-22 18:00:00 +0900
categories: til
tags: db
comments: true
---

## database sql기초

### 

### SQLite

- 가벼운 RDBMS


```sqlite
.headers on
.mode column

SELECT * FROM students;
# 표 이쁘게 하기
```



- 파일생성

```sqlite
$ sqlite3 tutorial.sqlite3
```

- 테이블 생성

```sqlite
CREATE TABLE classmate(
	id INT PRIMARY KEY,
    name text
);
```

- 데이터 타입 : 동적데이터 타입
  - int
  - text
  - real
  - numeric
  - blob
  - boolean이 없어서 정수 0, 1로 저장



```sqlite
.tables
# 테이블 목록 조회

.schema classmate
# 특정 테이블 스키마 조회
```

- 테이블 삭제

```sqlite
drop table classmate;
```



### 데이터 추가 / 읽기 / 수정 / 삭제

c r u d ( insert / select / update / delete )

```sqlite
INSERT INTO classmate (name, age) VALUES ("홍길동", 23)

```



- 데이터무결성과 id(pk)값 자동증가

```sqlite
create table classmates(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	age INT NOT NULL,
	address TEXT NOT NULL
);
# AUTOINCREMENT 는 INTEGER로 사용해야 가능 int나 다른 형은 오류
```



- AUTOINCREMENT는 강제로 다른 값을 줄 수 있지만 그 다음은 항상 마지막 값(가장 큰)을 기준으로 증가하게 된다.  

- AUTOINCREMENT는 지운 후 그 값을 다시 강제로 입력하면 입력이 가능( django에서는 안됨)

```sqlite
select id, name from classmates limit 1 offset 2
# limit은 처음부터 n까지의 레코드를 보여줌
# offset은 해당 n위치의 레코드를 보여줌 (0부터시작)
```



#### 수정

```sqlite
update classmate
set age = 31
where age = 30
```



#### where

```sqlite
.mode csv
.import user.csv users
```



#### like

- 정확한 값에 대한 비교가 아닌, 패턴을 확인

```
1__ : 1로 시작하고 4자리인 값
%2% : 2가 들어가는 값
2_%_% : 2로 시작하고 적어도 3자리인 값
```



결과를 wb옵션으로 저장 / 저장되는 파일 명은 이미지 폴더 내에 영진위 영화 대표코드.jpg로 저장



## ORM(object relational mappnig)

- #### 파이썬 코드를 sqlite3와 1:1 매핑



- 파이썬에서 외부 모듈을 설치해야함

```terminal
$ pip install flask_sqlalchemy
$ pip install flask_migrate
```



- 현재 폴더에 sqlite라는 프로그램을 사용해서 database를 만들겠다는 의미

```python
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///flask_db.sqlite3"
# sqlite3 대신 다른 db프로그램을 아무거나로도 연동이 가능하다
```



- 자동으로 파일을 detect하는걸 False로 

```python
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
```



- 파이썬 코드로 클래스 생성

```python
class User(db.Model):
    # Model을 상속
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable = False) 
    email = db.Column(db.String(50))

   
# sql과는 완전히 다름에 유의
primary_key = True # pk 
unque = True # 이름이 유일
nullabe = False # not null 의미
```



<span style="color:blue">blueprint</span> (= 청사진, 번역본 : 은유적 의미)

```terminal
$ flask db init 		   # 새로운 폴더를 만들었다 db를 관리하려는 공간을 만듬 (모델링)
$ flask db migrate 		   # 만들어진 공간에 blueprint(번역본)을 만듬
```

- 하고나면 `versions` 폴더 안에 이상한이름_py파일이 생김(blueprint)

```terminal
$ flask db upgrade 				  # blueprint(번역본)을 반영시킴
```

- 하고나면 ~~~~.sqlite3 파일이 생김 - blueprint(번역본) 반영 결과
- 해당 파일을 sqlite3로 열어서 `.tables` / `.schema` users로 확인



```python
$ python
>>> from app import User   # 만든 app에서 User class 받아옴
>>> User()
<User (transient 140450887708232)>
>>> from app import *  # 모든 변수 다가져옴
>>> db
<SQLAlchemy engine=sqlite:////home/ubuntu/workspace/Studying/orm/flask_db.sqlite3>

>>> user = User(name="동식", email="ehdtlr9376@naver.com")  
# user 객체에 User테이블에 값을 넣고 할당
>>> db.session.add(user)
>>> db.session.commit()
# db에 만든 user를 보내줌
## SQL에서의 CREATE 에 해당하는 작업

>>> first_user = User.query.get(1)
# get(1)은 id값이 1이니까
# 다 가져올려면 .all()
>>> first_user.name
# 동식
>>> first_user.email
# 이메일 출력

## 수정
>>> first_user.name = "문동식"
# 객체만 바뀌지 db에 저장이 되지는 않음
>>> db.session.add(first_user)
>>> db.session.commit()
# db에 저장
>>> first_user = User.query.get(1)
>>> first_user.name
문동식
# 수정된 걸 확인

# 쿼리를 날려서 받아오는걸 레코드 단위로 인스턴스 객체처럼 받아온다
```