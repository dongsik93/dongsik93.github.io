---
layout: post
title: "[Kotlin] 리액티브 프로그래밍 (3)"
subtitle: "Kotlin 리액티브 프로그래밍"
date: 2021-06-20 18:30:00 +0900
categories: til
tags: kotlin android rx
comments: true
---



>본 글은 코틀린 리액티브 프로그래밍을 보고 공부한 내용입니다
>
>[코틀린 리액티브 프로그래밍](http://www.acornpub.co.kr/book/reactive-kotlin){: class="underlineFill"}





#### 3. Subjects

- 핫 옵저버블을 구현하는 또 다른 좋은 방법은 Subject이다
- subject는 옵저버블과 옵저버의 조합이다
    - 옵저버블이 가져야 하는 모든 연산자를 가지고 있다
    - 옵저버와 마찬가지로 배출된 모든 값에 접근할 수 있다
    - Subject가 completed / errored / unsubscribed된 후에는 재사용 할 수 없다
    - 그 자체로 가치를 전달한다
        - onNext를 사용해 값을 Subject(Observer) 측에 전달하면 Observable에서 접근 가능하게된다

```kotlin
import io.reactivex.Observable
import io.reactivex.subjects.PublishSubject
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import java.util.concurrent.TimeUnit

fun main(args: Array<String>) {
    val observable = Observable.interval(100, TimeUnit.MILLISECONDS)
    val subject = PublishSubject.create<Long>()
    observable.subscribe(subject)
    subject.subscribe({
        println("Subscription 1 : Received $it")
    })
    runBlocking { delay(1100) }
    subject.subscribe({
        println("Subscription 2 : Received $it")
    })
    runBlocking { delay(1100) }
}
```

- Subject는 모든 옵저버에게 전달된 배출을 중계하고, 콜드 옵저버블을 핫 옵저버블로 변경시킨다



### 다양한 구독자

#### 1. AsyncSubject

- AsyncSubject는 수신 대기 중인 소스 옵저버블의 마지막 값과 배출만 전달한다
- 즉, 마지막 값을 한 번만 배출한다

```kotlin
import io.reactivex.Observable
import io.reactivex.subjects.AsyncSubject

fun main(args: Array<String>) {
    val observable = Observable.just(1,2,3,4)
    val subject = AsyncSubject.create<Int>()
    observable.subscribe(subject)
    subject.subscribe({
       println("Received : $it") 
    }, {
        println("Error : $it")
    }, {
        println("Complete")
    })
    subject.onComplete()
}

>>> Received : 4
>>> Complete
```

-  기본적으로 Subjectd로 옵저버블에 가입하면 Subject는 옵저버블이 값을 배출할 때마다 내부적으로 onNext를 호출한다

-  옵저버블을 구독하는 대신 onNext를 호출해 값을 전달하고 다른 구독도 가지게 된다

```kotlin
import io.reactivex.subjects.AsyncSubject

fun main(args: Array<String>) {
    val subject = AsyncSubject.create<Int>()
    subject.onNext(1)
    subject.onNext(2)
    subject.onNext(3)
    subject.onNext(4)
    subject.subscribe({
        println("Received : $it")
    }, {
        println("Error : $it")
    }, {
        println("Complete")
    })
    subject.onComplete()
}
```

- 예제에서는 onNext로만 값을 전달하고 있다
- AsyncSubject는 onComplete 호출에서만 유일한 값을 배출한다
- AsyncSubject는 인터리브 방식으로 작동하지 않고, 하나의 값을 사용해 여러 옵저버에 내보내는 작업을 반복한다



#### 2. PublishSubject

- PublishSubjectsms onNext 메서드 또는 다른 구독을 통해 값을 받았는지 여부에 관계없이 구독 시점에 이어지는 모든 값을 배출한다



#### 3. BehaviorSubject

- AsyncSubject와 PublishSubject 를 결합한 것
- BehaviorSubject는 멀티캐스팅으로 동작하는데 구독 전의 마지막 아이템과 구독 후 모든 아이템을 배출한다
- 내부 옵저버 목록을 유지하는 데 중복 전달 없이 모든 옵저버에게 동일한 배출을 전달한다

```kotlin
import io.reactivex.subjects.BehaviorSubject

fun main(args: Array<String>) {
    val subject = BehaviorSubject
        .create<Int>()
    subject.onNext(1)
    subject.onNext(2)
    subject.onNext(3)
    subject.onNext(4)
    subject.subscribe({
        println("1 >> Received : $it")
    }, {
        println("Error : $it")
    }, {
        println("Complete")
    })
    subject.onNext(5)
    subject.subscribe({
        println("2 >> Received : $it")
    }, {
        println("Error : $it")
    }, {
        println("Complete")
    })
    subject.onComplete()
}

1 >> Received : 4
1 >> Received : 5
2 >> Received : 5
1 >> Complete
2 >> Complete
```

- 첫번재 구독은 구독하기 전 값인 4와 구독 후 5를 배출
- 두번째 구독은 구독전 값인 5를 배출하게 된다



#### 4. ReplaySubject

- ReplaySubject는 갖고 있는 모든 아이템을 옵저버의 구독 시점과 상관없이 다시 전달한다
- 콜드 옵저버블과 유사하다

```kotlin
import io.reactivex.subjects.ReplaySubject

fun main(args: Array<String>) {
    val subject = ReplaySubject.create<Int>()
    subject.onNext(1)
    subject.onNext(2)
    subject.onNext(3)
    subject.onNext(4)
    subject.subscribe({
        println("1 >> Received : $it")
    }, {
        println("Error : $it")
    }, {
        println("1 >> Complete")
    })
    subject.onNext(5)
    subject.subscribe({
        println("2 >> Received : $it")
    }, {
        println("Error : $it")
    }, {
        println("2 >> Complete")
    })
    subject.onComplete()
}
```

- 두가지 구독 모두 모든 배출을 받게 된다



