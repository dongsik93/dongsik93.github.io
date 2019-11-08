---
layout: post
title: "Django EB오류"
subtitle: "Django EB오류해결 "
date: 2019-07-15 18:00:00 +0900
categories: til
tags: django
comments: true
---

## Django Elastic Beanstalk 배포 오류해결



### 오류상황

- 로그인시 JWT토큰을 발급하고, 발급 후에는 JWT토큰을 이용해서 클라이언트와 서버간의 통신시 인증을 수행

- `Postman` 을 통해 로컬에서 테스트를 무사히 마치고 AWS EB에 배포까지 완료

- 하지만 로그인시 계속 401에러가 발생

  - 에러 메세지

  ```
  detail : Authentication credentials were not provided.
  ```

> SSL을 추가했지만 왜 도대체 안되는지 모르겠다....
>
> 몇시간 째 삽질.....

<br>

### 오류 발생 원인

- 알고보니 AWS EB에서의 아파치 설정이 기본적으로 인증용 헤더정보는 넘겨주지 않는게 원인이였다
- default값이 Off인 `WSGIPassAuthorization`설정을 On으로 지정해줘야 인증용 헤더정보를 넘겨준다. 
- 그래서 JWT 헤더가 넘어가질 않아서 토큰이없다고 에러가 계속 나왔다.

<br>

### 해결

- `*.config` 에 wsgi.confg 를 수정해준다

```
# *.config
container_commands:
	01_wsgipass:
		command: 'echo "WSGIPassAuthorization On" >> ../wsgi.conf'
```

참고사이트

- [Zealla블로그](https://zeallat.wordpress.com/){: class="underlineFill"}