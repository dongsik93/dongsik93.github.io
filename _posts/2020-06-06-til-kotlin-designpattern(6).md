---
layout: post
title: "[Kotlin] 디자인패턴 (6) - 옵저버 패턴"
subtitle: "Kotlin 스테이트 패턴"
date: 2020-06-06 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# Kotlin 객체지향 디자인 패턴



> Java 객체지향 디자인 패턴 책을 보고 Kotlin으로 변환하면서 공부한 내용입니다
>
> [Java객체지향 디자인패턴](http://www.yes24.com/Product/Goods/12501269){: class="underlineFill"}



## 9장. 옵저버 패턴



1. ### 옵저버 패턴이란?

- 데이터의 변경이 발생했을 경우 상대 클래스나 객체에 의존하지 않으면서 데이터 변경을 통보하고자 할 때 유용하다
- 통보 대상 객체의 관리를 Subject 클래스와 Observer 인터페이스로 일반화한다
  - 데이터 변경을 통보하는 클래스는 통보 대상 클래스나 객체에 대한 의존성을 없앨 수 있다
  - 결과적으로 옵저버 패턴은 통보 대상 클래스나 대상 객체의 변경에도 ConcreteSubject 클래스를 수정 없이 그대로 사용할 수 있도록 한다

![9-1](/img/in-post/design_pattern/9-1.png)



2. ### 성적 출력 예시

```kotlin
import java.lang.Integer.min

class ScoreRecord {
    private val scores: MutableList<Int> = mutableListOf()
    private lateinit var dataSheetView: DataSheetView
    
    fun setDataSheetView(dataSheetView: DataSheetView) {
        this.dataSheetView = dataSheetView
    }
    
    fun addScore(score: Int) {
        scores.add(score)
        dataSheetView.update()
    }
    
    fun getScoreRecord() : MutableList<Int> = scores
}

class DataSheetView(private val scoreRecord: ScoreRecord, private val viewCount: Int) {
    fun update() {
        val record = scoreRecord.getScoreRecord()
        displayScores(record, viewCount)
    }
    
    fun displayScores(record: MutableList<Int>, viewCount: Int) {
        println("list of $viewCount entries: ")
        for(i in  0 until min(record.size, viewCount)) {
            println(record[i])
        }
        println()
    }
}

fun client() {
    val scoreRecord = ScoreRecord()
    
    val dataSheetView = DataSheetView(scoreRecord, 3)
    scoreRecord.setDataSheetView(dataSheetView)
    
    for(i in 0 until 6) {
        val score = i * 10
        println("adding $score")
        scoreRecord.addScore(score)
    }
}
```



3. ### 문제점

- 성적을 다른 형태로 출력하고 싶다면?
- 여러 가지 형태의 성적을 동시 혹은 순차적으로 출력하려면?



4. ### 해결책

```kotlin
import java.lang.Integer.min
import java.util.*

interface Observer {
    abstract fun update()
}

abstract class Subject {
    private val observers: MutableList<Observer> = mutableListOf()
    fun attach(observer: Observer){
        observers.add(observer)
    }
    
    fun detach(observer: Observer) {
        observers.remove(observer)
    }
    // 통보 대상 목록, 즉 각 옵저버에게 변경을 통보
    fun notifyObserver() {
        observers.forEach {o ->
            o.update()
        }
    }
}

class ScoreRecord : Subject() {
    private val scores: MutableList<Int> = mutableListOf()
    fun addScore(score: Int) {
        scores.add(score)
        notifyObserver()
    }

    fun getScoreRecord() : MutableList<Int> = scores
}


class DataSheetView(private val scoreRecord: ScoreRecord, private val viewCount: Int) : Observer {
    // 통보 받음
    override fun update() {
        val record = scoreRecord.getScoreRecord()
        displayScores(record, viewCount)
    }
    // 변경 통보 시 리스트 목록 출력
    fun displayScores(record: MutableList<Int>, viewCount: Int) {
        println("list of $viewCount entries: ")
        for(i in  0 until min(record.size, viewCount)) {
            println(record[i])
        }
        println()
    }
}

class MinMaxView(private val scoreRecord: ScoreRecord) : Observer {
    // 통보 받음
    override fun update() {
        val record = scoreRecord.getScoreRecord()
        displayMinMax(record)
    }
    // 변경 통보 시 최소값, 최대값 출력
    fun displayMinMax(record: MutableList<Int>) {
        val minValue = Collections.min(record, null)
        val maxValue = Collections.max(record, null)
        println("Min: $minValue , Max : $maxValue")
    }
}

// StatisticsView는 Observer를 구현함으로써 통보 대상이 됨 
class StatisticsView(private val scoreRecord: ScoreRecord) : Observer {
    // 통보 받음
    override fun update() {
        val record = scoreRecord.getScoreRecord()
        displayStatistics(record)
    }
    // 변경 통보 시 조회된 점수의 합과 평균을 출력함
    fun displayStatistics(record: MutableList<Int>) {
        var sum = 0
        record.forEach { score ->
            sum += score
            val average: Float = (sum / record.size).toFloat()
            println("Sum: $sum, Average: $average")
        }
    }
}

fun client() {
    val scoreRecord = ScoreRecord()
    
    val dataSheetView = DataSheetView(scoreRecord, 3)
    scoreRecord.attach(dataSheetView)
    val minMaxView = MinMaxView(scoreRecord)
    scoreRecord.attach(minMaxView)
    
    for(i in 1 until 6) {
        val score = i * 10
        println("adding $score")
        scoreRecord.addScore(score)
    }
    
    scoreRecord.detach(dataSheetView)
    val statisticsView = StatisticsView(scoreRecord)
    scoreRecord.attach(statisticsView)
    
    for(i in 1 until 6) {
        val score = i * 10
        println("adding $score")
        scoreRecord.addScore(score)
    }
}

client()
```



