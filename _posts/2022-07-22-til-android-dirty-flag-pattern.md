---
layout: post
title: "[Android] Dirty Flag Pattern"
subtitle: "android designpattern"
date: 2022-07-22 18:00:00 +0900
categories: til
tags: Android DI Hilt
comments: true

---



# [Android] Dirty Flag Pattern



### Dirty Flag Design Pattern?

더티 플래그는 값의 변경이 일어나야 하는 상황을 플래그로 설정해두어, 꼭 필요한 상황에만 갱신을 하도록 해주는 패턴이다. 변화가 없는 상황인데 불필요한 연산을 한다면 퍼포먼스에 지장을 주기 때문이다

대부분의 글들이 게임 프로그래밍에 대해서 예를 들고있는걸 보니 게임만들때 많이 사용하는 패턴인것 같다

어느 상황에 적용시킬 수 있을까?

예를들어 PC와, 모바일 환경에서 각각 등록 ,수정 ,삭제가 가능한 환경이라고 해보면 모바일쪽에서는 서버쪽으로 upSync, downsync가 필요하게 된다.

upSync하는 과정은 사용자가 연락처를 등록 / 수정 / 삭제하면 먼저 기기 내부에 해당 정보를 저장하고, 저장한 값을 서버에 요청하는 간단한 과정이다. 하지만 인터넷 연결이 좋지 않다던지, 서버쪽 상태가 이상하다던지 이런 여러가지 상황에서 서버쪽에 요청하는게 실패했을때는 어떻게 해야 할까?

이때 DirtyFlag를 이용해서 처리를 해보도록 하자.



크게보면

1. 연락처 정보를 기기에 저장
2. 해당 정보를 서버에 요청
3. 서버 요청 결과에 따른 처리

의 순서로 진행할 수 있다.

먼저 연락처 정보를 기기에 저장해보자



### 1. 연락처 정보 저장 (생성, 수정, 삭제)

매우 간단하다

```kotlin
contactDao.insert(contactParam.contact.toEntity())
contactDao.update(contactParam.contact.toEntity(contactId))
contactDao.delete(contactId)
```

각각 동작에 맞춰서 db에 insert / update / delete 동작을 수행해주면 된다



### 2. 서버에 요쳥

해당 데이터를 서버에 요청… 이 동작은 dirtyFlag 테스트에서 중요하지 않기 때문에 건너뛰도록 한다



### 3. 서버 요청 결과에 따른 처리

이 부분이 중요한데, 서버 요청 결과가 성공이라면 이미 기기에 저장도 했고, 서버쪽에 요청도 완료했기 때문에 아무런 문제 없이 upSync가 완료된다.

하지만 실패했을 때가 중요하다. 서버 요청에 실패했다면 처리하는 방법은 서버 요청에 실패했으니까 기기에 해당 정보를 지워야지! 하면서 지울수도 있고, 지금은 실패했지만 나중에 다시 요청을 시도해볼 수 있다.

두번째 방법인 나중에 다시 요청을 하기위해서 dirtyFlag를 이용해 보자.

dirtyFlag를 사용하는 방법도 여러가지인데 ContactEntity, 즉 연락처 테이블에 flag 컬럼을 추가해서 관리할 수 도 있고, 아예 DirtyFlagEntity를 생성해서 관리할 수도 있다. DirtyFlagEntity를 이용해서 관리해보도록 하자

```kotlin
if (success) {
		// 서버에 요청 성공
    dirtyFlagDao.deleteDirtyFlagById(contactId)
} else {
    // 서버에 요청 실패
		val alreadyRegistered = dirtyFlagDao.loadByContactId(contactId)
    if (alreadyRegistered == null) {
        // 새로운 연락처
        println("신규 등록 연락처 ${contactParam.syncFlag} : $contactId")
        dirtyFlagDao.insert(DirtyFlagEntity(contactId))
    } else {
        // 이미 실패한 기록이 있는 연락처
        val updateEntity = DirtyFlagEntity.merge(contactParam.contact.toDirty(contactParam.syncFlag), alreadyRegistered)
        if (updateEntity.isMaximumRetryCountReached()) {
            println("최대 retry 도달 : $contactId")
        } else {
            println("기존 등록 연락처 update dirtyFlag retryCount : $contactId")
            dirtyFlagDao.update(updateEntity)
        }
    }
}
```

서버 요청에 실패했다면 먼저 해당 연락처가 이미 dirtyFlagEntity에 등록되어있는 연락처인지를 판단해서 등록이 되어있지 않다면 등록, 등록이 되어 있다면 기존에 존재하는 레코드와 새롭게 등록할 레코드를 비교해서 diryFlag를 update처리 해주면 된다.

계속 실패할 수도 있기 때문에 `isMaximumRetryCountReached()`를 통해서 retryCount를 정해놓고 update처리를 해주고있고, `merge` 를 통해서 생성 / 수정 / 삭제의 priority를 비교해서 우선순위가 높은 동작으로 update를 처리해줬다.

여기까지가 서버 요청 결과 실패시 동작이다. 그렇다면 이렇게 실패했을 때 등록해준 DirtyFlagEntity는 언제 사용하면 될까?

상황에 따라 다르겠지만, Worker를 통해서 앱 실행시, 인터넷 연결이 되어있으면 DirtyFlag에 등록해둔 연락처들을 다시 서버 요청해보도록 하자



### 4. Worker를 통해 DirtyFlagEntity 저장된 값 재요청

```kotlin
// ContactWorkManagerImpl
override fun start() {
    println("Worker Start !")

    val constraints = Constraints.Builder()
        /* 네트워크 연결 */
        .setRequiredNetworkType(NetworkType.CONNECTED)
        .build()

    val request = OneTimeWorkRequest.Builder(ContactWorker::class.java)

    request.setConstraints(constraints)
    request.setInputData(createInputParams(1))

    workManager.beginUniqueWork(WORK_ID, ExistingWorkPolicy.KEEP, request.build())
        .enqueue()
}
```

네트워크 연결 제약조건을 추가한 workManager에 ContactWorker를 등록한다

```kotlin
// ContactWorker
override suspend fun doWork(): Result {
    val accountId = inputData.getLong(PARAMS_ACCOUNT_ID, -1L)
    println("Contact Worker : $accountId")

    val context = applicationContext
    val database = AppDataBase.getInstance(context)
    val repository = DirtyFlagRepositoryImpl(database.dirtyFlagDao, database.contactDao)

    val result = repository.syncDirty()

    return if (result) Result.success() else Result.failure()
}
```

ContactWorker에서는 dirtyRepository의 `syncDirty`를 호출해주고

```kotlin
// DirtyRepositoryImpl
override fun syncDirty(): Boolean {
    val allDirtyData = dirtyFlagDao.loadDirtyFlag()

    allDirtyData.filter { it.syncFlag == SyncFlag.CREATE }.also { createList ->
        if (createList.isNotEmpty()) requestSync(createList)
    }
    allDirtyData.filter { it.syncFlag == SyncFlag.UPDATE }.also { updateList ->
        if (updateList.isNotEmpty()) requestSync(updateList)
    }
    allDirtyData.filter { it.syncFlag == SyncFlag.DELETE }.also { deleteList ->
        if (deleteList.isNotEmpty()) requestSync(deleteList)
    }

    // upSync 후처리
    dirtyFlagDao.deleteAll()

    return true
}
```

syncDirty는 DirtyFlagEntity에 들어있는 Contact를 다시 요청해준다



예제에 CoroutineWorker로 만들었는데, Worker생성자에 inject가 안된다... 이 부분은 다시 해결해서 포스팅을 해야겠다



#### 해당 예제 소스 : [dongsik93 git hub](https://github.com/dongsik93/blog-source/tree/master/dirty){: class="underlineFill"}

> 예제로 만들었기 서버에 요청하는 로직은 random으로 짜져있고, 그렇습니다... 이해부탁드려요



### 참고사이트

- [Dirty Flag, 더디 플래그 [디자인 패턴]](https://luv-n-interest.tistory.com/1115){: class="underlineFill"}