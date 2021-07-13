---
layout: post
title: "[Kotlin] 리액티브 프로그래밍 (1)"
subtitle: "Kotlin 리액티브 프로그래밍"
date: 2021-06-07 18:30:00 +0900
categories: til
tags: kotlin android rx
comments: true

---



>본 글은 코틀린 리액티브 프로그래밍을 보고 공부한 내용입니다
>
>[코틀린 리액티브 프로그래밍](http://www.acornpub.co.kr/book/reactive-kotlin){: class="underlineFill"}



## 1. 리액티브 프로그래밍의 소개



### 리액티브 프로그래밍이란 ?

- 데이터 스트림과 변경 사항 전파를 중심으로 하는 비동기 프로그래밍 패러다임

- 리액티브 프로그램의 간단한 동작 예시

```kotlin
fun main(args: Array<String>) {
    var num = 4
    var isEven = isEven(num)
    println("number is $isEven")
    num = 9
    println("number is $isEven")
}

fun isEven(n: Int): Boolean = ((n % 2) == 0)
```

- num에 새로운 값이 할당됐음에도 isEven이 여전히 참이다
- isEven이 num 변수의 변경사항을 추적하도록 설정되었다면 자동으로 false가 됨



### 함수형 리액티브 프로그래밍을 적용해야 하는 이유

- 콜백 지옥의 제거
- 오류 처리를 위한 표준 메커니즘
- 간결해진 스레드의 사용
- 간단한 비동기 연산
- 전체를 위한 하나, 모든 작업에 대해 동일한 API
- 함수형 접근
- 유지보수 가능하고 테스트 가능한 코드



### 리액티브 선언

- 네 가지의 리액티브 원리를 정의해 놓은 문서

- [리액티브 선언](http://www.reactivemanifesto.org)

- #### 응답성(Responsive)

    - 시스템은 즉각 응답해야하며, 응답성있는 시스템은 신속하고 일관성 있는 응답 시간을 유지해 일관된 서비스 품질을 제공한다

- #### 탄력성(Resilient)

    - 시스템에 장애가 발생하더라도 응답성을 유지해야한다
    - 탄력성은 복제(replication), 봉쇄(containment), 격리(isolation), 위임(delegation)에 의해 이루어진다
    - 장애는 각 컴포넌트 내부로 억제돼 각 컴포넌트들을 서로 격리시키는데, 그래서 하나의 컴포넌트에 장애가 발생하더라도 전체 시스템에 영향을 끼치지 못하게 된다

- #### 유연성(Elastic)

    - 리액티브 시스템은 작업량이 변하더라도 그 변화에 대응하고 응답성을 유지해야 한다
    - 리액티브 시스템은 상용 하드웨어 및 소프트웨어 플랫폼에서 효율적인 비용으로 유연성을 확보한다

- #### 메시지 기반(Message driven)

    - 탄력성의 원칙을 지키려면 리액티브 시스템은 비동깆거인 메시지 전달에 의존해 컴포넌트들 간의 경계를 형성해야한다

- 이 네 가지 원칙을 모두 구현함으로써 시스템은 신뢰할 수 있고 응답성 있다고 말할 수 있는, 즉 리액티브 시스템의 특징이다



### RxJava의 푸시 메커니즘과 풀 메커니즘 비교

- RxKotlin은 전통적인 프로그램에서 사용되는 반복자(Iterator) 패턴의 풀 메커니즘 대신 푸시 메커니즘의 데이터/이벤트. 시스템으로 대표되는 **옵저버블 패턴**을 중심으로 작동한다

    >내가 공부했던 디자인 패턴 중 하나
    >
    >[옵저버블 패턴](https://dongsik93.github.io/til/2020/06/06/til-kotlin-designpattern(6))

- ReactiveX의 주요 구성요소는 옵저버블(Observables)이다

- 위에서 본 예제를 리액티브한 방법으로 수정해 보자

```kotlin
fun main(args: Array<String>) {
    var subject: Subject<Int> = PublishSubject.create()
    subject.map {
        isEven(it)
    }.subscribe {
        println("the number is ${(if (it) "Even" else "Odd")}")
    }

    subject.onNext(4)
    subject.onNext(9)
}

fun isEven(n: Int) = (n % 2) == 0
```

- map과 subject라는게 나왔다(책에서는 나중에 설명한다고 함)
- subject에 숫자를 통지하면 map 내의 메서드를 호출하고, 차례대로 메서드의 반환값과 함께 subscribe 내의 함수가 호출되는 구조이다



## 2. 코틀린과 RxKotlin을 사용한 함수형 프로그래밍



### 함수형 프로그래밍이란

- 불변의 데이터를 사용한 수학적인 함수의 평가를 통해 프로그램을 구조화하는 동시에 상태 변화를 방지한다

- 작고 재사용 가능한 선언적인 함수의 사용을 권장하는 선언적인 프로그래밍 패러다임이다

- 함수형 프로그래밍은 람다, 순수함수, 고차함수, 함수유형, 인라인 함수 같은 몇가지 새로운 개념으로 구성된다



#### 람다 표현식

- 람다, 람다식은 일반적으로 이름이 없는 익명 함수를 의미한다

```kotlin
fun main(args: Array<String>) {
    val sum = { x: Int, y: Int ->
        x + y
    } // 람다식 #1
    println("Sum : ${sum(12, 14)}")
    val anonymousMult =  { x: Int ->
        (Random().nextInt(15) + 1) * x
    } // 람다식 #2
    println("random output ${anonymousMult(2)}")
}
```

- 위의 두 람다식은 실제로 함수이면서 이름이 없기 때문에 익명 함수라고도 불린다



#### 순수 함수

- 함수의 반환값이 인수/매개 변수에 전적으로 의존하면 이 함수를 순수 함수라고 한다

```kotlin
fun main(args: Array<String>) {
    println("pure func square = ${square(3)}")
    val qube = { n: Int ->
        n * n * n
    } // #1
    println("lambda pure fun qube = ${qube(3)}")
}

fun square(n: Int) = n*n // #2
```

- #1은 람다, #2는 이름이 있는 함수
- 값 3을 어떤 함수에 n번 전잘하면 매번 동일한 값이 반환되기 때문에 순수함수는 부작용(side effect)이 없다



#### 고차 함수(high-order functions)

- 함수를 인자로 받아들이거나 반환하는 함수를 고차함수라고 부른다

```kotlin
fun main(args: Array<String>) {
    highOrderFunc(12, { a: Int -> isEven(a)})
    highOrderFunc(19, { a: Int -> isEven(a)})
}

fun highOrderFunc(a: Int, validityCheckFunc: (a: Int) -> Boolean) {
    if (validityCheckFunc(a)) {
        println("a $a is Valid")
    } else {
        println("a $a is Invalid")
    }
}
```

- Main 함수 내에서 highOderFunc 함수를 호출하는 시점에 런타임으로 validityCheckFunc 함수를 정의



#### 인라인 함수

- 함수는 이식 가능한 코드를 작성하는 좋은 방법이지만 함수의 스택 유지 관리 및 오버 헤드로 인해 프로그램 실행 시간이 늘어나고 메모리 최적화를 저하시킬 수 있다
- 인라인 함수의 사용을 함수형 프로그래밍에서 이런 난관을 피할 수 있는 좋은 방법이다

```kotlin
fun main(args: Array<String>) {
    for (i in 1..10) {
        println("$i Output  ${doSomeStuff(i)}")
    }
}

inline fun doSomeStuff(a: Int = 0) = a + (a * a)
```

- 함수 정의를 호출할 때마다 그것을 인라인으로 대체할 수 있도록 컴파일러가 지시할 수 있다
- 인라인으로 선언하게되면 함수 호출이 함수 내부의 코드로 교체되는데, 함수 선언으로 얻는 자유는 지키며 동시에 성능도 향상시킬 수 있다



#### 예제

```kotlin
import io.reactivex.subjects.PublishSubject
import io.reactivex.subjects.Subject


/**
 * sample code 1
 */
class ReactiveCalculator(a: Int, b: Int) {
    internal val subjectAdd: Subject<Pair<Int, Int>> = PublishSubject.create()
    internal val subjectSub: Subject<Pair<Int, Int>> = PublishSubject.create()
    internal val subjectMult: Subject<Pair<Int, Int>> = PublishSubject.create()
    internal val subjectDiv: Subject<Pair<Int, Int>> = PublishSubject.create()

    internal val subjectCalc: Subject<ReactiveCalculator> = PublishSubject.create()

    internal var nums: Pair<Int, Int> = 0 to 0


    init {
        nums = Pair(a, b)

        /* add */
        subjectAdd.map({
            it.first + it.second
        }).subscribe({
            println("add = $it")
        })

        /* subtract */
        subjectSub.map({
            it.first - it.second
        }).subscribe({
            println("sub = $it")
        })


        /* multiply */
        subjectMult.map({
            it.first * it.second
        }).subscribe({
            println("mul = $it")
        })


        /* divide */
        subjectDiv.map({
            it.first / (it.second * 1.0)
        }).subscribe({
            println("div = $it")
        })

        subjectCalc.subscribe({
            with(it) {
                calculateAddition()
                calculateSubtractions()
                calculateMultiplication()
                calculateDivision()
            }
        })
        subjectCalc.onNext(this)
    }

    fun calculateAddition() {
        subjectAdd.onNext(nums)
    }

    fun calculateSubtractions() {
        subjectSub.onNext(nums)
    }

    fun calculateMultiplication() {
        subjectMult.onNext(nums)
    }

    fun calculateDivision() {
        subjectDiv.onNext(nums)
    }
}
```

- 위의 예제는 많은 subject와 구독자가 있는데 이를 클래스의 구독자만으로 작업을 끝내는 구조로 수정하고 최적화 할 수 있다

```kotlin
import io.reactivex.subjects.PublishSubject
import io.reactivex.subjects.Subject

/**
 * sample code 2
 */
class ReactiveCalculator(a: Int, b: Int) {
    val subjectCalc: Subject<ReactiveCalculator> = PublishSubject.create()

    var nums: Pair<Int, Int> = 0 to 0


    init {
        nums = Pair(a, b)

        subjectCalc.subscribe({
            with(it) {
                calculateAddition()
                calculateSubtractions()
                calculateMultiplication()
                calculateDivision()
            }
        })
        subjectCalc.onNext(this)
    }

    inline fun calculateAddition() = nums.first + nums.second
    
    inline fun calculateSubtractions() = nums.first - nums.second

    inline fun calculateMultiplication() = nums.first * nums.second

    inline fun calculateDivision() = nums.first / nums.second
}

```



#### 코루틴

- 스레드와 같이 비동기식, 논브로킹 코드를 작성하는 새로운 방법
- 더 간단하고 효율적이며 경량의 솔루션
- 코루틴과 RxKotlin의 스케줄러의 내부 구조가 동일하다

```kotlin
import java.util.concurrent.TimeUnit
import kotlin.system.measureTimeMillis

suspend fun longRunningTsk(): Long {
    val time = measureTimeMillis { 
        println("Wait")
        delay(2, TimeUnit.SECONDS)
        println("Delay  over")
    }
    
    return time
}

fun main(args: Array<String>) {
    // 1
    runBlocking {
        val exeTime = longRunningTsk()
        println("Execution Time is $exeTime")
    }
}
```

- #1
    - longRunningTsk 함수가 완료될 때까지 프로그램을 대기 상태로 만든다
- 코드에 따르면 메인 스레드가 대기하게 되는데, 비동기 작업을 위해서 코드를 수정하면 된다

```kotlin
fun main(args: Array<Sring>) {
    val time = async(CommonPool) { longRunningTsk() }
    println("print after async")
    runBlocking { println("printing time ${time.await()}") }
}
```

- Async 코드블록은 코루틴 컨텍스트에서 비동기적으로 블록 내부의 코드를 실행한다



### 함수형 프로그래밍 : 모나드

> 모나드(Monad)
>
> 순서가 있는 연산을 처리할 때 사용되는 디자인 패턴으로 부작용을 관리하기 위해 함수형 프로그래밍 언어에서 사용된다

- 모나드는 값을 캡슐화하고 추가 기능을 더해 새로운 타입을 생성하는 구조체라고 설명된다

```kotlin
fun main(args: Array<String>) {
    val maybeValue: Maybe<Int> = Maybe.just(14)
    maybeValue.subscribe({
        // onSuccess
        println("Completed with value $it")
    }, {
        // onError
        println("Error $it")
    }, {
        // onComplete
        println("Completed Empty")
    })
    
    val maybeEmpty: Maybe<Int> = Maybe.empty()
    maybeEmpty.subscribe({
        // onSuccess
        println("Completed with value $it")
    }, {
        // onError
        println("Error $it")
    }, {
        // onComplete
        println("Completed Empty")
    })
}
```

- 여기서 `Maybe`는 모나드로서 Int 값을 캡슐화하고 추가 기능을 제공한다
- 모나드인 Maybe는 값을 포함할수도 있고 포함하지 않을 수도 있으며, 값 또는 오류 여부에 관계없이 완료된다
- 그래서 오류가 발생했을 때는 onError가 호출된다
- 여기서 주의해야 할것은 onError, onSuccess, onComplete 세가지 메서드가 모두 터미널 메서드인데 세가지 메서드 중 하나는 모나드에 의해 호출되지만, 다른 것은 호출되지 않음을 의미한다

