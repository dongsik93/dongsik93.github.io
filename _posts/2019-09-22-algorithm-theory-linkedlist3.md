---
layout: post
title: "자료구조와 알고리즘 9강"
subtitle: "자료구조와 알고리즘 9강"
date: 2019-09-22 23:50:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 9강: 연결 리스트(Linked  Lists) 3

- 앞의 강의에서는 `특정 번째` 를 지정하여 원소를 삽입/삭제하는 연산을 정의하고 구현했지만, 이번 강의에서는 `특정 원소의 바로 다음` 을 지정하여 연산을 정의한다.
- 연산을 정의하기 위해서 맨  앞에 원소를 추가(삽입) 하거나 맨 앞의 원소를 제거(삭제) 하는 연산을 지정하는데, 이번에는 연결 리스트의 맨 앞에다가 데이터 원소를 담고 있지 않은, 그냥 자리만 차지하는 노드(node)를 추가한, 모습이 조금 달라진 연결 리스트를 정의한다
- `더미 노드(dummy node)` 라고 불리는, 데이터 원소를 담고 있지 않은 노드를 가지는 연결 리스트를 대상으로 앞선 강의들에서 정의한 연산들을 구현한다

```python
def insertAt(self, pos, newNode):
  if pos < 1 or pos > self.nodeCount + 1:
    return False
  
  if pos == 1:
    newNode.next = self.head
    self.head = newNode
  else:
    if pos == self.nodeCount + 1:
      prev = self.tail
  	else:
      # n번째에 있는 노드를 찾아가야 하기 때문에, 부담이 생김
      `prev = self.getAt(pos - 1)`
    newNode.next = prev.next
    prev.next = newNode
 
	if pos == self.nodeCount + 1:
    self.tail = newNode
  
  self.nodeCount += 1
  return True
```

- 그래서 **_삽입과 삭제가 유연하다는 것이 가장 큰 장점_**인 연결 리스트를 이용해서 새로운  메서드들을 만들어보자

  - 삽입/삭제할 때 포지션을 주는게 아니라 어떤 노드를 주고 그 뒤에 연산을 진행
  - insertAfter(prev, newNode)
    - 맨 앞에는 어떻게 처리하나?
  - popAfter(prev)
    - 맨 앞에서는 어떻게 ?

- 위의 문제를 해결한 **_확장/변형된 연결 리스트_**

  - 맨 앞에 dummy node를 추가한 형태로 

  ```python
  class LinkedList:
    def __init__(self):
      self.nodeCount = 0
      self.head = Node(None)
      self.tail = None
      self.head.next = self.tail
  ```

##### 연결 리스트 연산 - 리스트 순회

- 먼저 연결되있으면 그 다음에 이동하고 데이터를 얻어 냄
- `#1` : while문 부분이 변경된 걸 알 수 있다

```python
def traverse(self):
  result = []
  current = self.head
  # 1
  while current.next:
    current = current.next
    result.append(current.data)
  return result
```

##### 연결 리스트 연산 - _k_ 번째 원소 얻어내기

- `#1` : pos < 1 를 pos < 0으로 해서 getAt(0)을 head로
- `#2` : 1부터 시작했던 부분을 0으로 초기화해서 head를 가리킴

```python
def getAt(self, pos):
  # 1
  if pos < 0 or pos > self.nodeCount:
    return None
  # 2
  i = 0
  current = self.head
  while i < pos:
    current = current.next
    i += 1
  return current
```

##### 연결 리스트 연산 - 원소의 삽입

- 끝에 추가할 때 고려
- dummy node를 맨 앞에 추가하면서 코드가 이전보다는 깔끔하고 간결해짐

```python
'''
prev가 가리키는 node의 다음에 newNode를 삽입하고
성공/실패에 따라 True/False를 리턴
'''
def insertAfter(self, prev, newNode):
  newNode.next = prev.next
  if prev.next is None:
    self.tail = newNode
  prev.next = newNode
  self.nodeCount += 1
  return True
```

##### 메서드 insertAt()의 구현

- `#1` : 이미 구현한 insertAfter()를 호출하여 구현

```python
'''
1. post의 범위 조건 확인
2. pos == 1인 경우에는 head뒤에 새 node를 삽입
3. pos == nodeCount + 1인 경우는 prev <- tail
4. 그렇지 않은 경우에는 prev <- getAt(...)
'''
def insertAt(self, pos, newNode):
  if pos < 1 or pos > self.nodeCount + 1:
    return False
  
  if pos != 1 and pos == self.nodeCount + 1:
    prev = self.tail
  else:
    prev = self.getAt(pos - 1)
  # 1
  return self.insertAfter(prev, newNode)
```

##### 연결 리스트 연산 - 원소의 삭제

- 주의사항
  - prev가 마지막 node일 때 (prev.next == None)
    - 삭제할 node가 없다
    - return None
  - 리스트 맨 끝의 node를 삭제할 때(current.next == None)
    - Tail 조정 필요

```python
'''
prev의 다음 node를 삭제하고 그 node의 data를 리턴
'''
def popAfter(self, prev):
        if prev.next is None:
            return None

        curr = prev.next

        if curr.next is None:
            self.tail = prev

        prev.next = curr.next
        self.nodeCount -= 1

        return curr.data


    def popAt(self, pos):
        if pos < 1 or pos > self.nodeCount:
            raise IndexError

        if pos == 1 and pos == self.nodeCount + 1:
            prev = self.head
        else:
            prev = self.getAt(pos - 1)

        return self.popAfter(prev)
  
```

##### 연결 리스트 연산 - 두 리스트의 연결

```python
def concat(self, L):
  self.tail.next = L.head.next
  if L.tail:
    self.tail = L.tail
  self.nodeCount += L.nodeCount
```

<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}