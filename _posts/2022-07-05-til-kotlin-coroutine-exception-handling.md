---
layout: post
title: "[Kotlin] Coroutine Exception Handling"
subtitle: "coroutine exception handling in viewmodel"
date: 2022-07-05 18:00:00 +0900
categories: til
tags: kotlin coroutine
comments: true


---





# [Kotlin] Coroutine Exception Handling



### Coroutine Exception

Coroutine Builder들은 Exception을 어떻게 handling 하느냐에 따라서 두가지 타입으로 나뉜다



**Exception propagation**

propagating exceptions automatically (예외 전파) : launch, actor

exposing them to users (예외 노출) : async, produce

```kotlin
@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val job = GlobalScope.launch { // root coroutine with launch
        println("Throwing exception from launch")
        throw IndexOutOfBoundsException() // Will be printed to the console by Thread.defaultUncaughtExceptionHandler
    }
    job.join()
    println("Joined failed job")
    val deferred = GlobalScope.async { // root coroutine with async
        println("Throwing exception from async")
        throw ArithmeticException() // Nothing is printed, relying on user to call await
    }
    try {
        deferred.await()
        println("Unreached")
    } catch (e: ArithmeticException) {
        println("Caught ArithmeticException")
    }
}
```

```
Exception in thread "DefaultDispatcher-worker-2 @coroutine#2" java.lang.IndexOutOfBoundsException
Joined failed job
Throwing exception from async
Caught ArithmeticException
```



launch의 경우 exception이 발생하면 바로 exception이 발생한다 (전파)

하지만 async의 경우 exception이 발생하더라도 실제로 exception이 발생되는 부분은 await()을 만날 때 이다 (노출)



### CoroutineExceptionHandler

CoroutineExceptionHandler는 포착되지 않은 예외, 즉 처리되지 않은 예외에 대해서만 호출된다. Coroutine은 취소를 제외한 다른 예외가 발생하면 부모의 coroutine까지 모두 취소시킨다.

```kotlin
val handler = CoroutineExceptionHandler { _, exception -> 
    println("CoroutineExceptionHandler got $exception") 
}
val job = GlobalScope.launch(handler) { // root coroutine, running in GlobalScope
    throw AssertionError()
}
val deferred = GlobalScope.async(handler) { // also root, but async instead of launch
    throw ArithmeticException() // Nothing will be printed, relying on user to call deferred.await()
}
joinAll(job, deferred)

```

```
CoroutineExceptionHandler got java.lang.AssertionError
```



실제로 ViewModel에서 사용해보기에 앞서 viewModelScope에 대해서 한번 알아보자



### ViewModelScope

ViewModel에서 onCleared()를 호출할 때 직접 coroutine context를 명시적으로 취소하지 않아도 자동적으로 onCleared()가 호출될 때 coroutine 작업을 취소한다.

viewModelScope를 사용하지 않았을 경우

```kotlin
class TestViewModel : ViewModel() {
    private val job = SupervisorJob()
    private val uiScope = CoroutineScope(job + Dispatchers.Main)
        ...
    fun doSomething() = uiScope.launch {
        ...
    }

    override fun onCleared() {
        super.onCleared()
        job.cancel()
    }
}
```

이런식으로 onCleared에서 직접 job을 cancel 시켜줘야 한다

하지만 viewModelScope를 사용한다면

```kotlin
class TestViewModel : ViewModel() {
    fun doSomething() = viewModelScope.launch {
				...
		}   
}
```

상당히 간단해진다

viewModelScope의 내부 코드이다

```kotlin
private const val JOB_KEY = "androidx.lifecycle.ViewModelCoroutineScope.JOB_KEY"

public val ViewModel.viewModelScope: CoroutineScope
    get() {
        val scope: CoroutineScope? = this.getTag(JOB_KEY)
        if (scope != null) {
            return scope
        }
        return setTagIfAbsent(
            JOB_KEY,
            CloseableCoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
        )
    }

internal class CloseableCoroutineScope(context: CoroutineContext) : Closeable, CoroutineScope {
    override val coroutineContext: CoroutineContext = context

    override fun close() {
        coroutineContext.cancel()
    }
}
```

- CoroutineScope을 저장하면getTag(JOB_KEY)로 꺼내서 사용하고 있다.
- 만약 생성된CoroutineScope이 없다면s etTagIfAbsent()에 CloseableCoroutineScope 인스턴스를 인자로 넘겨, ViewModel 필드에 있는 HashMap에 코루틴 객체를 저장후 사용한다

`setTagIfAbsent` 함수내부를 보면

```kotlin
@Nullable
private final Map<String, Object> mBagOfTags = new HashMap<>();

<T> T setTagIfAbsent(String key, T newValue) {
    T previous;
    synchronized (mBagOfTags) {
        previous = (T) mBagOfTags.get(key);
        if (previous == null) {
            mBagOfTags.put(key, newValue);
        }
    }
    T result = previous == null ? newValue : previous;
    if (mCleared) {
        closeWithRuntimeException(result);
    }
    return result;
}
```

- ViewModel의 mBagOfTags 라는 HashMap 에 중복되는 key가없다면 인자로 받아온 key,newValue를 mBagOfTags에 put 하고 난 후 매개변수로 받은 newValue를 return 해준다
- 실제로 이 mBagOfTags는 viewModel이 clear될때 사용되는데

```kotlin
@MainThread
final void clear() {
    mCleared = true;
    if (mBagOfTags != null) {
        synchronized (mBagOfTags) {
            for (Object value : mBagOfTags.values()) {
                closeWithRuntimeException(value);
            }
        }
    }
    onCleared();
}

private static void closeWithRuntimeException(Object obj) {
    if (obj instanceof Closeable) {
        try {
            ((Closeable) obj).close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

- clear가 호출되면 mBagOfTag의 값들을 모두 close처리한다

정리해보면

1. viewModelScope에서 mBagOfTags에 coroutineScope를 put한다
2. LifeCycle이 Destory되면 clear 함수가 호출되면서 mBagOfTags에 저장되어있는 coroutineScope를 cancel시킨다
3. onCleared가 호출된다



### ViewModelScope with CoroutineExceptionHandler

viewModel에서 사용할 Handler를 만들어보자

```kotlin
/**
 * baseCoroutineExceptionHandler
 * @param methodName 호출한 함수 이름
 * @param isShowToast 에러 발생시 Toast 보여줄지 여부, 기본값 true
 * @param afterFunc 에러 발생시 후처리 함수
 */
fun baseCoroutineExceptionHandler(
    methodName: String,
    isShowToast: Boolean = true,
    afterFunc: (() -> Unit)? = null
): CoroutineExceptionHandler =
    CoroutineExceptionHandler { _, exception ->
        val type = when (exception) {
            is TestException -> "TestException"
            else -> "Unexpected Exception"
        }
        println("[Error] $methodName : $type : ${exception.message}")
        if (isShowToast) {
            viewModelScope.launch { _errorToast.emit(exception.message) }
        }
        afterFunc?.invoke()
    }
```

실제 사용은

```kotlin
private fun doSomething() {
		viewModelScope.launch(
			ioDispatcher +
      baseCoroutineExceptionHandler(::doSomething.name, false) { abc() } 
  ) {
			...
  }
}
```

- 로깅을 위해서 함수이름을 넘기고, toast사용 여부와 에러가 발생했을 때 함수를 넣어주면 끝!



### 참고사이트

- [Kotlin Exception Handling](https://kotlinlang.org/docs/exception-handling.html){: class="underlineFill"}
- [Android) 안드로이드에서 Coroutine의 ViewModelScope와 LiveData Builder 알아보기](https://yoon-dailylife.tistory.com/68){: class="underlineFill"}
- [[Kotlin] 코틀린 - 코루틴#5 - exception](https://tourspace.tistory.com/154?category=797357){: class="underlineFill"}

