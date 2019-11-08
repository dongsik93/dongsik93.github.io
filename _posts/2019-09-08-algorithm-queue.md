---
layout: post
title: "Python Queue"
subtitle: "Queue"
date: 2019-09-08 18:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## Python Queue

- Queue, LifoQueue, PriorityQueue 객체 입력 방법은 모두 동일하지만 내부 정렬방식이 다르기 때문에 출력시 순서가 다르다

### Queue

- 선입선출 큐 객체를 생성한다

```python
import queue

# Queue객체를 생성
q = queue.Queue()
# Queue객체에 데이터 입력
q.put('red')
q.put('blue')
q.put('green')
# Queue객체에 저장된 데이터 갯수
q.size()
>> 3
# Queue객체에서 데이터 출력
q.get()
>> 'red'
q.get()
>> 'blue'
```

### LifoQueue

- 일반적으로 스택이라고 불리는 후입선출 큐 객체를 생성

```python
import queue
# LifoQueue객체를 생성
q = queue.LifoQueue()
q.put('red')
q.put('blue')
q.put('white')
# 출력순서
q.get()
>> 'white'
q.get()
>> 'blue'
```

### Priority Queue

- 우선순위 큐는 우선순위가 가장 높은 자료를 가장 먼저 꺼낼 수 있는 자료 구조
- 배열, 연결리스트, 힙으로 구현이 가능
- 배열을 사용하면 쉽게 구할 수있지만 파이썬에서는 `Queue`,  `heapq`라는 built-in 모듈로 제공이 되기 때문에 쓰기 좋다

```python
import queue
# PriorityQueue객체 생성
q = queue.PriorityQueue()
# 우선순위와 아이템을 튜블형태로 입력해 줘야 한다
q.put((10,'red'))
q.put((5,'blue'))
q.put((8,'white'))
# 출력순서
q.get()
>> (5,'blue')
q.get()
>> (8, 'white')
```

```python
import heapq
# PriorityQueue를 위한 배열 생성
hq = []
# 입력
heapq.heappush(hq, (10,'red'))
heapq.heappush(hq, (5,'blue'))
heapq.heappush(hq, (8,'white'))
# 출력
print(hq)
>> [(5, 'blue'), (10, 'red'), (8, 'white')]
# 원소 꺼내기
first = heapq.heappop(hq)
second = heapq.heappop(hq)
third = heapq.heappop(hq)
# 결과 출력
print("first: {}".format(first))
print("second: {}".format(second))
print("third: {}".format(third))
>> first: (5, 'blue')
>> second: (8, 'white')
>> third: (10, 'red')
```

- 위의 방법으로 배열을 힙으로 만들면 시간복잡도는 O(n long n)이다.

- 배열로부터 힙을 만드는 최적 시간복잡도는 O(n)인데 이는 `heap.heapfy`로 구현할 수 있다.

  - 주의할점은 배열 자체가 힙으로 바뀐다는 것

  > #### 힙(heap)이란?
  >
  > 완전 이진 트리의 일종으로 우선순위 큐를 위하여 만들어진 자료구조이다.
  > 여러 개의 값들 중에서 최댓값이나 최솟값을 빠르게 찾아내도록 만들어진 자료구조이다.
  > 힙은 일종의 반정렬 상태(느슨한 정렬 상태) 를 유지한다.
  > 큰 값이 상위 레벨에 있고 작은 값이 하위 레벨에 있다는 정도
  > 간단히 말하면 부모 노드의 키 값이 자식 노드의 키 값보다 항상 큰(작은) 이진 트리를 말한다.
  > 힙 트리에서는 중복된 값을 허용한다. (이진 탐색 트리에서는 중복된 값을 허용하지 않는다.)

```python
import heapq

hq = [(10, 'red'), (5, 'blue'), (8, 'white')]
heapq.heapify(hq)
# 출력 결과는 동일
print(hq)
>> [(5, 'blue'), (10, 'red'), (8, 'white')]
```



참고사이트

- [Heee's Development Blog : 자료구조 힙(heap)](https://gmlwjd9405.github.io/2018/05/10/data-structure-heap.html){: class="underlineFill"}

- [Yunhong Min : [파이썬] 우선순위 큐를위한 heap모듈 사용법](https://medium.com/@yhmin84/파이썬-우선순위-큐-priority-queue-를-위한-heapq-모듈-사용법-b33c4e0ef2b1){: class="underlineFill"}

