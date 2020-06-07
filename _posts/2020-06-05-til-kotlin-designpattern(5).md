---
layout: post
title: "[Kotlin] 디자인패턴 (5) - 커맨드 패턴"
subtitle: "Kotlin 스테이트 패턴"
date: 2020-06-05 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# Kotlin 객체지향 디자인 패턴



> Java 객체지향 디자인 패턴 책을 보고 Kotlin으로 변환하면서 공부한 내용입니다
>
> [Java객체지향 디자인패턴](http://www.yes24.com/Product/Goods/12501269){: class="underlineFill"}



## 8장. 커맨드 패턴



1. ### 커맨드 패턴이란

- 이벤트가 발생했을 때 실행될 기능이 다양하면서도 변경이 필요한 경우에 이벤트를 발생시키는 클래스를 변경하지 않고 재사용하고자 할 때 유용하다
- 실행될 기능을 캡슐호화함으로써 기능의 실행을 요구하는 호출자 클래스(invoker)와 실제 기능을 실행하는 수신자 클래스(receiver) 사이의 의존성을 제거한다
  - 따라서 실행될 기능의 변경에도 호출자 클래스를 수정 없이 그대로 사용할 수 있도록 해준다

![8-1](/img/in-post/design_pattern/8-1.png)



2. ### 만능 버튼 예제

```kotlin
class Lamp {
    fun turnOn() {
        println("Lamp On")
    }
}

class Button(private val theLamp: Lamp) {
    fun pressed() {
        theLamp.turnOn()
    }
}

fun client() {
    val lamp = Lamp()
    val lampButton = Button(lamp)
    lampButton.pressed()
}

client()
```



3. ### 문제점

- 버튼을 눌렀을 때 램프가 켜지는 대신 다른 기능을 실행하게 하려면?
- 버튼을 누르는 동작에 따라 다른 기능을 실행하게 하려면 어떤 변경 작업이 필요한가?



4. ### 해결책

```kotlin
interface Command {
    abstract fun execute()
}

class Button(private var command: Command) {
    fun pressed() {
        command.execute()
    }
    fun setCommand(newCommand: Command) {
        this.command = newCommand
    }
}

class Lamp {
    fun turnOn() {
        println("lamp On")
    }

    fun turnOff() {
        println("lamp Off")
    }
}

class LampOnCommand(private var theLamp: Lamp) : Command {
    override fun execute() {
        theLamp.turnOn()
    }
}

class LampOffCommand(private var theLamp: Lamp) : Command {
    override fun execute() {
        theLamp.turnOff()
    }
}

fun client() {
    val lamp = Lamp()
    val lampOnCommand = LampOnCommand(lamp)
    val lampOffCommand = LampOffCommand(lamp)
    
    val button1 = Button(lampOnCommand)
    button1.pressed()
    
    button1.setCommand(lampOffCommand)
    button1.pressed()
}

client()
```


