---
layout: post
title: "python 정리"
subtitle: "python"
date: 2019-01-25 18:00:00 +0900
categories: til
tags: python
comments: true
---

## Python 정리

### 요점정리ㅠ



#### 딕셔너리 접근 & 저장 & 수정

```python
my_dict = {
    "apple":"식사"
}

my_dict["apple"] = "lingo"
my_dict.update(apple="lingo")
```



```python
my_dict = {
    "en":{
        "사과":"apple"
    },
    "jp":{
        "사과":"lingo"
    }
}

my_dict["en"]["사과"] = "애플"
```



OOP

```python
class Person():
    population = 0
    def __init__(self,name):
        self.name = name
        Person.population += 1
    
    def greeting(self):
        print("hi")
        
        
p1 = Person("재시험")
p2 = Person("싫어요")
p3 = Person("ㅠㅜㅠ")

p2.greeting()
Person.greeting(p2)
```



#### LEGB

Local / Enclosing function / Global / Built in



#### is & ==

```python
1 is 1
>>> True
1 == 1
>>> True

["사과","바나나"] is ["사과","바나나"]
>>> False
["사과","바나나"] == ["사과","바나나"]
>>> True


# is는 id값이 같은지 , 즉 객체가 같은지를 비교
# ==는 안의 값이 같은지를 비교

# 1 is 1이 True인 이유는 -5~256까지의 숫자를 같은 메모리에 저장해 놓기 때문에 True가 나옴
a = 257
b = 257
a is b
>>> False
```



#### list와 dict의 함수 한번씩 써보기

return이 되는지 / 원본을 바꿔주는지 체크체크



#### immutable / mutable 체크



```python
a ="a"
b = ("b")
c = ("b",)
#c의 타입만 tuple, tuple은 ,가 나오는 순간부터 tuple로 인지
```



#### Range

```python
range(5)
range(1,46)
range(1,50,2)
```



#### listcomprehention 읽을 수준...?  적어도 for문 1개랑 if문이 같이 나왔을 때!



#### 함수 인자값 순서 낚시에 낚이지 말자...



#### str find(), replace() 함수 잘 기억하기

중첩되어서 사용되니까 return이 뭐가 되는지를 확인해보기



#### split 과 indexing



#### 변수 낚시 걸리지마....



#### deepcopy & copy

copy일 경우 리스트 안의 리스트 연결 주의



#### return을 해주는가 !!! 원본을 바꾸는가 !!!

특히 reversed() ?!!



#### map() 체크





### 프 로 젝 트 !









