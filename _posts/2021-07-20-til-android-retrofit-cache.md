---
layout: post
title: "[Android] Retrofit2 - Cache"
subtitle: "안드로이드 - Retrofit Cache"
date: 2021-07-20 22:00:00 +0900
categories: til
tags: kotlin android
comments: true
---



# Retrofit2 - Cache



>  공식문서
>
> [Class Cahe](https://square.github.io/okhttp/3.x/okhttp/okhttp3/Cache.html){: class="underlineFill"}



### 캐시를 사용하는 이유

Caches HTTP and HTTPS responses to the filesystem so they may be reused, saving time and bandwidth.

http 및 https response를 파일 시스템에 캐시하여 재사용할 수 있어 시간과 대역폭이 절약된다.



캐시 최적화

- 캐시 효율성을 측정하기 위해 해당 클래스는 세가지 통계를 추적한다
    - 요청 수
        - 캐시가 생성 된 이후 발행 된 HTTP 요청 수
    - 네트워크 수
        - 네트워크 사용이 필요한 요청 수
    - 적중 수
        - 캐시에서 응답을 제공한 요청 수
- 조건부 캐시
    - 오래된 reponse 사본이 포함 된 경우 클라이언트는 조건부 GET
    - 그 다음 서버는 변경된 경우 업데이트 된 response를 보내거나 클라이언트의 복사본이 여전히 유효한 경우 짧은 'not modified' 라는 response을 보낸다
    - 이러한 짧은 response를 통해서 네트워크 수와 hit수를 모두 증가시키게 된다



네트워크 response 강제

- 사용자가 새로고침 버튼을 클린 한 후오 같은 일부 상황에서는 캐시를 건너 뛰고 서버에서 직접 데이터를 가져와야 할 수 있다
- 이 경우 `no-cache`  를 추가한다

```kotlin
val request = Request.Builder()
	.cacheControl(CacheControl.Builder().noCache().build())
	.url(url)
	.build()
```



캐시 response 강제

- 리소스를 즉시 사용할 수 있을 때 이 리소스를 바로 보여주고자 하는 경우가 있다
- 이때 캐시 response를 강제하게 되면 최신 데이터가 다운로드 되기를 기다리는 동안 프로그램이 무언가를 표시할 수 있도록 사용할 수 있다
- request를 로컬로 캐시 된 리소스로 제한하려면 `only-if-cached` 지시문을 추가한다

```kotlin
val request = Request.Builder()
	.cacheControl(CacheCongtrol.Builder()
		.onlyIfCached()
		.build()
	)
	.url(url)
	.build()

val forceCacheResponse = client.newCall(request).execute()
if (forceCacheResponse.code != 504) {
	// resource was cached
} else {
	// resource was not cached
}
```

- response가 없는 상황보다 오래된 response가 있는 상황에서 더 잘 작동한다
    - 오래된 캐시 response 를 허용하려면 최대 정지 상태(초)와 함께 최대 정지 상태 지시어를 사용해야 한다

```kotlin
val request = Request.Builder()
	.cacheControl(CacheControl.BuildeR()
		.maxStale(365, TimeUnit.DAYS)
		.build()
	)
	.url(url)
	.build()
```

- 테스트
    - 테스트용 api 서버에 요청해서 테스트

```kotlin
class ApiClient {

    private val testUrl = "<https://jsonplaceholder.typicode.com>"

    fun getClient(): Retrofit {
        val interceptor = HttpLoggingInterceptor()
        interceptor.level = HttpLoggingInterceptor.Level.BODY
        val client = OkHttpClient().newBuilder()

				/* 10MB */
        val cacheSize = (10 * 1024 * 1024).toLong()
        /* cache */
        val cache = Cache(File(BardBase.ApplicationContext().cacheDir, "http"), cacheSize)
        client
            .cache(cache)
            .addNetworkInterceptor(networkInterceptor())
            .addInterceptor(interceptor)

        return Retrofit.Builder()
            .baseUrl(testUrl)
            .client(client.build())
            .addCallAdapterFactory(CoroutineCallAdapterFactory())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    private fun networkInterceptor(): Interceptor {
        return Interceptor { chain ->
            val cacheControl = CacheControl.Builder()
                // 캐시 유효 시간
                .maxAge(30, TimeUnit.SECONDS)
                .build()
            val response: Response = chain.proceed(chain.request())
            response.newBuilder()
                .removeHeader("Pragma")
                .removeHeader("Cache-Control")
                .header("Cache-Control", cacheControl.toString())
                .build()
        }
    }
}
```



실제로 내가 원했던, 생각했던 Cache라는 기능은 아니였지만, 알아두면 좋을 것 같은 Retrofit2의 Cache 기능이였다.