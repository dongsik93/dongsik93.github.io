---
layout: post
title: "Python 사용자 모듈"
subtitle: "python"
date: 2019-01-10 16:00:00 +0900
categories: til
tags: python
comments: true
---

## Python 사용자 모듈

실행순서

- 위에서부터(top-level) 실행

```python
# __name__  ? :  파이썬 스크립트를 그래도 실행했을 때 모듈로써 실행하고있는건지, 아니면 python.py로 실행하고 있는지를 판단
if(__name__ == "__main__"):
    print("a.py를 직접 실행")
else:
    print("import a.py")
```

- top-level에 print() 가 찍혀있으면 import하면 출력됨

`top-level` = indent가 적용되지 않은 모든 code
