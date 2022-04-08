---
layout: post
title: "[Android] Paging3 load all pages at once"
subtitle: "Paging3 troubleshooting"
date: 2022-03-22 19:00:00 +0900
categories: til
tags: android paging3
comments: true
---



# [Kotlin] 어노테이션

> Hilt로 CoroutineDispatcher를 주입하려고 할 때 커스텀 어노테이션을 만들어야 했는데, 이 때 `@Retention` 어노테이션이 사용이 돼서 좀 더 자세하게 알아보게 되었다



### Annotation 이란 ?

- 사전적 의미는 주석이지만, 주석과는 다르게 특정 코드에 달아서 어떤 의미를 부여하거나 기능을 주입할 수 있다



### Annotation의 종류

- Kotlin / Android에 내장되어 있는 built in annotation
- Annotation에 대한 정보를 나타내기 위한 meta annotation
- 직접 만드는 Custom annotation



### 1. Built in annotation

- Built in annotation은 대표적으로 `Deprecated` 가 있다

    ```kotlin
    @Deprecated("version1")
    fun change() {
    		...
    }
    ```

    - 특정 함수, 클래스, 필드, 생성자 등에 달아 더이상 사용하지 말라는 경고를 주기 위한 용도

    - IDE에서 취소선으로 Deprecated 되었다고 알려준다

        ![annotation_1.png](/img/in-post/annotation_1.png)

- 또 하나 자주볼 수 있는 annotation은 `JvmOverloads` 이다

    ```kotlin
    class SeekBarView @JvmOverloads constructor(
        context: Context,
        attrs: AttributeSet? = null,
        defStyleAttr: Int = 0,
        defStyleRes: Int = 0
    )
    
    // 생성자가 자동으로 생성되는 예
    SeekBarView(context: Context)
    SeekBarView(context: Context, attrs: AttributeSet?)
    SeekBarView(context: Context, attrs: AttributeSet?, defStyleAttr: Int)
    SeekBarView(context: Context, attrs: AttributeSet?, defStyleAttr: Int, defStyleRes: Int))
    ```

    - 함수 또는 생성자 파라미터에 default value 가 설정되어 있을 경우 컴파일러 가 default value 만큼의 오버로딩 함수를 만들어주는 annotation이다
    - CustomView를 만들때 자주 사용한다



### 2. Meta Annotation

- 어노테이션에 추가로 속성을 달아줄 수 있다
- 추가 속성은 어노테이션 위에 또 다른 어노테이션을 달아주는 것

#### Retention

```kotlin
@Retention(AnnotationRetention.RUNTIME)
@Qualifier
annotation class DefaultDispatcher

@Retention(AnnotationRetention.RUNTIME)
@Qualifier
annotation class IoDispatcher

@Retention(AnnotationRetention.RUNTIME)
@Qualifier
annotation class MainDispatcher

@Retention(AnnotationRetention.BINARY)
@Qualifier
annotation class MainImmediateDispatcher
```

- `@Retention` 은 annotation의 Scope를 제한하는데 사용되고 파라미터에는 3가지가 있다

    - `SOURCE`

        - compile time에만 유용하며 빌드된 binary에는 포함되지 않는다

    - `BINARY`

        - compile time과 binary에도 포함되지만 reflection을 통해 접근할 수는 없다

        > Reflection(리플렉션) 런타임 때 프로그램의 구조(객체, 함수, 프로퍼티)를 분석해 내는 기법

    - `RUNTIME`

        - compile time과 binary에도 포함되고, reflection을 통해 접근 가능하다

- Custom annotation에 `@Retention`을 표시해주지 않을경우, default로 RUNTIME이 된다

- `@Retention` 의 정의

```kotlin
/**
 * This meta-annotation determines whether an annotation is stored in binary output and visible for reflection. By default, both are true.
 *
 * @property value necessary annotation retention (RUNTIME, BINARY or SOURCE)
 */
@Target(AnnotationTarget.ANNOTATION_CLASS)
public annotation class Retention(val value: AnnotationRetention = AnnotationRetention.RUNTIME)
```



#### Target

```java
@Target({TYPE, METHOD, CONSTRUCTOR, FIELD})
@Retention(RetentionPolicy.CLASS)
public @interface TargetApi {
    /**
     * This sets the target api level for the type..
     */
    int value();
}
```

- 해당하는 annotation이 어디에 사용 가능한지를 제한하는 데 사용된다
- 타겟에 선언되지 않고 해당 타켓에 사용하면 정상적으로 동작하지 않을 수 있다
- 위의 예에서는 TYPE, METHOD, CONSTRUCTOR, FIELD에서 사용 가능하다



### 3. Custom Annotation

- Custom Annotation에는 Reflection을 통해 만들거나 Code Generation을 활용하는 방법이 있다



#### Qualifier

- 같은 타입의 객체를 구분할떄 사용
- Custom annotation을 만들때 사용한다
- 사용할 의존 객체를 선택할 수 있도록 해준다
- 주입 대상에 `@Qualifier` 어노테이션을 설정하면 @Qualifier의 값으로 앞서 설정한 한정자를 사용한다



Reflection과 CodeGeneration에 대해서는 다음 포스팅에서 자세하게 알아보도록 하자



### 참고사이트

- [Annotation 안에서 무슨일이 일어나는거지? 1편](https://blog.gangnamunni.com/post/kotlin-annotation/){: class="underlineFill"}
- [[kotlin] 코틀린 차곡차곡 - 11. Annotation ( 어노테이션 )](https://sabarada.tistory.com/189){: class="underlineFill"}