---
layout: post
title: "Python 퍼스트클래스 함수(First Class Function)"
subtitle: "First class function 대해 알아보자"
date: 2019-09-29 23:30:00 +0900
categories: til
tags: python
comments: true
---

## Python 퍼스트클래스 함수(First Class Function) 이해하기

#### 퍼스트 클래스 함수(First-Class  function)란?

- 프로그래밍 언어가 함수를 first-class citizen으로 취급하는것을 뜻한다
- 쉽게 말하자면 함수 자체를 인자(argument)로써 다른 함수에 전달하거나 다른 함수의 결과값으로 리터 할수도 있고, 함수를 변수에 할당하거나 데이터 구조안에 저장할 수 있는 함수를 뜻한다
- _first class object 로서의 함수_ 를 줄여서 **_first class function_** 이라는 용어가 널리 사용되지만, 사실상 파이썬에서 모든 함수는 first-class이다
  - 런타임에 생성할 수 있다
  - 데이터 구조체의 변수나 요소에 할당할 수 있다
  - 함수 인수로 전달할 수 있다
  - 함수 결과로 리턴할 수 있다
  - 위와 같은 작업을 수행할 수 있으면 프로그램 개체를 **first-class**로 정의한다

<br>

#### 퍼스트 클래스 함수의 장점

- 이미 정의된  여러 함수를 간단히 재활용 할 수 있다

1~5까지의 정수를 입력받아 제곱해서 결과를 리턴해주는 함수의 예

```python
def square(arr):
  result = []
  for i in arr:
    result.append(i*i)
  return result

num = [1,2,3,4,5]
print(square(num))
>> [1, 4, 9, 16, 25]
```

거듭제곱을 만드려면?

제곱, 세제곱 ... 각각의 함수를 만들어야 하나?

##### 퍼스트 클래스를 이용한 거듭제곱 함수

```python
def squre(x):
  return x*x

def cube(x):
  return x*x*x

def quad(x):
  return x*x*x*x
  
def power(func, arr):
  result = []
  for i in arr:
    result.append(func(i))
  return result

num = [1,2,3,4,5]

print(power(square, num))
>> [1, 4, 9, 16, 25]

print(power(cube, num))
>> [1, 8, 27, 64, 125]

print(power(quad, num))
>> [1, 16, 81, 256, 625]
```

- 위처럼 이미 정의되어 있는 함수 `squre`, `cube` , `quad` 처럼 여러개의 함수나 모듈이 있다고 가정했을 때 `power` 같은 **_wrapper 함수_**를 하나만 정의해서 기존의 함수나 모듈을 수정할 필요없이 편리하게 쓸 수 있다.
<br>

> ##### Wrapper 함수란?
>
> 다른 함수에 약간의 기능을 덧씌워 사용하는 함수
>
> 주로 별다른 연산없이 다른 함수나 시스템 콜을 호출하는것이 주 역할





참고사이트

- [SCHOOL OF WEB : 파이썬 퍼스트클래스 함수](http://schoolofweb.net/blog/posts/파이썬-퍼스트클래스-함수-first-class-function/){: class="underlineFill"}

- [Wrapper함수](https://zetawiki.com/wiki/래퍼_함수,_헬퍼_함수){: class="underlineFill"}
- [전문가를위한 파이썬](https://books.google.co.kr/books/about/%EC%A0%84%EB%AC%B8%EA%B0%80%EB%A5%BC_%EC%9C%84%ED%95%9C_%ED%8C%8C%EC%9D%B4%EC%8D%AC.html?id=NJpIDwAAQBAJ&printsec=frontcover&source=kp_read_button&redir_esc=y#v=onepage&q&f=false){: class="underlineFill"}
