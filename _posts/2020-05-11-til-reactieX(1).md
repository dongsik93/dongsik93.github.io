---
layout: post
title: "[Android] ReactiveX - 1"
subtitle: "android "
date: 2020-05-11 18:30:00 +0900
categories: til
tags: rx android reactiveX
comments: true
---



## ReactiveX



1. ### ReactiveX란?

- ReactivX는 관찰 가능한 시퀀스를 사용하여 비동기 및 이벤트 기반 프로그램을 작성하기 위한 라이브러리다
- 데이터 또는 이벤트 시퀀스를 지원하도록 **옵저버 패턴**을 확장하고 하위 레벨 스레딩, 동기화, 스레드 안정성, 동시 데이터 구조 및 비정규 데이터와 같은 문제를 추상화하면서 시퀀스를 선언적으로 구성할 수 있는 연산자를 추가한다

- Observables는 여러 항목의 비동기 시퀀스에 엑세스하는 이상적인 방법이기 때문에 격차를 메운다

|        | 단일 아이템           | 여러 항목                 |
| ------ | --------------------- | ------------------------- |
| 동기   | `T getData()`         | `Iterable<T> getData()`   |
| 비동기 | `Future<T> getData()` | `Observable<T> getData()` |



2. ### Observable이란?

- ReactiveX는 옵저버패턴을 사용하기 때문에 rx의 Observer는 Observable을 구독하게 된다
- Observable이 emit하는 하나 혹은 연속된 item 에 대해 Observer에게 알림을 보낸다
- Rxjava는 Observable의 시작이면서 Observable의 끝이라고 할정도로 중요한 개념이다
- onNext , onError, onComplete의 세가지 알림을 구독자에게 전달한다
  - onNext : Observable이 데이터 발행을 알림	
  - onError : error가 발생했음을 알리고 Observable을 종료
  - onComplete : 모든 이벤트가 발행을 완료했음을 알립니다 이벤트가 발생한 후 onNext를 발행해서는 안된다

 기존 RxJava 1.x에서 Observable과 Single로 구성했지만 RxJava 2.x부터 Observable, Maybe, Flowable 클래스로 구분지어 사용하게 된다

- `Observable`
  - 옵저버 패턴을 구현하여 객체의 상태 변화를 관찰해 상태 변화가 있을 때 마다 상태 변화에 대해 옵저버에게 알려준다
- `Maybe`
  - reduce() 함수나 firstElement() 함수와 같이 데이터가 발행할 수 있거나 혹은 발행되지 않고도 완료되는 경우를 의미
- `Flowable`
  - 데이터가 발생하는 속도가 구독자가 처리하는 속도보다 현저하게 빠른 경우 발생하는 배압(Back Pressure)이슈에 대응하는 기능을 제공한다



3. ### Observable을 사용하는 이유

- `Observable` 모델을 사용하면 배열과 같은 데이터 항목의 컬렉션에 사용하는 것과 동일하게 단순하고 구성가능한 조작으로 비동기 이벤트 스트림을 처리할 수 있다
- 뒤얽힌 웹 콜백에서 벗어날 수 있으므로 코드를 더 읽기 쉽고 버그가 적다



##### Observable 은 구성가능하다

- Future를 사용하여 조건부 비동기 실행 흐름을 최적화하는 것은 어렵다
  - 각 요청의 대기시간은 런타임에 따라 다르므로 불가능하다

- 하지만 Observable은 비동기 데이터의 흐름과 순서를 구성하기 위한 것이다



##### Observable의 유연성

- Observable은 단일 스칼라 값의 방출뿐만 아니라 일련의 값 또는 무한 스트림의 방출도 지원한다



##### Observable은 독단적이지 않다

- 스레드 풀, 이벤트 루프, 비 차단 I / O 또는 사용자의 요구, 스타일 또는 전문지식에 적합한 구현을 사용하여 구현할 수 있다
- 클라이언트 코드는 기본 구현이 블로킹인지 비 블로킹인지에 관계없이 Observables와 모든 상호 작용을 비동기식으로 처리하거나 사용자에게 선택권을 준다



4. ### 스케줄러란?

- 스케줄링은 다중 프로그래밍을 가능하게 하는 운영 체제의 동작 기법이다. 운영 체제는 프로세스들에게 CPU 등의 자원 배정을 적절히 함으로써 시스템의 성능을 개선할 수 있다

- Observable을 연산자 체인을 하고 멀티스테딩을 적용하기 위해선 특정 스케줄러를 사용해서 실행하면 된다

- 보통 스케줄러를 지정하기위해서는 RxAndroid 즉 안드로이드에서는 두가지를 사용하게되는데

  - ObserveOn : SubscribeOn된 스레드를Observable의 체인 이후에 사용할 스레드를 변경할때 사용된다
  - SubScribeOn : Observable연산을 사용하기위해 처음 사용할 스레드를 지정

- ##### `Scheduler.io()`

  - 파일 / 네트워크 IO 작업을 할 때 사용하는 용도
  - 내부적으로 cachedPool을 사용하기 때문에 thread가 동시에 계속 늘어나면서 생성될 수 있으며, 유휴 thread가 있을 경우 재활용된다

- ##### `Scheduler.computation()`

  - cpu 의존적인 계산 수행을 위한 thread pool을 사용한다
  - 코어 개수만큼 thread pool을 만들어서 사용한다

- ##### `Scheduler.newThread()`

  - 새로운 Thread를 하나 만들어 사용

- ##### `Scheduler.single()`

  - singleThreadPool을 사용하므로, 해당 Scheduler로 여러 작업 수행시 Queuing되어 순서가 보장된다

- ##### `Scheduler.trampoline()`

  - 호출을 수행한 thread를 이용하여 수행한다
  - 호출한 스레드 역시 단일 thread 이므로 여러 작업 요청 시 Queuing되어 순서가 보장된다
  - 단 호출한 스레드를 사용하기 때문에 Queuing된 모든 작업이 끝나면 다음 코드라인이 수행된다

- ##### `Scheduler.from()`

  - Executor를 전달하여 새로운 Scheduler를 생성할 수 있다

- ##### `AndroidSchedulers.mainThread()`

  - RxAndroid 사용시 mainThread()에서 수행하기 위한 Scheduler

  ```kotlin
  val ob = Observable.just(1) 
  
  ob.subscribeOn(Schedulers.io())
  	.subscribe { println("Schedulers.io() - ${Thread.currentThread().name}") } ob.subscribeOn(Schedulers.computation()) 
  	.subscribe { println("Schedulers.computation() - ${Thread.currentThread().name}") } ob.subscribeOn(Schedulers.newThread()) 
  	.subscribe { println("Schedulers.newThread() - ${Thread.currentThread().name}") } ob.subscribeOn(Schedulers.single()) 
  	.subscribe { println("Schedulers.single() - ${Thread.currentThread().name}") } ob.subscribeOn(Schedulers.trampoline())
  	.subscribe { println("Schedulers.trampoline() - ${Thread.currentThread().name}") } 
  
  val executor = Executors.newFixedThreadPool(2) 
  val customScheduler = Schedulers.from(executor) 
  
  ob.subscribeOn(customScheduler) 
  	.subscribe { println("Schedulers.from() - ${Thread.currentThread().name}") } 
  
  delay(1000)
  ```



5. ### subscribeOn 과 observeOn

- ##### `subscribeOn`

  - 어느 위치에서 선언되든지 Observable과 Observer 모두 특정 scheduler에서 동작하도록 지정한다
  - 데이터의 생산과 소비를 동일한 스케줄러를 사용하도록 지정

  ```kotlin
  Observable.range(1, 3) 
  	.map { 
          println("mapping - ${Thread.currentThread().name}")
          it 
      } 						
  	.subscribeOn(Schedulers.io())
  	.subscribe { println("subscribe $it - ${Thread.currentThread().name}") }
  
  delay(100)
  ```

  - 생산과 처리 모두 io scheduler에서 수행

- ##### `observeOn`

  - 선언부분 이하의 downstream이 사용할 scheduler를 지정

  ```kotlin
  Observable.just(1) 
  	.observeOn(Schedulers.io()) 
  	.map { 
          println("mapping#1 - ${Thread.currentThread().name}") 
          it
      } 
  	.observeOn(Schedulers.computation()) 
  	.map { 
          println("mapping#2 - ${Thread.currentThread().name}")
          it 
      } 
  	.observeOn(Schedulers.single())
  	.subscribe { println("subscribe $it - ${Thread.currentThread().name}") } 
  
  delay(100)
  ```

  - observeOn을 이용해 각각의 작업을 지정한 Scheduler에서 수행하도록 변경
  - 연산자 하나로 손쉽게 context를 switching할 수 있다
  - 안드로이드에서는 `observeOn(AndroidSchedulers.mainThread())`를 통해 subscribe를 하도록 한다면 간단하게 비동기 작업을 처리할 수 있다

- 우선순위

  - subscribeOn은 어디에 선언되든 Observable과 subscribe가 동작되는 전체 Scheduler를 지정한다
  - subscribeOn이 여러개 선언되면, 가장 먼저 선언된 Scheduler로 동작된다
  - subscribeOn과 observeOn이 혼용될 경우 subscribeOn은 observeOn 선언 직전 부분의 코드를 실행하고, observeOn 선언 이후부터는 observeOn에서 선언된 Scheduler로 동작된다



6. ### Single

- Single 은 Observable 과는 다르게 `onSuccess(item)` 과 `onError(throwable)`만을 가진다
- 비동기 처리 후 결과만을 반환해야 하는 경우, 즉 위와 같이 dao 등을 통해 데이터를 비동기로 불러오고자 하는 경우에 적절하다

```kotlin
Observable.just("Hello World")
    .single("Default Value")
    .subscribe { result ->
        println(result!!)
    }

Observable.empty<String>()
    .single("Default Value")
    .subscribe { result ->
        println(result!!)
    }        
```



7. ### Completable

- Completable 은 `onCompleted()` 와 `onError(throwable)` 만을 가진다
- 비동기 처리 후 반환되는 결과가 없는 경우 사용하면 된다

```kotlin
Completable.fromAction(heavyJob::run)
  .subscribeOn(Schedulers.io())
  .subscribe(() -> {
    // Next Step
  }, throwable -> {
    // Error handling
  })
```



8. ### Flowable

- Observable을 사용하다보면 데이터를 생산하는 속도를 subscribe하여 소비하는 속도를 따라잡지 못하는 경우가 있다. 이런 경우에 발생한 데이터가 누락되거나 메모리 부족이 발생한다
  - 기존에는 Observable에 Backpressure Buffer를 두고 이 버퍼에 넘치는 데이터를 보관하고 버퍼가 가득찼을 경우 새로운 데이터를 publish 하지 않았다
  - 이 Backpressure를 없애고 `Flowable`을 추가
- 5가지의 BackpressureStrategy를 통해 배압 문제를 다룬다
  - BUFFER
    - 처리할 수 없어서 넘치는 데이터를 별도의 버퍼에 저장
  - DROP
    - 처리할 수 없어서 넘치는 데이터를 무시(소비자에게 전달 X)
  - LATEST
    - 넘치는 데이터를 버퍼에 저장하지만 버퍼가 찰 경우 오래된 데이터를 무시하고 최신의 데이터만 유지
  - ERROR
    - 넘치는 데이터가 버퍼 크기르 초과하면 MissingBackPressureException 에러를 통지
  - NONE
    - 특정 처리를 수행하지 않는다



9. ### Maybe

- 이름 그대로 값이 방출될수도 있고, 방출되지 않을수도 있는 경우에 사용된다
- Single과 Completable 두가지가 합쳐졌다고 생각하면 된다
- 성공하여 값이 발생했을 때 onSuccess, 성공하였지만 값이 없을 때 onComplete, 실패했을 때 onError 세가지 사용



- 참고사이트

[Reactive 코틀린 #10 - 병렬처리를 위한 Scheduler ](https://tourspace.tistory.com/292?category=797357){: class="underlineFill"} 

[ReactiveX.io](http://reactivex.io/documentation/operators.html){: class="underlineFill"} 

[[RxJava] startWith, mergeWith, zipWith, combineLatest 차이점 & 샘플 코드](https://softwaree.tistory.com/32){: class="underlineFill"} 