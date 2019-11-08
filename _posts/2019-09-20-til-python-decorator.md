---
layout: post
title: "Python 데코레이터(Decorator)"
subtitle: "Decorator에 대해 알아보자"
date: 2019-09-20 01:20:00 +0900
categories: til
tags: python
comments: true
---

## Python 데코레이터(Decorator) 이해하기

#### 데코레이터에 대해 알아보기에 앞서

- ##### First class function

  - 파이썬의 함수는`first class`이다

  > 프로그래밍 언어 이론가들은 다음과 같은 작업을 수행할 수 있으면 프로그램 개체를 first-class로 정의한다
  >
  > - 런타임에 생성할 수 있다.
  > - 데이터 구조체의 변수나 요소에 할당할 수 있다.
  > - 함수 인수로 전달할 수 있다.
  > - 함수 결과로 리턴할 수 있다.
  >
  > **_first class object_** 로서의 함수를 줄여서 **_first class function_**이라는 용어가 널리 사용되지만, 사실상 파이썬에서 모든 함수는 first-class 이다.
  >
  > Fluent-Python

- ##### 일급 객체

  - 함수 내에 함수를 정의할 수 있다.
  - 함수를 인자로 전달할 수 있다.

- ##### 클로저

  - first class function을 지원하는 언어의 네임 바인딩 기술
  - 내부(inner) 함수가 외부(outer) 함수의 인자를 기억하고 있는 것

- ##### 가변인자 *args와 **kwargs(키워드 인자)

  ```python
  # *args 예
  def sum(*args):
    sum = 0
    for i in args:
      sum += i
    return sum
  
  # **kwargs 예
  def print_kwargs(**kwargs):
    print("키워드인자 출력: ",kwargs)
    
  print_kwargs(아침="샐러드", 점심="소고기", 저녁="없음")
  ```

> 위의 내용들은 다시 다루도록 해야겠다... 데코레이터를 이해하기 위한 개념 !!

### 데코레이터(Decorator)란?

- 사전적 의미로는 _장식가_ 등의 의미를 가지고 있는데, 기존의 코드에 여러가지 기능을 추가하는 파이썬 구문이다
- 쉽게말해 하나의 함수를 취해서 또 다른 함수를 반환하는 함수이다

```python
'''
데코레이터의 예
'''
def decorator_function(original_function): #1
  def wrapper_function(): #5
    return original_function() #7
  return wrapper_function #6

def display(): #2
  print('display 함수가 실행되었습니다') #8
  
decorated_display = decorator_function(display) #3

decorated_display() #4

>> display 함수가 실행되었습니다.
```

- 데코레이터 함수인 _decorator_function_과 일반 함수인 _display_를 #1과 #2에서 각각 정의
- 그 다음 #3에서 decorated_display라는 변수에 _display_ 함수를 인자로 갖는 _decorator_function_을 실행한 리턴값을 할당, 이 리턴값은 _wrapper_function_ 인데 아직 실행되지 않은채로 decorated_display변수 안에서 호출되기를 기다린다
- 그리고 #4의 decorated_display()를 통해 _wrapper_function_ 을 호출하면 #5에서 정의된 _wrapper_function_ 이 호출된다
- 그러면 #7에서 original_function()인 _display_ 함수가 호출되어 #8의 print() 함수가 호출되고 문자열이 출력되게 된다

- 이번엔 래퍼(wrapper)함수를 이용해서 여러가지 기능을 추가해보자

```python
'''
위의 예에서 기능을 추가
'''
def decorator_function(original_function):
    def wrapper_function():
        print '{} 함수가 호출되기전 입니다.'.format(original_function.__name__)
        return original_function()
    return wrapper_function


def display_1():
    print 'display_1 함수가 실행됐습니다.'


def display_2():
    print 'display_2 함수가 실행됐습니다.'

display_1 = decorator_function(display_1)  #1
display_2 = decorator_function(display_2)  #2

display_1()
print
display_2()


>>display_1 함수가 호출되기전 입니다.
display_1 함수가 실행됐습니다.

display_2 함수가 호출되기전 입니다.
display_2 함수가 실행됐습니다.
```

- 하나의 데코레이터 함수를 만들어 _display_1_ 과 _display_2_ 두개의 함수에 기능을 추가

- `@` 심볼과 데코레이터의 함수 이름을 붙여 간단하게 코드를 줄여보자

```python
def decorator_function(original_function):
    def wrapper_function():
        print '{} 함수가 호출되기전 입니다.'.format(original_function.__name__)
        return original_function()
    return wrapper_function


@decorator_function  #1
def display_1():
    print 'display_1 함수가 실행됐습니다.'


@decorator_function  #2
def display_2():
    print 'display_2 함수가 실행됐습니다.'

# display_1 = decorator_function(display_1)  #3
# display_2 = decorator_function(display_2)  #4

display_1()
print
display_2()
```

- 위와 같이 #3과 #4 대신에 #1과 #2에 `@` 를 사용한 데코레이터 구문을 추가해 코드가 좀 더 간단해졌다

- *args와 **kwargs를 활용해서 데코레이터를 사용해보자

```python
def decorator_function(original_function):
    def wrapper_function(*args, **kwargs):  #1
        print '{} 함수가 호출되기전 입니다.'.format(original_function.__name__)
        return original_function(*args, **kwargs)  #2
    return wrapper_function


@decorator_function
def display():
    print 'display 함수가 실행됐습니다.'


@decorator_function
def display_info(name, age):
    print 'display_info({}, {}) 함수가 실행됐습니다.'.format(name, age)

display()
print
display_info('John', 25)
```

- _display_info_ 에 2개의 인자를 전달했기 때문에 #1과 #2에 인수를 추가해준다

#### 그렇다면 어디에서 데코레이터를 사용하는건지?

- 로그를 남길때
- 유저의 로그인 상태를 확인하여 로그인 페이지로 리다이렉트
- 프로그램 성능을 위한 테스트



```python
'''
로그와 실행시간을 출력하는 예제
'''
from functools import wraps
import datetime
import time


def my_logger(original_function):
    import logging
    logging.basicConfig(filename='{}.log'.format(original_function.__name__), level=logging.INFO)
    
    @wraps(original_function)  #1
    def wrapper(*args, **kwargs):
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
        logging.info(
            '[{}] 실행결과 args - {}, kwargs - {}'.format(timestamp, args, kwargs))
        return original_function(*args, **kwargs)

    return wrapper


def my_timer(original_function):
    import time

    @wraps(original_function)  #2
    def wrapper(*args, **kwargs):
        t1 = time.time()
        result = original_function(*args, **kwargs)
        t2 = time.time() - t1
        print '{} 함수가 실행된 총 시간: {} 초'.format(original_function.__name__, t2)
        return result

    return wrapper


@my_timer
@my_logger
def display_info(name, age):
    time.sleep(1)
    print 'display_info({}, {}) 함수가 실행됐습니다.'.format(name, age)

display_info('Jimmy', 30)  #3
```

- 위의 코드는 #1, #2에서 wraps 데코레이터로 2개의 wrapper 함수를 데코레이팅하고, 잘 작동하는지 확인하기위해  #3의 이름과 나이로 바꿔서 실행



참고사이트

- [SCHOOL OF WEB : 파이썬 데코레이터](http://schoolofweb.net/blog/posts/파이썬-데코레이터-decorator/){: class="underlineFill"}

