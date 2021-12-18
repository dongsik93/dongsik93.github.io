---
layout: post
title: "[Android] Fragment 생성"
subtitle: "Fragmemnt 생성"
date: 2021-11-14 18:00:00 +0900
categories: til
tags: android
comments: true
---



# [Android] Fragment 생성



> Crashlytics에 올라온 버그 하나..

![postman_test](/img/in-post/fragment_add_1.png)



기존 사용했던 코드

```kotlin
// fragment
companion object {
    fun newInstance(param: String) = MainFragment(param)
}
```

문제는 여기서부터 시작...

아래처럼 수정되어야 했다

```kotlin
companion object {
    fun newInstance(param: String) = MainFragment().apply {
        val args = Bundle()
        args.punString(KEY_STRING, param)
        this.arguments = args
    }
}
```

이렇게 **빈 생성자로 프래그먼트 인스턴스를 생성한 후 번들을 사용해서 데이터를 전달**하거나, **Fragment Factory를 사용해서 Fragment 생성자를 사용하게끔 됐어야 했다**



..!



**`could not find Fragment constructor`**

> All subclasses of Fragment must include a public no-argument constructor. The framework will often re-instantiate a fragment class when needed, in particular during state restore, and needs to be able to find this constructor to instantiate it. If the no-argument constructor is not available, a runtime exception will occur in some cases during state restore.

- 모든 프래그먼트는 빈 생성자를 가져야 한다
- 그렇지 않으면 메모리 부족과 같은 현상으로 프래그먼트를 재생성할 때 런타임 에러를 유발한다



해결방법

1. AndroidX Fragment 초기화

    - FragmentFactory를 사용하면 Fragment를 선언할 때 인자가 있는 생성자를 사용할 수 있다.
    - androidx.fragment.app 패키지의 Fragment 문서에서 instantiate()의 설명을 다시 찾아보면 deprecated 되었다는 것을 알 수 있다. Fragment의 instantiate 대신 FragmentFactory의 instantiate를 사용하라고 나와있다.
    - FragmentFactory를 상속하는 클래스를 생성

    ```kotlin
    class MyFragmentFactory(param: String): FragmentFactory() {
        override fun instantiate(classLoader: ClassLoader, className: String): Fragment {
            return when (className) {
                MainFragment::class.java.name -> MainFragment(param)
                else -> super.instantiate(classLoader, className)
            }
        }
    }
    ```

    - activity에서 생성

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        supportFragmentManager.fragmentFactory = MyFragmentFactory()
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, layoutId)
        
        val fragment = supportFragmentManager.fragmentFactory.instantiate(classLoader, MainFragment::class.java.name)
        supportFragmentManager.commit {
            add(containerId, fragment, MyFragment.TAG)
            addToBackStack(null)
        }
    }
    ```

    - `super.onCreate(savedInstanceState)` 전에 Factory객체를 설정해야 한다
    - 이렇게 하면 빈 생성자 + Bundle을 사용하지 않아도 Fragment가 재생성될 때 인자로 넘긴 데이터가 유지된다!

2. Koin을 사용한 Fragment 생성

    - dependency 추가

    ```kotlin
    implementation "org.koin:koin-androidx-scope:$koin_version"
    implementation "org.koin:koin-androidx-viewmodel:$koin_version"
    implementation "org.koin:koin-androidx-fragment:$koin_version"
    ```

    - Application class에 KoinApplication 초기화 수정

    ```kotlin
    startKoin {
        androidContext(applicationContext)
        fragmentFactory()
        modules(appModules)
    }
    ```

    - appModules 수정

    ```kotlin
    /* viewModel */
    val viewModelModule = module { ... }
    
    /* fragment */
    val fragmentModule = module { 
        fragment { (param: String) -> MainFragment(param) }
    }
    
    val appModules = listOf(viewModelModule, fragmentModule)
    ```

    - 페이저 어댑터에 적용

    ```kotlin
    class PagerAdapter(
        fragment: Fragment,
        private val list: List<String>
    ) : FragmentStateAdapter(fragment) {
        override fun getItemCount() = list.size
    
        //    기존 사용했던 코드
        //    override fun createFragment(position: Int) = MainFragment().newInstance(list[position])
    
        // Koin을 사용한 inject
        override fun createFragment(position: Int): MainFragment {
            val fragment by inject(MainFragment::class.java, null) {
                parametersOf(list[position])
            }
            return fragment
        }
    }
    ```

- KoinFragmentFactory Class

```kotlin
/**
 * FragmentFactory for Koin
 */
class KoinFragmentFactory(val scope: Scope? = null) : FragmentFactory(), KoinComponent {
    override fun instantiate(classLoader: ClassLoader, className: String): Fragment {
        val javaClass = Class.forName(className)
        return scope?.let { it.get<Fragment>(javaClass) }
            ?: getKoin().get(javaClass.kotlin)
    }
}
```

- 위 방법대로 하면 정상적으로 동작은 했지만....앱이 실행중일 때 언어를 바꾸고 다시 앱을 들어가는 경우에 앱이 죽었다...아직 까지 방법을 찾지 못했다...
    - 오류를 봐보니 현재 사용하고있는 library들을 못가져오는것 같은데 ..
    - 이유를 찾으면 다시 포스팅 해야겠다... 😂



참고사이트

- [KOIN FragmentFactory 사용하기](<https://nanamare.tistory.com/126>){: class="underlineFill"}
- [[Android] AndroidX의 FragmentFactory 사용하기](<https://zion830.tistory.com/85>){: class="underlineFill"}
- [[Android, FragmentFactory] framgnet에서 newInstance() 쓰지 말라고?](<https://black-jin0427.tistory.com/250>){: class="underlineFill"}

