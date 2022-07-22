---
layout: post
title: "[Android] DelayRequest(with Thread Safe)"
subtitle: "thread safe"
date: 2022-06-30 18:00:00 +0900
categories: til
tags: android thread coroutine
comments: true


---



# [Android] DelayRequest(with Thread Safe)



개발을 진행하려고 했던 것은 체크박스나, 스위치에다가 네트워크 요청을 달아야 하는데, 사용자가 내가 의도한대로 한번-한번 천천히 클릭하는게 일반적이겠지만, 그렇지 않을 경우(굉장히 빠르게, 많이 이벤트를 발생시킬 경우) 불필요한 네트워크 요청이 매우 많아지게 된다. 그래서 제일 마지막에 요청받은 이벤트에 대해서만 네트워크 요청을 붙여주기 위해서 어떤 방법이 있는가.. 에 대한 내용이다. 다른 방법도 존재하겠지만 일단 동기화 제어를 통해서 개발을 진행하게 되었다.

그렇다면 동기화 제어란 무엇일까?



## Thread Safe?

멀티 스레드 프로그래밍에서 일반적으로 어떤 함수나 변수, 혹은 객체가 여러 스레드로부터 동시에 접근이 이루어져도 프로그램의 실행에 문제가 없음을 뜻한다. 보다 엄밀하게는 하나의 함수가 한 스레드로부터 호출되어 실행 중일 때, 다른 스레드가 그 함수를 호출하여 동시에 함께 실행되더라도 각 스레드에서의 함수의 수행 결과가 올바로 나오는 것으로 정의한다

동기화 이야기를 하는데 왜 Thread에 대한 이야기가 나오냐면

```
동기화 없이는 한 스레드가 만든 변화를 다른 스레드에서 확인하지 못할 수 있다.
동기화는 일관성이 깨진 상태를 볼 수 없게 하는 것은 물론, 동기화된 메서드나 블록에 들어간 스레드가 같은 락에 보호하에 수행된 모든 이전 수정의 최종 결과를 보게 해준다.
동기화는 배타적 실행뿐 아니라 스레드 사이의 안정적인 통신에 꼭 필요하다.

-Effective Java-
```

이렇게 분리해서 볼 수 없는 내용이다

그렇다면 동기화 제어는 어떻게 할 수 있을까?

1. 단일 스레드를 사용한다
2. Lock을 사용한다
3. ThreadSafe 자료구조를 사용한다
4. etc..

먼저 단일 스레드를 사용해서 동기화 제어를 해보자



## SingleThread

SingleThread는 말 그대로 하나의 스레드를 통해서 작업을 이어나가기 때문에 동시성(Concurrency)제어를 할 필요가 없다

Coroutine의 newSingleThreadContext를 사용한 예시이다

```kotlin
private val dispatcher = newSingleThreadContext("DelayRequestContext")

fun sendEventWithCoroutine(itemId: Long, event: SyncRequestEvent) {
    scope.launch(dispatcher) {
        /* 작업 완료는 큐에서 삭제 */
        val done = currentJobs.filter { it.value.isCompleted }
        val canceled = done.count { it.value.isCancelled }
        done.forEach {
            currentJobs.remove(it.key)
        }

        currentJobs.forEach {
            if (it.key == itemId) {
                it.value.cancel()
            }
        }
        currentJobs[itemId] = cancelableJob(event, this)
    }
}
```



## Lock

Lock은 CriticalSection을 통한 동기화 제어 기법중 하나이다.

가장 기본적인 `Synchronized`를 사용하는 예시

### Synchronized

```kotlin
@kotlin.internal.InlineOnly
public inline fun <R> synchronized(lock: Any, block: () -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }

    // Force the lock object into a local and use that local for monitor enter/exit.
    // This ensures that the JVM can prove that locking is balanced which is a
    // prerequisite for using fast locking implementations. See KT-48367 for details.
    val lockLocal = lock

    @Suppress("NON_PUBLIC_CALL_FROM_PUBLIC_INLINE", "INVISIBLE_MEMBER")
    monitorEnter(lockLocal)
    try {
        return block()
    }
    finally {
        @Suppress("NON_PUBLIC_CALL_FROM_PUBLIC_INLINE", "INVISIBLE_MEMBER")
        monitorExit(lockLocal)
    }
}
```

Synchronized 내부코드인데 block 범위를 임계영역으로 설정해서 lock을 걸어준 AnyTpye 객체를 현재 실행중인 스레드가 다른 스레드에 의해 간섭을 받지 못하도록 구현되어있다.

실제 구현은

```kotlin
fun sendEvent(itemId: Long, event: SyncRequestEvent) {
    synchronized(currentTask) {
        val queueSize = currentTask.size

        val done = currentTask.filter { it.isDone }
        val canceled = done.count { it.isCancelled }

        /* 작업 완료는 큐에서 삭제 */
        currentTask.removeAll(done)

        /* 기본동작 : 동작중인 task 가 존재하면 취소 */
        currentTask.forEach {
            it.cancel(false)
        }

        /* 요청 작업 인큐 */
        currentTask.add(
            executor.schedule(CancelableTask(event), 1500L, TimeUnit.MILLISECONDS)
        )
    }
}
```

공유객체인 currentTask에 lock을 걸어서 람다식 내의 코드들이 실행되도록 한다



### Mutex

Coroutine에서도 synchronized와 같은 역할을 하는 `Mutex`를 제공한다

```kotlin
public suspend inline fun <T> Mutex.withLock(owner: Any? = null, action: () -> T): T {
    lock(owner)
    try {
        return action()
    } finally {
        unlock(owner)
    }
}
```

lock을 통해 해당 선언된 mutex를 lock하고 lock이 걸려있는 동안 suspend한다. suspend 함수를 통해 컨트롤되기 때문에 스레드를 블록하지 않는다

coroutine에서의 lock 메서드는 tryLock을 호출하는데, 넘겨받은 owner, 즉 공유객체가 lock되어있는지 안되어있는지의 상태에 따라서 suspend block해주고 이 상태는 MutexImpl에 atomic으로 선언되어있는 값이다

```kotlin
internal class MutexImpl(locked: Boolean) : Mutex, SelectClause2<Any?, Mutex> {
    // State is: Empty | LockedQueue | OpDescriptor
    // shared objects while we have no waiters
    private val _state = atomic<Any?>(if (locked) EMPTY_LOCKED else EMPTY_UNLOCKED) 
		
		...
}
```

`atomic` 은 AtomicReference를 만들어주는 AtomicFU의 함수이다

> AtomicFU는 kotlin에서 atomic연산을 지원하는 라이브러리인데, AtomicReferenceFieldUpdater, CAS등이 적용되어있다 [AtomicFu](https://github.com/Kotlin/kotlinx.atomicfu){: class="underlineFill"}

> 해당 내용을 찾아보다가 LockFreeAlgorythm for Coroutine 관련 내용이 있어서 나중에 살펴 봐야 겠다 [Lock-free algorithms for Kotlin Coroutines](https://www.slideshare.net/elizarov/lockfree-algorithms-for-kotlin-coroutines){: class="underlineFill"}



## ThreadSafe 자료구조

Lock처럼 CriticalSection을 통한 스레드 제어는 작은단위의 스레드 한정 (Thraed Comfinement)이기 때문에 공유되는 상태를 주기적으로 변경할 때에는 적용하기 어려울 수 있다

Java에서는 이를 위해 Collections.synchronizedMap, ConcurrentMap, ConcurrentHashMap등 여러가지 자료구조를 지원한다

> 굉장히 많은 자료들이 있다
>
> [Collections.synchronizedMap vs. ConcurrentHashMap](https://www.baeldung.com/java-synchronizedmap-vs-concurrenthashmap){: class="underlineFill"}
>
> [What's the difference between ConcurrentHashMap and Collections.synchronizedMap(Map)?](https://stackoverflow.com/questions/510632/whats-the-difference-between-concurrenthashmap-and-collections-synchronizedmap){: class="underlineFill"}
>
> [ConcurrentHashMap이란 무엇일까?](https://devlog-wjdrbs96.tistory.com/269){: class="underlineFill"}



그 중 ConcurrentHashMap을 사용해서 구현을 해보자

```kotlin
private val currentHashMap: ConcurrentHashMap<Long, Job> = ConcurrentHashMap()

fun sendEvent(itemId: Long, event: SyncRequestEvent) {
    val queueSize = currentHashMap.size

    /* 작업 완료는 큐에서 삭제 */
    val done = currentHashMap.filter { it.value.isCompleted }
    val canceled = done.count { it.value.isCancelled }
    done.forEach {
        currentHashMap.remove(it.key)
    }

    /* 기본동작 : 동작중인 task 가 존재하면 취소 */
    currentHashMap.forEach {
        if (it.key == itemId) {
            it.value.cancel()
        }
    }

    currentHashMap[itemId] = cancelableJob(event, ioScope)
}
```

ConcurrentHashMap 클래스가 내부적으로 CAS 알고리즘을 통해서 동기화를 진행해준다



## Actor

마지막으로 Coroutine에서 제공하는 Actor를 사용해서 동기화를 진행해보자

```kotlin
/* ActorJob */ 
sealed class ActorJob
data class InJob(val itemId: Long, val data: Boolean) : ActorJob()
data class DoJob(val ack: CompletableDeferred<Job?>) : ActorJob()

/* actor 등록 */
lifecycleScope.launch {
    val actorResponse = CompletableDeferred<Job?>()
    actor.send(DoJob(actorResponse))
    actorResponse.await()
}

/* job의 종류에 따라서 동작 분기처리 */
@ObsoleteCoroutinesApi
fun sendEvent() = scope.actor<ActorJob> {
    for (job in channel) {
        when (job) {
            is InJob -> {
                val queueSize = currentJobs.size

                val done = currentJobs.filter { it.value.isCompleted }
                val canceled = done.count { it.value.isCancelled }
                done.forEach {
                    currentJobs.remove(it.key)
                }

                currentJobs.forEach {
                    if (it.key == job.itemId) {
                        it.value.cancel()
                    }
                }
                currentJobs[job.itemId] = cancelableJob(SyncRequestEvent(func = { println("[DoActor] 실행 : ${job.data}") }), this)
            }
            is DoJob -> job.ack.complete(currentJobs[-1])
        }
    }
}
```

`Actor`는 동기화 이슈가 있는 자원을 actor 내에서 관리하도록 하며, actor 클래스의 멤버변수로 정의되어 있는 Channel을 통해 자원으로의 접근이 가능하다. channel은 FIFO 방식의 queue 형태로 구현되어 있기 때문에 sequential한 접근을 보장해 동기화 이슈를 해결한다.



> Actor Model에서의 actor를 coroutine으로 구현한것이다
>
> **Actor Model**
>
> - 컴퓨터 과학에서 Actor model은 Actor를 병렬 컴퓨팅의 보편적인 기본 요소로 취급하는 수학적 모델이다
> - Actor는 메시지에 대한 응답으로 지역적인 결정을 내리고, 더 많은 Actor를 생성하고, 메시지를 전송하고, 수신된 다음 메시지에 응답하는 방법을 결정할 수 있다
> - Actor는 자신의 비공개 상태를 수정할 수 있지만 메시징을 통해 간접적으로만 서로에게 영향을 줄 수 있다. (이는 잠금 기반의 동기화 필요성을 없앤다.)
> - 각각의 Actor는 싱글 쓰레드로 동작하고 메시지를 차례로 처리한다. [Wiki : Actor Model]([]()){: class="underlineFill"}



#### 해당 예제 소스 : [dongsik93 git hub](https://github.com/dongsik93/blog-source/tree/master/delayRequest){: class="underlineFill"}



### 참고사이트

- [코루틴은 race condition이 발생하지 않는 것일까?](https://yk-coding-letter.tistory.com/m/16){: class="underlineFill"}
- [Collections.synchronizedMap vs. ConcurrentHashMap](https://www.baeldung.com/java-synchronizedmap-vs-concurrenthashmap){: class="underlineFill"}
- [What's the difference between ConcurrentHashMap and Collections.synchronizedMap(Map)?](https://stackoverflow.com/questions/510632/whats-the-difference-between-concurrenthashmap-and-collections-synchronizedmap){: class="underlineFill"}
- [ConcurrentHashMap이란 무엇일까?](https://devlog-wjdrbs96.tistory.com/269){: class="underlineFill"}
- [Lock-free algorithms for Kotlin Coroutines](https://www.slideshare.net/elizarov/lockfree-algorithms-for-kotlin-coroutines){: class="underlineFill"}

