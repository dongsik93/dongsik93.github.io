---
layout: post
title: "[Android] Databinding"
subtitle: "Android Jetpack Databinding "
date: 2020-05-2 18:30:00 +0900
categories: til
tags: databinding android jetpack
comments: true
---





## DataBinding



#### DataBinding이란?

- 코틀린에서 레이아웃을, 레이아웃에서 코틀린의 데이터를 직접 참조하는 라이브러리
- 코틀린에서 레이아웃 파일에 의존적인 부분이 많이 사라지고 MVVM등의 패턴과 함께 사용된다



#### One-way binding

- 데이터의 흐름이 단방향을 말한다

#### Two-way binding

- 데이터의 흐름이 양방향을 말한다



### 기본 사용법

- Databinding에서 사용되는 레이아웃 파일들의 Root태그는 `<layout>`이되어야 한다

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <layout xmlns:android="http://schemas.android.com/apk/res/android" ...>
    ....
  </layout>
  ```

- 어떤 객체를 참조하여 데이터를 출력할 지 `<data>`를 정의해 주어야 한다

  ```xml
  <data>
      <variable name="user" type="com.example.User"/>
  </data>
  ```

- 데이터를 선언한 후 `@{user.firstName}` 처럼 데이터를 View에 참조하도록 연결할 수 있다

  ```xml
  <TextView 
  	android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="@{user.firstName}"/>
  ```



### 이벤트 처리

- 메소드 참조

  - 데이터가 바인딩될 때 생성된다
  - 핸들러에 이벤트를 할당하려면 호출할 메서드 이름이 될 값을 사용해야 한다

  ```kotlin
  class MyHandlers {
      fun onClickFriend(view: View) { ... }
  }
  ```

  ```xml
  <TextView 
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="@{user.firstName}"
      android:onClick="@{handlers::onClickFriend}"/>
  ```

  - 바인딩 하려는 핸들러 메소드는 해당 이벤트 클릭 리스너의 메소드 형태와 동일해야 한다

- 리스너를 바인딩

  - 이벤트가 발생할 때 실행된다
  - 리턴 값만 리스너의 예상 리턴 값과 일치하면 된다

  ```kotlin
  class Presenter {
      fun onSaveClick(task: Task){}
  }
  ```

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <layout xmlns:android="http://schemas.android.com/apk/res/android">
      <data>
          <variable name="task" type="com.android.example.Task" />
          <variable name="presenter" type="com.android.example.Presenter" />
      </data>
      <LinearLayout 
      	android:layout_width="match_parent" 
          android:layout_height="match_parent">
          
          <Button 
              android:layout_width="wrap_content" 
              android:layout_height="wrap_content"
              android:onClick="@{() -> presenter.onSaveClick(task)}" />
      </LinearLayout>
  </layout>
  ```

  - 위의 예에서는 `onClick(VIew)`에 전달되는 view 매개변수가 정의되지 않았다
  - 리스너 결합에서는 두 가지 방식으로 리스너 매개변수를 선택할 수 있다
    - 모든 매개변수를 무시하거나, 모든 매개 변수의 이름을 지정할 수 있다

  ```kotlin
  class Presenter {
      fun onSaveClick(view: View, task: Task){}
  }
  ```

  ```xml
  android:onClick="@{(view) -> presenter.onSaveClick(task)}"
  ```



```kotlin
binding = DataBindingUtil.setContentView(this, R.layout.activity_main)
binding = DataBindingUtil.inflate(inflater, R.layout.fragment_main, container, false)
```



#### 레이아웃 세부 정보

- ##### Import

  - import를 사용하면 레이아웃 파일  내에서 클래스를 쉽게 참조 할 수 있다

  ```xml
  <data>
      <import type="android.view.View"/>
  </data>
  <TextView
         android:text="@{user.lastName}"
         android:layout_width="wrap_content"
         android:layout_height="wrap_content"
         android:visibility="@{user.isAdult ? View.VISIBLE : View.GONE}"/>
  ```

  - View 클래스를 가져오면 View 클래스의 VISIBLE 및 GONE 상수를 참조할 수 있다

- ##### alias

  - 클래스 이름 충돌이 발생하면 클래스 중 하나의 이름을 별칭으로 바꿀 수 있다

  ```xml
  <import type="android.view.View"/>
  <import type="com.example.real.estate.View"
          alias="Vista"/>
  ```

- ##### Variable

  ```xml
  <data>
      <import type="android.graphics.drawable.Drawable"/>
      <variable name="user"  type="com.example.User"/>
      <variable name="image" type="Drawable"/>
      <variable name="note"  type="String"/>
  </data>
  ```

  - `<data> `안에 선언되는 variable 은 빌드 시 binding 클래스가 생성 되면서 각각의 setter/getter 메소드를 갖게 된다
  - 이때 setter 가 호출 되기 전 기본 값은 참조 형식의 variable 은 null, int 의 경우 0, boolean 의 경우 false 를 갖는다.
  - 만약 참조하려는 variable 이 null일 경우 NullpointerException 을 방지 하기 위해 위와 같은 기본 값이 return 된다
  - `"@{user.age}"` 일 때 user 가 null 인 경우 age(Int) 의 기본 값인 0 이 할당되게 된다.

- ##### Include

  - 레이아웃 파일에서 include 태그를 사용하면 include 하려는 레이아웃 파일로 변수를 전달할 수 있다

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <layout xmlns:android="http://schemas.android.com/apk/res/android"
          xmlns:bind="http://schemas.android.com/apk/res-auto">
     <data>
         <variable name="user" type="com.example.User"/>
     </data>
     <LinearLayout
         android:orientation="vertical"
         android:layout_width="match_parent"
         android:layout_height="match_parent">
         <include layout="@layout/name"
             bind:user="@{user}"/>
         <include layout="@layout/contact"
             bind:user="@{user}"/>
     </LinearLayout>
  </layout>
  ```

  - include 한 name.xml 과 contact.xml 에 bind:variable 속성을 통해 user 변수를 전달

  - 이렇게 사용하기 위해서는 전달 받고자 하는 레이아웃 파일에서 같은 이름의 변수가 선언 되어있어야 한다

    

### 데이터 객체

- 기본적으로는 databinding 에서 임의의 데이터 객체를 사용하여 레이아웃과 바인딩을 구현 할 수 있지만 바인딩 하고 있는 객체의 값이 변경 되어도 UI 가 업데이트 되진 않는다
- 데이터가 변경 되었을 때 이를 알려주는 기능을 데이터 객체에 부여하면 databinding 의 장점을 극대화 시킬 수 있다

##### Observable 객체

- 바인딩 하려는 객체에 Observable 인터페이스를 구현하면 해당 객체에 단일 리스너를  연결하여 그 객체에 모든  속성의 변경사항을 수신할 수 있게 된다

- BaseObservable 클래스를 통해서 리스너 등록 매커니즘을 구현한다

  ```kotlin
  class LoginViewModel : BaseObservable {
  
      @Bindable
      fun getRememberMe(): Boolean {
          return data.rememberMe
      }
  
      fun setRememberMe(value: Boolean) {
          if (data.rememberMe != value) {
              data.rememberMe = value
  
              saveData()
  
              notifyPropertyChanged(BR.remember_me)
          }
      }
  }
  ```

  - Bindable 어노테이션을 통해서 변화를 감지하고자 하는 getter위에 사용하고
  - notiftyPropertyChanged()는 setter에 사용한다

  ##### Observable Fields

  - 데이터바인링 라이브러리에서는 각 필드단위로  Observable를 구현할 수 있는 fields를 제공한다

  ```kotlin
  ObservableField<T>
  ObservableBoolean
  ObservableByte
  ObservableChar
  ObservableShort
  ObservableInt
  ObservableLong
  ObservableFloat
  ObservableDouble
  ObservableParcelable
  ```

  ```kotlin
  // 구현하려는 필드에 선언해서 사용할 수 있다
  class User {
      val firstName = ObservableField<String>()
      val lastName = ObservableField<String>()
      val age = ObservableInt()
  }
  
  // 값에 엑세스 하려면 set(), get() 메소드를 사용한다
  user.firstName = "Google"
  val age = user.age  
  ```

  

### 생성되는 바인딩 클래스 

- 컴파일 단계에서 자동으로 바인딩 클래스가 생성 된다. 
- 레이아웃 파일 이름을 기준으로 생성되며 생성되는 바인딩 클래스들은 모두 android.databinding.ViewDataBinding 클래스를  확장한다



##### Binding생성

- 레이아웃에 바인딩하는 방법은 여러가지가 존재하지만 가장 일반적인 방법은 binding class의 정적 메소드를 사용하는 것이다

- inflate()를 사용하면 View 계층을 확장함과 동시에 data binding이 이루어진다

  ```kotlin
  val binding : MyLayoutBinding = MyLayoutBinding.inflate(layoutInflater)
  val binding : MyLayoutBinding = MyLayoutBinding.inflate(layoutInflater, viewGroup, false)
  ```

- 바인딩클래스를 미리 알수 없을 때에는 DataBindingUtil 클래스를 사용해서 바인딩을 생성한다

  ```kotlin
  val viewRoot = LayoutInflater.from(this).inflate(layoutId, parent, attachToParent)
  val binding: ViewDataBinding? = DataBindingUtil.bind(viewRoot)
  ```



##### Id가 있는 view에 대한 binding

- databinding 은 id 가 있는 view 에 대해서는 자동으로 해당 view 에 대한 필드를 생성하여 findViewById 를 사용하지 않아도 view 에 바로 엑세스 할 수 있다.

- kotlin 의 경우 kotlin-extension 을 통해 layout id 로 생성 되어지는 view 에 바로 엑세스가 가능한 맥락과 유사한 내용이다

  

##### Variable

- 레이아웃에 binding 을 위해 선언한 변수들에 대해서 binding class 에서는 setter/getter 메소드를 제공 한다

  ```xml
  <data>
      <import type="android.graphics.drawable.Drawable"/>
      <variable name="user"  type="com.example.User"/>
      <variable name="image" type="Drawable"/>
      <variable name="note"  type="String"/>
  </data>
  ```



##### ViewStub

- ViewStub 은 최초에는 레이아웃 프로세스에 포함되지 않고 보이지 않는 상태로 존재하다가, 호출하는 시점에 view 계층에 포함되어지는 특수한 View 이다
- 복잡하게 구성된 레이아웃을 빠르게 전개시켜야하는 상황에서, 레이아웃의 전개 시기를 선택적으로 늦출 수 있다

```xml
<ViewStub 
    android:id="@+id/stub"
    android:inflatedId="@+id/subTree"
    android:layout="@layout/mySubTree"
    android:layout_width="120dp"
    android:layout_height="40dp" />
```

```kotlin
// 생성되는 바인딩 클래스에서 ViewStub은 ViewStubProxy로 표현된다
val viewStubProxy = binding.stub;
val viewStub = viewStubProxy.getViewStub();
viewStub.inflate()
viewStub.setVisibility(View.VISIBLE)
```





### 객체 반환

##### 자동 객체 형 반환

- 바인딩 식에서 객체가 리턴 될때, 데이터바인딩 라이브러리 내부에서 속성에 값을 설정할 적절한 메소드를 선택하게 된다

- 객체는 선택 된 메소드의 매개변수 타입으로 캐스팅 되는데, 이것은 ObservableMap 을 사용하여 데이터를 관리할 경우 편리하다

  ```xml
  <layout>
      <data>
          <import type="android.databinding.ObservableMap" />
          <variable name="map" type="ObservableMap<String,Object>" />
      </data>
  ..
      <TextView
          ....
          android:text="@{map[`firstName`]}" />
  </layout>
  ```

  ```kotlin
  //MainActivity.kt
  val binding: ActivityMainBinding = DataBindingUtil.setContentView(this, R.layout.activity_main)
  binding.map = ObservableArrayMap<String, Any>().apply {
              put("firstName", "hong")
              put("age", 20)
  }
  ```

  - 객체 타입이 불확실할 경우 별도의 캐스팅 동작을 바인딩 식에 적절히 추가해  주어야 한다

```xml
  <TextView
    ....
      android:text="@{String.valueOf(map[`firstName`])}" />
```

  

### 양방향 데이터 바인딩

- 단방향 데이터 바인딩을 사용하면 속성에 값을 설정하고 속성의 변경에 반응하는 리스너를 설정할 수 있다

  ```xml
  <!-- 단방향 데이터 바인딩 -->
  <CheckBox
  	android:id="@+id/rememberMeCheckBox"
      android:checked="@{viewmodel.rememberMe}"
      android:onCheckedChanged="@{viewmodel.rememberMeChanged}"
   />
  <!-- 양방향 데이터 바인딩 -->
  <CheckBox
  	android:id="@+id/rememberMeCheckBox"
      android:checked="@={viewmodel.rememberMe}"
  />
  ```

- `=` 기호가 포함뵌 `@={}` 표기법은 속성과 관련된 데이터 변경사항을 받는 동시에 사용자 업데이트를 수신한다



#### 양방향 데이터 바인딩을 지원하는 속성

| 클래스         | 속성                                             | 결합 어댑터                  |
| -------------- | ------------------------------------------------ | ---------------------------- |
| AdapterView    | android:selectedItemPositio<Br>android:selection | AdapterViewAdapter           |
| CalendarView   | android:date                                     | CalendarViewBindingAdapter   |
| CompoundButton | android:checked                                  | CompoundButtonBindingAdapter |
| DatePicker     | android:year<br>android:month<br>android:day     | DatePickerBindingAdapter     |
| NumberPicker   | android:value                                    | NumberPickerBindingAdapter   |
| RadioButton    | android:checkedButton                            | RadioGroupoBindingAdapter    |
| RatingBar      | android:rating                                   | RatingBarBindingAdapter      |
| SeekBar        | android:progress                                 | SeekBarBindingAdapter        |
| TabHost        | android:currentTab                               | TabHostBindingAdapter        |
| TextView       | android:text                                     | TextViewBindingAdapter       |
| TimePicker     | android:hour<br>android:minute                   | TimePickerBindingAdapter     |



