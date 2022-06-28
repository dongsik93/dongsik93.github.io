---
layout: post
title: "[Kotlin] Serializable Object"
subtitle: "kolin의 object serialize에 대해서"
date: 2022-06-18 18:00:00 +0900
categories: til
tags: kotlin
comments: true

---



# [Kotlin] Serializable Object 

Coroutine GlobalScope를 사용해야 할 일이 생겨서 GlobalScope가 정의된걸 보고있었는데, `EmptyCoroutineContext` 라는게 나와서 해당 context를 따라가보니 궁금한게 생겼다



- EmptyCoroutineContext

```kotlin
@SinceKotlin("1.3")
public object EmptyCoroutineContext : CoroutineContext, Serializable {
    private const val serialVersionUID: Long = 0
    private fun readResolve(): Any = EmptyCoroutineContext

    public override fun <E : Element> get(key: Key<E>): E? = null
    public override fun <R> fold(initial: R, operation: (R, Element) -> R): R = initial
    public override fun plus(context: CoroutineContext): CoroutineContext = context
    public override fun minusKey(key: Key<*>): CoroutineContext = this
    public override fun hashCode(): Int = 0
    public override fun toString(): String = "EmptyCoroutineContext"
}
```

`private fun readResolve(): Any = EmptyCoroutinecontext` 는 무엇을 의미하는 것일까?

일단 EmptyCoroutineContext가 Object로 선언되어있다. Kotlin에서 Object는 Singleton객체를 만들 때 사용된다.

readResolve를 검색해보니 Java Serialize와 관련된 내용이 나오는걸 봐서는 Serializable을 상속받고 있기 때문이라는걸 추측해볼 수 있다.

하지만 왜? 저런 코드를 작성했냐가 궁금하기 때문에 다시 찾아보자.

원인은 Singleton Instance를 serialize할때 recreate되는 문제라고 한다



> The `readResolve`method is called when `ObjectInputStream` has read an object from the stream and is preparing to return it to the caller. `ObjectInputStream` checks whether the class of the object defines the `readResolve` method. If the method is defined, the `readResolve` method is called to allow the object in the stream to designate the object to be returned.
>
> [Object Input Classes](https://docs.oracle.com/javase/7/docs/platform/serialization/spec/input.html#5903){: class="underlineFill"}



무슨말이냐면, `readResolve` 함수를 구현하게 되면 deserialization 과정에서 스트림안의 객체가 반환할 객체를 지정할 수 있게 한다 라는 의미이다. 따라서 readResolve에서 Singleton Instance를 반환하게 한다면, recraete되지 않고 원하는대로 Object를 Singleton으로서 사용할 수 있게 한다



- 테스트 코드

```kotlin
object ObjectTest : Serializable {
    private fun readResolve(): Any = ObjectTest
}
```

위에서 Kotlin으로 선언한 object를 Java 코드로 디컴파일해보면 아래처럼 나온다

```java
public final class ObjectTest implements Serializable {
   @NotNull
   public static final ObjectTest INSTANCE;

   private final Object readResolve() {
      return INSTANCE;
   }

   private ObjectTest() {
   }

   static {
      ObjectTest var0 = new ObjectTest();
      INSTANCE = var0;
   }
}
```

readResolve의 타입을 Any로 왜 해줘야 하는지는 좀 더 찾아봐야 될것같다..

궁금증 하나 해결, 하나 추가



#### 참고사이트

- [Kotlin: Serializable Objects](https://blog.stylingandroid.com/kotlin-serializable-objects/){: class="underlineFill"}
- [Effective Kotlin: Item 3 — Enforce the singleton property with a private constructor or an enum type](https://appmattus.medium.com/effective-kotlin-item-3-enforce-the-singleton-property-with-a-private-constructor-or-an-enum-f80f49e9deea){: class="underlineFill"}

