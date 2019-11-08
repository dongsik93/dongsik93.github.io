---
layout: post
title: "웹 / 모바일"
subtitle: "웹 / 모바일"
date: 2019-06-20 18:00:00 +0900
categories: til
tags: etc
commtents: true
---

## 웹 / 모바일



### SPA 와 PWA

- Single Page Application
- Progressive Web App



##### 최신 프론트엔드 동향

- 보여주는 웹에서 반응하는 웹으로
  - 사용자의 행동에 반응하는 UI
  - Server-heavy에서 client-heavy로
- HTML + CSS로만 페이지를 만들던 시절은 끝
  - 동적인 웹 페이지 구현을 위한 Javascript기술
  - 데이터(model)와 보이는 것(view) 사이의 직관적인 연결
  - "Modern Frontend Frameworks" : Angular, Vue, React
- SSR(Server-side rendering)
  - 웹 브라우저로 어떤 URL에 접근할 때 서버는 URL에 해당하는 요청에 맞는 정보를 HTML에 전부 채워서 보낸다. 
  - 다른 페이지로 넘어갈 때마다 새로운 URL에 요청을 보내고 새로운 HTML을 받아 새로고침
- CSR(Client-side rendering)



##### SPA

- 초기 구동속도가 느리지만 한번 로드하고 나면 훨씬 빠른 인터랙션 속도
- JavaScript 웹 표준 문제... 오래된 브라우저(IE8 이하)에서는 JS의 최신 버전을 실행하지 못한다
- 보안 취약점 
  - SPA는 클라이언트에 쿠키를 저장하는데, 쿠키는 해킹의 위험이 크다
- SEO(Search engine optimization)
  - 구글을 제외한 검색 엔진에 웹사이트의 내용이 걸리지 않는다



##### 웹앱과 PWA

- 앱의 장점을 웹으로 가져오기 위한 트렌드
- 확장성이 좋다
- 다양한 기능을 제공
  - 홈 화면에 추가하기 기능



### Vue.js



- Vue, React, Angular....?
  - HTMl + vanilla JS 로만 코딩을 하면 **_웹 컴포넌트와 데이터 사이의 상관관계_**와 SPA에서 필수인 이들 사이의 즉각적인 상호작용을 구현하기 어렵다. 예전엔 이걸 다 JQuery로 했었다. 한마디로 말해서 SPA 개발을 예쁘게 할 수 있는 JS 라이브러리
- Vue 에서는 하나의 파일에 하나의 컴포넌트를 만들 것을 권장한다.
  - 높은 재사용성과 쉬운 유지보수
- 데이터 반응성
  - 자체적인 데이터 반응성(reactivity)
    - 컴포넌트의 상태가 변화하는 것을 알아서 감지해준다
    - 변화가 있을 때마다 거기에 맞춰 컴포넌트를 새로
- Vitual DOM
  - 가상의 DOM을 따로 저장해서 상태 변화에 따라 변화시킨 후 브라우저에는 최종겨로가만 렌더링한다
  - 속도를 빠르데 하고 선언적인 HTML
- MVVM 구조
- 고려할점
  - 학습 곡선이 낮다
  - 진입장벽이 낮다
  - 자유도가 낮은 프레임워크
  - 가볍고 빠르다
  - 많은 모듈을 제공한다



### Firebase



- 백엔드(서버)를 서비스로 제공
  - 서버를 구축하는데 필요한 시간 단축
  - 구글의 방대한 클라우드 시스템을 이용한 데이터베이스 및 스토리지 제공
  - 보안 문제도 알아서 해줌
  - 여러가지 API와 편의 기능을 제공
- NoSQL 클라우드 데이터베이스





### Git



- 분산된 버전 컨트롤 시스템

- 중심화된 VCS가 아닌 탈중심화된 VCS

  - 메인 서버를 중심으로 파일을 관리하는 것이 아니라 각 로컬 브랜치에 별도로 저장된다.
  - 서버다운에 취약 하지 않다
  - 오프라인 환경에서도 작업 가능

  