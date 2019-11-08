---
layout: post
title: "자료구조와 알고리즘 20강"
subtitle: "자료구조와 알고리즘 20강"
date: 2019-10-07 23:50:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 20강: 이진 탐색 트리(Binary Search Trees) 1

### 이진 탐색 트리란?

- 모든 노드에 대해서 왼쪽 서브트리에 들어 있는 데이터는 모두 현재 노드의 값 (키) 보다 작고 오른쪽 서브트리에 들어있는 데이터는 모두 현재 노드의 값 (키) 보다 큰 성질을 만족하는 이진 트리
  - 중복되는 데이터는 없다고 가정
- 탐색을 할 때 루트 노드에서 시작해 한 번에 한 단계씩 간선을 따라 아래로 내려간다
- 어느 노드를 방문했을 때, 이 노드에 담긴 데이터 원소보다 찾고자 하는 키가 더 작은 경우에는 왼쪽 서브트리를, 더 큰 경우에는 오른쪽 서브트리를 택한다.
  - 반대쪽 서브트리에는 찾고자 하는 값이 없음을 보장할 수 있으니까 탐색할 필요가 없다는 성질을 이용한 것
- 이렇게 리프 노드에까지 이르렀는데도 그 사이에 찾고자 하는 값을 만나지 못하면 이 이진탐색 트리에는 찾으려는 값이 없다는 것을 알 수 있다.

<br>

#### (정렬된) 배열을 이용한 이진 탐색과 비교

- 장점
  - 데이터 원소의 추가, 삭제가 용이하다
- 단점
  - 공간 소요가 크다
    - 왼쪽, 오른쪽에 기록을 해놔야 하기 때문
  - 항상 O(log _n_) 의 탐색 복잡도는 아니다(평균적)

<br>

#### 이진 탐색 트리의 추상적 자료구조

- 데이터 표현
  - 각 노드는 Key, Value의 쌍으로
  - Key를 이용해서 검색 가능, 보다 복잡한 데이터 레코드로 확장 가능
- 연산의 정의
  - insert(key, data) : 트리에 주어진 데이터 원소를 추가
  - remove(key) : 특정 원소를 트리로부터 삭제
  - `lookup(key) `: 특정 원소를 검색
  - inorder() : 키의 순서대로 데이터 원소를 나열
  - min(), max() : 최소 키, 최대 키를 가지는 원소를 각각 탐색

```python
class Node:
    def __init__(self, key, data):
        self.key = key
        self.data = data
        self.left = None
        self.right = None
		
    def inorder(self):
        traversal = []
        if self.left:
            traversal += self.left.inorder()
        traversal.append(self)
        if self.right:
            traversal += self.right.inorder()
        return traveral
    
    def min(self):
        # 계속해서 왼쪽을 찾으면 min
        if self.left:
            return self.left.min()
        else:
            return self
          
    def max(self):
        if self.right:
            return self.right.max()
        else:
            return self
    
    def lookup(self, key, parent=None):
        if key < self.key:
            if self.left:
                return self.left.lookup(key, self)
            else:
                return None, None
        elif key > self.key:
            if self.right:
                return self.right.lookup(key, self)
            else:
                return None, None
        else:
            # self = 찾아진 node
            return self, parent

    def insert(self, key, data):
        if key > self.key:
            if self.right:
                self.right.insert(key, data)
            else:
                self.root = Node(key, data)
                self.right = self.root
        elif key < self.key:
            if self.left:
                self.left.insert(key, data)
            else:
                self.root = Node(key, data)
                self.left = self.root
        else:
            raise KeyError
          	 
    
class BinSearchTree:
    # 빈 트리로 초기화
    def __init__(self):
        self.root = None

    def inorder(self):
        if self.root:
            return self.root.inorder()
        else:
            return []
          
    def min(self):
        if self.root:
            # root에서부터 min을 찾음
            return self.root.min()
        else:
            return None

    def max(self):
        if self.root:
            return self.root.max()
        else:
            return None
      
    def lookup(self, key):
        if self.root:
            return self.root.lookup(key)
        else:
            return None, None

    def insert(self, key, data):
        if self.root:
            self.root.insert(key, data)
        else:
            self.root = Node(key, data)
      	
```





<br>



본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.



출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}