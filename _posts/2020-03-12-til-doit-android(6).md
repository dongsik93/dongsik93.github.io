---
layout: post
title: "SMS 입력화면 만들기"
subtitle: "Do it! 안드로이드(6)"
date: 2020-03-12 20:30:00 +0900
categories: til
tags: android
comments: true
---



## SMS 입력화면 만들고 글자수 표시하기

```xaml
<!--activity_main-->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"

    >
    <EditText
        android:id="@+id/editText"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:layout_weight="3">
    </EditText>

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:layout_gravity="right"
        android:text="0 / 80 바이트">
    </TextView>

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_gravity="center"
        android:layout_weight="1">

        <Button
            android:id="@+id/sendButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="전송"
            android:onClick="sendButton">
        </Button>
        <Button
            android:id="@+id/closeButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="닫기"
            android:onClick="closeButton">
        </Button>

    </LinearLayout>
</LinearLayout>
```



```java
package com.example.doitmission_04;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    EditText editText;
    TextView textView;
    int LIMIT = 80;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        editText = (EditText) findViewById(R.id.editText);
        textView = (TextView) findViewById(R.id.textView);

        editText.addTextChangedListener(new TextWatcher() {
          	// TextWatcher 인터페이스는 아래 3개의 메서드를 필수로 구현해야 한다
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
              	// 입력하기 전에 동작하는 메서드
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
              	// editText에 변화가 있을 경우 동작하는 메서드
              	// start는 editText에 벗어났을 당시 마지막 위치를 가지고 있음
              	// count는 editText에 들어와 지금까지 입력한 글자의 수를 가지고 있음
              	// 따라서 start + count수가 현재의 바이트 수
                textView.setText((start + count) + " / " + 80 + "바이트");
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

    }

    public void sendButton(View v) {
      	// editText에서 내용을 가져와 string으로 
        String msg = editText.getText().toString();
        Toast.makeText(getApplicationContext(), "입력한 내용은 \n\n" + msg, Toast.LENGTH_LONG).show();
    }

    public void closeButton(View v) {
        finish();
    }
}
```

