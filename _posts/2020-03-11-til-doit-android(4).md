---
layout: post
title: "여러가지 레이아웃 사용하기"
subtitle: "Do it! 안드로이드(4)"
date: 2020-03-11 19:30:00 +0900
categories: til
tags: android
comments: true
---





## [Android] 여러가지 레이아웃 사용하기



### 상대 레이아웃 사용하기

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:text="Button"
        android:layout_alignParentLeft="true"
        android:layout_alignParentStart="true"
        android:layout_above="@+id/button2"
        android:layout_below="@+id/button3"
        android:background="#ff0088ff"/>

    <Button
        android:id="@+id/button2"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_alignParentLeft="true"
        android:layout_alignParentStart="true"
        android:text="Button" />

    <Button
        android:id="@+id/button3"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentTop="true"
        android:layout_alignParentLeft="true"
        android:layout_alignParentStart="true"
        android:text="Button" />
</RelativeLayout>
```

- `layout_above`를 통해서 첫번째 버튼은 두번째 버튼의 바로 윗부분까지만 공간을 차지한다

- `layout_below`를 통해서 첫번째 버튼은 세번째 버튼 바로 밑부분 까지만 공간을 차지한다
- 부모 컨테이너와 상대적 위치를 이용해 뷰를 배치하는 속성
  - `layout_alignParentTop` , `layout_alignParentBottom`, `layoutalignParentLeft`, `layout_alignParentRight`, `layout_centerHorizontal`, `layout_centerVertical`, `layout_centerLnParent` 
- 다른 뷰와의 상대적 위치를 이용하는 속성
  - `layout_above`, `layout_below`, `layout_toLeftOf`, `layout_toRightOf`, `layout_alingTop`, `layout_alignBottom`, `layout_alignLeft`, `layout_alignRight`, `layout_alignBaseline`



### 테이블 레이아웃 사용하기

- 표나 엑셀시트 같은 형태로 화면을 구성
- `TableRow`라는 태그가 여러개 들어가는데, 이 **태그는 한 행을 의미**하고, **각각의 뷰들이 하나의 열**을 의미
- 결과적으로 레이아웃에 추가된 TableRow의 개수가 행의 개수가되고, 각 TableRow마다 추가된 뷰의 개수가 열의 개수가 된다

```xml
<?xml version="1.0" encoding="utf-8"?>
<TableLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:stretchColumns="0,1,2">
    
    <TableRow
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <Button
            android:id="@+id/button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />

        <Button
            android:id="@+id/button2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />

        <Button
            android:id="@+id/button3"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />
    </TableRow>

    <TableRow
        android:layout_width="match_parent"
        android:layout_height="match_parent" >

        <Button
            android:id="@+id/button4"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />

        <Button
            android:id="@+id/button5"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />

        <Button
            android:id="@+id/button6"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />
    </TableRow>
</TableLayout>
```

- `stretchColumns` 속성을 추가해서 가로 공간을 꽉 채울 수 있도록 한다(자동 확장)
- `shrinkColumns` 속성은 부모 컨테이너의 폭에 맞추도록 각 열의 폭을 축소(자동 축소)
- 두 속성 모두 0,1,2 같은 칼럼 인덱스 값을 자동으로 부여할 수 있지만, `layout_column` 속성으로 칼럼 인덱스를 지정하면 그 순서를 설정할 수 있다
- `layout_span`은 뷰가 여러 칼럼에 걸쳐 있도록 만들기 위한 속성

```xml
<?xml version="1.0" encoding="utf-8"?>
<TableLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:stretchColumns="0,1,2">
    
    <TableRow
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <Button
            android:id="@+id/button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />

        <Button
            android:id="@+id/button2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />

        <Button
            android:id="@+id/button3"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />
    </TableRow>

    <TableRow
        android:layout_width="match_parent"
        android:layout_height="match_parent" >

        <Button
            android:id="@+id/button4"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />

        <Button
            android:id="@+id/button5"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />

        <Button
            android:id="@+id/button6"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button" />
    </TableRow>
</TableLayout>
```



### 스크롤 뷰 사용하기

- res/drawable 폴더안에 이미지를 넣으면 XML 레이아웃파일에서 사용할 수 있다

```xml
<!--activity_main.xml-->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
>
  	<!--이미지 변경을 위한 버튼-->
    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="이미지 바꾸어 보여주기"
        android:onClick="onButton1Clicked"
        >
    </Button>
  	<!--수평 스크롤을 위한 스크롤 뷰-->
    <HorizontalScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:id="@+id/horScrollView"
        >
      	<!--수직 스크롤을 위한 스크롤 뷰-->
        <ScrollView
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:id="@+id/scrollView"
            >
          	<!--이미지를 보여주는 이미지 뷰-->
            <ImageView
                android:id="@+id/imageView"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content" />
        </ScrollView>
    </HorizontalScrollView>
</LinearLayout>
```



```java
package com.example.samplescrollview;

import androidx.appcompat.app.AppCompatActivity;

import android.content.res.Resources;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ScrollView;

public class MainActivity extends AppCompatActivity {
    ScrollView scrollView;
    ImageView imageView;
    BitmapDrawable bitmap;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 레이아웃에 정의된 scrollView, imageView 객체를 참조
        scrollView = (ScrollView) findViewById(R.id.scrollView);
        imageView = (ImageView) findViewById(R.id.imageView);
        // 수평 스크롤바 기능 on
        scrollView.setHorizontalScrollBarEnabled(true);
        // 리소스의 이미지 참조
        Resources res = getResources();
        bitmap = (BitmapDrawable) res.getDrawable(R.drawable.apple);
        int bitmapWidth = bitmap.getIntrinsicWidth();
        int bitmapHeight = bitmap.getIntrinsicHeight();
        // 이미지 리소스와 이미지 크기 설정
        imageView.setImageDrawable(bitmap);
        imageView.getLayoutParams().width = bitmapWidth;
        imageView.getLayoutParams().height= bitmapHeight;
    }

    public void onButton1Clicked(View v){
        changeImage();
    }

    private void changeImage() {
      	// 다른 이미지 리소스로 변경
        Resources res = getResources();
        bitmap = (BitmapDrawable) res.getDrawable(R.drawable.water);
        int bitmapWidth = bitmap.getIntrinsicWidth();
        int bitmapHeight = bitmap.getIntrinsicHeight();

        imageView.setImageDrawable(bitmap);
        imageView.getLayoutParams().width = bitmapWidth;
        imageView.getLayoutParams().height = bitmapHeight;
    }
}
```

- XML 레이아웃에서 설정한 id 를 자바 코드에서 참조
  - `R.id.아이디`
- `getIntrinsicWidth()`, `getIntrinsicHeight()` 메소드를 이용해 원본 이미지의 가로와 세로 크기를 알아낸다



### 프레임 레이아웃과 뷰의 전환

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
		<!--이미지 전환 버튼-->
    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="이미지 바꾸기"
        android:onClick="onButton1Clicked">
    </Button>
		<!--프레임 레이아웃으로 나머지 화면 채우기-->
    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        >
      	<!--첫 번째 이미지뷰를 안보이도록 설정-->
        <ImageView
            android:id="@+id/imageView"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:src="@drawable/water"
            android:visibility="invisible">
        </ImageView>
      	<!--두 번째 이미지뷰를 보이도록 설정-->
        <ImageView
            android:id="@+id/imageView2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:src="@drawable/apple"
            android:visibility="visible">
        </ImageView>
    </FrameLayout>

</LinearLayout>
```

- `Visibitility` 속성을 이용해서 첫 번째 이미지는 숨기고, 두번째 이미지는 보여주게 설정
- 버튼이 눌릴 때 마다 이미지를 바꾸어줄 코드

```java
public class MainActivity extends AppCompatActivity {
    ImageView imageView;
    ImageView imageView2;
    int imageIndex = 0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        imageView = (ImageView) findViewById(R.id.imageView);
        imageView2 = (ImageView) findViewById(R.id.imageView2);
    }

    public void onButton1Clicked(View v) {
        changeImage();
    }

    private void changeImage() {
        if (imageIndex == 0) {
            imageView.setVisibility(View.VISIBLE);
            imageView2.setVisibility(View.INVISIBLE);
            imageIndex = 1;
        } else if (imageIndex == 1) {
            imageView.setVisibility(View.INVISIBLE);
            imageView2.setVisibility(View.VISIBLE);
            imageIndex = 0;
        }
    }
}
```

- `changeImage` 메소드는 두 개의 이미지뷰가 갖는 가시성 속성을 변경해준다





본 문서는 Do it! 안드로이드 앱 프로그래밍을 보고 작성하였습니다.