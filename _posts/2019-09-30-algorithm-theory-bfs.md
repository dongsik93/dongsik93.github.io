---
layout: post
title: "자료구조와 알고리즘 19강"
subtitle: "자료구조와 알고리즘 19강"
date: 2019-09-30 21:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 19강: 이진 트리 - 넓이 우선 순회(Breadth First Search)


#### 넓이 우선 순회

- 수준(level)이 낮은 노드를  우선으로 방문
- 같은 수준의 노드들 사이에는 
  - 부모 노드의 방문 순서에 따라 방문
  - 왼쪽 자식 노드를 오른쪽 자식보다 먼저 방문

- 재귀적 방법이 적합하지 않다

![bfs](/img/in-post/bfs.png)

- 한 노드를 방문했을 때
  - 나중에 방문할 노드들을 순서대로 기록해 두어야 한다.
  - **_큐_** 를 이용한다

<br>

#### 넓이 우선 순회 알고리즘 구현

1. (초기화) traversal <-- 빈 리스트, q  <-- 빈 큐

2. 빈 트리가 아니면, root node를 q에  추가(enqueue)

3. q가 비어있지 않은 동안

   3-1. node <-- q에서 원소를 추출(dequeue)

   3-2. node를 방문

   3-3. node의 왼쪽, 오른쪽 자식(있으면) 들을 q에 추가

4. q가 빈 큐가 되면 모든 노드 방문 완료 	

```python
def bft(self):
        traversal = []
        q = ArrayQueue()

        if self.root:
            q.enqueue(self.root)

        while q.size() != 0:
            mov = q.dequeue()
            traversal.append(mov.data)
            if mov.left:
                q.enqueue(mov.left)
            if mov.right:
                q.enqueue(mov.right)

        return traversal
```



<br>



본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.


출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}
