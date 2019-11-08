---
layout: post
title: "SW expert 1949 등산로 조성문제-python"
subtitle: "1949.등산로 조성"
date: 2019-07-04 21:00:00 +0900
categories: algorithm
tags: swexpert
comments: true
---

## 1949. 등산로 조성



- sw expert 문제



`문제조건`

- 가장 높은 봉우리에서 시작한다.
- 등산로는  산으로 올라갈 수 있도록 반드시 높은 지형에서 낮은지형으로 가로 또는 세로 방향으로 연결되어야 한다.
- 딱 한곳을 정해서 최대  K깊이 만큼 지형을 깎을 수 있다.



`문제 풀이`

- 가장 높은 봉우리 저장
- 방문표시 할 배열 생성
- dfs를 통해 해결
  - 안깎고 이동할 때와 깎고 이동할 때
  - 깎을 때 1만큼 작은 값 설정 : 최대한 이동하기 위해  다음 이동 칸이 최대한 높게 깎아야 하므로



`code`

```python
def dfs(y,x,cnt,k,n):
    global res
    if(res < cnt+1):
        res = cnt+1
    visited[y][x] = 1
    dx = [0,1,0,-1]
    dy = [1,0,-1,0]
    for i in range(4):
        ny = y + dy[i]
        nx = x + dx[i]
        if(ny>=0 and ny<n and nx>=0 and nx<n):
            if(visited[ny][nx] == 0):
                # 안깎고 이동이 가능할 때
                if(arr[ny][nx] < arr[y][x]):
                    dfs(ny,nx,cnt+1,k,n)
                # 깎고 이동할 때
                elif(arr[ny][nx]-k < arr[y][x]):
                    # 값 저장
                    pre = arr[ny][nx]
                    # 깎고
                    arr[ny][nx] = arr[y][x] -1
                    dfs(ny,nx,cnt+1,0,n)
                    # 값 복귀
                    arr[ny][nx] = pre
    visited[y][x] = 0

T = int(input())

for tc in range(T):
    n, k = map(int, input().split())

    arr = []
    for i in range(n):
        arr.append(list(map(int, input().split())))
    
    res = 0
    maxV = 0
    visited = [[0]*n for i in range(n)]
    for i in range(n):
        for j in range(n):
            if(maxV < arr[i][j]):
                maxV  = max(maxV, arr[i][j])
    v = []
    for i in range(n):
        for j in range(n):
            if(arr[i][j] == maxV):
                v.append([i,j])
    for i in range(len(v)):
        dfs(v[i][0], v[i][1], 0, k, n)
    
    print("#{} {}".format(tc+1, res))
```

