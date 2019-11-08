---
layout: post
title: "Getting Started with Google Kubernetes Engine - Coursera"
subtitle: "GCP Study week 1"
date: 2019-08-04 18:00:00 +0900
categories: til
tags: gcp
comments: true
---


### Week 1 : What are Containers?



##### 목적

- Docker에서 workflow를 컨테이너화해 Google Kubernetes Engine의 클러스터에 배포하고, 트래픽을 처리하도록 확장하는 방법을 배운다



##### Container에 대한 소개

- Kubernet 및 컨테이너 엔진을 사용하여 완전한 애플리케이션을 관리하기 전에 컨테이너가 어떻게 작동하는지, 그리고 컨테이너가 어떤 이점을 제공하는지 알아보자
- 각각 확장할 여러 시스템에서 실행되는 여러 소프트웨어 인스턴스 필요. 운영 체제, RAM, CPU, 디스크, 네트워킹 및 심지어 소프트웨어 종속성과 같이 적절하게 실행하고 확장하기 위한 자체 하드웨어 및 소프트웨어 요구 사항이 있을 수 있다. 이러한 요구 사항을 코드로 작성하는 대신 `컨테이너`라고 하는 구성 파일에서 코드 외부에 선언하여 관리를 용이하게 할 수 있다. 가상화된 운영 체제를 사용하여 컨테이너를 실행하고 격리하는 것이 중요한 이유를 설명한다. 이는 또한 개발, 스테이징 및 프로덕션과 같은 다양한 환경에서 애플리케이션의 지속적인 제공과 재구성을 위한 토대가 된다. 또한 응용프로그램이 더욱 정교해지면서 응용프로그램의 세부사항을 더 깊이 탐색할 수 있다.
- 예전엔 개별 bare-metal server에 응용 프로그램이 구축되었고, 대개 하드웨어를 설치해야 했고, OS나 커널을 설치해야 했고, 그 위에 설치했던 모든 의존성도 있었다. 그 후에 응용 프로그램 코드를 설치했다. 그 모든 것을 한 후에도, 대개 애플리케이션 의존성과 모든 것을 동기화시키는 것은 정말 어려웠었다. 

![1](/img/in-post/gcp/week1/container1.png)

- 그래서 VMware는 하드웨어를 *하이퍼바이징*할 수 있는 방법을 고안했다. 즉, 커널, 종속성 및 애플리케이션에서 하드웨어를 분리하는 방법을 고안했다. 그래서 그들은 하드웨어 하이퍼바이저 레이어를 개발했는데, 애플리케이션 자체를 분리하는 것이었습니다. 하드웨어 위의 모든 것들이 그것을 해방시켰고 그것은 하나의 추상적 수준이었다. 하지만 그때 문제가 있었는데, 문제는 동일한 애플리케이션이나 동일한 애플리케이션의 여러 버전을 단일 VM, 단일 가상 시스템에 설치할 수 없다는 것이다. 그렇게 하면 종속성 오류, 충돌 등이 생긴다. 그래서 가상 머신을 더 많이 만들었다. 
- 하지만 여러 개의 가상 머신을 가지고 있는 경우, 많은 가상 머신이 동일한 인스턴스 또는 동일한 버전의 애플리케이션을 실행하고 있지만, 그 이유는 종속성 때문에 가상 머신을 한 가상 머신에서 모두 실행할 수 없기 때문이다. 따라서 비용이 많이 들고, 비효율적이며, 하드웨어도 비효율적이었다. 

![2](/img/in-post/gcp/week1/container2.png)


- 마지막으로 지금 우리가 보는 것은 다른 수준의 추상화다. 아래에서 볼 수 있듯이 VM 및 하이퍼바이저와 분리한 다음 컨테이너의 커널과 컨테이너 런타임을 사용하여 모든 애플리케이션의 종속성과 완전히 분리했다. 이것의 좋은 점은, 이동성이 좋고, 매우 효율적이며, 그 내부는 커널이나 하드웨어 자체에 다시 의존하지 않는다는 것이다. 
- 개발자들은 왜 이런걸 좋아하는가? 
  - 우선 교차 테스트와 생산에 있어서 동시에 개발할 수 있었다. 
  - 또한 베어 메탈, 가상 시스템 또는 클라우드에서도 이 기능을 실행할 수 있다. 
  - 개발 속도, 신속한 개발 생성, 지속적인 통합과 제공에 걸쳐 패키지화 될 수 있다. 
  - 또한 우리 중 몇 명을 위해 단일 파일 복사본이나 단일 인스턴스 스토리지를 가질 수 있다. 
- 지난 2004년에는 애플리케이션이 제한적으로 분리되었지만 하이퍼바이저 기술이 무엇이든 모두 별도의 VM, 그룹 또는 개별 엔터티에서 실행되고 있다.
-  2006년에 구글은 일관성 그룹이라고 불리는 매우 매우 중요한 기술을 개발했다. 일관성 그룹은 기본적으로 이러한 애플리케이션을 관리하고 일관성을 유지하기 위해 컨테이너를 사용한다. 
- 2013년, Docker는 모든 사람들이 Docker를 사용하고 있으며,  Docker는 애플리케이션 또는 기본 OS 자체와 분리되는 계층을 제공한다. 그 위에 보이는 것은 컨테이너 층뿐이다. 

![3](/img/in-post/gcp/week1/container3.png)


- 아래 Docker그림은 Docker에 대한 설명이다. 런타임과 명령 자체에 대한 설명일 뿐이죠. 컨테이너들은 정말로 작은 공유된 이미지들을 촉진시킨다. 실제로 그들은 가장 큰 부분인 OS를 분리하고, 컨테이너와 실제 애플리케이션 자체에서 많은 의존성을 분리한다.

![1](/img/in-post/gcp/week1/docker1.png)




> 하이퍼바이저
>
> 하이퍼바이저는 호스트 컴퓨터에서 다수의 운영 체제를 동시에 실행하기 위한 논리적 플랫폼을 말한다. 가상화 머신 모니터 또는 가상화 머신 매니저라고도 부른다.



##### Docker에대한 소개

- Docker 이용률은 천정부지로 치솟았다. 2013년 경에 출시되었을 때 부터 일직선으로 쭉 치솟았다. 오늘날 시장에 대규모 채택이 되었다. Docker 이용률 자체가 1년 만에 40%에 육박했다. Container는 Docker 함께 아주 아주 큰 Container가 되어가고 있다. 

![2](/img/in-post/gcp/week1/docker2.png)


- 예를 들어, docker build -t py-web-server 를 봐보자. 기본적으로, 작은 도커 파일은 어플리케이션을 Docker 용기 안에서 실행하게 하고, 그 이미지들 중 일부를 스스로 끄집어내게 한다. 

![2](/img/in-post/gcp/week1/docker3.png)


- 내가 할 일은 레지스트리 자체에서 내 이미지를 `push`하거나 `pull` 하는 것이다. 예를 들어 레지스트리 표시, IP 표시 위치, 프로젝트 번호, 포트 번호 등 그걸 밀거나 레지스트리에서 가져온 다음 그 피 스크립트를 실행하여 용기의 도커를 가져올 수 있다. 
- 왜 Container는가 미래의 포장 형식인가? 
  - 효율적이고, 휴대할 수 있기 때문이다. 
  - 앱 엔진은 사용자 지정 런타임에 도커 컨테이너를 지원한다. Google 컨테이너 레지스트리는 CI 및 CD 통합 이미지를 포함한 많은 Docker 이미지를 호스팅하기 위한 레지스트리를 제공한다. 
  - 컴퓨팅 엔진은 Docker 컨테이너로 인스턴스 그룹을 관리하는 것을 포함하여 컨테이너를 지원한다. 
- Qwiklabs에서는 컨테이너를 소개한다. 간단한 웹 서버 및 웹 응용 프로그램을 자체 제공 도커 이미지로 구축, 실행 및 배포하는 방법을 배우게 된다. 컨테이너는 프로그램과 기본 OS를 분리하여 재구성 없이 시스템을 가로질러 이동할 수 있다는 점을 기억해라. 컨테이너는 낮은 수준의 운영 체제 구조를 사용하여 응용프로그램 주위에 쉘을 배치한다. 쉘을 사용하면 고유한 시스템 사용자, 호스트 이름, IP 주소, RAM 및 CPU 할당량 및 파일 시스템 세그먼트를 지정할 수 있다. 



### Qwiklabs 실습



### 컨테이너 및 Docker v1.6 소개



#### 개요

- 컨테이너를 사용하면 프로그램이나 프로세스를 서로 분리할 수 있다 
- 컨테이너의 주된 목적은 프로그램에 문제를 일으키지 않으면서도 배포를 간편하게 만드는 데 있다
- 컨테이너는 기반 기술에 친숙하지 않은 사용자도 쉽게 사용할 수 있다
- 이 실습에서는 애플리케이션을 Docker 이미지로 빌드, 실행, 배포하는 방법에 대해 알아보자

<br>

#### 설정

##### 1단계

- 실습시작 버튼을 클릭하기 전에 
- Qwiklabs 실습을 사용하면 시뮬레이션이나 데모 환경이 아닌 실제 클라우드 환경에서 실습 작업을 직접 해볼 수 있다. 실습 시간 동안 Google Cloud Platform에 로그인하고 액세스하는 데 사용할 새로운 임시 사용자 인증 정보가 제공된다.
- **참고 :** 이미 개인용 GCP 계정이나 프로젝트가 있어도 이 실습에서는 사용하면 안된다

##### 2단계

- 프로젝트에는 Ubuntu Xenial을 실행하는 VM이 사전에 프로비저닝되어 있으며, 필요한 도구가 미리 설치되어 있다. 연결하려면 다음을 수행한다.
- 탐색메뉴 아이콘 클릭 -> **컴퓨팅 > Compute Engine > VM 인스턴스**를 선택

```
인스턴스가 k8s-workshop-module-1-lab으로 목록에 표시된다
```

- 인스턴스 오른쪽에서 **SSH** 드롭다운 화살표를 클릭하고 **브라우저 창에서 열기**를 선택한다. 드롭다운을 보려면 오른쪽의 **정보 패널**을 숨겨야 할 수도 있다.

##### 3단계

- 인스턴스가 완전히 프로비저닝되었는지 확인합니다. 확인하려면 다음 명령어를 실행하고 `kickstart` 디렉터리를 찾습니다.

  ```
  ls /
  ```

<br>

#### 실습시작

### Docker로 컨테이너 실행 및 배포

- Docker를 사용하면 반복 가능한 실행 환경에서 애플리케이션을 컨테이너로 간편하게 패키징할 수 있다.

- Python으로 작성된 웹 서버가 포함된 간단한 Docker 컨테이너 이미지를 생성 및 실행하여 Docker를 탐색해보고, Docker 레지스트리에 업로드한 다음 Docker를 지원하는 곳 어디에서나 실행될 수 있도록 모두와 공유해보자

- 이 실습에서는 다음을 수행하는 방법에 대해 알아보자
  - Docker 이미지 빌드하기
  - Docker 이미지를 Google Cloud 레지스트리에 푸시
  - Docker 컨테이너 실행

<br>

##### 웹 서버를 수동으로 실행하기

- 단순한 웹 서버를 설치하고 실행하는 경우에도 배포를 위해서는 `apt`, `pypi`(Python) 등의 종속 항목이 있어야 한다. 종속 항목의 버전은 자주 변경되므로, 설치 시점에 종속 항목의 최신 버전을 가져오는 과정을 자동화하는 것이 좋다.

- 단계를 확인하려면 웹 서버를 수동으로 실행하세요. 나중에는 과정을 자동화하여 다른 머신에서 실행할 수 있다.

<br>

##### 1단계

- `/kickstart` 폴더에서 실습 소스코드를 확인. 해당 디렉토리로 이동
- 그 다음 콘텐츠 목록을 표시

```
cd /kickstart
ls -lh
```

- `Dockerfile` 및 `web-server.py`가 있어야 한다. web-server.py는 localhost:8888에서 HTTP 요청에 응답하고 호스트 이름을 출력하는 웹 서버를 실행하는 단순한 Python 애플리케이션입니다.

![1](/img/in-post/gcp/week1/qwiklap1.png)


##### 2단계

- 종속 항목 설치

- Python 및 PIP의 최신 버전을 설치

  ```
  sudo apt-get install -y python3 python3-pip
  ```

- 애플리케이션에 필요한 Tornado 라이브러리를 설치

  ```
  pip install tornado
  ```

##### 3단계

- 백그라운드에서 Python 애플리케이션을 실행

  ```
  python3 web-server.py & 
  ```

##### 4단계

- 웹 서버에 액세스할 수 있는지 확인

  ```
  curl http://localhost:8888
  ```

##### 5단계

- 응답 확인

`Homename: k8s-workshop-module-1-lab`

- 웹 서버 종료

```
kill %1
```

![2](/img/in-post/gcp/week1/qwiklap2.png)


<br>

#### Docker를 사용하여 패키징

- 이제 Docker를 어떻게 사용하는지 알아보자. 
- Docker 이미지는 Dockerfile로 설정되며, Docker는 이미지를 스태킹할 수 있게 해준다. 
- Docker 이미지는 Python이 사전 설치되어 있는 기존 Docker 이미지 라이브러리/Python를 기반으로 생성된다.

<br>

##### 1단계

- Dockerfile을 확인

```
cat Dockerfile
```

![3](/img/in-post/gcp/week1/qwiklap3.png)

##### 2단계

- 웹 서버가 포함된 Docker 이미지를 빌드
  - 이미지는 로컬 이미지 스토어에 저장

```
sudo docker build -t py-web-server:v1 .
```

- 명령어 끝에 '.'를 포함해야한다. 이렇게 해야 현재 작업 디렉터리에 이미지를 저장하라고 Docker에 지시하게 된다.

![4](/img/in-post/gcp/week1/qwiklap4.png)


##### 3단계

- Docker를 사용하여 웹 서버를 실행

  ```
  sudo docker run -d -p 8888:8888 --name py-web-server -h my-web-server py-web-server:v1
  ```

![5](/img/in-post/gcp/week1/qwiklap5.png)


##### 4단계

- 웹 서버에 다시 액세스해본 다음 컨테이너를 중지한다

  ```
  curl http://localhost:8888
  sudo docker rm -f py-web-server
  ```

- `python` 및 `tornado` 라이브러리를 비롯한 모든 종속 항목과 웹 서버가 하나의 Docker 이미지로 패키징되어 모두와 공유할 수 있게 되었다. 
- `py-web-server:v1` Docker 이미지는 모든 Docker 지원 OS(OS X, Windows, Linux)에서 동일한 방식으로 작동한다.

![6](/img/in-post/gcp/week1/qwiklap6.png)


<br>

#### 이미지를 레지스트리에 업로드

- Docker 이미지는 Docker 레지스트리에 업로드해야 다른 머신에서 사용할 수 있다. 
- Docker 이미지를 Google Cloud 레지스트리(gcr.io)의 비공개 이미지 저장소에 업로드한다.

<br>

##### 1단계

- `sudo` 없이 Docker 명령어를 실행할 수 있도록, Docker 그룹에 로그인된 사용자를 추가하고 Container Registry 사용자 인증 정보 도우미를 사용하여 이미지를 인증된 사용자로서 저장소에 푸시한다.

```
sudo usermod -aG docker $USER
```

##### 2단계

- 그룹 변경사항이 적용되도록 `SSH` 세션을 다시 시작하고 `kickstart` 디렉터리로 돌아온다.

  ```
  cd /kickstart
  ```

##### 3단계

- GCP 프로젝트 이름을 환경 변수에 저장

  ```
  export GCP_PROJECT=`gcloud config list core/project --format='value(core.project)'`
  ```

##### 4단계

- `gcr.io`를 호스트 이름으로, 프로젝트 ID를 프리픽스로 포함하는 레지스트리 이름으로 Docker 이미지를 다시 빌드

  ```
  docker build -t "gcr.io/${GCP_PROJECT}/py-web-server:v1" .
  ```

- 여기에서도 명령어 끝에 '.'를 포함해야 한다. 이렇게 해야 현재 작업 디렉터리에 이미지를 저장하라고 Docker에 지시하게 됨.

> 여기서 ${GCP_PROJECT}에 내가 부여받은 PROEJCT ID를 넣는 줄 알고 헛짓거리를 많이했다...
>
> 위에서 GCP 프로젝트 이름을 환경 변수에 저장했기 때문에 그 이름을 ${GCP_PROJECT}로 가져온다 !!

![7](/img/in-post/gcp/week1/qwiklap7.png)


<br>

#### 공개적으로 액세스 할 수 있도록 이미지 설정

- Google Container Registry는 Google Cloud Storage에 이미지를 저장한다

<br>

##### 1단계

- gcloud를 Container Registry 사용자 인증 정보 도우미로 사용하도록 Docker를 구성(이 작업은 한 번만 수행하면 됨).

  ```
  PATH=/usr/lib/google-cloud-sdk/bin:$PATH
  gcloud auth configure-docker
  ```

- 메시지가 표시되면 **ENTER** 키를 누른다

![8](/img/in-post/gcp/week1/qwiklap8.png)


##### 2단계

- 이미지를 `gcr.io`에 푸시합니다.

  ```
  docker push gcr.io/${GCP_PROJECT}/py-web-server:v1
  ```

![9](/img/in-post/gcp/week1/qwiklap9.png)


##### 3단계

- Google Cloud Storage 저장소에 버킷(객체)으로 저장된 이미지를 보려면 **탐색 메뉴** 아이콘을 클릭하고 **스토리지**를 선택
- 그러면 다음과 같은 이미지가 표시된다

![10](/img/in-post/gcp/week1/qwiklap10.png)

##### 4단계

- 공개적으로 액세스할 수 있도록 이미지 저장소를 설정하려면 Google Cloud Storage에서 권한을 업데이트

```
gsutil defacl ch -u AllUsers:R gs://artifacts.${GCP_PROJECT}.appspot.com
```

```
gsutil acl ch -r -u AllUsers:R gs://artifacts.${GCP_PROJECT}.appspot.com
```

```
gsutil acl ch -u AllUsers:R gs://artifacts.${GCP_PROJECT}.appspot.com
```

- 그러면 GCP 프로젝트에 대한 액세스 권한을 보유한 모두가 이미지를 사용할 수 있게 된다

![11](/img/in-post/gcp/week1/qwiklap11.png)


<br>

#### 원하는 머신에서 웹 서버 실행

- 이제 다음 명령어를 실행하여 Docker를 설치한 모든 머신에서 Docker 이미지를 실행할 수 있다

```
docker run -d -p 8888:8888 -h my-web-server gcr.io/${GCP_PROJECT}/py-web-server:v1
```

- VM 인스턴스에서 이를 테스트할 수 있다(위의 `curl` 명령어를 다시 사용).

- 실습 종료

```
exit
```

- 지금까지 레지스트리에서 Docker 컨테이너를 빌드, 실행 및 공유하는 방법에 대해 알아보았다


Copyright 2019 Google LLC All rights reserved. 



#### Container and Docker Quiz

- 1개틀림...




