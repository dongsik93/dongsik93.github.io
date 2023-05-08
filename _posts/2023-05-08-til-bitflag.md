---
layout: post
title: "[Android] Bitflag ?"
subtitle: "Bitflag 공부"
date: 2023-05-08 23:55:00 +0900
categories: til
tags: android bitflag
comments: true

---

# [Android] Bitflag ?

> 공부공부



비트 플래그(Bitflags)는 하나의 정수 변수를 사용하여 여러 가지 상태를 표현하는 기법이다. 이는 변수 내에서 각 Bool 값에 고유한 비트 위치를 할당해 사용하게된다.

예를 들어 메모리의 최소 크기 단위는 1바이트이므로 변수의 크기는 적어도 1바이트 이상이다. 8비트(1바이트)는 비트가 8개이므로 8가지 상태를 저장할 수 있다. 이는 1바이트를 사용해서 1비트만 사용하고 7비트를 낭비함으로써 1가지 상태만 저장하는 bool 자료형보다 훨씬 효율적이다. **일반적으로 16진수를 사용한다.**

비트플래그는 데이터 압축 및 구성 설정 저장을 비롯한 다양한 프로그래밍 작업에 유용하다. 모바일 앱 개발에서 비트플래그를 사용하여 많은 bool 값을 메모리 효율적인 방식으로 효율적으로 저장하고 조작할 수 있다.

모바일 앱 개발에서 비트플래그의 일반적인 용도 중 하나는 사용자 기본 설정 또는 설정을 저장하는 것이다. 각 기본 설정을 별도의 bool 변수에 저장하는 대신 개발자는 모든 기본 설정을 단일 비트플래그에 저장할 수 있다. 이렇게 하면 앱의 전체 메모리 공간을 줄이는 데 도움이 될 수 있으며 사용자 기본 설정을 더 쉽게 관리하고 조작할 수 있다.

여러 개의 카테고리가 존재한다고 가정했을 때의 예제이다.

```kotlin
class MyCategory(val categories: Int) {
    companion object {
        const val RED_BIT = 1
        const val ORANGE_BIT = 1 shl 1
        const val YELLOW_BIT = 1 shl 2
        const val GREEN_BIT = 1 shl 3
        const val BLUE_BIT = 1 shl 4
        const val NAVY_BIT = 1 shl 5
        const val PURPLE_BIT = 1 shl 6
    }

    fun hasRed(): Boolean = categories and RED_BIT != 0
    fun hasOrange(): Boolean = categories and ORANGE_BIT != 0
    fun hasYellow(): Boolean = categories and YELLOW_BIT != 0
    fun hasGreen(): Boolean = categories and GREEN_BIT != 0
    fun hasBlue(): Boolean = categories and BLUE_BIT != 0
    fun hasNavy(): Boolean = categories and NAVY_BIT != 0
    fun hasPurple(): Boolean = categories and PURPLE_BIT != 0

    fun addCategory(category: Int): MyCategory = MyCategory(categories or category)

    fun removeCategory(category: Int): MyCategory = MyCategory(categories and category.inv())

    fun hasCategory(category: Int): Boolean = categories and category != 0
}
```

MyCategory의 companion object 내에서 각 비트 위치를 상수 값으로 정의한다. `hasRed()`, `hasOrange()` 및 기타 유사한 메소드는 비트별 AND(`&`) 연산을 사용하여 `categories` 변수 내에 해당 카테고리 비트가 설정되어 있는지 여부를 확인한다.

`addCategory()` 및 `removeCategory()` 메서드는 각각 비트 OR(`|`) 및 비트 AND NOT(`inv()`) 연산을 사용하여 `categories` 변수에서 범주를 추가하거나 제거한다.

마지막으로 `hasCategory()` 메서드는 비트별 AND(`&`) 연산을 사용하여 `categories` 변수에 특정 카테고리가 설정되어 있는지 확인합니다.

이러한 예제처럼 비트플래그를 사용하여 단일 `Int` 변수에 여러 값들을 효율적으로 저장하고 조작할 수 있다.

비트플래그는 유용하지만 비트플래그를 사용하는 데는 몇 가지 단점이 있습니다. 예를 들어 비트플래그는 특히 특정 구현에 사용되는 특정 비트 위치에 익숙하지 않은 개발자의 경우 읽고 이해하기 어려울 수 있다. 또한 비트플래그는 신중하게 설계 및 구현되지 않은 경우 오류가 발생하기 쉽다.

전반적으로 비트플래그는 단일 변수에서 여러 bool 값을 효율적으로 나타내는 데 사용할 수 있는 강력한 도구이다. 비트플래그 구조를 신중하게 설계하고 구현함으로써 개발자는 모바일 앱, 네트워킹 프로토콜 및 기타 소프트웨어 애플리케이션의 성능과 메모리 효율성을 개선할 수 있다.