---
layout: post
title: "[Kotlin] Weak Reference"
subtitle: "Reference에 대한 공부"
date: 2022-01-09 23:00:00 +0900
categories: til
tags: kotlin
comments: true

---



# [Kotlin] Weak Reference



> JVM에 대해서 간단히 알아보았으니 이제 WeakReference에 대해서 알아보자



## Reference

- Reference는  `Strong references`, `Soft references`, `Weak references`, `Phantom references` 로 분류할 수 있다
- 이렇게 나뉘어진 이유는 적절한 Reference를 사용해서 GC에 의해 제거될 데이터에 우선순위를 적용하여 효율적인 메모리 관리를 하기 위함이다
- Strong < Soft < Weak < Phantom순으로 GC에 의해 제거될 우선순위가 높다



## GC (Garbage Colleciton)

- Reference에 대해 알아보기에 앞서 GC에대해 알아보도록 하자
- GC는 동작방식에 따라 다양한 종류가 있지만 크게 다음 2가지 작업을 수행한다
    - 힙(heap)내의 객체 중에서 가비지를 찾아낸다
    - 찾아낸 가비지를 처리해서 힙의 메모리를 회수한다
- GC의 객체 판별은 [GC와 Reachability](https://d2.naver.com/helloworld/329631){: class="underlineFill"}  여기에 친절하게 나와있어서 여기를 참고하면 된다



## Reference 종류



### Strong Reference

- 흔히 객체를 생성하게되면 생기게 되는 참조
- Strong Referene를 통해 참조되고 있는 객체는 가비지 컬렉션의 대상에서 제외된다(strongly reachable하기 때문에)

```
Another common problem with strong references is caching, particular with very large structures like images. 
Suppose you have an application which has to work with user-supplied images, like the web site design tool I work on. 
Naturally you want to cache these images, because loading them from disk is very expensive and you want to avoid the possibility of having two copies of the (potentially gigantic) image in memory at once.

Because an image cache is supposed to prevent us from reloading images when we don't absolutely need to, 
you will quickly realize that the cache should always contain a reference to any image which is already in memory. 
With ordinary strong references, though, that reference itself will force the image to remain in memory, 
which requires you (just as above) to somehow determine when the image is no longer needed in memory and remove it from the cache, 
so that it becomes eligible for garbage collection. Once again you are forced to duplicate the behavior of the garbage collector and manually determine whether or not an object should be in memory.
```

- Image를 cache에 로딩할 때 strong reference의 문제점
- Image를 cache할 때 메모리에 있는 이미지에 대한 참조를 항상 포함해야 하는데, strong reference가 있다면 그 참조 자체가 이미지를 메모리에 남겨두도록 강제하기 때문에 수동으로 처리를 해줘야 한다고 한다



### Soft Reference

- 강한 참조와는 다르게 GC에 의해 수거될 수도 있고, 수거되지 않을 수도 있다. 메모리에 충분한 여유가 있다면 GC가 수행되고 있다 하더라도 수거되지 않는다.
- 메모리가 적은 모바일 기기 특성상 weak reference와 동작하는게 크게 다르지 않다



### Weak Reference

- 명시적으로 weak reference를 사용함으로써 해당 객체가 GC에 의해 수거될 수 있도록 유도한다
- weak reference를 사용하면 GC가 reachability를 판단하는데 힌트를 줄 수 있다

```
Reference queues

The ReferenceQueue class makes it easy to keep track of dead references. 
If you pass a ReferenceQueue into a weak reference's constructor, 
the reference object will be automatically inserted into the reference queue when the object to which it pointed becomes garbage.
You can then, at some regular interval, process the ReferenceQueue and perform whatever cleanup is needed for dead references.
```

- Reference Queue 클래스를 사용하면 활성화 되지 않은 참조들을 쉽게 추적할 수 있다. Reference Queue를 약한 참조의 생성자로 전달하게 되면 참조 객체가 가리키는 객체가 GC에 의해 수거될 때 자동으로 처리된다

```kotlin
class ReferenceTest {
    class TestData {
        private val array = IntArray(2500)
    }
    private val weakRefs: MutableList<WeakReference<TestData>> = LinkedList()
    private val softRefs: MutableList<SoftReference<TestData>> = LinkedList()
    private val strongRefs: MutableList<TestData> = LinkedList()

    fun weakReferenceTest() {
        try {
            var i = 0
            while (true) {
                weakRefs.add(WeakReference<TestData>(TestData()))
                i++
            }
        } catch (e: OutOfMemoryError) {
            /* weak일 경우 out of memory 발생 하지 않는다 */
            println("out of memory! $e")
        }
    }

    fun softReferenceTest() {
        try {
            var i = 0
            while (true) {
                softRefs.add(SoftReference<TestData>(TestData()))
                i++
            }
        } catch (e: OutOfMemoryError) {
            /*  weak일 경우 out of memory 발생 하지 않는다 */
            println("out of memory! $e")
        }
    }

    fun strongReferenceTest() {
        try {
            var i = 0
            while (true) {
                strongRefs.add(TestData())
                i++
            }
        } catch (e: OutOfMemoryError) {
            /* Strong일 경우 out of memory 발생 */
            println("out of memory! $e")
        }
    }

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            println("start")
            val test = ReferenceTest()
//            test.weakReferenceTest()
//            test.softReferenceTest();
            test.strongReferenceTest();
            println("finish")
        }
    }
}
```

- Storng, Soft, Weak Reference의 예
    - `Strong Reference`의 경우 OOM이 발생해 finish가 출력된다
    - `Soft / Weak Reference`의 경우 GC에 의해 메모리를 수거해서 사용하고 있기 때문에 finish가 출력되지 않는다



### Phantom Reference

- Soft / Weak와는 달리 get() 사용히 언제나 null을 리턴하며, 보통 해당 객체가 죽었는지 살았는지를 판단하기 위해서 사용한다

- Reference Queue의 사용은 필수적이다

- `Weak Reference`와의 명확한 차이점은 저 Reference Queue에 enqueue 시점인데, Weak Reference의 경우 객체가 weakly reachable이라고 판단될 때 enqueue된다. (아직 finalize()와 GC가 일어나지 않은 상태를 말함)

    > **finalize()**
    >
    > GC가 언제 객체를 제거할지에 대해 알고자 하는 등의 작업이 필요할때 `finalizer`를 사용한다
    >
    > GC가 특정 객체에 대해 unreachable이라고 판단하게되면 객체 내에서 finalize()메소드가 있는지를 확인하고, 존재하지 않는다면 GC는 이후에 객체를 메모리로부터 제거한다
    >
    > finalize()메소드가 존재한다면, 이 객체를 메모리로부터 제거하기 이전에, reachable을 두번 확인해서 unreachable을 확인해야 한다는 것이다.

- 이런 경우 finalize() 내부 구현에 따라서 객체가 다시 resurrection 될 수 있다

- `Phantom Reference`의 경우 해당 객체가 물리적으로 제거된 후에 enqueue 되기 때문에 get()함수에서 null이 반환되고 finalize()때문에 다시 살아날 수가 없다

- 그렇다면 Phantom Reference는 사용는가?

    - 명확하게 메모리에서 제거되었는지 확인이 필요한 경우에 사용한다
    - 고질적인 finalization 문제를 피할 수 있다 (객체가 다시 resurrection되는 경우)

- finalize()를 쓰는것 보다 phantom reference를 사용하는것이 훨씬 더 안전하고 효율적이다



#### 참고사이트

- [Java Reference와 GC](https://d2.naver.com/helloworld/329631){: class="underlineFill"}

- [Java의 메모리 관리 - Weak, Soft, Phantom reference](https://tourspace.tistory.com/42){: class="underlineFill"}
- [자바 강한참조(Strong Reference)와 약한참조(Weak Reference)](https://ktko.tistory.com/entry/%EC%9E%90%EB%B0%94-%EA%B0%95%ED%95%9C%EC%B0%B8%EC%A1%B0Strong-Reference%EC%99%80-%EC%95%BD%ED%95%9C%EC%B0%B8%EC%A1%B0Weak-Reference){: class="underlineFill"}

- [Finalized()와 *Reference의 사용](https://frontjang.info/entry/javalangref-4-Finalize){: class="underlineFill"}

