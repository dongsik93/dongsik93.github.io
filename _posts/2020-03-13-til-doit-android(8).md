---
layout: post
title: "인텐트와 액티비티 플래그"
subtitle: "Do it! 안드로이드(8)"
date: 2020-03-13 11:00:00 +0900
categories: til
tags: android
comments: true
---





## 인텐트



인텐트란?

- 다른 액티비티를 띄우거나 기능을 동작시키기 위한 수단으로 활용된다
- 작업을 수행하기 위해 사용되는 일종의 명령 또는 데이터 전달 수단
- 액티비티끼리 서로 호출하기 위해서 필요한 통신 장치



인텐트 생성자

```
Intent() // 디폴트 생성자
Intent(Intent o) // 복사 생성자
Intent(String Action [,URI uri])
Intent(Context packageContext, Class<?> cls) // 가장 많이 사용 
Intent(String action, Uri uri, Context packageContext, class<?> cls)
```



역할과 사용 방식

- 인텐트를 전달할 수 있는 대표적인 메소드
  - `startActivity()` , `startActivityForResult()`
  - `startService()`, `bindService()`
  - `BroadcastIntent()`



인텐트의 기본 구성 요소

- `액션`
  -  수행할 기능
  -  `ACTION_VIEW`, `ACTION_EDIT`
- `데이터`
  - 액션이 수행될 대상 데이터

```
액션과 데이터의 예
ACTION_DIAL tel:01077881234 : 주어진 전화번호를 이용해 전화걸기 화면을 보여줌
ACTION_VIEW tel:01077881234 : 						"			, URI 값의 유형에 따라 VIEW 액션이 다른 기능을 수행
ACTION_EDIT content://contacts/people/2 : 전화번호부 데이터베이스 중 ID 값이 2 인 정보를 편집하기 위한 화면
ACTION_VIEW content://contacts/people : 전화번호부 데이터베이스의 내용을 보여줌
```

- `명시적 인텐트`
  - 인텐트에 **클래스 객체**나 **컴포넌트 이름**을 지정하여 호출할 대상을 확실히 알 수 있는 경우

- `암시적 인텐트`
  - 액션과 데이터를 지정하긴 했지만 호출할 대상이 달라질 수 있는 경우
  - MIME 타입에 따라 안드로이드 시스템에서 적절한 다른 앱의 액티비티를 찾은 후 띄워준다
  - 액션과 데이터로 구성되지만 여러가지 속성들도 있다
  - 범주(Category)
    - 액션이 실행되는데 필요한 추가적인 정보
  - 타입(Type)
    - 인텐트에 들어가는 데이터의 MIME 타입을 명시적으로 지정
  - 컴포넌트(Component)
    - 컴포넌트 클래스의 이름을 명시적으로 지정
  - 부가 데이터(Extra data)
    - 추가적인 정보를 넣을 수 있도록 번들(Bundle) 객체를 담고 있다

```java
package com.example.samlplecallintent;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {
    EditText editText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
				// 뷰 객체 참조
        editText = findViewById(R.id.editText);
        Button button = findViewById(R.id.button);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
              	// 입력상자(editText)에 입력된 전화번호 가져오기
                String data = editText.getText().toString();
								// 전화걸기 화면을 보여줄 intent 객체 생성
                Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(data));
              	// 액티비티 띄우기
                startActivity(intent);
            }
        });
    }
}
```





### 액티비티를 위한 플래그와 부가 데이터

#### 플래그

액티비티가 처리되는 방식

- 액티비티는 `액티비티 스택`이라는 것으로 관리된다
  - 스택이라는 말 처럼 차곡차곡 쌓아두었다가 가장 상위에 있던 액티비티가 없어지면 이전의 액티비티가 다시 화면에 보이도록 한다
- 하지만 동일한 액티비티를 여러번 실행한다면 동일한 액티비티가 여러 개 스택에 들어가게 되어 동시에 데이터를 여러번 접근하거나, 리소스를 여러번 사용하는 문제가 발생할 수 있다
- 이를 해결하기 위해 **플래그**를 사용한다

```
플래그
FLAG_ACTIVITY_SINGLE_TOP
FLAG_ACTIVITY_NO_HISTORY
FLAG_ACTIVITY_CLEAR_TOP
```

- `FLAG_ACTIVITY_SIGNEL_TOP`
  - 액티비티를 생성할 때 이미 생성된 액티비티가 있으면 그 액티비티를 그대로 사용하라는 플래그
  - 이 때 시스템에서 인텐트 객체는 onCreate() 메소드가 호출 되지 않으므로 `onNewIntent()` 메소드를 사용해 **액티비티가 새로 만들어지지 않았을 때 인텐트 객체만 전달 받을 수 있게 **한다
- `FLAG_ACTIVITY_NO_HISTORY`
  - 처음 이후에 실행된 액티비티는 액티비티 스택에 추가되지 않는다
  - 로딩화면과 같이 돌아오는 것이 의미가 없는 화면이라면 이 플래그를 사용해 태스크에 남기지 않고 자동적으로 화면이 넘어감과 동시에 제거할 수 있다
- `FLAG_ACTIVITY_CLEAR_TOP`
  - 이 액티비티 위에 있는 다른 액티비티를 모두 종료시킨다
  - 가져올 액티비티의 위에 있는 액티비티를 모두 삭제한다는 의미이다



#### 부가데이터

- 액티비티를 띄울 때 전달되는 인텐트 안에 부가 데이터(extra data)를 넣어 전달하는 방법을 권장
- 인텐트 안에는 **번들(dunble)** 객체가 들어있다
  - 번들 객체는 해시테이블과 유사해서 putExtra(), getStringExtra()등 메소드로 데이터를 넣거나 빼낼 수 있다
  - 기본자료형 뿐 아니라 바이트배열, Serializable 객체도 넣었다 뺄 수 있다
    - 객체 자료형(object)는 객체 자체로는 안되고 객체 데이터들을 바이트 배열로 변환하여 전달한다
    - `Parcelable` 인터페이스는 Serializable과 유사하지만 직렬화 했을 때 크기가 작아 내부데이터 전달에 사용
  - 키(key)와 값(value) 쌍으로 만들어 넣는다
- 이처럼 번들 객체 안에 넣은 데이터를 `부가데이터`라고 하며 시스템에서는 건드리지 않고 다른 애플리케이션 구성 요소로 전달한다



```java
package com.example.sampleparcelable;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {
    public static final int REQUEST_CODE_MENU = 101;
    public static final String KEY_SIMPLE_DATA = "data";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onButton1Clicked(View v) {
        Intent intent = new Intent(getApplicationContext(), MenuActivity.class);

        SimpleData data = new SimpleData(100, "hello android~");
        intent.putExtra(KEY_SIMPLE_DATA, data);
        startActivityForResult(intent, REQUEST_CODE_MENU);
    }
}
```



```java
package com.example.sampleparcelable;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MenuActivity extends AppCompatActivity {
    TextView textView;
    public static final String KEY_SIMPLE_DATA = "data";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        textView = findViewById(R.id.textView);
        Button button = findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                // 인텐트 객체 생성
                Intent intent = new Intent();
                intent.putExtra("name", "mike");

                // 응답을 전달받고 액티비티 종료
                setResult(RESULT_OK, intent);
                finish();
            }
        });
        // 메인 액티비티로부터 전달받은 인텐트 확인
        Intent intent = getIntent();
        processIntent(intent);
    }

    private void processIntent(Intent intent) {
        if (intent != null) {
            // 인텐트 안의 번들 객체 참조
            Bundle bundle = intent.getExtras();
            // 번들 객체 안의 SimpleData 객체 참조
            SimpleData data = (SimpleData) bundle.getParcelable(KEY_SIMPLE_DATA);
            // 텍스트뷰에 값을 보여준다
            textView.setText("전달받은 데이터 \nNumber : " + data.number + "\nMessage : " + data.message);
        }
    }
}
```





본 문서는 Do it ! 안드로이드 앱 프로그래밍 책을 보고 작성하였습니다.