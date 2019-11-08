---
layout: post
title: "Python 오류,예외처리"
subtitle: "python"
date: 2019-01-10 17:00:00 +0900
categories: til
tags: python
comments: true
---

## Python 오류(Errors) & 예외처리(Exceptions)


### 문법에러(Syntax Error)

- 뭔가 빠뜨렸거나(`,`, `:`, `""`등등) 잘못적었을 때 발생
- `^`  표시로 틀린 위치를 표시해 주지만, 정확한 위치는 아니고 해당 line까지는 알 수 있다

```python
# syntax error예
File "<ipython-input-1-2ef577c90b10>", line 4
    else
        ^
SyntaxError: invalid syntax

# EOL error
File "<ipython-input-2-c70f4029c163>", line 3
    print("aaaaaaa)
                   ^
SyntaxError: EOL while scanning string literal

# EOF error
File "<ipython-input-3-3a223444d941>", line 2
  print("asdfsdf"
                 ^
SyntaxError: unexpected EOF while parsing        
```



### 에러 종류

```python
# ZeroDivisionError 
ZeroDivisionError                         Traceback (most recent call last)
<ipython-input-5-1a1c9c3dae95> in <module>
      1 # ZeroDivisionError를 확인해봅시다.
----> 2 10 / 0

ZeroDivisionError: division by zero
    
# NameError : 사용하지 않았던 변수를 사용했을 때 발생
NameError                                 Traceback (most recent call last)
<ipython-input-6-2516ed2be577> in <module>
      1 # NameError를 확인해봅시다.
----> 2 print(hello)

NameError: name 'hello' is not defined  # hello가 정의되지 않았다
    
# TypeError : 타입이 다르다
TypeError                                 Traceback (most recent call last)
<ipython-input-7-a95aca245afd> in <module>
      1 # TypeError를 확인해봅시다.
----> 2 1 + "5"

TypeError: unsupported operand type(s) for +: 'int' and 'str'
        # +는 int와 str를 더할 수 없다
        
# 함수 호출과정의 TypeError
TypeError                                 Traceback (most recent call last)
<ipython-input-8-47bdb1560f34> in <module>
      1 # 함수 호출과정에서 TypeError도 발생하게 됩니다. 확인해봅시다.
----> 2 round()

TypeError: type str doesn't define __round__ method
    # round method가 없다

# 필수 argument가 누락된 TypeError
### 자주발생하는 오류 중 하나
TypeError                                 Traceback (most recent call last)
<ipython-input-10-621ab5efe8b1> in <module>
      1 # 함수호출 과정에서 다양한 오류를 확인할 수 있습니다. : 필수 argument 누락
      2 import random
----> 3 random.sample(range(1,46))
	---> random.sample(range(1,46),6) 으로 수정
TypeError: sample() missing 1 required positional argument: 'k'
        # k라는 argument하나가 빠졌다
        
        
# argument가 많은 경우 TypeError
TypeError                                 Traceback (most recent call last)
<ipython-input-11-1d41a4b73a73> in <module>
      1 # 함수호출 과정에서 다양한 오류를 확인할 수 있습니다. : argument 많은 경우
----> 2 random.choice(range(1,46),6)
	---> random.choice(range(1,46))
TypeError: choice() takes 2 positional arguments but 3 were given
    # 2개만 필요한데 3개가 입력이 되었다
    
    
#ValueError 1 : 자료형에 대한 type은 올바르지만, 값이 적절하지 않기 때문에 발생
ValueError                                Traceback (most recent call last)
<ipython-input-14-789240015774> in <module>
      1 # ValueError를 확인해봅시다.
----> 2 int("3,5")
	
ValueError: invalid literal for int() with base 10: '3,5'
        # 
        
        
#ValueError 2 : 값이 적절하지 않는 경우 발생, 값이 없는데 찾으려고 하는 경우
TypeError                                 Traceback (most recent call last)
<ipython-input-15-e21fa6a55961> in <module>
      1 # ValueError를 확인해봅시다.
      2 a = [1,2]
----> 3 a.index[3]

TypeError: 'builtin_function_or_method' object is not subscriptable
 

#IndexError
### 자주발생
IndexError                                Traceback (most recent call last)
<ipython-input-16-850c79f05d56> in <module>
      1 # IndexError를 확인해봅시다.
      2 a = [1,2,3]
----> 3 a[5]

IndexError: list index out of range
    # list의 index의 범위를 벗어남

    
#KeyError
KeyError                                  Traceback (most recent call last)
<ipython-input-18-d7a0c1e37db5> in <module>
      1 # KeyError를 확인해봅시다.
      2 my_dict = {'today':"2019-01-10"}
----> 3 my_dict["yesterday"]

KeyError: 'yesterday'
    # 해당하는 키가 없다
    
    
#ModuleNotFoundError
ModuleNotFoundError                       Traceback (most recent call last)
<ipython-input-19-4b9a34fac305> in <module>
      1 # ModuleNotFoundError를 확인해봅시다.
----> 2 import mymodule

ModuleNotFoundError: No module named 'mymodule'
    # 해당하는 모듈이 없다
    
    
    
#ImportError : 해당하는 모듈을 찾았지만, 그 안에 해당하는게 없을 때 발생
ImportError                               Traceback (most recent call last)
<ipython-input-20-2df40018a06f> in <module>
      1 # ImoprtError를 확인해봅시다.
----> 2 from bs4 import bbb

ImportError: cannot import name 'bbb'   

    
    
    
#KeyboardInterrupt
KeyboardInterrupt                         Traceback (most recent call last)
<ipython-input-21-7223299ee06f> in <module>
      1 # KeyboardInterrupt를 확인해봅시다.
      2 while(True):
----> 3     continue

KeyboardInterrupt: 
    # 코드를 돌릴 때 ctrl + c (강제정지, interrupt를 주는것)
    # 멈추고 해당 오류 발생
```



### 예외(Exceptions)처리

`try`  `except`  구문을 이용하여 예외 처리

- 에러명을 입력할 때 대소문자에 유의해서 처리해야 됨

```python
# 사용자가 문자열을 넣어 해당 오류(ValueError)가 발생하면, 숫자를 입력하라고 출력
try:
    num = (input("값을 입력해주세요 : "))
    print(int(num))
except(ValueError):
    print("숫자를 입력해 바보야")
```

```python
# 100을 사용자가 입력한 값으로 나눈 후 출력하는 코드를 문자열일때와 0일때 모두 처리
try:
    num = input("숫자를 입력하면 100을 나눠 줄게 :")
    print(100/int(num))
except(ValueError, ZeroDivisionError):
    print("으이그 바보야")
    

# 각각 다른 오류 출력 가능
try:
    num = input("숫자를 입력하면 100을 나눠 줄게 :")
    print(100/int(num))
except(ValueError):
    print("으이그 바보야 숫자넣어")
except(ZeroDivisionError):
    print("0은 왜넣냐 이놈아")
except:
    print("뭔진 모르지만 에러가났네?")
    
# 중요한 내용은 순차적으로 수행되므로, 가장 적은 범주부터 시작해야 함    
try:
    num = input("숫자를 입력하면 100을 나눠 줄게 :")
    print(100/int(num))

except(Exception):  # 모든 에러 처리
    print("뭔진 모르지만 에러가났네?")
except(ValueError): # ValueError만 처리
    print("으이그 바보야 숫자넣어")
except(ZeroDivisionError): # ZeroDivisonError만 처리
    print("0은 왜넣냐 이놈아")
```

### 에러 문구 처리

```python
try:
    a = [1,2,3]
    print(a[5])
except(IndexError) as e:
    print(f"범위밖 탐색 : {e}")
    # 해당 오류내용을 e에 담아 출력해줌
	# 출력은 >>> 범위밖 탐색 : list index out of range
```

### 에러 else

```python
try:
    a = [1,2,3]
    b = a[1]
except(IndesError):
    print("범위밖에서 탐색") # 에러뜨면 여기
else:
    print(b+10) # 에러안뜨면 여기
```

### finally

- 반드시 수행해야 하는 문장을 finally에 넣어서 

```python
try:
    a = {"python" : "good"}
    a["java"]
except(KeyError) as e:
    print(f"{e}는 딕셔너리에 없는 키 입니다")
finally:
    print(a)
```

### else와 finally의 다른첨

- finally는 오류가 발행해도 출력



### 예외 발생시키기

- 강제적으로 에러를 발생시키기

```python
raise ValueError

raise ValueError("값이 잘못 된거 같아요")

ValueError                                Traceback (most recent call last)
<ipython-input-54-5d6952da23e5> in <module>
      1 # 인자를 넘겨줄 수도 있습니다.
----> 2 raise ValueError("값이 잘못 된거 같아요")

ValueError: 값이 잘못 된거 같아요

```