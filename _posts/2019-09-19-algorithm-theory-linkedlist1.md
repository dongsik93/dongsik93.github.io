---
layout: post
title: "자료구조와 알고리즘 7강"
subtitle: "자료구조와 알고리즘 7강"
date: 2019-09-19 01:00:00 +0900
categories: algorithm
tags: theory
comments: true
---


## 7강: 연결 리스트(Linked Lists) 1

### 추상적 자료구조(Abstract Data Structures)

- 자료구조의 내부 구현은 숨겨두고 밖에서 보이는 것들 두가지를 제공하는 자료구조
  - 데이터(Data) : 정수, 문자열, 레코드...
  - 연산들(A set of operations) : 삽입, 삭제, 순회, 정렬, 탐색...

### 연결 리스트란(Linked Lists)?

- 데이터 원소들의 순서를 지어 늘어놓는다는 점에서 연결 리스트(Linked list)는 선형 배열(Linear array)과 비슷한 면이 있지만, **_데이터 원소들을 늘어놓는 방식_**에서 큰 차이가 있다.
  - 선형배열 : 번호가 붙여진 칸에 원소들을 채워넣는 방식
  - 연결 리스트 : 각 원소들을 줄줄이 엮어서 관리하는 방식

##### 연결 리스트의 장점?

- 연결 리스트에서는 원소들이 링크(link)라고 부르는 고리로 연결되어 있으므로, 가운데에서 끊어 하나를 삭제하거나, 아니면 가운데를 끊고 그 자이레 다른 원소를(원소들을) 삽입하는 것이 선형 배열의 경우보다 쉽다(빠른 시간 내에 처리할 수 있다)
- 이러한 이점 때문에 원소의 삽입 / 삭제가 빈번히 일어나는 응용에서 많이 이용된다

##### 연결 리스트의 단점?

- 선형 배열에 비해서 데이터 구조 표현에 소요되는 저장공간(메모리) 소요가 크다는 점
- 링크 또한 메모리에 저장되어 있어야 하므로, 연결 리스트를 표현하기 위해서는 동일한 데이터 원소들을 담기 위하여 사용하는 메모리 요구량이 더 크다
- **k번째의 원소**를 찾아가는데 시간이 오래걸린다
  - 선형배열에서는 데이터 원소들이 번호가 붙여진 칸들에 들어있으므로 그 번호를 이용해서 특정 번째의 원소를 찾아갈 수 있다
  - 연결 리스트에서는 단지 원소들이 고리로 연결된 모습을 하고 있으므로 특정 번째의 원소를 접근하려면 앞에서부터 하나씩 링크를 따라가면서 찾아가야 한다



### 연결 리스트 구현

##### 기본적인 연결 리스트의 추상적 자료구조

- Node
  - Data, Link(next)
  - Node내의 데이터는 다른 구조로 이루어질 수 있다
- 리스트의 맨 앞 노드는 Head
- 리스트의 맨 끝 노드는 Tail
  - Tail이 필요한 이유는 리스트의 맨 끝에 하나를 덧붙일 때 tail을 알고 있는게 유리하기 때문
- 연결 리스트의 Node의 개수를 알고있으면 유리하다

```python
class Node:
    # 생성자
    def __init__(self, item):
        self.data = item
        self.next = None

# 비어있는 연결 리스트
class LinkedList:
    def __init__(self):
        self.nodeCount = 0
        self.head = None
        self.tail = None
```

##### 추상적 자료구조의 연산 정의

- 특정 원소 참조(__k__번째)
- 리스트 순회
- 길이 얻어내기
- 원소 삽입 / 삭제
- 두 리스트 합치기

`특정 원소 참조`

```python
# k번째 노드 찾아가기
## LinkedList의 메소드
def getAt(self, pos);
	if pos <= 0 or pos > self.nodeCount:
        return None
    i = 1
    current = self.head
    while i < pos:
        current = current.next
        i += 1
    return current
```

#### 배열과 비교한 연결 리스트

|                |    배열     |   연결리스트    |
| :------------: | :---------: | :-------------: |
|    저장공간    | 연속한 위치 |   임의의 위치   |
| 특정 원소 지징 |  매우 간편  | 선형탐색과 유사 |
|                |   _O_(1)    |     _O_(n)      |

`리스트 순회`

```python
# head에서부터 노드의 끝까지
## 마지막 노드는 next == none으로 판단
def traverse(self):
    answer = []
    current = self.head
    while current != None:
        answer.append(current.data)
        current = current.next
    return answer
```

<br>

본 문서는 프로그래머스 **어서와! 자료구조와 알고리즘** 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}