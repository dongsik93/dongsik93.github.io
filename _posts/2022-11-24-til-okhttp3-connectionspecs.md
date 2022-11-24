---
layout: post
title: "[Android] OkHttp3 ConnectionSpecs"
subtitle: "TLS / Cipher Suite"
date: 2022-11-24 21:00:00 +0900
categories: til
tags: android okhttp
comments: true

---



# [Android] OkHttp3 ConnectionSpecs

> 무언가를 새롭게 배운다는건 신기하고 즐거운 일인 것 같다. 오늘도, 지식 + 1



Okhttp3를 통해서 여러가지 작업을 할 수 있다.

대표적으로 Interceptor를 붙여준다던지, Timeout 설정을 한다던지 이런 작업류들을 보통 많이 사용하고 자주들 접해봤을거라고 생각한다.

오늘 알아볼것은 `connecitonSpecs`이라는 것이다.



### ConnectionSpecs?

Okhttp3에 들어가보면 이렇게 나와있다 ([Okhttp3 공식 홈페이지](https://square.github.io/okhttp/4.x/okhttp/okhttp3/-connection-spec/){: class="underlineFill"})

```
Specifies configuration for the socket connection that HTTP traffic travels through. 
For https: URLs, this includes the TLS version and cipher suites to use when negotiating a secure connection.
```

대강 https 보안연결을 사용할 때 사용할 TLS의 버전이나, Cipher Suites가 포함된다고 한다.

tls는 SSL/TLS 이렇게 본적 있는것 같은데.. cipher suite?

처음들어보는 용어들이 나타나기 시작했다



### TLS / Cipher Suite

먼저 TLS에 대해 알아보자.

TLS(Transport Layer Security) 는 SSL의 업데이트 버전으로 SSL의 최종버전인 3.0과 TLS의 최초버전의 차이는 크지않으며, 이름이 바뀐것은 SSL을 개발한 Netscape가 업데이트에 참여하지 않게 되어 소유권 변경을 위해서였다고 한다.

결과적으로 TLS는 SSL의 업데이트 버전이며 명칭만 다르다고 볼 수 있다.

그렇다면 Cipher Suite는 무엇일까?

Cipher Suite란 TLS 암호통신을 하는 데 사용되는 암호알고리즘 집합을 의미하는데 단계별, 기능별 여러 가지 종류의 암호알고리즘을 사용하기 때문이라고 한다.

여러 종류의 암호알고리즘은 구글에 검색하면 많이 나오기 때문에 생략하고,

왜 이러한 것들을 사용하는지에 대해서 알아보자.



### 왜 사용해야 하는가?

SSL Handshake라는것은 많이 들어봤을것이라고 생각한다. 통신을 하는 클라이언트와 서버가 서로 암호화 통신을 시작할 수 있도록 신분을 확인하고 필요한 정보를 클라이언트와 서버가 주거니 받거니 하는 과정인데, 이러한 handshake과정에 필요한게 cipher suite이다.

클라이언트쪽에서 자신이 지원하는 cipher suites들을 담아서 요청을 보내면 서버쪽에서 선호하거나 지원하는 cipher suite를 다시 클라이언트쪽에 보내주고 하는 과정들을 진행한다.

여태껏 retrofit과 okhttp를 사용하면서 네트워크 통신을 했는데, 이런걸 설정한 적이 없었는데..왜된거지? 라고 생각했는데 역시나 기본값이 설정되어 있기 때문에 따로 설정하지 않아도 https통신이 가능했던 것이다.



### 어떻게 사용해야 하는가?

먼저 기본값으로 어떻게 설정되어있는지 알아보자.

```kotlin
internal var connectionSpecs: List<ConnectionSpec> = DEFAULT_CONNECTION_SPECS
internal val DEFAULT_CONNECTION_SPECS = immutableListOf(
    ConnectionSpec.MODERN_TLS, ConnectionSpec.CLEARTEXT
)
```

기본값으로는 MODERN_TLS, CLEARTEXT가 설정되어있는 모습이다.



Okhttp3 내부에 ConnectionSpec.kt에는 4가지 Cipher Suites가 정의되어있다

1. **RESTRICTED_TLS**

   - 최신 클라이언트 플랫폼과 최신 서버가 필요한 보안 TLS 연결이다

   ```kotlin
   val RESTRICTED_TLS = Builder(true)
   	.cipherSuites(*RESTRICTED_CIPHER_SUITES)
   	.tlsVersions(TlsVersion.TLS_1_3, TlsVersion.TLS_1_2)
   	.supportsTlsExtensions(true)
   	.build()
   ```

2. **MODERN_TLS**

   - 대부분의 클라이언트 플랫폼에서 작동하고 대부분의 서버에 연결할 수 있는 최신 TLS 구성이며, 이것은 OkHttp의 기본 구성이다

   ```kotlin
   val MODERN_TLS = Builder(true)
   	.cipherSuites(*APPROVED_CIPHER_SUITES)
   	.tlsVersions(TlsVersion.TLS_1_3, TlsVersion.TLS_1_2)
   	.supportsTlsExtensions(true)
   	.build()
   ```

3. **COMPATIBLE_TLS**

   - 구식 클라이언트 플랫폼에서 작동하고 구식 서버에 연결할 수 있는 이전 버전과 호환되는 폴백 구성이며, 가능한 경우 이 구성을 사용하는 것보다 클라이언트 플랫폼 또는 서버를 업그레이드하는 것을 추천한다

   ```kotlin
   val COMPATIBLE_TLS = Builder(true)
   	.cipherSuites(*APPROVED_CIPHER_SUITES)
   	.tlsVersions(TlsVersion.TLS_1_3, TlsVersion.TLS_1_2, TlsVersion.TLS_1_1, TlsVersion.TLS_1_0)
   	.supportsTlsExtensions(true)
   	.build()
   ```

4. **CLEARTEXT**

   - http: URL에 대한 암호화되지 않은 인증되지 않은 연결이다

   ```kotlin
   val CLEARTEXT = Builder(false).build()
   ```



실제 사용방법은 간단하다

```kotlin
val compatibleTls = ConnectionSpec.Builder(ConnectionSpec.COMPATIBLE_TLS).build()
val clearText = ConnectionSpec.Builder(ConnectionSpec.CLEARTEXT).build()
OkhttpClient.Builder().apply {
    connectionSpecs(compatibleTls)
}
```

통신하는 서버 스펙(TLS 1.2, 1.3지원여부 등)에 맞춰서 사용할 Cipher Suites를 적절히 골라서 사용하면 된다.



마지막으로 이 글 작성에서 사용한 okhttpVersion은 4.9.0버전이다.



이 글과 관계는 없지만.. 글을 작성하다 보니 얼마 전 java.security.cert.CertPathValidatorException: Trust anchor for certification path not found.

이런 에러가 발생해서 구글을 찾아보니 Android에서는 100개 이상의 CA목록을 가지고 있다고 했는데, 이 이외의 CA에서 인증받은 인증서를 사용한다면 에러가 날 수 있고, TrustManager를 통해서 처리할 수 있다..까지 알아본 기억이 있다..ㅎ 나중에 정리해서 다시 올려야겠다.[Google Developer](https://developer.android.com/training/articles/security-ssl?hl=ko#CommonHostnameProbs){: class="underlineFill"}   