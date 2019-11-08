---
layout: post
title: "Docker를 이용한 mysql서버 "
subtitle: "Docker를 이용한  mysql서버 띄우기"
date: 2019-09-01 18:00:00 +0900
categories: til
tags: etc
comments: true
---

## Docker를 이용한  mysql서버 띄우기

<br>

### Docker란 ?

<br>

- 도커는 **컨테이너 기반의 오픈소스 가상화 플랫폼**
- 기존의 VMware나 VirtualBox는 **OS 가상화** 방식은 비교적 사용법이 간단하지만 무겁고 느려서 운영환경에선 사용할 수 없었다.

![vm-vs-docker](/img/in-post/vm-vs-docker.png)

- **프로세스를 격리**하는 방식, 리눅스에서는 이 방식을 리눅스 컨테이너라고 한다. 컨테이너는 단순히 프로세스를 격리시키기 때문에 가볍고 빠르게 동작한다.
- 새로운 컨터이너를 만드는데 걸리는 시간은 겨우 1-2초로 가상머신과 비교도 할 수 없이 빠르다

- 큰 용량의 이미지를 서버에 저장하고 관리하는 것은 쉽지 않은데 도커는 `Docker hub`를 통해 공개 이미지를 무료로 관리해 준다. 

<br>

### Docker Image & Container

- #### Docker Image

  - 이미지는 추상적인 개념이며, 이미지를 기반으로 생성된 컨테이너가 실행된다

  - 이미지는 코드, 런타임, 도서관, 환경 변수 및 구성 파일 등 응용 프로그램을 실행하는 데 필요한 모든 것을 포함하는 실행 가능한 패키지

  - ##### Image관련 명령어

  ```bash
  # 현재 사용 가능한 이미지 리스트 확인
  $ docker images
  
  # docker.io의 공식 저장소에서 이미지를 다운로드 하는 명령어
  $ docker pull <imageName>
  ```

- #### Docker Container

  - 컨테이너는 기본적으로 리눅스에서 실행되며, 다른 컨테이너와 호스트 시스템의 커널을 공유

  - 더 많은 메모리를 사용하지 않고 개별 프로세스를 실행하여 가볍게 만듬

  - ##### Container관련 명령어

  ```bash
  # 특정 이미지로 컨테이너 생성 및 실행
  $ docker run <containerName/id>
  ## 호스트에 연결된 컨테이너의 특정 포트를 외부에 노출하게 된다
  $ docker run -p 호스트port:컨테이너포트 레포지토리이름
  
  # 실행중인 컨테이너들을 출력
  $ docker ps
  ## 전체 컨테이너 출력
  $ docker ps -a
  
  # 생성되어 있는 컨테이너를 실행
  $ docker start <containerName/id>
  
  # 실행중인 컨테이너를 정지
  $ docker stop <containerName/id>
  
  # 실행중인 컨테이너 진입 시
  $ docker exec -i -t <containerName/id>
  ## 쉘이 안떠있는 컨테이너일 경우
  $ docker exec -i -t <containerName/id> /bin/bash or bash
  
  # 실행되고 있는 컨테이너에 표쥰입력과 표준출력을 연결하는 명령어
  ## option : --no-stdin=false / --sig-proxy=true
  $ docker attach <option> <containerName/id>
  
  # 실행 중인 컨테이너들 전체 정지
  $ docker stop $(docker ps -a -q)
  
  # 컨테이너 삭제
  $ docker rm <containerName/id>
  ## 모두 강제 삭제
  $ docker rm -f docker ps -a -q
  ```

<br>

#### Docker 설치

<br>

- 도커 설치환경은 putty를 이용한 aws linux 서버

- 초기설정

  ```bash
  # 초기 비밀번호 설정
  $ sudo passwd root
  
  # 패키지 업데이트
  $ sudo apt update
  ```

- ##### 도커 Storage설정 후 설치

  ```bash
  # HTTPS를 통해 repository를 사용할 수 있도록 패키지를 설치해 준다
  $ sudo apt install apt-transport-https
  $ sudo apt install curl
  $ sudo apt install ca-certificates
  $ sudo apt install software-properties-common
  
  # Docker 공식 GPG 키 추가
  $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  ## stable repository 사용을 위해서
  $ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
  
  # 패키지 업데이트
  $ sudo apt-get update
  
  # Docker CE 최신 버전 설치
  $ sudo apt-get install docker-ce
  
  # Docker CE 특정 버전 설치
  $ apt-cache policy docker-ce
  ```

-  도커가 잘 설치되었는지 상태 확인

  ```bash
  $ sudo systemctl status docker
  $ sudo docker version
  ```

<br>

### Mysql

- Mysql 설치를 위한 도커 이미지 다운로드

  ```bash
  $ docker pull <dockerHubName>
  ```

- `docker-compose`로 실행하기 위해 **docker-compose.yaml** 설정파일을 작성해 준다

  ```yaml
  version: '3'
  services:
  	chainVilien:
  	    ## <위에서 설치한 이미지>
  		image: emblockit/haribo-mysql
  		ports:
  		## "<내포트>:<기본포트>"
  		- "3307:3306"
  		volumes:
  		## <로컬에서 mysql에 사용할 디렉토리>:/var/lib/mysql
  		- /home/ubuntu/chainVilien/mysql:/var/lib/mysql emblockit/haribo-mysql
  ```

- 실행

  ```bash
  $ docker run -d -p 3307:3306 --name vilien-mysql -v /home/ubuntu/chainVilien/mysql:/var/lib/mysql emblockit/haribo-mysql 
  ```

-  mysql접속

  ```bash
  # id로 접속
  $ docker exec -it 862c5f4b8701 /bin/bash\
  # 포트로 접속
  $ mysql -u root -p --host 127.0.0.1 --port 3307 
  ```

<br>

참고사이트

- [Subicura's Blog](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html){: class="underlineFill"}
- [Docker 공식 문서](https://docs.docker.com/){: class="underlineFill"}