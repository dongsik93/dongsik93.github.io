---
layout: post
title: "DFS"
subtitle: "DFS"
date: 2019-03-26 18:00:00 +0900
categories: algorithm
tags: theory
comments: true
---


## dfs

##### 최소 합

```python
di = [0, 1]
dj = [1, 0]

def dfs(x,y,n):
    if x == n-1 and y ==n-1:
        a.append(visited[x][y])
    for i in range(2):
        dy,dx = y+di[i],x+dj[i]
        # if dy<0 or dx<0 or dx>=n or dy>=n:
        #     continue
        if 0 <= dy and dy < n and 0 <= dx and dx < n:
            if visited[dy][dx] == 0:
                visited[dy][dx] = visited[y][x] + arr[dy][dx]
                dfs(dx,dy,n)
                visited[dy][dx] = 0


T = int(input())

for tc in range(T):
    n = int(input())
    arr = []
    for i in range(n):
        arr.append(list(map(int, input().split())))
    visited = [[0]*n for i in range(n)]
    a = []
    visited[0][0] = arr[0][0]
    dfs(0,0,n)
    print("#{} {}".format(tc+1, min(a)))

```







### 순열



##### n개의 일

```python
def f(n, k, s):
    global minV
    if(n == k): # 모든 짝이 결정되면
        if(s < minV):
            minV = s
    elif(s >= minV): # 백트래킹
        return
    else:
        for i in range(k):
            if(u[i] == 0): # i번 일을 맡을 사람이 아직 없으면
                u[i] = 1 # i번일이 배정되었음을 기록
                f(n+1, k, s+m[n][i]) # n번 사람이 i번일을 하는데 걸리는 시간을 추가, n+1사람의 일을 배정하러 이동
                u[i] = 0 # i번일을 다른 사람에게 배정할 수 있도록 풀어줌


T = int(input())
for tc in range(T):
    k =  int(input())
    m = [list(map(int, input().split())) for i in range(k)]
    u = [0]*k # 배정된 일은 1로 표시
    minV = 10000000
    f(0, k, 0)
    print(minV)
```



##### 전기카트

```python
def find():
    minV = 100000  # 최소값 초기화
    lst = [i for i in range(1, N)]  # 구역은 1에서 N-1번
    p = list(itertools.permutations(lst))  # 순열 생성 후 리스트에 저장
    for i in range(len(p)):  # 순열 개수 만큼 반복
        s = e[0][p[i][0]]  # 사무실-첫 구역간 소비량
        for j in range(1, N - 1):  # 구역간 소비량, N-1구역은 N-2인덱스에 들어있음
            s += e[p[i][j - 1]][p[i][j]]
        s += e[p[i][N - 2]][0]  # 마지막 구역-사무실
        if s < minV:
            minV = s
    return minV


sys.stdin = open('input.txt', 'r')
T = int(input())

for tc in range(1, T + 1):
    N = int(input())
    e = [list(map(int, input().split())) for i in range(N)]  # 사무실 0번, 마지막 구역 N-1번
    print('#{} {}'.format(tc, find()))
```

