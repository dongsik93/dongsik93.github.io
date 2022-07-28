---
layout: post
title: "[Android] Fragment ViewLifecycleOwner"
subtitle: "ViewLifecycleOwner?"
date: 2022-07-28 18:50:00 +0900
categories: til
tags: Android Fragment
comments: true

---



# [Android] Fragment ViewLifecycleOwner



> [[Android] Fragment Lifecycle](https://dongsik93.github.io/til/2021/10/01/til-android-fragment-lifecycle/){: class="underlineFill"} 글에 이에서 Fragment에서 사용하는 ViewLifecycleOwner에 관한 내용이다



Fragment에는 두 가지 Lifecycle이 존재한다 (Fragment Lifecycle, Fragment View Lifecycle).

이 전 글이 두 가지의 Lifecycle에 관한 내용이라면, 이번 글은 viewLifecycleOwner에 대한 내용이다.

Lifecycle이 달라서 viewLifecycleOwner를 쓰면 된다고 했는데, 얘는 과연 어떻게 생성되고 null처리가 되는지 알아보자



### ViewLifecycleOwner

```java
// androidx.fragment.app.Fragment.java

void performCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
@Nullable Bundle savedInstanceState) {
    mChildFragmentManager.noteStateNotSaved();
    mPerformedCreateView = true;
    mViewLifecycleOwner = new FragmentViewLifecycleOwner(this, getViewModelStore()); // #1
    mView = onCreateView(inflater, container, savedInstanceState); // #2
    if (mView != null) {
        // Initialize the view lifecycle
        mViewLifecycleOwner.initialize();
        // Tell the fragment's new view about it before we tell anyone listening
        // to mViewLifecycleOwnerLiveData and before onViewCreated, so that calls to
        // ViewTree get() methods return something meaningful
        ViewTreeLifecycleOwner.set(mView, mViewLifecycleOwner);
        ViewTreeViewModelStoreOwner.set(mView, mViewLifecycleOwner);
        ViewTreeSavedStateRegistryOwner.set(mView, mViewLifecycleOwner);
        // Then inform any Observers of the new LifecycleOwner
        mViewLifecycleOwnerLiveData.setValue(mViewLifecycleOwner);
    } else {
        if (mViewLifecycleOwner.isInitialized()) {
            throw new IllegalStateException("Called getViewLifecycleOwner() but "
                    + "onCreateView() returned null");
        }
        mViewLifecycleOwner = null;
    }
}
```

Fragment.java에 들어가보면 `performCreateView`에서 `#2` onCreateView 호출 이전에 `#1` FragmentViewLifeCycleOwner가 생성되는 걸 볼 수 있는데, 따라서 onCreateView 이전에 viewLifecycleOwner를 사용해도 된다고 볼 수 있다.



```java
// This is initialized in performCreateView and unavailable outside of the
// onCreateView/onDestroyView lifecycle
@Nullable FragmentViewLifecycleOwner mViewLifecycleOwner;
```

실제로 mViewLifecycleOwner가 선언된 곳을 가보면 이렇게 주석이 달려있다. (**performCreateView에서 초기화되며 onCreateView/onDestroyView 라이프사이클 이외에서는 사용할 수 없다)**

그렇다면 이 nullable한 viewLifecycleOwner는 언제 null로 바뀌는지 알아보자

mViewLifecycleOwner를 쫓아가보면

```java
// androidx.fragment.app.FragmentManager.java

private void destroyFragmentView(@NonNull Fragment fragment) {
    fragment.performDestroyView(); // #1
    mLifecycleCallbacksDispatcher.dispatchOnFragmentViewDestroyed(fragment, false);
    fragment.mContainer = null;
    fragment.mView = null;
    // Set here to ensure that Observers are called after
    // the Fragment's view is set to null
    fragment.mViewLifecycleOwner = null; // #2
    fragment.mViewLifecycleOwnerLiveData.setValue(null);
    fragment.mInLayout = false;
}
```

`#2` 에서 null 처리를 해주고있다. 하지만 그 전 `#1` , performDestoryView가 호출되는데

```java
// androidx.fragment.app.Fragment.java

void performDestroyView() {
    mChildFragmentManager.dispatchDestroyView();
    if (mView != null && mViewLifecycleOwner.getLifecycle().getCurrentState()
                    .isAtLeast(Lifecycle.State.CREATED)) {
        mViewLifecycleOwner.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY);
    }
    mState = CREATED;
    mCalled = false;
    onDestroyView(); // #1
    if (!mCalled) {
        throw new SuperNotCalledException("Fragment " + this
                + " did not call through to super.onDestroyView()");
    }
    // Handles the detach/reattach case where the view hierarchy
    // is destroyed and recreated and an additional call to
    // onLoadFinished may be needed to ensure the new view
    // hierarchy is populated from data from the Loaders
    LoaderManager.getInstance(this).markForRedelivery();
    mPerformedCreateView = false;
}
```

여기에서 `#1` , 즉 onDestoryView()가 호출된다

정리해보면, onDestroyView가 호출되고 그 이후에 mViewLifecycleOnwer가 null로 변하게 된다



### ViewLifecycleOwnerLiveData

mViewLifecycleOnwer를 따라가다 보면 mViewLifecycleOnwer값을 변경해주면서 mViewLifecycleOwnerLiveData값까지 같이 변경시켜주는 부분을 볼 수 있다

```java
MutableLiveData<LifecycleOwner> mViewLifecycleOwnerLiveData = new MutableLiveData<>();
```

mViewLifecycleOwnerLiveData를 이용하면 Fragment View 생성과정을 떠나 순수하게 ViewLifecycleOwner만 바라보고 작업을 할 수도 있다

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    viewLifecycleOwnerLiveData.observe(this) {
				...
		}
}
```





### 참고사이트

- [Fragment 에서 ViewLifecycleOwner 사용 시 주의점](https://uchun.dev/caution-when-using-a-fragment-viewLifecycleOwner/){: class="underlineFill"}