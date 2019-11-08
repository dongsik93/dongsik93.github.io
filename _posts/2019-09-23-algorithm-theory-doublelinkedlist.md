---
layout: post
title: "자료구조와 알고리즘 10강"
subtitle: "자료구조와 알고리즘 10강"
date: 2019-09-23 22:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 10강: 양방향 연결 리스트(Doubly Linked Lists)

### 양방향 연결 리스트란 ?

- 양방향 연결 리스트는 노드들이 앞/뒤로 연결되어 있다.

- 즉, 인접한 두 개의 노드들은 앞의 노드로부터 뒤의 노드가 연결되어 있을뿐만 아니라, 뒤의 노드로부터 앞의 노드도 연결되어 있다.

  - 한 노드의 입장에서 보자면, 자신보다 앞에 오는 노드를 연결하는 링크와 자신보다 뒤에 오는 노드를 연결하는 링크를 둘 다 가지게 된다.

  - 따라서 모든 연결은 양방향으로 이루어져 있으며, 그러한 이유로 이런 구조의 연결 리스트를 **_양방향 연결 리스트_** 라고 부른다

    

#### 양방향 연결 리스트의 장점

- 데이터 원소들을 차례로 방문할 때, 앞에서부터 뒤로도 할 수 있지만 뒤에서부터 앞으로도 할 수 있다는 점이다
- 실제로 운영체제(Operating System)등에서는 리스트를 대상으로 앞/뒤로 왔다 갔다 하면서 작업을 행하는 일들이 빈번히 요구되고, 따라서 양방향 연결 리스트가 많이 이용되고 있다.
- 유연한 자료구조



#### 양방향 연결 리스트의 단점

- 단방향 연결 리스트에 비해서 링크를 나타내기 위한 메모리 사용량이 늘어난다.
- 원소를 삽입/삭제하는 연산에 있어서 앞/뒤의 링크를 모두 조정해 주어야 하기 때문에 코드가 길어지게 된다_~~(프로그래머가 귀찮아진다는 얘기)~~_



##### 구현은 어떻게?

- 9강과 마찬가지로, 동일한 모습의 연산을 일관되게 적용하기 위해서 양방향 연결 리스트의 **맨 앞**과 **맨 뒤**에 더미노드를 하나씩 추가할 수 있다.
- 링크릉 앞/뒤로, 더미 노드도 맨앞/맨뒤에 두고, 점점 리스트의 모습이 복잡해 지고 있지만 이렇게 함으로써 오히려 __리스트를 대상으로 하는 연산들이 깔끔하게 구현될 수 있다.__
  - 특별한 경우로 처리해야 하는 것들이 줄어들기 때문이다.



##### Node의 구조 확장

```python
class Node:
    def __init__(self, item):
      self.data = item
      self.prev = None
      self.next = None
```

##### 앙방향 연결 리스트 구현

- 리스트의 처음과 끝에 더미 노드를 둔다
  - 데이터를 담고 있는 노드들은 모두 같은 모양이 된다

```python
class DoublyLinkedList:
    def __init__(self, item):
      self.nodeCount = 0
      # head와 tail을 아무것도 가지지 않은(None)인 노드로 
      `self.head = Node(None)`
      `self.tail = Node(None)`
      self.head.prev = None
      `self.head.next = self.tail`
      `self.tail.prev = self.head`
      self.tail.next = None
```

##### 리스트 순회

```python
def traverse(self):
    result = []
    current = self.head
    # tail이 더미노드이기 때문에 current.next.next가 유효해야 됨
    while `current.next.next:`
      current = current.next
      result.append(current.data)
    return result
```

##### 리스트 역순회

- 양방향 연결 리스트이기 때문에 가능

```python
def reverse(self):
    result = []
    current = self.tail
    # 위와는 반대로 head가 더미노드 이기 때문
    while `current.prev.prev:`
      	current = current.prev
        result.append(current.data)
    return result
```

##### 원소의 삽입

1. prev와 next노드, newNode가 주어진다
2. next노드는 prev.next로 
3. prev.next를 newNode를 가리키게 하고
4. next.prev를 newNode를 가리키게 하고
5. 마지막으로 nodeCount + 1을 해주면 됨

```python
def insertAfter(self, prev, newNode):
    next = prev.next
    newNode.prev = prev
    newNode.next = next
    prev.next = newNode
    next.prev = newNode
    self.nodeCount += 1
    return True
```

##### 특정 원소 얻어내기

```python
def getAt(self, pos):
    if pos < 0 or pos > self.nodeCount:
        return None
    i = 0
    current = self.head
    while i < pos:
      	current = current.next
        i += 1
    return current
```

##### 특정 원소 얻어내기를 이용해 특정 포지션을 기준으로 원소의 삽입 연산

```python
def insertAt(self, pos, newNode):
    if pos < 1 or pos > self.nodeCount + 1:
        return False
    prev = self.getAt(pos -1)
    return self.insertAfter(prev, newNode)
```

그렇다면 **_마지막에 원소를 삽입할 때_**는?

- 리스트가 많이 길어지면 마지막까지 찾아가서 삽입
- 하지만 양방향 연결 리스트는 getAt메소드를 수정해서 쉽게 가능

```python
def getAt(self, pos):
    if pos < 0 or pos > self.nodeCount:
        return None
    # pos가 nodeCount //2가 크다면, 
    # 앞에서부터 찾아가지말고, tail로부터 하나하나 찾아가도록
    if `pos > self.nodeCount // 2`:
        i = 0
        current = self.tail
        while i < self.nodeCount - pos + 1:
            current = current.prev
            i += 1
    else:
        # 앞에서부터 찾아가기
```

##### 앞의 노드에 새로운 노드 추가하기

```python
def insertBefore(self, next, newNode):
    prev = next.prev
    newNode.next = next
    newNode.prev = prev
    next.prev = newNode
    prev.next = newNode
    self.nodeCount += 1
    return True
```

##### 특정 원소를 삭제하고, 그 노드의 데이터 꺼내기

```python
def popAfter(self, prev):
    current = prev.next
    next = current.next
    prev.next = next
    next.prev = prev
    self.nodeCount -= 1
    data = current.data
    current = None
    return data
  
def popBefore(self, next):
    current = next.prev
    prev = current.prev
    prev.next = next
    next.prev = prev
    data = current.data
    self.nodeCount -= 1
    return data
  
def popAt(self, pos):
    if pos < 1 or pos > self.nodeCount:
        raise IndexError

    if pos > self.nodeCount // 2:
        i = 0
        current = self.tail
        # popAfter를 사용하기 때문에 current를 한칸 뒤로 가게 해줌
        while i <= self.nodeCount - pos + 1:
                current = current.prev
                i += 1
        return self.popAfter(current)
    else:
        i = 0
        current = self.head
        # popBefore를 사용하기 때문
        while i <= pos:
            current = current.next
            i += 1
        return self.popBefore(current)
```

##### 두 연결 리스트를 이어붙이기

```python
def concat(self, L):
    self.tail.prev.next = L.head.next
    L.head.next.prev = self.tail.prev
    self.tail = L.tail
    self.nodeCount += L.nodeCount
```

<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}