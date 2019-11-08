---
layout: post
title: "Jekyll blog Google에 검색가능하게 만들기"
subtitle: "jekyll blog google search"
date: 2019-07-27 18:00:00 +0900
categories: til
tags: etc
comments: true
---

## Jekyll blog Google에 검색 가능하게 만들기



### Google Analytics 설정하기

- 일단 [GA](https://analytics.google.com/analytics/web/?authuser=0#/provision/SignUp/){: class="underlineFill"} 에 가입을 한다
- 가입 후 추적 ID를 받은 후 `_config.yml`에 추가해준다

```
google_analytics:    UA-144665538-1
```

- 수정사항을 PUSH하고 다른 디바이스나 모바일로 접근하고 GA에서 확인해보면 끝!!
  - 확인은 실시간 메뉴에서 해야한다

<br>

### Jekyll blog 구글검색 가능하게 만들기


- Jekyll로 만든 블로그 글을 기본적으로 구글에서 검색이 되지 않기 때문에 따로 설정을 해줘야 한다.

<br>

##### 1. 구글 웹마스터 도구(Search Console)에 속성 추가 및 인증하기

- [구글 웹 마스터 도구](https://search.google.com/search-console/about?hl=ko&utm_source=wmx&utm_medium=wmx-welcome){: class="underlineFill"} 에 접속을 한 후 속성추가를 진행한다.
  - 도메인은 github에서 제공하기 때문에 DNS설정에 추가해 줄수 없어서 URL 접두어로 진행한다
- 제공되는 HTML파일을 저장해서 내 블로그 루트 디렉토리에 추가한 후 PUSH해서 완료해준다
  - 이 부분에서 계속 인증이 완료 되지 않았지만 하루 뒤에 다시 확인해보러 들어가니 해결이 되어있었다....시간 문제인걸로..

<br>

##### 2. sitemap.xml 파일 작성

- sitemap.xml 파일을 루트 디렉토리에 추가한후 PUSH
  - [sitemap.xml 내용 참고](https://github.com/wayhome25/wayhome25.github.io/blob/master/sitemap.xml){: class="underlineFill"}
- `sitemap.xml` 파일을 들여다 보면 `site.url`이라는 부분이 있는데  이 부분은 `_config.yml` 파일 내의 url  부분에 내 블로그 주소를 적용해 줘야 된다

```
# _config.yml
url : https://dongsik93.github.io
```

- `sitemap.xml` 안의 내용은 1~2행의 `---` 부분도 포함시켜야 한다

> 이 부분은 jekyll 테마를 포크떠오면서 다 되어있던 부분이라 손쉽게 패스 ! 

<br>

##### 3. Google Search Console에 sitemap.xml 제출

- 방금 위에서 추가해준 속성을 선택하고 Sitemaps를 선택해서 들어간다

- sitemap.xml 주소를 입력해준다

  - 오류 발생..

  ```
  This page contains the following errors:
  error on line 549 at column 72: EntityRef: expecting ';'
  Below is a rendering of the page up to the first error.
  ```

  - 구글링 결과 포스트 이름 중에서 `&` 가 들어가면 해당 오류가 발생 한다
  - 내가 올린 포스트 중 `&`가 포함된 내용의 제목을 지우고 해봤지만 또 오류...
  - 포스트의 `title` 도 바꾸고 해보니 해결...!

- 테스트 완료하면 끝 !!

<br>

참고사이트
- [초보몽키의 개발공부로그](https://wayhome25.github.io/etc/2017/02/20/google-search-sitemap-jekyll/){: class="underlineFill"}