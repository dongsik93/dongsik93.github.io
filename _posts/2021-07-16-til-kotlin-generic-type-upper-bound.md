---
layout: post
title: "[Kotlin] 제네릭 - 타입 상한"
subtitle: "Kotlin 제네릭에대해 알아보자"
date: 2021-07-16 18:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# 제네릭 - 타입 상한



> 앱 개발 중 Build시에 Warning이 발생하는 부분이 있어서 왜 발생했고, 어떻게 해서 해결할 수 있는지에 대해서 찾아보며 쓴 글입니다



Warning이 발생했던 코드 부분

```kotlin
class Behavior<T>(defaultValue: T) {
    var value: T = defaultValue
        set(value) {
            field = value
            observable.onNext(value)
        }
    val observable = BehaviorSubject.createDefault(value)
}
```

위 코드는 BehaviorSubject를 클래스화해서 값을 넣어주고, 구독을 하게만들어 주었는데 Warning이 떴던 이유는 `observabler.onNext(value)` 이 부분이였다



```java
/** BehaviorSubject */
void onNext(@NonNull T t);
```

- 실제로 BehaviorSubject의 onNext의 매개변수는 `NonNull`로 선언이 되어있다



코드는 잘 돌아가고 있었지만 warning이 난 이유를 알고 넘어가야 할 것 같기도하고, 왜? 라는 생각에 에러가 난 이유를 봐보니 nonnull을 넣어줘야 하는데 nullable한 값을 넘겨주고 있다는 것이었다.



난 어디에도 `?` 를 넣은적도 없는데 왜 대체 어디서 값이 nullable이 된건지 모르겠었는데, 역시 친절한 studio가 홈페이지를 연결해줬다

> [Prohibit unsafe calls with expected @NotNull T and given Kotlin generic parameter with nullable bound](https://youtrack.jetbrains.com/issue/KT-36770){: class="underlineFill"}



코틀린에서의 타입 파라미터 T는 `?`를 사용하지 않더라도 null이 될수 있는 타입이기 때문에 발생하는 문제였다. (T가 nullable하기 때문에 value 또한 nullable한 변수가 되어버려서 )



그렇다면 해결해주는 방법은 무엇일까?



바로 타입 파라미터 T를 nullable이 아닌 nonull, 즉 널이 될 수 없게 만들어주면 되는데 이를 `타입 상한` 이라고 한다.

> ###### 타입 상한(upper bound) 
>
> Java에서는 extends나 super를 사용하여 사용한 타입을 제한할 수 있고, Kotlin에서는 ’ : ‘(콜론)을 사용한다.



그래서 `:`를 사용해서 타입 파라미터 T의 타입을 상한하게되면 다음과 같은 코드가 된다

```kotlin
class Behavior<T: Any>(defaultValue: T) {
    var value: T = defaultValue
        set(value) {
            field = value
            observable.onNext(value)
        }
    val observable = BehaviorSubject.createDefault(value)
}
```



참고사이트

- [kotlin\] 타입 시스템](https://umbum.dev/608?category=903748){: class="underlineFill"}

