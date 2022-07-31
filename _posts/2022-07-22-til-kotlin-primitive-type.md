---
layout: post
title: "[Kotlin] Primitive Type in Kotlin"
subtitle: "Primitive type? Wrapper Type?"
date: 2022-07-31 16:00:00 +0900
categories: til
tags: kotlin
comments: true


---



# [Kotlin] Primitive Type in Kotlin



> 얼마전 카카오톡 오픈채팅에서 한 유저가 Kotlin에는 primitive type도 없어서 성능 구리겠네 ㅋ 라는 채팅이 올라온적이 있었다. 부방장이 kotlin에는 primitive type이 없지만 런타임시점에 가능한 효율적인 방식으로 표현된다고 했는데, 이 점이 궁금해져서 포스팅을 하게 되었다.



### Java Primitive type ? Wrapper Class ?

primitive type변수는 자바에서 제공하는 기본적인 데이터 형의 변수이다 (int, short int, float, double …)

wrapper class는 primitive type을 객체화한 형태로 Integer, Float, Double등이 존재한다

**왜 이렇게 나뉘어져 있는가?** 에 대해서 알아보면 Integer 클래스를 내부적으로 들어가보면 number 클래스를 상속받고, number 클래스는 Object 클래스를 상속받는다. 따라서 Integer 클래스는 메모리에 Object 클래스가 가지는 변수들 뿐 아니라 number 클래스가 가지는 변수들을 모두 담고있다. 이렇게 객체가 상속받는 모든 클래스의 변수들을 모두 가지고 있기 때문에 메모리사이즈가 커지게 되므로 primitive type이 필요하다.

또한 primitive type만이 비트연산이 가능하며 primitive type은 heap에 할당하지 않고 스택에 value를 바로 저장해 성능을 향상시켰다.

반면 제네릭 등 자바에서 제공하는 자료구조에 데이터를 넣을 때에는 객체로만 넣을 수 있기 때문에 primitive type 변수를 wrapping해서 넣어야 하기 때문에 Wrapper class가 존재한다고 볼 수 있다



### Kotlin primitive type?

코틀린에서는 primitive type(원시 타입)과 wrapper type(래퍼 타입)을 구분하지 않는다. 그렇다면 primitive type이 가지는 성능상의 이점 등은 코틀린에서 사라지게 된 것일까?

**코틀린에서는 컴파일시 자바의 primitive, wrapper type으로 자동 변환된다**

런타인 시점에 가능한 가장 효율적인 방식으로 표현이된다. 예를 들어 코틀린의 int type은 대부분 자바 int 타입으로 컴파일된다. 단 제네릭 등 자바에서 제공하는 자료구조에 사용할 경우 wrapper type인 integer 객체가 들어가게 된다.

```kotlin
// kotlin
val intList = listOf(1, 2, 3)

// java
List list = CollectionsKt.listOf(new Integer[]{1, 2, 3});
```



### Nullable Primitive Type

null이 될 수 있는 타입의 경우에는 자바에서는 표현할 수 없기 때문에 자바의 wrapper type으로 컴파일된다

```kotlin
// kotlin
val size: Int? = null

// java
Integer size = (Integer)null;
```



### 정리

코틀린에는 primitive type은 없지만, 바이트코드로 변환 시 가능한 primitive type으로 바꾸어주기 때문에 연산할때 성능 문제는 없고, 자바에서 사용하는 자료구조를 사용할 때에는 마찬가지로 autoBoxing처리를 해주고 있다



### 참고사이트

- [[Kotlin] 코틀린에 primitive가 없다고? 느리지 않을까?](https://meteorkor.tistory.com/36){: class="underlineFill"}
- [코틀린(Kotlin) - 원시 타입(primitive type)](https://0391kjy.tistory.com/57){: class="underlineFill"}
- [변수의 두 종류 primitive변수와 object 변수](https://steps-for-developer.tistory.com/entry/%EB%B3%80%EC%88%98%EC%9D%98-%EB%91%90-%EC%A2%85%EB%A5%98-Primitive%EB%B3%80%EC%88%98%EC%99%80-Object%EB%B3%80%EC%88%98){: class="underlineFill"}