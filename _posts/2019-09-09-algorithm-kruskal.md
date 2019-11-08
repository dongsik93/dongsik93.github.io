---
layout: post
title: "Python Kruskal"
subtitle: "Kruskal"
date: 2019-09-09 01:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## Python Kruskal Algorithm

### Kruskal 알고리즘이란?

- Greedy를 이용해 그래프의 모든 정점을 최소 비용으로 연결하는 최적 해답을 구하는 것
- MST가 각 단계에서 사이클을 이루지 않는 최소 비용 간선을 선택한다

> #### MST란?
>
> Minimum Spanning Tree = 최소 신장 트리
>
> MST는 간선에 가중치를 고려하여 최소 비용의 Spanning Tree를 선택하는 것을 말한다.

- 그래프의 간선들을 가중치의 오름차순으로 정렬

```python
def solution(n, costs):
    costs.sort()
    connect=[costs[0][0]]
    answer = 0
    while len(connect)!=n:
        temp=1000000000000000
        idx=0
        for i in range(len(costs)):
            if costs[i][0] in connect or costs[i][1] in connect:
                if costs[i][0] in connect and costs[i][1] in connect:
                    continue
                if temp > costs[i][2]:
                    temp=costs[i][2]
                    idx=i
        answer+=temp
        connect.append(costs[idx][0])
        connect.append(costs[idx][1])
        connect=list(set(connect))
        costs.pop(idx)
    return answer
```

1. 0에 연결되어 있는 간선은 0-1(1), 0-2(2) 두 가지 간선이 있다. 최소 비용으로 연결하는 것이 목적이므로 0-1 간선을 선택하고 1의 노드를 연결된 노드 집합에 넣도록 한다. 

2. 0과 1의 노드에 연결되어 있는 간선을 찾도록 하자. 그러면 0-2 (2), 1-2(5), 1-3(1) 세 가지 간선이 존재하게 되고, 역시 최소를 선택하므로 1-3을 선택하게 된다.

3. 위와 같은 방법으로 진행을 하면 0-2 간선을 선택하게 되어 모든 노드들이 연결되게 된다.

- connect라는 연결된 노드 집합을 만들고 이 값이 n과 같게 되면 while이 끝나도록 한다. 
- costs를 반복하여 connect에 있는 노드들의 간선을 찾도록 한다. (단 시점과 종점이 모두 connect에 있으면 안된다.)
- 이 간선들의 최소값을 찾아 answer에 더하고 connect 집합에 노드를 추가시키고 costs에서는 간선을 빼도록 한다. 이 작업을 모든 노드가 connect에 들어갈 때까지 반복한 answer를 반환하면 된다.

참고사이트

- [CodeDrive blog](https://codedrive.tistory.com/164){: class="underlineFill"}
- [Heee's Development Blog : Kruskal 알고리즘이란](https://gmlwjd9405.github.io/2018/08/29/algorithm-kruskal-mst.html){: class="underlineFill"}