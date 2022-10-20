---
layout: post
title: "[Android] TextView.getText()"
subtitle: "TextView의 text를 가져오자"
date: 2022-09-30 12:00:00 +0900
categories: til
tags: android view
comments: true

---



# [Android] TextView.getText()



> 오랜만에 간단한 글.. 정신차리고 코딩



TextView의 LineCount를 가져오려면 해당 TextView가 그려진 다음에 TextView의 .lineCount 메서드를 통해서 값을 가져올 수 있다.

그렇게 하려면 ViewTreeObserver를 단다던지… textView에 .post runnable을 사용해야 한다.

번거로운 작업이여서 조금 더 검색을 해본 결과 다음과 같은 코드를 찾을 수 있었다.

```kotlin
System.getProperty("line.separator")?.let { textView.text.toString().split(it).size } ?: 0
```

TextView의 LineCount를 반환을 해준다는 코드이다. ([StackOverFlow..](<https://stackoverflow.com/questions/12037377/how-to-get-number-of-lines-of-textview>){: class="underlineFill"})

TextView의 lineSeperator로 text를 split해서 lineCount를 구해주는 코드블럭으로 생각했고, 긁어다가 적용시켜보니 잘 되길래 문제 없이 사용하고 있었다.

하지만 제대로 알고쓰지 않아서 인지 역시나 문제가 발생했다.

다른 프로젝트에 해당 기능을 동일하게 구현해야 해서 위의 코드를 긁어다가 붙여놨는데 동작이 안되는 상황이 발생했다.

대체 왜지? 라는 생각에 한번 소스를 까보았다.



제대로 동작하는 소스

```kotlin
// Android-31/android/widget/TextView.java
@ViewDebug.CapturedViewProperty
@InspectableProperty
public CharSequence getText() {
    if (mUseTextPaddingForUiTranslation) {
        ViewTranslationCallback callback = getViewTranslationCallback();
        if (callback != null && callback instanceof TextViewTranslationCallback) {
            TextViewTranslationCallback defaultCallback =
                    (TextViewTranslationCallback) callback;
            if (defaultCallback.isTextPaddingEnabled()
                    && defaultCallback.isShowingTranslation()) {
                return defaultCallback.getPaddedText(mText, mTransformed);
            }
        }
    }
    return mText;
}
```

동작하지 않는 소스

```kotlin
// Android-30/android/widget/TextView.java
@ViewDebug.CapturedViewProperty
@InspectableProperty
public CharSequence getText() {
    return mText;
}
```



같은 getText()인데 동작이 다르다…이래서 안됐었나 싶었다.

Android Compile Version에 따른 TextView 내부의 동작 변화 때문이였다.

31버전, 즉 S(Android 12)부터는 mUseTextPaddingForUiTranslation에 따라서 분기처리가 되어있었는데 이 값은

```kotlin
mUseTextPaddingForUiTranslation = targetSdkVersion <= Build.VERSION_CODES.R;
```

R(Android 11), 즉 30이하일 때 저러한 처리가 들어간다고 할 수 있다.



얌전히 post를 통해서 처리할 수 있도록 코드를 변경해놓았다..