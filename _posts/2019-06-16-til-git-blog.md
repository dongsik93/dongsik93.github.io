---
layout: post
title: "github blog 문제 해결"
subtitle: "github blog"
date: 2019-06-16 23:00:00 +0900
categories: til
tags: git
comments: true
---

## Github 블로그 오류 해결



#### 문제발생

- github til에서 블로그로 글을 옮기는 중 계속 블로그에 글이 안올라가는 문제 발생
- 3시간 넘게 삽질... tag를 잘못 적었나, category 이름이 잘못되었나 하고 여러번 수정한 결과 답이 없었다...
- 다시 처음부터 해보자라고 생각하면서 repository를 날리려고 `Settings`에 들어갔더니....!  아래의 오류가 발생하던 것을 알게 되었다.

```
The tag `url` on line 161 in `_posts/2019-02-11-django-crud.md` is not a recognized Liquid tag
```



#### 해결

- `Liquid tag` 라는말을 찾아보았다

  ```
  
  Liquid tags are the programming logic that tells templates what to do. Tags are wrapped in: {% raw %}{% %}{% endraw %} characters.
  
  ```

- 즉, `Liquid tag` 는 django 프로젝트 내의 `{% raw %}{% %}{% endraw %}` 를 의미했고, 이를 해결하기 위해 `{% raw %}{% %}{% endraw %}` 가 쓰여진 앞 뒤에 `raw,  endraw` 를 Liquid tag안에 넣고 감싸주면서 해결했다.

- 이 글을 작성하고 올리는 데에도 안적어서 오류났다 ㅠㅠ

- 귀찮다고 글 맨 앞에 raw, 글 맨뒤에 endraw를 쓰면 안되고 Liquid tag가 사용된 앞뒤에 `각각` 적어줘야 한다 !!

- 참고링크 : [현댕의 쉬다가는 블로그](http://blog.naver.com/PostView.nhn?blogId=guseod24&logNo=221483037145&categoryNo=0&parentCategoryNo=0&viewDate=&currentPage=1&postListTopCurrentPage=1&from=postView){: class="underlineFill"}