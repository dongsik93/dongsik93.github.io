---
layout: post
title: "Non-blocking과 Asynchronous"
subtitle: "비동기, 동시성, 병렬성"
date: 2019-12-04 23:50:00 +0900
categories: til
tags: tech
comments: true
---

## Non-blocking과 Asynchronous

> **비동기**에대한 개념과 이와 유사하거나, 다른 개념들을 정리해보는 글

### Non-blocking

- 어떤 쓰레드에서 오류가 발생하거나 멈추었을 때 다른 쓰레드에 영향을 끼치지 않도록 만드는 방법들을 말한다

- 공유자원(메모리나 파일 등)을 사용하는 멀티 쓰레드 프로그래밍을 할 때, 특정 공유자원을 사용하는 부분에서 상호배제나 세마포어 등을 사용하여 여러 쓰레드에서 동시에 접근하지 못하도록 하는 전통적인 방법과 달리 **Non-blocking algorithm**을 사용하면 공유자원을 안전하게 동시에 사용할 수 있다.

  > **상호배제(Mutual exclusion)**
  >
  > 동시 프로그래밍에서 공유 불가능한 자원의 동시 사용을 피하기 위해 사용되는 알고리즘으로, 임계 구역(critical section)으로 불리는 코드 영역에 의해 구현된다
  >
  > **세마포어**
  >
  > 멀티프로그래밍 환경에서 공유 자원에 대한 접근을 제한하는 방법으로 사용된다

#### Non-blocking algorithm

- Wait-freedom, Lock-freedom

#### Non-blocking I/O

- 입출력 처리는 시작만 해둔 채 완료되지 않은 상태에서 다른 처리 작업을 계속 진행할 수 있도록 멈추지 않고 입출력 처리를 기다리는 방법

<br>

### Asynchronous Programming(비동기 프로그래밍)

- 프로그램의 주 실행흐름을 멈추어서 기다리는 부분없이 즉시 다음 작업을 수행할 수 있도록 만드는 프로그래밍 방식
  - Python의 코루틴(Coroutine)과 같은 **언어의 문법을 이용**하는 방식
  - promise와 같은 **객체 형태의 결과를 요청 즉시 돌려받는** 방식

<br>

### Concurrency(동시성)과 Parallelism(병렬성)

#### Concurrency란

- 각 프로그램 조각들이 실행 순서와 무관하게 동작할 수 있도록 만들어 한 번에 여러 개의 작업을 처리할 수 있도록 만든 구조
- 하나의 작업자가 여러 개의 작업을 번갈아가며 수행할 수 있도록 만드는 것

#### Parallelism란

- 많은 작업을 물리적으로 동시에 수행하는 것으로써, 작업자를 물리적으로 여럿 둠으로써 같은 작업을 동시에 수행할 수 있도록 만드는 것

#### Concurrency와 Parallelism 구분하기

- `Parallelism`은 한 개의 프로세서에서는 확보할 수 없는 개념
  - 한 개의 프로세서가 같은 시간에 두 개의 작업을 수행하는 것은 물리적으로 불가능하기 때문
- 반면 `Concurrency`는 한 개의 프로세서만 있다고 하더라도 확보할 수 있다
  - 잘 쪼갠 작업들이 서로 영향을 끼치지 않는다면,, 하나의 작업자가 각 작업이 완료되지 않았더라고 번갈아가며 수행하는 것이 가능하다
- `Concurrency`는 작업을 처리하는 방식을 개선함으로써 효율화를 가져오는 것이 목적
- `Parallelism`은 자원 자체를 늘림으로써 작업의 처리량을 늘리는것이 목적
- **따라서** Concurrency와 Parallelism을 동시에 확보함으로서 시너지 효과를 가져올 수 있으나, 각각은 서로 의존성이 없다고 볼 수 있다

<br>

참고사이트

- [Peoplefund Tech - 멈추지 않고 기다리기(Non-blocking)와 비동기(Asynchronous) 그리고 동시성(Concurrency)](https://tech.peoplefund.co.kr/2017/08/02/non-blocking-asynchronous-concurrency.html){: class="underlineFill"}

