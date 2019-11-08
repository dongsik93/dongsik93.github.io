---
layout: post
title: "BFS"
subtitle: "BFS-미로찾기"
date: 2019-03-05 18:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## bfs



#### 미로크기 

```python
# 2차원 배열의 bfs는 대부분 동일한 코드
## 코드를 말로 풀어서 이해하기
### 24번의 if조건만 다르게 해서 나옴
def bfs(i, j, n):
    # 인접칸 조사를 위한 델타
    di = [0,1,0,-1]
    dj = [1,0,-1,0]

    q = [] # 큐생성
    visited = [[0]*n for i in range(n)] # n개의 0으로 초기화
    q.append(i) # 시작점 인큐
    q.append(j)
    visited[i][j] = 1 # (인큐와 visited를 묶어서) 시작점에 방문 표시
    while(len(q) != 0): # 큐가 비어있지 않으면
        i = q.pop(0) # 디큐 (맨 앞에서 꺼내는 거니까)
        j = q.pop(0) 
        # pop한애가 처리할 위치
        if(maze[i][j] == 3): # 목적지이면 디큐한 칸 처리 
            return (visited[i][j] - 2)
        for k in range(4): # 인접한 4방항에 대해서
            ni = i + di[k]
            nj = j + dj[k]
            if(ni >=0 and ni < n and nj >=0 and nj < n): # 미로를 벗어나지 않으면
                if(maze[ni][nj] != 1 and visited[ni][nj] == 0): # 벽이 아니고, 방문하지 않았으면
                    # 큐에 넣는다
                    q.append(ni)
                    q.append(nj)
                    visited[ni][nj] = visited[i][j] + 1
    return 0
                
    



T = int(input())

for tc in range(T):
    n = int(input())
    maze = [ [int(x) for x in input()] for i in range(n)]
    for i in range(n):
        for 2 in maze[i]:
            sRow = i
            sCol = maze[i].index(2)
    
    print("#{} {}".format(tc+1, bfs(sRow, sCol, n)))
```



#### 노드사이의 거리

```python
# visited안에 거리정보다 들어가도록
## 인접행렬
def bfs(s, g, v):
    # 1.큐생성
    q = []
    # 2.visited
    visited = [0]*(v+1)
    # 3.시작점 인큐
    q.append(s)
    # 4.시작점 방문 표시
    visited[s] = 1
    while(len(q) != 0): # 큐가 비어있지 않으면
        n = q.pop(0) # 디큐
        if(n == g): # 목적지에 도달하면
            return visited[g] -1 
        for i in range(1, v+1): # 모든 노드에 대해
            if(adj[n][i] != 0 and visited[i] == 0): # n에 인접이고, 미방문이면
                q.append(i) # 인큐
                visited[i] = visited[n] + 1
    return 0         
                            
T = int(input())
for tc in range(T):
    v, e = map(int, input().split())
    adj = [ [0]*(v+1) for i in range(v+1)]
    for i in range(e):
        n1, n2 = list(map(int, input().split()))
        # 방향성이 없기 때문에 1,3이 연결되면 (1,3) / (3,1) 둘다 1 저장
        adj[n1][n2] = 1
        adj[n2][n1] = 1 
    s, g = map(int, input().split())
    
    print("#{} {}".format(tc+1, bfs(s,g,v)))
    
```



#### 숨바꼭질

```python
def bfs(x, k):
    # 1~4 초기화
    # 1. 큐생성
    q = []
    # 2. visited생성
    visited = [0]*(100001)
    # 3. 인큐
    q.append(x)
    # 4. 시작점 방문 표시
    visited[x] = 1
    while(len(q) != 0):
        x = q.pop(0)
        if(x == k):
            return (visited[k] -1)
        # x-1이 인접이면서 방문하지 않았을 경우 // 무조건 x-1의 인접 확인이  앞에와야함
        if(x-1 >= 0 and visited[x-1] == 0):
            q.append(x-1)
            visited[x-1] = visited[x] + 1
        # x+1이 인접인 경우
        if(x+1 <= 100000 and visited[x+1] == 0):
            q.append(x+1)
            visited[x+1] = visited[x] + 1
        # 2*x 가 인접인 경우
        if(2*x <= 100000 and visited[2*x] == 0):
            q.append(2*x)
            visited[2*x] = visited[x] + 1
    return 0

# x, k = map(int, input().split())
x = 5
k = 17
print(bfs(x, k))
```