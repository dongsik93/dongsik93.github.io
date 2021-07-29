---
layout: post
title: "[Kotlin] Lazy"
subtitle: "Firebase Remote Config"
date: 2021-07-29 22:50:00 +0900
categories: til
tags: kotlin
comments: true
---



# [Kotlin] Lazy



> Lazy 동작방식이 궁금하다 알고쓰자 lazy..... 



### lazy 란?

- 초기화 지연
- 호출 시점에 `by lazy` 정의에 의해서 초기화를 진행한다
- val(immutable) 에서만 사용이 가능하다
- 초기화를 위해서는 함수명이라도 적어야 한다
- lazy를 사용하는 겨웅 기본 `Synchronized` 로 동작한다



### Delegated property

- lazy를 이해하기 위해서는 프로퍼티 위임(delegated property)을 이해해야 한다
- 프로퍼티 위임은 프로퍼티에 대한 getter / setter를 위임해 위임받은 객체로 하여금 값을 읽고 쓸 때 어떠한 중간 동작을 수행하는 기능이다



- 예시 코드

```kotlin
val / var <property name>: <Type> by <delegate>
val sampleAdapter: SampleAdapter by lazy { SampleAdapter(data)) }
```

- `by <delegate>` 형식으로 프로퍼티 위임을 선언할 수 있다
- `val sampleAdapter: SampleAdapter` 까지가 property 이고
- `by lazy { SampleAdapter(data)) }` 까지가 delegate 이다



### lazy 동작 방식

- **LazyJVM.kt** 파일에 선언되어있는 lazy의 모습이다

```kotlin
/* 기본적으로 람다를 전달받아서 처리 */
public actual fun <T> lazy(initializer: () -> T): Lazy<T> = SynchronizedLazyImpl(initializer)

/* thread mode를 선택해서 처리 */
public actual fun <T> lazy(mode: LazyThreadSafetyMode, initializer: () -> T): Lazy<T> =
    when (mode) {
        LazyThreadSafetyMode.SYNCHRONIZED -> SynchronizedLazyImpl(initializer)
        LazyThreadSafetyMode.PUBLICATION -> SafePublicationLazyImpl(initializer)
        LazyThreadSafetyMode.NONE -> UnsafeLazyImpl(initializer)
    }
```

- 기본적인 람다를 전달받아서 처리하는 경우
    - lazy()는 람다를 전달받아서 저장한 Lazy<T> 인스턴스를 반환한다
    - **최초 getter 실행은 lazy()에 넘겨진 람다를 실행하고, 결과를 기록**한다. 이후 getter 실행은 **기록된 값을 반환**한다
    - 즉, lazy는 프로퍼티의 값에 접근하는 최초 시점에 초기화를 수행하고, 결과를 저장한 뒤 기록된 값을 재반환하는 인스턴스를 생성하는 함수이다
    - `SynchronizedLazyImpl` 을 호출하고있는 모습을 볼 수 있다
- mode를 선택해서 넘겨주는 경우
    - SYNCHRONIZED : `SynchronizedLazyImpl`
        - 기본값이 SYNCHRONIZED
        - 초기화가 최초 호출되는 단 하나의 스레드에서만 처리된다
        - 다른 스레드는 이후 그 값을 그대로 참조한다
    - PUBLICATION : `SafePublicationLazyImpl`
        - 여러 스레드에서 동시에 호출될 수 있으며, 초기화도 모든 혹은 일부의 스레드들에서 동시에 실행이 가능하다
        - 다른 스레드에서 이미 초기화된 값이 할당되었다면 별도의 초기화를 수행하지 않고, 그 값을 반환한다
    - NONE : `UnsafeLazyImpl`
        - 초기화가 되지 않은 겨웅 무조건 초기화를 실행하여 값을 기록한다
        - 멀티스레딩에서는 NPE가 발생할 수 있어서 안전하지 않다



### SynchronizedLazyImpl

```kotlin
private class SynchronizedLazyImpl<out T>(initializer: () -> T, lock: Any? = null) : Lazy<T>, Serializable {
    private var initializer: (() -> T)? = initializer // #1
    @Volatile private var _value: Any? = UNINITIALIZED_VALUE // #2
    // final field is required to enable safe publication of constructed instance
    private val lock = lock ?: this

    override val value: T
        get() {
            val _v1 = _value
            if (_v1 !== UNINITIALIZED_VALUE) { // #3
                @Suppress("UNCHECKED_CAST")
                return _v1 as T
            }

            return synchronized(lock) { // #4
                val _v2 = _value
                if (_v2 !== UNINITIALIZED_VALUE) {
                    @Suppress("UNCHECKED_CAST") (_v2 as T)
                } else { 
                    val typedValue = initializer!!()
                    _value = typedValue // #5
                    initializer = null // #6
                    typedValue
                }
            }
        }

    override fun isInitialized(): Boolean = _value !== UNINITIALIZED_VALUE

    override fun toString(): String = if (isInitialized()) value.toString() else "Lazy value not initialized yet."

    private fun writeReplace(): Any = InitializedLazyImpl(value)
}
```

- `synchronized` 를 호출하기 때문에 기본적으로 `Thread safe` 구조이다

    > Thread Safe 어떤 함수나 변수, 혹은 객체가 여러 스레드로부터 동시에 접근이 이루어져도 프로그램의 실행에 문제가 없음을 뜻한다

- 특별히 모드를 선택하지 않으면 기본적으로 단 한번만 초기화를 수행하는 `SynchronizedLazyImpl`  [구현코드]([]()){}이다

- `#1` : 전달된 initializer 람다를 `initializer` 프로퍼티에 저장한다

- `#2` : `_value` 프로퍼티를 통해 값을 저장하지만, 초기화 전 이기 때문에 초기값인 `UNINITIALIZED_VALUE` 를 저장

- `#3` : 다른 스레드에서 synchronized() 블록에 진입해 이미 초기화가 끝날 수 있으므로, `_value` 의 `UNINITIALIZED_VALUE` 여부를 체크해서 값이 있으면 해당 값을 그대로 반환한다

- `#4` : `synchronized()` 를 통해서 초기화 블록을 실행한다

- `#5` : 아직 초기화가 되어있지 않다면, 람다식을 처리하고 반환값을 저장한다

- `#6` : 초기화 완료에 따라 불필요해진 `initializer` 는 null로 초기화한다



참고사이트

- [Kotlin의 프로퍼티 위임과 초기화 지연은 어떻게 동작하는가](<https://medium.com/til-kotlin-ko/kotlin-delegated-property-by-lazy%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8F%99%EC%9E%91%ED%95%98%EB%8A%94%EA%B0%80-74912d3e9c56>){}
- [Kotlin lazy property - lateinit/lazy 살펴보기](<https://thdev.tech/kotlin/2018/03/25/Kotlin-lateinit-lazy/>){}

