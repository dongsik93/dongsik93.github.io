---
layout: post
title: "SW expert 2105 디저트 카페문제-python"
subtitle: "2105.디저트 카페"
date: 2019-07-05 01:00:00 +0900
categories: algorithm
tags: swexpert
comments: true
---

## 2105 디저트 카페



- sw expert 문제



`문제조건`

- 디저트 카페가 2차 배열에 숫자로 주어진다. 각 디저트 카페에서 대각선으로 다른 카페로 이동할 수 있다.
- 대각선 방향으로 움직이고 사각형 모양을 그리며 출발한 카페로 돌아와야 한다.
- 카페 투어 중에 같은 숫자의 디저트를 팔고 있는 카페가 있으면 안 된다.
- 하나의 카페에서 디저트를 먹는 것도 안 된다.
- 왔던 길을 다시 돌아가는 것도 안 된다.


`문제 풀이`

- 어렵다...
- 단순한 bfs문제인줄 알고 bfs로 접근했다가 실패...
- 다음에는 dfs로 4방향 탐색을 위한 반복문으로 해결하려 했으나 시간초과
- 포기하고 예전 강사님이 풀이해주신 코드 참고...ㅠㅠ
    - 사각형만 만들면 되기 때문에 방향을 정한 후 백트래킹으로 풀이




`Code`

```python
di = [1, 1, -1, -1]
dj = [1, -1, -1, 1]

#k는 방향, n은 진행한 칸수
def f(i,j,k,n): 
    global si,sj,maxV
    #출발점에 도착한경우
    if k == 3and i == si and j == sj: 
        if maxV < n:
            maxV = n
    elif i<0 or i>=N or j<0 or j>=N:
        return
    #숫자가 겹친경우
    elif arr[i][j] in U: 
        return
    else:
        U.append(arr[i][j])
        #오른쪽 방향 그대로 가거나 왼쪽으로 꺾었을 경우에
        if k == 0 or k ==1:
            f(i+di[k],j+dj[k],k,n+1)
            #k+1방향
            f(i+di[k+1],j+dj[k+1],k+1,n+1)
        elif k ==2:
            #출발점을 향하는게 아님
            if i+j != si+sj: 
                f(i+di[2], j+dj[2],k,n+1)
            else:
                f(i+di[3],j+dj[3],k+1,n+1)
        #k가 3일때는 직진한다.
        else:
            f(i+di[3],j+dj[3],k,n+1)
 
        U.remove(arr[i][j])
 
 
T = int(input())
for tc in range(T):
    N = int(input())
    arr = []
    for i in range(N):
        arr.append(list(map(int, input().split())))
    maxV = -1
    U = []
    for i in range(N):
        for j in range(1,N-1):
            si = i
            sj = j
            U.append(arr[i][j])
            f(i+1,j+1,0,1)
            U.remove(arr[i][j])
 
    print("#{} {}".format(tc+1, maxV))


```