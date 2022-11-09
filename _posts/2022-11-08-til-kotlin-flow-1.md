---
layout: post
title: "[Kotlin] Flow (1) - Flow 기초"
subtitle: "Flow 기본 사항"
date: 2022-11-08 12:00:00 +0900
categories: til
tags: kotlin flow
comments: true


---



# [Kotlin] Flow (1) - Flow 기초



> Flow에 대해서 알아보자



### Flow란?

- 순차적으로 값을 내보내고 정상적으로 또는 예외로 완료되는 비동기적인 데이터 스트림이다



### Flow Cold

- Flow는 기본적으로 `Cold Stream` 이다
- 즉, Flow { } 빌더의 코드블럭은 Flow가 **collect되기 전까지 실행되지 않는다는 것**을 의미한다

> Rx의 Cold Observable 개념과 유사
>
> Rx에서는 Subscribe할 때 아이템을 흘려보낸다

- 일반적으로는 Cold Stream 이지만 `SharedFlow` 하위 타입은 Hot Stream을 나타낸다



### Flow Builder

- `flowOf(..)` 사용

    - 고정된 값 집합에서 flow를 생성한다

    ```kotlin
    flowOf(1,2,3).collect { value -> println(value) }
    ```

- `asFlow()` 사용

    - 다양한 타입에 대해서 asFlow() 익스텐션 함수를 사용해서 flow로 변환한다

    ```kotlin
    /* 1~3까지의 출력 */  
    (1..3).asFlow().collect { value -> println(value) }
    ```

- `flow { ... }` 사용

    - 빌더 함수로 순차적 호출에서 `emit` 함수로 임의의 flow를 구성한다

    ```kotlin
    flow {
        (0..10).forEach { emit(it) }
    }.collect { value -> println(value) }
    ```

- `channelFlow { ... }` 사용

    - 빌더 함수를 통해 잠재적으로 동시 호출에서 send 함수로의 임의의 flow를 구성한다

    ```kotlin
    channelFlow {
        (0..10).forEach { send(it) }
    }.collect { value -> println(value) }
    ```

- `MutableStateFlow` / `MutableSharedFlow`

    - 해당 생성자 함수를 정의하여 직접 업데이트 할 수 있는 Hot flow를 생성한다

    ```kotlin
    val stateFlow = MutableStateFlow<Int>(0)
    val sharedFlow = MutableSharedFlow<Int>()
    
    stateFlow.send(1)
    sharedFlow.send(1)
    ```



### Flow constraints

- Flow 인터페이스의 모든 구현은 두 가지 주요 속성을 준수해야 한다

1. `Context preservation`

    - flow로 만들어진 collection은 항상 이를 호출한 `coroutine context`에서 수행되며 이를 **Context preservation** 이라고 한다
    - 자제척으로 실행하는 context를 캡슐화하고 다운스트림에서 전파하거나 누출하지 않으므로 특정 변환 또는 터미널 연산자의 실행 context에 대한 판단을 간단하게 만든다

    ```kotlin
    fun main() = runBlocking {
        test().collect { 
    				value -> println("Collected ${Thread.currentThread().name} $value") 
    		}
    }
    
    fun test() = flow {
        println("Start flow ${Thread.currentThread().name}")
        for (i in 1..3) { emit(i) }
    }
    ```

    - 위의 예처럼 collect()를 호출한 부분의 context는 main thread를 사용하고 있기 때문에 flow body 영역의 코드 역시 main thread에서 처리된다
    - flow  body 부분의 context를 바꿔줄려면 `flowOn` 이라는 operator를 사용해야 한다

    ```kotlin
    fun main() = runBlocking {
        test().collect { 
    				value -> println("Collected ${Thread.currentThread().name} $value") 
    		}
    }
    
    fun test() = flow {
        println("Start flow ${Thread.currentThread().name}")
        for (i in 1..3) { emit(i) }
    }.flowOn(Dispatchers.Default) // change context
    ```

2. `Exception transparency`

    - flow 구현에 있어서 `exception` 에 투명해야 한다
    - 이에 따라서 `flow { ... }` 빌더를 `try / catch` 블럭 안에서 사용해서 값을 emit하는 것은 exception에 투명하지 못한 행위이다
    - 즉, `exception` 에 투명하다는 말은 다운스트림에서 발생한 에러르 미리 처리하여 collector가 알 수 없게끔 되어서는 안된다는 의미이다
    - 에러가 나더라도 어떤 형태로는 collector가 알아차릴수 있어야 한다

    ```kotlin
    flow { emitData() } 
        .map { computeOne(it) } 
        .catch {...} // emitData 및 computeOne에서 예외 포착 
        .map { computeTwo(it) } 
        .collect { process(it) } // 다음에서 예외 발생 처리 및 computeTwo
    ```



### Reactive streams

- Flow는 Reactive Stream과 호환이 가능하다
- `Flow.asPublisher` , `Publisher.asFlow` 를 사용해서 `kotlin-coroutines-reactive` 모듈의 리엑티브 스트림과 안전하게 상호 작용할 수 있다
- [Coroutine 1.5.0버전](https://blog.jetbrains.com/kotlin/2021/05/kotlin-coroutines-1-5-0-released/#use-coroutines-1-5-0){: class="underlineFill"}  출시에 따라서 Observable, flux 등의 reactive stream과 coroutine의 안정적인 변환을 위한 함수들이 추가되었다





#### 참고사이트

- [Kotlin - Coroutine Flow](https://medium.com/hongbeomi-dev/kotlin-coroutine-flow-ac07cfdca42d){: class="underlineFill"}
- [[kotlin] 코틀린 - 코루틴#10 - Asynchronous Flow (1/2)](https://tourspace.tistory.com/258){: class="underlineFill"}