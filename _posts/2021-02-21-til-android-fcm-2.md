---
layout: post
title: "[Android] FCM, 푸시 알림 (2/2)"
subtitle: "FCM, 알림"
date: 2021-02-21 02:30:00 +0900
categories: til
tags: kotlin android
comments: true

---



# [Android] FCM, 푸시 알림 (2/2)



> [FCM 푸시 알림 (1/2)](https://dongsik93.github.io/til/2021/01/28/til-fcm-push/){: class="underlineFill"} 에 이어서 FCM으로 수신받은 데이터를 Notification으로 띄우는 방법을 알아보자



FCM으로 데이터를 수신받고 수신받은 데이터를 알림으로 띄워줄 수 있다

이 알림을 띄워주는 방법이 여러가지 방법이 존재하기 때문에 사용 목적에 따라서 잘 선택해서 구현하면 된다



#### 알림 띄워주기

- 이전 글에서 데이터를 받아서 노티를 띄워주면 된다라고 작성했는데 그 노티를 띄워주는 부분을 알아보자

  ```kotlin
  override fun onMessageReceived(remoteMessage: RemoteMessage) {
      val body = remoteMessage.data["body"]
      val title = remoteMessage.data["title"]
  }
  ```

- body와 title 정보를 통해 노티를 띄워준다

  ```kotlin
  val notificationManager =
              appContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
  val bitmap = FileUtils.vectorToBitmap(appContext, R.drawable.ic_app_icon)
  val pendingIntent = PendingIntent.getActivity(appContext, 0, intent, 0)
  val notification = NotificationCompat.Builder(appContext, FCM.NOTIFICATION_CHANNEL)
  .setLargeIcon(bitmap) // 노티 부분의 LargeIcon
  .setSmallIcon(R.drawable.ic_app_version) // 노티 부분의 SmallIcon
  .setContentTitle(dataSet.first) // 제목
  .setContentText(dataSet.second) // 본문
  .setAutoCancel(true)
  .setContentIntent(pendingIntent)
  .setDefaults(NotificationCompat.DEFAULT_ALL)
  .setNumber(prefManager.getInt(PREFS.BADGE_COUNT, 1))
  
  notification.priority = NotificationCompat.PRIORITY_MAX
  
  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      notification.setChannelId(FCM.NOTIFICATION_CHANNEL)
  
      val ringtoneManager = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
      val audioAttributes = AudioAttributes.Builder()
      .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
      .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
      .build()
  
      val channel = NotificationChannel(
          FCM.NOTIFICATION_CHANNEL,
          FCM.NOTIFICATION_NAME,
          NotificationManager.IMPORTANCE_HIGH
      )
  
      channel.apply {
          enableLights(true)
          enableVibration(true)
          setSound(ringtoneManager, audioAttributes)
      }
  
      notificationManager.createNotificationChannel(channel)
  }
  
  notificationManager.notify(id, notification.build())
  ```

  - `largeIcon` , `smallIcon`, `title` 등등 노티와 관련된 여러가지 설정을 해주고
  - 오레오 이상부터는 Channel 설정을 해줄수 있으므로 channel 설정까지 해준뒤 노티를 띄워주는 코드이다



### Background // Foreground

- FCM 알림은 기기의 상태에 따라서 `Foreground` , `Background` 상태에서 수신을 받고 노티를 띄워줄 수 있다

- `Notification` 에 style을 지정한다던지, Network 이미지를 원하는데로 구현하려면 위의 예처럼 데이터를 수신받아서 따로 처리해야 한다

  ```xml
  <!-- AndroidManifest.xml -->
  <meta-data
             android:name="com.google.firebase.messaging.default_notification_icon"
             android:resource="@drawable/ic_app_icon" />
  <meta-data
             android:name="com.google.firebase.messaging.default_notification_color"
             android:resource="@color/colorAccent" />
  ```

- 이렇게 `Manifest`에 icon과 색상을 설정할 수 있다고 구글 공식 문서에는 나와있다

- 단 이 설정을 사용하기 위해서는 `notification` 키로 메세지를 보내야 하며, 위의 설정은 `Background` 에서만 적용된다

- 그래서 FCM 메세지를 `notification`과 `data` 키를 두 개 모두 사용해서 보냈을 때 어떻게 처리하나 살펴보았다
  - `remoteMessage.data` 통해 처리하고 있다라고 할 때  `Foreground` 에서는 기존에 `onMessageReceived`에서 처리한 대로 `data` 의 데이터가 노티로 올라가게 된다
  - 하지만 `Background` 에서는 `remoteMessage.data` 에 메세지가 수신되지 않고 위에서 `manifest` 에 설정해준 appIcon이 있다면 여기 설정대로 노티가 올라온다
  - 왜냐하면 앱이 `Background` 상태에 있는 경우 내가 설정한 `onMessagedReceived` 에서 데이터를 처리하는 것이 아닌 SDK에서 전달받은 데이터에서 `notification` 키가 있는경우 자체적으로 처리를 해버린다고 한다
  - 그렇기 때문에 `Background` 에서는 FCM 메세지에 `notification` 가 포함되어있다면 노티를 **커스터마이징 할 수 없다**



결론 !!

노티를 포그라운드, 백그라운드에서 모두 사용하고 싶고 노티 스타일을 내 마음대로 바꾸고 싶으면 `data` 를 통해서 메세지를 내려줘야 `onMessagedReceived` 에서 처리할 수 있다



















