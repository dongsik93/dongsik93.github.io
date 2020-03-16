---
layout: post
title: "[Android] Android:Onclick을 구현하는 방법"
subtitle: "OnClickListener 구현"
date: 2020-03-16 18:00:00 +0900
categories: til
tags: android
comments: true
---





## Android:OnClick을 구현하는 방법



1. OnClickListener interface를 implements 하여 메서드 구현
2. View의 인자에 바로 Listener를 구현
3. xml에서 메서드를 선언하고 구현



#### 1. OnClickListener interface를 implements 하여 메서드 구현

- 주로 이벤트 리스너를 많이 작성해야 하는 상황에서 사용

```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    // 시작, 정지 버튼 id
    Button startButton = findViewById(R.id.startButton);
    Button stopButton = findViewById(R.id.stopButton);
    // Event Listener
    // OnClickListener interface를 implements하여 메서드 구현
    // 이벤트 리스너를 많이 작성해야 하는 상황에서 사용
    startButton.setOnClickListener(this);
    stopButton.setOnClickListener(this);
  
		@Override
    public void onClick(View v) {
        int _id = v.getId();

        if (_id == R.id.startButton) {
            startAnimation();
        }

        if (_id == R.id.stopButton) {
            stopAnimation();
        }
    }
}
```



#### 2. View의 인자에 바로 Listener를 구현

- 구현 이벤트의 수가 적을 경우, 그리고 리스너를 재사용 하지 않을 경우 많이 사용

```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    // 시작, 정지 버튼 id
    Button startButton = findViewById(R.id.startButton);
    Button stopButton = findViewById(R.id.stopButton);

    startButton.setOnClickListener(new View.OnClickListener(){
      @Override
      public void onClick(View v){
        startAnimation();
      }
    });
    stopButton.setOnClickListener(new View.OnClickListener(){
      @Override
      public void onClick(View v){
        stopAnimation();
      }
    });
}
```



#### 3. xml에서 메서드를 선언하고 구현

- 기능을 작성하는 코드와 뷰를 담당하는 레이아웃 간의 의존성이 강해지기 때문에 잘 사용하지 않는다

```xml
<Button
    ...
    android:onCLick="onClick1">
</Button>
<Button
    ...
    android:onCLick="onClick2">
</Button>
```

```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    // 시작, 정지 버튼 id
    Button startButton = findViewById(R.id.startButton);
    Button stopButton = findViewById(R.id.stopButton);

    public void onClick1(View v){
      startAnimation();
    }
  	
  	public void onClick2(View v){
      stopAnimation();
    }
}
```



참고사이트

- [안드로이드 강의07-Android:onClick를 구현하는 4가지 방법](https://nanstrong.tistory.com/274)

