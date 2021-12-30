---
layout: post
title: "[Kotlin] JVM Memory구조"
subtitle: "JVM Memory구조에 대해 알아보자"
date: 2021-12-30 18:00:00 +0900
categories: til
tags: kotlin
comments: true

---



# [Kotlin] JVM Memory구조



> Weakreference를 찾아보다가 JVM Memory 구조에 대해서 먼저 알아야 보다 이해가 쉬울것 같아서 먼저 공부를 해보쟈



### JVM 이란

- JVM은 Java Virtual Machine의 약자로, 자바 가상 머신이라고 부른다
- 자바와 운영체제 사이에서 중계자 역할을 하며, 운영체제 종류에 영향받지 않고 돌아갈 수 있도록 한다
- 가비지 컬렉터(GC)를 통해 메모리 관리를 자동으로 해준다



### JVM 구조

![jvm_1.png](/img/in-post/jvm_1.png)

- JVM의 구성은 크게 4가지 (Class Loader, Execution Engine, Garbage Collector, Runtime Data Area)로 나뉜다
- 자바 소스 파일은 자바 컴파일러에 의해서 바이트코드 형태인 클래스파일이 되고, 이 클래스 파일은 클래스 로더가 읽어들이면서 JVM이 수행되게 된다

#### 1. Class Loader

- JVM 내로 클래스 파일을 로드하고, 링크를 통해 배치하는 작업을 수행하는 모듈이다
- 런타임 시에 동적으로 클래스를 로드한다

#### 2. Execution Engine

- Class Loader에 의해 **메모리에 적재된(바이트 코드)들을 기계어로 변경해 명령어 단위로 실행하는 역할**을 한다
- 인터프리터(Interpreter) 방식과, JIT(Just In Time) 컴파일러를 이용하는 방식이 있는데, 인터프리터 방식을 사용하다가 일정한 기준이 넘어가면 JIT 컴파일러 방식으로 실행하게 된다

#### 3. Garbage Collector (GC)

- Heap 메모리 영역에 생성(적재)된 객체들 중 **참조되지 않는 객체들을 탐색 후 제거하는 역할**을 한다
- GC가 역할을 하는 시간은 정확히 언제인지를 알 수 없다, 즉 참조가 없어지자마자 해제되는 것을 보장하지 않는다는 말이다

#### 4. Runtime Data Area

- **JVM의 메모리 영역**으로 자바 애플리케이션을 사용할 때 사용되는 데이터들을 적재하는 영역이다

- 크게 Method Area, Heap Area, Stack Area, PC Register, Native Method Stack 으로 나눌 수 있다

- **RunTime Data Area 구조**

    ![jvm_2.png](/img/in-post/jvm_2.png)

    1.**Method Area (메소드 영역)**

    - 모든 쓰레드가 공유하는 메모리 영역이다
    - 클래스, 인터페이스, 메소드, 필드, static 변수 등의 바이트 코드를 보관한다

    <br/>

    2.**Heap Area (힙 영역)**

    - 모든 스레드가 공유하며, new 키워드로 생성된 객체와 배열이 생성되는 영역이다
    - Method Area에 로드된 클래스만 생성이 가능하고, GC가 참조되지 않는 메모리를 확인하고 제거하는 영역이다

    <br/>

    3.**Stack Area (스택 영역)**

    ![jvm_3.png](/img/in-post/jvm_3.png)

    - 메서드 호출 시마다 각각의 스택 프레임(해당 메서드만을 위한 공간)을 생성한다
    - 메서드 안에서 사용되는 값들을 저장하고, 호출된 메서드의 매개변수, 지역변수, 리턴 값 및 연산 시 일어나는 값들을 임시로 저장한다
    - 메서드 수행이 끝나면 프레임별로 삭제한다

    <br/>

    4.**PC Register (PC 레지스터)**

    - 쓰레드가 시작될 때 생성되며, 생성될 때마다 생성되는 공간으로 쓰레드마다 하나씩 존재하게 된다
    - 현재 쓰레드가 실행되는 부분의 주소와 명령을 저장하고 있는 영역이며, 이것을 이용해서 쓰레드를 돌아가면서 수행할 수 있게 한다

    <br/>

    5.**Native Method Stack**

    - 자바 외의 언어로 작성된 네이티브 코드를 위한 메모리 영역이다
    - 보통 C / C++등의 코드를 수행하기 위한 스택이다

    **쓰레드가 생성되었을 때 기준**으로 Method Area와 Heap Area는 모든 쓰레드가 공유하고, 나머지 Stack Area, PC Register, Native Method Stack은 각각의 쓰레드마다 생성되고 공유되지 않는다



이것으로 JVM 메모리 구조를 알아보는것을 마무리하고, 다음에는 Heap Area영역에서 일어나는 GC와, Reference에 대해서 자세하게 알아보도록 하자



참고사이트

- [JVM 메모리 구조란? (JAVA)](https://steady-coding.tistory.com/305){: class="underlineFill"}
- [[Java] JVM 메모리 구조](https://limkydev.tistory.com/51){: class="underlineFill"}