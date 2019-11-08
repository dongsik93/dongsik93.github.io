---
layout: post
title: "Python 제너레이터(Generator)"
subtitle: "Generator에 대해 알아보자"
date: 2019-09-18 23:55:00 +0900
categories: til
tags: python
comments: true
---

## Python 제너레이터(Generator) 이해하기

### Iterator와 Generator

1. ##### Iterator

   - 리스트, Set, Dictionary와 같은 컬렉션이나 문자열과 같은 문자 Sequence 등은 for 문을 써서 하나씩 데이터를 처리할 수 있는데, 이렇게 하나 하나 처리할 수 있는 컬렉션이나 Sequence 들을 Iterator 객체라고 부른다

   ```python
   # Iterable 리스트
   for i in [1,2,3,4,5]:
     print(i)
   # Iterable 문자열
   for i in "Hello World":
     print(i)
   ```

   ```python
   # 내장함수 iter()
   my_list = [1,2,3]
   it = iter(my_list)
   next(it)
   >> 1
   next(it)
   >> 2
   next(it)
   >> 3
   next(it)
   >> StopIteration
   ```

   - 내장 함수 iter()는 `iter(Iterable객체)` 로 사용하여 그 Iterable 객체의 iterator를 리턴한다
   - 객체에서 실제 Iteration을 실행하는 것은 iterator로서, iterator는 next 메서드를 사용하여 다음 element를 가져온다
   - 더이상 next element가 없으면 StopIteration Exception이 발생
   - 어떤 클래스를 Iterable 하게 하려면 그 클래스의 iterator를 리턴하는 `__iter__()` 메서드를 작성해야 한다.
   - 이 `__iter__()` 메서드가 리턴하는 iterator는 동일한 클래스 객체가 될 수도 있고, 별도로 작성된 iterator 클래스의 객체가 될 수도 있다.
   - 어떠한 경우든 Iterator가 되는 클래스는 `__next()__`메서드를 구현해야 한다.
   - next 메서드는 `iterator객체.__next__()`메서드를 사용한다

   ```python
   # Iterator 예시
   class MyCollection:
     def __init__(self):
       self.size = 10
       self.data = list(range(self.size))
     
     '''
     __iter__() 메서드에서 self를 리턴함으로써 Iterable과 동일한 클래스에 Iterator를 구현
     ''' 
     def __iter__(self):
       self.index = 0
       return self
     
     # Iterator로서 필요한 __next__() 메서드 구현
     def __next__(self):
       if self.index >= self.size:
         raise StopIteration
         
         n = self.data[self.index]
         self.index += 1
         return n
       
   coll = MyCollection()
   for x in coll:
     print(x)
   ```

2. ##### Generator

   - Generator는 Iterator의 특수한 형태이다
   - Generator 함수는 함수 안에 `yield`를 사용하여 데이터를 하나씩 리턴한다
   - 일반적인 함수는 진입점이 하나라면 Generator함수는 진입점이 여러개 라고 생각할 수 있다. 이러한 특성 때문에 Generator를 사용하면 원하는 시점에 원하는 데이터를 받을 수 있게 된다

   ```python
   # Generator 함수와 호출의 간단한 예
   # Generator 함수
   def gen():
     yield 1
     yield 2
     yield 3
     
   # Generator 객체
   g = gen()
   print(type(g))
   >> <class 'generator'>
   
   # generator 클래스의 객체 g의 내장함수 next() 함수 사용
   n = next(g)
   print(n)
   >> 1
   n = next(g)
   print(n)
   >> 2
   n = next(g)
   print(n)
   >> 3
   
   # for문
   for x in gen():
     print(x)
     
   ```

   - 위의 예처럼 Generator 함수가 처음 호출되면, 그 함수 실행 중 처음 만나는 yield 에서 값을 리턴한다
   - Generator 함수가 다시 호출되면 직전에 실행되었던 yield문 다음부터 다음 yield문을 만날 때까지 문장들을 실행한다

   > yield문의 값은 어떤 메서드를 통해 generator가 다시 동작했는지에 따라 달라지게 되는데, `__next__()` 를 사용하면 *None*이고 `send()` 를 사용하면 메서드로 전달 된 값을 갖게되어 외부에서 데이터를 입력받을 수 있게 된다.

   - ##### Generator의 이점

     - List, Set, Dict 표현식은 iterable하기 떄문에 `for문` 등에서 유용하게 쓰인다
     - iterable 객체는 유용하지만 모든 값을 메모리에 담고 있어야 하기 때문에 큰 값을 다룰 떄에는 별로 좋지 않다
     - 반면 generator를 사용하면 yield를 통해 *__그때그때 필요한 값__*만 받아 쓰기 때문에 모든 값을 메모리에 들고 있을 필요가 없게 된다

![generator](/img/in-post/generator.png)

<br>

참고사이트

- [정겨울 블로그](https://winterj.me/Python-Generator/){: class="underlineFill"}

- [예제로 배우는 파이썬 프로그래밍](http://pythonstudy.xyz/){: class="underlineFill"}