---
layout: post
title: "자료구조와 알고리즘 20강"
subtitle: "자료구조와 알고리즘 20강"
date: 2019-10-12 19:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 21강: 이진 탐색 트리(Binary Search Tree) 2



### remove() 연산

- 연산을 구현할 때 트리를 조정함에 있어서 이진 탐색 트리의 모습을 유지하도록 알고리즘을 구성해야 한다.

1. 키(key)를 이용해서 노드를 찾는다.
   - 해당 키의 노드가 없으면, 삭제할 것도 없다
   - 찾은 노드의 부모 노드도 알고 있어야 한다(2번 때문)
2. 찾은 노드를 제거하고도 이진 탐색 트리의 성질을 만족하도록 트리의 구조를 정리한다.
   - 삭제되는 노드가
     - 말단(leaf) 노드인 경우
     - 자식을 하나 가지고 있는 경우
     - 자식을 둘 가지고 있는 경우

##### 인터페이스의 설계

- 입력: 키(key)
- 출력
  - 삭제한 경우 True
  - 해당 키의 노드가 없는 경우 False

```python
class BinSearchTree:
    def remove(self, key):
        node, parent = self.lookup(key)
        if node:
            ...
            return True
        else:
            return False        
```

##### 이진 탐색 트리 구조의 유지

```python
# 자식을 세어 보기
class Node:
    def countChildren(Self):
        count = 0
        if self.left:
            count += 1
        if self.right:
            count += 1
        return count
```

- 삭제되는 노드가
  1. 말단 (leaf) 노드인 경우
     - 그냥 그 노드를 없애면 됨
     - 부모 노드의 링크를 조정(좌 / 우)
     - 삭제되는 노드가 root node인 경우?
       - 말단 노드가 루트 노드인 경우는 루트 노드가 하나인 트리, 이 때는 트리 전체가 없어진다
  2. 자식을 하나 가지고 있는 경우
     - 삭제되는 노드 자리에 그 자식을 대신 배치
     - 자식이 왼쪽 / 오른쪽 subtree
     - 부모 노드의 링크를 조정(좌 / 우)
     - 삭제되는 노드가 root node인 경우?
       - 대신 들어오는 자식이 새로 root가 된다
  3. 자식을 둘 가지고 있는 경우
     - 삭제되는 노드보다 바로 다음 (큰) 키를 가지는 노드를 찾아 그 노드를 삭제되는 노드 자리에 대신 배치하고 이 노드를 대신 삭제

```python
# remove()연산
def remove(self, key):
    node, parent = self.lookup(key)
    if node:
        nChildren = node.countChildren()
        # The simplest case of no children
        if nChildren == 0:
            # 만약 parent 가 있으면
            # node 가 왼쪽 자식인지 오른쪽 자식인지 판단하여
            # parent.left 또는 parent.right 를 None 으로 하여
            # leaf node 였던 자식을 트리에서 끊어내어 없앱니다.
            if parent:
                if node == parent.left:
                    parent.left = None
                 elif node == parent.right:
                    parent.right = None
            # 만약 parent 가 없으면 (node 는 root 인 경우)
            # self.root 를 None 으로 하여 빈 트리로 만듭니다.
            else:
                self.root = None
        # When the node has only one child
        elif nChildren == 1:
            # 하나 있는 자식이 왼쪽인지 오른쪽인지를 판단하여
            # 그 자식을 어떤 변수가 가리키도록 합니다.
            if node.left:
                temp = node.left                    
            else:
                temp = node.right
            # 만약 parent 가 있으면
            # node 가 왼쪽 자식인지 오른쪽 자식인지 판단하여
            # 위에서 가리킨 자식을 대신 node 의 자리에 넣습니다.
            if parent:
                if parent.left == node:
                    parent.left = temp
                else:
                    parent.right = temp
                    # 만약 parent 가 없으면 (node 는 root 인 경우)
                    # self.root 에 위에서 가리킨 자식을 대신 넣습니다.
            else:
            	self.root = temp
        # When the node has both left and right children
        else:
            parent = node
            successor = node.right
            # parent 는 node 를 가리키고 있고,
            # successor 는 node 의 오른쪽 자식을 가리키고 있으므로
            # successor 로부터 왼쪽 자식의 링크를 반복하여 따라감으로써
            # 순환문이 종료할 때 successor 는 바로 다음 키를 가진 노드를,
            # 그리고 parent 는 그 노드의 부모 노드를 가리키도록 찾아냅니다.
            while successor.left:
                parent = successor
                successor = parent.left
            # 삭제하려는 노드인 node 에 successor 의 key 와 data 를 대입합니다.
            node.key = successor.key
            node.data = successor.data
            # 이제, successor 가 parent 의 왼쪽 자식인지 오른쪽 자식인지를 판단하여
            # 그에 따라 parent.left 또는 parent.right 를
            # successor 가 가지고 있던 (없을 수도 있지만) 자식을 가리키도록 합니다.
            if parent.left == successor:
                if successor.right:
                    parent.left = successor.right
                else:
                    parent.left = None
            else:
                parent.right = None
            return True
    else:
        return False
```

<br>

#### 이진 탐색 트리가 효과를 발휘할 수 없는 특별한 경우

- 트리가 한 줄로 늘어서면(즉, 모든 노드가 왼쪽 또는 오른쪽 한 자식만을 가지는 경우) 노드의 개수가 n이라고 할 때 트리의 높이(깊이) 또한 n이다.
- 이 경우 특정 원소를 탐색하면 이 탐색 연산의 복잡도는 선형 탐색(linear search)와 동일해진다 
- 이 한계점은 이진 탐색 트리에 원소를 삽입함에 있어서 높이를 최소화 하려는, 즉 트리의 좌우 균형을 유지하려는 노력을 하지 않았기 때문이다.
  - 한계 극복을 위한 트리
    - 높이의 균형을 유지함으로써 _O_(logn) 의 탐색 복잡도 보장
    - AVL trees
    - Red-black trees





<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}