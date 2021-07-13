---
layout: post
title: "[Kotlin] 리액티브 프로그래밍 (2)"
subtitle: "Kotlin 리액티브 프로그래밍"
date: 2021-06-13 18:30:00 +0900
categories: til
tags: kotlin android rx
comments: true

---



>본 글은 코틀린 리액티브 프로그래밍을 보고 공부한 내용입니다
>
>[코틀린 리액티브 프로그래밍](http://www.acornpub.co.kr/book/reactive-kotlin){: class="underlineFill"}





## 3. 옵저버블과 옵저버와 구독자

- 다양한 데이터 소스를 옵저버블 인스턴스 변환하는 작업을 자세히 알아본다
- Observables의 다양한 유형을 배운다
- Observer 인스턴스 및 구독을 사용하는 방법, subjects와 다양한 구현에 대해서 알아본다



### 옵저버블

- 리액티브 프로그래밍에서 옵저버블(observable)은 그 컨슈머(observer)가 소비할 수 있는 값을 산출해 내는 기본 계산 작업을 가지고 있다
- 컨슈머가 값을 풀(pull)방식을 사용해 접근하는 것이 아니라 **옵저버블은 컨슈머에게 값을 푸시(push)하는 역할**을한다
- 그렇기 때문에 옵저버블은 일련의 연산자를 거친 아이템을 최종 옵저버로 내보내는 푸시 기반의 조합 가능한 이터레이터이다
    - 옵저버는 옵저버블을 구독한다
    - 옵저버블이 그 내부의 아티템들을 내보내기 시작한다
    - 옵저버는 옵저버블에서 내보내는 모든 아이템에 반응한다



#### 옵저버블이 동작하는 방법

- 옵저버블은 세 가지 중요한 이벤트 메서드를 가지고 있다
- `onNext`
    - 옵저버블은 모든 아이템을 하나씩 이 메서드에 전달한다
- `onComplete`
    - 모든 아이템이 onNext 메서드를 통과하면 옵저버블은 onComplete 메서드를 호출한다
- `onError`
    - 옵저버블에서 에러가 발생하면 onError 메서드가 호출돼 정의된대로 에러를 처리한다
    - onError와 onComplete는 터미널 이벤트로 둘중하나가 호출되면 다른 하나는 호출되지 않는다



```kotlin
import io.reactivex.Observable
import io.reactivex.Observer
import io.reactivex.disposables.Disposable

fun main(args: Array<String>) {
    val observer: Observer<Any> = object : Observer<Any> {
        override fun onComplete() {
            println("all completed")
        }
        override fun onNext(t: Any) {
            println("Next $t")
        }
        override fun onError(e: Throwable) {
            println("Error Occurred $e")
        }
        override fun onSubscribe(d: Disposable) {
            println("Subscribed to $d")
        }
    }

    val observable: Observable<Any> = listOf("One", 2, "Three", "Four", 4.5).toObservable()
    observable.subscribe(observer)
    
    
    val observableOnList: Observable<List<Any>> = 
        Observable.just(
            listOf("One", 2, "Three", "Four", 4.5),
            listOf("List with single item"),
            listOf(1,2,3,4,5,6)
        )
        observableOnList.subscribe(observer)
}
```

- observer 인터페이스에는 4개의 메서드가 선언되어 있다
- `onComplete` 메서드는 Observable이 오류 없이 모든 아이템을 처리하면 호출된다
- `onNext`는 Observable이 내보내는각 아이템에 대해 호출된다
- `onError`는 Observable에 오류가 발생했을 때 호출된다
- `onSubscribe` 메서드는 Observer가 Observable을 구독할 때마다 호출된다



#### 옵저버블을 생성하는 팩토리 메서드

#### 1. Observable.create

- Observable.create 메서드로 옵저버블을 직접 생성할 수 있다
- 이 메서드는 관찰 대상자를 ObservableEmitter <T> 인터페이스의 인스턴스를 입력받는다

```kotlin
import io.reactivex.Observable
import io.reactivex.Observer
import io.reactivex.disposables.Disposable
import java.lang.Exception

fun main(args: Array<String>) {
    val observer: Observer<String> = object : Observer<String> {
        override fun onComplete() {
            println("all completed")
        }
        override fun onNext(t: Any) {
            println("Next $t")
        }
        override fun onError(e: Throwable) {
            println("Error Occurred $e")
        }
        override fun onSubscribe(d: Disposable) {
            println("Subscribed to $d")
        }
    } 
    
    // #1
    val observable: Observable<String> = Observable.create<String> {
        it.onNext("Emit 1")
        it.onNext("Emit 2")
        it.onNext("Emit 3")
        it.onNext("Emit 4")
        it.onComplete()
    }
    
    observable.subscribe(observer)
    
    // #2
    val observable2: Observable<String> = Observable.create<String> {
        it.onNext("Emit 1")
        it.onNext("Emit 2")
        it.onNext("Emit 3")
        it.onNext("Emit 4")
        it.onError(Exception("Throw Exception!!"))
    }
    
    observable2.subscribe(observer)
}
```

- #1
    - Observable.create로 옵저버블을 생성하고 onNext를 통해 4개의 문자열을 내보낸 후 onComplete 메서드로 완료됐음을 알려준다
- #2
    - onComplete 대신 onError를 통해 에러를 발생시킨다
- Observable.create 메서드는 사용자가 지정한 데이터 구조를 사용하거나 내보내는 값을 제어하려고 할 때유용한다



#### 3. Observable.from

- from 메서드의 도움을 받아 거의 모든 코틀린 구조체로부터 Observable 인스턴스를 생성할 수 있다

```kotlin
val list = listOf("String 1", "String 2", "String 3")
// #1
val observableFromIterable: Observable<String> = Observable.fromIterable(list)
observableFromIterable.subscribe(observer)

val callable = Callable<String> { "From Callable" }
// #2
val observableFromCallable: Observable<String> = Observable.fromCallable(callable)
observableFromCallable.subscribe(observer)

val future: Future<String> = object : Future<String>  {
    override fun isDone(): Boolean = true
    override fun get(): String  = "Hello From Future"
    override fun get(timeout: Long, unit: TimeUnit) = "Hello From Future"
    override fun cancel(mayInterruptIfRunning: Boolean) = false
    override fun isCancelled(): Boolean = false
}
// #3
val observableFromFuture: Observable<String> = Observable.fromFuture(future)
observableFromFuture.subscribe(observer)
```

- #1 : Observable.fromIterable 메서드를 사용해 Iterable 인스턴스로부터 옵저버블 생성
- #2 : Observable.fromCallable 메서드를 사용해 Callable 인스턴스로부터 옵저버블 생성
- #3 : Observable.fromFuture 메서드를 사용해 Future 인스턴스로부터 옵저버블 생성



#### 3. toObservable의 확장 함수 이해

- Kotlin extension 덕분에 어떠한 Iterable 인스턴스도 Observable로 어려움 없이 변경이 가능하다

```kotlin
val list: List<String> = listOf("String 1", "String 2", "String 3")

val observable: Observable<String> = list.toObservable()
observable.subscribe(observer)
```

- 다음은 toObservable의 메서드 내부이다

```kotlin
fun <T : Any> Iterator<T>.toObservable(): Observable<T> = toIterable().toObservable()

fun <T : Any> Iterable<T>.toObservable(): Observable<T> = Observable.fromIterable(this)

fun <T : Any> Sequence<T>.toObservable(): Observable<T> = asIterable().toObservable()

fun <T : Any> Iterable<Observable<out T>>.merge(): Observable<T> = Observable.merge(this.toObservable())
```

- 결과적으로 내부에서는 Observables.from 메서드를 사용하고 있다





#### 4. Observable.just

- 넘겨진 인자만을 배출하는 옵저버블을 생성한다
- Iterable 인스턴스를 Observable.just에 단일 인자로 넘기면 전체 목록을 **하나의 아이템**으로 배출하는데 이는 Iterable 내부의 각각의 아이템을 Observable로 생성하는 Observable.from과는 다르다는 점에 유의해야 한다

```kotlin
Observable.just("A Strig").subscribe(observer)
Observable.just(54).subscribe(observer)
Observable.just(
    listOf("String 1", "String 2", "String 3")
).subscribe(observer)
Observable.just(
    mapOf(
        "key 1" to "value 1",
        "key 2" to "value 2"
    )
).subscribe(observer)
// #1
Observable.just(
	"String 1", "String 2", "String 3"
).subscribe(observer)
```

- Observable.just 호출시
    - 인자와 함께 Observable.just 를 호출
    - Observable.just는 옵저버블을 생성
    - onNext 알림을 통해 각각의 아이템을 내보냄
    - 모든 인자의 제출이 완료되면 onComplete 실행
- 리스트와 맵도 단일 아이템으로 취급되는데,  #1과 같이 문자열 세개는 각각의 인자를 별개의 아이템으로. 받아들인 후 내보낸다



#### 5. Observable의 다른 팩토리 메서드

```kotlin
// #1
Observable.range(1, 10).subscribe(observer)
// #2
Observable.empty<String>().subscribe(observer)

runBlocking {
    // #3
    Observable.interval(300, TimeUnit.MILLISECONDS).subscribe(observer)
    delay(900)
    // #4
    Observable.timer(400, TimeUnit.MILLISECONDS).subscribe(observer)
    delay(450)
}
```

- #1 : Observable.ragne 팩토리 메서드로 1~10까지 정수를 내보낸다
- #2 : Observable.empty 메서드는 onNext()로 보내지않고 바로 onComplete()를 발생시킨다
- #3,  #4
    - Observable.interval 메서드는 지정된 간격만큼의 숫자를 0부터 순차적으로 내보낸다
    - 구독을 취소하거나 프로그램이 종료될 때까지 이어진다
    - Observable.timer는 지정된 시간이 경과한 후에 한번만 실행된다



#### 6. 구독과 해지

- Observable(관찰되어야. 하는 대상), Observer(관찰해야 하는 주체)를 연결하기 위해서는 매개체가 필요하다
- 구독(subscribe)
    - 앞서 계속 사용해온 subscribe를 통해 구독할 수 있다
- 해지
    - 구독하는 동안 Observer 인스턴스 대신 메서드를 전달하면 subscribe 연산자는 Disposable의 인스턴스를 반환하는데, Observable 인스턴스를 전달했다면 onSubscribe메서드의 매개변수에서 Disposable인스턴스를 얻을 수 있다
    - 이 Disposable 인터페이스의 인스턴스를 사용해서 주어진 시간에 배출을 멈출 수 있다

```kotlin
import io.reactivex.Observable
import io.reactivex.Observer
import io.reactivex.disposables.Disposable
import io.reactivex.rxkotlin.toObservable
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import java.util.concurrent.TimeUnit

fun main(args: Array<String>) {
    runBlocking { 
        // #1
        val observable: Observable<Long> = Observable.interval(100, TimeUnit.MILLISECONDS)
        val observer: Observer<Long> = object : Observer<Long> {
            // #2
            lateinit var disposable: Disposable
            override fun onComplete() {
                println("Complete")
            }
            override fun onSubscribe(d: Disposable) {
                // #3
                disposable = d
            }
            override fun onNext(t: Long) {
                println("Received $t")
                // #4
                if (t >= 10 && !disposable.isDisposed) {
                    disposable.dispose()
                    println("disposed")
                }
            }
            override fun onError(e: Throwable) {
                println("Error $e")
            }
        }
        
        observable.subscribe(observer)
        delay(1500)
    }
}
```

- Observable.interval로 생성한 옵저버블은 종료되지 않으며 프로그램이 실행을 멈출 때까지 중지되지 않는다
- 중간에 옵저버블을 멈추고 싶기 때문에 interval을 사용
- #1 : 100밀리초간격마다 정수를 배출
- #2, #3 : lateinit을 사용해. disposable 변수를 onSubscribe 메서드 내에서 할당
- #4 : 값이 10에 도달한 후 실행을 중지시킨다

```kotlin
interface Disposable {
    /**
    * 리소스를 처리, 연산은 멱등성을 가져야 한다
    */
    fun dispose()
    
    /**
    * 리소스가 처리되었다면 true
    */
    val isDisposed: Boolean
}
```

- 배출 중단을 전달받았는지 알리는 isDisposed와 배출 중단을 알리는 dispose() 메서드를 가지고 있다



### 핫, 콜드 옵저버블

- Observables는 그 행동에 따라서 두 가지 범주로 나눌수 있다



#### 1. 콜드 옵저버블

```kotlin
import io.reactivex.Observable
import io.reactivex.rxkotlin.toObservable

fun main(args: Array<String>) {
    // #1
    val observable: Observable<String> = listOf("String 1", "String 2", "String 3").toObservable()
    observable.subscribe({
        // #2
        println("received $it")
    },{
        println("Error $it")
    }, {
        println("Done")
    })

    observable.subscribe({
        // #3
        println("received $it")
    },{
        println("Error $it")
    }, {
        println("Done")
    })
}
```

- #1 에서 Observable을 선언하고 #2, #3에서 구독

- 콜드 옵저버블은 구독 시에 실행을 시작하고, subscribe가. 호출되면. 아이템을 푸시하기 시작하는데 각 구독에서 아이템의 동일한 순서를 푸시한다
- 여기까지 사용한 모든 팩토리 메서드는 콜드 옵저버블을 반환한다

- 콜드 옵저버블은 수동적이며 구독이 호출될 때까지 아무것도 내보내지 않는다



#### 2. 핫 옵저버블

- 핫 옵저버블은 배출을 시작하기 위해 구독할 필요가 없다
- 핫 옵저버블은 데이터보다는 이벤트와 유사하다



#### ConnectableObservable 객체

- 가장 유용한 핫 옵저버블중 하나이다
- ConnectableObservable은 심지어 콜드 옵저버블을 핫 옵저버블로 바꿀 수 있다
- Subscribe 호출로 배출을 시작하는 대신 connect 메서드를 호출한 후에 활성화된다
- connect를 호출하기 전에 반드시 subscribe를 호출해야 한다
- connect를 호출한 후 구독하는 모든 호출은 이전에 생성된 배출을 놓치게 된다

```kotlin
import io.reactivex.rxkotlin.toObservable

fun main(args: Array<String>) {
    // #1
    val connectableObservable = listOf("String 1", "Sring 2", "String 3").toObservable().publish()
    // #2
    connectableObservable.subscribe({ println("Subscription : 1 $it") })
    // #3
    connectableObservable.map(String::reversed).subscribe({ println("SubScription : 2 $it") })
    // #4
    connectableObservable.connect()
    // #5
    connectableObservable.subscribe({ println("SubScription : 3 $it") })
}
```

- ConnectableObservable의 주요 목적은 **한 옵저버블에 여러 개의 구독을 연결해 하나의 푸시에 대응할 수 있도록** 하는 것이다
- 이는 푸시를 반복하고 각 구독마다 따로푸시를 보내는 콜드 옵저버블과는 상이하다

> **Map 연산자**
>
> 옵저버블 소스에서 배출된 각 항목에 선택한 함수를 적용하고 이런 함수 적용 결과를 배출하는 옵저버블 반환

- #2 에서는 connectableObservable을 구독했다
- #3 에서는 map 연산자를 사용했으며, 매핑된 connectableObservable을 구독했다
- #5 에서 connect()를 호출해 위의 두 옵저버에서 배출이 시작되게 된다
- **각 배출은 각 옵저버에게 동시에 전달되며 인터리브 방식으로 데이터를 처리한다**

> **인터리브**
>
> 데이터를 서로 인접하지 않게 배열하는 방식, 기억장치를 몇 개의 부분으로 나누어서 메모리 액세스를 동시에 할 수 있게 함으로써 복수의 명령을 처리하여 메모리 액세스의 효율화를 도모하는 것

```
// 위 예제의 출력 결과
Subscription : 1 String 1
SubScription : 2 1 gnirtS
Subscription : 1 Sring 2
SubScription : 2 2 gnirS
Subscription : 1 String 3
SubScription : 2 3 gnirtS
```

- 옵저버블에서 단 한번의 배출로 모든 구독/관찬자에게 배출을 전달하는 매커니즘을 **멀티캐스팅**이라고 한다

```kotlin
import io.reactivex.Observable
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import java.util.concurrent.TimeUnit

fun main(args: Array<String>) {
    // #1
    val connectableObservable = Observable.interval(100, TimeUnit.MILLISECONDS).publish()
    // #2
    connectableObservable.subscribe({ println("Subscription : 1 $it") })
    // #3
    connectableObservable.subscribe({ println("Subscription : 2 $it") })
    // #4
    connectableObservable.connect()
    // #5
    runBlocking { delay(500) }

    // #6
    connectableObservable.subscribe({ println("Subscription : 3 $it") })
    // #7
    runBlocking { delay(500) }
}
```

- 위 예제는 Observable.interval 로 생성했는데 각 배출마다 간격이 생기기 때문에 connect 이후의 구독에 약간의 공간을 줄 수 있기 때문이다
- #5에서 connect 후 즉시 지연을 호출한 다음 #6에서 다시 구독하고,  #7에서 3번째 구독이 일부 데이터를 인쇄할 수 있도록 다시 지연을 호출하는 구조이다

```
예제 출력 결과
Subscription : 1 0
Subscription : 2 0
Subscription : 1 1
Subscription : 2 1
Subscription : 1 2
Subscription : 2 2
Subscription : 1 3
Subscription : 2 3
Subscription : 1 4
Subscription : 2 4
Subscription : 1 5
Subscription : 2 5
Subscription : 3 5
Subscription : 1 6
Subscription : 2 6
Subscription : 3 6
Subscription : 1 7
Subscription : 2 7
Subscription : 3 7
Subscription : 1 8
Subscription : 2 8
Subscription : 3 8
Subscription : 1 9
Subscription : 2 9
Subscription : 3 9
```

- 세 번째 구독 이전에 5회의 배출이 있었고 이후 세 번째 구독이 5번째 배출을 받게 된다

