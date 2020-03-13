---
layout: post
title: "리니어 레이아웃 사용하기"
subtitle: "Do it! 안드로이드(3)"
date: 2020-03-11 18:30:00 +0900
categories: til
tags: android
comments: true
---





## [Android] 리니어 레이아웃(LinearLayout) 사용하기

#### 방향설정

- 리니어 레이아웃은 한 방향으로만 뷰를 쌓기 때문에 방향을 필수 속성
- `orientation` - horizontal, vertical

##### 자바 코드에서 화면구성

- `setContentView()`

  - 이 메소드를 호출하면서 xml 파일을 파라미터도 전달하면 이 레이아웃 파일이 액티비티에 설정된다

  ```java
  // XML 레이아웃으로 정의된 리소스를 가리킴
  setContentView(R.layout.activity_main)
  // 자바 코드에서 만든 뷰그룹 객체를 가리킴
  setContentView(mainLayout)
  ```

- 화면에 보이는 레이아웃은 자바 소스 코드와 분리되어 있어 나중에 화면 구성을 바꿀 때도 XML만 간단하게 수정하면 된다

- 상황에 따라 자바 코드에서 화면을 구성하는 것이 효율적일 때도 있다

  - 뷰 객체를 코드에서 만들 때 뷰의 생성자에는 항상 `Context`객체가 전달되어야 한다

  > **Context**객체의 역할
  >
  > 안드로이드에서는 UI 구성요소인 뷰에 대한 정보를 손쉽게 확인하거나 설정할 수 있도록 뷰의 생성자에 Context 객체를 전달하도록 되어 있다

  - AppCompatActivity 클래스는 Context를 상속하므로 this를 Context로 사용할 수 있다

```java
public class LayoutCodeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // new 연산자로 리니어 레이아웃을 만들고 방향을 설정
        LinearLayout mainLayout = new LinearLayout(this);
      	// 방향속성을 정의한 상수를 파라미터로 전달
        mainLayout.setOrientation(LinearLayout.VERTICAL);

        // new 연산자로 레이아웃안에 추가될 뷰들에 설정할 파라미터 생성
      	// 뷰그룹에 추가하기위해 LayoutParams	객체를 사용
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
          LinearLayout.LayoutParams.MATCH_PARENT,
          LinearLayout.LayoutParams.WRAP_CONTENT);

        // 버튼에 파라미터 설정하고 레이아웃에 추가
        Button button01 = new Button(this);
        button01.setText("Button 01");
        button01.setLayoutParams(params);
        mainLayout.addView(button01);

        // 새로만든 레이아웃을 화면에 설정
        setContentView(mainLayout);

    }
}
```

- 실제 자바코드로 화면을 구성후 액티비티를 등록시키기 위해 매니페스트 파일을 수정해 준다

```xml
<!--AndroidManifest.xml-->
<activity android:name=".LayoutCodeActivity">
```

- 자바 소스 코드에서 뷰를 만들어 뷰그룹에 추가할 때는 뷰의 배치를 위한 속성을 설정할 수 있는 `LayoutParams`객체를 사용한다
  - 두 가지 상수인 `LayoutParams.MATCH_PARENT`와 `LayoutParms.WRAP_CONTENT` 중 하나를 사용할 수 있다
  - 가로와 세로의 크기 값을 직접 설정할 수 있다
- 소스 코드에서 뷰를 추가하고 싶으면 `addView()` 메소드를 사용한다



#### 뷰 정렬

- 안드로이드에서는 `gravity`라는 속성 이름을 사용한다
- 어느 쪽에 무게중심을 놓을 것인지.. 정렬이라고 생각해도 무관하다
- 정렬 기능이 필요한 경우
  - `layout_gravity`
    - 뷰가 어디에 위치할 것인지를 결정
    - 부모 컨테이너의 여유 공간에 뷰가 모두 채워지지 않아 여유 공간이 생겼을 때 여유 공간 안에서 뷰를 정렬
      - 안드로이드는 여유공간이 있을 경우 디폴트로 왼쪽정렬을 하게되는데 이 속성을 직접 설정하게되면 왼쪽, 중앙, 오른쪽 정렬을 할 수 있다
    - 뷰의 layout_width나 layout_height 속성을 wrap_content로 만든 후에 같이 사용할 수 있다
  - `gravity`
    - 뷰 안에 표시하는 내용물을 정렬할 때(텍스트뷰의 경우. ), 뷰 안에 들어있는 내용물의 위치를 결정
    - 정렬 속성 값들
      - top, bottom, left, right, center_vertical, center_horizontal, fill_vertical, fill_horizontal, center, fill, clip_vertical, clip_horizontal
    - 필요한 경우 `|`연산자를 이용해서 여러 개의 값을 같이 설정할 수도 있다
      - 이 때 주의할 점은 `|` 연산자 양쪽에 공백이 없어야 한다
      - `android:gravity="center_horizontal|center_vertical"`

```xml
<!--layout_gravity와 gravity 실습-->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button4"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="start"
        android:text='left'
        />

    <Button
        android:id="@+id/button5"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text='center'
        />

    <Button
        android:id="@+id/button6"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right"
        android:text='right'
        />

    <TextView
        android:id="@+id/textView"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="left"
        android:textSize="32dp"
        android:textColor="#ffff0000"
        android:text="left" />

    <TextView
        android:id="@+id/textView2"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="right"
        android:textSize="32dp"
        android:textColor="#ffff0000"
        android:text="right" />

    <TextView
        android:id="@+id/textView3"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:gravity="center_horizontal|center_vertical"
        android:textSize="32dp"
        android:textColor="#ffff0000"
        android:text="center" />
</LinearLayout>
```

- 화면을 구성하다 보면 텍스트가 옆의 텍스트뷰나 버튼에 들어있는 텍스트와 높이가 맞지 않는 경우가 종종 있게 되는데, layout_gravity나 gravity 속성 값을 설정하는 것만으로 정렬을 맞추기 힘들 수 있는데 **baselineAligned**속성을 이용할 수 있다
  - baselineAlined 속성은 디폴트 값이 true
  - 이 속성으로 정렬을 맞춘 경우 텍스트의 정렬이 우선시 되므로 뷰의 배치가 달라질 수 있다
  - 제약 레이아웃에서는 화면에 연결선을 만들어 텍스트 높이를 맞출 수 있다

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal" android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:baselineAligned="false">

    <TextView
        android:id="@+id/textView4"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="큰글씨"
        android:textColor="#ffff0000"
        android:textSize="40dp" />

    <TextView
        android:id="@+id/textView5"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="중간 글씨"
        android:textColor="#ff00ff00"
        android:textSize="20dp" />

    <Button
        android:id="@+id/textView6"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="작은 글씨"
        android:textColor="#ff0000ff"
        android:textSize="14dp"/>
</LinearLayout>
```



#### 뷰 마진과 패딩 설정

- 뷰의 영역은 테두리 선으로 표시할 수 있다(border)
- 테두리선을 기준으로 바깥공간과 안쪽공간이 존재한다
- 이 공간 모두 포함하여 뷰가 가지는 공간은 `셀(cell)` 이라고 한다
  - 버튼이나 텍스트뷰를 위젯이라고 부르니까 이 공간을 `위젯 셀(Widget cell)`이라고 부르기도 한다
- 테두리 선 바같의 공간을 `마진(Margin)`이라고 하고 `layout_margin` 속성으로 얼마나 띄워둘 것인지 지정할 수 있다
- 테두리선 안 쪽의 공간을 `패딩(padding)`이라고 한다
  - 뷰 안의 내용물인 텍스트나 이미지가 테두리선과 얼마나 떨어져 있도록 할 것인지를 지정

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal" android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/textView7"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="TextView"
        android:textColor="#ffff0000"
        android:textSize="24sp"
        android:background="#fffff00"
        android:padding="20dp"/>

    <TextView
        android:id="@+id/textView8"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="TextView"
        android:textSize="24sp"
        android:textColor="#ffff0000"
        android:background="#ff00ffff"
        android:layout_margin="10dp"/>

    <TextView
        android:id="@+id/textView9"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="TextView"
        android:textColor="#ffff0000"
        android:textSize="24sp"
        android:background="#ffff00ff"
        android:padding="20dp"/>
</LinearLayout>
```



#### 여유공간 분할하기

- 부모 컨테이너에 추가한 뷰들이 차지하는 공간 이외의 여유공간은 `layout_weight` 속성으로 분할할 수 있다
- `layout_weight` 속성은 부모 컨테이너에 남아있는 여유공간을 분할하여 기존에 추가했던 뷰들에게 할당할 수 있다
  - 속성으로 숫자값을 지정하면 그 숫잔느 분할 비율이 되며 그 값의 비율만큼 여유 공간을 분할한 후 해당 뷰에게 할당한다

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        >

        <TextView
            android:id="@+id/textView11"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:background="#ffffff00"
            android:textColor="#FFFF0000"
            android:textSize="24sp"
            android:text="TextView"
            android:layout_weight="1"/>

        <TextView
            android:id="@+id/textView10"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="TextView"
            android:background="#ff00ffff"
            android:textColor="#ffff0000"
            android:textSize="24sp"
            android:layout_weight="1"/>
    </LinearLayout>
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        >

        <TextView
            android:id="@+id/textView12"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:background="#ffffff00"
            android:textColor="#FFFF0000"
            android:textSize="24sp"
            android:text="TextView"
            android:layout_weight="1"/>

        <TextView
            android:id="@+id/textView13"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="TextView"
            android:background="#ff00ffff"
            android:textColor="#ffff0000"
            android:textSize="24sp"
            android:layout_weight="2"/>
    </LinearLayout>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        >

        <TextView
            android:id="@+id/textView14"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:background="#ffffff00"
            android:textColor="#FFFF0000"
            android:textSize="24sp"
            android:text="TextView"
            android:layout_weight="1"/>

        <TextView
            android:id="@+id/textView15"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:text="TextView"
            android:background="#ff00ffff"
            android:textColor="#ffff0000"
            android:textSize="24sp"
            android:layout_weight="2"/>
    </LinearLayout>

</LinearLayout>
```



본 문서는 Do it! 안드로이드 앱 프로그래밍을 보고 작성하였습니다.