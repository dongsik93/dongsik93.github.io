---
layout: post
title: "자료구조와 알고리즘 23강"
subtitle: "자료구조와 알고리즘 23강"
date: 2019-11-08 12:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 23강: 힙(Heaps) #2

### 최대 힙에서 원소의 삭제

- 최대 힙에서의 원소 삭제는 항상 루트 노드에서 이루어진다
  - 최댓값을 순서대로 뽑아 내기 때문
- 루트 노드를 삭제하고 나면 트리의 구조를 다시 정리해야 한다
- 완전 이진 트리의 성질을 만족해야 하므로 노드의 삭제 또한 맨 마지막 노드에서 일어난다
  - 루트 노드의 데이터를 꺼내고, 맨 마지막 노드의 원소를 루트 노드의 자리에 임시로 집어넣는다
  - 그 후 마지막 노드를 제거한 다음에 루트 자리에 임시로 들어간 노드의 새로운 올바른 자리를 찾아주면 된다
- 노드의 삽입 연산에서와는 반대로, 임시로 들어간 (일시적으로 위치가 올바르지 않은) 노드는 루트 노드에서 시작해서 아래로 내려간다
  - 자식들 중 더 큰 값을 가지는 노드와 자리를 바꾸면서, 더이상 바꿀 필요가 없거나 리프 노드에 도달할 때까지 이 과정을 반복한다
  - 자리를 바꿀 때 더 큰 키값을 가지는 노드를 찾는데, 자식이 둘 있는 경우, 하나만 있는 경우, 아니면 없는 경우 (리프 노드)의 세 가지를 구별해서 생각해야 한다

##### 복잡도

- 자식 노드들과의 대소 비교 최대 회수 : 2 * log2n
- 최악 복잡도  _O_(logn)의 삭제 연산

##### 삭제 연산의 구현 -remove() 메서드

```python
class MaxHeap:
    def remove(self):
        # 하나 이상의 노드가 존재하는 경우
        if len(self.data) > 1:
        	self.data[1], self.data[-1] = self.data[-1], self.data[1]
            data = self.data.pop(-1)
            # 재귀적으로
            self.maxHeapify(1)
        else:
            data = None
        return data
```

삭제 연산의 구현 - maxHeapify() 메서드

```python
class MaxHeap:
	def maxHeapify(self, i):
        left = 2 * i
        right = 2 * i + 1
        greatest = i
        # 자신(i), 왼쪽 자식(left), 오른쪽 자식(right) 중 최대를 찾음
        if left < len(self.data) and self.data[left] > self.data[greatest]:
            greatest = left
        if right < len(self.data) and self.data[right] > self.data[greatest]:
            greatest = right
        if smallest != i:
            # 현재 노드(i)와 최댓값 노드(smallest)의 값 바꾸기
            self.data[greatest], self.data[i] = self.data[i], self.data[greatest]
            # 재귀적으로 maxHeapify를 호출
            self.maxHeapfity(greatest)
```

<br>

### 최대/최소 힙의 응용

##### 최대 힙을 이용한 효과적인 우선 순위 큐(priority queue) 구현

- `Enqueue` 할 때 **느슨한 정렬**을 이루고 있도록 하고
- `dequeue` 할 때 최ㄷ댓값을 순서대로 꺼낼 수 있으며
- 이 두 연산은 log(n)에 비례하는 복잡도를 가지게 된다

##### 힙 정렬(heap sort)

- 정렬되지 않은 원소들을 아무 순서로나 최대 힙에 삽입 : _O_(logn)
- 삽입이 끝나면, 힙이 비게 될 때 까지 하나씩 삭제 : _O_(logn)
- 원소들이 삭제된 순서가 원소들의 정렬 순서
- 정렬 알고리즘의 복잡도: _O_(nlogn)

```python
# 힙 정렬의 코드 구현
def heapsort(unsorted):
    H = MaxHeap()
    for item in unsorted:
        H.insert(item)
    sorted = []
    d = H.remove()
    while d:
        sorted.append(d)
        d = H.remove()
    return sorted
```

<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}