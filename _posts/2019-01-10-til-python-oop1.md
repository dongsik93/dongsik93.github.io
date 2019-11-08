---
layout: post
title: "Python OOP1"
subtitle: "python"
date: 2019-01-10 18:00:00 +0900
categories: til
tags: python
comments: true
---


## Python OOP(Object-Oriented Programming)

### 클래스 / 인스턴스 / 매서드

```python
a = 1+5j
print(type(a))
>>> <class 'complex'>
# 'complex' 클래스

print(a.real, a.imag)
# a라는 인스턴스를 통해서 real / imag라는 매서드를 호출
```

### 클래스

```python
class ClassName:
    # ClassName ---> camelcase
    # 클래스이름은 첫시작은 대문자, 각각의 단어가 구분될 때 대문자로
    # Snakecase : my_dict_name 
```

```python
class Person:
    name = "문동식"
    # 클래스 안에 정의된 함수 = 메서드
    def greeting(self):
        print(f"hello, {self.name}")
# self : 인스턴스화 된 자기자신을 뜻함
```

### 인스턴스

```python
# iu라는 변수에 있는 친구가 Person과 같은 instance니?
iu = Person()
iu.greeting()
iu.name
iu.name = "이지은"
# Person.name(iu) = "이지은" 과 같음
isinstance(iu,Person)
>>> type(iu) ====> __main__.person
# iu 자체는 인스턴스 객체
# iu만 찍으면 정보를 찾을 수 없음
# iu.name 이렇게 접근해야 찾을 수 있다

```

```python
class Person():
    name=  "기본이름"
    
    def greeting(self):
        print(f"안녕하세요! {self.name}입니다 !")
        
    def __str__(self):
        return f"사람 : {self.name}"
    def __repr__(self):
        return f"person : {self.name}"
    
daniel = Person()
daniel.name = "다니엘"
print(daniel)
>>> 사람 : 다니엘
daniel
>>> person : 다니엘
```



### 두번째 원을 만들고 x,y좌표를 (5,-5)로 이동시킨 후 첫번째 원과 외접하는 조건의 반지름을 구하세요

```python
class Circle:
    pi = 3.14
    x = 0
    y = 0
    r = 0
    
    def area(self):
        return self.pi * self.r * self.r
    
    def circumference(self):
        return 2 * self.pi * self.r
    
    def center(self):
        return (self.x, self.y)
    
    def move(self, x, y):
        self.x = x
        self.y = y
```

```python
my_circle2 = Circle()
my_circle2.x, my_circle2.y = 5, -5

my_circle2.x = (my_circle.x - my_circle2.x)**2
my_circle2.y = (my_circle.y - my_circle2.y)**2
my_circle2.r = (my_circle2.x + my_circle2.y)**0.5
my_circle2.r = my_circle2.r - my_circle.r
print(my_circle2.r)
```

