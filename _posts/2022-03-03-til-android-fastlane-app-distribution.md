---
layout: post
title: "[Android] 테스트앱 자동배포"
subtitle: "fastlane + Firebase App Distribution"
date: 2022-03-03 18:00:00 +0900
categories: til
tags: android fastlane firebase
comments: true

---



# [Android] 테스트앱 자동배포



FastLane + Firebase App Distribution 으로 원숭이 탈출하기!

미루고미루고미루고 미루고있었던 테스트앱 자동배포를 드디어 적용했다  😊



### 왜 테스트 앱 자동배포를 적용했는가?

1. 기존 테스트앱 배포 프로세스가 복잡하다
    - 기존 프로세스는 기능 개발 - 앱 빌드 - apk 전달 하는 방식으로 상당히 원시적인? 방법으로 테스트를 진행하고 있었다
    - 개발자 입장에서도 불편하고, 테스트를 해주는 기획팀에서도 많은 불편함이 존재했다
2. 자동배포에 대한 요구



## 적용

Firebase 공식문서인 [Distribute Android apps to testers using fastlane](https://firebase.google.com/docs/app-distribution/android/distribute-fastlane){: class="underlineFill"} 을 참고하면 된다



### 1. Google PlayStore API 엑세스 설정

Google Cloud Platform으로 이동해서 `서비스계정`을 만든 뒤 연결시켜준다

![fast_1.png](/img/in-post/fast_1.png)



서비스계정 생성시 주의할 점은 `서비스 계정 사용자`로 설정해주어야 한다

![fast_2.png](/img/in-post/fast_2.png)



서비스 계정을 생성한 후 키 추가를 통해서 JSON 키를 만들어 저장해둔다

![fast_3.png](/img/in-post/fast_3.png)



### 2. fastlane 설치

가장 먼저 fastlane을 설치해준다

```bash
$ brew install fastlane
```

그 다음 fastlane을 적용하려는 프로젝트 repo로 이동한다

```bash
$ cd project
```

프로젝트 경로에서 fastlane을 초기화해준다

```bash
$ fastlane init

>>> init을 하게되면 
1. package name 입력 : com.sample.app
2. JSON secret file path 설정 : 이 설정은 위에서 다운로드 받아둔 JSON파일의 경로를 넣어주면 된다
3. metadata, screenshot, build -- 라는 내용의 옵션 등은 나중에 할수있으므로 n으로 건너뛰기
```

이제 잘 세팅이 되었는지 확인

```bash
$ fastlane test

or

$ bundle exec fastlane test
>>> bundle을 사용할 경우 업데이트 유/무에 따라서 명령어가 안될수도 있다
```

fastlane init 할 때 JSON file을 건너뛰었다면 다음과 같은 방법으로 변경할 수 있다

```bash
$ bundle exec fastlane run validate_play_store_json_key json_key:/path/to/your/json/key.json

그 후 AppFile을 열어서 json 경로를 수정해주면 된다
```



### 3. fastlane과 Firebase App Distribution 연결

설정된 fastlane에 Firebase App Distribution을 연결해준다

```bash
$ fastlane add_plugin firebase_app_distribution
```

연결이 완료되면 Firebase 인증을 해야한다 - Firebase CLI

```bash
$ bundle exec fastlane run firebase_app_distribution_login
```

위 명령어를 입력하면 “Open the following address in your browser and sign in with your Goole account: ~ 주소" 가 나오는데 주소를 클릭해서 firebase 계정에 로그인해주면 된다

그 후 토큰을 복사해서 다시 입력해준다

```bash
$ Enter the resulting code here : 여기에 복붙!
```

입력이 완료되면 Refresh Token이 발급되는데 이를 환경변수로 설정해준다

```bash
$ export FIREBASE_TOKEN=토큰
```



### 4. 마지막 배포 lane 설정

배포를 위한 lane 명령어를 생성해준다

위치는 프로젝트경로의 ./fastlane/FastFile 이다

기본적으로 생성된 lane 밑에 추가해주도록 한다

```bash
desc "Lane for distribution"
lane :distribute do
	gradle( task: "clean assembleRelease")
	firebase_app_distribution(
		app: "Firebase App Id",
		debug: true
	)
end
```

여기에 여러가지 설정을 해줄 수 있는데 [Firebase App Distribution - 3단계: Fastfile 설정 및 앱 배포] 문서에서 확인할 수 있다

### 5. 마지막 실행

이제 모든과정이 완료되면 생성된 lane을 실행하면 끝!

```bash
$ fastlane distribute
```

![fast_4.png](/img/in-post/fast_4.png)



이렇게 successfully가 되면

![fast_5.png](/img/in-post/fast_5.png)



Firebase 콘솔에서 해당 버전이 올라간 모습을 확인할 수 있다



### + 테스터 초대

![fast_6.png](/img/in-post/fast_6.png)

테스터에게 초대링크를 건네주면

1. 초대링크를 타고들어가면 이메일 입력 안내가 나온다
2. 앱이 테스트가 준비되면 이메일로 해당 테스트앱 안내가 전송된다
3. 앱 초대 수락을 누른다



![fast_7.png](/img/in-post/fast_7.png)

4. 초대수락을 누르면 App Tester를 다운로드 할 수 있는데 이를 다운로드 하게 되면 해당 테스트앱을 쉽게 다운로드하고 테스트 할 수 있게 된다



이상으로 원숭이 탈출을 완료했다



### 참고사이트

- [구글 공식문서](https://firebase.google.com/docs/app-distribution/android/distribute-fastlane) {: class="underlineFill"}
- [올리브영 테스트앱 자동배포하기](http://tech.oliveyoung.co.kr/tech/2107152128/#%EC%82%AC%EC%A0%84%EC%9E%91%EC%97%85) {: class="underlineFill"}
- [Quickly distribute your app with Firebase App Distribution using GitHub Actions + Fastlane](https://medium.com/firebase-developers/quickly-distribute-app-with-firebase-app-distribution-using-github-actions-fastlane-c7d8eca18ee0){: class="underlineFill"}



