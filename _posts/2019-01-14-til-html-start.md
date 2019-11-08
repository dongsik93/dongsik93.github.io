---
layout: post
title: "HTML start"
subtitle: "html start"
date: 2019-01-14 17:00:00 +0900
categories: til
tags: html
comments: true
---

## Web intro / HTML

웹 ? 뭐배움?

Web Service 를 만든다!

http://info.cern.ch/



```html
<!DOCTYPE html>    - 선언부
<html lang="ko">   - html내용
<head>             - head요소
    <meta charset="UTF-8">
    </head>
<body>			   - body부분
    
</body>
</html>
```



### HTML의 element는 태그와 내용(contents)로 구성되어있다

```html
<h1>              웹문서                </h1>
(여는/시작) 태그						(닫는/종료)태그
```

### 닫는 태그가 없는 태그도 존재한다. (self-closing element)

```html
<img src='url'/>
태그
이미지의 경우 주소만 적어도 됨
```

### 속성 : 태그에는 속성이 지정될 수 있다.

`=`을 기준으로 왼쪽은 속성명, 오른쪽 속성값, 각 사이에는 띄어쓰기가 없어야 한다(동작은 하지만 ~..)

```html
<a herf='google.com'/>
   속성명     속성값
```

### DOM트리 - 태그는 중첩되어 사용가능, 이때 다음과 같은 관계를 가짐

```html
<body>
    <h1>웹문서</h1>
    <ul>				body태그와 h1태그는 부모-자식관계
        <li>html</li>   li태그는 형제관계
        <li>CS</li>	    h1태그와 ul태그는 형제관계
        </ul>
    </h1>
</body>
```

### 시맨틱태그

- 컨텐츠의 의미를 설명하는 태그

| 태그    | 설명                 |
| ------- | -------------------- |
| header  | 헤더                 |
| nav     | 네비게이션 바        |
| aside   | 사이드에 위치한 공간 |
| section | 컨텐츠 그룹          |
| article | 여러내용들           |
| footer  | 푸터                 |

seo(검색엔진최적화)



## HTML_tag

vscode에 intro.html 생성



style에는 css가 들어갈 수 있다

css수정할 때는 `;`를 꼭 붙여줘야됨



script에는 javacript가 들어갈 수 있다

document

alert() : 창 띄워줌







https://www.w3schools.com -에서 HTML Reference에서 태그를 참고하기 / 방패모양5는 html5에서 동작



**상대경로** : 현재폴더안에있는 ./ben-favicon.png, 지금 내가 사용하고있는 html파일을 기준으로 경로

**절대경로** : c:/Users/students/html/~~ 이렇게 나로는데 절대경로



