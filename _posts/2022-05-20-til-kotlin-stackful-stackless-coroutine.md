---
layout: post
title: "[Kotlin] Stackful / Stackless Coroutine"
subtitle: "Stackful? Stackless?"
date: 2022-05-20 18:00:00 +0900
categories: til
tags: kotlin coroutine
comments: true


---



# [Kotlin] Stackful, Stackless Coroutine



Stackful? Stackless?

Coroutine은 Kotlin에서 처음 나온 개념이 아니다 (C#, Python, JavaScript, Kotlin등 지원)

```
It's not important to know the the distinction to be able to use coroutines in Kotlin.
```

[StackOverFlow 질문 / 답변](https://stackoverflow.com/questions/71497845/whats-difference-between-stackless-and-stackfull-coroutines-in-kotlinandroid){: class="underlineFill"}

Coroutine을 사용하는데 있어서 Stackful / Stackless를 구분하는것은 중요하지 않다고하지만 궁금하기 때문에 한번 간략하게 알아보자



## Stackless Coroutine

말 그대로 스택이 없다는 의미이며 stackless coroutine 은 **resumable functions** 라고 불린다

스택이 없다면 스택에 저장되어야 할 데이터는 어디로 가며, 어떻게 동작하는거지?라는 의문이 생기는데, Kotlin의 Coroutine은 **호출자의 스택을 사용** 한다

Stackless Coroutine의 특징은 아래와 같은데

- **Coroutine은 호출자(caller)와 강하게 연결**되어 있다
- Coroutine에 대한 호출은 실행을 coroutine으로 전송하고 coroutine에서 양보(yield)하는 것은 호출자에게 돌아온다
- Stackful Coroutine은 스택의 수명만큼 유지 되지만, Stackless Coroutine은 객체의 수명만큼 유지된다

Stackless Coroutine의 경우 전체 스택을 할당할 필요가 없기 때문에 **훨씬적은 메모리**를 요구하지만, 그 때문에 몇가지 제약사항이 생긴다

**Stackless Coroutine은 최상위 레벨(top-level) 함수에서만 스스로를 중단(suspend) 할 수 있다**

coroutine의 중단 및 재개에서 기억해야 할 데이터가 훨씬 적지만 coroutine은 최상위 레벨 함수에서만 일시 중단하고 자신을 반환 할 수 있다. 모든 함수 및 coroutine 호출은 동일한 방식으로 발생하지만 coroutine의 경우 일부 추가 데이터를 호출에서 보존해야 중단 지점으로 이동하고 지역 변수의 상태를 복원하는 방법을 알 수 있다. 게다가 함수 프레임과 coroutine 프레임 사이에는 차이가 없다

일반적인 함수의 경우, 데이터가 호출 수신자 스택에 할당되기 때문에 coroutine에서 호출 된 모든 함수는 coroutine이 중단되기 전에 완료되어야 한다. coroutine이 상태를 유지하는 데 필요한 모든 데이터는 heap 메모리에 동적으로 할당된다. 이것은 일반적으로 미리 할당 된 전체 스택보다 크기가 훨씬 작은 두 개의 지역 변수와 인수를 사용한다

coroutine은 다른 coroutine을 호출 할 수도 있다. stackless coroutine의 경우, 하나에 대한 각 호출이 새로운 coroutine 데이터를 위한 새로운 공간을 할당하게 된다. (coroutine에 대한 여러 호출은 다양한 동적 메모리 할당을 유발할 수 있음)





## Stackful Coroutine

Stackless와는 반대로 함수 호출시에 사용되는 분리된 스택을 가지고 있다. 그렇기 때문에 Stackful Coroutine은 **자신만의 스택**을 가지고있으며, stackful coroutine의 **수명은 호출한 코드로부터 독립적**이다

Stackful Coroutine이 실행되면 호출 된 함수는 이전에 할당 된 스택을 사용하여 인수와 지역 변수를 저장한다. 함수 호출은 stackful coroutine에 대한 모든 정보를 스택에 저장하기 때문에 coroutine에서 호출되는 모든 함수들의 실행을 중단 할 수 있다

간단하게 정리해보면

Stackless Coroutine은 호출을 위로(caller), Stackful Coroutine은 호출을 아래로 보낸다고 보면 된다

Kotlin의 Coroutine이 **Light-weight thread**라는 의미도 coroutine이 자신만의 스택을 갖지 않는 Stackless Coroutine이라는 의미인것 같다





### 참고사이트

- [Stackful 과. Stackless 코루틴의 차이](https://www.charlezz.com/?p=44635){: class="underlineFill"}
- [Coroutine vs. thread (Light-weight thread 가 뭔말이야](https://aroundck.tistory.com/5797){: class="underlineFill"}
- [Stackful/Stackless 코루틴](https://medium.com/@jooyunghan/stackful-stackless-%EC%BD%94%EB%A3%A8%ED%8B%B4-4da83b8dd03e){: class="underlineFill"}

