---
layout: post
title: "[Kotlin] TDA원칙이란"
subtitle: "Tell, dont's ask!"
date: 2022-10-30 12:00:00 +0900
categories: til
tags: kotlin oop
comments: true


---



# [Kotlin] TDA원칙이란



### TDA란?

Tell, don’t ask로, **물어보지 말고 그냥 시켜라** 라는 말로 번역된다.

객체지향적 사고방식 원칙 중 하나로, 객체에게 정보를 요구하지 말고 그냥 행위하도록 시키라는 의미로 보면 될것같다.

객체에게 정보를 요구하지 말라는것은, 데이터를 getter로 요청하지 말 것을 의미한다. 왜 요청하지 말라고 하는것일까?



#### 문제점

1. 코드가 복잡해진다

    데이터를 가지고 있으면 데이터를 핸들링 해야 한다. 핸들링하는 코드는 단순히 전달하거나 저장하는데만 그치는 경우도 있고, 데이터 값의 범위에 따라서 조건문이나 제어문이 필요한 경우도 있다. 어떤 식으로든 코드가 늘어나면 문제가 생기는 것은 당연하다.

2. **데이터의 변경에 다수의 객체가 영향을 받는다**

    일단 데이터를 가지고 있으면 더이상 쓸모없는 데이터여서 지우거나, 새로운 데이터가 더해지거나 데이터의 타입이 변경되는 등의 여러가지 변경사항에 영향을 받게 된다. 이는 OCP(Open Close Principle) 원칙을 위배하게 된다.

3. **데이터의 무결성**을 지키기 어렵다

    각 객체들이 가지고 있는 데이터 값이 시간에 따라서 달라짐으로써 관리가 어려워지게 된다. 특히 멀티 쓰레드 환경에서 여러 곳에 데이터가 흩어져 있으면 데이터의 무결성을 지키기는 더더욱 어렵고 복잡해진다.

4. 중복 코드가 발생할 가능성이 높다

    한가지 데이터는 보통 소프트웨어 전체에서 한가지 용도로 사용된다. 따라서 하나의 데이터를 다루는 코드들은 유사성이 매우 높다. 이 코드들은 애초에 한번만 작성되도록 만들어져야 하는데 데이터가 여러 객체로 전달되고 나면 중복 코드가 발생하는 것은 거의 필연적이다.



간단한 코드로 위 내용을 살펴보자

```kotlin
data class Capacity(
    val totalSize: Long,
    val usedSize: Long,
    val remainSize: Long
)
```

비즈니스 로직을 수행할 때, **남은 용량이 0보다 클 경우**에 처리를 해주어야 한다고 가정하면, 이 Capacity 객체를 매개변수로 받는 메소드에 아래 코드처럼 구현할 수 있다.

```kotlin
fun checkRemainSize(capacity: Capacity) {
    if (capacity.remainSize > 0) {
        // 0보다 클때
    } else {
        // 0보다 작을 때
    }
}
```

이렇게 구현을 이곳 저곳에 해놓았다고 해보자. 추후에 **요구사항이 변경되어 사용량이 있을 경우**에 또 다른 처리를 해달라고 한다고 가정해보자. 다음과 같이 구현할 수 있다.

```kotlin
fun checkRemainSize(capacity: Capacity) {
    if (capacity.remainSize > 0L && capacity.usedSize > 0L) {
        // 0보다 클때
    } else {
        // 0보다 작을 때
    }
}
```

기존에 해당 조건을 사용하고 있던 모든 곳을 찾아서 위와 같은 조건으로 수정을 해주어야 한다. 이러한 조건들이 또 다시 변경되게 된다면 조건이 변경될 때마다 모든 서비스의 코드를 수정해주어야 하는 문제점이 나타나게 된다.



이럴때 TDA를 적용해서 문제를 해결할 수 있다

```kotlin
data class Capacity(
    private val totalSize: Long,
    private val usedSize: Long,
    private val remainSize: Long
) {
    fun isValid(): Boolean {
        return remainSize > 0L
    }
}
```

Capacity클래스의 프로퍼티를 private으로 정의해주고, 해당 로직을 체크해주는 메소드를 구현해준다.

그렇다면

```kotlin
fun checkRemainSize(capacity: Capacity) {
    if (capacity.isValid()) {
        // 0보다 클때
        } else {
        // 0보다 작을 때
    }
}
```

이렇게 Capacity를 사용하는 객체에서는 isValid()를 사용해서 필요한 기능을 제공하고, 상세한 구현을 감출 수 있게 된다.

여기에서 요구사항이 변경되게 된다면 isValid()만 수정해주면 되기 때문에 해당 메소드를 사용하는 부분 모두 수정할 필요가 없어지게 된다.



#### 참고사이트

- [TellDontAsk](https://martinfowler.com/bliki/TellDontAsk.html){: class="underlineFill"}
- [Tell, dont' ask 원칙(TAD원칙)](https://effectiveprogramming.tistory.com/entry/Tell-dont-ask){: class="underlineFill"}