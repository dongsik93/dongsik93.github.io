---
layout: post
title: "github blog link style"
subtitle: "github blog"
date: 2019-06-18 23:00:00 +0900
categories: til
tags: git
comments: true
---


## Hyperlink style edit



- 기본 hyperlink가  별로 마음에 안들어서 수정을 해보기로 마음을 먹었다.
- 마음에 안들다기 보다는 예쁜 CSS적용된 hyperlink를 보니 마음이 움직였다ㅎㅎ..



- 기본 Link Markdown 문법

  ```
  [link][url주소]
  ```

- 클래스 추가

  ```
  [link][url주소?classes=클래스명,]
  ```

  활용 예) Markdown

  ```
  [link](http://google.com?classes=btn,btn-primary)
  ```

  Rendered HTML

  ```
  <a href="http://google.com" class="btn btn-primary">link</a>
  ```

  

- 차이를 확인해 보자

[dongsik93.github.io](https://dongsik93.github.io)

[dongsik93.github.io](https://dongsik93.github.io){: class="underlineFill"}



- `jekyll` 에 CSS적용을 하기 위해서 `_sass/` 에 scss를 만들어서 `_includes/styles/style.scss` 에 import를 해주면 된다 !!  

- 적용한 CSS 코드

```css
.underlineFill{
  position:relative;
  &::before{
    content:"";
    background-color:#ddd;
    z-index:-1;
    display:block;
    position:absolute;
    overflow:hidden;
    bottom:0;
    height:2px;
    width:100%;
    transition: height .3s ease;
    vertical-align:bottom;
  }
  &:hover{
    &::before{
      height: 100%;
    }
  }
}
```