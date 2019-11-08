---
layout: post
title: "HTML, CSS"
subtitle: "html , css"
date: 2019-01-15 18:00:00 +0900
categories: til
tags: html
comments: true
---


## HTML & CSS

### FORM

- input들을 넣어줄 때 마다 name설정을 해줘야 url에 찍히고 그 url에 따라서 요청 처리를 해줌

- 데이터를 전송할 때 한글을 value값으로 넣는건 좋지 않다 / 이름 제외



### 확인(validation)

1차 : front쪽에서 옵션에 disabled를 해주면 됨

2차 : ? ?  ? 까지 통과해야됨



### url주소

file:///C:/Users/student/html_tag/subway.html       // 

?peopel=&password=&date=&size=&bread=3&option=1  // 보내야 할 데이터는 폼에게 알려줘야함

```html
<form action="보낼 주소">
</form>
```



## CSS(Cascading Style Sheet)

- html = 정보와 구조화
- css = styling의 정의

css와 html파일을 분리해서 로드해서 사용하는 걸 권장



### 선택자

- 전체 선택자 : `*`
- 태그 선택자 : `h1` 처럼 직접
- 클래스 선택자 : `.`클래스 이름
- 아이디 선택자 : `#`아이디 이름

선택자우선순위 ! ! !

전체 << 태그 << 클래스 << 아이디 



### 클래스

- 같이 묶여야 할것들을 클래스로 선언해 한꺼번에 처리

### 아이디

- 한 페이지에 아이디 값은 한개 ?



```html
<p><span class="blue">여기는 파란색</span>나머지는 p태그다<span class="pink">여기는 분홍색</span></p>
```

### 볼드 / strong

```html
font-weight : bold; // 비 시맨틱 태그
strong // 좀 더 중요하게 판단, 시맨틱 태그
```



https://htmlcolorcodes.com/



### Box model

- padding :  테두리 안쪾 내부 여백
- border  : 테두리 영역
- margin : 테두리 바깥의 외부 여백

인라인-블락 : 한줄에 표시되면서 속성가능

None : 해당하는걸 화면에 보여주지 않는다

visibility:hidden : 해당 요소를 안보이게 ( 공간은 남아있음 ) 



### Font & size

font-size : 크기

font-family : 서체

letter-spacing : 자간설정

text-align : 정렬

white-space : 엔터처리?



### 선택자 추가



- 자식 선택자  : `>` //  ol`>`li*3 하고 tap누르면 emmet abbreviation 

ol.asdf 하고 tap

table>tr*3 tap 

ol#chocolate>li*3 : ol태그에 아이디값 chocolate을 넣고 li태그 3개생성