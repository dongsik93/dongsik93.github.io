---
layout: post
title: "[Android] 프래그먼트"
subtitle: "Do it! 안드로이드(11)"
date: 2020-03-16 17:00:00 +0900
categories: til
tags: android
comments: true
---





## 프래그먼트



프래그먼트 사용 목적

- 분할된 화면들을 독립적으로 구성하기 위해 사용
- 분할된 화면들의 상태를 관리하기 위해 사용



프래그먼트는 항상 액티비티 위에 올라가 있어야 한다

- 액티비티로 만들어지는 화면을 분할하여 각각의 부분화면을 프래그먼트로 만들고, 그 프래그먼트를 독립적으로 관리하는 것을 목표로 하기 때문이다
- 액티비티를 관리하는 것은 안드로이드 시스템의 액티비티 매니저이지만 프래그먼트를 관리하는것은 액티비티가 관리한다



액티비티들은 각각의 액티비티와 통신할 때 인텐트를 사용

프래그먼트는 각각의 프래그먼트와 통신할 때 단순히 메소드를 이용해서 사용

프래그먼트는 액티비티 위에 올라가 있기 때문에 액티비티를 전환하지 않고 훨씬 가볍게 화면 전환 효과를 만들 수 있게 된다



프래그먼트를 화면에 추가하기

- 프래그먼트도 액티비티처럼 하나의 XML 레이아웃과 하나의 자바파일로 동작한다

```java
// 프래그먼트 클래스 메소드

// 이 프래그먼트를 포함하는 액티비티를 리턴
public final Activity getActivity()

// 이 프래그먼트를 포함하는 액티비티에서 프래그먼트 객체들과 의사소통하는 프래그먼트 매니저를 리턴함
public final FragmentManager getFragmentManager()
  
// 이 프래그먼트를 포함하는 부모가 프래그먼트일 경우 리턴
// 액티비티이면 null을 리턴
public final Fragment getParentFragment()
  
// 이 프래그먼트의 ID를 리턴
public final int getId()
```

```java
// 프래그먼트 매니저 주요 메소드
public abstract FragmentTransaction beginTransaction ()
public abstract Fragment findFragmentById (int ind)
public abstract Fragment findFragmentByTag (String tag)
public abstract boolean executePendingTransaction ()
```

- 프래그먼트의 대표적 특성
  - `뷰 특성`
    - 뷰 그룹에 추가되거나 레이아웃의 일부가 될 수 있다
    - 뷰에서 상속받은 것은 아니며 뷰를 담고 있는 일종의 틀
  - `액티비티 특성`
    - 액티비티처럼 수명주기(Lifecycle)를 가지고 있음
    - 컨텍스트 객체는 아니며 라이프사이클은 액티비티에 종속됨





### Fragment manager



### 프래그먼트 관리

- 액티비티나 다른 프래그먼트간의 상호작용을 위해서 **프래그먼트 매니저**가 필요하다

- ##### 프래그먼트 트랜잭션

  - 프래그먼트 매니저는 액티비티가 사용자의 입력 이벤트에 따라 프래그먼트를 추가 및 삭제, 교체 등의 작업들을 수행할 수 있게 해준다
  - 또한 프래그먼트 백 스택 관리, 프래그먼트 전환 애니메이션 설정 등의 일도 수행한다

- 프래그먼트 트랜잭션 설정

```
// 프래그먼트 매니저 선언
FragmentManager fragmentManager = getSupportFragmentManager();
// 프래그먼트 트랜잭션 시작
FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
```

- `commitAllowingStateLoss()`

  - 왜 `commit()` 이 아니고 `commitAllowingStateLoss()` ?

    ```
    Like {@link #commit} but allows the commit to be executed after an activity's state is saved.  This is dangerous because the commit can be lost if the activity needs to later be restored from its state, so this should only be used for cases where it is okay for the UI state to change unexpectedly on the user.
    ```

    - activity 상태가 저장된 후 커밋을 실행할 수 있다. 이 경우 나중에 activity를 해당 상태에서 복원해야 할 경우 커밋이 손실될 수 있다. 그래서 UI 상태가 사용자에 의해 예기치 않게 변경되어도 괜찮은 경우에만 사용해야 한다.





본 문서는 Do it ! 안드로이드 앱 프로그래밍 책을 보고 작성하였습니다.