---
layout: post
title: "SW expert 4012 요리사문제-python"
subtitle: "4012.요리사"
date: 2019-07-04 18:00:00 +0900
categories: algorithm
tags: swexpert
comments: true
---

## 4012. 요리사



- SW Expert 문제



`문제 조건`

- 두 명의 손님은 최대한 비슷한 맛의 음식을 만들어야 한다
- N개의 식재료가 있고 식재료들을 반으로 분류해 두 개의 요리를 한다
- 비슷한 맛의 음식을 만들기위해서는 두 음식 각각 맛의 차이가 최소가 되도록 재료를 분배한다



`문제 풀이 방법`

- 각 음식별로 재료를 반으로 나누고, 각각의 재료의 시너지 값을 구한 후, 시너지 값의 차가 가작 적은 수를 리턴
- 조합을 사용



`Code`

```python
import itertools

def cal(arr, a, b):
    return arr[int(a)][int(b)]

T = int(input())

for tc in range(T):
    n = int(input())
    arr = []
    for i in range(n):
        arr.append(list(map(int, input().split())))
    # 한번에 계산한기 위해 값 모아두기
    for i in range(n):
        for j in range(n):
            if j > i:
                arr[i][j] = arr[i][j] + arr[j][i]
                arr[j][i] = 0
    
    combis = itertools.combinations(range(n), n//2)
    minv = 99999999
    
    
    for combi in combis:
        sum_a = 0
        sum_b = 0
        # a, b로 나누기
        a = set(list(combi))
        b = list(set(range(n))-a)

        a = list(a)
        af = itertools.combinations(a,2)
        for coma in af:
            sum_a += cal(arr, coma[0], coma[1])

        bf = itertools.combinations(b,2)
        for comb in bf:
            sum_b += cal(arr, comb[0], comb[1])

        if(abs(sum_a -  sum_b) <  minv):
            minv = abs(sum_a - sum_b)

    print("#{} {}".format(tc+1,minv))
```

