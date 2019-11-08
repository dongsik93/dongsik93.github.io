---
layout: post
title: "자료구조와 알고리즘 13강"
subtitle: "자료구조와 알고리즘 13강"
date: 2019-09-25 21:00:00 +0900
categories: algorithm
tags: theory
comments: true
---

## 13강: 후위 표기 수식 계산

#### 후위 표기법 수식의 계산

- 수식을 왼쪽부터 시작해서 오른쪽으로 차례대로 읽어드리면서
- 피연산자가 나타나면, 스택에 넣어준다
- 연산자가 나타나면, 스택에 들어있는 피연산자를 두 개 꺼내어 연산을 적용하고, 그 결과를 다시 스택에 넣어둔다
- 위 과정을 반복하면 마지막에 모든 연산이 적용된 결과가 스택에 유일하게 남아 있게 된다.



`A B + C D + *` 의 계산과정 ==  (A + B) * (C + D)

1. `A` 는 피연산자 이므로 스택에 넣는다
   - 현재 스택 상황 : A 
2. `B` 는 피연산자 이므로 스택에 넣는다
   - 현재 스택 상황 : A // B
3. `+` 는 연산자 이므로 스택에서 피연산자 두 개를 꺼내어 연산하고, 그 결과를 스택에 넣는다
   - 현재 스택상황 : A + B
4. `C` 는 피연산자 이므로 스택에 넣는다
   - 현재 스택 상황 : A + B // C
5. `D` 는 피연산자 이므로 스택에 넣는다
   - 현재 스택 상황 : A + B // C // D
6. `+` 는 연산자 이므로 스택에서 피연산자 두 개를 꺼내어 연산하고, 그 결과를 스택에 넣는다
   - 현재 스택 상황 : A + B // C + D
7. `*` 는 연산자 이므로 스택에서 피연산자 두 개를 꺼내어 연산하고, 그 결과를 스택에 넣는다
   - 현재 스택 상황 : (A+B) * (C + D)
8. 수식이 끝났기 때문에 스택에 남아있는 최종 연산 결과를 꺼낸다

<br>

- ##### 피연산자를 꺼낼 때 주의할 점

  - 뺄셈이나 나눗셈은 피연산자의 순서가 중요하기 때문에 이를 주의해야 한다

<br>

#### 알고리즘의 설계

- 후위 표현식을 왼쪽부터 한 글자씩 읽어서
  - 피연산자이면 스택에 push
  - 연산자를 만나면 스택에서 pop, pop해서 결과를 스택에 Push
- 수식의 끝에 도달하면
  - 스택에서 pop하면 계산 결과

<br>

`실습`

```python
class ArrayStack:

    def __init__(self):
        self.data = []

    def size(self):
        return len(self.data)

    def isEmpty(self):
        return self.size() == 0

    def push(self, item):
        self.data.append(item)

    def pop(self):
        return self.data.pop()

    def peek(self):
        return self.data[-1]

import string

def splitTokens(exprStr):
    tokens = []
    val = 0
    valProcessing = False
    for c in exprStr:
        if c == ' ':
            continue
        if c in string.digits:
            val = val * 10 + int(c)
            valProcessing = True
        else:
            if valProcessing:
                tokens.append(val)
                val = 0
            valProcessing = False
            tokens.append(c)
    if valProcessing:
        tokens.append(val)

    return tokens


def infixToPostfix(tokenList):
    prec = {
        '*': 3,
        '/': 3,
        '+': 2,
        '-': 2,
        '(': 1,
    }
    check = [")","(","+","-","*","/"]
    opStack = ArrayStack()
    postfixList = []
    for i in tokenList:
        if(str(i) not in check):
            postfixList.append(i)
        else:
            if(i == "("):
                opStack.push(i)
            elif(i == ")"):
                item = None
                while(not opStack.isEmpty()):
                    item = opStack.pop()
                    if(item == "("):
                        break
                    else:
                        postfixList.append(item)
            else:
                if(opStack.isEmpty()):
                    opStack.push(i)
                else:
                    item = opStack.peek()
                    if(prec[item] >= prec[i]):
                        while(not opStack.isEmpty()):
                            item = opStack.pop()
                            postfixList.append(item)
                        opStack.push(i)
                    else:
                        opStack.push(i)
                        
    while(not opStack.isEmpty()):
        item = opStack.pop()
        postfixList.append(item)          

    return postfixList


def postfixEval(tokenList):
    opStack = ArrayStack()
    check = [")","(","+","-","*","/"]
    for i in tokenList:
        if(str(i) not in check):
            opStack.push(i)
        else:
            pop_two = opStack.pop()
            pop_one = opStack.pop()
            if(i == "+"):
                opStack.push(pop_one + pop_two)
            elif(i == "*"):
                opStack.push(pop_one * pop_two)
            elif(i == "/"):
                opStack.push(pop_one / pop_two)
            else:
                opStack.push(pop_one - pop_two)
            
    result = opStack.pop()
    return result

def solution(expr):
    tokens = splitTokens(expr)
    postfix = infixToPostfix(tokens)
    val = postfixEval(postfix)
    return val
```

- `splitTokens()` : 피연산자와 연산자를 나누어 주는 함수
- `infixToPostfix()` : 후위 표기법으로 변환하여 리스트로 리턴
- `postfixEval()` : 후위 표기법으로된 연산을 처리

##### eval()

- Python에는 `eval()` 이라는 built-in 함수가 있는데, 이 함수에 문자열을 인자로 전달하면, 그 문자열을 그대로 Python 표현식으로 간주하고 계산한 결과를 리턴하도록 되어있다. 
- 이 built-in 함수 `eval()` 을 이용하면 `postfixEval()` 함수 없이 정답이 나온다





<br>

본 문서는 프로그래머스 *어서와! 자료구조와 알고리즘* 강의를 수강하고 정리했습니다.

출처 : [프로그래머스 : 어서와! 자료구조와 알고리즘은 처음이지?](https://programmers.co.kr/learn/courses/57){: class="underlineFill"}