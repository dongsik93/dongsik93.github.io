---
layout: post
title: "HTML tag"
subtitle: "html tag"
date: 2019-01-21 18:00:00 +0900
categories: til
tags: html
comments: true
---


## HTML Tag

### <span style="color:red">crud</span>

Create

Read

Update

Delete



### new.html



#### label태그

라벨태그에 적힌 문구를 눌러도 밑의 input으로 타게팅이 된다

- input의 id값과  label의 for값이 똑같아야 타겟팅이됨



#### 짧은 문장 / 긴 문장

- 짧은 문장 : 
- 긴문장 : textarea 태그사용 사이에 컨텐츠를 넣으면 input에 value에 넣은거와 동일



#### value와 placeholer의 차이

- value : 기본으로 보여주는 텍스트 ( 수정가능)
- placeholer : 수정불가



#### name

- input태그 안에 name=<내용> 을 넣으면 url에 input데이터를 key&value쌍으로 &로 묶어서 담아서 보내줌 (get방식) name은 value값



#### form action="/~"

요청된 폼을 어디로 보내줘~라는





### get(기본)글쓰기 / 포스트 글쓰기 비교

- 글쓰기 - url에 정보가 담겨져서 보내진다 -> url을 보면 무슨 데이터가 전송되는지 알수 있다
- 포스트 글쓰기 - url에 정보를 담아서 보내면 안됨 -> 포장해서 넘겨야함
- <span style="color:red">method="post"</span> 가 추가



#### get방식

print(request.<span style="color:red">args</span>)

- 딕셔너리에 있는 타이틀 정보를 가져왔다

ImmutableMultiDict([('title', '노라라라노라라라라노라노라노라라라'), ('Contents', '놀아?')])



#### post방식

print(request.<span style="color:red">form</span>)

ImmutableMultiDict([('title', '맛난거머그'), ('Contents', '머그머그')])



- form 태그에 <span style="color:red">method="post"</span>추가

```html
<form action="/post_create" method="post">
```





####  method not allowed error해결

```python
@app.route("/post_create", methods=["post"])
def post_create():
    return render_template("post_create.html")

```



### from flask import redirect

return redirect

```python
기존에 있던
return render_template("post_create.html", title=title, Contents=Contents)
대신에
return redirect("/")
```

- 맨위에있던 루트페이지로 가게 됨







