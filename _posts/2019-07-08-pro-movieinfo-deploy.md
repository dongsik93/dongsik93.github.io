---
layout: post
title: "웹서비스 배포하기(AWS)"
subtitle: "AWS Elastic Beanstalk"
date: 2019-07-08 19:00:00 +0900
categories: pro
tags: MovieInfo
comments: true
---

## 웹 서비스 배포 (AWS Elastic Beanstalk)


### 0.준비

1. AWS 계정 생성

2. 해외 결제 가능 카드 결제정보 등록, 무료

3. 내 계정, console login

### 1.프로젝트 설정

1. git ignore설정

   1.gitignore 파일 생성 

   2. gitignore.io 에서 python 가져오기, gitignore파일에 복붙 저장

2. pip 설정

   1. 
   ```
      pip freeze > requirements.txt
    ```

3. 루트페이지 설정, 경로 잡아주기

   1. 최상단 urls.py 에서 코드 수정 (main인 페이지를 기본 페이지로 설정)

      ```
      path('', views.list), => path('', views.main),
      ```



### 2.AWS IAM 설정 ; 권한 만들기

#### AWS 서비스 - 서비스 찾기 - 왼쪽의 사용자 - 맨위의 사용자 추가 

- 사용자 이름 : ebAdmin (엘라스틱빈스톡,이름은 임의로 설정가능)

- 프로그래밍 방식 엑세스

- 기존정책직접연결: AWSElasticBeanstalkFullAccess검색,ElasticLoadBalance 검색, 체크박스 클릭 (aws서비스의 모든 권한중에 이것만 사용할수 있는 새끼 계정을 만드는 것임)- 다음 - 다음

- 사용자 이름. 프로그래밍 방식, 정책 다 확인

- 액세스 키 복사해서 항상 기억하기....필기해두기 ...담에 다시 볼 기회가 없다...



### 3.AWS 계정 설정

1. awscil 설치

   1. pip install awscli

      ```
      pip install awscli
      ```

      

   2. 설치 확인

      ```
      aws --version
      ```

   3. 계정 설정

      ```
       AWS Access Key ID: 본인 KEY ID 입력
        AWS Secret Access Key: 본인 Secret Access 입력
        Default region name: ap-northeast-2 # 한국
        Default output format: json
      ```

   4. 확인

      ```
      vi ~/.aws/config
      vi ~/.aws/credentials
      ```

### 4.EB 실행

1. ec cli 설치

   ```
   pip install awsebcli
   ```

2. 프로젝트로 이동

3. 설정

   ```
   eb init
   ```

4. 어플리케이션 default, python3.6,commit No, 

   에러가 나옴... => ascii code 때문임...

   ```
   eb init --debug
   No 선택
   에러확인 - sourcecontol.py 클릭해서 오픈 
   - 294번째에 with open 부분 수정
   'r'-> 'r', encoding='utf-8' 
   - 다시 console 열기
   eb init --debug
   N 선택
   N 선택
   ```

   왼쪽에 폴더 생성이 된 것을 확인

### 5.Django 설정

1. admin을 위한 계정 설정

   ```
   python manage.py createsuperuser
   id: dongsik
   password : 1
   ```

2. 유저 정보 담긴 json 생성

   1. 수퍼유저 만들기

   - 유저 확장한 경우

   ```
   python manage.py dumpdata accounts.User --indent 4 > users.json
   ```

   - 유저 확장 안한 경우 (기본 model사용) => 우리 이렇게 했음

   ```
   python manage.py dumpdata auth --indent 4 > users.json
   파일 생성 확인, 맨아래에 username : 'dongsik'확인
   ```

   2. 만들어진 파일은 accounts/fixtures 폴더로 이동

3. static  루트에 있음

   1. staticfile설정
      - settings.py 설정

   ```
   STATIC_URL = '/static/'
   STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
   
   # 얘는 프로젝트마다 선택사항 (없는 경로를 쓰면 deploy 시 에러)
   STATICFILES_DIRS = [
       STATIC_DIR = os.path.join(BASE_DIR, 'static'),
   ]
   ```

   2. 프로젝트 루트에 폴더 생성

      ```
      mkdir .ebextensions
      ```

   3. `.ebextensions/default.config `폴더 안에 들어가기, 파일 생성 후 작성

      ```
      default.config
      option_settings:
          aws:elasticbeanstalk:application:environment:
              DJANGO_SETTINGS_MODULR: <프로젝트명>.settings
          aws:elasticbeanstalk:container:python:
              WSGIPath: <프로젝트명>/wsgi.py
          aws:elasticbeanstalk:container:python:staticfiles:
              /static/: staticfiles/
      ```

      settings.py가 어디있는지

      장고 어플리케이션이 서버와 통신하기 위한 규칙은 wsgi.py을 그대로 사용하겠다.

      스태틱 파일 이거야

   4. 배포 후 실행할 명령어 `ebextensions/migrate.config` 파일 생성 후 작성

      ```
      # .ebextensions/db-migrate.config
      container_commands:
          01_migrate:
              command: "python manage.py migrate"
              leader_only: true
          02_chown_sqlitedb:
              command: "sudo chown wsgi db.sqlite3"
              leader_only: true
          03_createsuperuser:
              command: "python manage.py loaddata users.json"
              leader_only: true
          04_collectstatic:
              command: "python manage.py collectstatic"
      ```

### 6.EB create

1. eb create생성

   ```
   eb create
   Enter En~~
   : 엔터
   -dev로 사용
   : 엔터
   type
   : 2
   엔터
   ```

   git is in a detached head state. Using brach "default"에러가 난다면 git commit을 한다.

   ```
   다시 같은 작업 실행
   eb create
   Enter En~~
   : 엔터
   -dev로 사용
   : 엔터
   type
   : 2
   엔터
   기다리기
   ```

   기도를 성실히 할것

   Error your WSGIPath ~~ 이거 경로 설정 다시해준다.

   AWS 들어가서 맨 왼쪽에 서비스 - elasticbeanstalk 검색 후 클릭

   - 우측 상단에 오하이요 서울로 바꿔주기

   AWS 들어가서 맨 왼쪽에 서비스 밑에 프로젝트명 클릭 

   - 심각 확인

   - 구성 - 소프트웨어 수정

     WSGIPath : <프로젝트명>/WSGI.py

     적용, 아직 심각.. 하지만 

     구성 - 수정 - 바꼈는지 확인

     

### 7.환경변수 설정

1. 사용한 환경변수 적용. aws사이트에서도 가능

   ```
   eb setenv SECRET_KEY='your_key' AWS_ACCESS_KEY_ID='your_id'
   ```



### 8.ALLOWED_HOST 설정

1. CNAME 확인

   ```
   eb status
   ```

2. settings.py 에 ALLOWED_HOST 추가

   settings.py 에서 allowedhost -> '*' 이면 넘어감



### 9.Deploy

1. 커밋 남기기
    - 중요한 작업..... 커밋을 남긴 후 `deploy`해야 변경사항이 적용됨....!!

   ```
   git add . 
   git commit -m "deploy"
   ```

2. 배포하기

   ```
   eb deploy
   ```

3. 기도하기

4. 아까 사이트로 들어가보기, admin도 들어가보기

### 10.API 환경변수에서 사용한 경우

- 구성 - 소프트웨어 수정 - 맨아래 환경변수 설정 가능

- TMD_KEY  , 값 입력

- 적용

참고
- 우리반 은솔님이 정리해주신 문서
- [은솔github](https://github.com/selinayoon){: class="underlineFill"}