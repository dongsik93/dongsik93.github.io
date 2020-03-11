---
layout: post
title: "기본 위젯들"
subtitle: "Do it! 안드로이드(5)"
date: 2020-03-11 20:30:00 +0900
categories: til
tags: android
comments: true
---





## 기본 위젯들

##### 텍스트뷰

- 텍스트를 화면에 보여주는 역할

- 속성들

- `text`

  - 텍스트뷰에 보이는 문자열을 설정할 수 있다
  - 텍스트뷰는 표시될 문자열이 없으면 텍스트뷰가 차지하는 영역도 알 수 없으므로 문자열은 반드시 지정해야 된다
  - 직접 문자열을 XML 레이아웃에 넣어줄 수도 있고, /res/values 폴더 안의 `strings.xml` 파일안에 들어있는 문자열을 지정할 수도 있다

  ```xml
  <!--strings.xml-->
  <resources>
  	<string name="app_name">SampleWidget</string>
    <string name="person_name">문동식</string>
  </resources>
  ```

  - strings.xml 파일에 person_name을 추가하고 XML 레이아웃에 추가할 수 있다

  ```xml
  <!--activity_main.xml-->
  <TextView android:text="@string/person_name"></TextView>
  ```

  - 이렇게 문자열을 srings.xml 파일에 분리하여 넣어 두면 국가마다 다른 언어를 사용하거나 단말에서 다른언어로 지정되어 있을 때도 쉽게 여러 나라의 문자열을 표시할 수 있다

- `textColor`
  - 텍스트뷰에서 표시하는 문자열의 색상
- `textSize`
  - 텍스트뷰에서 표시하는 문자열의 크기
  - 폰트 크기대로 표시할 때 `sp`단위를 주로 사용 
- `textStyle`
  - 텍스트뷰에서 표시하는 문자열의 스타일 속성
  - normal, bold, italic등 값을 지정
- `typeFace`
  - 텍스트뷰에서 표시하는 문자열의 폰트
- `maxLines`
  - 텍스트뷰에서 표시하는 문자열의 최대 줄 수를 설정

```xml
<!--여러가지 옵션들-->
<TextView
        android:id="@+id/textView"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="#88aabbff"
        android:padding="40dp"
        android:text="여기에 사용자 이름을 입력하세요"
        android:textSize="22sp"
        android:textStyle="bold"
        android:textColor="#ffff8888"
        android:maxLines="1"
        android:layout_gravity="center"/>
```



##### 버튼

- 체크박스나 라디오 버튼도 모두 버튼의 속성을 그대로 가지고 있다

- 추가적으로 사용자가 설정한 상태 값을 저장하도록 정의되어 있다

- 상태 값을 저장하고 선택/해제 상태 표시를 위한 `CompoundButton` 클래스가 정의되어 있다

- `CompoundButton` 

  ```java
  // Reference
  public boolean isChecked ()
  public void setChecked (boolean checked)
  public void toggle ()
  ```

  - `isChecked()`는 버튼이 선택되어 있는지를 확인
  - `setChecked()`는 코드 상에서 상태값을 지정할 경우
  - `onCheckedChanged(CompoundButton buttonview, boolean isChecked)` 는 상태가 바뀔 경우

```xml
<!--button.xml-->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/btnExit"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="선택"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_gravity="center"
        />
    <RadioGroup
        android:id="@+id/radioGroup01"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_marginTop="20dp"
        android:paddingLeft="10dp"
        android:paddingRight="10dp"
        >
        <RadioButton
            android:id="@+id/radio01"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="남성"
            android:textColor="#ff55aaff"
            android:textStyle="bold"
            android:textSize="24dp" />
        <RadioButton
            android:id="@+id/radio02"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="여성"
            android:textColor="#ff55aaff"
            android:textStyle="bold"
            android:textSize="24dp" />
    </RadioGroup>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_vertical|center_horizontal"
        android:paddingTop="20dp">
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="하루종일"
            android:textSize="24sp"
            android:paddingRight="10dp"
            android:textColor="#ff55aaff" />
        <CheckBox
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:id="@+id/allDay" />
    </LinearLayout>

</LinearLayout>
```

- 라디오 버튼의 경우 하나를 선택하면 다른 것들은 선택이 해제되는 동작을 수행해야 하기 때문에 `RadioGroup`을 이용해 하나의 그룹으로 묶어주게 된다
  - XML 레이아웃에서 정의할 때는 `RadioGroup` 태그 안에 포함된 RadioButton은 모두 같은 그룹안에 있는 라디오 버튼으로 인식된다
  - `check()` 메소드를 이용해 라디오 버튼의 ID값을 파라미터로 전달하면 해당 라디오 버튼이 선택됐을 때 ID값이 아닌 -1 값이 전달되면 모든 버튼의 선택이 해제된다



##### 입력상자

- `EditText`는 사용자의 입력을 받고자 할 때 일반적으로 사용된다

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent">

    <EditText
        android:id="@+id/usernameInput"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textSize="24sp"
        android:inputType="textCapWords"
        android:hint="이름을 입력하세요" />
</LinearLayout>
```

- `inputType`
  - 입력되는 글자의 유형 정의
  - 키패드도 그 유형에 맞춰 보이게 된다
- `hint` 
  - 글자를 입력하기 전에 간단한 안내글이 입력상자에 표시된다



##### 이미지뷰

- 이미지를 화면에 표시하려고 제공되는 간단한 위젯
- /res/drawable 폴더 밑에 이미지 파일을 복사하여 넣은후 이미지뷰의 src 속성값으로 이미지 파일을 지정한다
- `@drawable/이미지명`
- 속성들
  - `src` 
    - 원본 이미지 설정
    - 이미지를 지정하지 않으면 이미지뷰의 크기를 확인할 수 없다
  - `maxWidth`, `maxHeight`
    - 이미지가 보일 최대 크기를 설정
  - `tint`
    - 이미지뷰에 보이는 이미지 위에 색상을 적용하고 싶을 때 설정
  - `scaleType`
    - 이미지가 원본 이미지의 크기와 다르게 화면에 보이는 경우 확대/축소를 어떤 방식으로 적용할 것인지 설정
    - fitXY, centerCrop, centerInside등 여러 값이 미리 정의 됨

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <ImageButton
        android:id="@+id/imageButton"
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:layout_marginTop="40dp"
        android:layout_marginLeft="40dp"
        android:background="@drawable/ok"
        android:contentDescription="ok button" >
    </ImageButton>

    <ImageView
        android:id="@+id/iamgeView"
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:layout_marginTop="160dp"
        android:layout_marginLeft="160dp"
        android:background="@drawable/person"
        android:contentDescription="person button">
    </ImageView>
</LinearLayout>
```

- 이미지 버튼을 사용해도 버튼처럼 눌린 상태와 눌리지 않은 상태가 표시되지는 않는다
  - 이를 위해서는 비트맵 버튼을 만들어서 사용하는 것이 좋다



##### 텍스트뷰와 입력상자의 다른 기능들

- 커서
  - selectAllOnFocus : 포커스 받을 때 문자열 전체가 선택
  - cursorVisible : 커서를 보이지 않도록 하려면 false 값으로
- 자동링크
- 줄 간격 조정
  - lineSpacingMultiplier : 줄간격을 배수로 설정할 때 사용
  - lineSpacingExtra : 여유 값으로 설정할 때 사용
- 대소문자 표시
  - capitalize
  - characters, words, sentences 각각 맨 앞 글자를 대문자로
- 줄임 표시
  - ellipsize
  - none은 뒷부분, start, middle end는 각각 앞, 중간, 뒷 부분
  - 텍스트뷰를 한줄로 표시할 때는 maxLine속성을 사용
- 힌트 표시
  - hint
  - textColorHint
- 편집 기능
  - editable
- 문자열 변경 처리
  - getText()





본 문서는 Do it! 안드로이드 앱 프로그래밍을 보고 작성하였습니다.