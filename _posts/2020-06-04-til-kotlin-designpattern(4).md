---
layout: post
title: "[Kotlin] 디자인패턴 (4) - 스테이트 패턴"
subtitle: "Kotlin 스테이트 패턴"
date: 2020-06-04 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# Kotlin 객체지향 디자인 패턴



> Java 객체지향 디자인 패턴 책을 보고 Kotlin으로 변환하면서 공부한 내용입니다
>
> [Java객체지향 디자인패턴](http://www.yes24.com/Product/Goods/12501269){: class="underlineFill"}





## 7장. 스테이트 패턴



1. ### 스테이트 패턴이란?

- 상태에 따라서 동일한 작업이 다른 방식으로 실행될 때 해당 상태가 작업을 수행하도록 위임하는 디자인 패턴
- 시스템의 각 상태를 클래스로 분리해 표현하고, 각 클래스에서 수행하는 행위들을 메서드로 구현한다



2. ### 형광등 만들기 예제

```kotlin
enum class State(val num: Int) {
    OFF(0), ON(1)
}

class Light(private var state: Int = State.OFF.num) {
    fun on() {
        if (state == State.ON.num) {
            println("반응 없음")
        } else {
            println("Light on")
            state = State.ON.num
        }
    }

    fun off() {
        if (state == State.OFF.num) {
            println("반응 없음")
        } else {
            println("Light off")
            state = State.OFF.num
        }
    }
}
```



3. ### 문제점

- 형광등에 새로운 상태를 추가하려고하면?



4. ### 해결책

```kotlin
interface State {
    fun on_button_pushed(light: Light)
    fun off_button_pushed(light: Light)
}

class Light(private var state: State = OFF.getInstance()) {
    fun setState(state: State) {
        this.state = state
    }
    
    fun on_button_pushed() {
        state.on_button_pushed(this)
    }
    
    fun off_button_pushed() {
        state.off_button_pushed(this)
    }
}

class ON private constructor() : State {
    companion object {
        private val on = ON()
        fun getInstance() : ON = on
    }
    
    override fun on_button_pushed(light: Light) {
        println("반응 없음")
    }

    override fun off_button_pushed(light: Light) {
        println("Light Off")
        light.setState(OFF.getInstance())
    }
}

class OFF private constructor() : State {
    companion object {
        private val off = OFF()
        fun getInstance() : OFF = off
    }
    
    override fun on_button_pushed(light: Light) {
        println("Light On")
        light.setState(ON.getInstance())
    }
    
    override fun off_button_pushed(light: Light) {
        println("반응 없음")
    }
}

fun client() {
    val light = Light()
    light.off_button_pushed()
    light.on_button_pushed()
    light.off_button_pushed()
}

client()
```


