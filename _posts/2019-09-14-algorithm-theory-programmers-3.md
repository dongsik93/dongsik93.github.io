---
layout: post
title: "자료구조와 알고리즘 3강"
subtitle: "자료구조와 알고리즘 3강"
date: 2019-09-14 17:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 3강: 정렬(Sort), 탐색(Search)

### 배열 - 정렬(sort)과 탐색(search)



#### 정렬이란?

- 복수의 원소로 주어진 데이터를 정해진 기준에 따라 새로 늘어놓는 작업

- Python의 리스트는 내장된 정렬기능이 있다

  - 파이썬 내장 함수 : `sorted()`

    - 정렬된 새로운 리스트를 얻어냄

  - 리스트에 쓸 수 있는 메서드 : `sort()`

    - 해당 리스트를 정렬

  - 정렬의 순서를 반대로 : `reverse=True`

    ```python
    L = sorted(L, reverse=True)
    L.sort(reverse=True)
    ```

  - 함수와 메서드의 차이를 구분해야 한다

- ##### 수치(number)가 아닌 데이터형의 정렬?

  - 문자열을 사전에 등장하는 순서에 따라 정렬한다

  - 문자열의 길이가 더 길다고 해서 더 큰 문자로 취급하는 것이 아니다

  - Python은 대문자가 소문자에 비해서 무조건 우선

  - 문자열 길이 순서로 정렬하려면?

    - 정렬에 이용하는 키(key)를  지정해서  정렬할 수 있다(**lambda**)

    ```python
    # 예제 1
    L = ['abcd', 'xyz', 'spam']
    sorted(L, key=lambda x: len(x))
    ## abcd와 spam의 순서는 처음 정의했을 순서대로 출력
    >> ['xyz', 'abcd', 'spam']
    
    # 예제 2
    L = [{'name':'John', 'score':83},
        {'name':'Paul', 'score':92}]
    ## lambda를 이용해 레코드들을 이름 순서대로 정렬하기
    L.sort(key=lambda x: x['name'])
    ## 레코드들을 점수 높은 순으로 정렬
    L.sort(key=lambda x: x['score'], reverse=True)
    ```

<br>

#### 탐색이란?

- 복수의 원소로 이루어진 데이터에서 특정 원소를 찾아내는 작업

- `선형탐색(linear serach)`, `순차탐색(sequential search)`

  - 순차적으로 모든 요소들을 탐색하여 원하는 값을 찾아냄
  - 배열의 길이에 비례하는 시간이 걸리므로 _O_(n), 최악의 경우에는 배열에 있는 모든 원소를 다 검사해야 할 수 있다.

  ```python
  def linear_search(L, x):
    i = 0
    while(i < len(L) and L[i] != x):
      i += 1
    if(i < len(L)):
      return i
    else:
      return -1
  ```

- `이진탐색(binary search)`

  - 탐색하려는 배열이 이미 정렬되어 있는 경우에만 적용이 가능
  - 크기 순으로 정렬되어 있다는 성질 이용
  - 한 번 비교가 일어날 때마다 리스트 반씩 줄임(divide & conquer)
  - _O_(log _n_)

<br>

**_생각해 봐야 할 점_**

- 이진탐색이 선형 탐색보다 빠르기는 하다
- 하지만 이진탐색을 사용하려면 우선 배열을 정렬해야 하는데, 크기 순으로 정렬하는것은 금방 가능한가?
  - 정렬에 대한 복잡도를 생각해 봐야 한다
- 한 번만 탐색하고 말거라면, 굳이 크기 순으로 늘어놓느라 시간을 소모하는 것 보다 한번씩 다 뒤지는 것이 낫지 않은지?

<br>

`실습`

```python
# binary search 구현
def solution(L, x):
    answer = 0
    middle = 0
    start = 0
    cnt = 0
    end = len(L)-1
    if(x not in L):
        return -1
    else:
        while(start <= end):
            middle = (start + end) // 2
            if(L[middle] == x):
                answer = middle
                break
            elif(L[middle] < x):
                start = middle + 1
            elif(L[middle] > x):
                end = middle - 1
        return answer
```

<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}