---
layout: post
title: "[Android] FCM, 푸시 알림"
subtitle: "FCM, 알림"
date: 2021-01-28 23:30:00 +0900
categories: til
tags: kotlin android
comments: true
---



# [Android] FCM, 푸시 알림



> 1년 전 쯤? 웹쪽 공부를 하면서 웹에서 FCM 수신, 발신했던 기억이 있다. [FCM을 활용한 웹 푸시](https://dongsik93.github.io/til/2019/07/31/til-etc-fcm/){: class="underlineFill"}
>
> 앱 개발을 하게되면서 FCM을 적용하게 되었다





1. ### 준비단계

   - gradle 설정

     - project

     ```kotlin
     classpath "com.google.gms:google-services:$gms_version" // Google Services plugin
     ```

     - module

     ```kotlin
     implementation "com.google.firebase:firebase-messaging:$fcm_version"
     apply plugin: 'com.google.gms.google-services'
     ```

   - google-service.json

     - app 폴더안에 넣어주기

   - manifests 설정

     ```xml
     <!-- FCM -->
     <service android:name=".fcm.MyFCMService">
         <intent-filter>
             <action android:name="com.google.firebase.MESSAGING_EVENT" />
         </intent-filter>
     </service>
     ```

   

   

2. ### FCM 수신부 만들기

   - manifests에 설정해줬던 `MyFCMService` 를 만들어야 한다
- `FirebaseMessagingService()` 를 상속하는 클래스를 통해서 FCM를 수신할 수 있다
  
   ```kotlin
   class MyFCMService : FirebaseMessagingService() {
       override fun onMessagedReceived(remoteMessage: RemoteMessage) {}
       override fun onNewToken(p0: String) {
           super.onNewToken(p0)
       }
   }
   ```
   
   - `onMessagedReceived` 메서드 오버라이딩을 통해서 FCM을 수신한다
   - **remoteMessage** 객체를 통해서 어떤 정보들이 수신되었는지 확인할 수 있다
   - postman을 통한 메세지 송신 테스트
   
   ![fcm_1](/img/in-post/fcm_1.png)
   
   - 주목해야 할 부분이 `notification` 과 `data` 이 부분이다
   
   - Android에서는 notification과 data를 통해서 메세지를 수신할 수 있다
   
   - `notification`을 통해 메시지를 수신할 경우
   
     ```kotlin
     override fun onMessageReceived(remoteMessage: RemoteMessage) {
         val body = remoteMessage.notification.body
         val title = remoteMessage.notification.title
     }
     ```
   
   - `data`를 통해 메시지를 수신할 경우
   
     ```kotlin
     override fun onMessageReceived(remoteMessage: RemoteMessage) {
         val body = remoteMessage.data["body"]
         val title = remoteMessage.data["title"]
     }
     ```
   
   - 두가지 중 어떤것을 이용해도 상관없으니 용도에 따라서 선택하면 된다
   
   - 내 경우 ios와 android를 하나의 페이로드를 통해서 작업을 진행했기 때문에 notification을 사용했다
   
     - ios가 notification을 사용해야 한다고 해서(?)
   
   - data를 사용할 경우 key값을 정의해서 좀 더 다양하게 커스터마이징을 할 수 있는 장점이 있다





위의 두가지 예처럼 fcm을 통해 메세지를 수신한 후 수신한 데이터를 바탕으로 노티를 띄워주면 된다

노티를 띄우는건 다른 포스팅을 올릴 예정입니다!



















