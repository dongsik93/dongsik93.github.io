---
layout: post
title: "애플리케이션 구성하기"
subtitle: "Do it! 안드로이드(7)"
date: 2020-03-13 10:00:00 +0900
categories: til
tags: android
comments: true
---



## [Android] 애플리케이션 구성하기

### 레이아웃 인플레이션 이해

- XML 레이아웃 파일과 매칭하는 자바 소스 코드는 `setContentView()` 메소드 
  - `R.layout.레이아웃 파일 이름`
  - R은 res 폴더를 가리키므로 즉, res/layout/파일이름을 나타낸다
- **인플레이션**이란?
  - XML 레이아웃에 정의된 내용이 메모리에 로딩된 후 객체화 되는 과정을 말한다

- XML 레이아웃파일은 앱이 실행되는 시점에 로드되어 메모리에 객체화 되기 때문에 실제 앱을 만드는 과정에서 중요하다
- 즉, XML 레이아웃 파일 안에 `<Button> ` 태그를 정의해 두었더라도 앱은 그 정보를 미리 알고 있는 것이 아니라 실행하면서 확인하게 된다

- 따라서 `setContentView()` 메소드가 호출되기 전에 XML 레이아웃에 정의된 버튼을 찾아 참조하면 앱 자체를 멈추게 되는 오류를 발생하게 된다
- **`setContentView()`의 역할**
  - 화면에 나타낼 뷰를 지정하는 역할
  - XML 레이아웃의 내요을 메모리에 객체화 하는 역할
- 부분화면은 부분화면을 위한 XML 레이아웃을 메모리에 객체화 하기 위해 별도의 인플레이션 객체, `LayoutInflater` 라는 클래스를 사용한다



#### 전체화면 중에서 일부분만을 XML 레이아웃으로 정의한 후 보여주는 과정

- 일부화면을 분리하여 `/res/layout/button.xml`파일에 정의
- 이 파일의 내용은 `LayoutInflater` 객체를 사용해 뷰그룹 객체로 객체화(인플레이션)한다
- 그 후 메인 레이아웃에 추가 한다

1. 먼저 `activity_menu.xml`을 생성한다

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView
        android:id="@+id/textView"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="버튼을 눌러 부분 화면을 추가하세요"
        android:textSize="20dp" />

    <Button
        android:id="@+id/button2"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="추가하기" />

    <LinearLayout
        android:id="@+id/container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">
    </LinearLayout>

</LinearLayout>
```

2. 부분화면으로 추가할 XML 레이아웃 `sub1.xml`을 생성한다
   - `sub1.xml`은 `activity_menu.xml` 파일에 들어있는 버튼을 클릭했을 때 그 레이아웃에 들어있는 리니어 레이아웃 안에 추가되도록 만들어준다 

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical" android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#ffaaccff">

    <TextView
        android:id="@+id/textView2"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="부분화면1"
        android:textSize="30dp" />

    <CheckBox
        android:id="@+id/checkBox"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="동의합니다" />

</LinearLayout>
```

3. `MenuActivity.java` 를 수정해준다
   - `getSystemService()` 메소드를 사용해 `LayoutInflater `객체를 참조하고 있다
   - 그리고 그 객체의 `inflate()` 메소드를 호출하면서 파라미터로 `R.layout.sub1`과 `container` 객체를 전달
   - 이는 리니어 레이아웃 객체에 sub1.xml 파일의 레이아웃을 설정하라는 의미이다
   - `inflate()` 메소드가 사용되면 레이아웃에 정의된 뷰들은 내부적으로 객체화 과정을 거친다

```java
package com.example.samplelayoutinflater;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;

public class MenuActivity extends AppCompatActivity {
    LinearLayout container;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);
				// 리니어 레이아웃의 id는 container
        container = (LinearLayout) findViewById(R.id.container);

        Button button = (Button) findViewById(R.id.button2);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view){
                LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
              	// inflate() 메소드가 사용되면 레이아웃에 정의된 뷰들은 내부적으로 객체화 과정을 거친다
                inflater.inflate(R.layout.sub1, container, true);
								// sub1.xml파일이 메모리에 객체화 되었기 때문에 그 안에 들어있던 체크박스가 참조 가능
                CheckBox checkbox = (CheckBox) container.findViewById(R.id.checkBox);
                checkbox.setText("로딩되었어요.");
            }
        });
    }
}
```

4. 매니페스트 파일을 수정한다

```xml
<activity android:name=".MainActivity"></activity>
        <activity android:name=".MenuActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
```

- 레이아웃을 객체화 하는 과정은 매우 중요 !!



### 화면 구성과 화면 간 전환

일반적으로 안드로이드는 **하나의 화면**을 **하나의 액티비티**라고 생각할 수 있다

따라서 앱을 구성하는 각 화면은 액티비티로 구현되며 이러한 액티비티끼리 전환하는 과정은 각각의 액티비티를 필요에 따라 띄우거나 닫는 과정과 같다





### 화면 구성과 화면 간 전환

1. 두 액티비티간 전환을 위해 새로운 액티비티를 생성(menu_activity)
2. main_activity에서 띄워줄 액티비티를 선언
3. 새로 띄운 액티비티로부터 받은 응답을 처리



1. 새로운 액티비티를 생성한다

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MenuActivity">

    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="돌아가기"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintTop_toTopOf="parent"/>
</androidx.constraintlayout.widget.ConstraintLayout>
```

```java
package com.example.sampleintent;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MenuActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        Button button = findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.putExtra("name", "mike");
                setResult(RESULT_OK, intent);

                finish();
            }
        });
    }
}
```

- `onClick()` 메소드 안에서는 Intent 클래스를 사용해 intent 객체를 만들어서 `setResult()` 메소드를 호출한다
- `setResult()`
  - 새로 띄운 액티비티에서 이전 액티비티로 **인텐트를 전달**하고 싶을 때 사용되는 메소드
  - `setResult(응답 코드, 인텐트)`
  - 현재 액티비티를 띄웠던 액티비티로 응답 코드와 인텐트가 전달된다



2. 메인 액티비티에서 새로 액티비티 띄우기

- XML코드는 생략

```java
package com.example.sampleintent;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {
    public static final int REQUEST_CODE_MENU = 101;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onButton1Clicked(View v) {
        Intent intent = new Intent(getApplicationContext(), MenuActivity.class);
        startActivityForResult(intent, REQUEST_CODE_MENU);
    }
}
```

- 새로운 액티비티를 띄울 때 `startActivityForResult()` 메소드를 호출
  - `startActivity()` 메소드처럼 새로운 화면을 띄우는데 사용하지만
  - **새로 띄운 액티비티로부터 응답을 받을 수 있다**
  - 첫번째 파라미터로는 **컨텍스트 객체**가 전달되는데, 액티비티 객체는 컨텍스크가 될 수 있기 때문에 일반적으로 **this 변수**를 사용
  - 하지만 여기서는 이벤트 처리 메소드 안에서 this 변수로 MainActivity 객체를 참조할 수 없으므로 `getApplicationContext()` 메소드를 사용해 해당 애플리케이션의 Context 객체를 참조한다
- `REQUEST_CODE_MENU` 는 새로운 액티비티를 띄울 때 보낼 요청 코드로 정의
  - 이 값은 마음대로 지정할 수 있은 ㅏ앱에 들어갈 액티비티가 여러개 있을 수 있으므로 서로 중복되지 않게 지정한다
- 여기서 **인텐트 객체**는 액티비티를 띄울 목적으로 사용되며, 액티비티 간에 데이터를 전달하는 데에도 사용될 수 있다



3. 새로띄운 액티비티로부터 받은 응답을 처리

```java
...

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);

  if (requestCode == REQUEST_CODE_MENU) {
    Toast.makeText(getApplicationContext(),
                   "onActivityResult 메소드 호출, 요청코드 : " + requestCode + ", 결과코드 : " + resultCode,
                   Toast.LENGTH_LONG).show();

    if (resultCode == RESULT_OK) {
      String name = data.getExtras().getString("name");
      Toast.makeText(getApplicationContext(), "응답으로 전달된 name : " + name,
                     Toast.LENGTH_LONG).show();
    }
  }
}
```

- `AppCompatActivity` 클래스의 `onActivityResult()` 메소드를 오버라이드

- `onActivityResult()`
  - 새로 띄웠던 액티비티가 응답을 보내오면 그 응답을 처리하는 역할
  - **첫번째 파라미터**는 액티비티를 띄울 때 전달했던 요청코드와 같다. 따라서 어떤 액티비티로부터 응답을 받은 것인지 구분할 때 사용
  - **두번째 파라미터**는 응답을 보내 온 액티비티로부터 전달된 응답 코드
    - 보통 `Activity.RESULT_OK` 상수를 전달하면 정상 처리된 것임을 알 수 있다
  - **세번째 파라미터**는 새로 띄웠던 메뉴 액티비티로부터 전달 받은 인텐트
    - 데이터를 넣어 전달할 수 있다. 
    - 그러므로 이 인텐트 객체는 새로운 액티비티에서 원래의 액티비티로 데이터를 전달할 목적으로 사용한다





본 문서는 Do it! 안드로이드 앱 프로그래밍 책을 보고 작성하였습니다.