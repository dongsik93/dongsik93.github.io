---
layout: post
title: "[Kotlin] Coroutine 내부동작"
subtitle: "suspend가 어떻게 돌아가는지"
date: 2022-08-12 10:30:00 +0900
categories: til
tags: kotlin
comments: true

---



# [Kotlin] Coroutine 내부동작



> 코루틴의 내부 동작에 대해 알아보자



코루틴을 사용할 때 익숙하게 보아왔던 `suspend`.

일시 중단을 가능하게 해주는 한정자인데, 어떻게 일시 중단이 되며 다시 재개될 수 있는지 알아보도록 하자

suspend 한정자가 달린 함수를 디컴파일 해보면 `Continuation Passing Style(CPS)`이라는 형태의 코드로 전환된다

> CPS란? 함수 실행이 끝남과 동시에 연이어 함수가 또 실행되는 프로그래밍 모델로 비동기 프로그래밍 방식에 사용된다



예제 코드를 통해 어떻게 변하는지 봐보자

```kotlin
suspend fun createPost(token: Token, item: Item): Post { … }
```

suspend 한정자를 통해 일시 중단 함수임을 선언한다

```java
Object createPost(Token token, Item item, Continuation<Post> cont) { … }
```

`Continuation` 이라는 객체가 호출했던 함수 끝에 매개변수로 추가되는것으로 변환된다

즉, 바이트코드로 컴파일 되면서 Continuation이 생성되어 CPS 스타일로 변환되는 것이다



디컴파일된 코드를 자세하게 살펴보자

```kotlin
suspend fun doSomething() {
    val userData = fetchUserData()
    val userCache = cacheUserData(userData)
    updateTextView(userCache)
}

suspend fun fetchUserData() = "user_name"

suspend fun cacheUserData(user: String) = user

fun updateTextView(user: String) = user
```

위 코드를 바이트코드로 만든 다음, 디컴파일 하게되면 아래와 같은 Java코드가 만들어진다

```java
public final class TestKt {
   @Nullable
   public static final Object doSomething(@NotNull Continuation var0) {
      Object $continuation;
      label27: {
         if (var0 instanceof <undefinedtype>) {
            $continuation = (<undefinedtype>)var0;
            if ((((<undefinedtype>)$continuation).label & Integer.MIN_VALUE) != 0) {
               ((<undefinedtype>)$continuation).label -= Integer.MIN_VALUE;
               break label27;
            }
         }

         $continuation = new ContinuationImpl(var0) { #1
            // $FF: synthetic field
            Object result;
            int label;

            @Nullable
            public final Object invokeSuspend(@NotNull Object $result) {
               this.result = $result;
               this.label |= Integer.MIN_VALUE;
               return TestKt.doSomething(this);
            }
         };
      }

      Object var10000;
      label22: {
         Object $result = ((<undefinedtype>)$continuation).result;
         Object var5 = IntrinsicsKt.getCOROUTINE_SUSPENDED();
         switch(((<undefinedtype>)$continuation).label) { #2
         case 0:
            ResultKt.throwOnFailure($result);
            ((<undefinedtype>)$continuation).label = 1;
            var10000 = fetchUserData((Continuation)$continuation); #3
            if (var10000 == var5) {
               return var5;
            }
            break;
         case 1:
            ResultKt.throwOnFailure($result);
            var10000 = $result;
            break;
         case 2:
            ResultKt.throwOnFailure($result);
            var10000 = $result;
            break label22;
         default:
            throw new IllegalStateException("call to 'resume' before 'invoke' with coroutine");
         }

         String userData = (String)var10000;
         ((<undefinedtype>)$continuation).label = 2;
         var10000 = cacheUserData(userData, (Continuation)$continuation);
         if (var10000 == var5) {
            return var5;
         }
      }

      String userCache = (String)var10000;
      updateTextView(userCache);
      return Unit.INSTANCE;
   }

   @Nullable
   public static final Object fetchUserData(@NotNull Continuation $completion) {
      return "user_name";
   }

   @Nullable
   public static final Object cacheUserData(@NotNull String user, @NotNull Continuation $completion) {
      return user;
   }

   @NotNull
   public static final String updateTextView(@NotNull String user) {
      Intrinsics.checkNotNullParameter(user, "user");
      return user;
   }
}
```

`#1` 에서 `Continuation` 을 상속받은 `ContinuationImpl`을 생성해주는데 이 객체안에는 suspend 함수에 선언된 변수들과, 실행 결과인 result, 현재의 진행상태인 label을 가지고 있는다.



`#2`를 보면 switch case 문과 함께 Label이라는게 생겼다. label은 무엇일까?

Kotlin 함수가 내부적으로 중단 가능 지점을 식별하고, 이 지점으로 코드를 분리한다. 분리된 코드들은 각각의 label로 인식되며 when을 사용하여 작성된다. 즉 **Kotlin은 모든 중단 가능 지점(Suspention Point)을 찾아서 When으로 표현한다.**

![coroutine_in_1.png](/img/in-post/coroutine_in_1.png)

> Android Studio에서 Suspention Point를 알려주는 화살표

Kotlin에서 when은 java에서 switch case로 표현되기 때문에 위와 같은 바이트코드가 생기게 된다.



`#3`를 보면 fetchUserData를 호출하면서 this를 넘겨주고 있는데, 여기서 this는 **Continuation** 객체를 의미한다.

```kotlin
// Continuation.kt
public interface Continuation<in T> {
    /**
     * The context of the coroutine that corresponds to this continuation.
     */
    public val context: CoroutineContext

    /**
     * Resumes the execution of the corresponding coroutine passing a successful or failed [result] as the
     * return value of the last suspension point.
     */
    public fun resumeWith(result: Result<T>)
}
```

`resumeWith` 함수는 특정 함수가 suspend 되어야 할 때, 현재 함수에서 결과값T를 받게 해주는 함수

`context` 는 각 continuation이 특정 스레드에서 실행되는 것을 허용해준다



정리해보면

kotlin 컴파일러를 통해 Continuation객체가 기존 suspend 함수의 파라미터에 추가되고, suspend 키워드가 사라진다. 이 전달된 Continuation객체는 함수 계산 결과를 호출한 Coroutine에 전달하는데 사용된다.

kotlin 컴파일러는 suspention point를 찾아 구분지어 label을 달고, 이와 함께 내부 변수를 관리하는 클래스를 생성한다.



#### 참고사이트

- [Coroutines Basic 2 - 코루틴의 동시성 내부 알아보기](https://velog.io/@jshme/%EC%BD%94%EB%A3%A8%ED%8B%B4%EC%9D%98-%EB%8F%99%EC%8B%9C%EC%84%B1-%EB%82%B4%EB%B6%80){: class="underlineFill"}
- [Kotlin의 Coroutine은 어떻게 동작하는가](https://medium.com/til-kotlin-ko/kotlin%EC%9D%98-coroutine%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8F%99%EC%9E%91%ED%95%98%EB%8A%94%EA%B0%80-789291da6a50){: class="underlineFill"}
- [How do Kotlin coroutines work. nternally](https://mashup-android.vercel.app/mashup-11th/dahyun/coroutineinternal/coroutineinternal/){: class="underlineFill"}

