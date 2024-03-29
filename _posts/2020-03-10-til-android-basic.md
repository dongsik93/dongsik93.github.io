---
layout: post
title: "[Android] Android 앱 기본요소"
subtitle: "android "
date: 2020-03-10 22:30:00 +0900
categories: til
tags: kotlin android
comments: true
---

# Android 앱 기본요소



Android앱은 Kotlin, Java, C++언어를 사용하여 작성한다. **Android 패키지**는 접미사가 `.apk`인 아카이브 파일이다. 

Android 시스템은 기본적으로 자신의 작업을 수행하기 위해 필요한 구성 요소에만 엑세스 권한을 가지고 그 이상은 허용되지 않는, **최소 권한의 원리**에 따라 구현된다. 이렇게 하면 안전한 관경이 구성되어 앱이 시스템에서 권한을 부여받지 못한 부분에는 액세스할 수 없게 된다.

앱이 다른 앱과 데이터를 공유하고 시스템 서비스에 액세스 하는 방법은 다음과 같다

- 두 개의 앱이 같은 Linux 사용자 ID를 공유하도록 설정할 수도 있다. 이 경우 두 앱은 서로 파일에 액세스할 수 있게 된다. 시스템 리소스를 절약하기 위해 사용자 ID가 동일한 앱들이 같은 Linux 프로세스에서 실행되고 같은 VM을 공유하도록 설정할 수도 있습니다. 또한 이러한 앱은 같은 인증서로 서명해야 한다
- 앱은 사용자의 연락처, SMS 메시지, 마운트 가능한 저장소(SD 카드), 카메라, 블루투스를 비롯한 여러 가지 기기 데이터에 액세스할 권한을 요청할 수 있다.



## 앱 구성요소

Android 앱의 필수적인 기본 구성 요소이며, 각 구성 요소는 시스템이나 사용자가 앱에 들어올 수 있는 진입점이고 다른 구성 요소에 종속되는 구성 요소도 있다

각 유형은 각자 lifecycle이 존재하기 때문에 각 개념을 먼저 알아보고 lifecycle을 알아보자

#### 1. 액티비티(Acctivity)

- 액티비티는 사용자와 **상호작용하기 위한 진입점**이다
- 사용자가 앱 내에서(뒤로 버튼으로) 탐색하거나 앱 간에(최근 버튼으로) 이동하는 방법의 중심이다
- 사용자 인터페이스를 포함한 화면 하나를 나타낸다
- 여러 액티비티가 함께 작동하여 해당 이메일 앱에서 짜임새 있는 사용자 환경을 구성하는 것은 사실이지만, 각자 서로 독립되어 있다
- 액티비티는 다음과 같이 시스템과 앱의 주요 상호작용을 돕는다
  - 사용자가 현재 관심을 가지고 있는 사항(화면에 표시된 것)을 추적하여 액티비티를 호스팅하는 프로세스를 시스템에서 계속 실행하도록 한다
  - 이전에 사용한 프로세스에 사용자가 다시 찾을 만한 액티비티(중단된 액티비티)가 있다는 것을 알고, 해당 프로세스를 유지하는데 더 높은 우선순위를 부여한다
  - 앱이 프로세스를 종료하도록 도와서 이전 상태가 복원되는 동시에 사용자가 액티비티로 돌아갈 수 있게 한다
  - 앱이 서로 사용자 플로우를 구현하고 시스템이 이러한 플로우를 조정하기 위한 수단을 제공한다
- 액티비티 하나를 `Activity` 클래스의 하위 클래스로 구현한다
- 예시
  - 이메일 앱에서 새 이메일 목록을 표시하는 액티비티가 있고, 이메일을 작성하는 액티비티, 이메일을 읽는데 쓰는 액티비티가 있을 수 있다
  - 여러 액티비티가 함께 작동하여 해당 이메일 앱에서 사용자 환경을 구성하지만 각자 서로 독립되어 있다

#### 2. 서비스

- 서비스는 여러 가지 이유로 백그라운드에서 앱을 게속 실행하기 위한 **다목적 진입점**이다.
- 백그라운드에서 실행되는 구성 요소로, 오랫동안 실행되는 작업을 수행하거나 원격 프로세스를 위한 작업을 수행한다
- 사용자 인터페이스를 제공하지 않는다
- 서비스의 유형
  - 포그라운드 // 백그라운드 // 바인드
- 서비스는 `Service` 하위 클래스로 구현된다
- 예시
  - 사용자가 다른 앱에 있는 동안에 백그라운드에서 음악을 재생
  - 백그라운드에서 일부 데이터를 동기화하거나 사용자가 앱에서 나간 후에도 음악을 재생하는 등의 서비스

#### 3. Broadcast Receiver

- Broadcast Receiver는 시스템이 장기적인 사용자 플로우 밖에서 이벤트를 앱에 전달하도록 지원하는 구성요소로 앱이 시스템 전체의 브로드캐스트 알림에 응답할 수 있게 한다
- Broadcast Receiver도 앱으로 들어갈 수 있는 **명확한 진입점**이기 때문에 현재 실행되지 않은 앱에도 시스템이 브로드캐스트를 전달할 수 있다

- 예시
  - 앱이 사용자에게 예정된 이벤트에 대해 알리는 알림을 게시하기 위한 알람을 예약할 경우, 그 알람을 앱의 Broadcast Receiver에 전달하면 알람이 울릴 때 까지 앱을 실행하고 있을 필요가 없다
  - 앱도 브로드캐스트를 시작할 수 있는데, 다른 앱에 일부 데이터가 기기에 다운로드되었고 이를 사용할 수 있다는 것을 알리는데 사용한다
- Broadcast Receiver는 BroadcastReceiver의 하위 클래스로 구현되며 각 브로드캐스트는 `Intent` 객체로 전달된다

#### 4. 콘텐츠 제공자

- 콘텐츠 제공자는 파일 시스템, SQLite, 웹상이나 앱이 액세스 할 수 있는 다른 모든 영구 저장 위치에 저장 가능한 앱 데이터의 공유형 집합을 관리한다
- 다른 앱을 콘텐츠 제공자를 통해 해당 데이터를 쿼리하거나, 콘텐츠 제공자가 허용할 경우 수정도 가능하다
- 콘텐츠 제공자는 `ContentProvider`의 하위 클래스로 구현되며, 다른 앱이 트랜잭션을 수행할 수 있도록 활성화 하는 표준적인 API 집합을 구현해야 한다



#### 구성 요소의 활성화

- 구성 요소 유형 네 가지 중 세가지(액티비티, 서비스, Broadcast Receiver)는 **인텐트**라는 비동기식 메시지로 활성화 된다
- 즉, 구성 요소가 어느 앱에 속하든 관계없이 다른 구성 요소로부터 작업을 요청하는 역할을 한다
- 인텐트는 `Intent`객체로 생성되며, 이것이 **특정 구성 요소(명시적 인텐트)**를 활성화 할지 구성요소의 **특정 유형(암시적 인텐트)**을 활성화 할지 나타내는 메시지를 정의한다
  - 액티비티와 서비스의 경우 인텐트는 수행할 작업을 정의한다
  - Broadcast Receiver의 경우 인텐트는 단순히 브로드캐스트 될 알림을 정의한다
- 콘텐츠 제공자는 인텐트가 아닌, **ContentResolver**가 보낸 요청의 대상으로 지정되면 활성화된다



## 매니페스트 파일



Android 시스템이 앱 구성 요소를 시작하려면 시스템은 앱의 **매니페스트 파일**인 `AndroidManifest.xml`을 읽어서 해당 구성 요소가 존재하는지 확인한다

이 파일 안에 모든 구성 요소를 선언해야 하며, 이 파일을 앱 프로젝트 디렉토리의 루트에 있어야 한다

매니페스트의 역할을 다음과 같다

- 앱이 요구하는 모든 사용자 권한을 식별
- 앱이 어느 API를 사용하는지를 근거로 앱에서 요구하는 최소 API레벨을 선언
- 앱에서 사용하거나 요구하는 하드웨어 및 소프트웨어 기능
- 앱이 링크되어야 하는 API 라이브러리



참고사이트

- [애플리케이션 기본 항목](https://developer.android.com/guide/components/fundamentals?hl=ko){: class="underlineFill"}


