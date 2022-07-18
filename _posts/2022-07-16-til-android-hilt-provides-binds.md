---
layout: post
title: "[Android] Hilt @Provides? @Binds?"
subtitle: "Hilt Provides vs Binds"
date: 2022-07-16 18:00:00 +0900
categories: til
tags: Android DI Hilt
comments: true

---



# [Android] Hilt @Provides? @Binds?



> 적재적소에 @Provides와 @Binds를 사용해보자



### Hilt?

Android에서 의존성 주입(DI / Dependency Injection)을 도와주기 위해서 Hilt 라이브러리를 제공해 준다. Hilt 라이브러리를 사용하면 의존성 주입을 위해 Android 프로젝트에 컨테이너를 제공하고 수명 주기(Life cycle)를 자동으로 관리하여 불필요한 클래스 생성이나 자원관리에 도움을 받을 수 있다



### @Provides

Provides는 Room, Retrofit과 같은 외부 라이브러리에서 제공되는 클래스이므로 프로젝트 내에서 소유할 수 없는 경우 또는 Builder 패턴 등을 통해 인스턴스를 생성해야 하는 경우에 사용한다



예시

```kotlin
@InstallIn(SingletonComponent::class)
@Module
object DataBaseModule {
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context) : AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "myDataBase.db"
        ).build()
    }
}
```

- 함수의 반환 타입은 제공하고자 하는 인스턴스의 type이다
- 매개변수는 인스턴스 생성에 필요한 종속성, 함수 내부는 실제 인스턴스의 구현이다





### @Binds

constructor를 가질 수 없는 인터페이스에 대한 종속성 삽입의 경우에 사용한다

Binds는 Provides의 특수한 형태일 뿐이며 Provides와 같은 역할을 한다. 다른점은 Binds에는 여러 제약이 있고, 이 제약들 덕분에 generation되는 코드가 줄어든다는 점이다

제약사항

- 추상(abstract)클래스의 추상메서드에 붙이는 것만 유효하다
- Binds가 붙은 메서드는 반드시 하나의 매개 변수만을 가져야 한다



예시

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule { 
		@Binds
    @Singleton
    abstract fun bindAccountRepository(impl: AccountRepositoryImpl): AccountRepository
}
```

- 함수의 return type은 인스턴스로 제공되는 인터페이스이다
- 함수의 매개 변수에는 실제 제공하는 클래스(구현된)이다





#### 참고사이트

- [[Android] Hilt @Binds, @Providers 차이점](https://3edc.tistory.com/67){: class="underlineFill"}

- [[Android, Kotlin] Hilt에서 @Binds와 @Provides의 차이점](https://hungseong.tistory.com/29){: class="underlineFill"}

    