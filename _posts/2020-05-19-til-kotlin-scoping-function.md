---
layout: post
title: "[Android] 코틀린의 범위 지정 함수 apply, with, let, also, run"
subtitle: "Android 코틀린의 apply, with, let, also, run "
date: 2020-05-19 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



## 코틀린의 apply, with, let, also, run



> *원문 : “Kotlin Scoping Functions apply vs. with, let, also, and run”*
>
> [Kotlin Scoping Functions apply vs with, let, also, and run](https://medium.com/@fatihcoskun/kotlin-scoping-functions-apply-vs-with-let-also-run-816e4efb75f5){: class="underlineFill"}
>
> 5개의 범위 지정 함수의 공통점과 차이점에 대해 알아보자



### 범위 지정 함수란

- 특정 객체 있는 함수를 연속해서 사용하거나, 다른 함수의 인자로 전달하기 위해 변수를 선언하고 이를 다른 곳에서는 사용하지 않는 경우 유용하게 사용할 수 있는 함수를 표준 라이브러리를 통해 제공한다

- 범위 지정 함수는 두가지 구성 요소를 가진다
  - 수신 객체
  - 수신 객체 지정 람다(lambda with receiver)



#### let()

- `let()` 함수는 호출한 객체를 이어지는 함수 블록의 인자로 전달한다

  ```kotlin
  @kotlin.internal.InlineOnly
  public inline fun <T, R> T.let(block: (T) -> R): R {
      contract {
          callsInPlace(block, InvocationKind.EXACTLY_ONCE)
      }
      return block(this)
  }
  ```

  - 이 함수를 호출하는 객체를 이어지는 함수형 인자 block의 인자로 전달하며 block 함수의 결과를 반환한다

- `let()` 함수를 사용하면 불필요한 변수 선언을 방지할 수 있다

- 사용규칙에 해당하는 경우에 사용한다

  - 지정된 값이 null이 아닌 경우에 코드를 실행해야 하는 경우
  - Nullable 객체를 다른 Nullable 객체로 변환하는 경우
  - 단일 지역 변수의 범위를 제한하는 경우

  ```kotlin
  /* let을 사용하지 않는 코드 */
  val person: Person = getPerson()
  val personDao: PersonDao = getPersonDao()
  personDao.insert(person)
  
  /* let을 사용하는 코드 */
  val person: Person = getPerson()
  getPersonDao().let { dao -> 
      // 변수 dao 의 범위는 이 블록 안으로 제한
      dao.insert(person)
  }
  
  fun doSomething(message: String?) {
      // message가 널이 아닌 경우에만 let 함수를 호출한다.
      message?.let {
          Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
      }
  }
  ```



#### also()

- `also()` 함수는 수신 객체 람다가 전달된 수신 객체를 전혀 사용 하지 않거나 수신 객체의 속성을 변경하지 않고 사용하는 경우 also 를 사용한다

  ```kotlin
  @kotlin.internal.InlineOnly
  @SinceKotlin("1.1")
  public inline fun <T> T.also(block: (T) -> Unit): T {
      contract {
          callsInPlace(block, InvocationKind.EXACTLY_ONCE)
      }
      block(this)
      return this
  }
  ```

- 사용규칙

  - 수신 객체 람다가 전달된 수신 객체를 전혀 사용 하지 않거나 수신 객체의 속성을 변경하지 않고 사용하는 경우 also 를 사용한다
  - also 는 apply 와 마찬가지로 수신 객체를 반환 하므로 블록 함수가 다른 값을 반환 해야하는 경우에는 also 를 사용할수 없다

  ```kotlin
  /* also를 사용하지 않는 코드 */
  class Book(val author: Person) {
      init {
        requireNotNull(author.age)
        print(author.name)
      }
  }
  
  /* also를 사용하는 코드 */
  class Book(author: Person) {
      val author = author.also {
        requireNotNull(it.age)
        print(it.name)
      }
  }
  ```

  

#### run()함수

- `run()` 함수는 인자가 없는 익명 함수처럼 사용하는 형태와 객체에서 호출하는 형태를 제공한다

  - 함수형 인자 block을 호출하고 그 결과를 리턴 #1

  ```kotlin
  @kotlin.internal.InlineOnly
  public inline fun <R> run(block: () -> R): R {
      contract {
          callsInPlace(block, InvocationKind.EXACTLY_ONCE)
      }
      return block()
  }
  ```

  - 복잡한 계산을 위해 여러 임시 변수가 필요할 때 유용하게 사용할 수 있다

  ```kotlin
  val padding = run {
      // 이 블록 내부에서 선언하는 값들은 외부에 노출되지 않는다.
      val defaultPadding = TypedValue.applyDimension(...)
      val extraPadding = TypedValue.applyDimension(...)
  
      //계산된 값을 반환한다.
      defaultPadding + extraPadding
  }
  ```

  - 이 함수를 호출한 객체를 함수형 인자 block의 리시버로 전달하고 그 결과를 리턴한다 #2

  ```kotlin
  @kotlin.internal.InlineOnly
  public inline fun <T, R> T.run(block: T.() -> R): R {
      contract {
          callsInPlace(block, InvocationKind.EXACTLY_ONCE)
      }
      return block()
  }
  ```

  - 안전한 호출을 사용할 수 있으므로 널 값일 수 있는 객체의 속성이나 함수에 연속적으로 접근해야 할 때 유용하다

  ```kotlin
  override fun onCreate(saveInstanceState: Bundle?) {
      super.onCreate(saveInstanceState)
  
      //액티비티 생성 시, 기존에 저장된 값이 있는 경우 UI 복원 수행
      saveInstanceState?.run {
  
          //Bundle 내에 저장된 값 추출
          val selection = getInt("last_selection")
          val text = getString("last_text")
  
          //UI 복원 수행
          ...
      }
  }
  ```

- 사용규칙

  - 어떤 값을 계산할 필요가 있거나 여러개의 지역 변수의 범위를 제한하려면 run 을 사용
  - 매개 변수로 전달된 명시적 수신객체 를 암시적 수신 객체로 변환 할때 run ()을 사용할수 있다





#### with()함수

- `with()`함수는 인자로 받은 객체를 이어지는 함수 블록의 리시버로 전달한다

- 함수에서 사용할 객체를 매개변수를 통해 받는다

  - 안전한 호출을 사용하여 인자로 전달되는 객체가 널 값이 아닌 경우 함수의 호출 자체를 막는 방법을 사용할 수 없으므로 널 값이 아닌 것으로 확인된 객체에 이 함수를 사용해야한다

  ```kotlin
  @kotlin.internal.InlineOnly
  public inline fun <T, R> with(receiver: T, block: T.() -> R): R {
      contract {
          callsInPlace(block, InvocationKind.EXACTLY_ONCE)
      }
      return receiver.block()
  }
  ```

- 사용규칙

  - Non-nullable 수신 객체이고 결과가 필요하지 않은 경우에만 사용

  ```kotlin
  /* with를 사용하지 않는 코드 */
  val person: Person = getPerson()
  print(person.name)
  print(person.age)
  
  /* with를 사용하는 코드 */
  val person: Person = getPerson()
  with(person) {
      print(name)
      print(age)
  }
  ```



#### apply() 함수

- `apply()` 함수는 이 함수를 호출한 객체를, 이어지는 함수 블록의 리시버로 전달한다

- 함수를 호출할 객체를 함수형 인자 block의 리시버로 전달하므로, 이 블록 내에서는 해당 객체 내의 프로퍼티나 함수를 직접 호출할 수 있다

  ```kotlin
  @kotlin.internal.InlineOnly
  public inline fun <T> T.apply(block: T.() -> Unit): T {
      contract {
          callsInPlace(block, InvocationKind.EXACTLY_ONCE)
      }
      block()
      return this
  }
  ```

- 사용규칙

  - 수신 객체 람다 내부에서 수신객체의 함수를 사용하지 않고 수신 객체 자신을 다시 반환 하려는 경우에 apply를 사용한다
  - 대표적인 예가 객체의 초기화

  ```kotlin
  /* apply를 사용하지 않는 코드 */
  val clark = Person()
  clark.name = "Clark"
  clark.age = 18
  
  /* apply를 사용하는 코드 */
  val peter = Person().apply {
      // apply 의 블록 에서는 오직 프로퍼티 만 사용
      name = "Peter"
      age = 18
  }
  ```



![scoping_1](/img/in-post/scoping_1.png)



참고사이트

- [코틀린의 apply, with, let, also, run은 언제 사용하는가?](https://medium.com/@limgyumin/코틀린-의-apply-with-let-also-run-은-언제-사용하는가-4a517292df29){: class="underlineFill"}
- [코틀린 범위 지정 함수 let, with, run, apply](https://salix97.tistory.com/224){: class="underlineFill"}

