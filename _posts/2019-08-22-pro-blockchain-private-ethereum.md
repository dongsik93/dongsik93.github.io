---
layout: post
title: "BlockChain Project Private Network"
subtitle: "blockchain2"
date: 2019-08-22 18:00:00 +0900
categories: pro
tags: BlockChain
comments: true
---

## 프라이빗 이더리움 구축

### vagrant 환경설정

```
## vagrant 명령어

1. vagrant up <args>			// args에 해당하는 가상머신 구동
2. vagrant half <args> 			// args에 해당하는 가상머신 정지
3. vagrant destory <args> 		// args에 해당하는 가상머신 삭제
4. vagrant ssh <args> 			// args에 해당하는 가상머신 접속
5. vagrant ssh-config <args> 	// args에 해당하는 가상머신 ssh 설정 확인
6. vagrant global-status 		// 가상머신 상태 정보 출력
7. vagrant --help 				// vagrant 관련 명령어 정보 출력
```

- 먼저 vagrant init을 해줌

- 생성된 `Vagrantfile`을 수정

  - 명세서에 있는 노드 구성정보(5개)

  ```
  vms={
    eth01: ["10", 4096],
    eth02: ["11", 4096],
    eth03: ["12", 2048],
    eth04: ["13", 2048],
    eth05: ["14", 2048],
  }
  
  Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/bionic64"
    vms.map do |key, value|
      name = key.to_s
      ip_num, mem = value
      config.vm.define "#{name}" do |node|
        node.vm.network "private_network", ip: "192.168.50.#{ip_num}"
        node.vm.hostname = "#{name}"
        node.vm.provider "virtualbox" do |nodev|
          nodev.memory = "#{mem}"
        end
      end
    end
  end
  ```

- 각각 노드 가상머신 구동

  - `$ vagrant up eh01 ~ eh05`
  - 확인


- 각각의 가상머신에서 `$ vagrant ssh eth01~05 ` 실행

- 가상머신에 `Geth`설치

  - ```
    > sudo apt-get update
    > sudo apt-get install software-properties-common
    > sudo add-apt-repository -y ppa:ethereum/ethereum
    > sudo apt-get install ethereum
    ```

- 모든 서버에 디렉토리 만들기 및 아래 반복
  - `mkdir -p dev/eth_localdata`
  - `cd dev/eth_localdata`
  - `vi CustomGenesis.json`

- Geth 초기화

```
> geth --datadir /home/vagrant/dev/eth_localdata init /home/vagrant/dev/eth_localdata/CustomGenesis.json
```

- 초기화 후 확인

  ```
  > tree
  없으면
  > sudo apt install tree
  ```

- Geth 구동

- [geth 설정](https://medium.com/day34/패캠-2주차-geth-실습-트랜잭션-428e20cccd89){: class="underlineFill"}

```
> geth --networkid 15150 --maxpeers 5 --datadir ~/dev/eth_localdata --allow-insecure-unlock --port 30301 --rpc --rpcport 8545 --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcapi "admin,net,miner,eth,rpc,web3,txpool,debug,db,personal" console 2>> ~/dev/eth_localdata/geth.log
```

- 다른 console에

```
> geth --networkid 15150 --maxpeers 5 --datadir ~/dev/eth_localdata --port 30305 --rpc --rpcport 8545 --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcapi "admin,net,miner,eth,rpc,web3,txpool,debug,db,personal" console 2>> ~/dev/eth_localdata/geth.log
```

- 연결 확인
- 연결확인 후 노드 정보를 확인하고 노드 끼리의 연결

```
# eth01

"enode://94de4c846609d706384b47504819245df00d20b7aae42230f79591ca6092866132d91b0293d4004ba91863334653c31b3dd1778df3505b45fd118bce5d0b536a@121.147.32.40:30301?discport=55473"

# eth02

"enode://2d9fac5d6fc790a5ed95872b9004a40ed0a1b3c64054b69731c0d59fb778b86a37ceeaac40cc3061121ee44471b06c91081a8f3b3ae808a118bb33f78e60f1ad@121.147.32.40:30302?discport=53397"

# eth03

"enode://1541e90e99060c940b6e488019c14623560c782e221cc5b6f2ff2db06babf476ca95d56b50c09a10a47c1363896e8410a099d89ed85bd5b2f690c7226d6a259c@121.147.32.40:30303?discport=53737"

# eth04

"enode://a9b2fa77580ae864a91b5a66061ea4c93a825a0957c19607a0b940eadc15e3fa2fc02d1228af41e956bd834cf71e8b13465d34b20eada57fb54628f3b83864f1@121.147.32.40:30304?discport=62875"

# eth05

"enode://bc3032dde2cff72273f3c6c7b0c33c9360ad35786d0caf7e997e7d09378e812f8f02b9a5298baf6e26c0b3f058fb0a5cce92ba4a5c3fa6e086c64cfd5129eb5c@121.147.32.40:30305?discport=62882"

## eth01 vi static-nodes.json (keystore 폴더와 같은 위치에서)
[
	"enode://2d9fac5d6fc790a5ed95872b9004a40ed0a1b3c64054b69731c0d59fb778b86a37ceeaac40cc3061121ee44471b06c91081a8f3b3ae808a118bb33f78e60f1ad@192.168.50.11:30302?discport=53397",
	"enode://a9b2fa77580ae864a91b5a66061ea4c93a825a0957c19607a0b940eadc15e3fa2fc02d1228af41e956bd834cf71e8b13465d34b20eada57fb54628f3b83864f1@192.168.50.13:30304?discport=62875"
	
]

```

- 0-1 연결 (0) 1-2
- 0-2 연결 (0) 1-3
- 1-3 연결 (0) 2-4
- 1-4 연결 (0) 2-5
- 2-3 연결 (0) 3-4
- 3-4 연결 (0) 3-5



#### geth설정

node 1,2,3,4,5 -> Maxpeers 5

node 1, 2 -> mining on

node 3 -> RPC Port 8545, RPC Addr All, RPC API, 



#### Genesis.json ?

- 실제 배포전에 Private Network를 통해 테스트
- Geth를 이용해 Ethereum Private Network를 구성하기 위해서는 처음 제네시스 블록을 생성해 주어야 한다.
- `Genesis.json`에 제네시스 블록에 대한 설정을 해주게 된댜.

```json
{
    "config": {
        "chainId": 15150,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },
    "difficulty": "0x10",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "gasLimit": "9999999",
    "alloc": {},
    "extraData": "",
    "nonce": "0xdeadbeefdeadbeef",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp": "0x00"
}
```

- `chainID` : 현재 chain을 식별하는 값(Reply Attack를 막기위해)
- `homesteadBlock` : 블록체인의 release 버젼을 나타냄
- `eip155Block`, `eip158Block` : 기본값은 0 (하드포크 하지않는 옵션값)

- `difficulty` : 이 블록의 nonce값을 발견하는 난이도 레벨 설정, 높을수록 블록생성 속도가 느려진다(테스트넷에서는 낮게 하는걸 권장)
  - 채굴자 당 평균 채널 속도에 따라서 변함

- `gasLimit` : 체인 전체에 대한 블록 당 가스지출의 제한량을 설정
- `alloc` : Genisis 블록 생성 시 지정한 지갑에 할당된 양을 미리 채움
- `nonce` : PoW 알고리즘에 사용되는 nonce값
- `mixhash` : nonce값과 결합하여 이 블록에 충분한 양의 계산이 수행되었음을 증명하는 256bit의 해시값
  - mixhash는 해당 이더리움 체인 내에서의 난이도를 결정
  - 전체 채굴자들의 채굴 속오데 영향을 미침
- `parentHash` : 이전 block header의 Keccak 256bit 해시값(none와 mixhash값을 포함)
- `timestamp` : block을 생성할 때 Unix time함수의 결과값을 나타냄


