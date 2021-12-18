---
layout: post
title: "[Kotlin] 예외처리(Exception)"
subtitle: "kotlin, android 예외처리 하기"
date: 2021-12-18 10:00:00 +0900
categories: til
tags: kotlin exception
comments: true

---



# [Kotlin] 예외처리(Exception)



> 팀장님이 강조해주시던 예외처리에 대해서 공부한 내용 🙂



## 예외 (Exception)

컴파일 시점에 발생하는 `일반예외` 와 프로그램 실행시에 발생하는 `실행예외`로 크게 나눌수 있다.



![postman_test](/img/in-post/exception_1.png)



위의 2가지 종류의 예외를 처리하기 위해서 자바에서 **java.lang.Exception**이라는 최상위 부모 클래스를 제공하므로 모든 예외(Exception)들의 조상은 해당 클래스이다

- 하늘색 Exception들은 단순한 예외들, 즉 컴파일 시 발생하는 예외(일반예외)들이다 : `CheckedException`
- 초록색 RuntimeException은 프로그램 실행시 발생하는 런타임 Exception이다 (실행예외) : `UnCheckedException`

<br/>

### CheckedException과 UnCheckedException

- `CheckedException`
    - Excpetion 클래스 자손들 중 `RuntimeException` 을 제외한 모든 클래스
    - 반드시 예외처리를 해야 함
    - 컴파일 단계
    - IOException, SqlException 등등
- `UnCheckedException`
    - `RuntimeException` 과 자손 클래스
    - 명시적 처리를 강제하지 않음
    - 실행 단계
    - NullPointerExcpetion, IllegalArgumentException, IndexOutOfBoundException, SystemException 등등

<br/>

### Exception 처리

- Exception 처리는  `Try - Catch - Finally`를 사용한다

```kotlin
try {
		// Exception 발생이 예상되는 코드 블록
} catch (e: Exception) {
		// Exception이 발생했을 때 실행되는 블록
} finally {
		// Exception 발생과 상관없이 무조건 실행되는 블록
}
```

<br/>

### Exception 처리 방법

- Exception은 크게 3가지 형태로 처리해야 한다

    - `회피` : 호출한 쪽으로 그대로 전달 (throw)

    ```kotlin
    // 회피
    fun exceptionTest(): Nothing {
    		throw IOException("exception")
    }
    ```

    - `복구` : 복구 또는 무시 가능한 경우에 catch 블럭 내에서 처리하거나 예외상황 처리후 에러 코드 반환

    ```kotlin
    // 복구
    fun exceptionTest(): String {
        return try {
            "NoException"
        } catch (e: Exception) {
            "Exception"
        }
    }
    ```

    - `전환` : 특정 Exception으로 변환하여 전달 (throw)

    ```kotlin
    // 전환
    fun exceptionTest(): String {
        return try {
            "NoException"
        } catch (e: NullPointerException) {
            throw CustomException
        }
    }
    ```

<br/>

다음은 팀장님께서 교육해주신 앱 구현 및 상황 별 Exception 처리에 대한 내용이다

### **앱 구현시, 상황별 처리 방법**

- 시스템, 라이브러리의 함수에서 발생시키는 명시적 Exception은 반드시 이름을 지정하여 catch 처리
- 앱내에서 구현한 함수 내에서 예외가 발생할 것으로 예상되는 경우, 반드시 최상위 Exception 클래스로 반드시 catch 처리
    - 앱내에서 사용하는 특정 익셉션으로 전환하거나 에러코드로 반환하도록 처리할 것
- 앱 기동시, 또는 계정 설정과 같은 초기 사용성에 영향을 주는 함수에서는 반드시 최상위 Exception 클래스로 반드시 catch 처리
    - 무시 가능한 Excpetion과 반드시 처리해야할 Exception을 구분할 것
    - 계정설정/삭제등의 주요 부분에서는 불필요한 데이터가 남지 않도록 처리할 것
- 주요 기능내에서 Exception 발생시에는 Crashlytics 와 같은 에러 보고 라이브러리를 이용하여 보고하도록 하여, 개발자가 인지하도록 처리할 것
- UI/Repository 와 같이 레이어형태의 구조를 가지는 경우, Repository 의 함수는 명시적 Excpetion 또는 에러를 발생 시킬 것