---
layout: post
title: "자료구조와 알고리즘 16강"
subtitle: "자료구조와 알고리즘 16강"
date: 2019-09-29 16:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 16강: 우선순위 큐(Priority Queue)

### 우선순위 큐(Priority Queue)란?

- 큐에 원소를 추가하는 연산은 다른 점이 없되, 큐에서 원소를 꺼내는 원칙은 원소들 사이의 **우선순위**에 따르는 자료구조이다.
- 선입선출이 아닌 원소들 사이의 우선순위관계에 따른 순서로 원소들이 꺼내어진다
  - 운영체제에서 CPU 스케줄러를 구현할 때, 현재 실행할 수 있는 작업들 중 가장 우선순위가 높은 것을 골라 실행하는 알고리즘

##### 구현방법

1. 큐에서 원소를 넣을 때 우선순위가 순서대로 정렬해 두는 방법
2. 큐에서 원소를 꺼낼 때 우선순위가 가장 높은 것을 선택하는 방법

- 이번 강의에서는 양방향 연결 리스트를 선택하여 우선순위 큐를 구현
- 원소를 추가할 때 우선순위에 따른 알맞을 자리를 찾아서 정렬된 형태로 유지해 두고, 꺼낼 때 한 쪽 끝에서 꺼낼 수 있도록 구현한다
- 이렇게 하면 원소를 넣는(enqueue)연산의 복잡도는 `O(n)` 으로서 큐의 길이에 비례하고, 원소를 꺼내는(dequeue)연산의 복잡도는 `O(1)` 로서 상수시간, 즉 데이터 원소의 개수에 무관한 시간이 걸리게 된다.

<br>

#### 우선순위 큐의 초기화

- enqueue 연산만 수정해주면 나머지는 동일

```python
from doublylinkedlist import Node, DoublyLinkedList

class PriorityQueue:
  	# 양방향 연결 리스트를 이용하여 빈 큐를 초기화
    def __init__(self, x):
      	self.queue = DoublyLinkedList()
    # 넣는 연산
    ## 양방향 연결 리스트의 getAt() 메서드를 이용하지 않는 이유는?
    ## - getAt메서드는 그 pos까지 하나하나 세어나가기 때문에
    def enqueue(self, x):
      	newNode = Node(x)
        # 처음에 시작할때 어디서?
        current = self.queue.head
        # 끝을 만나지 않는 동안 and 우선순위 비교
        while current.next.data != None and x < current.next.data:
          	current = current.next
        self.queue.insertAfter(current, newNode)
```



<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}