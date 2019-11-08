---
layout: post
title: "미로찾기"
subtitle: "백트래킹-미로찾기"
date: 2019-03-04 18:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 미로찾기

- 재귀를 이용한 백트래킹
- dfs



##### 재귀를 이용한 백트래킹

- 각 방향에 대한 현재 위치가 i, j일때 벽이 아니면서 아직 지나가지 않은 칸이면  이동



```python
def func(i, j, n): # 델타를 사용하는 방법
    # 리턴하는 경우는
    # 목적지에 도착한 경우
    di = [0, 1, 0, -1]
    dj = [1, 0, -1, 0]
    if(maze[i][j] == 3): # 목적지에 도착한 경우
        return 1
    else:
        maze[i][j] = 1 # 방문한 칸으로 미로에 직접 표시
        for k in range(4): # 주변 칸의 좌표 계산
            ni = i + di[k]
            nj = j + dj[k]
            if(ni >= 0 and ni < n and nj >= 0 and nj < n): # 미로를 벗어나지 않으면
                if(maze[ni][nj] != 1): # ni, nj가 칸이 벽이 아니면 이동 ( 통로가 아니면으로 하면 안됨 )
                    r = func(ni, nj, n)
                    if( r == 1): # 목적지에 도착한 경우
                        return 1
        return 0 # 가능한 모든 방향에서 목적지를 찾지 못하면


T = int(input())

for tc in range(T):
    n = int(input())
    maze = [list(map(int,input())) for i in range(n)] # 문자열로 저장하는 경우 방문표기 배열 필요
    startI = -1
    startJ = -1
    for i in range(n):
        for j in range(n):
            if(maze[i][j] == 2):
                startI = i
                startJ = j
                break
        if(startI != -1):
            break
    print('#{} {}'.format(tc+1, func(startI, startJ, n)))

    
```



### BFS(너비우선탐색)

- 탐색 시작점의 인접한 정점들은 먼저 모두 차례로 방문한 후에, 방문했던 정점을 시작점으로 하여 다시 인접한 정점들을 차례로 방문하는 방식
- 인접한 정점들에 대해 탐색을 한 수, 차례로 다시 너비우선탐색을 진행해야 하므로, 선입선출 형태의 자료구조인 큐를 활용한다.
- 큐에서 거리 e인 칸을 꺼내서 거리 e인 칸을 조사한다. 