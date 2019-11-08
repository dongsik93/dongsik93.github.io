---
layout: post
title: "Django에 postgreSQL 연결하기"
subtitle: "Django에 posgreSQL 연결하기"
date: 2019-10-13 22:00:00 +0900
categories: til
tags: django
comments: true
---

## Django에 postgreSQL 연결하기

> mac os 10.15 version



#### PostgreSQL 설치

##### postgresql 10버젼 설치

```shell
brew search postgresql@10
```

##### 설치 경로 확인

```bash
brew services start postgresql@10
>> Successfully started `postgresql@10` (label: homebrew.mxcl.postgresql@10)
```

##### <br>

### psycopg2 설치

- `psycopg2` 는 python과 postgreSQL을 연동하기 위해 필요한 python 라이브러리

```shell
pip install psycopg2
```

- 에러발생

```
Error: pg_config executable not found.
```

- 왜?
  - 검색해보니 posycopg2 관련 모듈이 업데이트 되면서 postresql 바이너리를 찾지 못하는 문제

- 해결
  - postgreSQL 재설치(최신버전)

```shell
brew install postgresql
```

- 하지만 또 에러...
  - 대충 psycopg2-binary를 설치하라는 말 같다

```
You may install a binary package by installing 'psycopg2-binary' from PyPI.
If you want to install psycopg2 from source, please install the packages
required for the build and try again.
```

- 하지만 또 에러에러에러에러
  - 찾아보니 얼마전 mac os 업데이트가 있었는데 이 때문에 command line tool 관련한 이슈가 발생한다고 한다..(나는 xcode를 안쓴는데도..)

```shell
xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools)
```

- 다시 해결

```shell
xcode-select --insatll
```

- 드디어 설치해보면 완료 !! ...되는줄 알았지만 또 오류가...
  -  psycopg2와 같이 C 또는 C로 작성된 Python 확장을 컴파일하는 데 필요한 python-dev를 설치해야한다고한다...
  - 검색해보니 mac에서 brew로 설치하면 python-dev가 내장되어있다고 한다.. 그렇다면 왜??

```pythob
error: command 'gcc' failed with exit status 1
```

- 검색결과 
  - brew대신 openssl로 설치해본 결과 설치가 완료되었다
  - 이번에 mac을 catalina로 업데이트한 이후로 에러가 계속...

```shell
env LDFLAGS="-I/usr/local/opt/openssl/include -L/usr/local/opt/openssl/lib" pip install psycopg2
```

- [psycopg2 library not found for lssl](https://stackoverflow.com/questions/26288042/error-installing-psycopg2-library-not-found-for-lssl){: class="underlineFill"}

##### postgreSQL 접속

- django 연결에 앞서 설치되었으니 들어가서 이것저것 해보자

```shell
# 접속
psql
```

- 에러가 발생한다
  - 해당 디비가 없다고 나온다
  - 설치한 내 계정과 동일한 db를 디폴트로 주기 때인것 같다

```shell
psql: FATAL:  database "dongsik" does not exist
```

- 해결

```postgresql
// 관리자 계정
psql -d postgres

// 접속이 되면 #으로 terminal이 바뀜
// test라는 이름의 db를 dongsik이라는 사용자로
# CREATE DATABASE test OWNER dongsik;
```

- 여기까지하면 db생성까지 완료
- 기본적인 명령어

```shell
# 데이터베이스 목록 조회
\list
# 데이터베이스 선택, 연결
\connect <dbName> or \c <dbName>
```



<br>

#### Django에 연결하기

- 위에서 만들어놓은 데이터베이스를 django에 연결해보자

```python
# django의 setting.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test',
        'USER': 'test',
        'PASSWORD': '1234',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```

- password를 설정해준 이유는 안해줬을 때 django에서 password가 없다는 말이 계속 뜬다고 한다
- port는 기본포트(5432)를 사용하기 때문에 공백으로

##### migration

```python
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

##### 확인

- postgres 터미널로 들어와서 테이블 리스트 확인하기

```
# \dt
```

![postgres](/img/in-post/postgres.png)

- 위 테이블에서 `gogo_user` 가 `models.py`에서 만든 테이블

<br>

- 참고사이트

[장고에서 POSTGRESQL 사용하기](https://doorbw.tistory.com/183){: class="underlineFill"}