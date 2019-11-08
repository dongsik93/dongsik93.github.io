---
layout: post
title: "Docker와 Nginx를 이용한 프론트엔드서버  "
subtitle: "Docker와 Nginx를 이용한 프론트엔드서버  띄우기"
date: 2019-09-02 18:00:00 +0900
categories: til
tags: etc
comments: true
---

## Docker와 Nginx를 이용한 프론트엔드서버 

### 웹 프론트 페이지 Docker, Nginx 사용해서 띄우기

<br>

- Putty를 사용해서 Linux 인스턴스에 연결

- aws ubutnu 

<br>

#### Nginx설치

<br>

- `Nginx`란 ?
  - 러시아의 한 개발자가 apache의 **C10K 문제** (한 시스템에 동시접속자 수가 1만명이 넘어갈 때 효율적인 방안)를 해결하기 위해 **Event-Driven** 구조로 만든 웹 서버 SW
  - 프로세스 내부에서 **비 동기 방식**으로 효율적으로 작업들을 처리
- Nginx Docker 설치

```bash
$ sudo docker pull nginx:latest
```

- Nginx 설치 후 프론트 페이지를 작성한 폴더를 ubuntu local에 붙여 넣기 해준다
- Nginx Docker 컨테이너를 실행해 준다

```bash
$ sudo docker run --name nginx-chainVilien -v /home/ubuntu/chainVilien/webFront:/usr/share/nginx/html:ro -d -p 3308:80 nginx
```

- `--name` : docker container 이름 설정
- `-v` : local에 있는 /home/ubuntu/chainVillien/webFront 폴더를 nginx docker의 /usr/share/nginx/html 폴더와 mount
- `-d` : background에서 실행
- `-p` : 포트설정 local 3308 포트를 nginx container 80 port

<br>

#### 결과

<br>

- aws에 나온 주소 + 포트로 url 접속하면 돌아간다

<br>

<br>

참고사이트

- [MINIMI LAB](https://minimilab.tistory.com/8){: class="underlineFill"}