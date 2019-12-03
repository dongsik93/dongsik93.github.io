---
layout: post
title: "Jekyll blog에 Disqus댓글 연동하기"
subtitle: "Jekyll blog에 Disqus댓글 연동하기"
date: 2019-07-29 18:00:00 +0900
categories: til
tags: Jekyll
comments: true
---


## Jekyll blog(github blog)에 Disqus댓글 연동하기



### 왜 Jekyll에는 Disqus인가?

- ~~*__간단하기 때문이다 !!__*~~
- Jekyll은 정적 페이지 생성 시스템이고, 댓글기능은 동적으로 데이터 저장이 필요하기 때문에 
- [Disqus](https://disqus.com/){: class="underlineFill"}는 github blog에 무료로 댓글 기능을 사용하게 해준다 !!

<br>

##### 1. Disqus 가입

- 홈페이지에 들어가서 가입을 해준다

<br>

##### 2. 설치

- 두가지 선택창이 나온다
  - `I want to comment on site` : disqus를 사용하고 있는 다른 사이트에 댓글을  다는 메뉴
  - `I want to install Disqus on my site` :  내 사이트에 disqus를 설치하는 메뉴
- 두번째 내 사이트에 disqus를 설치하는 메뉴를 선택한다
- 아래 화면의 내용들을 채워준다

![설치](/img/in-post/disqus-make.png)

- 내용들을 채워주고 무료 요금제를 선택하면 다음과 같은 화면이 나오는데


![선택](/img/in-post/discus-select.png)

- 내 블로그는 Jekyll에 설치해야 하니까 Jekyll을 선택해 준다

<br>

##### 3.  설정

- Disqus를 사용하고 싶은 post에 추가해준다

```
---
comments: true
---
```

- Discus short name을 추가해준다
  - short name은 위에서 만들어준 Jekyll blog를 선택하면 `https://dongsik93.disqus.com/admin`이런 url이 나오게 되는데 여기서 `dongsik93`이 shortname이 된다

```js
// _config.yml

disqus_shortname:    dongsik93
```

- Disqus 홈페이지에서 제공하는 `Universalcode` 를 삽입해야 하지만 테마별로 각각 위치가 다르기 때문에 알아서...잘... 넣어줘야한다 ... 

  - 내 경우에는 `_includes` 에 `comment.html`과 `load-disqus.js`에 구현되어있다.

  ```js
  // load-disqus.js
  
  (function(w, d) {
    var disqus_config = function () {
      this.page.title = '{{ page.title }}';
      this.page.identifier = '{{ page.id }}';
      this.page.url = '{{ page.url | absolute_url }}';
    };
  
    w._disqusFirst = typeof w._disqusFirst != 'undefined' ? w._disqusFirst : true;
    w._disqusLoading = typeof w._disqusLoading != 'undefined' ? w._disqusLoading : false;
    w._disqusThis = false;
    w._disqusThreadOffsetTop = d.getElementById('disqus_thread').offsetTop;
  
    function loadDQ(e) {
      var scrollTop = w.pageYOffset || d.body.scrollTop;
      if ( w.DISQUS &&
          !w._disqusThis &&
          !w._disqusFirst &&
          scrollTop + w.innerHeight >= w._disqusThreadOffsetTop) {
  
        w._disqusThis = true;
        w.DISQUS.reset({
          reload: true,
          config: disqus_config
        });
      }
    };
  
    if (!w._disqusLoading) {
      w._disqusLoading = true;
  
      loadJSDeferred('dongsik.disqus.com/embed.js');
  
      // add event listener
      if (w.addEventListener) w.addEventListener('scroll', loadDQ, { passive: true });
      else if (w.attachEvent) w.attachEvent('onscroll', loadDQ);
      else w.onscroll = loadDQ;
    } else {
      w._disqusFirst = false;
    }
  }(window, document));
  ```

- 완료 !!

<br>

참고사이트

- [ヤクザ님 블로그](https://dev-yakuza.github.io/ko/jekyll/disqus/){: class="underlineFill"}





