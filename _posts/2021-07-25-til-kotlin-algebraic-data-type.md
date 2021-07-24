---
layout: post
title: "[Kotlin] 대수적 타입"
subtitle: "Kotlin Algebraic data type"
date: 2021-07-25 00:30:00 +0900
categories: til
tags: kotlin
comments: true
---



# [Kotlin] 대수적 타입 (algebraic data type)



> SealedClass를 공부하기 전 사전지식 공부 🙃



대수적 타입이란 ?

- 다른 자료형의 값을 가지는 자료형
- 부분으로 전체를 나타내는 타입을 대수적 타입이라고 한다
- 대수적 데이터 타입은 `합타입`과 `곱타입`으로 이루어진다



### 합타입 enum class / sealed class

- `Fruit = APPLE or ORAGNE or GRAPE` 으로 표시할 수 있는데 이런 타입을 `합타입`이라고 한다

- 합타입은 패턴매칭에 매우 유용하다. 왜냐하면 생성시점에 모든 타입에 대해 알고 있기 때문에 모든 타입에 대해 처리가 가능한다

- 따라서 모든 타입에 대해 처리가 되어 있다면 `else` 구문이 필요 없다

- 합타입을 사용하면 타입을 강제하면서 동시에 다형성을 표현할 수 있다

- **`enum class`**
    - enum class 생성시 모든 타입을 정의한다. 따라서 enum class로 추상화한 타입을 모두 알 수 있다
    
    > 타입이 정해지기 때문에 다국어 처리시 변환된 string으로 선언하게 되면 설정에서 언어를 바꾸더라도 이미 선언된 string을 불러와서 다국어가 적용이 안되는 문제가 있었다 ..!
    
    - 그래서 else 구문이 필요 하지 않다.
    - 주의할 점은 모든 타입에 대한 패턴매칭을 구현해야 한다 -> 에러 발생
    
- **`sealed class`**
    - sealed class 역시 타입을 제한하고 추상화 하는데 유용하다
    - 다른점은 enum class의 경우 모두 같은 타입의 변수와 같은 타입의 함수를 가져야 하는 반면 seald class는 서로 다른 타입의 변수, 함수를 각각 가질 수 있다



### statement와 expression

- 코틀린에서 `when`은 statement(문) 이면서 동시에 expression(식) 이다

```kotlin
enum class Fruit {
    APPLE, ORANGE, GRAPE
}

fun whenIsStateMent(fruit: Fruit) {
    when (fruit) {
        Fruit.APPLE -> test.a()
        Fruit.ORAGNE -> test.b()
        Fruit.GRAPE -> test.c()
    }
}

fun whenIsExpression(fruit: Fruit) = when (color) {
    Fruit.APPLE -> test.a()
    Fruit.ORAGNE -> test.b()
    Fruit.GRAPE -> test.c()
}
```

- `whenIsStateMent` 함수의 when은 `문` 이다. fruit에 따라서 패턴매칭을 하고, 매칭이 되는게 있으면 해당 코드를 실행하게 된다
- `whenIsExpression` 함수의 when은 해당 코드 결과를 리턴까지 하게 되므로 `식`이다

- **식**으로 판단 되면 모든 값의 분기가 강제되기 때문에 위와 같은 enum class에 값이 하나 추가되면 `whenIsExpression` 함수는 **컴파일 에러**가 발생하기 때문에 체크하기가 쉽지만, `whenIsStateMent` 같은 **문**은 **warning**만 발생하기 때문에 모든 코드를 쫓아 다니면서 case를 추가 해야 해서 빈번하게 누락하는 경우가 생긴다



참고 사이트

- [대수적 데이터 타입이란? With Kotlin](https://medium.com/@lazysoul/%EB%8C%80%EC%88%98%EC%A0%81-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%83%80%EC%9E%85%EC%9D%B4-algebraic-data-type-%EC%9D%B4%EB%9E%80-26d9e73d96b6){: class="underlineFill"}

- [Kotlin - enum / sealed class 그리고 대수적 타입](https://blog.leocat.kr/notes/2020/02/08/kotlin-enum-and-algebraic-data-type){: class="underlineFill"}

