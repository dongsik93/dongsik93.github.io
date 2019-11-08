---
layout: post
title: "Getting Started with Google Kubernetes Engine - Coursera"
subtitle: "GCP Study week 1"
date: 2019-08-05 18:00:00 +0900
categories: til
tags: gcp
comments: true
---

### Week 1 : Kubernetes Basics 



#### Kubernetes Basics  

#### 1. Cluser, Nodes, and Pods

<br>

- 왼쪽에 사용자가 있고 마스터 클러스터 서버가 있고 Kubernetes와 실제로 작동하는 방식, 도커와 컨테이너, 클러스터 환경에 있다.
- 그리고 이 모든 노드가 큐브를 실행하고 있다. Kubelet은 Kubernetes 그 자체다. 
- 마스터는, 모든 일을 통제하고, 스케줄을 조정하며, 기타 여러가지를 통제하고, 그 자체를 통제한다. 
- Kubernetes은 컨테이너 환경을 위한 오픈 소스 또는 **_orchestrator_**이다

> orchestration
>
> 컴퓨터 시스템 및 소프트웨어의 자동화 된 구성, 조정 및 관리

![1](/img/in-post/gcp/week1_2/1.PNG)

- 그렇다면 진짜 무엇을 하는거냐, 개발자들에게 무엇을 제공하는건가?
- 개발자들은 API에 대한 접근에만 신경을 쓴다. 
- Kubernetes와 컨테이너는 개발자들이 프로그래밍할 수 있도록 open API에 접근할 수 있게 해준다.
- Cluster는 이 모든 노드를 관리하는 인스턴스로 작동하는 컴퓨터의 집합 이다.
- 모든 것은 다시 orchestrator인 Kubernetes에 의해 관리된다. 그리고 정말로 문제의 핵심에 도달하면, Kubernetes는 일들을 관리한다. 
- 이러한 작업을 여러 노드에 위임하는 방법을 알고 있으며 이는 실제 쿠버넷 생태계의 더 좋은 예 이다.

![2](/img/in-post/gcp/week1_2/2.PNG)

- 보통 1개, 2개, 3개의 노드가 아니라 수천 개의 노드와 다수의 마스터이다. 
- 그러나 이 시스템의 전체적인 장점은, 어떻게 하면 자원이 무료인 이러한 노드에 작업을 할당할지, 아니면 자원이 많은 노드에서 작업을 제거하는지를 알고 있다는 것이다.

![3](/img/in-post/gcp/week1_2/3.PNG)

- pod는 노드 자체에서 분리된 네트워크 및 스토리지를 공유하는 컨테이너 그룹에서 VM과 유사하다. 
- 그 밑에는 OS, 하드웨어, NIC, 외부 IP, pod 내부, 실제 컨테이너, 컨테이너 네트워크 인터페이스가 있다.

![4](/img/in-post/gcp/week1_2/4.PNG)

- pod를 YAML 파일로 정의하기
  - pod는 여러개의 부분으로 나누어져 있다.

```
apiVersion : v1   				## API version
kind: Pod         				## pod resource
metadata:
	name: my-app  				## pod name
spec:
	containers:   				## two containers
	- name: my-app
	  image: my-app
	- name: nginx-ssl
	  image: nginx
	  ports:      				## nginx front end on two ports
	  - containerPort: 80
	  - containerPort: 443
```

- 마스터 클러스터 서버에 YAML 파일을 업로드한 다음 YAML 파일 내에서 전용 노드에 pod를 생성
- 만약 어떤 일이 생기면, 만약 어떤 팟이 고장나면, Kubernetes는 다른 pod을 회전시켜 그것을 대체할 수 있는 능력을 가지고 있다.

![5](/img/in-post/gcp/week1_2/5.PNG)

- 또한 YAML 파일에서 원하는 복제본의 개수를 정의할 수 있다. 
- 당신은 pod, rolls, labels을 구별할 수 있고 labels이 중요하다. 
- 컨테이너는 pod과 같다.

```
kind: `Deployment`						## deployment resource
apiVersion: v1.1				
metadata:
	name: frontend						## deployment name
spec:
	`replicas: 4						## replicas
	selector:							## pod selector
		role: web`							role = web
	template:
		metadata:
			name: web
			labels:						## pod label
				role: web					role = web
		spec:
			`containers:`				## pods
			- name: my-app
			  image: my-app
			- name: nginx-ssl
			  image: nginx
			  ports:
			  - containerPort: 80
			  - containerPort: 443
```

- 다시 새로운 YAML 파일을 업로드하고 마스터를 업로드하면 마스터는 스케줄을 잡고 결정한다. 
- `명심` 마스터가 Kubernetes를 운영하고 있다는 걸 잊지말자.
- 언제 그들이 운영될 지 결정하는 것은 이 일들과 이 과제들이다. 따라서 마스터에 따라 스케줄링하고 워크로드에 따라 스케줄링하며, CPU 활용도를 비롯한 기타 모든 작업을 수행한다

<br>

#### Kubernetes Basics 

#### 2. Service, Labels, and Selectors

  <br>

- service는 당신의 pod에 고정된 IP에 할당되고, 그 다음 그것은 복제되고 다른 pod과 다른 서비스들이 그들과 통신할 수 있게 해준다. 
- service는 pod사이의 통신 방법처럼 행동한다.
- 첫째, 클러스터는 IP(내부 IP)를 가지고 있으며,  포트 노드 또한 그 IP에 대한 액세스를 가지고 있다. 또한 노드 자체에 들어오는 트래픽을 검색하기 위한 경계로 로드 밸런서를 사용한다. 
- 다양한 구성과 기능을 실행하는 여러 서비스가 있을 것이다. 일반적으로 front-end는 웹 서버, 애플리케이션 서버, 어떤 종류의 서버, back-end는 대개 노드 및 데이터베이스 서버일 수 있다.
-  일반적으로 로드 밸런싱 장치인 Google Cloud 로드 밸런서로 실행되며, 이를 통해 사용하는 GCP API를 자세히 확인할 수 있다.  

![6](/img/in-post/gcp/week1_2/6.PNG)

- 다시 YAML 파일 정의에서 살펴보자

```
kind: `Service`							## resource
apiVersion: v1
metadata:
	name: web-frontend
spec:
	`ports:`							## ports
	- name: http
	  port: 80
	  targetPort: 80
	  protocol: TCP
	`selector:`							## pod selector
		role: web
	type: `LoadBalancer`				## type is loadbalancer
```

- YAML 파일의 정의는 리소스, 사용할 pod, pod selector, 여기에 적용할 로드 밸런서의 유형을 알려준다.

- Labels은 모든 API 개체에 할당하고 ID를 나타낼 수 있는 메타데이터이다. 
- Labels은 그룹화, 메커니즘화, 검색에 사용되지만 그것뿐만 아니라 필터링, 무언가를 찾기 위해 사용된다. pod는 환경에 있는 많은 컨테이너에 있을 수 있는 많은 엔티티와 컨테이너를 포함할 수 있다. 
- 논리적으로 label을 붙임으로써, 그것들을 신속하게 식별하기 위해 pod 내부의 메커니즘에 따라 그들을 빠르게 찾을 수 있을 것이다.

- 아래의 그림을 살펴보자.

![7](/img/in-post/gcp/week1_2/7.PNG)

- 그림은 4개의 pods, 3개의 labels를 나타낸다.
- MyApp에 Phase와 Role이 각각 다른 label이 달려있다. 이와같은 방법처럼,  9,000개의 컨테이너에서 뭔가를 찾아야 할 때, label을 붙이는 것이 매우 편리할 것이다.
- 그리고 전체 어플리케이션을 그 label 자체에 매핑하는 데 사용할 수도 있다. 그래서 앱 label은 내 모든 어플리케이션과 같기 때문에 모든 애플리케이션을 다시 그룹화할 수 있는 쉬운 방법이다.
- 검색 범위를 좁히거나. 천 개의 컨테이너의 건초더미에서 바늘을 찾으려고 하는 것은 매우 어려운 일일 수 있다. 하지만 태그와 label로, 그것은 매우 쉽게 만들어질 수 있다. 
- back-end 서비스에도 비슷한 label을 적용할 수 있을 것이다. 이것은 정말 예시일 뿐이고 Kubernetes를 관리하는 논리적인 방법이다.
- Kubernetes는 또한 당신의 pod가 살아있는지 건강한지 체크한다. 만약 그것이 부정적인 반응을 얻거나, 혹은 대답이 없다면, 그것은 나쁜상태이다. 
- Kubernetes는 이미 건강하지 못한 환경이 조성되어 있다. Kubernetes는 다시 시작해야 할 경우 자동으로 다시 시작한다. 그리고 모든 것이 좋은 상태이면 다시 건강한 상태로 돌아간다. 

<br>

#### Kubernetes Basics

#### 3. Volumes

<br>

- Docker는 컨테이너를 위한 데이터 스토리지를 제공한다. 데이터를 어딘가에 보관해야 하고, 저장장치가 있어야 한다. 그러나 Volume은 모든 컨테이너 간에 공유되거나 라이프사이클 관리도 제공하지 않는다. 굉장히 중요하지만 데이터의 라이프사이클 관리는 요즘 우리 모두가 이야기하는 중요한 주제다. 
- 어쨌든, 이제 Docker들은 volume 조절을 할 수 있게 됐다.

![8](/img/in-post/gcp/week1_2/8.PNG)

- Kubernetes은 pod의 컨테이너가 데이터를 공유하고 상태도 유지할 수 있게 해줬다.
- Volume은 단지 디렉토리일 뿐이다. 그리고 그것이 어떻게 만들어지는가는 종류에 달려있다. 여기 한 예가 있다(Kubectl). 
- Kubernetes 라인에서 그걸 실행하면 volume을 만들 수 있다. 여기 그 데이터를 소비하는 볼륨을 생성하는 또 다른 것이 있다. 그래서 다시 Kubectl은 -f pod을 생성한다. -f pod은 YAML 설명에 따라 생성되는 YAML 파일이다. 용량은 pod에 부착되어 있으며, 온라인으로 가져오기 전에 컨테이너에 사용할 수 있게 되어 있다. 컨테이너가 온라인 상태가 되기 전에 저장소를 가지고 있는 것이다. 
- 일단 volume이 첨부되고, 여기서 유닉스 등가물 volume인 mnt/vol을 볼 수 있다면, 데이터를 컨테이너 파일 시스템에 탑재할 수 있다. 그러면 컨테이너가 실행되고, 그 volume자체에서 탑재된 데이터를 얻을 수 있다. 
![9](/img/in-post/gcp/week1_2/9.PNG)



- 그리고 어떤 volume들은 공유할 수 있다. 다시 말해서 그들은 그 pod이 있는 한 그 주변에 머무를 것이다. 
- 여기에 클러스터에 대한 전체 개요가 있다. 

![10](/img/in-post/gcp/week1_2/10.PNG)

- Kubectl이 있고, 왼쪽의 파란 남자에 앉아있는 사람이 블루맨 그룹 이라고 하자. 어플리케이션이 2개가 있고, 앱서버는 뭐든지 될수 있다.  웹 서버일 수도 있다.그리고 위에 네트워킹 서비스가 있고, 오른쪽을 향해 가면, 안에 있는 다른 노드들을 볼 수 있을 겁니다. 한 노드 안에 두 개의 다른 응용 프로그램인 녹색과 노란색을 실행하는 kubelet이 있는 pod가 있을 것이다. 
- 이게 바로 Kubernetes의 장점인 같은 일을 반복해서 반복하는 것이다. 
- 또한 백업으로 pod을 실행하지 않고, 대기 상태가 되거나, 필요할 경우 그냥 거기에 매달려 있는 노드를 가질 수 있다. 
- 그리고 하나의 노드에서 실행되는 아래쪽에 있는 것과 같은 pod을 가질 수 있다. 그래서 여러 개가 될 수도 있고 아니면 그 문제에 대해서 하나가 될 수도 있다. 결국 데이터 스토리지 서비스를 얻게 되는 것이다.
- 이제 구글 컨테이너 엔진과 Kubernetes을 사용하여 샘플 애플리케이션을 배포, 관리 및 업데이트해야 한다. 그것은 12-Factor app이라고 불리는 현대적인 웹 기반의 어플리케이션이다. 그것은 컨테이너를 사용하여 만든 것에 적합하다. 사용자 인증, 백엔드 데이터 검색 및 웹 프런트엔드를 위한 모듈을 포함한다. 그것은 인증과 인사 서비스, 두 개의 마이크로 서비스, 그리고 한 개의 Nginx 웹 프런트엔드를 포함하는 몇 개의 도커 이미지를 기반으로 한다. pod, service, volume 등의 리소스를 프로비저닝하고 이를 마이크로 서비스로 분할하여 확장 및 테스트하는 것이다.
- 

### Qwiklabs 실습



### Kubernetes v1.6 기본사항



#### 개요

- [Google Kubernetes Engine](https://cloud.google.com/container-engine){: class="underlineFill"}을 사용하여 [Kubernetes](http://kubernetes.io/){: class="underlineFill"} 프로비저닝
- `kubectl`을 사용하여 Docker 컨테이너 배포 및 관리
- Kubernetes 배포 및 서비스를 통해 애플리케이션을 마이크로서비스로 분할

- Kubernetes Engine과 Kubernetes API를 사용하여 애플리케이션을 배포, 관리 및 업그레이드할 수 있다.

```
App은 GitHub에 호스팅된다. 이는 12개 요소로 구성된 애플리케이션으로, 다음과 같은 Docker 이미지를 포함하고 있다.

- Monolith: auth 및 hello 서비스를 포함하고 있습니다.
- Auth 마이크로서비스: 인증된 사용자를 위한 JWT 토큰을 생성합니다.
- Hello 마이크로서비스: 인증된 사용자에 응답합니다.
- ngnix: auth 및 hello 서비스의 프런트엔드입니다.
```

<br>

#### 설정

##### 1단계

- 제공되는 계정을 사용할 것

##### 2단계

- 다음 API가 Cloud Platform Console에서 사용 설정되어 있는지 확인
  - Kubernetes Engine API
  - Container Registry API

```
탐색 -> API 및 서비스 
- API가 누락된 경우 상단의 API 및 서비스 사용 설정을 클릭하고, API를 이름으로 검색하여 해당 프로젝트에서 사용하도록 설정
```

##### 3단계

- Google Cloud Shell 활성화하기

```
Google Cloud Shell은 다양한 개발용 도구를 포함한 가상 머신으로, 5GB의 영구 홈 디렉토리를 제공하며 Google Cloud에서 실행된다. Google Cloud Shell을 사용하면 명령줄을 통해 GCP 리소스에 액세스할 수 있다.
```

- GCP 콘솔의 오른쪽 상단 툴바에서 'Cloud Shell 실행' 버튼을 클릭
- 그런 다음 열리는 대화상자에서 **Cloud Shell 시작**을 클릭
  - 대화상자가 열리면 바로 'Cloud Shell 시작'을 클릭할 수 있다.
  - **gcloud**는 Google Cloud Platform의 명령줄 도구
  - Cloud Shell에 사전 설치되어 있으며 탭 자동 완성을 지원

![1](/img/in-post/gcp/week1_2/qwiklap1.png)


- Git 저장소에서 샘플 코드를 가져온다

  ```bash
  git clone https://github.com/googlecodelabs/orchestrate-with-kubernetes.git
  ```

- 앱 레이아웃을 검토

  ```
  cd orchestrate-with-kubernetes/kubernetes
  
  ls
  ```

<br>

#### 간단한 Kubernetes 데모

##### Kubernetes 클러스터 시작하기

##### 1단계

- 영역을 프로젝트 기본 영역으로 정의한다. 이렇게 하면 gcloud 명령어에 --zone 매개변수를 지정하지 않아도 된다.

```
gcloud config set compute/zone us-central1-a
```

- Cloud Shell에서 다음 명령어를 실행하여 5개의 노드를 실행하는 `bootcamp`라는 Kubernetes 클러스터를 시작

```bash
gcloud container clusters create bootcamp --num-nodes 5 --scopes "https://www.googleapis.com/auth/projecthosting,storage-rw"
```

- `scopes` 인수는 나중에 사용할 프로젝트 호스팅 및 Google Cloud Storage API에 대한 액세스 권한을 제공
- Kubernetes Engine에서 자동으로 가상 머신을 프로비저닝하므로 클러스터를 생성하는 데 몇 분의 시간이 걸리며, 이때 하나 이상의 마스터 노드와 복수의 구성된 워커 노드가 가동된다. 이러한 점이 관리형 서비스의 장점이라고 할 수 있다.

##### 2단계

- 클러스터가 생성되면 `kubectl version` 명령어를 사용하여 Kubernetes의 설치 버전을 확인

```bash
kubectl version
`gcloud container clusters create` 명령어를 사용하면 kubectl이 자동으로 인증된다
```

![2](/img/in-post/gcp/week1_2/qwiklap2.png)


##### 3단계

- `kubectl cluster-info`를 사용하여 클러스터에 관해 자세히 알아보자

```bash
kubectl cluster-info
```

![3](/img/in-post/gcp/week1_2/qwiklap3.png)


##### 4단계

- Cloud Platform Console에서 실행 중인 노드를 확인

- **탐색 메뉴**를 열고 **Compute Engine > VM 인스턴스**로 이동

<br>

#### Bash 완성

- Kubernetes에는 자동 완성 기능이 기본으로 포함되어 있다. [kubectl completion](https://kubernetes.io/docs/user-guide/kubectl/kubectl_completion/){: class="underlineFill"} 명령어와 내장된 `source` 명령어를 사용하면 이 기능을 설정할 수 있다

##### 1단계

```bash
source <(kubectl completion bash)
```

##### 2단계

- 테스트 해보기

```bash
kubectl <TAB><TAB>
```

![4](/img/in-post/gcp/week1_2/qwiklap4.png)


<br>

#### 컨테이너 실행 및 배포

- Kubernetes를 시작하는 가장 쉬운 방법은 `kubectl run` 명령어를 사용하는 것이다

##### 1단계

- `kubectl run`을 사용하여 nginx 컨테이너의 인스턴스 하나를 실행한다

```bash
kubectl run nginx --image=nginx:1.10.0
```

- Kubernetes에서 모든 컨테이너는 pod에서 실행된다. 이 명령어를 통해 Kubernetes는 백그라운드에서 `deployment`를 생성하며, nginx 컨테이너가 포함된 단일 pod를 실행한다. pod가 실행되는 노드에 문제가 발생하더라도 배포에서는 주어진 수의 pod를 가동 상태로 유지한다. 여기에서는 기본 pod 수인 1개의 pod를 실행한다

![5](/img/in-post/gcp/week1_2/qwiklap5.png)


##### 2단계

- `kubectl get pods` 명령어를 사용하여 nginx 컨테이너가 실행되고 있는 pod를 확인

```bash
kubectl get pods
```

![6](/img/in-post/gcp/week1_2/qwiklap6.png)


##### 3단계

- `kubectl expose` 명령어를 사용하여 nginx 컨테이너를 Kubernetes 외부에 노출시킨다.

```bash
kubectl expose deployment nginx --port 80 --type LoadBalancer
```

- Kubernetes는 `service`와 공개 IP 주소가 연결된 외부 부하 분산기를 생성한다.
-  서비스 수명 동안 IP 주소가 동일하게 유지되는데, 이 공개 IP 주소에 접속하는 모든 클라이언트(예: 최종 사용자 또는 다른 컨테이너)는 서비스 백그라운드에 있는 pod로 라우팅. 여기에서는 nginx pod로 라우팅됨

##### 4단계

- `kubectl get` 명령어를 사용하여 새 서비스를 확인합니다.

  ```
  kubectl get services
  ```

- 서비스에 사용할 `ExternalIP` 필드 값이 채워지는 데 몇 초 정도 걸릴 수 있음. 이는 정상적인 동작으로, 필드가 채워질 때까지 몇 초마다 `kubectl get services` 명령어를 다시 실행하면 됨

![7](/img/in-post/gcp/week1_2/qwiklap7.png)


##### 5단계

- `kubectl scale` 명령어를 사용하여 서비스에서 실행되고 있는 백엔드 애플리케이션(*pod*)의 수를 늘립니다.

  ```bash
  kubectl scale deployment nginx --replicas 3
  ```

- 이는 `트래픽`이 증가하는 웹 애플리케이션의 `작업 부하`를 늘리고 싶을 때 유용하다 !!

![8](/img/in-post/gcp/week1_2/qwiklap8.png)


##### 6단계

- pod를 한 번 더 가져와서 Kubernetes에서 pod 수를 업데이트했는지 확인합니다.

  ```bash
  kubectl get pods
  ```

![9](/img/in-post/gcp/week1_2/qwiklap9.png)


##### 7단계

- `kubectl get services` 명령어를 다시 사용하여 외부 IP 주소가 변경되지 않았는지 확인합니다.

  ```bash
  kubectl get services
  ```

![10](/img/in-post/gcp/week1_2/qwiklap10.png)


##### 8단계

- `curl` 명령어에 외부 IP 주소를 사용하여 데모 애플리케이션을 테스트합니다.

  ```bash
  curl http://<External IP>:80
  ```

- Kubernetes에서는 `kubectl run`, `expose` 및 `scale` 명령어를 통해 바로 사용할 수 있는 간편한 워크플로를 지원한다

<br>

#### 삭제

- 다음 명령어를 실행하여 nginx를 삭제

```bash
kubectl delete deployment nginx
```

```bash
kubectl delete service nginx
```

![11](/img/in-post/gcp/week1_2/qwiklap11.png)


<br>

### Pod

- pod에 대해 자세히 알아보기

<br>

#### pod 만들기

##### 1단계

- `kubectl explain` 명령어를 사용하여 내장 pod 문서를 살펴보자

```bash
kubectl explain pods
```

- `kubectl explain`은 Kubernetes API를 살펴보는 동안 가장 자주 사용하게 될 명령어 중 하나이다. 위에서 API 객체를 조사하는 데 어떻게 사용했는지, 그리고 아래에서 API 객체의 다양한 속성을 확인하는 데 어떻게 사용하는지를 살펴봐야 한다.

![12](/img/in-post/gcp/week1_2/qwiklap12.png)


##### 2단계

- 모놀리식 pod의 구성 파일을 살펴보자

  ```bash
  cat pods/monolith.yaml
  ```

![13](/img/in-post/gcp/week1_2/qwiklap13.png)


- pod는 `monolith`라는 하나의 컨테이너로 구성되어 있다. 컨테이너가 실행되어 HTTP 트래픽을 위한 포트 80을 열 때 몇 개의 인수를 컨테이너에 전달한다.

##### 3단계

- `kubectl explain` 명령어를 `.spec` 옵션과 함께 사용하여 API 개체에 대한 자세한 내용을 확인. 

- 이 예제에서는 컨테이너를 살펴보자

  ```bash
  kubectl explain pods.spec.containers
  ```

##### 4단계

- `kubectl create`를 사용하여 `monolith`를 생성

  ```bash
  kubectl create -f pods/monolith.yaml
  ```

##### 5단계

- `kubectl get pods` 명령어를 사용하여 기본 네임스페이스에서 실행 중인 모든 pod를 나열한다

  ```bash
  kubectl get pods
  ```

![14](/img/in-post/gcp/week1_2/qwiklap14.png)


- 모놀리식 pod가 작동하기까지 몇 초가 걸릴 수 있다. 모놀리식 pod를 실행하기 위해 Docker Hub에서 모놀리식 컨테이너 이미지를 가져와야 하기 때문

##### 6단계

- pod가 실행되면 `kubectl describe` 명령어를 사용하여 `monolith` pod에 대한 자세한 정보를 가져온다.

  ```bash
  kubectl describe pods monolith
  ```

- pod IP 주소 및 이벤트 로그를 포함한 `monolith` pod에 대한 자세한 정보가 표시됩니다. 문제를 해결해야 할 때 이러한 정보를 유용하게 사용할 수 있다.

```
질문 !!
- pod IP 주소란 무엇인가요?
- pod는 어떤 노드에서 실행되나요?
- pod에서는 어떤 컨테이너가 실행되나요?
- pod에는 어떤 라벨이 지정되어 있나요?
- 컨테이너에는 어떤 인수가 설정되어 있나요?
```

<br>

#### pod와 상호작용

- pod에는 기본적으로 비공개 IP 주소가 할당되며 클러스터 밖에서는 이에 접근할 수 없다. `kubectl port-forward` 명령어를 사용하여 로컬 포트를 `monolith` pod 내의 포트에 매핑한다.
- 터미널을 두개 사용한다. 하나에서는 `kubectl port-forward`명령어를 실행하고 다른 하나에서는 `curl` 명령어를 실행한다

##### 1단계

- Cloud Shell에서 `+` 버튼을 클릭하여 새 터미널을 열어준다

##### 2단계

- 다음 명령어를 실행하여 로컬 포트 10080에서 컨테이너가 수신하는 pod 포트 80으로 포트 전달을 설정한다.

  ```bash
  kubectl port-forward monolith 10080:80
  ```

##### 3단계

- pod에 액세스하려면 첫 번째 터미널 창으로 돌아가 다음 `curl` 명령어를 실행한다

  ```bash
  curl http://127.0.0.1:10080
  ```

![15](/img/in-post/gcp/week1_2/qwiklap15.png)


- 위 그림과 같은 응답을 받게 된다

##### 4단계

- 보안 엔드포인트에 도달하면 어떻게 되는지 확인

  ```bash
  curl http://127.0.0.1:10080/secure
  ```

![16](/img/in-post/gcp/week1_2/qwiklap16.png)


- 요청에 인증 토큰이 포함되어 있지 않기 때문에 오류가 표시된다

##### 5단계

- 로그인하여 `monolith`에서 인증 토큰을 가져오자

  ```bash
  curl -u user http://127.0.0.1:10080/login
  ```

![17](/img/in-post/gcp/week1_2/qwiklap17.png)


- `password`로 로그인을 하면 JWT 토큰이 출력된다.  이 토큰으로 `curl` 보안 엔드포인트를 테스트한다

##### 6단계

- Cloud Shell은 긴 문자열을 잘 복사하지 못하므로 토큰을 환경 변수에 복사한다

  ```bash
  TOKEN=$(curl http://127.0.0.1:10080/login -u user|jq -r '.token')
  ```

![18](/img/in-post/gcp/week1_2/qwiklap18.png)


##### 7단계

- 인증 토큰을 포함해 다시 보안 엔드포인트에 액세스한다

  ```bash
  curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:10080/secure
  ```

![19](/img/in-post/gcp/week1_2/qwiklap19.png)


- 오류가 났던 4단계와 달리 정상 작동하고 있음을 알려주는 응답을 다시 받게 된다.

##### 8단계

- `kubectl logs` 명령어를 사용하여 `monolith` pod의 로그를 확인한다

  ```bash
  kubectl logs monolith
  ```

![20](/img/in-post/gcp/week1_2/qwiklap20.png)


##### 9단계

- 다른 터미널을 열고 `-f` 플래그를 사용하여 실시간 로그 스트림을 가져온다.

- 세 번째 터미널을 생성하려면 Cloud Shell에서 `+` 버튼을 클릭하고 다음 명령어를 실행

  ```bash
  kubectl logs -f monolith
  ```

##### 10단계

- 터미널 1에서 `curl`을 사용하여 `monolith`와 상호작용한다. 그러면 터미널 3에 로그 업데이트가 표시된다

  ```bash
  curl http://127.0.0.1:10080
  ```

##### 11단계

- `kubectl exec` 명령어를 사용하여 `monolith` pod의 대화형 셸을 실행. 

- 이는 컨테이너 내에서 문제를 해결하고 싶은 경우에 유용하다

  ```bash
  kubectl exec monolith --stdin --tty -c monolith /bin/sh
  ```

##### 12단계

- 셸에서 `ping` 명령어를 사용하여 외부(외부 발신) 연결을 테스트할 수 있다

  ```
  ping -c 3 google.com 
  ```

##### 13단계

- 셸에서 로그아웃

```bash
exit
```

- 이와 같이 pod와의 상호작용은 `kubectl` 명령어를 사용하는 것만큼 쉽다...?
-  컨테이너를 원격으로 테스트하거나 로그인 셸을 가져와야 하는 경우 시작하는 데 필요한 모든 요소를 Kubernetes가 제공한다

<br>

### 모니터링 및 상태 확인

- Kubernetes는 준비 상태 및 활성 여부 프로브의 형태로 애플리케이션 모니터링을 지원한다. 
- 상태 확인은 pod의 각 컨테이너에서 수행할 수 있다.
-  준비 상태 프로브는 pod가 트래픽을 지원할 '준비'가 된 시점을 나타낸다. 
- 활성 여부 프로브는 컨테이너가 '활성화'되었는지를 나타낸다. 
- 활성 여부 프로브에서 실패가 여러 번 반복되면 컨테이너가 다시 시작된다. 
- 활성 여부 프로브에서 실패가 계속될 경우에는 pod가 비정상 종료 루프로 전환된다. 
- 준비 상태 확인에 실패하면 컨테이너가 *준비 안 됨*으로 표시되고 모든 부하 분산기에서 제거된다.

아래  실습에서는

- 준비 상태 및 활성 여부 프로브가 포함된 pod를 만들어 본다
- 준비 상태 및 활성 여부 프로브의 실패 문제를 해결해 본다

<br>

#### 활성 여부 및 준비 상태 프로브가 포함된 pod 만들기

##### 1단계

- `healthy-monolith` pod 구성 파일을 살펴본다

  ```bash
  cat pods/healthy-monolith.yaml
  ```

##### 2단계

- `kubectl`을 사용하여 `healthy-monolith` pod를 생성

  ```bash
  kubectl create -f pods/healthy-monolith.yaml
  ```

##### 3단계

- pod는 준비 상태 프로브가 HTTP 200 응답을 반환하기 전까지 *준비됨*으로 표시되지 않는다. 

- `kubectl describe` 명령어를 사용하여 healthy-monolith pod의 세부정보를 확인

  ```bash
  kubectl describe pod healthy-monolith
  ```

<br>

#### 준비 상태 프로브

- Kubernetes가 실패한 준비 상태 프로브에 대해 어떻게 응답하는지 확인해 보자.
-  `monolith` 컨테이너는 준비 상태 및 활성 여부 프로브를 강제로 실패하도록 할 수 있으므로, `healthy-monolith` pod의 실패를 시뮬레이션할 수 있다

##### 1단계

- 터미널 2에서 `kubectl port-forward` 명령어를 사용하여 로컬 포트를 `healthy-monolith` pod의 상태 포트로 전달한다

  ```bash
  kubectl port-forward healthy-monolith 10081:81
  ```

##### 2단계

- 강제적으로 `monolith` 컨테이너의 준비 상태 프로브가 실패하도록 한다. 

- 터미널 1에서 `curl` 명령어를 사용하여 준비 상태 프로브의 상태를 전환. 

- 이 명령어는 실행해도 아무 것도 출력하지 않음

  ```bash
  curl http://127.0.0.1:10081/readiness/status
  ```

##### 3단계

- `kubectl get` `pods -w` 명령어를 사용하여 `healthy-monolith`pod의 상태를 가져온다.

  ```bash
  kubectl get pods healthy-monolith -w
  ```

![21](/img/in-post/gcp/week1_2/qwiklap21.png)


##### 4단계

- 준비된 컨테이너가 `0/1`개 있으면 `Ctrl+C` 키를 누른다.

-  `kubectl describe` 명령어를 사용하여 준비 상태 프로브 실패에 관한 자세한 정보를 가져온다

  ```bash
  kubectl describe pods healthy-monolith
  ```

##### 5단계

- 실패한 준비 상태 프로브에 관한 `healthy-monolith` pod 보고서 세부정보의 이벤트를 확인

- `monolith` 컨테이너 준비 상태 프로브를 강제로 성공하게 하려면 `curl` 명령어를 사용하여 준비 상태 프로브의 상태를 전환한다

  ```bash
  curl http://127.0.0.1:10081/readiness/status
  ```

##### 6단계

- 15초 가량 기다린 후에 `kubectl get pods` 명령어를 사용하여 `healthy-monolith` pod의 상태를 가져옵니다.

  ```bash
  kubectl get pods healthy-monolith
  ```

![22](/img/in-post/gcp/week1_2/qwiklap22.png)


##### 7단계

- 2터미널 종료

<br>

#### 활성 여부 프로브

- 위에서 학습한 내용을 토대로, `kubectl port-forward`및 `curl` 명령어를 사용하여 강제적으로 `monolith` 컨테이너의 활성 여부 프로브가 실패하도록 하고, Kubernetes가 실패한 활성 여부 프로브에 어떻게 응답하는지 관찰해 보자

##### 1단계

- 터미널 2에서 `kubectl port-forward` 명령어를 사용하여 로컬 포트를 `healthy-monolith` pod의 상태 포트로 전달

  ```bash
  kubectl port-forward healthy-monolith 10081:81
  ```

##### 2단계

- 다른 터미널에서 `curl` 명령어를 사용하여 준비 상태 프로브의 상태를 변경함으로써 `monolith` 컨테이너의 준비 상태 프로브가 강제로 성공하도록 한다

  ```bash
  curl http://127.0.0.1:10081/healthz/status
  ```

##### 3단계

- `kubectl get pods -w` 명령어를 사용하여 `healthy-monolith`pod의 상태를 가져온다

  ```bash
  kubectl get pods healthy-monolith -w
  ```

##### 4단계

- 활성 여부 프로브가 실패하면 컨테이너가 다시 시작된다. 
- 다시 시작되면 `healthy-monolith` pod가 정상 상태로 돌아와야 한다. 
- pod가 다시 시작되면 `Ctrl+C` 키를 눌러 명령어를 종료. 재시작 횟수를 기록한다.

##### 5단계

- `kubectl describe` 명령어를 사용하여 실패한 활성 여부 프로브에 대한 자세한 정보를 가져온다. 
- 활성 여부 프로브가 실패하고 pod가 다시 시작된 시점의 관련 이벤트를 볼 수 있다

```bash
kubectl describe pods healthy-monolith
```

##### 6단계

- 2터미널 종료

<br>

### 서비스

#### 서비스 만들기

- 서비스를 생성하기에 앞서, HTTPS 트래픽을 처리할 수 있는 `secure-monolith`라는 nginx 서버로 보안 pod를 생성한다

##### 1단계

- 보안 pod가 데이터를 가져오거나 처리하는 데 사용할 볼륨 두 개를 생성

- `secret` 유형의 첫 번째 볼륨은 nginx 서버의 TLS 인증 파일을 저장

- 터미널 1로 돌아온 후 다음 명령어를 사용하여 첫 번째 볼륨을 생성

  ```bash
  kubectl create secret generic tls-certs --from-file tls/
  ```

- 그러면 로컬 디렉터리 `tls/`에서 인증 파일이 업로드되어 `tls-certs`라는 `secret`에 저장된다

- nginx의 구성 파일을 보관할 `ConfigMap` 유형의 두 번째 볼륨을 생성.

  ```bash
  kubectl create configmap nginx-proxy-conf --from-file nginx/proxy.conf
  ```

- 그러면 `proxy.conf` 파일이 클러스터에 업로드되고 ConfigMap `nginx-proxy-conf`가 호출

![23](/img/in-post/gcp/week1_2/qwiklap23.png)


##### 2단계

- nginx에서 사용할 `proxy.conf` 파일을 살펴보자

  ```bash
  cat nginx/proxy.conf
  ```

- 이 파일은 SSL 상태를 ON으로 지정하고, 컨테이너 파일 시스템에 인증 파일의 위치를 지정한다
- 파일은 실제로 `secret` 볼륨에 존재하기 때문에 이 볼륨을 컨테이너의 파일 시스템에 마운트해야 한다

![24](/img/in-post/gcp/week1_2/qwiklap24.png)


##### 3단계

- `secure-monolith` pod 구성 파일을 살펴보자

  ```bash
  cat pods/secure-monolith.yaml
  ```

- `volumes`에서는 위에서 생성한 두 개의 볼륨을 pod가 연결하고 있다. 또한 `volumeMounts`에서는 pod가 `tls-certs` 볼륨을 컨테이너의 파일 시스템에 마운트하여 nginx가 데이터를 처리할 수 있도록 한다

##### 4단계

- 다음 명령어를 실행하여 구성 데이터로 `secure-monolith` pod를 생성

  ```bash
  kubectl create -f pods/secure-monolith.yaml
  ```

- 보안 pod를 만들었으므로 이제 Kubernetes 서비스를 사용하여 `secure-monolith` pod를 외부로 노출시킴

##### 5단계

- 모놀리식 서비스 구성 파일을 살펴보자

  ```bash
  cat services/monolith.yaml
  ```

![25](/img/in-post/gcp/week1_2/qwiklap25.png)


- 파일에는 다음이 포함되어 있다
  - pod를 찾아 라벨 `app=monolith` 및 `secure=enabled`로 노출시키는 `selector`
  - 외부 트래픽을 포트 31000에서 nginx의 포트 443로 전달하는 `targetPort` 및 `nodePort`

##### 6단계

- `kubectl create` 명령어를 사용하여 모놀리식 서비스 구성 파일로 모놀리식 서비스를 만든다

  ```bash
  kubectl create -f services/monolith.yaml
  ```

- 서비스의 yaml 파일에 `type: NodePort`가 있으면, 각 클러스터 노드의 포트를 사용하여 서비스를 노출시킨다는 의미
-  즉, 다른 앱이 서버 중 하나에서 포트 31000과 연결을 시도하면 포트 충돌이 발생할 수 있다
- 보통은 Kubernetes에서 이러한 포트 할당을 알아서 처리한다. 이 실습에서 포트를 선택한 이유는 나중에 상태 확인을 구성하기가 더 편하기 때문

##### 7단계

- `gcloud compute firewall-rules` 명령어를 사용하여 노출된 nodeport의 모놀리식 서비스로 트래픽을 전달

  ```bash
  gcloud compute firewall-rules create allow-monolith-nodeport --allow=tcp:31000
  ```

![26](/img/in-post/gcp/week1_2/qwiklap26.png)


- 이제 모든 설정이 완료되었으므로, 포트 전달을 사용하지 않고도 클러스터 외부에서 `secure-monolith` 서비스를 테스트할 수 있게 된다.

##### 8단계

- 노드 하나의 IP주소를 가져온다

  ```bash
  gcloud compute instances list
  ```

![27](/img/in-post/gcp/week1_2/qwiklap27.png)


##### 9단계

- 브라우저에서 URL을 열어보자

  ```bash
  https://<EXTERNAL_IP>:31000
  ```

- 시간이 초과되어가 연결이 거부된다. 왜 그럴까?

- 다음 명령어를 사용하여 질문에 답해보자

```
kubectl get services monolith
```

```
kubectl describe services monolith
```

```
질문
- 모놀리식 서비스에서 응답을를 받을 수 없는 이유는 무엇인가요?
- 모놀리식 서비스에는 몇 개의 엔드포인트가 있나요?
- 모놀리식 서비스에서 pod를 감지하게 하려면 pod에 어떤 라벨이 지정되어 있어야 하나요?
```

<br>

#### pod에 라벨 추가

- 현재 모놀리식 서비스에 엔드포인트가 없는 경우, 이 문제를 해결하는 방법 중 하나는 라벨 쿼리와 함께 `kubectl get pods` 명령어를 사용하는 것이다

##### 1단계

- 모놀리식 라벨이 지정되어 실행되는 여러 개의 pod가 있는지 확인

  ```bash
  kubectl get pods -l "app=monolith"
  ```

![28](/img/in-post/gcp/week1_2/qwiklap28.png)


##### 2단계

- `app=monolith`와 `secure=enabled` 라벨이 확인

  ```bash
  kubectl get pods -l "app=monolith,secure=enabled"
  ```

- 이 라벨 쿼리로는 결과가 출력되지 않는다.

##### 3단계

- `kubectl label` 명령어를 사용하여 `secure-monolith` pod에 누락된 `secure=enabled` 라벨을 추가

  ```bash
  kubectl label pods secure-monolith 'secure=enabled'
  ```

##### 4단계

- 라벨 업데이트 확인

  ```bash
  kubectl get pods secure-monolith --show-labels
  ```

![29](/img/in-post/gcp/week1_2/qwiklap29.png)


##### 5단계

- `monolith` 서비스에서 엔드포인트 목록을 확인

  ```bash
  kubectl get endpoints monolith
  ```

![30](/img/in-post/gcp/week1_2/qwiklap30.png)


- 위 그림과 같이 엔드포인트 하나가 존재

##### 6단계

- 노드 하나로 다시 테스트

  ```bash
  gcloud compute instances list | grep gke-
  ```

  ![31](/img/in-post/gcp/week1_2/qwiklap31.png)


- 브라우저에서 다음 URL을 엽니다. `secure-monolith`가 자체 서명 인증서를 사용 중이므로 SSL 경고를 클릭해 확인해 주어야 한다

  ```bash
  https://<EXTERNAL_IP>:31000
  ```

##### 실습 종료

`요약 ` :  Kubernetes 서비스와, 라벨을 사용해 pod 엔드포인트를 선택하는 방법에 대해 알아보았다. 또한 Kubernetes 볼륨과, ConfigMaps 및 보안 비밀을 사용하여 애플리케이션을 구성하는 방법에 대해서도 살펴보았다

<br>

#### 퀴즈

- 다맞음