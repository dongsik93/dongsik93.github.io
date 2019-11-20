---
layout: post
title: "Jekyll blog에 Utterances 적용하기"
subtitle: "utterances"
date: 2019-11-20 17:00:00 +0900
categories: til
tags: etc
comments: true
---

## Jekyll blog에 Utterances 적용하기



> 기존에는 disqus를 사용해서 댓글관리를 하고있었는데 아는분의 추천으로 [utterances](https://utteranc.es/)라는걸 알게되어서 바꿔보게 되었다.



### Utterances 적용하기

>- [Open source](https://github.com/utterance). 🙌
>- No tracking, no ads, always free. 📡🚫
>- No lock-in. All data stored in GitHub issues. 🔓
>- Styled with [Primer](http://primer.style/), the css toolkit that powers GitHub. 💅
>- Dark theme. 🌘
>- Lightweight. Vanilla TypeScript. No font downloads, JavaScript frameworks or polyfills for evergreen browsers. 🐦🌲

- 공식사이트에 있는 설명이다

##### Utterances란?

- 깃헙 issue search API를 이용해서 페이지의 url, pathname, title에 관련된 issue를 찾아서 로드해준다
- 이슈가 없다고 하더라도 utterances-bot이 자동적으로 이슈를 첫 이슈를 생성해준다

##### 적용하기

1. 가장 먼저 girhub에 repo를 만들어준다(이슈 저장용도)

    ![1](img/in-post/utterances/1.png)

   - `repo` 빈칸에 만들어준 repository이름을 적어준다

2. 어떤 형태를 블로그 글과 이슈를 매핑할 것인지를 골라준다

   ![2](img/in-post/utterances/2.png)

   -  `Issue title contains page pathname`을 선택했다

3. 테마를 골라준다

   ![3](img/in-post/utterances/3.png)

4. 소스를 disqus를 적용했던 곳에 교체해준다

   ![4](img/in-post/utterances/4.png)

   - 위에서 repo를 입력했다면 `[ENTER REPO HERE]` 부분이 해당 repo이름으로 바뀐채 적용되있다.

5. 블로그 루트페이지에 `utterances.json`을 추가해준다

   ```json
   {
       "origins": ["https://dongsik93.github.io"]
   }
   ```

6. 끝!!! 인줄 알았지만 에러가 발생했다

   ![5](img/in-post/utterances/5.png)

   - 해당 repo에 utterances를 install하지 않았다고 한다
   - 링크를 눌러서 install을 해주면 된다

7. 적용된 화면

   - 블로그에 댓글이 적용된 화면이다
   - 깃헙의 프로필 이미지와 닉네임이 연동되어 나타난다

   ![6](img/in-post/utterances/6.png)

   - 다음은 만들어준 repo에 이슈가 생성된 모습이다

   ![7](img/in-post/utterances/7.png)

<br>

- 참고사이트

[Yangeok Dev Blog - 깃헙 저장소 이슈 페이지를 댓글로 쓰기]( https://yangeok.github.io/blog/2019/01/16/jekyll-utterances.html )