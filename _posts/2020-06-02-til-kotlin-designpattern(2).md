---
layout: post
title: "[Kotlin] 디자인패턴 (2) - 스트래티지 패턴"
subtitle: "Kotlin 스트래티지 패턴"
date: 2020-06-02 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# Kotlin 객체지향 디자인 패턴



> Java 객체지향 디자인 패턴 책을 보고 Kotlin으로 변환하면서 공부한 내용입니다
>
> [Java객체지향 디자인패턴](http://www.yes24.com/Product/Goods/12501269){: class="underlineFill"}



## 5장. 스트래티지 패턴



1. ### 스트래티지 패턴

- 전략을 쉽게 바꿀 수 있도록 해주는 디자인 패턴이다. 전략이란 어떤 목적을 달성하기 위해 일을 수행하는 방식, 비즈니스 규칙, 문제를 해결하는 알고리즘 등으로 이해할 수 있다. 
- 스트래티지 패턴은 같은 문제를 해결하는 여러 알고리즘이 클래스별로 캡슐화되어 있고 이들이 필요할 때 교체할 수 있도록 함으로써 동일한 문제를 다른 알고리즘으로 해결할 수 있게 하는 디자인 패턴이다.

![5-1](/img/in-post/design_pattern/5-1.png)

- Strategy : 인터페이스나 추상 클래스로 외부에서 동일한 방식으로 알고리즘을 호출하는 방법을 명시한다.
- ConcreateStrategy1,ConcreateStrategy2,ConcreateStrategy3 : 스트래티지 패턴에서 명시한 알고리즘을 실제로 구현한 클래스다.
- Context : 스트래티지 패턴을 이용하는 역할을 수행한다. 필요에 따라 동적으로 구체적인 전략을 바꿀수 있도록 setter 메서드를 제공한다.



2. ### 로봇만들기 예제

```kotlin
abstract class Robot(private val name: String) {
    fun getName(): String = name
    abstract fun attack()
    abstract fun move()
}

class TaekwonV(name: String) : Robot(name) {
    override fun attack() {
        println("i have missile and can attack with it")
    }

    override fun move() {
        println("i can only walk")
    }
}

class Atom(name: String) : Robot(name) {
    override fun attack() {
        println("i have strong punch and can attack with it")
    }
    
    override fun move() {
        println("i can only fly")
    }
}

fun client() {
    val taekwonV: Robot = TaekwonV("TaekwonV")
    val atom: Robot = Atom("Atom")
    println("my name is ${taekwonV.getName()}")
    taekwonV.move()
    taekwonV.attack()
    
    println("my name is ${atom.getName()}")
    atom.move()
    atom.attack()
}

client()
```



3. ### 문제점

- 기존 로봇의 공격 또는 이동 방법을 수정하려면 어떤 변경 작업을 해야 하는가?
- 새로운 로봇을 만들어 기존의 공격 또는 이동 방법을 추가하거나 수정하려면?



4. ### 해결책

```kotlin
abstract class Robot(private val name: String) {
    private lateinit var movingStrategy: MovingStrategy
    private lateinit var attackStrategy: AttackStrategy

    fun getName(): String = name
    fun setMovingStrategy(movingStrategy: MovingStrategy) {
        this.movingStrategy = movingStrategy
    }

    fun setAttackStrategy(attackStrategy: AttackStrategy) {
        this.attackStrategy = attackStrategy
    }

    fun attack() {
        attackStrategy.attack()
    }

    fun move() {
        movingStrategy.move()
    }

}

class TaekwonV(name: String) : Robot(name) {}

class Atom(name: String) : Robot(name) {}

interface MovingStrategy {
    fun move()
}

class FlyingStrategy : MovingStrategy {
    override fun move() {
        println("i can fly")
    }
}

class WalkingStrategy : MovingStrategy {
    override fun move() {
        println("i can walk")
    }
}

interface AttackStrategy {
    fun attack()
}

class MissileStrategy : AttackStrategy {
    override fun attack() {
        println("i have missile and can attack with it")
    }
}

class PunchStrategy : AttackStrategy {
    override fun attack() {
        println("i have strong punch and can attack with it")
    }
}

fun client() {
    val taekwonV: Robot = TaekwonV("TaekwonV")
    val atom: Robot = Atom("Atom")
    
    taekwonV.setMovingStrategy(WalkingStrategy())
    taekwonV.setAttackStrategy(MissileStrategy())
    
    atom.setMovingStrategy(FlyingStrategy())
    atom.setAttackStrategy(PunchStrategy())
    
    println("my name is ${taekwonV.getName()}")
    taekwonV.move()
    taekwonV.attack()
    
    println("my name is ${atom.getName()}")
    atom.move()
    atom.attack()
}

client()
```


