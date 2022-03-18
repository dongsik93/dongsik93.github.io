---
layout: post
title: "[Android] Fastlane #2 (PlayStore)"
subtitle: "Fastlane 릴리즈 자동화"
date: 2022-03-18 23:00:00 +0900
categories: til
tags: android
comments: true

---



# [Android] Fastlane #2 (PlayStore)



실제 PlayStore에 게시할 lane 설정을 해보자

저번에 생략했던 metadata를 받아오는 작업부터 시작

```bash
fastlane supply init --track [production, beta, alpha, internal]
```

작업이 완료되면 fastlane 디렉토리에 여러 디렉토리, 파일들이 받아와진다

![fastlane_2_1.png](/img/in-post/fastlane_2_1.png)

경로 : /fastlane/metadata/android/ko-KR

`changelogs` 디렉토리는 내가 추가해준 것으로, 출시노트를 업로드시 적용시키기 위해 만들어 주었다

다음으로 배포 lane을 작성하면 된다

```ruby
desc "Lane for Bundle Open-testing"
  lane :aab do |options|
    gradle(task: "clean")
    gradle(
        task: "bundle",
        build_type: "Release",
        print_command: true,
        properties: {
          "android.injected.signing.store.file" => ENV['ANDROID_APP_SIGNING_KEY'],
          "android.injected.signing.store.password" => ENV['ANDROID_APP_SIGNING_STORE_PASSWORD'],
          "android.injected.signing.key.alias" => ENV['ANDROID_APP_SIGNING_KEY_ALIAS'],
          "android.injected.signing.key.password" => ENV['ANDROID_APP_SIGNING_KEY_PASSWORD'],
        }
    )
    upload_to_play_store(
        track: "beta",
        json_key: ENV['ANDROID_APP_GOOGLE_KEY'],
        aab: ENV['ANDROID_APP_AAB_PATH'],
        skip_upload_metadata: true,
        skip_upload_images: true,
        skip_upload_screenshots: true,
        skip_upload_apk:true
    )
 
    # 입력받은 버전으로 디렉토리 생성 후 apk이동
    if options[:version]
         version = options[:version]
    else
         version = prompt(text: "Enter the specific version")
    end
 
    versionName = version
     
    # 해당버전 폴더 생성 후 aab, apk파일 생성
    sh "mkdir -p ../../release_ant_#{versionName}_bundle"
    sh "java -jar $BUNDLETOOL_FILE build-apks --bundle=../app/build/outputs/bundle/release/app-release.aab --output=../../release_ant_#{versionName}_bundle/#{versionName}.apks --mode=universal"
    sh "mv ../app/build/outputs/bundle/release/app-release.aab ../../release_ant_#{versionName}_bundle/app-release.aab"
 
    # 입력받은 버전으로 깃 태그 푸시
    git_tag(versionName)
  end
```

- 기본적인 동작은 빌드 → 게시 → 후처리 순이다

- 먼저 배포 lane을 선언

    ```ruby
      lane :aab do |options|
    ```

    - options을 세팅해준 이유는 lane 실행 시 버전코드를 입력받아서 해당 버전코드로 디렉토리 생성, 깃 태그 푸시까지 하기 위함이다

- 다음으로 빌드 설정

    ```ruby
    gradle(task: "clean")
    gradle(
        task: "bundle",
        build_type: "Release",
        print_command: true,
        properties: {
          "android.injected.signing.store.file" => ENV['ANDROID_APP_SIGNING_KEY'],
          "android.injected.signing.store.password" => ENV['ANDROID_APP_SIGNING_STORE_PASSWORD'],
          "android.injected.signing.key.alias" => ENV['ANDROID_APP_SIGNING_KEY_ALIAS'],
          "android.injected.signing.key.password" => ENV['ANDROID_APP_SIGNING_KEY_PASSWORD'],
        }
    )
    ```

    - aab파일로 PlayStore에 게시해야하기 때문에 `task: "bundle"`로 설정
    - 당연히 빌드 타입은 Release
    - aab파일 signing을 위해서 다음과같이 file, password, key alias, key password를 설정해주었다
    - `ENV['']`로 되어있는건 dotenv GEM을 이용해서 signing키와 패스워드를 숨기기 위해서 사용했다

    ```ruby
    gem install dotenv
    ```

    ```ruby
    #.env 파일 
    # Android 
    ANDROID_APP_SIGNING_KEY='STORE_PATH' # 실제 경로 입력
    ANDROID_APP_SIGNING_STORE_PASSWORD='STORE_PASSWORD' # 실제 패스워드 입력
    ANDROID_APP_SIGNING_KEY_ALIAS='ALIAS NAME' # 실제 alias 입력
    ANDROID_APP_SIGNING_KEY_PASSWORD='KEY_PASSWORD' # 실제 패스워드 입력
    ANDROID_APP_GOOGLE_KEY='GOOGLE_KEY' # 실제 경로 입력
    ANDROID_APP_AAB_PATH='AAB_PATH' # 실제 경로 입력
     
    # firebase
    FIREBASE_APP_KEY='FIREBASE_APP_KEY' # 실제 키 입력
    ```

- PlayStore Upload 설정

    ```ruby
    upload_to_play_store(
    	  track: "beta",
    	  json_key: ENV['ANDROID_APP_GOOGLE_KEY'],
    	  aab: ENV['ANDROID_APP_AAB_PATH'],
    	  skip_upload_metadata: true,
    	  skip_upload_images: true,
    	  skip_upload_screenshots: true,
    	  skip_upload_apk:true
    )
    ```

    - track에는 production, beta, alpha, internal 을 설정해줄 수 있다
    - json_key와 aab는 해당하는 파일의 경로를 맞춰서 넣어준다
    - metadata, images, screenshots, apk를 skip 설정해준 이유는 기본적으로 올라가있는 기본 데이터들을 변경할 필요가 없기 때문에 업로드를 skip해준다

- 다음은 lane 실행시 넘겨받은 options값의 처리 부분이다

    ```ruby
    # 입력받은 버전으로 디렉토리 생성 후 apk이동
    if options[:version]
         version = options[:version]
    else
         version = prompt(text: "Enter the specific version")
    end
    
    versionName = version
     
    # 해당버전 폴더 생성 후 aab, apk파일 생성
    sh "mkdir -p ../../release_ant_#{versionName}_bundle"
    sh "java -jar $BUNDLETOOL_FILE build-apks --bundle=../app/build/outputs/bundle/release/app-release.aab --output=../../release_ant_#{versionName}_bundle/#{versionName}.apks --mode=universal"
    sh "mv ../app/build/outputs/bundle/release/app-release.aab ../../release_ant_#{versionName}_bundle/app-release.aab"
    
    # 입력받은 버전으로 깃 태그 푸시
    git_tag(versionName)
    ```

    - 원래는 배포레인을 시작하면 자동으로 version up을 시켜주려고 했으나 현재 진행하고있는 프로젝트 배포 방식과의 일원화를 위해서 자동으로 version up을 시켜주는 코드를 제외하는 대신 version을 입력받아서 처리하는 방식으로 작성했다

    - git_tag함수는 아래와 같이 작성되어있다

        ```ruby
        # add git tag to remote
        def git_tag(versionName)
          add_git_tag(tag: "#{versionName}")
          push_git_tags(tag: "#{versionName}")
        end
        ```

이제 작성해준 lane을 실행해보면

```bash
fastlane aab version:0.5.10a
```

- 입력한 버전(0.5.10a)으로 현재 브랜치의 코드를 빌드 후 playstore에 게시(설정해준 트랙에 맞춰서)
- 게시 후 입력받은 버전으로 디렉토리를 생성
- 깃 태그 푸시
- 까지의 작업이 완료된다



추가해야할 사항

- 테스트케이스 검사
- 사내 메신저로 배포 과정 발송