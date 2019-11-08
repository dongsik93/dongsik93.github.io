---
layout: post
title: "Python 문법"
subtitle: "python"
date: 2019-01-07 18:00:00 +0900
categories: til
tags: python
comments: true
---

## Python 문법

### Slicing 

- 시퀀스에서 사용 가능

```python
a = list(input().split())

rest = a[1:-1]

# 리스트의 1번부터 ~ -1까지의 범위만 보여줘
# [1]번인 2번째부터 [-1]번인 마지막을 제외한 
# 즉, 처음과 끝은 제외한 나머지 사이에 있는게 반환됨

```



### f-string

```python
print(f"{month:10} 월")
# print("{month:10}.fomat("월")) 과 같음
```



### Multi-line cursor (select)

에디터마다 다름

`ctrl` + click



### 딕셔너리를 for문으로

```python
for i in a.items():
```



### python의 return

- 파이썬의 return은 함수에서 return을 만나자마자 바로 리턴해버림
- 즉 return을 만나면 결과값이 나왔다는 말이기 때문에 함수를 종료



### python의 if문

- if문이 자동으로 형변환을  해줌 ( 조건식이 식으로 안오고 요소 하나만 오면)

```python
for e in my_list:
	if e: # 이것처럼 if문 뒤에 조건식이 e 하나만 오면 자동으로 bool(e) 효과를 줌
          # 즉 if bool(e): 이거와 같은 효과를 나타냄
```













