---
layout: post
title: "# [Kotlin] Coroutine? Thread?"
subtitle: "Coroutine과 Thread 비교"
date: 2022-05-02 22:00:00 +0900
categories: til
tags: kotlin coroutine
comments: true


---



# [Kotlin] Coroutine? Thread?



단순히 Thread의 대안으로 Coroutine을 사용하는것으로 알고있었는데, 그게 아니였다. 좀 더 자세하게 알아보자



## Process 와 Thread

일단 Process와 Thread에 대해서 알아보자

- Process
    - 프로그램이 메모리상으로 적재되어 실행되는 인스턴스
- Thread
    - 프로세스 내 실행되는 여러 흐름 단위

![coroutine_thread_1.png](/img/in-post/coroutine_thread_1.png)

**Process** 는 독립된 메모리 영역인 **'힙'을 할당**받는다.

**Thread** 는 **Process 하위에 종속되는 보다 작은 단위**이고, 각 Thread**는 독립된 메모리 영역인 스택(Stack)** 을 갖는다. Thread 를 하나 생성하면, 하나의 스택 메모리가 생기는 것이다. 즉 Thread가 10개라면 전체 메모리에 10개의 스택이 생성된다. 각 Thread는 **다른 Thread에게 스택 메모리를 공유할 수 없다**. 하지만 Process의 **힙은 속한 모든 Thread 가 공유**할 수 있다



## Thread와 Coroutine

Thread와 Coroutine은 모두 `동시성 프로그래밍`을 위한 기술이다

먼저 동시성과 병렬성에 대해서 알아보자



### 동시성 (Concurrency)

시분할 기법을 사용해 여러 작업을 조금씩 나누어 번갈아가면서 시행한다

![coroutine_thread_2.png](/img/in-post/coroutine_thread_2.png)

Task1과 Task2를 수행하는데 걸리는 시간은 두 Task의 수행시간을 합친것과 같다 (ContextSwitching 비용 제외)



### 병렬성 (Parallelism)

여러 작업들이 동시에 수행되는것을 말한다

![coroutine_thread_3.png](/img/in-post/coroutine_thread_3.png)

Task 수 만큼 자원이 필요하며, Context Switching은 필요없다

총 실행시간은 여러 Task 중 가장 소요시간이 긴 Task만큼 소요된다

이제 본격적으로 Thread와 Coroutine에 대해서 알아보자



## Thread

Task의 단위 = Thread

여러개의 작업을 동시에 수행할 때 Thread는 각 작업에 해당하는 해당하는 메모리 영역을 할당하는데(**다수의 작업에 각각 Thread를 할당**), 여러 작업을 동시에 수행해야하기 때문에 OS 레벨에서 각 작업들을 얼만큼씩 분배하여 수행해야지 효율적일지 Preempting Scheduling(선점 스케줄링) 을 필요로 한다. A 작업 조금 B 작업 조금을 통해 최종적으로 A 작업과 B 작업 모두를 이뤄내는 것이다

각 Thread는 Stack 메모리 영역을 가지며 **JVM Stack** 영역을 가진다

OS Kernel에 의한 **Context Switching**을 통해 Concurrency를 보장하며, Blocking이 일어나게 된다

![coroutine_thread_4.png](/img/in-post/coroutine_thread_4.png)

**Thread A** 에서 **Task 1 을 수행**하다가 **Task 2 의 결과가 필요**할 때, 비동기적으로 **Thread B 를 호출**을 하게 된다. 이 때 **Thread A 는 블로킹**되고, **Thread B 로 Context Switching** 이 일어나 **Task 2** 를 수행한다. **Task 2 가 완료**되면, 다시 **Thread A 로 Context Switching** 이 일어나 결과값을 **Task 1** 에 반환한다

동시에 같이 수행할 **Task 3, Task 4** 는 각각 **Thread C 와 D** 에 **할당**되고, 총체적으로 봤을 때 커널 입장에서 **Preempting Scheduling** 을 통하여 **각 태스크를 얼만큼 수행할지, 혹은 무엇을 먼저 수행할지를 결정**하여 알맞게 **동시성을 보장**하게 되는 것이다



### Coroutine

Task의 단위 = Object(Coroutine)

Coroutine 은 Lightweight Thread 라고 불린다. 이 또한 작업을 효율적으로 분배하여 조금씩 수행하여 완수하는 Concurrency 를 목표로하지만 각 작업에 대해 Thread 를 할당하는 것이 아니라 작은 Object 만을 할당해주고 이 Object 들을 자유자재로 Switching함으로써 Switching 비용을 최대한 줄였다

Thread와는 달리 프로그래머의 코딩을 통해 Switching 시점을 마음대로 정할 수 있고 suspend(non-blocking)가 도입되었다

![coroutine_thread_5.png](/img/in-post/coroutine_thread_5.png)

작업 단위는 **Coroutine Object** 이므로, Task 1 을 수행하다가 비동기 작업 Task 2 가 발생하더라도, **Context Switching 없이** **같은 Thread 에서 Task 2 를 수행할 수 있고**, 맨 오른쪽 경우처럼 **하나의 Thread 에서 여러 Coroutine Object 들을 같이 수행**할 수도 있다. 한 Thread에서 다수의 Coroutine 을 수행할 수 있고, **Context Switching 이 필요없는 특성**에 따라 **Coroutine 을 Light-weight Thread 라고 부르는 것**이다

하지만 위 그림의 Thread A 와 C 가 동시에 수행되는 모습을 보면 **동시성 보장을 위해서 Context Switching 이 필요한 경우이**다. 따라서, **Coroutine 의 'No-Context Switching' 장점**을 위해, **단일 Thread 에서 여러 Coroutine Object 를 실행하는 것이 좋다**



### 결론

- Coroutine으로 작업의 단위를 Thread 가 아닌 Object 로 축소하면서 각 Thread마다 갖는 Stack 메모리 영역을 갖지 않기때문에, Thread 사용시 스레드 개수만큼 Stack 메모리에 따른 메모리 사용공간이 증가하지 않아도 된다.
- 같은 프로세스내에 공유 데이터 구조(Heap)에 대한 locking 걱정도 없다.
- **Coroutine 은 Thread 의 대안이 아니라 기존의 Thread 를 더 잘게 쪼개어 사용하기위한 개념이다**





### 참고사이트

- [Coroutine, Thread 와의 차이와 그 특징](https://aaronryu.github.io/2019/05/27/coroutine-and-thread/){: class="underlineFill"}

- [🤔 Thread vs Coroutine 전격 비교](https://velog.io/@haero_kim/Thread-vs-Coroutine-%EB%B9%84%EA%B5%90%ED%95%B4%EB%B3%B4%EA%B8%B0){: class="underlineFill"}
- [Difference between a "coroutine" and a "thread"?](https://stackoverflow.com/questions/1934715/difference-between-a-coroutine-and-a-thread){: class="underlineFill"}



