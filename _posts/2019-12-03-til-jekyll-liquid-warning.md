---
layout: post
title: "Jekyll Liquid Warning Error"
subtitle: "Jekyll blog"
date: 2019-12-03 22:00:00 +0900
categories: til
tags: Jekyll
comments: true
---

## Jekyll Liquid Warning Error

> 처음 블로그를 시작할 때 마주치게 되었던 에러 중 하나이다.
>
> Django를 주로 사용해서 개발을 진행하고, 문서를 정리하던 나에게는 엄청난 양의..? 코드를 수정해야했다...

### 에러는 왜 발생하는가?

- Jekyll에서 사용되는 liquid가 `{{`와 `}}`를 `escape` 문자로 사용한다. 따라서 문서에 escape문자가 들어있는 경우 Jekyll engine이 경고 메시지를 출력하고, 해당 escape문자 사이에 있는 내용은 무시된다

![1](/img/in-post/liquid-error/1.png)

![2](/img/in-post/liquid-error/2.png)

- 해당 문서에는 Django template language를 설명하는 내용이 담겨있었고 이와 Jekyll liquid가 충돌해서 나는 `github build error`사진이다

### 에러 해결

- 해당 내용을 liquid parsing을 하지 않기 위해서는 문장 앞뒤로 다음과 같은 tag를 추가해 주면 warning과 생략되어 나타나는 출력 문제를 해결할 수 있다

![3](/img/in-post/liquid-error/3.png)

- 위 사진은 에러가 발생하던 코드 부분이다

![4](/img/in-post/liquid-error/4.png)

- 위 사진과 같이 문장의 앞 뒤에 `raw` 와 `endraw`를 추가해준다

<br>

참고사이트

- [Jekyll에서 liquid warning 처리](http://jmjeong.com/escape-in-liquid-syntax/){: class="underlineFill"}
