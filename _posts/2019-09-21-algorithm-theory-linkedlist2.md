---
layout: post
title: "자료구조와 알고리즘 8강"
subtitle: "자료구조와 알고리즘 8강"
date: 2019-09-21 00:50:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 8강: 연결 리스트(Linked list) 2

- 원소의 삽입, 삭제, 두 리스트 합치기의 연산이 빠르게 이루어 질 수 있다는 점이 연결 리스트가 선형 배열에 비해 가지는 특장점인데, 이런 연산들이 빨라야 하는 응용처에 적용하기 위함이 연결 리스트의 존재 이유이다.
- 하지만 나열된 데이터 원소들의 사이에 새로운 데이터 원소를 삽입하려면, 앞/뒤 원소들을 연결하고 있는 링크를 끊어내고, 그 자리에 새로운 원소를 집어 넣기 위해서 링크들을 조정해 주어야 하는 일이 수반된다
- 이번 강의에서는 이러한 작업들을 작성하는 연습을 한다

#### 연결 리스트 연산 - 원소의 삽입

1. 삽입할 노드의 링크가 pos번째의 노드를 가리키도록 수정
2. 삽입할 노드를 pos-1번째가 가리키도록 수정
3. 마지막으로 nodeCount를 1만큼 증가시킨다

```python
'''
pos가 가리키는 위치에 (1 <= pos <= nodeCount +1) 
newNode를 삽입하고 성공 실패에 따라 True/False를 리턴
''' 
def insertAt(self, pos, newNode):
  # pos가 올바른 범위에 존재하는지
  if pos < 1 or pos > self.nodeCount + 1:
    return False
  # 맨 앞일 때
  if pos == 1:
    newNode.next = self.head
    self.head = newNode
  # 정상적
  else:
    prev = self.getAt(pos - 1)
    newNode.next = prev.next
    prev.next = newNode
  # 맨 끝일 때 
  if pos == self.nodeCount + 1:
    self.tail = newNode
    
  self.nodeCount += 1
  return True
```

- 코드 구현 주의사항
  - 삽입하려는 위치가 리스트 맨 앞일 때
    - prev 없음
    - Head의 조정이 필요하다
  - 삽입하려는 위치가 리스트 맨 끝일 때
    - Tail의 조정이 필요하다
  - 빈 리스트에 삽입할 때???
    - 위의 두 조건을 잘 처리해주면 해결
  - 삽입하려는 위치가 리스트 맨 끝일 때, 즉 pos == nodeCount + 1 인 경우에는?
    - 맨 앞에서부터 찾아갈 필요가 없이 한번에 찾아가면 됨

```python
def insertAt(self, pos, newNode):
  if pos < 1 or pos > self.nodeCount + 1:
    return False
  
  if pos == 1:
    newNode.next = self.head
    self.head = newNode
    
  else:
    # 삽입하려는 위치가 맨 끝인 경우 처리
    if pos == self.nodeCount + 1:
      ## 앞에서부터 찾지 않고 바로 tail로 이동
      prev = self.tail
    else:
    	prev = self.getAt(pos - 1)
    newNode.next = prev.next
    prev.next = newNode
    
  if pos == self.nodeCount + 1:
    self.tail = newNode
    
  self.nodeCount += 1
  return True
```

- 테스트 코드

```python
class Node:

    def __init__(self, item):
        self.data = item
        self.next = None


class LinkedList:

    def __init__(self):
        self.nodeCount = 0
        self.head = None
        self.tail = None


    def __repr__(self):
        if self.nodeCount == 0:
            return 'LinkedList: empty'

        s = ''
        curr = self.head
        while curr is not None:
            s += repr(curr.data)
            if curr.next is not None:
                s += ' -> '
            curr = curr.next
        return s


    def getAt(self, pos):
        if pos < 1 or pos > self.nodeCount:
            return None

        i = 1
        curr = self.head
        while i < pos:
            curr = curr.next
            i += 1

        return curr


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
                prev = self.getAt(pos - 1)
            newNode.next = prev.next
            prev.next = newNode

        if pos == self.nodeCount + 1:
            self.tail = newNode

        self.nodeCount += 1
        return True


    def getLength(self):
        return self.nodeCount


    def traverse(self):
        result = []
        curr = self.head
        while curr is not None:
            result.append(curr.data)
            curr = curr.next
        return result


    def concat(self, L):
        self.tail.next = L.head
        if L.tail:
            self.tail = L.tail
        self.nodeCount += L.nodeCount
        
        
a = Node(67)
b = Node(34)
c = Node(28)
L = LinkedList()
# a, b 연결 리스트로 만들기
L.insertAt(1,a)
L.insertAt(2,b)
L
>> 67 -> 34
# c를 맨앞에 삽입
L.insert(1,c)
L
>> 28 -> 67 -> 34
```

##### 연결 리스트 원소 삽입의 복잡도

- 맨 앞에 삽입하는 경우 : _O_(1)
  - 한번에 헤드를 찾아서 집어넣으니까 상수시간
- 중간에 삽입하는 경우 : _O_(n)
  - 리스트의 길이만큼 비례해서 커지기 때문에 linear type
- 맨 뒤에 삽입하는 경우 : _O_(1)
  - tail을 유지하고 있기 때문에 상수시간

<br>

#### 연결 리스트 연산 -  원소의 삭제

1. pos-1번쨰 노드를 찾는다 (prev)
2. pos를 current로 저장
3. prev의 next를 current의 next, 즉  pos+1번째 링크를 가리키도록 해준다
4. current의 data를 꺼내서 return
5. nodeCount 를 -1 해줌

```python
'''
pos가 가리키는 위치의  (1 <= pos <= nodeCount)
node를 삭제하고 그 node의 데이터를 리턴
'''
    def popAt(self, pos):
        data = 0
        if pos < 0 or pos > self.nodeCount:
            raise IndexError

        if self.nodeCount == 1:
            data = self.head.data
            self.head = None
            self.tail = None

        else:
            if pos == 1:
                data = self.head.data
                self.head = self.head.next
            else:
                prev = self.getAt(pos - 1)
                if pos == self.nodeCount:
                    data = prev.next.data
                    prev.next = None
                    self.tail = prev
                else:
                    data = prev.next.data
                    prev.next = prev.next.next

        self.nodeCount -= 1
        return data
  
```

- 코드 구현 주의사항
  - 삭제하려는 node가 맨 앞의 것일 때
    - prev가 없음
    - Head의 조정이 필요하다
  - 리스트  맨 끝의  node를 삭제할 때
    - Tail의 조정 필요
  - 유일한 노드를 삭제할 때???
    - 위의 두 조건에 의해 처리가 되는지??
  - 삭제하려는 node가 마지막 node일 때, 즉 pos == nodeCount 인 경우?
    - 한번에 처리할 수 없다(prev 를 찾을 방법이 없으므로)
    - 앞에서부터 찾아와야 한다

##### 연결 리스트 원소 삭제의 복잡도

- 맨 앞에 삽입하는 경우 : _O_(1)
- 중간에 삽입하는 경우 : _O_(n)
  - 리스트의 길이만큼 비례해서 커지기 때문에 linear type
- 맨 뒤에 삽입하는 경우 : _O_(n)
  - 앞에서부터 찾아와야 하기 때문에

<br>

#### 연결 리스트 연산 - 두 리스트의 연결

1. 첫번째 노드,즉 self.tail.next 가 두번째 노드의  head를 링크하도록 해주고
2. self.tail을 두번째 노드의 tail로  바꿔준다
3. self.nodeCount 를 두개를 합한다

```python
'''
연결 리스트 self의 뒤에 또다른 연결 리스트인 L을 이어 붙임
'''
def concat(self, L):
  self.tail.next = L.head
  if L.tail:
    self.tail = L.tail
  self.nodeCount += L.nodeCount
```

- 코드 구현 주의사항
  - 두번째 합칠 노드가 비어있을 경우 L.tail이 Null이기 때문에 이를 처리

<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}