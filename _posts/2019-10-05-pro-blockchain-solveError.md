---
layout: post
title: "BlockChain Project Solve Error"
subtitle: "blockchain7"
date: 2019-10-05 21:00:00 +0900
categories: pro
tags: BlockChain
comments: true
---

## 시간 문제, ssh 연결

### 시간문제

문제점 : 입력받은 시간과 서버의 시간이 다르게 찍힘

해결 : aws timezone과 mysql timezone을 kst로 바꿔줌

##### AWS timezone 바꾸기

```shell
sudo date
>> 현재 date 확인
sudo cat /ect/localtime
>> timezone 확인 : UTC0
sudo rm /etc/localtime
>> timezone 지우기
sudo ln -s /usr/share/zoneinfo/Aisa/Seoul /etc/localtime
>> kst로 localtime 바꿔주기
sudo date
>> 바꾼시간 확인
```

##### mysql timezone바꾸기

- application.properties에서 jdbc url 설정 바꾸기
  - serverTimezone=Asia/Seoul 추가

```java
jdbc:mysql://13.125.178.26:3307/haribo?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=Asia/Seoul
```



## SSH로 linux 인스턴스 연결하기

프로젝트를 windows에서 작업하고 있었고, 개인 노트북에서 추가 작업이 필요했기 때문에 aws에 접속해야 했다.

windows에서는 putty를 이용해서 aws ec2에 접속했지만 mac에서는 ssh로 시도해보기로 했다.



##### 필요한것

```
Public Ip
RSA Private Key
```

1. key chmod

   - `chmod` : Change mode, 파일 권한을 바꿔주는 커맨드
   - pem키를 사용해서 접속해야 하기 때문에 읽기 권한을 부여한다
   - 100 : 내게만 실행 권한 부여
   - 400 : 내게만 읽기 권한 부여
   - 755 : 내게 모든 권한, 그룹 / 전체에 읽기와 실행 권한 부여

   ```shell
   chmod 400 cert.pem
   ```

2. ssh 접속

   - 기본적으로 `ssh [사용자계정]@[서버주소]` 
   - `-i` : RSA 인증을 위한 비밀키를 읽어 올 identity파일을 선택
   - `-p` : 원격 호스트에 있는 연결할 포트 설정
   - 사용자계정에 ec2에서 기본적으로 제공하는 이름을 넣어준다

   ```shell
   ssh -i cert.pem ubuntu@PublicIp
   ```

3. 완료!

   - putty설치하고, pem파일 변환하고 이것저것 하는것 보다 ssh를 사용하는게 훨씬 간편하다



참고사이트

- [ssh 옵션](https://experiences.tistory.com/33){: class="underlineFill"}

