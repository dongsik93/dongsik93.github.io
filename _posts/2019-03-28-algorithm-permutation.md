---
layout: post
title: "순열"
subtitle: "순열, 조합"
date: 2019-03-28 18:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 순열



```python
def permutation(order, k, n):
    if k == n: # 단말 노드에 도달한 경우
        print_order_arry(order, n)
    else:
        check = [False]*n # 현재 방문중인 노드에 도달하기 까지 어떤 선택을 했는지 조사하기 위해
        for i in range(k): # order리스트에는 k개 만큼 선택한 내용이 저장, 원소들에 대한 index값이 저장되어 잇음
            check[order[i]] = True
        
        for i in range(n): # 원소의 수만큼 체크리스트를 조사
            if(check[i] == False): # False면 선택되지 않은것
                order[k] = i
                permutation(order, k+1, n) # 재귀호출
```



#### 중복없는 순열(boj- 15649 // n과m 1번)

```python
def dfs(index, n, m):
    if(index == m):
        for i in range(m):
            print(ans[i], end=" ")
        print()
        return
    else:
        for i in range(n):
            if(visited[i] == 0):
                visited[i] = 1
                ans[index] = i + 1
                dfs(index+1, n, m)
                visited[i] = 0

n, m = map(int, input().split())

ans = [0 for i in range(8)]
visited = [0 for i in range(8)]
dfs(0, n, m)
```

##### itertools

```python
import itertools
a, b = map(int, input().split())
for i in itertools.permutations(range(1, a+1), b):
	print(*i)
```



#### 중복있는 순열(boj-15651 // n과m 3번)

```python
def dfs(index):
    if(index == m):
        for i in range(m):
            print(visited[i], end=" ")
        print()
        return
    else:
        for i in range(1,n+1):
            visited[index] = i
            dfs(index+1)

n, m = map(int, input().split())

visited = [0 for i in range(8)]
dfs(0)
```

##### itertools

```python
import itertools
a, b = map(int, input().split())
for i in itertools.product(range(1, a+1), repeat=b):
	print(*i)
```



#### 중복없는 조합(boj-15650 // n과m 2번)

```python
def dfs(index):
    if(index == m):
        if(check(ans) == 1):
            for i in range(m):
                print(ans[i], end=" ")
            print()
        return
    else:
        for i in range(n):
            if(visited[i] == 0):
                visited[i] = 1
                ans[index] = i + 1
                dfs(index+1)
                visited[i] = 0

def check(answer):
    for i in range(m-1):
        if answer[i+1] < answer[i]:
            return 0
    return 1

n, m = map(int, input().split())

ans = [0 for i in range(8)]
visited = [0 for i in range(8)]
dfs(0)
```

##### itertools

```python
import itertools
a, b = map(int, input().split())
for i in itertools.combinations(range(1, a+1), b):
	print(*i)
```



#### 중복있는 조합(boj-15652 // n과m 4번)

```python
def dfs(index):
    if(index == m):
        if(check(visited) == 1):
            for i in range(m):
                print(visited[i], end=" ")
            print()
        return
    else:
        for i in range(1,n+1):
            visited[index] = i
            dfs(index+1)

def check(answer):
    for i in range(m-1):
        if answer[i+1] < answer[i]:
            return 0
    return 1

n, m = map(int, input().split())

visited = [0 for i in range(8)]
dfs(0)
```

##### itertools

```python
import itertools
a, b = map(int, intpu().split())
for i in itertools.combinations_with_replacement(range(1, a+1), b):
	print(*i)
```



##### d3-5209(최소일의 합)

```python
def per(index,n,s):
    global minV
    if(index == n):
        if(s < minV):
            minV = s
    elif (s >= minV):  # 백트래킹
        return
    for i in range(n):
        if(check[i] == 0):
            check[i] = 1
            per(index+1, n, s+arr[index][i])
            check[i] = 0

T = int(input())

for tc in range(T):
    n = int(input())
    arr = []
    s = 0
    check = [0 for i in range(n)]
    for i in range(n):
        arr.append(list(map(int, input().split())))
    minV = 10000000
    per(0, n, s)
    print("#{} {}".format(tc+1, minV))
```



##### d3-5208(전기버스2)

```python
def f(n,k,e,c):
    global minV
    if(n == k):
        if(c < minV):
            minV = c
        return
    elif(c >= minV):
        return
    else:
        if(e>0):
            f(n+1, k, e-1, c)
        f(n+1, k, a[n]-1, c+1)

T = int(input())

for tc in range(T):
    a = list(map(int, input().split()))
    cnt = 0
    minV = len(a)
    f(1, a[0], a[1], cnt)
    print("#{} {}".format(tc+1, minV))
```



##### d3-1865(동철이의 일 분배)

```python
def per(index, n, s):
    global maxV
    if(index == n):
        if(s > maxV):
            maxV = s
    elif(s <= maxV):
        return
    for i in range(n):
        if(check[i] == 0):
            check[i] = 1
            per(index+1, n, s*arr[index][i])
            check[i] = 0

T = int(input())

for tc in range(T):
    n = int(input())
    arr = []
    check = [0 for i in range(n)]
    arr = [[0] * n for i in range(n)]

    for i in range(n):
        a = list(map(int, input().split()))
        for j in range(n):
            arr[i][j] = a[j] / 100

    maxV = 0
    per(0, n, 1)
    maxV = maxV * 100
    print("#{}".format(tc+1), end=" ")
    print(format(round(maxV,6),"0.6f"))

```



