---
layout: post
title: "자료구조와 알고리즘 14강"
subtitle: "자료구조와 알고리즘 14강"
date: 2019-09-27 00:10:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 14강: 큐(Queues)

### 큐(Queue)란?

- 스택과 더불어 매우 빈번하게 이용되는 자료 구조
- 큐 또한 데이터 원소를 한 줄로 늘어세우는 자료 구조, 즉 선형 구조라는 점에서 선형배열, 연결 리스트, 스택과 마찬가지이지만 스택과는 어떻게 보면 반대인 특성을 가지고 있다.
- 큐에서는 스택과는 반대로 , 어느 시점에서 큐에 들어 있는 데이터 원소를 꺼내면 큐에 들어 있는 원소들 중 가장 먼저 넣었던 것이 꺼내진다.
- 따라서 큐를 **선입선출(FIFO, First In First Out)**이라고 부른다
- 데이터 원소를 큐에 넣는 동작을 **인큐(enqueue) 연산**이라고 부르고, 반대로 큐로부터 데이터 원소를 꺼내는 동작을 **디큐(dequeue) 연산**이라고 부른다

<br>

#### 큐의 동작

- `#1` : 초기상태 : 비어있는 큐(empty queue)
- `#2` : 데이터 원소 A, B를 큐에 추가
- `#3` : 데이터 원소 꺼내기

```python
Q = Queue()				  #1
Q.enqueue(A)			  #2
Q.enqueue(B)			  #2
r1 = Q.dequeue()  --> A	  #3
r2 = Q.deququq()  --> B   #3
```

<br>

#### 큐의 추상적 자료구조 구현

- ##### 연산의 정의

  - size() - 현재 큐에 들어 있는 데이터 원소의 수를 구함
  - isEmpty() - 현재 큐가 비어 있는지를 판단
  - enqueue(x) - 데이터 원소 x를 큐에 추가
  - dequeue() - 큐의 맨 앞에 저장된 데이터 원소를 제거(+ 반환)
  - peek() : 큐의 맨 앞에 저장된 데이터 원소를 반환(제거 x)

- ##### 배열을 이용하여 구현

  - Python 리스트와 메서드들을 이용

```python
# 배열을 이용한 구현
class ArrayQueue:
    # 빈 큐를 초기화
    def __init__(self):
        self.data = []
    # 큐가 비어 잇는지 판단
    def isEmpty(self):
        return self.size() == 0
    # 데이터 원소를 추가
    def enqueue(self, item):
        self.data.append(item)
    # 데이터 원소를 삭제(리턴)
    def dequeue(self):
        return self.data.pop(0)
    # 큐의 맨 앞 원소 반환
    def peek(self):
        return self.data[0]
```

##### 배열로 구현한 큐의 연산 복잡도

- size() : _O_(1)
- isEmpty()  : _O_(1)
- enqueue() : _O_(1)
- dequeue()  : **_O_(_n_)**
  - 큐의 길이에 비례하는 복잡도를 가짐
  - 배열에 저장된 데이터 원소들을 하나하나 앞 칸으로 당겨서 위치를 조정해야 하기 때문이다.
  - 그래서 연산의 시간 복잡도 측면에서는 연결 리스트로 큐를 구현하는 것이 유리하다
- peek() : _O_(1)

- ##### 연결 리스트를 이용하여 구현

  - 이전 강의에서 마련한 양방향 연결 리스트 이용
  - 연산의 복잡도에 대해서 생각해보자

```python
class LinkedListQueue:

    def __init__(self):
        self.data = DoublyLinkedList()

    def size(self):
        return self.data.getLength()

    def isEmpty(self):
        return self.data.getLength()==0

    def enqueue(self, item):
        node = Node(item)
        self.data.insertAt(self.data.nodeCount+1 ,node)

    def dequeue(self):
        return self.data.popAt(1)

    def peek(self):
        return self.data.getAt(1).data
```



<br>

##### 라이브러리를 이용한 큐

```python
from pythonds.basic.queue import Queue
Q = Queue()
dir(Q)
>> ['__doc__', '__init__', '__module__', 'dequeue', 'enqueue', 'isEmpty', 'items', 'size']
```

<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}