---
layout: post
title: "[Android] Task Hijacking 취약점 CVE-2021-33699"
subtitle: "CVE-2021-33699 Task Hijacking"
date: 2023-04-10 18:00:00 +0900
categories: til
tags: android secure
comments: true

---



# [Android] Task Hijacking 취약점 CVE-2021-33699

> 이전 글이 새해 첫글!!! 이거네...너무 오랜만에 남기는 글...



[CVE-2021-33699](https://www.cvedetails.com/cve/CVE-2021-33699/){: class="underlineFill"}



안드로이드 Task Hijacking 취약점(CVE-2021-33699)은 2021년 6월에 발견된 안드로이드 운영체제의 보안 취약점 중 하나로, 이 취약점은 악의적인 앱이 사용자의 활성화된 앱 태스크를 가로채어 해당 태스크의 권한을 획득할 수 있는 것을 가능하게 한다

이 취약점을 악용하면, 공격자는 다른 앱의 권한을 획득하여 사용자의 데이터를 탈취하거나 악성 코드를 실행할 수 있다. 이러한 공격은 안드로이드 11 이전의 모든 버전에서 가능하다.



### 문제점

1. launchMode가 "singleTop" 또는 "singleTask"인 경우
    - 조건에 따라 악성 액티비티로 치환될 수 있다
2. Task Affinity 값을 지정하지 않는 경우
    - taskAffinity는 앱의 태스크를 실행할 때, 해당 태스크가 속한 태스크 스택을 식별하는 데 사용되는데, 이 속성은 기본적으로 앱의 패키지 이름과 동일하게 설정된다
    - 악성 앱에서는 위의 경우 자신의 taskAffinity 값을 다른 앱의 패키지 이름으로 설정하여 해당 앱의 권한을 획득할 수 있다. 예를 들어, 악성 앱에서 taskAffinity 값을 은행 앱의 패키지 이름으로 설정하면, 해당 은행 앱이 실행 중일 때 악성 앱이 해당 은행 앱의 권한을 가지게 된다

### 해결

1. launchMode를 SingleTop과 SingleTask 지정 제외
    - 액티비티 인스턴스를 하나만 유지해야 하는 경우 SingleInstance 사용을 고려
    - launchMode가 standard(default)인 액티비티에서도 SingleTop 플래그를 사용한다면 Task Hijacking에 노출된다. 만약에 사용해야한다면, 추가적인 보안 메커니즘을 적용하여 Task Hijacking 취약점을 방지해야 한다
2. Task Affinity 값을 지정하지 않는 경우
    - null 값을 배정하거나, 고유한 taskAffinity값을 배정한다



그렇다면 액티비티에서 singleTop 이나 singleTask Flag를 사용해야 하는 경우에는 어떻게 하면 될까?



```xml
<activity
    android:name=".MyActivity1"
    android:taskAffinity="com.example.myapp.activity1" />
<activity
    android:name=".MyActivity2"
    android:taskAffinity="com.example.myapp.activity2" />
```



```kotlin
val intent = Intent().apply {
    component = ComponentName("com.example.myapp", "com.example.myapp.MyActivity1")
    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
    addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
}
startActivity(intent)
```



위의 코드는 고유한 taskAffinity값이 있는 새 작업에서 'MyActivity1'을 시작하고 이후에 동일한 액티비티를 시작할 때 기존 task와 액티비티 인스턴스를 재사용하도록 한다. **`FLAG_ACTIVITY_SINGLE_TOP`** 플래그는 새 인스턴스를 생성하는 대신 활동의 기존 인스턴스를 사용해야 함을 지정하는 반면, **`FLAG_ACTIVITY_CLEAR_TOP`** 플래그는 작업의 대상 활동 위에 있는 다른 모든 활동이 시작하기 전에 지워지도록 한다.

고유한 taskAffinity 값과 **`FLAG_ACTIVITY_SINGLE_TOP`** 플래그의 조합을 사용하면 태스크 하이재킹 취약점을 방지할 수 있다.