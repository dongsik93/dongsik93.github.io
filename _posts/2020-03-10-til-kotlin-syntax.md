---
layout: post
title: "[Android] Kotlin 언어 알아보기"
subtitle: "Kotlin Syntax"
date: 2020-03-10 09:00:00 +0900
categories: til
tags: kotlin android
comments: true
---

# Kotlin 언어 알아보기

> 앱 개발 직군에 들어가면서 kotlin을 배워야 하는 상황이 되었다



## 1. 변수선언

- Kotlin은 두 키워드(`val` 및 `var`)를 사용하여 변수를 선언한다

#### `val`

- 값이 변경되지 않는 변수에 `val`을 사용한다
- `val`을 사용하여 선언된 변수에 값을 다시 할당할 수 없다

```kotlin
// languageName의 값을 항상 유지하기 위해 val 사용
val languageName: String = "Kotlin"
```



#### `var`

- 값이 변경될 수있는 변수에 `var`을 사용한다

```kotlin
// count는 초기 값 10이 할당되는 Int 유형의 변수
var count: Int = 10
	count = 15
// var 키워드를 사용했기 때문에 count 값을 재할당 할 수 있다
```

`Int`는 정수를 나타내며, 다른 언어와 마찬가지로 숫자 데이터에 따라 `Byte`, `Short`, `Long`, `Float`, `Double`을 사용할 수도 있다



#### 유형추론

- Kotlin은 **정적으로 입력되는 언어**이다. 즉, 컴파일 시간에 유형이 확인되고 절대 변경되지 않는다

```kotlin
val languageName = "Kotlin"
	val upperCaseName = languageName.toUpperCase()
	
	// 컴파일 실패
	/* 실패이유는 languageName이 String으로 추정되므로 String 
	클래스의 일부가 아닌 함수를 호출할 수 없다 */
	languageName.inc()
```

- 위의 예에서 `toUpperCase()`는 String 유형의 변수에서만 호출 할 수 있는 함수인데, Kotlin 컴파일러가 languageName을 String으로 추정ㄹ했으므로 호출이 가능
- 하지만 `inc()`는 Int 연산자 함수이므로 String에서 호출할 수 없다



#### Null 안전

- Kotlin 변수는 기본적으로 null값을 보유할 수 없다

```kotlin
// 컴파일 실패
val languageName: String = null
```

- null값을 포함하는 변수는 **nullable 유형**이어야 한다.
- `?`를 변수 접미사로 지정하여 변수를 nullable로 지정할 수 있다

```kotlin
val languageName: String? = null
```

- nullable 변수는 신중하게 처리하지 않으면 `NullPointerException`이 발생한다



## 2. 조건부

다른 언어의 **if-else**와 유사하다

```kotlin
if (count == 42) {
    println("I have the answer.")
} else if (count > 35) {
	println("The answe ris close.")
} else {
    println("The answer eludes me.")
}
```

- 조건문은 스테이트풀(stateful) 논리를 나타내는 데 유용하지만 작성시 반복될 수 있다. 이 반복을 피하기 위해 **조건식**을 제공한다

```kotlin
val answerString: String = if (count == 42){
    	"I have the answer."
	} else if (count > 35) {
    	"The answe ris close."
	} else {
    	"The answer eldues me."
	}

	println(answerString)
```

- 암시적으로 각 조건부 분기는 마지막 줄에 표현식의 결과를 반환하기 때문에 `return` 키워드를 사용할 필요가 없다
- 위의 세 분기의 결과는 모두 `String` 유형이므로 if-else 표현식의 결과도 `String`유형이다.
- `answerString`에는 if-else 표현식의 결과에서 초기 값이 할당된다
- 유형추론을 사용하여 `answerString`에 대한 명시적 유형 선언을 생략할 수 있지만, 명확히 하기 위해 유형 선언을 포함하는것이 좋다

```kotlin
val answerString = when {
    count == 42 -> "I have the answer."
    count > 35 -> "The answer is close."
    else -> "The answer eldues me."
	}
	println(answerString)
```

- `when` 표현식의 각 분기는 조건, 화살표(`->`) 및 결과로 표시된다

- 화살표의 왼쪽 조건이 true로 평가되면 오른쪽에 있는 표현식의 결과가 반환된다

- `when` 표현식 코드는 if-else 코드와 기능적으로 동일하지만 쉽게 읽을 수 잇다

- Kotlin의 조건부는 **스마트 캐스팅(smart casting)**을 강조한다

  - safe-call 연산자 또는 not-null assertion 연산자를 사용하여 nullable 값을 처리하는 대신 아래 예와 같이 조건식을 사용하여 변수에 null 값에 대한 참고아 있는지 확인할 수 있다

  ```kotlin
  val language: String? = null
  	if (language != null) {
          // languageName?.toUpperCase()를 쓸 필요가 없다
          println(languageName.toUpperCase())
      }
  ```

  - 조건부 분기  내에서  `languageName`은 nullable이 아닌 것으로 간주될 수 있다. 
  - kotlin에서는 분기 실행 조건에 따라 `languageName`은 null 값을 보유할 수 없으므로 분기 내에서 `languageName`을 nullable로  처리할 필요가 없다



## 3. 함수

- 하나 이상의 표현식을 함수로 그룹화 할 수 있다
- 함수를 선언하려면 `fun` 키워드 뒤에  함수 이름이 오도록 사용한다
- 그런 다음 함수에 사용되는 입력 유형(있는 경우)을 정의하고 반환하는 출력 유형을 선언한다

```kotlin
fun generateAnswerString() : String {
    val answerString = if (count == 42) {
        "I have the answer"
    } else {
        "The answer eludes me"
    }
    return answerString
}
// answerString 변수는 generateAnswerString()의 결과에 따라 초기화된다
val answerString = generateAnswerString()
```

- 위의 예에서 **함수의 이름**은 `generateAnswerString`이다
- 입력 값은 받지 않으며, `String` 유형의 결과를 출력한다

```kotlin
fun generateAnswerString(countThreshold: Int): String{
    val answerString = if (count > countThreshold) {
        "I have the answer"
    } else {
        "The answer eludes me."
    }
    return answerString
}
// 인수를 포함한 함수 호출
val answerString = generateAnswerString(42)
```

- 위의 예에서 `gernerateAnswerString()`은 `Int` 유형의 **countThreshold**인수 한개를 사용한다



#### 함수 선언 단순화

```kotlin
fun generateAnswerString(countThreshold: Int): String{
    return if (count > countThreshold) {
        "I have the answer"
    } else {
        "The answer eludes me"
    }
}
```

- 위의 예에서 단일 표현식의 결과가 함수에서 반환되는 경우 포함된 if-else 표현식의 결과를 직접 반환하여  로컬 변수 선언을 건너뛸 수 있다

```kotlin
fun generateAnswerString(countThrehold: Int): String = if (count > countThreshold) {
    "I have the answer"
} else {
    "The answer eludes me"
}
```

- 위의 예처럼 `return` 키워드를 대입 연산자로 바꿀 수 있다



#### 익명함수

- 모든 함수에 이름이 필요하지 않으며, 입력과 출력에 의해 직접적으로 식별된다
- 참조를 사용하여 나중에 익명 함수를 호출하면 익명 함수에 대한 참조를 유지할 수 있다

```kotlin
val stringLengthFunc: (String) -> Int = { input ->
        input.length
    }
```

- `stringLengthFunc`는 `String`을 입력으로 사용하고, `String` 입력 길이를 `Int` 유형의 출력으로 반환하는 익명 함수에 대한 참조를 포함한다
- 따라서 함수의 유형은 `(String) -> Int`로 표시된다

```kotlin
val stringLengthFunc: (String) -> Int = { input ->
        input.length
    }
	// 함수 호출
    val stringLength: Int = stringLengthFunc("Android")
```



#### 고차 함수

- 함수는 다른 함수를 인수르 취할 수 있다
- 다른 함수를 인수로 사용하는 함수를 **고차 함수**라고 한다

```kotlin
fun stringMapper(str: String, mapper: (String) -> Int): Int {
    return mapper(str)
}
```

- 예에서 `stringMapper()`함수는 전달된 `String`에서 `Int`값을 파생하는 함수와 함께 `String`을 가져온다



## 4. 클래스

- 맞춤 유형을 추가하려는 경우 `class` 키워드를 사용해 클래스를 정의할 수 있다

```kotlin
class Car
```



#### 속성

- getter, setter 및 backing 필드를 포함할 수 있는 클래스 수준 변수이다

```kotlin
class Car {
    val wheels = listOf<Wheel>()
}
```

- 위의 예제는 `Wheel` 객체 목록을 `Car`의 속성으로 추가한다

```kotlin
var car = Car()
val wheels = car.wheels
```

- `wheels`는 `public val`이다. 즉, `Car` 클래스 외부에서 엑세스 할 수 있지만 다시 할당할 수 없다
- `Car`의 인스턴스를 가져오려면 위의 예 처럼 먼저 생성자를 호출해야 한다

```kotlin
class Car(val wheels: List<Wheel>)
```

- 위의 예에서 클래스 생성자는 `List<Wheel>`을 생성자 인수로 취하고 인수를 사용하여 `wheels`속성을 초기화 한다



#### 클래스 함수 및 캡슐화

- 클래스는 함수를 사용하여 동작을 모델링 하는데, 함수는 상태를 수정할 수 있으므로 노출하려는 데이터만 노출할 수 있다
- 이러한 엑세스 제어를 **캡슐화**라고 한다



참고사이트

- [Kotlin 프로그래밍 언어 알아보기](https://developer.android.com/kotlin/learn){: class="underlineFill"}
