---
layout: post
title: "조합(Combination)"
subtitle: "조합"
date: 2019-03-25 18:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 조합(Combination)

- 서로 다른 n개의 원소 중 r개를 순서 없이 골라낸 것을 조합이라고 부른다.



![1](C:\Users\student\Desktop\1.PNG)



```python
# an[] : n개의 원소를 가지고 있는 배열
# tr[] : r개의 크기의 배열, 조합이 임시 저장될 배열

def comb(n,r):
    if(r == 0):
        print(tr)
    if(n < r):
        return
   	else:
        tr[r-1] = a[n-1]
        comb(n-1, r-1)
        comb(n-1, r)
tr = [0]*3
a = [1,2,3,4,5]
comb(5, 3)
    
```



### 탐욕 알고리즘(Greedy)

- 최적해를 구하는데 사용되는 근시안적인 방법





#### x, y좌표 정렬

```python
a = [[1,4], [4,2], [2,3], [1,3], [5,1], [3,2]]
a.sort(key-lamda x:X[0]) # 처음을  기준으로 정렬, x좌표 정렬
print(a)
>>> [[1,4], [1,3], [2,3], [3,2], [4,2], [5,1]]
a.sort(key=lamda x:x[1]) # 두번째를 기준으로 정렬하겠다, y좌표 정렬
print(a)
>>> [[5,1], [4,2], [3,2], [2,3], [1,3], [1,4]]
```





