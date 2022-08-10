---
layout: post
title: "[Kotlin] Value Class"
subtitle: "Value Class란 무엇일까"
date: 2022-08-10 18:30:00 +0900
categories: til
tags: kotlin
comments: true

---



# [Kotlin] Value Class



## Value Class

객체를 생성하는 비용을 줄여주는 class

```kotlin
@JvmInline
value class Color private constructor(val rgb: Int) {
		companion object {
				fun rgb(rgb: Int) = Color(rgb)
		}
}
```

위 처럼 사용이 가능하다

생성시 주의사항

- Primary constructor is required for value class
- Inline class must have exactly one primity constructor parameter



그렇다면 언제 사용이 가능할까?



### When use Value Class

```kotlin
changeBackground(000000)
```

저 한줄만 보자면 000000이 의미하는게 rgb인지 어떤건지 이해하기 힘들다. 이럴때 래퍼클래스를 사용한다

```kotlin
changeBackground(Color.rgb(000000))
```

이런식으로 `Color` 클래스와 같은 래퍼클래스를 사용하게 되면 함수의 가독성은 좋아지지만, 함수를 호출할 때마다 객체를 생성해서 호출해야 한다는 비용이 발생하게 된다.

이러한 상황에서 비용을 줄여보자! 라고 나온게 `inline class` , 즉 `value class` 이다.



### 최적화

그렇다면 value class는 어떻게 비용을 줄이는걸까?

```kotlin
@JvmInline
value class Color private constructor(val rgb: Int) {
		companion object {
				fun rgb(rgb: Int) = Color(rgb)
		}
}
```

`value` 키워드

- value 키워드를 통해 value class를 정의할 수 있다
- 이렇게 정의된 value class는 컴파일러에 의해 최적화의 대상이 된다

```
@JvmInline Annotation
```

- Specifies that given value class is inline class라는 설명이 되어있다

그렇다면 직접 바이트코드를 뜯어보자

```kotlin
fun manglingTest(message: String, rgb: Color) {
    println("message : $message, duration: $duration")
}
```

아래와 같은 코드로 변환된다

```java
public final void manglingTest_PX5PXBo/* $FF was: manglingTest-PX5PXBo*/(@NotNull String message, int rgb) {
    Intrinsics.checkNotNullParameter(message, "message");
    String var3 = "message : " + message + ", duration: " + Color.toString-impl(rgb);
    System.out.println(var3);
 }
```

`manglingTest_agtYESI` 이렇게 변환이 된다. 이름이 왜 이렇게 변하는걸까? 바로 맹글링처리를 해주기 때문이다.



### 맹글링?

소스 코드에 선언된 함수 또는 변수의 이름을 컴파일러 단계에서 컴파일러가 일정한 규칙을 가지고 변형하는 것을 의미한다

객체지향적 프로그래밍을 위해 컴파일러가 오버로딩과 네임스페이스별 함수 및 변수를 구별할 수 있도록 함으로써 에러 없이 정상적으로 동작하는 프로그램을 만들기 위해 필요하다

이렇게 맹글링은 하는 이유는 다른 inline 클래스의 인스턴스를 사용하는 함수를 원활하게 오버로드하고, inline 클래스의 내부 제약 조건에 위반되는 Java 코드의 우발적 호출을 방지할 수 있기 때문이다.

이렇게 컴파일러의 맹글링 과정을 거쳐 `color` 변수는 컴파일 중에 `Color` 유형을 갖지만 바이트코드에서 `Int`로 대체된다.

하지만 이 변수를 컬렉션에 저장하거나 제네릭 함수에 전달하면 `Color` 일반 객체에 박싱이된다.

```kotlin
genericFunc(color)         // boxed
val list = listOf(color)   // boxed
val first = list.first()   // unboxed back to primitive
```



### vs Data Class

- 자동으로 생성하는 메서드가 다르다

    - ```
        data class
        ```

        - equals, toString, hasCode, copy, componentN

    - ```
        value class
        ```

        - equals, toString, hasCode

- === 연산 허용 여부

    - data class는 ==, === 모두 허용
    - value class는 ==만 허용

- Immutable Property

    - data cass는 val, var 둘다 허용
    - value class는 val, 즉 immutable만 허용

- one property

    - value class에 프로퍼티를 하나만 정의 가능하다.



#### 참고사이트

- [Kotlin 1.4.30의 새로운 언어 기능 테스트 버전](https://blog.jetbrains.com/ko/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/#inline-value-classes-stabilization){: class="underlineFill"}

- [Kotlin value class](https://mahendranv.github.io/posts/kotlin-value-class/#:~:text=From%20Kotlin%201.5%20%E2%80%94%20we%20have%20value%20class,sure%20there%20is%20no%20overhead%20due%20to%20wrapping.){: class="underlineFill"}
- [Kotlin 1.5에 추가된 value class에 대해 알아보자](https://velog.io/@dhwlddjgmanf/Kotlin-1.5%EC%97%90-%EC%B6%94%EA%B0%80%EB%90%9C-value-class%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90){: class="underlineFill"}