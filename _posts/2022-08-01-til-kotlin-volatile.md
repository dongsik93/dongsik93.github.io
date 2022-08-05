---
layout: post
title: "[Kotlin] @Volatile"
subtitle: "Volatile이란?"
date: 2022-08-01 18:50:00 +0900
categories: til
tags: kotlin
comments: true


---



# [Kotlin] @Volatile



### @Volatile 키워드

volatile 키워드는 Java 변수를 메인메모리에 저장하겠다는 것을 명시하기 위해 사용한다

![volatile_1.png](/img/in-post/volatile_1.png)

volatile 변수를 사용하고 있지 않는 경우에는 Task를 수행하는 동안 성능 향상을 위해 메인메모리에서 읽은 변수 값을 캐시에 저장하게 된다. 멀티쓰레드 애플리케이션의 경우 각 쓰레드를 통해 CPU에 캐싱한 값이 서로 다를 수 있다. 흔히말하는 쓰레드 동기화 문제이다.

저번에 정리했었던 쓰레드 동기화 문제를 해결하기 위한 방법 이외에 @Volatile 키워드를 붙이는 방법이 하나 더 존재하는 것이다

> [저번에 작성한 Thread-safe 관련 포스팅](https://dongsik93.github.io/til/2022/06/30/til-android-delayrequest-thread-safe/){: class="underlineFill"}



그렇다면 이 volatile에 대해서 좀 더 알아보도록 하자

```java
/**
 * Marks the JVM backing field of the annotated property as `volatile`, meaning that writes to this field
 * are immediately made visible to other threads.
 */
@Target(FIELD)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
public actual annotation classVolatile
```

어노테이션 클래스로 선언된 코드이다

volatile 키워드를 사용하는 경우 접근 가능한 변수의 값을 캐시를 통해 사용하지 않고 메인메모리에 접근해서 읽고 쓴다고 했는데, 이 volatile을 사용하는 것만으로도 완벽한 동기화를 할 수 없으며 여러가지 문제점 또한 가지고 있다.

- CPU 캐시를 참조하는 것 보다 메인메모리를 참조하는 것이 비용이 더 많이 들기 때문에, 성능은 저하될 수 밖에 없다
- volatile 변수는 읽기 쓰기가 JVM에 의해 reordering 되지 않는다
    - volatile 읽기 / 쓰기 이후의 연산들은 반드시 읽기 / 쓰기 이후에 이루어 진다
    - JVM의 instruction reorder 동작을 못하도록 막기 때문에 성능이 저하된다 (해당 내용은 좀 더 찾아볼 것)
- volatile 변수는 read시 항상 최신값을 반환하지만, 여러 쓰레드가 동시 읽기, 쓰기를 하면 쓰기 시점을 알 수 없기 때문에 여전히 동기화 문제가 일어난다



사용 예시

```kotlin
@Volatile
private var INSTANCE: TestLibraryManager? = null

fun initialize(context: Context) {
    INSTANCE ?: synchronized(this) {
        TestLibraryManager(context).also { INSTANCE = it }
    }
}

fun getInstance() = INSTANCE ?: throw IllegalStateException("TestLibraryManager not initialized !")
```

전역적으로 사용되는 라이브러리의 경우 해당 라이브러리의 instance는 여러 쓰레드에서 읽기 작업이 일어나고, 해당 변수의 값이 항상 최신의 값 (동기화가 된)으로 읽어와야 되기 때문에 해당 클래스 객체를 생성할때는 synchronized를 사용해 준다.

클래스 객체에 접근할 때를 위해 @Volatile을 위와 같이 사용해준다.





### 참고사이트

- [코틀린/자바의 volatile에 대해서](https://www.charlezz.com/?p=45959){: class="underlineFill"}
- [[Kotlin] 코틀린 - 코루틴#8 - 동기화제어](https://tourspace.tistory.com/163){: class="underlineFill"}

