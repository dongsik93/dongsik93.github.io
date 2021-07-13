---
layout: post
title: "FCM을 활용한 웹 푸시 구현 - javascript"
subtitle: "javascript를 이용해서 푸시구현"
date: 2019-07-31 18:00:00 +0900
categories: til
tags: fcm js
comments: true
---

## FCM을 활용한 웹 푸시



### FCM이란 ? 

- Firebase Clud Messaging
- 구글에서 제공하는 *__무료__*  교차 플랫폼 메시징 솔루션이다.

<br>

> 응? 뭘할수있는거지?

<br>

### PWA(progressive web app)

- FCM을 어디에 쓸지, 어떻게 쓸지에 대해 말하기 전에 PWA에 대해 알아보자
- PWA는 웹과 네이티브 앱의 기능 모두 이점을 갖도록 수많은 특정 기술과 표준 패턴을 사용해 개발된 웹 앱이다.
- PWA의 기능
  - 오프라인에서 동작
  - 설치가 가능
  - 쉬운 동기화
  - 푸시알림 등
- PWA의 장점
  - `Service Workers` 를 사용한 캐싱 덕분에 앱을 설치한 후에 로딩 시간이 줄어들어 소중한 데이터와 시간을 절약 가능하다
  - 시스템 알림 및 푸시 메시지를 통한 사용자의 재 참여, 참여율이 높은 사용자와 더 나은 전환율을 이끌어 냄

<br>

> 그래서 PWA을 만들기 위해 FCM을 이용해 푸시 알림을 구현할 수 있다 !!

<br>

### FCM 활용하기

<br>

- 본격적으로 FCM을 활용해보자
  - Firebase 계정이 만들어져있고, 프로젝트가 존재한다는 가정하에 시작
- [Firebase 공식문서](https://firebase.google.com/docs/cloud-messaging/js/client){: class="underlineFill"}



##### 1.  첫 방문시 알림 허용/차단 여부를 판단

- 제일 먼저 웹 사용자 인증 정보를 구성해야한다.
  - `Firebase Console` - `Setting` - `Cloud messaging` - `웹 구성`
  - 웹 푸시 인증서 탭에서 키 쌍 생성을 클릭한다.
  - 여기서 가져온 키를 잘 저장해 둔다.
- 이제 FCM을 사용하기위해 Firebase 기본 설정을 해준다

```js
import '@firebase/messaging';

const config = {
  projectId: "team-5dd61",
  apiKey: "Your api key",
  messagingSenderId: "Your sender ID",
};

firebase.initializeApp(config);
const messaging = firebase.messaging()
messaging.usePublicVapidKey("Your Web push key");
Notification.requestPermission().then(function(permission) {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  } else {
    console.log('Unable to get permission to notify.');
  }
});
```

- `Notification.requestpermission()` : 푸시 알람에 대한 동의 대화상자를 표시해준다

  - 여기서 거부를 누르면 다음에 이어질 토큰을 가져올 수 없다

- 토큰값을 가져오기 전에 메시징 서비스에 필요한 `firebase-messaging-sw.js` 파일을 만들어야 한다.

  - Firebase 공식문서에는 이 파일을 도메인의 루트에 저장해야 한다고 나와있다.
  - 최상위 루트가아닌 `도메인 루트` 에 저장해야한다
  - 제대로 경로를 잡지 않은 경우 에러가 발생한다

  ```
  DOM Error The script has an unsupported MIME type ('text/html')
  ```

  - 내 경우 `public` 에 넣으니까 해결이 되었다.

- 알람을 허용을 했으니까 이제 토큰값을 가져와 보자

```js
messaging.getToken().then(token =>{
    console.log(token)
})
```

<br>

##### 2. 알람을 허용한 유저에게 글(포스트, 포트폴리오) 등록시 푸시 알람 보내기

- 위에서 가져온 토큰 값을 가지고 푸시 알람 요청을 보내보자
- 일단 POSTMAN으로 테스트를 해보자

![postman_test](/img/in-post/fcm-postman.PNG)

- 그림와 같이 `POST` 요청을 보내주는데 header에 API KEY와  body에 notifiction에대한 정보, to에 토큰값을 넣어서 요청을 보내면 알람이 뜬다 !! 
- 이제 테스트한걸 코드로 구현한다.

```js
newPostPush(url,token){
    const message = {
      notification :{
          "body" : "새 포스트가 등록되었습니다.",
          "title": "진격의巨鳥",
          "icon": "favicon.ico",
          "click_action": "http://localhost:8080/",
       },
      to : token
    }
    fetch(url ,{
      method: 'POST',
      body: JSON.stringify(message),
      headers: new Headers({
        'Content-type': 'application/json',
        'Authorization' : 'Your API Key'
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
      }
    }).catch(e =>{
      console.log(e)
    })
  },
```

- 평소에 `axios`요청을 주로 사용했지만 이번엔 `ajax` 요청을 사용해보았다.
-  요청은 잘 된다. 
  - 근데 생각을 해보니 토큰값으로 알람을 보내면 새 글이나 새 포스트가 등록 되었을 때 해당 토큰값을 가진 유저에게만 알람이 가게된다.
  - 토큰값을 하나하나 저장해서 한꺼번에 요청을 해볼까도 했지만 간단한 방법을 사용기로 했다.
- 토큰이 아닌 주제(Topic)를 사용해 보자
- 주제로 메세지를 보내려면 주제를 등록해야한다.

```js
subscribeTokenToTopic(token, topic) {
 fetch('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Your API key'
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
      }
    }).catch(error => {
      console.error(error);
    })
  },
```

- 원하는 주제를 토큰값과 함께 정의한 `subscribeTokenToTopic` 함수에 넣어 요청하면 해당 토큰에 주제를 추가해준다

  - POSTMAN으로 확인

  ![postman_test2](/img/in-post/fcm-postman2.PNG)

  - `post`와 `portfolio` 두개가 주제로 구독이 된 걸 확인 ! 

- 이제 주제를 구독한 사람에게 메세지를 보내기 위해 함수를 수정해주자

```js
newPostPush(url){
      to : "/topics/post"
    }
```

- `to` 를 위 그림과 같이 수정하면 `post` 주제를 구독한 모든 유저에게 알람이 간다

- 이제 메세지를 보냈으니 보낸 메세지를 가져와 알람이 나오게 해야한다
- 메세지의 동작은 페이지가 포커스를 갖는 포그라운드 상태인지, 백그라운드 상태인지, 다른 탭 뒤에 숨겨저 있는지, 완전히 닫혀있는지에 따라 다르기 때문에 경우에 따른 처리가 필요하다.
- 내 경우 `포그라운드` 상태에서의 `onMessage` 콜백을 처리해줬다.

```js
messaging.onMessage(function(payload){
  console.log('onMessage: ', payload);
  var title = payload.notification.title;
  var options = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };
  var notification = new Notification(title,options);
});
```

- `Notification`을 통해 payload된 데이터를 가져와 알람을 띄워준다 
  - Notification 대신 alert나 div를 만들어서 띄울수도 있다.
- 결과 확인 !!

![facm-alarm](/img/in-post/fcm-alarm.png)

<br>

관련 글

- [Android - FCM, 푸시알림 (1/2)](https://dongsik93.github.io/til/2021/01/28/til-fcm-push/){: class="underlineFill"}
- [Android - FCM, 푸시알림 (2/2)](https://dongsik93.github.io/til/2021/02/20/til-android-fcm-2/){: class="underlineFill"}

<br>

참고사이트

- [Google Instance ID document](https://developers.google.com/instance-id/reference/server?hl=ko#create_relationship_maps_for_app_instances){: class="underlineFill"}
- [자바스크립트 firebase 클라우드 메시징 클라이언트 앱 설정](https://firebase.google.com/docs/cloud-messaging/js/client){: class="underlineFill"}
- [꿩이야기-fcm 푸시메시지](https://scorpio-mercury.tistory.com/11){: class="underlineFill"}
- [Notification request Permission](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission){: class="underlineFill"}
- [Ajax fetch](https://javascript.info/fetch){: class="underlineFill"}

