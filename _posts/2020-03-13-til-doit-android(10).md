---
layout: post
title: "[Android] 스레드와 애니메이션"
subtitle: "Do it! 안드로이드(10)"
date: 2020-03-13 17:00:00 +0900
categories: til
tags: android
comments: true
---





## 스레드와 애니메이션



### 핸들러 사용하기

새로운 프로젝트를 만들면 자동으로 생성되는 메인 액티비티는 앱이 실행될 때 하나의 프로세스에서 처리된다. 따라서 메인 액티비티 내에서 이벤트를 처리하거나 필요한 메소드를 정의하여 기능을 구현하는 경우에도 동일한 프로세스 내에서 실행된다.

하지만 대기시간이 길어지는 네트워크 요청 등의 기능을 수행할 때는 화면에 보이는 UI도 멈춤상태로 있게 되는 문제가 생기게 된다.

안드로이드에서는 백그라운드에서 실행되어야 하는 기능을 **서비스**라는 애플리케이션 구성요소로 정의한다. 위의 문제를 해결하려면 하나의 프로세스 안에서 여러개의 작업이 동시 수행되는 **멀티 스레드 방식**을 사용할 수 있다



##### 왜 핸들러를 사용하나?

View의 접근, 작업스레드에서는 UI 작업을 할 수 없는데, 개발을 하다보면 작업 스레드에서 메인 스레드로 접근해야 되는 일이 발생하게 되는데, 이럴 때 **핸들러**를 사용한다

즉 **핸들러**는 새로 만든 스레드에서 메인 스레드로 메시지를 전달하는 역할이다 



##### 스레드(Thread)란?

동시 수행이 가능한 작업 단위 

현재 수행되는 작업 이외의 기능을 동시에 처리하고자 할 때 새로운 스레드를 만들어 처리할 수 있다.

이러한 멀티스레드 방식은 같은 프로세스 안에 들어 있으면서 메모리 리소스를 공유하게 되므로 효율적인 처리가 가능하지만 동시에 리소스를 접근할 경우에 데드락이 발생하여 시스템이 비정상적으로 동작할 수 있다

- 지연시간이 길어질 수 있는 애플리케이션은 오랜 시간 작업을 수행하는 코드를 별도로 분리한 다음 UI에 응답을 보내준다

  - `서비스 사용`
    - 백그라운드 작업은 서비스로 실행하고 사용자에게는 알림 서비스를 이용해 알려준다
    - 메인 액티비티로 결과값을 전달하고 이를 이용해 다른 작업을 수행하고자 한다면 브로드캐스팅을 이용해 결과값을 전달한다

  - `스레드 사용`
    - 스레드는 동일 프로세스 내에 있기 때문에 작업 수행의 결과를 바로 처리할 수 있다
    - 그러나 UI객체는 직접 접근할 수 없으므로 **핸들러(Handler)객체**를 사용한다



##### 메시지 전송하여 실행

- 앱을 실행할 때 프로세스가 만들어지면 그 안에 **메인 스레드**가 함께 만들어지고 최상위에서 관리되는 애플리케이션 구성 요소인 **액티비티, 브로드캐스트 수신자** 등과 새로 만들어지는 윈도우를 관리하기 위한 **메시지 큐**를 실행하게 된다

- `메시지 큐`를 이용해 순차적으로 코드를 수행할 수 있으며, 메인 스레드에서 처리할 메시지를 전달하는 역할을 담당하는 것이 **핸들러 클래스**이다
  - 핸들러를 이용하면 특정 메시지가 미래의 어떤 시점에 실행되도록 스케줄링 할 수도 있다

- ##### 핸들러의 메시지 처리 방법

  1. 새로 만든 스레드(스레드 #1)가 수행하려는 정보를 메인 스레드로 전달하기 위해서는 먼저 핸들러가 관리하는 메시지 큐에서 처리할 수 있는 **메시지 객체** 하나를 참조해야 한다
     - `obtainMessage()` 메소드를 이용해 호출의 결과고 메시지 객체를 리턴받게 된다
  2. 리턴받은 메시지 객체에 필요한 정보를 넣은 후 `sendMessage()` 메소드를 이용해 **메시지 큐**에 넣는다
  3. 메시지 큐에 들어간 메시지는 순서대로 **핸들러**가 처리하게 된다
     - 이 때 `handleMessage()` 메소드에 정의된 기능이 수행된다
     - 새로 만든 스레드가 아닌 **메인 스레드**

```java
package com.example.samplethread;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.ProgressBar;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    // 프로그레스 바
    ProgressBar bar;
    TextView textView;
    boolean isRunning = false;
    // 메인 스레드의 UI에 접근하기 위한 핸들러
    ProgressHandler handler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        bar = findViewById(R.id.progress);
        textView = findViewById(R.id.textView);
        // 새로 정의한 ProgressHandler
        handler = new ProgressHandler();
    }

    public void onStart() {
        super.onStart();
        // 프로그레스 바 값 0으로 설정
        bar.setProgress(0);
        Thread thread1 = new Thread(new Runnable() {
            public void run() {
                try {
                    for (int i = 0; i < 20 && isRunning; i ++) {
                        // 핸들러로 메시지 전송
                        Thread.sleep(1000);
                        Message msg = handler.obtainMessage();
                        handler.sendMessage(msg);
                    }
                } catch (Exception ex) {
                    Log.e("MainActivity", "Exception in processing mesasge.", ex);
                }
            }
        });

        isRunning = true;
        thread1.start();
    }

    public void onStop() {
        super.onStop();

        isRunning = false;
    }
    /* Handler 클래스를 상속한 ProgressHandler 클래스를 새로 정의
        이유는 handleMessage() 메소드를 다시 정의하여 메시지가
        메인 스레드에서 수행될 때 필요한 기능을 정하기 위해서 새로 정의
    */
    public class ProgressHandler extends Handler {
        public void handleMessage(Message msg) {
            bar.incrementProgressBy(5);

            if (bar.getProgress () == bar.getMax()) {
                textView.setText("Done");
            } else {
                textView.setText("Working ..." + bar.getProgress());
            }
        }
    }

}
```



#### Runnable 객체 실행하기

지금까지는 메시지를 전송하고 순서대로 이를 실행하는 방법이였는데, 이 방법은 일반적이지만 개발자 입장에서는 코드가 복잡하게 보일 수 있다.

좀 더 간단한 방법으로 메인 스레드에서 실행시키는, 즉 **Runnable**객체를 실행시킬 수 있는 방법을 제공한다

- 새로만든 Runnable 객체를 핸들러의 post() 메소드를 이용해 전달하면 이 객체에 정의된 run() 메소드 내의 코드들은 메인 스레드에서 실행된다

```java
public void onStart() {
    super.onStart();

    bar.setProgress(0);
    Thread thread1 = new Thread(new Runnable() {
      public void run () {
        try {
          for (int i = 0; i < 20 && isRunning; i++) {
            Thread.sleep(1000);
            // 객체 전달 post()
            handler.post(runnable);
          }
        } catch (Exception ex) {
          Log.e("SampleThreadActivity", "Exception in processing message.", ex);
        }
      }
    });
    isRunning = true;
    thread1.start();
}

/*
    이 전 코드에서는 ProgressHandler 클래스를 새로 정의했지만
    여기에서는 Handler 클래스를 이용해 객체를 생성하는 대신
    전달할 Runnable 클래스를 새로 정의해서 반복적으로 사용할 수 있게 한다
*/
public class ProgressRunnable implements Runnable {
    public void run() {
      bar.incrementProgressBy(5);
      if (bar.getProgress() == bar.getMax()) {
        textView.setText("Runnable Done");
      } else {
        textView.setText("Runnable Working ... " + bar.getProgress());
      }
    }
}
```



### 일정 시간 후에 실행하기

```java
package com.example.sampledelayed;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    TextView textView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = findViewById(R.id.textView);
        Button requestButton = findViewById(R.id.button);
        requestButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                request();
            }
        });
    }

    // 요청 메소드
    private void request() {
        String title = "원격 요청";
        String message = "데이터를 요청하시겠습니까?";
        String titleButtonYes = "예";
        String titleButtonNo = "아니오";

        AlertDialog dialog = makeRequestDialog(title, message, titleButtonYes, titleButtonNo);
        dialog.show();

        textView.setText("원격 데이터 요청중 ...");
    }

    private AlertDialog makeRequestDialog(CharSequence title, CharSequence message, CharSequence titleButtonYes, CharSequence titleButtonNo) {
        AlertDialog.Builder requestDialog = new AlertDialog.Builder(this);
        requestDialog.setTitle(title);
        requestDialog.setMessage(message);
        requestDialog.setPositiveButton(titleButtonYes, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                for (int k = 0; k < 10; k++) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException ex) {}
                }
                textView.setText("원력 데이터 요청 완료");
            }
        });

        requestDialog.setNegativeButton(titleButtonNo, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {}
        });

        return requestDialog.show();
    }
}
```

- 10초간 응답을 기다린 후 반환하는 상황인데 예 버튼이 눌러있는 10초동안 UI가 멈춰있는 현상이 나타나게 된다

  - 이 이유는 대화상자가 사라지기 전에 네트워킹 기능이 수행됨으로써 처리시간이 필요한 **UI 갱신 과정**이 버튼 클릭될 때 처리되는 작업보다 **나중에 진행되기 때문**에 발생하게 된다

- 해결방법

  - 핸들러의 특정 메소드를 이용하여 일정 시간 후에 실행되도록 만드는 것

    - 핸들러는 메시지 큐를 사용하므로 메시지들을 순서대로 처리하지만, 메시지를 넣을 때 시간을 지정하면 원하는 시간에 메시지를 처리하도록 만들 수 있다

    ```java
    // 메시지를 보낼 때 시간을 지정할 수 있다
    public boolean sendMessageAtTime(Message msg, long uptimeMills)
    // 메시지가 일정 시간이 지난 후 실행되도록 설정할 수 있다
    public boolean sendMessageDelayed(Message msg, long delayMills)
    ```

- 수정 후 코드

```java
private AlertDialog makeRequestDialog(CharSequence title, CharSequence message, CharSequence titleButtonYes, CharSequence titleButtonNo) {
    AlertDialog.Builder requestDialog = new AlertDialog.Builder(this);
    requestDialog.setTitle(title);
    requestDialog.setMessage(message);
    requestDialog.setPositiveButton(titleButtonYes, new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialogInterface, int i) {
        	// 핸들러 객체 생성
          RequestHandler handler = new RequestHandler();
        	// 메시지 보내기
          handler.sendEmptyMessageDelayed(0, 20);
        }
    });

    requestDialog.setNegativeButton(titleButtonNo, new DialogInterface.OnClickListener() {
      @Override
      	public void onClick(DialogInterface dialogInterface, int i) {}
    });

    return requestDialog.show();
}

// 요청 스레드
class RequestHandler extends Handler {
    public void handleMessage(Message msg) {
        for (int k = 0; k < 10; k ++){
            try {
              	Thread.sleep(1000);
            } catch (InterruptedException ex) {}
        }
      textView.setText("원격 데이터 요청 완료");
    }
}
```

- 수정 후 코드는 예 버튼을 눌렀을 때 호출되는 부분에 있던 코드를 새로 정의한 `handleMessage()` 메소드 안으러 이동시키고, 그 자리에 핸들러 객체 생성 후 메시지를 넣는 메소드를 호출한다
- 이렇게 되면 메시지를 넣을 때 데이터를 같이 전송하는 것이 아니기 때문에 `sendEmptyMessageDelayed()` 메소드를 사용한다



### 스레드로 메시지 전송하기

- 메인 스레드에서 별도의 스레드로 메시지를 전달하는 방법이 필요한 경우가 생긴다
  - 변수 선언을 통해 데이터를 전달하는 것이 가장 쉬운방법
  - 메시지 큐를 이용하여 순자척으로 메시지를 실행하는 방식이 필요한 경우가 발생한다



##### `루퍼(Looper)`

- 무한 루프 방식을 이용해 메시지 큐에 들어오는 메시지를 지속적으로 보면서 하나씩 처리해준다
- **메인 스레드**는 UI 객체를 처리하기 위해 메시지 큐와 루퍼를 내부적으로 처리하고 있다
- 하지만 별도의 스레드를 만들었을 경우 루퍼가 없기 때문에 루퍼를 만들어 주어야 한다



```java
package com.example.samplelooper;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    TextView textView, textView2;
    EditText editText, editText2;
    // 메인 스레드 핸들러
    MainHandler mainHandler;
    // 새로만든 스레드
    ProcessThread thread1;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mainHandler = new MainHandler();
        thread1 = new ProcessThread();

        textView = findViewById(R.id.textView);
        textView2 = findViewById(R.id.textView2);
        editText = findViewById(R.id.editText);
        editText2 = findViewById(R.id.editText2);

        Button processButton = findViewById(R.id.button);
        processButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String inStr = editText.getText().toString();
                Message msgTosend = Message.obtain();
                msgTosend.obj = inStr;
								// 버튼을 눌렀을 때 스레드 내의 핸들러로 메시지 전송
                thread1.handler.sendMessage(msgTosend);
            }
        });

        thread1.start();
    }

    // 새로 정의한 스레드
    class ProcessThread extends Thread {
        // 새로운 스레드를 위한 핸들러
        ProcessHandler handler;
        public ProcessThread() {
            handler = new ProcessHandler();
        }

        public void run() {
            // 루퍼, 스레드의 run() 메소드 안에서 루퍼 실행
            Looper.prepare();
            Looper.loop();
        }
    }

    class ProcessHandler extends Handler {
        public void handleMessage(Message msg) {
          	// 메세지 객체 참조
            Message resultMsg = Message.obtain();
            resultMsg.obj = msg.obj + "dongsik!!!";
						// 새로 만든 스레드에서 메인 스레드 핸들러로 메시지 전송
            mainHandler.sendMessage(resultMsg);
        }
    }

    class MainHandler extends Handler {
        public void handleMessage(Message msg){
            String str = (String) msg.obj;
          	// 메인 스레드의 핸들러 내에서 입력상자의 메시지 표시
            editText2.setText(str);
        }
    }
}
```

- 메인 스레드에서 받은 메시지를 새로 만든 스레드에서 전달받은 문자열 에 다른 문자열을 덧붙여 메인 스레드 쪽으로 다시 전송하는 과정을 보여주는 코드



### AsyncTask 사용하기

백그라운드 작업을 좀 더 쉽고 간단하게 하기 위해서 `AsyncTask` 클래스를 사용한다

##### `AsyncTask`

- AsyncTask 클래스를 상속하여 새로운 클래스를 만들면 그 안에 스레드를 위한 코드와 UI 접근 코드를 한꺼번에 넣을 수 있다
  - 스레드로 처리해야 하는 코드를 각각 AsyncTask 클래스로 정의할 수 있다는 장점

```
doInBackground()
- 새로 만든 스레드에서 백그라운드 작업을 수행한다
- execute() 메소드를 호출할 때 사용된 파라미터를 배열로 전달받는다

onPreExcute()
- 백그라운드 작업을 수행하기 전에 호출된다
- 메인 스레드에서 실행되며 초기화 작업에 사용된다

onProgressUpdate()
- 백그라운드 작업의 진행 상태를 표시하기 위해 호출된다
- 작업 수행 중간 중간에 UI 객체에 접근하는 경우에 사용된다

onPostExecute()
- 백그라운드 작업이 끝난 후에 호출된다
- 메인 스레드에서 실행되며 메모리 리소스를 해제하는 등의 작업에 사용된다

cancel()
- 호출되면 onCancelled()가 호출됨

getStatus()
```



```java
package com.example.sampleasynctask;

import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    TextView textView;
    ProgressBar progress;
    BackgroundTask task;
    int value;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = findViewById(R.id.textView);
        progress = findViewById(R.id.progress);

        // 실행버튼 이벤트 처리
        Button executeButton = findViewById(R.id.button);
        executeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 실행 버튼을 눌렀을 때 새로 정의한 BackgruondTask 객체 생성
                task = new BackgroundTask();
                // execute() 메소드 실행
                task.execute(100);
            }
        });
        // 취소버튼 이벤트 처리
        Button cancelButton = findViewById(R.id.button2);
        cancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 취소 버튼을 눌렀을 때 cancel() 메소드 실
                task.cancel(true);
            }
        });
    }

    // 새로운 task 객체 AsyncTask를 상속하여 정의
    class BackgroundTask extends AsyncTask<Integer, Integer, Integer> {
        protected void onPreExecute() {
            value = 0;
            progress.setProgress(value);
        }

        protected Integer doInBackground(Integer ... values) {
            // cancel()을 통해 작업을 취소했을 경우 onCancelled()가 호출되기 때문
            while (isCancelled() == false) {
                value ++;
                if (value >= 100) {
                    break;
                } else {
                    //의 doInBackground() 메소드 내에서 publishProgress 호출
                    publishProgress(value);
                }
                try {
                    Thread.sleep(100);
                } catch (InterruptedException ex ) {}
            }
            return value;
        }
        // onProgressUpdate() 메소드 내에서 프로그레스바와 텍스트뷰 변경
        protected void onProgressUpdate(Integer ... values) {
            progress.setProgress(values[0].intValue());
            textView.setText("Current Value : " + values[0].toString());
        }

        protected void onPostExecute(Integer result) {
            progress.setProgress(0);
            textView.setText("Finished.");
        }

        protected void onCancelled() {
            progress.setProgress(0);
            textView.setText("Cancelled.");
        }
    }
}
```



### 스레드로 애니매니션 만들기

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

    <ImageView
        android:id="@+id/imageView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</FrameLayout>
```



```java
package com.example.samplethreadanimation;

import androidx.appcompat.app.AppCompatActivity;

import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ImageView;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    ImageView imageView;

    ArrayList<Drawable> drawableList = new ArrayList<Drawable>();

    Handler handler = new Handler();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        imageView = findViewById(R.id.imageView);

        startAnimation();
    }

    public void startAnimation() {
        Resources res = getResources();
        // drawablelist에 이미지 추가
        drawableList.add(res.getDrawable(R.drawable.emo_im_crying));
        drawableList.add(res.getDrawable(R.drawable.emo_im_sad));
        drawableList.add(res.getDrawable(R.drawable.emo_im_happy));
        drawableList.add(res.getDrawable(R.drawable.emo_im_laughing));
        drawableList.add(res.getDrawable(R.drawable.emo_im_surprised));

        AnimThread thread = new AnimThread();
        thread.start();
    }

    class AnimThread extends Thread {
        public void run() {
            int index = 0;
            for (int i = 0; i < 100; i++) {
                final Drawable drawable = drawableList.get(index);
                index += 1;
                if (index > 4) {
                    index = 0;
                }

                handler.post(new Runnable() {
                    public void run() {
                        imageView.setImageDrawable(drawable);
                    }
                });

                try {
                    Thread.sleep(500);
                } catch(Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

- 연속해서 이미지를 바꿔 그리는 방법은 스레드 안에서 직접 이미지를 변경
- 좀 더 간단하게 `ImageSwitcher` 클래스를 이용해서 교체해보자
  - 직접 그리지 않고도 애니메이션 효과를 낼 수 있다



```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical" >

    <LinearLayout
        android:orientation="horizontal"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        >
        <Button
            android:id="@+id/startButton"
            android:layout_height="wrap_content"
            android:layout_width="wrap_content"
            android:layout_marginTop="20dp"
            android:layout_marginBottom="20dp"
            android:layout_marginRight="20dp"
            android:text="시작"
            android:textSize="20dp"
            android:textStyle="bold"
            android:textColor="#ff000000"
            />
        <Button
            android:id="@+id/stopButton"
            android:layout_height="wrap_content"
            android:layout_width="wrap_content"
            android:layout_marginTop="20dp"
            android:layout_marginBottom="20dp"
            android:text="중지"
            android:textSize="20dp"
            android:textStyle="bold"
            android:textColor="#ff000000"
            />
    </LinearLayout>

    <ImageSwitcher
        android:id="@+id/switcher"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        />
</LinearLayout>
```

- `ImageSwitcher` 를 사용

```java
package com.example.samplethreadanimation;

import androidx.appcompat.app.AppCompatActivity;

import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageSwitcher;
import android.widget.ImageView;
import android.widget.ViewSwitcher;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    ImageSwitcher switcher;
    Handler mHandler = new Handler();
    ImageThread thread;
    boolean running;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 시작, 정지 버튼 id
        Button startButton = findViewById(R.id.startButton);
        Button stopButton = findViewById(R.id.stopButton);
        // Event Listener
        // OnClickListener interface를 implements하여 메서드 구현
        // 이벤트 리스너를 많이 작성해야 하는 상황에서 사용 
        startButton.setOnClickListener(this);
        stopButton.setOnClickListener(this);

        switcher = findViewById(R.id.switcher);
        switcher.setVisibility(View.INVISIBLE);
        // ImageSwitcher 객체에 Factory 설정
        switcher.setFactory(new ViewSwitcher.ViewFactory() {
            public View makeView() {
                ImageView imageView = new ImageView(getApplicationContext());
                imageView.setBackgroundColor(0xFF000000);
                imageView.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
                imageView.setLayoutParams(new ImageSwitcher.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

                return imageView;
            }
        });

    }

    // 애니메이션 시작
    private void startAnimation() {
        switcher.setVisibility(View.VISIBLE);
        // 시작버튼을 눌렀을 때 호췰된 startAnimation() 메소드에서 스레드 시작
        thread = new ImageThread();
        thread.start();
    }

    // 애니메이션 중지
    private void stopAnimation() {
        running = false;
        try {
            thread.join();
        } catch(InterruptedException ex) { }

        switcher.setVisibility(View.INVISIBLE);
    }

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

    // 이미지 처리 스레드
    class ImageThread extends Thread {
        int duration = 250;
        final int imageId[] = { R.drawable.emo_im_crying,
                R.drawable.emo_im_happy,
                R.drawable.emo_im_laughing,
                R.drawable.emo_im_surprised };
        int currentIndex = 0;

        public void run() {
            running = true;
            while (running) {
                synchronized (this) {
                    // 핸들러의 post() 메소드를 호출하면서 Runnable 객체를 파라미터로 전달
                    mHandler.post(new Runnable() {
                        public void run() {
                            // 현재 상태에서 보여줄 이미지를 ImageSwitcher 객체에 설정
                            switcher.setImageResource(imageId[currentIndex]);
                        }
                    });

                    currentIndex++;
                    if (currentIndex == imageId.length) {
                        currentIndex = 0;
                    }

                    try {
                        Thread.sleep(duration);
                    } catch (InterruptedException ex) { }
                }
            }
        }
    }

}
```



본 문서는 Do it ! 안드로이드 앱 프로그래밍 책을 보고 작성하였습니다.