---
layout: post
title: "자료구조와 알고리즘 11강"
subtitle: "자료구조와 알고리즘 11강"
date: 2019-09-24 21:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

##  11강: 스택(Stacks)



###   스택이란?

- 자료를 보관할 수 있는 선형구조
  - 단, 넣을 때에는 한 쪽 끝에서 밀어 넣어야 하고, 꺼낼 때에는 같은 쪽에서 뽑아 꺼내야 하는 제약이 있다.

- 추가된 데이터 원소들을 끄집어내면 마지막에 넣었던 것부터 넣은 순서의 역순으로 꺼내지는 자료 구조를 **_스택_**이라고 부른다

- 마지막에 넣은 것이 가장 먼저 꺼내어지는 성질 때문에 스택을 다른 말로는 **_후입선출(LIFO, Last In First Out)_** 자료구조라고도 한다



##### 스택의 동작

- `#1` : 초기상태 
  - 비어있는 스택(empty stack)

- `#2` : 데이터 원소 A를 스택에 추가
- `#3` : 데이터 원소 B를 스택에 추가
- `#4` : 데이터 원소 꺼내기
  - 맨 위의 B가 r1에 담김
- `#5` : 데이터 원소 한번 더 꺼내기
- `#6` : 비어있는 스택에서 데이터 원소를 꺼내려 할 때
  - `스택 언더플로우(stack underflow)`
- `#7` : 꽉 찬 스택에 데이터 원소를 넣으려 할 때
  - `스택 오버플로우(stack overflow)`

```python
S = Stack() 	#1
S.push(A)			#2
S.push(B)			#3
r1 = S.pop()  #4
r2 = S.pop()  #5
r3 = S.pop()  #6
```



##### 스택의 연산

- 스택은 두 연산을 제공하는 간단한 자료구조

- 푸시(push)연산
  - 스택에 데이터 원소를 추가하는 동작

- 팝(pop)연산
  - 마지막에 추가되었던 원소를 참조하고 삭제하는(꺼내는) 동작

- 활용 예
  - 컴퓨터 내부에서 프로그램이 실행할 때 함수 호출이 일어나고 함수들이 리턴하면 마지막 호출된 곳으로 돌아가는 동작을 구현할 때
  - 이러한 일은 컴퓨터의 동작에 핵심적인 것이기 때문에 하드웨어(프로세스)는 어떤 방식으로든 스택을 내부적으로 관리하는 기능을 갖고 있다



#### 스택의 추상적 자료구조

- 연산의 정의
  - __size()__ : 현재 스택에 들어있는 데이터 원소의 수를 구함
  - __isEmpty()__ : 현재 스택이 비어있는지를 판단
  - __push(x)__ : 데이터 원소 x를 스택에 추가
  - __pop()__ : 스택의 맨 위에 저장된 데이터 원소를 제거 또한, 반환)
  - __peek()__ : 스택의 맨 위에 저장된 데이터 원소를 반환 (제거하지 않음)

1. `배열(array)`을 이용하여 구현
   - Python built in 리스트와 메서드들를 이용

```python
class ArrayStack:
    # 빈 스택을 초기화
    def __init__(self):
      	self.data = []
    
    # 스택이 비어 있는지 판단
    def isEmpty(self):
      	return self.size() == 0
    
    # 데이터 원소를 추가
    def push(self, item):
      	self.data.append(item)
        
    # 데이터 원소를 삭제(리턴)
    def pop(self):
      	return self.data.pop()
      
    # 스택의 꼭대기 원소 반환
    def peek(self):
      return self.data[-1]
```

2. `연결 리스트(linked list)`를 이용하여 구현
   - 양방향 연결 리스트를 이용

```python
class LinkedListStack:
    # 비어있는 연결 리스트로 초기화
    def __init__(self):
      	self.data = DoublyLinkedList()
		# 데이터 아이템의 개수를 리턴
    def size(self):
      	return self.data.getLength()
		# 스택이 비어있는지를 판단
    def isEmpty(self):
      	return self.size() == 0
		# 노드를 새로 만들어 inserAt을 이용해 마지막에 데이터 아이템을 추가
    def push(self, item):
        node = Node(item)
        self.data.insertAt(self.size() + 1, node)
		# 현재 스택에 들어있는 개수를 구해서 마지막 노드를 popAt
    def pop(self):
      	return self.data.popAt(self.size())
		# 마지막 노드를 getAt
    def peek(self):
      	return self.data.getAt(self.size()).data
```

- `pythonds`
  - 스택을 활용하게 해주는 라이브러리
  - Stack,  Queue, Dequeue, List, Priority Queue, etc...
  - [pythonds - PyPI](https://pypi.org/project/pythonds/){: class="underlineFill"}

```python
from pythonds.basic.stack import stack

S = Stack()
print(dir(S))
# 이미 만들어짐
>> ['__doc__', '__init__', '__module__', 'isEmpty', 'items', 'peek', 'pop', 'push', 'size']
```



##### 수식의 괄호 유효성 검사

```python
'''
수식을 왼쪽부터 한 글자씩 읽어서 여는괄호를 만나면 스택에 푸시
닫는 괄호를 만나면 팝, 이 때 비어있으면 x, 팝했을 때 쌍을 이루는지 검사
끝까지 검사한 후, 스택이 비어 있어야 올바른 수식
'''
class ArrayStack:

    def __init__(self):
        self.data = []

    def size(self):
        return len(self.data)

    def isEmpty(self):
        return self.size() == 0

    def push(self, item):
        self.data.append(item)

    def pop(self):
        return self.data.pop()

    def peek(self):
        return self.data[-1]

def solution(expr):
    match = {
        ')': '(',
        '}': '{',
        ']': '['
    }
    S = ArrayStack()
    for c in expr:
        if c in '({[':
            S.push(c)
        elif c in match:
            if S.isEmpty():
                return False
            else:
                t = match[c]
                if t != S.pop() :
                    return False
    return S.isEmpty()
```

<br>



본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.



출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}