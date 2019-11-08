---
layout: post
title: "이더리움 테스트"
subtitle: "이더리움 테스트서버에서 실습"
date: 2019-06-25 18:00:00 +0900
categories: til
tags: blockchain
comments: true
---

## 이더리움 네트워크 테스트



- install
  - VirtualBox
  - Vagrant
- [https://remix.ethereum.org/](https://remix.ethereum.org/){: class="underlineFill"}

- 크롬 metamask 추가

  - 지갑생성

    

#### 프라이빗 이더리움 구축



##### vagrant 환경설정

```
# 기존내용을 지우고 수정

Vagrant.configure("2") do |config|
  config.vm.define "eth01" do |eth01|
    eth01.vm.box = "ubuntu/bionic64"
    eth01.vm.hostname = "eth01"
    eth01.vm.network "private_network", ip: "192.168.50.10"
    eth01.vm.provider "virtualbox" do |eth01v|
      eth01v.memory = 4096
    end
  end
  config.vm.define "eth02" do |eth02|
    eth02.vm.box = "ubuntu/bionic64"
    eth02.vm.hostname = "eth02"
    eth02.vm.network "private_network", ip: "192.168.50.11"
    eth02.vm.provider "virtualbox" do |eth02v|
      eth02v.memory = 4096
    end
  end
end
```




`$ vagrant up eth01` : 해당 환경을 구성

$ vagrant up eth02

각각의 터미널에 eth01, eth02 실행

`$ vagrant ssh eth01` , `$ vagrant ssh eth02` 

##### Geth 설치 (Go-ethereum client) 

```p
> sudo apt-get update
> sudo apt-get install software-properties-common
> sudo add-apt-repository -y ppa:ethereum/ethereum
> sudo apt-get install ethereum

# eht01 가상머신에서 수행
> mkdir -p dev/eth_localdata
> cd dev/eth_localdata

# 프라이빗 이더리움을 위한 genesis 블록파일 생성
> vi CustomGenesis.json
```

- CustomerGenesis.json 설정

```
{
  "config": {
    "chainId": 921,
    "homesteadBlock": 0,
    "eip155Block": 0,
    "eip158Block": 0
  },
  "alloc": {},
  "coinbase": "0x0000000000000000000000000000000000000000",
  "difficulty": "0x20",
  "extraData": "",
  "gasLimit": "0x47e7c5",
  "nonce": "0x0000000000000042",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "0x00"
 }
```

- Geth 초기화

```
> geth --datadir /home/vagrant/dev/eth_localdata init /home/vagrant/dev/eth_localdata/CustomGenesis.json
```

- Geth 구동

```
> geth --networkid 921 --maxpeers 2 --datadir /home/vagrant/deveth_localdata --port 30303 console
```

- 노드 연결

  - eth01

  ```
  > admin.nodeInfo.enode
  "enode://69c6116207ed81c992c023c3223f01f9ee0a3411b2d6328443c12fa8f4dfe73c7a40c3e6d052fb751eb08205f31f0226870fda533cd4eae428fc6369b99e0662@127.0.0.1:30303"
  ```

  - 위의 값 붙여넣기

  ```
  > admin.addPeer("enode://69c6116207ed81c992c023c3223f01f9ee0a3411b2d6328443c12fa8f4dfe73c7a40c3e6d052fb751eb08205f31f0226870fda533cd4eae428fc6369b99e0662@127.0.0.1:30303")
  ```

  - 확인

  ```
  > admin.peers
  ```

- 이더리움 계정(EOA) 생성

```
> personal.newAccount("test1234")
"0x24a72a08cce1a343366c1a26311241c372c2e3b7", "0x9bcc4d8a2ff9a2fe8cac074afefe494c75c862ce"
# 확인
> eth.accounts
```

- 트랜잭션 생성

  - 채굴 시작

  ```
  > miner.start(1)
  ```

  - 채굴 종료

  ```
  > miner.stop()
  ```

  - 채굴 보상으로 획득환 이더 잔액 확인

  ```
  > eth.getBalance("0x9bcc4d8a2ff9a2fe8cac074afefe494c75c862ce")
  ```

  - 보내기

  ```
  eth.sendTransaction(
  	{from: " ", to : "eth02account", value:web3.toWei(1, "ether")})
  ```

  

- 트랜잭션 확인

```
> eth.getTransaction("txhash")
```

- 채굴된 블록 확인

```
> eth.getBlock("blockhas")
> eth.getBlock(blockNumber)
```







#### Remix

- Solidity 0.5.2 Compiler

- `SimpleStorage.sol` 파일 생성

```
// 항상 맨 위에는 버전
pragma solidity >=0.4.22 < 0.6.0;

contract SimpleStorage{
    uint256 data; // unsigned int
    
    // constract가 실행되고 제일 처음 실행되는 부분
    constructor() public{
        data = 0;
    }
    // 데이터 가져오는
    function get() public view returns(uint256){
        return data;
    }
    // 데이터 실행
    function set(uint256 data_) public {
        data = data_;
    }
}
```

- Deploy & run