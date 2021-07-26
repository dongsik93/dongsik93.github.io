---
layout: post
title: "[Kotlin] 제네릭 - 타입 파라미터 소거"
subtitle: "Kotlin Type erasure"
date: 2021-07-24 00:30:00 +0900
categories: til
tags: kotlin
comments: true
---



## **[Kotlin] 제네릭 - 타입 파라미터 소거 (Type erasure)**

> 제네릭 공부 하기
>
> 3편



이전글인 변성에 대해서 알아볼 때 제네릭은 `타입소거` 방식으로 동작한다고 작성했었는데, 정확이 더 알고싶어서 자료를 찾아보았다



JVM의 제네릭은 보통 타입 소거를 사용해 구현된다. 즉 실행 시점에 제네릭 클래스의 인스턴스에 타입 인자 정보가 들어있지 않다는 뜻이다

예를들어 `List<String>` 객체를 만들고 그 안에 문자열을 여러 개 넣더라고 실행 시점에는 그 객체를 오직 `List` 로먄 인식할 수 있다.

따라서 `is` 검사에서 타입 인자로 지정한 타입을 검사할 수 없게 된다

물론, 원소를 하나 얻어서 타입 검사를 수행할 수 있겠지만 여러 원소가 서로 다른 타입일 수도 있기 때문에 좋은 방법은 아니다

(일반적인 경우 `List<String>` 에는 문자열만 들어있음을 가정할 수 있는 이유는 **컴파일 타임에 컴파일러가 타입 인자를 인식해 올바른 타입의 값만 리스트에 넣도록 보장해주기 때문**이다.)



```kotlin
/* Error : Cannot check for instance of erased type */
if (value is List<String>) { ... }
fun checkSum(sumList: List<*>) {
    /* 캐스팅 */
    val intList = sumList as List<Int>
    println(inList.sum())
}
```

위와 같은 함수가 있으면 ,` checkSum(listOf(1,2,3))` 은 성공하겠지만, `checkSum(listOf("a", "b"))` 는 ClassCastException이 나게 된다

또 위의 `checkSum` 함수처럼 타입 파라미터가 2개 이상이라면 모든 타입 파라미터에 `*` 을 사용해서, 인자를 알 수 없는 제네릭 타입을 표현하면 된다



타입소거, 즉 타입 인자가 지워졌기 때문에 넘어온 타입인자와 다른 타입 인자로 캐스팅해도 캐스팅이 된다는 점에 주의를 해야 한다

그렇다면, 제네릭 함수가 호출되었을 때 함수의 본문에서 호출할때 쓰였던 타입 인자를 알기위해서는 어떻게 해야 할까 ?

바로 `inline` 키워드를 사용하면, 컴파일러는 그 함수를 호출한 식을 모두 함수 본문으로 바꾸게 된다.

이게 가능한 이유는 `inline` 을 통해서 **함수 바디 코드가 함수 호출부에 삽입**되기 때문에, 타입 인자가 아니라 구체적인 타입을 사용할 수 있기 때문이다.

```kotlin
inline fun <refied T> test() { ... }
```

`inline` 키워드와 `reified` 를 통해서 런타입 타입 검사를 할 수 있다

- `inline` + `reified` 를 `실체화한 타입 파라미터` 라고 한다



실체화한 타입 파라미터를 사용할 수 있는 경우

- 타입 검사와 캐스팅 (is, !is, as, as?)
- 코틀린 리플렉션 API (`::class`)
- 코틀린 타입에 대응하는 java.lang.Class 얻기 (`::class.java`)
- 다른 함수를 호출할 때 타입 인자로 사용



reified 제약

- `타입 파라미터` 의 인스턴스를 생성할 수 없다
- `타입 파라미터` 의 동반 객체 메소드를 호출할 수 없다
- 실체화한 타입 파라미터를 요구하는 함수에 실체화하지 않은 타입 파라미터로 받은 타입을 넘길 수 없다
- 클래스, 프로퍼티의 타입 파라미터를 `reified` 로 지정할 수 없다
- `inline` 과 함께 사용하여야 한다



참고사이트

- [제네릭 : 타입파라미터 소거, inline 실체화](https://umbum.dev/611){: class="underlineFill"}

- [Kotlin Generics — 실체화한 타입 파라미터](https://medium.com/hongbeomi-dev/kotlin-generics-실체화한-타입-파라미터-cfb2436946e3){: class="underlineFill"}