---
layout: post
title: "[Kotlin] Sealed Class"
subtitle: "Kotlin Sealed class"
date: 2021-07-25 18:50:00 +0900
categories: til
tags: kotlin
comments: true
---



# [Kotlin] Sealed Class



> 저번글에 이어서 Sealed Class에 대해서 공부 📖 
>
> 이전글 : [[Kotlin] 대수적 타입](https://dongsik93.github.io/til/2021/07/24/til-kotlin-algebraic-data-type/){: class="underlineFill"}



### Sealed Class란?

- Superr class를 상속받는 child 클래스의 종류를 제한하는 특성을 갖고 있는 클래스이다.
- 이렇게 하위 클래스를 제한하여 얻을 수 있는 장점 중 하나는 `when`을 사용할 때 `else`를 사용하지 않아도 된다는 것이다
    - 컴파일 시점에 존재할 수 있는 클래스 타입이 정해져 있기 때문이다
    - 이러한 특성의 장점은 클래스를 비교해서 처리해야하는 로직에서 신규 클래스를 추가하고 조건 검사 로직에서 누락되어 예외 사항이 발생시키는 상황을 방지할 수 있다
- enum class는 하위 객체를 Singleton처럼 1개만 생성할 수 있고, 복수의 객체를 생서할 수 없는 반면 sealed class는 **1개 이상의 객체를 생성할 수 있는 차이점**이 있다



### Sealed Class 정의

- 클래스 앞에 `sealed` 키워드를 붙여서 선언한다

```kotlin
sealed class Color

object Red: Color()
object Green: Color()
object Blue: Color()

/* 중첩 클래스로 정의한 경우 */
sealed class Color {
    object Red: Color()
    object Green: Color()
    object BLue: Color()
}
val color : Color = Color.red
```

- Sealed Class는 **abstract 클래스**로, 객체로 생성할 수 없다
- Sealed Class의 생성자는 **private**이고, public으로 설정할 수 없다

- Sealed Class와 그 **하위 클래스는 동일한 파일**에 정의되어야 한다
    - 서로다른 파일에서 정의할 수 없다
    - 하위 클래스는 `class`, `data class`, `object class` 로 정의할 수 있다

```kotlin
sealed class NetworkStatus {
    data class Success(val data: String) : NetworkStatus()
    data class Fail(val err: Exception) : NetworkStatus()
    object Progress : NetworkStatus()
}
```



- Generic으로 선언해서 사용하게 되면 더 사용성이 좋아진다

```kotlin
sealed class NetworkStatus<out T : Any> {
    data class Success<out T : Any>(val data: T) : NetworkStatus<T>()
    data class Fail<out T : Any>(val err: Exception) : NetworkStatus<T>()
    object Progress : NetworkStatus<Nothing>()
}
```

- 저번에 공부했던 `out` 키워드를 사용해서 정의할 수 있다

    > [제네릭 - 변성](https://dongsik93.github.io/til/2021/07/18/til-kotlin-generic-variance/){: class="underlineFill"}



참고사이트

- [Sealed Classes](https://pluu.gitbooks.io/kotlin/content/d074-b798-c2a4-c640-c624-be0c-c81d-d2b8/sealed-d074-b798-c2a4.html){: class="underlineFill"}
- [Kotlin - Sealed class 구현 방법 및 예제](https://codechacha.com/ko/kotlin-sealed-classes/){: class="underlineFill"}

