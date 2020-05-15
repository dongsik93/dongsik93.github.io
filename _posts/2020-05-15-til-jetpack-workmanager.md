---
layout: post
title: "[Android] WorkManager"
subtitle: "Android Jetpack WorkManager "
date: 2020-05-15 18:30:00 +0900
categories: til
tags: workmanager android jetpack
comments: true
---



## WorkManager



### WorkManager란

- 앱이 종료되거나 기기가 다시 시작되어도 실행 예정인 지연 가능한 비동기 작업을 쉽게 예약할 수 있게 해준다
- 안드로이드의 백그라운드 작업을 처리하는 방법 중 하나, Android Jetpack 아키텍처의 구성 요소 중 하나이다
- 하나의 코드로 API Level 마다 비슷한 동작을 보장한다



### 주요 기능

- API 14 이상 단말을 지원한다
- 네트워크 가용성, 충전상태와 같은 작업의 제약 조건을 설정할 수 있다
- 일회성 혹은 주기적인 비동기 작업을 예약할 수 있다
- 예약된 작업 모니터링 및 관리
- 작업 체이닝
- 앱이나 기기가 다시 시작되는 경우에도 작업 실행을 보장한다
- 잠자기 모드와 같은 절전 기능을 지원한다

- **WorkManager**는 앱이 종료되거나 기기가 다시 시작되는 경우에도 **지연 가능** 하고 **안정적으로 실행**되어야 하는 작업을 대상으로 설계되어 있다
  - 백엔드 서비스에 로그 또는 분석을 전송하는 작업
  - 주기적으로 애플리케이션 데이터를 서버와 동기화 하는 작업



### 백그라운드란?

- 다음 중 하나에 해당하면 앱이 포 그라운드에 있는 것으로 간주된다
  - Activity가 시작 또는 일시 중지 되었는지 여부에 관계없이 앱에 Activity가 표시된다
  - 앱에 포 그라운드 Service가 있다
  - 다른 포 그라운드 앱은 Service중 하나에 바인딩 하거나 Content Provider중 하나를 사용하여 앱에 연결된다
    - 앱이나 시스템이 이러한 앱에 바인딩 된 경우 앱이 포그라운드에 있다
    - IME, Wallpaper service, Notification listener, Voice or text service, Music app when streaming music to your car
- 이러한 조건 중 어느것도 해당되지 않는다면 앱이 백그라운드에 있는 것으로 간주된다



### 언제 WorkManager를 사용하는가

- 백그라운드에서 작업을 실행하면 RAM 및 배터리와 같은 제한된 리소스가 소비됨에 따라서 사용자 환경이 저하될 수 있다

- 그렇기때문에 백그라운드 실행을 구현하는데 사용할 도구를 결정하기 위해서는 개발자가 수행하려는 작업과 제한 사항을 명확하게 이해해야 한다

  ![workmanager_1](/img/in-post/workmanager/workmanager_1.png)

  [Modern background execution in Android 를 참고하세요](https://android-developers.googleblog.com/2018/10/modern-background-execution-in-android.html){: class="underlineFill"}

- **`WorkManager`** 는 모든 OS 백그라운드 실행 제한을 고려하여 백그라운드 실행에 권장되는 솔루션이다

- #### 사용 예시

  - 지연가능한 작업의 보장된 실행 : `WorkManager`
    - 서버에 로그 업로드하는 경우
    - 업로드 / 다운로드 할 콘텐츠 암호화 / 복호화
  - 외부 이벤트에 대한 응답으로 시작된 작업 : `FCM` + `WorkManager`
    - 이메일과 같은 새로운 온라인 컨텐츠 동기화
    - `Firebase Cloud Messaging`을 사용해서 앱에 알리고
    - `WorkManager`로 작업 요청을 생성해 콘텐츠를 동기화 한다

- 모든 작업을 WorkManager를 사용하는 것은 올바른 사용 방법이 아니다
  
  - 사용자가 현재 보고있는 UI를 빠르게 변경하는 작업이나 결제 진행 등 즉시 처리해야 하는 작업은 `ForgroundService`를 사용하거나 ThreadPool, Rx등을 사용해야 한다



### WorkManager 구성

![workmanager_2](/img/in-post/workmanager/workmanager_2.png)

- WorkManager API의 주요 클래스는 **WorkManager**, **Worker**, **WorkRequest**, **WorkState**이다

- ##### `WorkManager`

  - 처리해야 하는 작업을 자신의 큐에 넣고 관리한다
  - 싱클톤으로 구현이 되어있기 때문에 getInstance()로 WorkManager의 인스턴스를 받아 사용한다

- ##### `Worker`

  - 추상 클래스이며, 처리해야 하는 백그라운드 작업의 처리 코드를 이 클래스를 상속받아 doWork() 메서드를 오버라이드 하여 작성하게 된다
    - `doWork()`
      - 작업을 완료하고 결과에 따라 Worker클래스 내에 정의된 enum인 **Result**의 값중 하나를 리턴해야 한다
      - SUCCESS, FAILURE, RETRY의 3개 값이 있으며 리턴되는 이 값에 따라 WorkManager는 해당 작업을 마무리 할것인지, 재시도 할것인지, 실패로 정의하고 중단할 것인지를 결정하게 된다

- ##### `WorkRequest`

  - WorkManager를 통해 실제 요청하게 될 개별 작업이다
  - 처리해야 할 작업인 Work와 작업 반복 여부 및 작업 실행 조건, 제약 사항등 이 작업을 어떻게 처리할 것인지에 대한 정보가 담겨있다
  - 반복여부에 따라 onTimeWorkRequest, PeriodicWorkRequest로 나뉜다
  - `onTimeWorkRequest`
    - 반복하지 않을 작업, 즉 한번만 실행할 작업의 요청을 나타내는 클래스
  - `PeriodicWorkRequest`
    - 여러번 실행할 작업의 요청을 나타내는 클래스

- ##### `WorkState`

  - WorkRequst의 id와 해당 WorkRequest의 현재 상태를 담는 클래스
  - 이 WorkState의 상태정보를 이용해서 자신이 요청한 작업의 현재 상태를 파악할 수 있다
  - ENQUEUED, RUNNING, SUCCEEDED, FAILED, BLOCKED, CANCLLED의 6개 상태를 가진다



### 1. 단순 작업

- Worker 클래스를 상속받은 클래스를 만들고 doWork() 메서드를 오버라이드 한다
- 처리 결과에 따른 Result 값을 리턴해야 한다

```kotlin
import androidx.work.Worker

class ExampleWorker : Worker() {
    override fun doWork(): Result {
        /* 처리해야할 작업에 관한 코드들 */
        return Result.success()
    }
}
```

- OneTimeWorkRequestBuilder를 이용해서 OneTimeWorkRequest객체를 생성한다

```kotlin
/* 코틀린에 정의된 인라인 함수 OneTimeWorkRequestBuilder */
var workRequest = OneTimeWorkRequestBuilder<ExampleWorker>().build()

/* 자바에서는 OneTimeWorkRequest 클래스내에 정의된 OneTimeWorkRequest.Builder를 사용해야 함 */
var workRequest = OneTimeWorkRequest.Builder(ExampleWorker::class.java)
```

- WorkManager 클래스의 getInstance() 메서드로 싱글턴 객체를 받아서 WorkManager의 작업 큐에 OneTimeWorkRequest 객체를 추가해준다

```kotlin
var workRequest = OneTimeWorkRequestBuilder<ExampleWorker>().build()

val workManager = WorkManager.getInstance()

workManager?.enqueue(workRequest)
```

- 반복되는 작업은 PeriodicWorkRequestBuilder를 이용해서 PeriodicWorkRequest객체를 생성한 뒤 WorkManager의 큐에 추가해주면 된다

```kotlin
/* 반복 시간에 사용할 수 있는 가장 짧은 최소값은 15 */
val workReqeust = PeriodicWorkRequestBuilder<ExampleWorker>(15, TimeUnit.MINUTES).build()

val workManager = WorkManager.getInstance()

workManager?.enqueue(workRequest)
```



### 2. 제약 조건을 가지는 작업

- 해당 제약조건이 만족되면 작업을 수행하고, 조건이 만족되지 않으면 작업을 취소하며, 처리가 완료되지 못하고 실패한다면 제약조건이 만족되는 다음 타이밍에 다시 처리를 시도하게된다
- 제약 조건은 Constraints 클래스의 Builder를 이용해서 생성한 뒤 WorkRequest에 추가한다

```kotlin
val constraints = Constraints.Builder()
	/* 네트워크 연결상태에 대한 제약 조건 */
	.setRequiredNetworkType(NetworkType.CONNECTED)
	/* 충전 상태에 대한 제약 조건 */
	.setRequiresCharging(true)
	.build()

/* 제약조건과 함께 작업을 생성하거나 */
val requestConstraint = OneTimeWorkRequestBuilder<ExampleWorker>()
	.setConstraints(constraints)
	.build()

/* 작업을 생성하고 나중에 제약조건을 설정해 줄수 있다 */
workRequest.setConstraint(constraints)
```



### 3. 연결된 작업

- 두 작업을 연결해서 처리하는 방법
- 각 작업을 WorkRequest로 만들어서 처음 실행될 작업을 WorkManager의 beginWith() 메서드의 인자로 추가하고, then() 메서드에 이어할 작업을 추가해준다
  - WorkManager는 workA를 수행하고 이 작업이 완료된 이후 workB 작업을 수행하게 된다

```kotlin
val workA = OneTimeWorkReqeustBuilder<AWorker>().build()
val workB = OneTimeWorkRequestBuider<BWorker>().build()

WorkManager.getInstance()?.apply {
    beginWith(workA).then(workB).enqueue()
}
```



### 4. 작업 처리상태 파악

- **LiveData** 객체를 통해 해당 작업의 상태를 추적할 수 있다

```kotlin
val workRequest = OneTimeWorkRequestBuilder<ExampleWorker>().build()

val workManager = WorkManager.getInstance()
workManager?.let {
    it.enqueue(workRequest)
    
    /** WorkManager의 getStatusById()에 WorkRequest의 UUID 객체를 인자로 전달 하면
     *  인자값으로 주어진 ID에 해당하는 작업을 추적할 수 있도록 LiveData 객체를 반환한다
   	 */
    val statusLiveData = it.getStatusById(workRequest.id)
    /* statusLiveData에 Observer를 걸어서 작업의 상태를 추적 */
    statusLiveData.observe(this, Observer { workState ->
        Log.d("exmaple", "state: ${workState?.state}")
    })
}
```



### 5. 작업간 정보 전달

- setInputData() 메서드를 통해서 Data객체를 인자로 Worker에 정보를 전달할 수 있다

```kotlin
val input = mapOf("question" to "answer")
/* Data클래스의 Builder를 사용해서 Data 객체를 생성한다 */
val inputData = Data.Builder().putAll(input).build()

val requestWork = OneTimeWorkRequestBuilder<ExampleWork>()
	.setInputData(inputData)
	.build()
```

- Worker클래스에는 전달받은 Data 객체를 반환하는 getInputData() 메서드가 있으며, 이 메서드를 통해 Data객체를 반환받아 사용한다

```kotlin
val question = inputData.getString("question", "")
```

- **InputMeger**를 이용하면 여러 작업에서의 정보 전달이 가능해진다
  - WorkManager의 기본 InputMeger는 OverwritingInputMerger이다
  - `OverwritingInputMerger`
    - 여러개의 Data가 전달될 때 같은 Key를 가지는 value는 덮어 쓴다
  - `ArrayCreatingInputMerger`
    - 여러개의 Data가 전달될 때 같은 key를 가지는 value를 배열로 전달한다
    - 단 배열의 특성상 같은 Key의 value의 타입이 서로 다르면 배열을 만들 수 없기 때문에 exception이 발생한다

```kotlin
val sortWordWorker = OnetimeWorkReqeustBuilder<ExampleWorker>()
	.setInputMerger(ArrayCreatingInputMerger::class)
	.build
```



### 6. 작업 취소

- WorkRequest의 UUID 객체를 사용해 작업을 취소한다

```kotlin
/* cancelWork 작업을 WorkManager의 큐에 추가 */
WorkManager.getInstance()?.enqueue(cancelWork)

/* cancelWork의 id를 이용해서 작업을 취소 */
WorkManager.getInstnace()?.cancelWorkById(cancelWork.id)
```

- UUID는 어려운 문자열이기 때문에 쉽게 접근하기 위해 태그를 달 수 있다
- 태그를 이용해 작업을 취소하면 해당 태그를 가진 모든 작업을 한번에 취소하는 기능을 하게 된다

```kotlin
val cancelWork = OnetimeRequestBuilder<CancelWorker>()
	.addTag("cancel work tag")

WorkManager.getInstnace()?.cancelWorkById("cancel work tag")
```

- WorkManager에서 취소하고자 하는 작업이 이미 완료된 작업이라면 취소 메서드는 아무 기능도 하지 않는다
- 아직 실행 전 큐에 담긴 상태라면 실행하지 않고 취소된다
- 하지만 이미 실행된 작업을 임의로 멈추지는 않는다
  - 그래서 작업 취소 플래그를 설정해 줄 수 있다
  - isStopped() == true
    - 작업 중지 상태, isCancelled()가 false인 경우에는 시스템에 의한 작업이 중지된 경우 이므로 해당 작업은 다음 어느 시점에 다시 수행된다
  - isCancelled() == true
    - 작업 취소 상태, 반드시 isStopped()가 true임을 확인 한 후 해당 플래그를 참고해야 한다

```kotlin
override fun doWork() : Result {
    if (isStopped) {
        /* 작업이 멈추었을 때 대비한 코드 */
        
        if (isCancelled) {
            /* 작업이 취소 되었을 때 대비한 코드 */
        }
    }
}
```



### 7. 유일한 작업(Unique Work)

- beginUniqueWork() 메서드를 통해 Unique Work 라는 작업 처리 방식을 제공한다
- 작업에 유일한 이름을 부여하고 이 이름을 통해서 큐에 넣거나, 조회하거나, 취소할 수 있다
- 같은 이름을 가지는 작업이 이미 WorkManager 큐에 존재하면 추가하려는 작업에 대한 동작 방식을 KEEP, REPLACE, APPEND의 세가지 중 하나로 지정할 수 있다
  - `KEEP`
    - 작업 A가 실행 대기중 이거나 실행 중이면 작업B는 WorkManager의 큐에 추가 되지 않는다
    - 작업 A의 실행이 끝났다면 작업 B는 큐에 추가된다
  - `REPLACE`
    - 작업 A를 취소하고 작업 B를 큐에 추가한다
  - `APPEND`
    - 작업 B를 BLOCKED 상태로 대기시키고, 작업 A가 완료되면 작업 B를 큐에 추가한다

```kotlin
val workManager = WorkManager.getInstance()
val workers = OneTimeWorkRequestBuilder<ExampleWorker>()
	.build()

val config = workManager.beginUniqueWork("string", KEEP, workers)
val config = workManager.beginUniqueWork("string", REPLACE, workers)
val config = workManager.beginUniqueWork("string", APPEND, workers)
```



참고사이트

- [Modern background execution in Android](https://android-developers.googleblog.com/2018/10/modern-background-execution-in-android.html){: class="underlineFill"}

- [WorkManager, 잘 써보기](https://medium.com/@limgyumin/workmanager-잘-써보기-1643a999776b){: class="underlineFill"}

  









