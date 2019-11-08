---
layout: post
title: "Linked-queue"
subtitle: "Linked-queue"
date: 2019-03-11 18:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 연결 큐의 구현



```python
class Node:
    def __init__(self, item, n=None):
        self.item = item
        self.link = n

def enQueue(item): # 연결 큐의 삽입 연산
    global front, rear
    newNode = Node(item) # 새로운 노드 생성
    if front == None: # 큐가 비어있다면
        front = newNode
    else:
        rear.next = newNode
    rear = newNode
```



### 리스트(Linked list)

- 순서를 가진 데이터의 집합을 가리키는 추상자료형(abstract data type)

- `addtoFirst()` : 리스트 앞쪽에 원소를 추가하는 연산
- `addtoLast()` : 리스트 뒤쪽에 원소를 추가하는 연산
- `add()`  : 리스트 특정 위치에 원소를 추가하는 연산
- `delete()` : 리스트의 특정 위치에 있는 원소를 삭제하는 연산
- `get()` : 리스트의 특정 위치에 있는 원소를 리턴하는 연산



#### 연결 리스트(Linked list)

- 개별적으로 위치하고 있는 원소의 주소를 연결하여 하나의 전체적인 자료구조를 이룬다
- 자료구조의 크기를 동적으로 조정할 수 있어, 메모리의 효율적인 사용이 가능
- 필요한 공간을 한번에 확보하지 않기 때문에, 메모리의 자리를 차지하는데 시간이 조금 걸림
- `노드` : 연결 리스트에서 하나의 원소에 필요한 데이터를 갖고 있는 자료 단위
  - 구성요소
    - 데이터 필드 : 원소의 값을 저장하는 자료구조,  저장할 원소의 종류나 크기에 따라 구조를 정의하여 사용
    - 링크 필드 : 다음 노드의 주소를 저장하는 자료구조
- `헤드` : 리스트의 처음 노드를 가리키는 레퍼런스



#### 단순 연결 리스트(Singly Linked List)

- 연결구조
  - 노드가 하나의 링크 필드에 의해 다음 노드와 연결되는 구조를 가진다.
  - 헤드가 가장 앞의 노드를 가리키고, 링크 필드가 연속적으로 다음 노드를 가리킨다.
  - 최종적으로 NULL(NONE)을 가리키는 노드가 리스트의 가장 마지막 노드이다



- 삽입연산

```python
# 첫 번째 노드로 삽입
## Node는 구현되어 있음
def addtoFirst(data): 		# 첫 노드에 데이터 삽입
    global Head
    Head = Node(data, Head) # 새로운 노드 생성
```



```python
# 가운데 노드로 삽입
## 노드 pre의 다음 위치에 노드 삽입
def add(pre, data):			# pre 다음에 데이터 삽입
    if(pre == None):
        print('error')
    else:
        pre.link = Node(data, pre.link)
```



```python
# 마지막 노드로 삽입
def addtoLast(data):				# 마지막에 데이터 삽입
    global Head
    if(Head == None):				# 빈 리스트 이면
        Head = Node(data, None)
    else:
        p = Head
        while(p.link != None):		# 마지막 노드 찾을때 까지
            p = p.link
        p.link = Node(data, None)
```



- 삭제연산 : 삭제할 노드의 앞 노드(선행노드)를 탐색해야 함

```python
# 노드 pre의 다음 위치에 있는 노드 삭제
def delete(pre): 				# pre 다음 노드 삭제
    if(pre == None or pre.link == None):
        print('error')
    else:
        pre.link = pre.link.link # pre가 가르키는 link의 link
```



##### Linked list 연습

```python
class Node:
    def __init__(self, item, n=None):
        self.item = item
        self.link = n

def addFirst(data):
    global Head
    Head = Node(data, Head)

# 탐색 : data가 들어있는 애를 찾아감
## data가 들어있는 node의 주소를 return
def search(data):
    global Head
    p = Head
    # p가 None이 아니고, 찾는 값이 아니면
    # 노드는 존재하지만, 찾는 값을 갖고 있지 않으면
    while(p != None and p.item != data):
        # p가 가리키는 노드의 link를 p로 복사 = p를 다음 노드로 이동
        p = p.link
    return p


# Head -> 30 | link -> 20 | link -> 10 | link(None)
Head = None
addFirst(10)
addFirst(20)
addFirst(30)
print(Head.link) # 30의 link
print(search(20)) # 20이 들어있는 노드의 주소 == 30의 link

print(Head.item) # 30
print(Head.link.item) # 20
print(Head.link.link.item) # 10
print(Head.link.link.link) # None

```



#### 이중 연결 리스트(Doubly Linked List)

- 양쪽 방향으로 순회할 수 있도록 노드를 연결한 리스트
- 두개의 링크필드와 한개의 데이터 필드로 구성
- `head` // `tail` // `current`  세개로 나누어 관리
- 그림으로 이해





### 삽입정렬(Insertion Sort)

- 정렬되지 않은 부분집합 u의 원소를 하나씩 꺼내서 이미 정렬되어있는 부분집합 s의 마지막 원소부터 비교하면서 위치를 찾아 삽입
- 시간복잡도 : `O(n2)`



### 병합정렬(Merge Sort)

- 여러 개의 정렬된 자료의 집합을 병합하여 한 개의 정렬된 집합으로 만드는 방식
- 메모리가 많이 필요 - 재귀
- 분할 정복 알고리즘을 활용
- 시간복잡도 : `O(n log n)` 



##### 분할과정

```python
def merge_sort(m):
    if(len(m) <= 1):			# 사이즈가 0이거나 1인경우, 바로 리턴
        return m
    
    # 1. DIVIDE 부분
    mid = len(m) // 2
    left = m[:mid]
    right = m[mid:]
    
    # 리스트의 크기가 1이 될 때까지 merge_sort재귀 호출
    left = merge_sort(left)
    right = merge_sort(right)
    
    # 2. CONQUER 부분 : 분할된 리스트들 병합
    return merge(left, right)
```



##### 병합과정

```python
def merge(left, right):
    result = [] 				# 두개의 분할된 리스트를 병합하여 result들 만듦
    
    while(len(left) > 0 and len(right) > 0 ): # 양쪽 리스트에 원소가 남아있는 경우
        # 두 서브 리스트의 첫 원소들을 비교하여 작은 것부터 result에 추가
        if(left[0] <= right[0]):
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
            
    if(len(left) > 0):			# 왼쪽 리스트에 원소가 남아있는 경우
        result.extend(left)
    if(len(right) > 0):			# 오른쪽 리스트에 원소가 남아있는 경우
        result.extend(right)
    return result
```





### 리스트(linked list)를 이용한 스택



##### 우선순위 큐

