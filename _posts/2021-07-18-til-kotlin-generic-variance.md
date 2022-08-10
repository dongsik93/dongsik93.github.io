---
layout: post
title: "[Kotlin] 제네릭 #2 - 변성"
subtitle: "Kotlin 변성, 공변"
date: 2021-07-18 22:00:00 +0900
categories: til
tags: kotlin android
comments: true
---



## 제네릭 #2 - 변성(variance)



> [[Kotlin] 제네릭 - 타입 상한](https://dongsik93.github.io/til/2021/07/16/til-kotlin-generic-type-upper-bound/){: class="underlineFill"} 에 이어서 제네릭 2번째 변성에 대해 알아보자



### 변성이란 ?

- List<String>과 List<Any> 와 같이 기저 타입이 같고 타입 인자가 다른 여러 타입이 서로 어떤 관계가 있는지 설명하고 있는 개념
- 변성을 이해하면 타입 안정성을 보장하는 API를 만들 수 있다



제네릭은 `타입소거` 방식으로 동작한다

> **타입소거란**?
>
> 컴파일 시에만 타입 검사를 하고 런타입시에는 제네릭의 인스턴스에 대한 타입정보를 갖고 있지 않는 것 List<String>은 런타임시에는 그냥 List로 간주된다 (개발자에게만 타입이 보인다)



### 가변성의 3가지 유형

- 모던 랭귀지들은 `타입 바운드` 개념을 제공하며 이는 무공변성, 공변성, 반공변성 3가지로 분류할 수 있다.

> **타입 바운드(Type Bound)**
>
> 타입 매개변수와 타입 변수에 제약을 거는 행위를 말하며, 타입에 대해 안전하게 코딩하기위해 사용한다



### 1. 무공변(invariant)

제네릭 타입을 인스턴스화 할 때 서로 다른 타입 인자가 들어가는 경우 인스턴스 타입 사이의 하위 타입 관계가 성립하지 않으면 그 제네릭 타입을 무공변이라고 한다 즉, **무공변성이란 타입 T 만 허용한다는 의미** [ T]

쉽게 말해서 상속 관계에 상관없이, 자기 타입만을 허용하는것을 말한다

예) 타입 S가 T의 하위 타입일 때, `Book<S>`와` Book<T>`가 어떤 관계도 아닌 경우

> 코틀린은 따로 지정해 주지 않으면 기본적으로 모든 제네릭 클래스는 무공변이다. 코틀인은 사용 및 선언 지점에 변성으로 지정한다



### 2. 공변(covariant) : producer

타입 인자 사이의 하위 타입 관계가 성립하고, 그 하 위 타입 관계가 그대로 인스턴스 타입 사이의 관계로 이어지는 경우 공변적이라고 한다

`out` 키워드를 사용하며, 타입 생성자에게 자신과 자식객체에게 리스코프 치환법칙을 허용한다는 의미

즉, **공변성이란 타입 T를 확장한 타입에 대해서 허용**한다는 의미 [+T]

예) 타입 S가 T의 하위 타입일 때, `Book<S>`가 `Book<T>`의 하위타입인 경우

```kotlin
interface Book<out T> {
	fun read(): A
```



공변 예제

```kotlin
// 동물 1 개체를 의미
open class Animal {
    fun feed() {
        TODO()
    }
}

// Animal을 상속한 Cat
class Cat : Animal() { }

// 동물 무리를 의미
class Herd<T: Animal> {
    val size: Int 
    get() = TODO()
    operator fun get(i: Int): T {
        TODO()
    }
}

fun feedAll(anumals: Herd<Animal>){
    for (i in 0 until animals.size) {
        animals[i].feed()
    }
}
```



`Cat` 이 `Animal` 을 상속하기는 했지만 어떤 변성도 지정하지 않았기 때문에 (무공변) `Herd<Cat>` 은 `Herd<Animal>` 의 하위타입이 아니다

이를 강제 캐스팅으로 해결할 수 있지만 그렇게 하는 것은 올바른 방법이 아니다

```kotlin
val cats = Herd<Cat>()
feedAll(cats) // Type mismatch. require : Herd<Animal>
```



코틀린에서 제네릭 클래스가 타입 파라미터에 대해 공변적임을 표시하려면 타입 파라미터 이름 앞에 `out`을 넣어줘야 한다

```kotlin
class Herd<out T: Animal>(vararg animals: T) {
		fun addAnimal(animal: T) { } // in 위치라 이렇게는 사용할 수 없다
		fun getBestAnimal(): T { } // out 위치에서는 사용 가능
}
```

- 이제 `feedAll()` 은 `Animal`의 하위 타입으로 이루어진 컬렉션도 받을 수 있다
- `out` 이 지정된 공변적 파라미터는 out  위치(리턴타입)에만 사용할 수 있다

- 타입의 값을 생산한다는 의미

- 만약 in 위치의 사용을 제한하지 않는다면, `addAnimal(tiger1)` 도 가능하다는 얘기가 되므로 `Herd<Cat>` 이라는 컬렉션의 `animals: Cat` 에 Tiger가 들어가는 상황이 생길수가 있다



생성자 파라미터에는 in/out 은 위치 관계없이 사용가능한데, 이는 생성자의 경우 굳이 위치를 제한할 필요가 없기 때문이다

변성은 위험할 여지가 있는 메소드들을 호출할 수 없게 만듦으로써 외부에서 제네릭 타입의 기저 클래스 인스턴스를 잘못 사용하는 일이 없도록 방지하는 역할인데,

생성자는 생성 시점에만 호출되는 메소드이므로 이런 방지 조치가 필요 없다

그러나 `val / var` 을 지정하는 경우 getter, setter가 같이 생성되기 때문에 `in / out` 을 따져야한다

비공개 파라미터 메소드도 같은 맥락에서 `in / out` 위치 관계 없이 사용 가능하다 (외부에서 접근이 불가능하기 때문)



### 3. 반공변(contravariant) : comsumer

하위 타입 관계가 뒤집히면 반공변이라고 한다 즉, **반공변성이란 타입 T의 상위(부모) 타입에 대해서 허용**한다는 의미 [-T]

`in` 키워드를 사용하며, 공변성의 반대 개념으로 자신과 부모 객체만 허용하는것을 말한다

예) 타입 S가 T의 상위 타입일 때, `Book<S>`가 `Book<T>`의 상위타입인 경우

```kotlin
interface Book<in T> {
	fun read(b1: T, b2: T): Int { ... } // T를 in 위치에 사용
}
```





참고사이트

- [kotlin 제네릭 : 변성(variance), 타입 프로젝션(type projection)](https://umbum.dev/612){: class="underlineFill"}

- [Kotlin Generics - 변성](https://medium.com/hongbeomi-dev/kotlin-generics-변성-f11e4efcb486){: class="underlineFill"}

- [변성 - 공변, 무공변, 반공변](https://heenustroy.tistory.com/213#recentComments){: class="underlineFill"}

- [공변성과 반공변성, 무공변성](https://partnerjun.tistory.com/78){: class="underlineFill"}

- [[kotlin] 제네릭스](https://taehyungk.github.io/posts/android-kotlin-generics/){: class="underlineFill"}