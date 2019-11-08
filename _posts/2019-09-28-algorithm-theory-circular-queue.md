---
layout: post
title: "자료구조와 알고리즘 15강"
subtitle: "자료구조와 알고리즘 15강"
date: 2019-09-28 00:10:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 15: 환형 큐(Circular Queue)

##### 큐(Queue)의 활용

- 자료를 생성하는 작업과 그 자료를 이용하는 작업이 비동기적(asynchronously) 일어나는 경우
- 자료를 생성하는 작업이 여러 곳에서 일어나는 경우
- 자료를 이용하는 작업이 여러 곳에서 일어나는 경우
- 자료를 생성한느 작업과 그 자료를 이용한느 작업이 양쪽 다 여러 곳에서 일어나는 경우
- 자료를 처리하여 새로운 자료를 생성하고, 나중에 그 자료를 또 처리해야 하는 작업의 경우

##### 그렇다면 환형 큐란?

- **정해진 개수**의 저장 공간을 빙 돌려가며 이용

- 큐에 담을 수 있는 데이터의 양(데이터 원소의 개수)이 무한할  수는 없다. 
- 만약 큐에 담을 수 있는 원소의 개수 상한을 미리 정하고,  이를 지킬 수 있다면 **_선형 배열을 이용해서 큐를 효과적으로 구현_**할 수 있다.
- 선형 배열의 한쪽 끝과 다른 쪽 끝이 서로 맞닿아 있는 모습(원형, 환형)으로 생각하고, 큐의 맨 앞과 맨 뒤를 가리키는 즉, 원소를 넣을 쪽의 배열  인덱스와 꺼낼 쪽의 배열 인덱스를 기억해 두면 데이터 원소가 빠져 나간 쪽의 저장소를 재활용하면서 큐를 관리할 수 있다.

<br>

#### 환형 큐의 추상적 자료구조 구현

- 연산의 정의
  - size()
  - isEmpty()
  - `isFull()` : 큐에 데이터 원소가 꽉 차 있는지를 판단
  - enqueue(x)
  - dequeue()
  - peek()

- ##### 배열로 구현한 환형 큐

  - 정해진 길이 n의 리스트를 확보
  - Q.enqueue(A) -> `rear`가 A를 가리킴
  - Q.enqueue(B) - > `rear` 가 B를 가리킴
  - Q.enqueue(C) - > `rear` 가 C를 가리킴
  - Q.enqueue(D) - > `rear` 가 D를 가리킴
  - r1 = Q.dequeue() -> `front`는 A를 가리키게 하고 dequeue
  - r2 = Q.dequeue() -> `front`는 B를 가리키게 하고 dequeue
  - `front` 와 `rear`를  적절히 계산하여 배열을 환형으로 재활용

```python
class CircularQueue:
  	# 빈 큐를 초기화
    # 인자로 주어진(n) 최대 큐 길이 설정
    def __init__ (self, n):
        self.maxCount = n
        self.data = [None] * n
        self.count = 0
        self.front = -1
        self.rear = -1
    # 현재 큐 길이를 반환
    def size(self):
      	return self.count
    # 큐가 꽉 차있는가?
    def isFull(self):
      	return self.count == self.maxCount
    # 큐에 데이터 원소 추가
    def enqueue(self, x):
        if self.isFull():
            raise IndexError('Queue full')
        self.rear = (self.rear + 1) % self.maxCount
        self.data[self.rear] = x
        self.count += 1
    # 큐에서 데이터 원소 뽑아내기
    def dequeue(self):
        if self.count == 0:
            raise IndexError('Queue empty')
        self.front = (self.rear + 1) % self.maxCount
        x = self.data[self.front]
        self.count -= 1
        return x
    # 큐의 맨 앞 원소 들여다보기
    def peek(self):
      	if self.isEmpty():
          	raise IndexError('Queue empty')
        return self.data[(self.front + 1) % self.maxCount]
```

<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}
