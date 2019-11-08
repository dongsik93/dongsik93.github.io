---
layout: post
title: "AWS에 SSL 인증서 붙이기"
subtitle: "AWS SSL"
date: 2019-07-09 19:00:00 +0900
categories: pro
tags: MovieInfo
comments: true
---

## 프로젝트의 현 주소

- 현재 프로젝트의 REST API 서버는 `aws elastic beanstalk` 에 배포
- 클라이언트 서버는 `firebase`에 호스팅
- firebase는 https를 제공하지만 aws eb는 http를 기본으로 제공하기 때문에 서로 통신이 불가능
- ELB(Elastic Load Balancing)을 사용하여 HTTP 트래픽을 HTTPS로 리디렉션 해야하는 상황이 발생


## AWS에 SSL 인증서 붙이기


### 도메인 주소 생성

- freenom 에서 도메인 생성

- 생성 후 aws route 53에서 도메인 관리



#### route 53

- 생성된 레코드 세트에 들어가면

  ```
  이름 서버의 도메인 이름입니다.
  ```

  위 글과 함께 여러 이름 서버가 나오는데, 이걸 freenom에 추가해 줌

- 레코드 세트 생성 (총 2개)

  - 유형 A와 aws에 배포해둔 서버를 연결
    - 이름,라우팅 정책, 대상 상태평가는 default로
  - 이름에 `www.`을 추가한 유형 A를 한개 더 연결

- 위 과정을 마무리 하면 레코드 세트가 총 4개 



### SSL 발급

- ssl발급을 위해 `aws Certificate Manager`로 이동
- 인증서 요청으로 배포해둔 서버에 dns 인증서 요청을 함



### 인증서 적용

- 배포 서버에 ssl 인증서를 적용하기 위해 `Elastic Beanstalk`으로 이동
- 해당 어플리케이션 - 구성 - 로드밸런서로 이동
- Application Load Balancer
  - 리스너를 추가 해준다
    - 포트는 443 / 인증서는 위에서 발급받은 인증서 / 프로토콜 https
- 적용하면 완료!