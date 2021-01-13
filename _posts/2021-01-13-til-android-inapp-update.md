---
layout: post
title: "[Android] 인앱 업데이트"
subtitle: "인앱 업데이트"
date: 2021-01-13 18:30:00 +0900
categories: til
tags: kotlin android
comments: true

---



# [Android] 인앱 업데이트



> 구플 플레이 스토어에 들어가서 앱을 업데이트 하는것이 아닌 
>
> 내 앱에서 업데이트를 확인하고, 업데이트까지 진행할 수 있는 방법을 알아보자



이번에 회사 서비스를 개발하는 중 인앱 업데이트 관련 기능을 개발해야하서 방법을 찾아보게 되었다

예전 방법으로는 플레이스토어에 내 앱을 검색해서 해당 버젼이 지급 버젼과 맞는지 안맞는지 확인(?)해서 다르면 플레이스토어로 연결 시켜주는 방법으로 진행을 했다고 하셨고(안찾아봐서 잘 모르겠다)

새로운 방법이 나온 것으로 알고 계신다는 조언에 공식 사이트에 들어가서 찾아보게 되었다



[인앱 업데이트 지원](https://developer.android.com/guide/playcore/in-app-updates?hl=ko){: class="underlineFill"}



역시 공식문서 :thumbsup::thumbsup:



공식문서에 하나하나 너무 정리가 잘 되어있어서 개발하면서 겪었던 문제들만 간단하게 적어보도록 하겠다



1. ### 바보같았던 업데이트 매니저 초기화 문제

   - 액티비티가 생성되기 전에 this를 참조하면서 npe가 발생

   ```kotlin
   // 문제가 됐던 코드
   private val appUpdateManager = AppUpdateManagerFactory.create(this)
   ```

   - `by lazy` 를 통해서 초기화 지연

     > **by lazy**
     >
     > 정의된 프로퍼티가 사용되는 최초의 시점에서 초기화 과정을 실행한다

   ```kotlin
   // 해결
   private val appUpdateManager by lazy { AppUpdateManagerFactory.create(this) }
   ```



2. ### 되는지 안되는지 테스트

   - 즉시 업데이트 방법이던, 유연한 업데이트 방법이던 구현을 했으면 테스트를 해봐야 한다
   - 하지만 많은 블로그들과 구글링 결과 **테스트는 플레이 스토어에 앱이 올라가있는 상태여야 가능하다** 

   ```json
   // 실제 appUpdateInfo 값
   {
      packageName=com.packageName,
      availableVersionCode=versionCode,
      updateAvailability=3,
      installStatus=11,
      clientVersionStalenessDays=null,
      updatePriority=0,
      bytesDownloaded=0,
      totalBytesToDownload=0,
      additionalSpaceRequired=0,
      assetPackStorageSize=0,
      immediateUpdateIntent=PendingIntent{
         "3dafa02":android.os.BinderProxy@bf53f13
      },
      flexibleUpdateIntent=null,
      immediateDestructiveUpdateIntent=null,
      flexibleDestructiveUpdateIntent=null
   }
   ```

   - 내 상태는 현재 플레이 스토어에 앱이 올라가 있었기 때문에 그럼 gradle 버전만 수정해서(현재 올라가있는 버젼보다 낮게) 테스트를 해봐야겠다 ! 라고 생각하고 바로 빌드해서 테스트를 해봤지만 내가 원하는데로 업데이트가 되지 않았다.
   - 머리를 계쏙 싸매면서 찾아보니 우연치 않게 이 로그를 보게 되었다

   ```
   I/PlayCore: UID: [00000]  PID: [00000] AppUpdateService : linkToDeath
   ```

   - 구글링을 해보니 **스튜디오로 빌드** 한 앱의 경우 잘 동작하지 않는다는 글을 찾게되었다...
   - [linkToDeath](https://stackoverflow.com/questions/63956696/flutter-appupdateservice-linktodeath){: class="underlineFill"} 플러터 질문이긴 하지만 ..
   - 그래서 테스트 할 코드를 스토어에 올리고, 테스트기기에 플레이스토어에서 받은 버전으로 테스트를 해보니 정상적으로 잘 동작됨을 확인할 수 있었다
   - **하지만** 왜 안되는지 이해가 되지 않아서 이것 저것 테스트를 해봤는데 나는 내가 올렸던 버젼(즉, 플레이 스토어에 존재했던 버젼)으로 gradle을 수정해서 테스트를 해봤었는데, 스토어에 존재하지 않은 버전으로 수정 후 테스트를 해보니 또 정상적으로 잘 되는것을 확인했다(왜 이러는지는 아직도..)

   - 어쨌든 !! 스토어에 올라가기를 기다리면서 테스트를 했어야 하는 상황보다는 나아졌기 때문에 올라가 있지 않은 버전으로 테스트를 할 수 있다 !!





실제 코드는 200줄도 안될만큼 간단했지만, 테스트 때문인지 생각보다 많은 시간을 들여서 처리하게 되었다 :cry:























