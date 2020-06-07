---
layout: post
title: "[Kotlin] 디자인패턴 (7) - 데커레이터 패턴"
subtitle: "Kotlin 데커레이터 패턴"
date: 2020-06-07 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# Kotlin 객체지향 디자인 패턴



> Java 객체지향 디자인 패턴 책을 보고 Kotlin으로 변환하면서 공부한 내용입니다
>
> [Java객체지향 디자인패턴](http://www.yes24.com/Product/Goods/12501269){: class="underlineFill"}




## 10장. 데커레이터 패턴



1. ### 데커레이터 패턴이란

- 기본 기능에 추가할 수 있는 기능의 종류가 많은 경우에 각 추가 기능을 Decorator 클래스로 정의한 후 필요한 Decorator 객체를 조합합으로써 추가 기능의 조합을 설계하는 방식이다

![10-1](/img/in-post/design_pattern/10-1.png)

- 데커레이터 패턴에서 나타나는 역할이 수행하는 작업이다
  - Component
    - 기본 기능을 뜻하는 ConcreteComponent와 추가기능을 뜻하는 Decorator의 공통 기능을 정의한다
    - 즉 클라이언트는 Component를 통해 실제 객체를 사용한다
  - ConcreteComponent
    - 기본 기능을 구현하는 클래스
  - Decorator
    - 많은 수가 존재하는 구체적인 Decorator의 공통 기능을 제공
  - ConcreteDecoratorA, ConcreteDecoratorB
    - Decorator의 하위 클래스로 기본 기능에 추가되는 개별적인 기능을 뜻한다



2. ### 도로 표시 방법 예시

- 기본 도로 표시 기능을 제공하는 RoadDisplay 클래스와 추가적으로 차선을 표시하는 RoadDisplayWithLane 클래스

```kotlin
open class RoadDisplay {
    open fun draw() {
        println("기본 도로 표시")
    }
}

class RoadDisplayWithLane : RoadDisplay() {
    override fun draw() {
        super.draw()
        drawLane()
    }
    
    private fun drawLane() {
        println("차선 표시")
    }
}

fun main() {
    val road: RoadDisplay = RoadDisplay()
    road.draw()
    
    val roadWithLane: RoadDisplay = RoadDisplayWithLane()
    roadWithLane.draw()
}

main()
```



3. ### 문제점

- 또 다른 도로 표시 기능을 추가로 구현하고 싶다면?
  - 기본 도로 표시에 교통량을 표시하고 싶다면?
- 여러가지 추가 기능을 조합헤 제공하고 싶다면?
  - 기본 도로 표시에 차선표시 기능과 교통량 표시 기능을 함께 제공하고 싶다면?



4. ### 해결책

- 상속을 이용한 해결

```kotlin
// 교통량 표시 클래스
class RoadDisplayWithTraffic : RoadDisplay() {
    override fun draw() {
        super.draw()
        drawTraffic()
    }
    
    fun drawTraffic() {
        println("교통량 표시")
    }
}
```

- 상속을 이용하면 추가되는 기능의 조합별로 하위클래스를 구현해야하는 문제가 발생한다
  - 조합 수가 늘어나는 문제가 발생
- 이를 위해 추가 기능별로 개별적인 클래스를 설계하고 기능을 조합할 때 각 클래스의 객체 조합을 이용하면 된다
  - 데코레이터 패턴

```kotlin
abstract class Display {
    abstract fun draw()
}

// 기본 도로 표시 클래스
class RoadDisplay : Display() {
    override fun draw() {
        println("기본 도로 표시")
    }
}

// 다양한 추가 기능에 대한 공통 클래스
abstract class DisplayDecorator(private val decoratedDisplay: Display) : Display() {
    override fun draw() {
        decoratedDisplay.draw()
    }
}

// 차선 표시를 추가하는 클래스
class LaneDecorator(decoratedDisplay: Display) : DisplayDecorator(decoratedDisplay) {
    override fun draw() {
        super.draw()
        drawLane()
    }
    
    private fun drawLane() {
        println("\t차선 표시")
    }
}

// 교통량 표시를 추가하는 클래스
class TrafficDecorator(decoratedDisplay: Display) : DisplayDecorator(decoratedDisplay) {
    override fun draw() {
        super.draw()
        drawTraffic()
    }
    
    private fun drawTraffic() {
        println("\t 교통량 표시")
    }
}

fun client() {
    // 기본 도로 표시
    val road = RoadDisplay()
    road.draw()
    // 기본 도로 표시 + 차선 표시
    val roadWithLane = LaneDecorator(RoadDisplay())
    roadWithLane.draw()
    // 기본 도로 표시 + 교통량 표시
    val roadWithTraffic = TrafficDecorator(RoadDisplay())
    roadWithTraffic.draw()
}

client()
```

- road, roadWithLane, roadWithTraffic 객체의 접근이 모두 Display 클래스를 통해 이루어진다
- Client에서는 동일한 Display 클래스만을 통해 일관성있는 방식으로 도로 정보를 표시할 수 있다

- 이러한 방식의 설계를 이요하면 추가 기능 조합별로 별도의 클래스를 구현하는 대신 각 추가 기능에 해당하는 클래스의 객체를 조합해 추가 기능의 조합을 구현할 수가 있다

```kotlin
fun client() {
    val roadWithLaneAndTraffic = TrafficDecorator(LaneDecorator(RoadDisplay()))
    roadWithLaneAndTraffic.draw()
}
```

- 가장 먼저 생성된 RoadDisplay 객체의 draw가 먼저 실행되고, 첫 번째 추가 기능인 LaneDecorator의 drawLane 메서드가 실행되고, 두 번째 추가 기능인 TrafficDecorator의 drawTraffic 메서드가 실행된다

- 실행 결과

  ```
  기본 도로 표시
  		차선 표시
  		교통량 표시
  ```




