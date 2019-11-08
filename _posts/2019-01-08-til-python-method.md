---
layout: post
title: "Python 함수"
subtitle: "python"
date: 2019-01-08 18:00:00 +0900
categories: til
tags: python
comments: true
---
## Python 함수 이용

### P. 솔로 천국 만들기 

```python
result = []
if not result : 
    # 이 조건문의 의미는 result가 비어있느냐? 를 물어보는 조건문
    # []있으면 False반환인데 not이 붙어있으니까 True
    
def lonely_enumerate(n):
    result = []
    for idx, val in enumerate(n):
        if(idx == 0) or (result[-1] != val):
            result.append(val)
    return result
```



### 자리배치

```python
import random

gj_students = ["이중봉","문동식","김  훈","차상권","정태준","박희승"
,"이준원","윤은솔","양시영","이지선","조호근","송건희"
,"최보균","서희수","이지희","강민지","김녹형","최진호"
,"문영국","황인식","구종민","박나원","박현진","안현상"]
random.shuffle(gj_students)
for idx, student in enuerate(gj_students):
    print(f"{student:3}", end =" ")
    if(idx % 3 == 2):
        print("  ",end="")
    if(idx % 6 == 5):
        print()
```



### 함수와 메소드

함수 : def로 정의한것

메소드 : 어떤 함수안에 구현된 객체,  .으로 호출



### extend()

- string을 넣으면 한글자씩 들어감
- 리스트를 넣으면 그대로 들어감



### insert()

- 정해진 위치에 값을 추가
- 정해진 위치에 길이를 추가해도 맨 마지막 위치에 값이 들어감



### remove()

- 맨 처음 요소를 삭제
- 원본을 그대로 바꿔줌 ( 리턴이 아니라 원본을 수정)



### pop()

- 정해진 위치에 있는 값을 삭제, 그 항복을 반환
- 위치가 지정되지 않으면 마지막 항목을 삭제하고 되돌려줌



### sort() 와  sorted()

- sort()를 하고나면 원본을 sort해주고 None을 리턴( 원본은 수정된 상태)
- sorted()는 리턴값이 정렬된 값이고 원본은 바뀌지 않는다



### list comprehension

- 연산의 결과들을 list에 담겨줌

```python
even_list = [ x*2 for x in range(1,6)]

cublic_list = [ x**3 for x in range(1,11)]

girls = ['jane', 'iu', 'mary']
boys = ['justin', 'david', 'kim']
pair = [(girl, boy) for girl in girls for boy in boys]

pitagoras_com = [ (a,b,c) for a in range(50) for b in range(50) for c in range(50) if(a**2 + b**2 == c**2 and a<b<c) ]

a = "Life is too short, you need python!"
vowel = ['a','e','i','o','u']
c = [ i for i in a if i not in vowel]
print("".join(c))
```

