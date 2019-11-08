---
layout: post
title: "Jekyll blog에 Adsense 적용하기"
subtitle: "Adsense 적용기"
date: 2019-08-25 12:37:00:00 +0900
categories: til
tags: etc
comments: true
---

## Jekyll blog(Github page)에 Google Adsen 적용하기



- 구글에 내 블로그를 검색하면 나오게 만들었으니 구글 광고도 달아보자



##### 1. Google Adsense 신청하기

- [구글 애드센스](https://www.google.co.kr/intl/ko/adsense/start/#/?modal_active=none){: class="underlineFill"} 에 가입신청하기
- 구글에서 제공하는 코드를 `_includes` 폴더안의 `Head.html`에 넣어준다
- 코드 확인이 됐다는 멘트와 함께 사이트를 검토중이라고 나온다

##### 2. 승인 거절

- Adsense승인이 거절됐다.....
- Search  Console에 페이지 리디렉션 문제 때문인걸로 생각하고 이를 해결한 뒤  다시 신청했다

##### 3. 검토완료 ! 합격 !

- 처음 거절됐을때는 1주일정도의 시간이 걸렸던것 같은데 이번에는 신청하고 하루만에 승인이 됐다.

- Adsense 신청이 합격하면 이메일을 받는데 여기서 `Get Started` 를 누르고 들어가준다
- 광고를 선택하고  만들어주면 코드를 받을 수 있다.

```
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <!-- 수평형 -->
  <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-4932906113590831"
      data-ad-slot="7905819720"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
```

<br>

##### 4. 사이트 적용

- 내 사이트에 적용된 Jekyll 의 경우 `content.html`에 디스플레이 광고 단위가 만들어져 있기 때문에 이 부분도 수정해 준다
  - 왜인지 모르겠는데 안들어가는걸 보고 `footer` 에 임시적으로 광고가 나올수 있도록 만들었다.
- 이 페이지를 참고해서 달아준다 : [AdSense 고객센터](https://support.google.com/adsense/answer/9183566){: class="underlineFill"}