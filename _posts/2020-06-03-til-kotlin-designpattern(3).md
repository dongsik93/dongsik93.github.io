---
layout: post
title: "[Kotlin] 디자인패턴 (3) - 싱글턴 패턴"
subtitle: "Kotlin 싱글턴 패턴"
date: 2020-06-03 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# Kotlin 객체지향 디자인 패턴



> Java 객체지향 디자인 패턴 책을 보고 Kotlin으로 변환하면서 공부한 내용입니다
>
> [Java객체지향 디자인패턴](http://www.yes24.com/Product/Goods/12501269){: class="underlineFill"}



## 6장. 싱글턴 패턴



1. ### 싱글턴 패턴이란

- 인스턴스가 오직 하나만 생성되는 것을 보장하고 어디에서는 이 인스턴스에 접근할 수 있도록 하는 디자인 패턴
- 정적메서드로만 이루어진 정적 클래스를 사용해도 동일한 효과를 얻을 수 있다

![6-1](/img/in-post/design_pattern/6-1.png)

- Singleton
  - 하나의 인스턴스만을 생성하는 책임이 있으며 getInstance 메서드를 통해 모든 클라이언트에게 동일한 인스턴스를 반환하는 작업을 수행한다



2. #### 프린터 관리자 예시

```kotlin
class User(private val name: String) {
    fun print() {
        val printer = Printer.getPrinter()
        printer.print(this.name + " print using " + printer.toString() + ".")
    }
}

class Printer private constructor() {
    companion object {
        private lateinit var printer: Printer
        
        fun getPrinter(): Printer {
            if (!::printer.isInitialized) printer = Printer()
            return printer
        }
    }
    
    fun print(str: String) {
        println(str)
    }
}

fun main() {
    val user = MutableList(5) { i -> i }
    user.forEach { userName ->
        val users = User((userName + 1).toString() + "-user")
        users.print()
    }
}

main()
```



3. ### 문제점

- 다중 스레드에서 Printer 클래스를 이용할 때 인스턴스가 1개 이상 생성되는 경우가 발생할 수 있다
  - 경합조건이 발생
    - 메모리와 같은 동일한 자원을 2개 이상의 스레드가 이용하려고 경합하는 현상



4. #### 해결책

- 정적 변수에 인스턴스를 만들어 바로 초기화하는 방법

```kotlin
class Printer private constructor() {
    private var counter = 0
    companion object {
        private var printer: Printer = Printer()
        
        fun getPrinter(): Printer {
            return printer
        }
    }
    
    fun print(str: String) {
        counter++
        println(str)
    }
}
```

- 인스턴스를 만드는 메서드에 동기화하는 방법

```kotlin
class User(name: String) : Thread(name) {
    override fun run() {
        val printer = Printer.getPrinter()
        printer.print(this.name + " print using " + printer.toString() + ".")
    }
}

class Printer private constructor() {
    private var counter = 0
    
    companion object {
        private lateinit var printer: Printer
        
        @Synchronized
        fun getPrinter(): Printer {
            if (!::printer.isInitialized) {
                try {
                    Thread.sleep(10)
                } catch (e: InterruptedException) { }
                printer = Printer()
            }
            return printer
        }
    }
    
    fun print(str: String) {
        // 오직 하나의 스레드만 접근을 허용하기 위해
        synchronized(this) {
            counter++
            println(str + counter)
        }
    }
}

fun main() {
    val user = MutableList(5) { i -> i }
    user.forEach { userName ->
        val users = User((userName + 1).toString() + "-user")
        users.start()
    }
}
```


