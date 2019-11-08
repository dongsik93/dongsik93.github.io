---
layout: post
title: "자료구조와 알고리즘 4, 5강"
subtitle: "자료구조와 알고리즘 4,5강"
date: 2019-09-15 19:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 4강: 재귀 알고리즘(recursive algorithms) 기초  //5강: 재귀 알고리즘 응용

### 재귀 알고리즘이란?

- 재귀 알고리즘이라고 불리는 것들이 있는데 이것은 알고리즘 이름이 아닌 성질이다
- 주어진 문제가 있을 때 이것을 같은 종류의 보다 쉬운 문제의 답을 이용해서 풀 수 있는 성질을 이용해서, 같은 알고리즘을 반복적으로 적용함으로써 풀어내는 방법
- 하나의 함수에서 **_자신을 다시 호출_**하여 작업을 수행하는 것
- 생각보다 많은 종류의 문제들이 재귀적(recursively)으로 풀린다

```python
# 예제 1
## 1부터 n까지 모든 자연수의 합을 구하시오
def sum(n):
  ### 재귀 호출의 종결 조건
  if(n == 1):
    return n
  else:
  	return n + sum(n-1)
```

- 알고리즘의 `종결 조건`이 반드시 필요
- 효율은 어떠한가 ?

```python
# 예제 1을 재귀가 아닌 반복문
def sum(n):
  s = 0
  while(n >= 0):
    s+= n
    n-= 1
   return s
```

- 복잡도 측면
  - 재귀함수 : _O_(n)
  - 반복문 : _O_(n)
  - 동일하다
- 효율적 측면
  - 효율적인 측면에서는 조심해야 함

`실습`

```python
# 피보나치 순열 구현
## 재귀
def solution(x):
    if(x < 2):
        return x
    else:
        return solution(x-1) + solution(x-2)
```



## 5강: 재귀 알고리즘 응용

### 재귀 알고리즘의 효율

- 피보나치 수열의 경우 f(0)과 f(1)이 계속 호출되어 나타난다
- 성능상으로 좋지 않다

### 조합의 수 계산

- _n_개의 서로 다른 원소에게서 _m_개를 택하는 경우의 수

```python
# 조합 예
def combi(n, m):
  if(n == m):
    return 1
  elif(m == 0):
    return 1
  else:
    return combi(n-1, m) + combi(n-1, m-1)
```

- 위의 예는 효율성 측면에서 좋나?
  - 두번씩 호출하고 있기 때문에 n이 커지면 많이 호출하기 때문에 비효율 적이다

`실습`

```python
# 재귀적 이진 탐색

def solution(L, x, l, u):
    if l > u:
        return -1
    mid = (l + u) // 2
    if x == L[mid]:
        return mid
    elif x < L[mid]:
        return solution(L,x,l,mid-1)
    else:
        return solution(L,x,mid+1,u)
```

<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}