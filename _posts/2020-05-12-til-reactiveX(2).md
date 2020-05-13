---
layout: post
title: "[Android] ReactiveX - 2"
subtitle: "android "
date: 2020-05-12 18:30:00 +0900
categories: til
tags: rx android reactiveX
comments: true

---



## ReactiveX



## Observable Operators



1. ### Observable Operators : 생성

- ReactiveX에서는 Observable을 생성, 변환, 필터링, 결합 등 여러 연산자를 지원한다

- ##### `Observable.create()`

  - Observable 생성 시 가장 많이 사용되는 함수 중 하나
  - OnSubscribe 객체를 파라미터로 가지며 구독이 발생하면 이 객체의 call() 함수가 실행된다
  - 옵저버에게 아이템을 발행하기 위해서는 call() 함수 내부에서 `onNext(), onError(), onCompleted()`를 적절히 호출해야 한다
  - `onError()`와 `onCompleted()`는 동시에 호출 할 수 없는 상호 배타적인 관계이다
  - 즉 이 두 함수 중 하나가 호출된 이후에는 옵저버의 어떠한 함수도 호출하지 않아야 한다

![1-1](/img/in-post/reactiveX/1-1.png)

```kotlin
// Sample Code
val subscribe = Observable.create { emit: ObservableEmitter<Int> ->
    emit.onNext(100)
    emit.onNext(200)
    emit.onNext(300)
    emit.onComplete()
}.subscribe { println(it) }
```

- ##### `Observable.defer()`

  - 지연 초기화(Lazy Initializations)를 제공하는 함수
  - 구독이 발생할 때 비로소 Observable을 생성한다
  - 파라미터로 `Func0<r>` 을 가지는데 이 함수는 구독이 발생할 때마다 호출되기 때문에 매번 새로운 옵저버블 객체가 생성된다

  ![1-2](/img/in-post/reactiveX/1-2.png)

- ##### `fromXXXX`

  - from을 이용하면 기존 구조체로부터 Observable을 생성할 수 있다

  - fromArray()

    - Array안의 데이터를 하나씩 발행하는 함수

    ![1-3](/img/in-post/reactiveX/1-3.png)

    ```kotlin
    val arr = arrayOf(100, 200, 300)
    val source = Observable.fromArray(*arr)
    source.subscribe { println(it) }
    ```

  - fromIterable()

    - Iterable 인터페이스의 값을 가져오는 함수
    - 대표적인 Iterable 클래스 `List`, `ArrayList`, `LinkedList`, `Stack` 등등

    ![1-4](/img/in-post/reactiveX/1-4.png)

    ```kotlin
    val names = ArrayList<String>()
    names.add("Jerry")
    names.add("William")
    names.add("Bob")
    
    val source = Observable.fromIterable(names)
    source.subscribe { println(it) }
    ```

  - fromCallable()

    - `Runnable` : 스레드 처리 이후에 리턴 값 X
    - `Callable` : 스레드 처리 이후에 리턴 값 O

    ![1-5](/img/in-post/reactiveX/1-5.png)

    ```kotlin
    val callable = {
        sleep(1000)
        "hihihi"
    }
    
    val source = Observable.fromCallable(callable)
    source.subscribe { println(it) }
    ```

  - fromFuture() 

    - get() 메서드를 호출하면 Callable 객체에서 구현한 계산 결과가 나올때까지 블로킹 된다

    ![1-6](/img/in-post/reactiveX/1-6.png)

    ```kotlin
    val future = Executors.newSingleThreadExecutor().submit(Callable {
        sleep(1000)
        "hihihi"
    })
    
    val source = Observable.fromFuture(future)
    source.subscribe { println(it) }
    ```

- ##### `Observable.interval()`

  - 특정 시간 간격을 주기로 0부터 증가하는 정수 값을 발행한다
  - interval은 기본적으로 스케줄러에서 작동한다. 스케줄러를 매개 변수로 전달하여 스케줄러를 설정할 수있는 변형도 있다

  ![1-7](/img/in-post/reactiveX/1-7.png)

  ```kotlin
  Observable.interval(1000L, TimeUnit.MILLISECONDS)
              .timeInterval()
              .observeOn(AndroidSchedulers.mainThread())
              .subscribe { Log.d("tag", "&&&& on timer")
  ```

- ##### `Observable.just()`

  - 파라미터로 주어진 아이템을 그대로 전달해 Observable로 발행한다
    - 따라서 List를 받던, map을 받던 객체 자체를 전달하기 때문에 각각의 인자로 넣어서 호출해야 한다
  - 기존 함수의 반환값을 Observable로 변환할 때 사용할 수도 있다

  ![1-8](/img/in-post/reactiveX/1-8.png)

  ```kotlin
  val list = listOf(1, 2, 3) 
  val num = 3 
  val str = "wow!" 
  val map = mapOf(1 to "one", 2 to "two")
  
  val justOb = Observable.just(list, num, str, map) 
  val observer: Observer<Any> = object : Observer<Any> { 
      override fun onComplete() = println("onComplete()") 
      override fun onNext(item: Any) = println("onNext() - $item") 
      override fun onError(e: Throwable) = println("onError() - ${e.message}") 
      override fun onSubscribe(d: Disposable) = println("onSubscribe() - $d ") 
  } 
  
  justOb.subscribe(observer)
  ```

  - 넘긴 인자만큼 onNext()를 호출해서 해당 item을 전달하며, 받은 객체 그대로를 전달한다
  - 모든 item의 전달이 완료되면 onComplete()를 호출해준다

- ##### `Observable.range()`

  - 특정 범위 내의 정수값을 순차적으로 발행하는 옵저버블을 생성한다
  - 파라미터로 시작 값과 개수를 갖는다

  ![1-9](/img/in-post/reactiveX/1-9.png)

- ##### `Observable.repeat()`

  - 아이템을 N번 발행한다. 파라미터로 아무것도 넘기지 않으면 아이템을 무한히 발행한다
  - 스케줄러로 trampoline을 사용하고 변경 가능하다

  ![1-10](/img/in-post/reactiveX/1-10.png)

- ##### `Observable.timer()`

  - 특정 시간 이후에 숫자 0을 발행한다
  - 스케줄러로 computation을 사용하고, 변경 가능하다

  ![1-11](/img/in-post/reactiveX/1-11.png)





2. ### Observable Operators : 변환

- ##### `map()`

  - 입력값을 어떤 함수에 넣어서 원하는 값으로 변환하는 함수

  ![2-1](/img/in-post/reactiveX/2-1.png)

  ```kotlin
  val balls = arrayOf("1", "2", "3", "4", "5")
  
  Observable.fromArray(*balls)
      .map {ball -> "$ball<>" }
      .subscribe(System.out::println)
  ```

- ##### `flatMap()`

  - map()과 비슷하지만 리턴타입이 Observable로 반환되기 때문에 여러 개의 결과를 반환할 수 있다

  ![2-2](/img/in-post/reactiveX/2-2.png)

  ```kotlin
  val balls = arrayOf("1", "2", "3", "4", "5")
  
  Observable.fromArray(*balls)
      .flatMap{ ball -> Observable.just("$ball<>", "<>$ball") }
      .subscribe(System.out::println)
  ```

- ##### `groupby`

  - Groupping도 되고, 결과로도 Observable을 반환하는 groupby연산자

  ```kotlin
  val ob1 = Observable.range(1, 10) 
  ob1.groupBy { it % 2 == 0 } 
  	.subscribe { 
  	    val key = it.key it.subscribe { println("key: $key value: $it") } 
      }
  ```



3. ### Observable Operators : 결합

- ##### `startWith`

  - Observable로부터 여러 데이터가 연속적으로 방출될 때 명시적으로 하나의 데이터를 먼저 stream으로 방출할 때 사용된다
  - 사용하기에 매우 간단

  ```kotlin
  val ob = Observable.range(5, 5)
  ob.startWith(listOf(1, 2, 3, 4))
  	.subscribe { println("Received $it") }
  ```

- ##### `zip | zipWith`

  - 두개 이상의 Observable(flowable)을 병합한다
  - 각각의 Observable에서 방출하는 값에 대해서 **pair**를 맞춰서 방출하기 때문에 Observable의 방출 개수가 맞지 않으면 **가장 작은 개수의 Observable에 출력이 맞춰진다**
    - 짝이 없으면 버려진다는 의미

  ```kotlin
  val ob1 = (1..3).toObservable() 
  val ob2 = Observable.just("one", "two", "three", "four") 
  
  Observable.zip(ob1, ob2, BiFunction {a: Int, b:String -> "$a: $b" }) 
  	.subscribe { println(it) }
  ob1.zipWith(ob2, BiFunction {a: Int, b:String -> "$a: $b" })
  	.subscribe { println(it) }
  ```

  - `zip`은 Observable에서 지원하는 static method로 최대 9개까지 병합할 수 있다
  - `zipWith`의 경우 Observable instance에서 제공하는 연산자로 다른 한개만 병합이 가능하다

- ##### `combineLatest`

  - 두개 이상의 Observable을 병합하여 출력한다
  - Observable중 하나라도 방출되면 나머지 Observable의 최신값을 가지고 병합하며, 서로 방출 속도가 달라 다른 Observable이 아직 방출된 값이 없는 상태에서 방출하면, 해당 방출은 버려지게 된다

  ![3-1](/img/in-post/reactiveX/3-1.png)

  ```kotlin
  val ob1 = Observable.interval(100, TimeUnit.MILLISECONDS)
  val ob2 = Observable.interval(150, TimeUnit.MILLISECONDS)
  val ob3 = Observable.interval(200, TimeUnit.MILLISECONDS)
  
  Observable.combineLatest(ob1, ob2, ob3, Function3 {
      current: Boolean, new: Boolean, confirm: Boolean -> current && new && confirm})
  	.observeOn(AndriodSchedulers.mainThread())
  	.subscribeBy(
      	onNext = { println("next doSomething") }
      )}
  ```

  - 두개를 병합하면 `BiFuntion`, 3개는 `Funtion3` , 4개는 `Function4` ...

- ##### `merge | mergeWith | mergeArray`

  - combineLatest나 zip은 여러 개의 Observable이 방출하는 값을 가공하여 출력하지만 merge를 사용하면 가공 없이 단순히 다수의 Observable을 합쳐서 출력한다\
  - `merge`
    - Observable의 static 함수로 최대 4개까지 병합
  - `mergeArray`
    - Observable의 static 함수로 args로 인자를 받아 다수의 Observable 병합 가능
  - `mergeWith`
    - Observable의 instance 객체를 이용하여 다른 Observable과 병합
  - 단순히 병합만 하는 연산자이기 때문에 순서는 각 Observable의 속도에 따라 방출된다(병합 순서와 상관 X)

  ```kotlin
  val ob1 = Observable.just(1,2) 
  val ob2 = Observable.just(3,4)
  
  Observable.merge(ob1, ob2) 
  	.subscribe{ println(it) }
  
  ob1.mergeWith(ob2)
  	.subscribe{ println(it) }
   
  val ob3 = Observable.just(5,6) 
  val ob4 = Observable.just(7,8) 
  val ob5 = Observable.just(9,10)
  Observable.mergeArray(ob1, ob2, ob3, ob4, ob5) 
  	.subscribe{ println(it) }
  ```





4. ### Observable Operators : etc

- ##### `concat | concatWith | concatArray`

  - merge와 유사하게 Observable을 병합하는 작업을 하지만 concat은 선언된 순서를 보장하여 각 Observable을 이어 붙인다
    - 그렇기 때문에 앞선 Observable이 끝나야 다음 Observable이 방출을 할 수 있다
    - onComplete는 모든 방출이 끝난 맨 마지막에 한번만 호출된다

  ```kotlin
  val ob1 = Observable.just(1, 2) 
  	.map { runBlocking { delay(100) } it } 
  val ob2 = Observable.just(3, 4) 
  
  Observable.concat(ob1, ob2) 
  	.subscrube(
          onNext = { println(it) }, 
          onComplete = { println("completed") } 
      ) 
  
  ob1.concatWith(ob2) 
  	.subscrube { println(it) }
  
  val ob3 = Observable.just(5, 6) 
  val ob4 = Observable.just(7, 8) 
  val ob5 = Observable.just(9, 10) 
  Observable.concatArray(ob1, ob2, ob3, ob4, ob5)
  	.subscrube { println(it) }
  
  ```

- ##### `amb | ambArray`

  - 여러 개의 Observable중 가장 빠르게 시작하는 Observable만 사용하고 나머지 Observable의 방출은 버린다
  - 동일한 소스가 여러 서버에 퍼져 있을 때 동시에 호출하고 가장 빨리 응답하는 서버의 응답만을 처리하거나, Android에서 여러 가지 위치 측정 방법 중 가장 빨리 응답하는 결과를 사용할 때 유용하다

  ```kotlin
  val ob1 = Observable.just(1, 2).map { runBlocking { delay(100) } it } 
  val ob2 = Observable.just(3, 4) 
  
  Observable.amb(listOf(ob1, ob2)).blockingSubscribe { println("amb: $it") } 
  
  Observable.ambArray(ob1, ob2).blockingSubscribe { println("ambArray: $it") }
  ```

  - amb의 인자로는 Observable의 collection이 사용되며, 직접 넣을 경우 args인자를 받는 ambArray를 사용한다

- ##### `skip`

  - 말 그대로 방출시점에 조건에 따라 방출을 전달하지 않는다

  ```kotlin
  val ob = Observable.intervalRange(1, 10, 0, 100, TimeUnit.MILLISECONDS) 
  
  ob.skip(5)
  	.blockingSubscribe{ println(it) } 
  
  ob.skip(300, TimeUnit.MILLISECONDS) 
  	.blockingSubscribe{ println(it) }
  ```

- ##### `skipLast`

  - skipLast는 정해진 개수 만큼 마지막 방출을 전달하지 않는다
  - skip은 시작점 부터 건너뛰고, skipLast는 방출 끝에서 건너뛴다
  - Observable의 특성상 모든 방출이 완료되어야만 끝을 알수 있기 때문에 skipLast를 사용하면 뒤에서부터 특정개수를 방출하지는 않지만 모든 데이터의 방출이 완료되는만큼의 시간이 소요된다

  ```kotlin
  val ob = Observable.create { 
      it.onNext(1) 
      it.onNext(2) 
      it.onNext(3) 
      it.onNext(4)
      runBlocking { delay(300) }
      it.onComplete() 
  } 
  
  val time = System.currentTimeMillis() 
  val elapsedTime = measureTimeMillis { 
      ob.skipLast(3)
      	.subscribe { 
              println("Emission Time:${System.currentTimeMillis() - time} - value:$it") } 
  } 
  
  println(elapsedTime)
  ```

- ##### `take`

  - skip과는 반대로 특정 조건에 따라 방출된 데이터를 획득한다

  ```kotlin
  val ob = Observable.intervalRange(1, 10, 0, 100, TimeUnit.MILLISECONDS) 
  
  ob.take(5) 
  	.blockingSubscribe{ println(it) } 
  
  ob.take(300, TimeUnit.MILLISECONDS) 
  	.blockingSubscribe{ println(it) }
  ```

- ##### `onErrorReturnItem | onErrorReturn`

  - 에러가 발생하면 특정 값으로 교체하여 전달한다
  - 에러가 발생되면 Observable의 생산은 중단된다

  ```kotlin
  Observable.range(1, 10) 
  	.map { 
          if (it == 5) {
              throw Exception("Error!!!") 
          } else { it } } 
  	.onErrorReturnItem(-1)
  	.onErrorReturn { e: Throwable -> -1 } 
  	.subscribeBy(
          onNext = { println(it) }, 
          onError = { e -> println(e) })
  ```

- ##### `onErrorResumeNext`

  - 에러 발생시 다른 Observable을 구독하도록 onErrorResumeNext를 사용한다

  ```kotlin
  Observable.range(1, 10)
  	.map { 
          if (it == 5) { throw Exception("Error!!!") } 
          else { it } } 
  	.onErrorResumeNext(Observable.just(3, 2, 1)) 
  	.subscribeBy(
          onNext = { println(it) }, 
          onError = { e -> println(e) }
      )
  ```

- ##### `retry`

  - 에러 발생시 재시도
  - 네트워크 실패 시 재시도 라는 시나리오를 구현할 때 사용하기 적합한 연산자
  - 단순히 반복회수로 반복을 정의할 수도 있고 람다식으로 재시도 여부를 판단할 수도 있다

  ```kotlin
  val ob = Observable.range(1, 10) 
  	.map { 
          if (it == 5) { throw Exception("Error!!!") }
          else { it } } 
  
  ob.retry(2) 
  	.subscribeBy(
          onNext = { println(it) }, 
          onError = { e -> println(e) }
      ) 
  println("---- retry with condition ----") 
  
  ob.retry { 
      retryCnt, e -> println("retry cnt:$retryCnt") 
      if (retryCnt > 2) false else true 
  }.subscribeBy(
      onNext = { println(it) },
      onError = { e -> println(e) }
  )
  ```









- 참고사이트

[Reactive 코틀린 #10 - 병렬처리를 위한 Scheduler ](https://tourspace.tistory.com/292?category=797357){: class="underlineFill"} 

[ReactiveX.io](http://reactivex.io/documentation/operators.html){: class="underlineFill"} 

[[RxJava] startWith, mergeWith, zipWith, combineLatest 차이점 & 샘플 코드](https://softwaree.tistory.com/32){: class="underlineFill"} 