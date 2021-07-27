---
layout: post
title: "[Android] Firebase Remote Config"
subtitle: "Firebase Remote Config"
date: 2021-07-27 00:50:00 +0900
categories: til
tags: Android Firebase
comments: true
---



# [Android] Firebase Remote Config



> 인앱 업데이트가 생각했던것 처럼 동작하지 않고, deprecated 대응하는데 아직 업데이트가 안되어있어서 실제 사용하는데 문제가 있다고 판단되어, 이를 대체 할만한것을 찾아봤다..!



Firebase Remote Config 홈페이지 설정은 다른 블로그에 너무 잘 나와있어서 생략 ...



### 1. 앱 수준 build.gradle에 추가

```kotlin
dependencies {
    // Import the BoM for the Firebase platform
    implementation platform('com.google.firebase:firebase-bom:26.5.0')

    // Declare the dependencies for the Remote Config and Analytics libraries
    // When using the BoM, you don't specify versions in Firebase library dependencies
    implementation 'com.google.firebase:firebase-config-ktx'
    implementation 'com.google.firebase:firebase-analytics-ktx'
}
```

</br>

### 2. 원격 구성 싱글톤 객체 가져오기

- 처음 코드를 작성할 때는 Application class를 상속받은 클래스에 FirebaseRemoteConfig 객체를 전역으로 선언한 후 가져다 쓸 생각이였는데 Warning이 발생했다

```text
Do not place Android context classes in static fields (static reference to FirebaseRemoteConfig which has field context pointing to Context); this is a memory leak
```

- 말 그대로 Static한 응용프로그램 클래스를 전역으로 사용하면 메모리 누수가 날 위험이 있다는 것이다
- FireBaseRemoteConfig는 싱글톤 객체이기 때문에 전역으로 저장해서 사용할 필요가 없다

</br>

- `fromCallable`을 사용해서 remoteConfig의 결과를 비동기적으로 가져오는 코드이다

```kotlin
fun getRemoteConfigResult(tag: String, callback: RemoteConfigCallback): Disposable {
    val remoteConfig = FirebaseRemoteConfig.getInstance().apply {
        val configSettings = FirebaseRemoteConfigSettings.Builder()
            .setMinimumFetchIntervalInSeconds(30)
            .build()
        setConfigSettingsAsync(configSettings)
        setDefaultsAsync(R.xml.remote_config_defaults)
    }
	
    return Single.fromCallable {
        return@fromCallable remoteConfig.fetchAndActivate().addOnCompleteListener { task ->
            if (task.isSuccessful) {
                callback.success()
            } else {
                callback.fail()
            }
        }
    }
    .subscribeOn(AndroidSchedulers.mainThread())
    .observeOn(Schedulers.io())
    .subscribe()
}
```

- `FirebaseRemoteConfig` 인스턴스를 가져온 후 `FirebaseRemoteConfigSetting` 빌더를 통해서 가져오기 간격을 조정해서 새로고침을 할 수 있도록 했다
    - 가져오기 호출은 제한이 걸려있는데 , 아무런 설정을 하지 않을 경우 기본값 12시간으로 설정되어있고 개발할때만 `setMinimumFetchIntervalInSeconds` 메서드를 통해서 간격을 조정하길 권장하고 있다

</br>

- `setDefaultAsync` 를 통해서 아래와 같이 기본값을 xml에 저장하고, 설정해줄 수 있다

```xml
<?xml version="1.0" encoding="utf-8"?>
<defaultsMap>
    <entry>
        <!-- 해당하는 Key, Value는 Firebase에 설정해준 값과 동일해야 한다 -->
        <key>android</key>
        <value>{"version_name":50201,"priority":1}</value>
    </entry>
</defaultsMap>
```

</br>

- `fetchAndActivate()` 를 통해서 서버에서 값을 가져올 수 있다

```
Asynchronously fetches and then activates the fetched configs.
If the time elapsed since the last fetch from the Firebase Remote Config backend is more than the default minimum fetch interval, configs are fetched from the backend.
After the fetch is complete, the configs are activated so that the fetched key value pairs take effect.
```

- 비동기적으로 값을 패치하며, 패치된 결과를 실행시킨다. 만약 백엔드로부터 마지막 패치시점 시간이 설정된 시간 이내이면 최근 패치한 값을 가져오고, 시간이 지났다면 백엔드로부터 값을 다시 패치한다

</br>

참고사이트

- [공식 문서 : Android에서 Firebase 원격 구성 시작하기](https://firebase.google.com/docs/remote-config/use-config-android?hl=ko#kotlin+ktx){: class="underlineFill"}

