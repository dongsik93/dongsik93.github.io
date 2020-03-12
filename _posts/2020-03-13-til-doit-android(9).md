---
layout: post
title: "액티비티 수명주기"
subtitle: "Do it! 안드로이드(9)"
date: 2020-03-13 12:00:00 +0900
categories: til
tags: android
comments: true
---





## 액티비티 수명주기



#### 액티비티 상태정보

- `Running` : 실행
  - 화면 상에 액티비티가 보이면서 실행되어 있는 상태
  - 액티비티 스택의 최상위에 있으며 포커스를 가지고 있음
- `Paused` : 일지 중지
  - 사용자에게 보이기는 하지만 다른 액티비티가 위에 있어 포커스를 받지 못하는 상태
- `Stopped` : 중지
  - 다른 액티비티에 완전히 가려져서 보이지 않는 상태



#### 액티비티 수명주기란 ?

액티비티의 상태정보가 변화하는 것을 말하며, 액티비티가 처음 만들어진 후 없어질 때까지 상태가 변화하면서 각각에 해당하는 메소드가 자동으로 호출된다

- 새로운 액티비티가 만들어진다

  - `onCreate()` , `onStart()`, `onResume()` 메소드가 차례대로 호출되며 그런 다음 화면에 보이게 된다

- 실행된 액티비티는 다른 액티비티가 상위에 오게되면 `onPause()` 메소드가 호출된다

  - 상태는 일시중지나 중지 상태로 변하게된다
  - `onPause()` 메소드는 일시중지 상태로 변경될 때 자동으로 호출된다
    - 액티비티가 다시 실행될 때
      - `onResume()` 메소드가 호출된다
  - `onStop()` 메소드는 중지 상태로 변경될 때 호출
    - 액티비티가 다시 실행될 때
      - `onRestart()` 메소드가 호출된다
      - 경우에 따라서는  `onCreate()` 가 호출될 수도 있다

  - 만약 액티비티가 메모리상에서 없어질 경우에는 `onDestory()`가 호출된다



```java
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);
  setContentView(R.layout.activity_main);

  Toast.makeText(this, "onCreate 호출됨", Toast.LENGTH_SHORT).show();
}

@Override
protected void onStart() {
  super.onStart();

  Toast.makeText(this, "onStart 호출됨", Toast.LENGTH_SHORT).show();
}

@Override
protected void onStop() {
  super.onStop();

  Toast.makeText(this, "onStop 호출됨", Toast.LENGTH_SHORT).show();
}

@Override
protected void onDestroy() {
  super.onDestroy();

  Toast.makeText(this, "onDestory 호출됨", Toast.LENGTH_SHORT).show();
}

@Override
protected void onPause() {
  super.onPause();

  Toast.makeText(this, "onPause 호출됨", Toast.LENGTH_SHORT).show();
}

@Override
protected void onResume() {
  super.onResume();

  Toast.makeText(this, "onResume 호출됨", Toast.LENGTH_SHORT).show();
}
```

- 앱 종료한 후 다시 실행했을 때 입력상자에 텍스트가 유지되도록 만들어보자

```java
EditText nameInput;
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Toast.makeText(this, "onCreate 호출됨", Toast.LENGTH_SHORT).show();
    nameInput = findViewById(R.id.nameInput);
}

@Override
protected void onPause() {
    super.onPause();

    Toast.makeText(this, "onPause호출됨", Toast.LENGTH_LONG).show();
    saveState();
}

@Override
protected void onResume() {
    super.onResume();

    Toast.makeText(this, "onResume 호출됨", Toast.LENGTH_SHORT).show();
    restoreState();
}

protected void restoreState() {
  	// pref변수를 지정하고, 데이터를 가져옴
    SharedPreferences pref = getSharedPreferences("pref", Activity.MODE_PRIVATE);
    // pref 가 null이 아니고 name이라는 이름 값이 있으면
  	if ((pref != null) && (pref.contains("name")) ) {
      // name에 pref에서 name값을 찾아서 변경해준다
      String name = pref.getString("name", "");
      nameInput.setText(name);
    }
}

protected void saveState() {
  	// pref 변수를 지정하고, 데이터를 저장
    SharedPreferences pref = getSharedPreferences("pref", Activity.MODE_PRIVATE);
    // pref에 변화를 주겠다
  	SharedPreferences.Editor editor = pref.edit();
    // 입력상자에 입력된 데이터를 가져와 저장
  	editor.putString("name", nameInput.getText().toString());
  	// 변경사항을 반영
    editor.commit();
}
```

- `onPause()` 메소드 안에서는 데이터를 저장
  - `saveState()`
- `onResume()` 메소드 안에서는 데이터를 복원
  - `restoreState()`





본 문서는 Do it ! 안드로이드 앱 프로그래밍 책을 보고 작성하였습니다.