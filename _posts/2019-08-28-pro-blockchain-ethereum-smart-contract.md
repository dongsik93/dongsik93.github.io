---
layout: post
title: "BlockChain Project Ethereum Smart Contract"
subtitle: "blockchain4"
date: 2019-08-28 18:00:00 +0900
categories: pro
tags: BlockChain
comments: true
---

## 이더리움 스마트 컨트랙트 작성(경매)



### Solidity 기본 문법

- Solidity에서는 unit/int, bool, string, bytes 등 다른 언어에서도 지원하는 기본 자료형을 지원하지만 부동소수점을 없다
- 정수형의 경우 비교 연산자, 비트 연산자, 쉬프트 연산자, 사칙연산, 모듈러, 지수등 수학 연산자 사용이 가능
- 논리형의 경우 역시 논리 연산자 사용이 가능
- Solidity에서는 이더리움의 주소를 나타내는 20바이트 길이를 저장할 수 있는 address 자료형이 존재
  - address형은 컴파일러 버전에 주의
  - 컴파일러가 0.5.0으로 버전 업 되면서 address payble형이 추가되고, 기존 0.4계열에서 address가 사용할 수 있었던 전역 함수인 send/transfer 함수가 address payble 형(이더를 보낼 수 있는 주소)에서만 사용할 수 있도록 개정됨
- 레퍼런스 타입의 구조체, 배열(고정 크기, 유동크기), 열거형, 매핑형(mapping)을 사용할 수 있다.
- 매핑형(mapping)
  - 해시 테이블(Hash Table)로 생각하면 됨
- Key타입엔 기본형을 지정하고, Value 타입으로는 사용자 지정 타입까지 지정할 수 있다.
- Solidity는 네 가지 접근 제어자 external, public, internal, private를 제공한다.
- 기본적으로 컨트랙트 내의 모든 항목은 외부에서 열람이 가능
- private로 설정된 경우 접근 및 변경이 불가능하지만 여전히 외부에서 열람은 가능
- 이전 버전에서는 함수의 visibility를 생략 가능했지만(생략 시 public) 0.5.0버전부터는 의무적으로 이를 선언해야한다.
- 코드에 명시되어있지 않은데도 불구하고 모든 함수에서 이용가능한 특정 전역 변수와 전역 함수들이 있다.
  - require(), assert(), revert() 등의 에러 처리 함수
  - msg.sender, msg.value 등의 전역 변수

```sol
pragma solidity ^0.5.2;

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/ownership/Ownable.sol";

/// @title 경매
contract Auction is Ownable{

  address payable public beneficiary;
  uint public auctionEndTime;
  uint public minValue;

  // 현재 최고 입찰 상태
  address payable public highestBidder;
  uint public highestBid;

  mapping(address => uint) pendingReturns;
  address payable[] bidders;

  bool ended;

  event HighestBidIncereased(address bidder, uint amount);
  event AuctionEnded(address winner, uint amount);

  /// @notice 경매 생성
  /// @param minimum 경매품의 최소 가격
  /// @param hoursAfter 경매 진행 기간, 시간 단위
  /// @dev 생성자에서 경매의 상태 변수 beneficiary, auctionEndTime, minValue이 정해짐.
  constructor(uint minimum, uint hoursAfter) public payable{
    require(minimum > 0);
    minValue = minimum * 1 ether;
    beneficiary = msg.sender;
    auctionEndTime = now + hoursAfter * 1 hours;
  }

  /// @dev 이더를 지불하여 경매에 참가하기 위해 payable 함수로 작성
  /// 파라메터 필요하지 않음.
  /// 최고 가격(현재 가격보다 높은 값)을 제시하지 못하면 경매에 참여할 수 없음.
  function bid() public payable {
    require(now <= auctionEndTime);
    require(msg.value > highestBid);
    
    if(pendingReturns[msg.sender]==0) {
        bidders.push(msg.sender);
    }
    
    if (highestBid != 0) {
        pendingReturns[highestBidder] += highestBid;
    }
    highestBidder = msg.sender;
    highestBid = msg.value;
    emit HighestBidIncereased(msg.sender, msg.value);
  }

  /// @dev 경매 종료까지 남은 시간을 초(in seconds)로 반환
  function getTimeLeft() public view returns (uint) {
      return (auctionEndTime - now);
  }

  /// @dev 특정 주소가 경매에 참여하여 환불받을 이더량
  /// @param _address 경매 참가자의 주소
  /// @return 경매에 참여한 참가자가 환불 받지 못한 이더
  function getPendingReturnsBy(address _address) view public returns (uint){
      return pendingReturns[_address];
  }

  /// @dev 출금 요청, 경매에 참여한 주소가 호출할 수 있음.
  /// 파라메터 필요하지 않음.
  /// @return bool 출금 성공 여부
  function withdraw() public returns (bool) {
    uint amount = pendingReturns[msg.sender];
    if (amount > 0) {
        pendingReturns[msg.sender] = 0;
        
        if (!msg.sender.send(amount)) {
            pendingReturns[msg.sender] = amount;
            return false;
        }
    }
    return true;
  }

  /// @dev 경매 생성자에 의해 경매 금액을 모두 반환하며 경매를 끝냄.
  /// 현재 최고가로 낙찰함.
  function endAuction() public onlyOwner {
    require(now <= auctionEndTime);
    require(!ended);
    ended = true;
    emit AuctionEnded(highestBidder, highestBid);
    
    for(uint i=0; i<bidders.length; i++){
        bidders[i].transfer(pendingReturns[bidders[i]]);
    }
    beneficiary.transfer(highestBid);
  }

  /// @dev 경매 생성자에 의해 경매를 취소함.
  /// 현재 최고 경매가 제시자에게도 환불
  function cancelAuction() public onlyOwner{
    // todo 내용을 완성 합니다. 
    for(uint i=0; i <bidders.length; i++){
        bidders[i].transfer(pendingReturns[bidders[i]]);
    }
    highestBidder.transfer(highestBid);
  }
}
```











