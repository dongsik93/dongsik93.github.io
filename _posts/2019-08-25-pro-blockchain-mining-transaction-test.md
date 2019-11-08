---
layout: post
title: "BlockChain Project Mining / Transaction test"
subtitle: "blockchain3"
date: 2019-08-25 17:00:00 +0900
categories: pro
tags: BlockChain
comments: true
---

## 마이닝 및 트랜잭션 테스트

```
# 계정생성
> personal.newAccount("test1234")

# 확인
> eth.accounts
["0xf0d078b54e55a5be9c365e0395d945359aba7214"]

# 채굴 시작
> miner.start(1)

# 채굴 종료
> miner.stop()

# 채굴 보상으로 획득한 이더 잔액 확인
> eth.getBalance("0xf0d078b54e55a5be9c365e0395d945359aba7214")
> web3.fromWei(eth.getBalance(eth.accounts[0]))

# 이더 보내기
> eth.sendTransaction({from:eth.coinbase, to: "0x88E3568a7D22ff4fdEEA7Af66f01837c02003A48", value:web3.toWei(100,"ether")})

## 그냥 보내면 에러 발생 : authentication needed: password, or unlock

# unlock
> personal.listWallets[0].status
> web3.personal.unlockAccount(eth.coinbase, "test")

# 다시전송
## 전송 후 miner.start()를 다시 해줘야 pending되어있던 transaction이 처리됨
### miner.stop하고 계좌 잔고 확인하면 보내진걸 확인 가능
```

