---
layout: post
title: "Deploying to Kubernetes"
subtitle: "GCP Study week 1"
date: 2019-08-06 18:00:00 +0900
categories: til
tags: gcp
comments: true
---


### week1 : Deploying to Kubernetes

<br>

##### 강의에 들어가기에 앞서 배포에 대한 여러 방식들을 알아보자

- 롤링 업데이트(rolling update)
  - 일반적인 배포를 의미
  - 단순하게 한 대씩 재시작, 
  - 코드 변경에 따른 side effect가 발생할 수 있다.
  - 하지만 롤백이 가능, 관리가 편하다는 점에서 많이 사용됨
  - 한 대만 배포해서 살펴볼 수도 있다.
- 블루-그린(Blue-Green)
  - 예전 배포물을 블루, 신규 배포물을 그린이라고 해서 붙여진 이름이다.
  - 새로운 배포물을 배포하고 모든 연결을 새로운 배포물만 보게한다.
  - 코드 변경에 따른 side effect가 없다.
  - 그러면 장애가 발생하면 크게 영향을 준다.
- 카나리(Canary)
  - 1대 또는 특정 user에게만 미리 배포했다가 잘되면 전체 배포하는 방식
  - 수정한 코드가 워낙 많이 바뀌어서 좀 불안할 때 사용하는 방식
  - 단순히 1대만 배포하는 경우도 있고, zookeeper/storage를 이용해 특정 user에게만 배포하는 형태를 가질 수 있다.
- A/B 테스트
  - 카나리 배포와 비슷하지만 A/B 테스팅만을 위한 것

<br>

#### 1. Deployments and Rolling Updates

- Deployment는 ReplicaSet에 의존하여 pod를 관리하고 실행한다
- Deployment를 통해 기본적으로 pod의 수와 상태가 동일한 방식으로 실행되고 YAML 파일 또는 구성 자체 내에 표시된 pod의 개수와 원하는 수의 상태가 실행되도록 pod 집합의 이름을 지정할 수 있다.
- Deployment는 ReplicaSets를 사용하여 지정된 수의 pod을 언제든지 관리하고 실행한다

![1](/img/in-post/gcp/week1_3/1.PNG)

- Deployment를 모니터링하면서 클러스터가 진행 중인지, 다른지, 어떤 정의가 내려지는지 봐보자, 그리고 뭔가 다른 게 있으면 deployment에서 바로 잡으려고 한다.
- 아래의 그림을 살펴보자, ReplicaSet, 4 replicas, selector, app-hello를 볼 수 있다.

![2](/img/in-post/gcp/week1_3/2.PNG)

- 예를들어 왼쪽에 있는 것 처럼 4개의 복제본을 만드는데, 3개의 복제본만 실행될것이다. deployment 객체와 그 사이의 차이는 API에 정의될 것이고,  클러스터에서 실행중인 것을 정의하고 수정하면 수정된다. 동일한 클러스터의 다른곳에서 다른 창을 실행해야한다.
- 3개의 pod이 있고, 그중 하나에 어떤 일이 생긴다면 unhealthy 해진다는 것을 기억해야 한다.
- 노드에 문제가 생겨 노드가 다운되고, 그것을 업그레이드하면 시스템에 의해 분해된다. 마지막으로 새로운 pod가 생성되어 원래 상태, 원래 세그먼트로 다른 곳에 다시 만들어질 것이다. 그렇게 해서 3개의 pod가 실행되게 된다.

- Rolling updates는 운영 중단 없이 한 이미지 버전을 세부적으로 업데이트하고 점진적으로 다른 버전의 이미지로 업데이트할 수 있다

![3](/img/in-post/gcp/week1_3/3.PNG)

- Deployment는 deployment를 충족하고 pod 템플릿과 일치하는 경우에만 실제로 롤아웃되고 트리거되고 그 후에 다음 버전이 변경된다.
- 예를 들어 라벨이나 컨테이너 이미지, 템플릿 및 업데이트를 수행하면 업데이트가 롤오버되고 배포가 확장됩니다. 그리고 롤아웃을 시작할 필요가 없으며 기본적으로 자체적으로 수행됩니다. 그래서 kubectl을 사용하여 명령을 내리고 이 변경 사항을 pod에 적용한다

![4](/img/in-post/gcp/week1_3/4.gif)

- 위 그림을 보면 두 버젼의 이미지들이 있는데, 한쪽에는 하나의 ReplicaSet이 있다. Deployment가 두번째 ReplicaSet을 만드려고한다. 첫번째 ReplicaSet에서 pod가 종료되면 두번째에서 동일한 작업을 계속 이어간다. 이 작업을 반복하면 완전시 해로운 버전의 어플리케이션이 출시되게 된다.
- 생산하는 동안 이 작업을 수행했고 모든 API가 요청 및 변경되었으며 이제 배포가 진행 중이다. 버전 1 대신 버전 2를 사용하며 서비스 중단이 없다 !!

<br>

#### 2. Canary and Blue-Green Deployments

- Canary 배포는 서비스를 사용하여 트래픽의 부하를 분산시킨다. 주로 라벨 선택기를 기반으로 한 pod로 레이블은 물건을 찾는 데 사용되었을뿐만 아니라 Kubernetes 내의 메커니즘에서도 사용된다.
- 





























참고사이트

- [김용환님 블로그](https://knight76.tistory.com/entry/배포-방식-카나리블루-그린롤링-업데이트-배포-방식){:}