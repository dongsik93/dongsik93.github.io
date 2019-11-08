---
layout: post
title: "Python 활용"
subtitle: "python"
date: 2019-01-09 18:00:00 +0900
categories: til
tags: python
comments: true
---

## python 활용

### 딕셔너리 메소드 활용

`.update()`

- key, value 페어를 추가
- 만약  해당 key가 이미 존재하면 value값을 덮어 씀

```python
my_dict.update(melon = "메론")
# key값을 추가해주는건데 추가해주는 key는 변수처럼 할당해 주어야 함

```

`.get()`

```python
my_dict["apple"]
my_dict["pineapple"]
# 없는 key에 접근하면 오류
result = my_dict.get("pineapple","과일없음")
# 없는 key에 get함수로 접근할 때 "과일없음"이라는 코멘트가 나오게 설정할 수 있음
# default값은 None
```

`dictionary comprehension`

```python
cubic = {x:x**3 for x in range(1,6)}

over_dusts = {key:value for key,value in dusts.items() if value > 80 }

over_dusts = {key:("나쁨" if value>80 else "보통") for key,value in dusts.items()} 
```

`map(function, iterable)`

- iterable객체의 요소를 하나하나 function 적용

```python
a= [1,2,3]
after_a = map(str,a)
word = "".join(after_a)
print(word)

print("".join(map(str,a)))

result = [str(x) for x in a]
print("".join(result))

# 모두 같은 결과
```

`zip(*iterables)`

```python
girls = ['jane', 'iu', 'mary']
boys = ['justin', 'david', 'kim']
list(zip(girls, boys))
```

`filter(function, iterable)`

```python
def even(x):
    if(x % 2 == 1):
        return False
    else:
        return True


a= [1,2,3,4,5,6,7,8,9,10]
after_a = filter(even, a)
print(list(after_a))
```



### 모듈(import)

```python
import random

print(dir(random))
# random 함수의 여러 내장함수를 모두 보여줌


from bs4 import BeautifulSoup
# bs4중에서 BeautifulSoup하나만 가져와줘

from bs4 import BeautifulSoup as Beu
# BeautifulSoup을 Beu만으로 호출할수 있게끔 
```

