---
layout: post
title: "[Android] Fragment Lifecycle"
subtitle: "Fragment Lifecycle"
date: 2021-10-01 18:00:00 +0900
categories: til
tags: android
comments: true

---



# [Android] Fragment Lifecycle



> Activity와는 다른 Fragment의 생명주기 중 어디가 어떻게 다른지 알아보기



## Fragment Lifecycle

안드로이드 디펠로퍼 사이트에 나와있는 프래그먼트의 생명주기이다

![fragment_1](/img/in-post/fragment_1.png)



액티비티의 생명주기와는 다르게 프래그먼트의 생명주기에는 생성시에는 `onViewCreated()`, `onViewStateRetored()` 가 있고, 파괴시에는 `onDestroyView()` 가 존재한다



위의 그림을 보면 Fragment Lifecycle과 View Lifecycle이 서로 다른걸 볼 수 있는데 이는 Fragment의 Lifecycle이 변화되는 순간 Fragment Callback 함수를 호출하게 되고, 해당 Callback 함수가 종료되는 시점에 View의 Lifecycle에 이벤트를 전달하게 되기 때문이다



### onCreateView , onViewCreated

그렇다면 onCreateView와 onViewCreated는 어떻게 다르길래 Fragment Lifecylce에 추가된 것일까?

- `onCreatedView()`

    ```kotlin
    override fun onCreateView(  
        inflater: LayoutInflater,  
        container: ViewGroup?,  
        savedInstanceState: Bundle?  
    ): View? {  
        return inflater.inflate(R.layout.fragment_code, container, false)  
    }
    ```

    - onCreateView는 View를 생성해서 리턴하는 역할을 한다
    - onCreateView에서 View에 접근할 수 있지만 아직 View가 생성되어 Fragment에 추가된 상태가 아니므로 onCreateView에서는 View를 생성해서 반환하는 코드만 추가한다
    - onCreateView에서 직접 LayoutId 를 받는 Fragment 의 생성자를 사용하여 해당 리소스 아이디 값을 통해 Fragment View 를 생성해서 사용할 수도 있다

- `onViewCreated()`

    ```kotlin
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {  
        super.onViewCreated(view, savedInstanceState)  
        textView = view.findViewById(R.id.textMessage)  
        if(message != null){  
            textView.text = message  
        }  
    }
    ```

    - onViewCreated는 onCreateView에서 생성된 view가 인자로 전달된다
    - 이 시점부터는 Fragment View의 Lifecycle이 `INITIALIZED` 상태로 업데이트 됐기 때문에 View의 초기값을 설정해주거나 LiveData Observing, Adapter Setting 등은 onViewCreated에서 해주는 것이 적절하다



### onDestoryView, onDestory

- `onDestoryView`

    - Fragment에 그려진 View가 제거되는 단계이다
    - 이 시점부터 `getViewLifecycleOwnerLiveData()`의 리턴값으로 null이 리턴된다
    - 하지만 Fragment 객체 자체는 사라지지 않고 메모리에 남아있기 때문에 메모리 릭에 유의해야 한다. 따라서 가비지 컬렉터에 의해 수거될 수 있도록 Fragment View에 대한 모든 참조가 제거되어야 한다

    > Viewbinding을 사용할 때 메모리 릭에 관한 내용은 다음에..

- `onDestory`

    - Fragment가 제거되거나 FragmentManager가 destroy 됐을 때 Fragment의 Lifecycle은 `DESTROYED` 상태가 되고, onDestroy가 호출된다
    - 해당 시점은 Fragment Lifecycle의 끝을 알린다



- 참고 사이트
    - [Fix your Android Memory Leaks in Fragments](https://engineering.procore.com/fix-your-android-memory-leaks-in-fragments){: class="underlineFill"}

