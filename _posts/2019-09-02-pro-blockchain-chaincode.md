---
layout: post
title: "BlockChain Project Fabric Chaincode 작성"
subtitle: "blockchain6"
date: 2019-09-02 18:00:00 +0900
categories: pro
tags: BlockChain
comments: true
---

## Hyperledger Fabric 체인코드 작성하기

### 시작하기

#### Init

```js
async Init(stub){
      return shim.success();
    }
```

<br>

#### Invoke

- `stub`는 호출할 Chaincode Application의 함수 이름

```js
async Invoke(stub){

       // Get method name and parameter from the chaincode arguments
      let ret = stub.getFunctionAndParameters();
      console.info(ret);
      let method = this[ret.fcn];

      // Undefined method calling exception(but do not throw error)
      if (!method) {
        console.error('no function of name:' + ret.fcn + ' found');
      }
      // Method call
      try {
        let payload = await method(stub, ret.params);
        return shim.success(payload);
      } catch (err) {
        console.info(err);
        return shim.error(err);
      }
    }
```

- `GetFunctionAndParameters`를 통해서 함수의 이름과 매개변수를 Chaincode Application 함수에 추출하기 위해서 호출
- `fcn` : function name to invoke

<br>

### 함수 등록

#### registerAsset

- 소유권 등록 함수
  - 디지털 자산 정보를 등록한다.
  - Composite key 등록
  - 이미 등록된 작품의 재등록을 방지
  - 소유권 정보의 최초 등록시 createdAt과 expiredAt은 False로 기록

```js
async registerAsset(stub, args){
		// 적절하지 않은 인자가 들어왔을 때
        if(args.length != 2){
            throw new Error('Incorrect number of arguments. Expecting 2, but received ' + args.length);
        }
    
    	// Generate composite key
        let compositeKey = stub.createCompositeKey("Asset.", [args[0]]);
    
    	// 이미 등록된 작품의 재등록 방지
        let dupCheck = await stub.getState(compositeKey);

        var isExist = function(value){
            if(value == "" || value == null || value == undefined ||
            (value != null && typeof value =="object" && !Object.keys(value).length)){
                return true;
            }

            else{
                return false;
            }
        };

        if(isExist(dupCheck) != true){
            throw new Error('AssetID ' + compositeKey + 'is already registered.')
;
        }
    
		// assetInformation 구조
        var assetInfo = {
            assetID: args[0],
            owner: args[1],
            createdAt: 'FALSE',
            expiredAt: 'FALSE'
        };

    	// Put the asset information
        await stub.putState(compositeKey, Buffer.from(JSON.stringify(assetInfo)));
    
        console.info('Asset is registered');
        console.info(assetInfo);
    }
```

- `getState` 와 `putState`를 이용해서 원장의 상태에 엑세스 할 수 있다.
- `createCompositeKey`
  - `Asset`이라는 키워드를 args를 통해 넘어온 `assetID`와 결합하여 복합키를 구성

<br>

#### confirmTimestamp

- 타임스탬프 확인 함수
  - asset ID에 대한 소유권 등록 시점을 기록
  - `YYYY-MM-DD HH:MM:SS`형식으로 기록
  - 등록 시점은 createdAt필드에 기록
  - 사용자는 asset ID를 사용하여 작품 소유권 정보의 등록 시점을 확정할 수 있다.

```js
async confirmTimestamp(stub, args){
        // 적절하지 않은 인자가 들어왔을 때 
        if(args.length != 1){
            throw new Error('Incorrect number of arguments. Expecting assetID as an argument');
        }

        // Generate composite key
        let searchKey = stub.createCompositeKey("Asset.", [args[0]]);
    
        // asset의 상태에 대한 정보
        let asset = await stub.getState(searchKey);
        let assetInfo = JSON.parse(asset);
        
        // transaction의 timestampe 저장
        let txTimestamp = stub.getTxTimestamp();

        // Timestamp를 'YYYY-MM-DD HH:MM:SS'형식으로 바꿔주기
        let timestampString;
        let tsSec = txTimestamp.seconds;
        let tsSecValue = tsSec.low;
        let dataTimeObj = new Date(tsSecValue*1000);
        
        timestampString = dataTimeObj.getFullYear() + '-' + ('0' + (dataTimeObj.getMonth() + 1)).slice(-2) +'-' 
                        +('0'+dataTimeObj.getDate()).slice(-2)+' '+ (dataTimeObj.getHours() + 9) +':'+('0'+dataTimeObj.getMinutes()).slice(-2)+ ':'+dataTimeObj.getSeconds();


        // createdAt필드의 정보 수정                    
        assetInfo.createdAt = timestampString;

        // Put the modified asset information
        await stub.putState(searchKey, Buffer.from(JSON.stringify(assetInfo)));

    }
```

- `GetTxTimestamp`를 이용해서 client에 의한 트랜잭션 생성의 타임스탬프를 반환한다.

<br>

#### query

- 조회함수
  - asset ID에 대한 소유권 정보 구조를 반환
  - 사용자는 asset ID를 사용하여 해당 작품에 대한 소유권 정보를 확인할 수 있다.

```js
async query(stub, args){

        // Generate composite key
        let searchKey = stub.createCompositeKey("Asset.", [args[0]]);
        
        // 소유권 정보 가져오기
        let asset = await stub.getState(searchKey);

        return asset;
    }
```

<br>

#### getAssetHistory

- 작품 소유권 이력 조회 함수
- asset ID 를 이용하여 해당 작품의 소유권 정보의 이력을 조회
- asset ID 에 대한 상태 변경이력을 JSON string 형태로 반환

```js
async getAssetHistory(stub, args){
		// 적절하지 않은 인자가 들어왔을 때
        if(args.length != 1){
            throw new Error('Incorrect number of arguments. Expecting assetID as an argument');
        }
      
        // Generate composite key
        let searchKey = stub.createCompositeKey("Asset.", [args[0]]);

        // Get the history of state 
        var historyIter = await stub.getHistoryForKey(searchKey);

        // Copy the history to array and parse to string
        let results = [];
        let res = {done : false};
    
        while(!res.done){
            res = await historyIter.next();
            try{
                if(res && res.value && res.value.value){
                    let val = res.value.value.toString('utf8');
        
                    if(val.length > 0){
                        results.push(JSON.parse(val));
                    }
                }
            }catch(err){
                console.info(err);
            }
            if(res && res.done){
                try{
                    historyIter.close();
                }catch(err){
                    console.info(err);
                }
            }
        }

        // Return the history as string
        return Buffer.from(JSON.stringify(results));
    }
```

- `getHistoryForKey`는 키의 값 기록을 반환

<br>

#### expireAssetOwnership

- 작품 소유권 소멸 함수
- asset ID에 대한 작품의 소유권 소멸 시점을 기록
- asset ID에 대한 expiredAt 정보를 기록
- 소유권 소멸 시점은 반드시 asset ID에 대한 현재 owner 만이 기록할 수 있다.
- 소멸 시점은 소유권 정보 구조의 expiredAt필드에 기록

```js
async expireAssetOwnership(stub, args){
        // 적절하지 않은 인자가 들어왔을 때
        if(args.length != 2){
            throw new Error('Incorrect number of arguments. Expecting 2, but received' + args.length);
        }

        // Generate composite key !!!
        let searchKey = stub.createCompositeKey("Asset.", [args[0]]);
        
        // asset정보 가져오기
        let asset = await stub.getState(searchKey);
        let assetInfo = JSON.parse(asset);        

    	// 현재 asset의 소유권 확인, owner만이 기록할 수 있도록
        if(args[1] != assetInfo.owner){
            throw new Error('Expire ownership operation is allowed to only current owner');
        }
        else{

        	// timestamp 등록
            let txTimestamp = stub.getTxTimestamp();
            let timestampString;
    
            let tsSec = txTimestamp.seconds;
            let tsSecValue = tsSec.low;
            
            let dataTimeObj = new Date(tsSecValue * 1000);
        	// timestamp formatting
            timestampString = dataTimeObj.getFullYear() + '-' + ('0' + (dataTimeObj.getMonth() + 1)).slice(-2) +'-' 
                            +('0'+dataTimeObj.getDate()).slice(-2)+' '+ (dataTimeObj.getHours() + 9) +':'
                            +('0'+dataTimeObj.getMinutes()).slice(-2)+ ':'+('0'+dataTimeObj.getSeconds()).slice(-2);
    
        	// expiredAt 필드 업데이트
            assetInfo.expiredAt = timestampString;
    
        	// Put state
            await stub.putState(searchKey, Buffer.from(JSON.stringify(assetInfo)));
        }
    }
```

<br>

#### updateAssetOwnership

- 작품 소유권 이전 함수

- 호출자는 assetID와 작품의 새로운 owner 정보를 이용하여 소유권 이전을 기록
- assetID에 대한 새로운owner 정보를 갱신
- 이전 시점은 소유권 정보 구조의 createdAt 필드에 기록

```js
async updateAssetOwnership(stub, args){
		// 적절하지 않은 인자가 들어왔을 때
        if(args.length != 2){
            throw new Error('Incorrect number of arguments. Expecting 2, but received' + args.length);
        }

        // Generate composite key
        let searchKey = stub.createCompositeKey("Asset.", [args[0]]);
        
        // asset에 대한 상태정보 가져오기
        let updatedAsset = await stub.getState(searchKey);
        let updatedAssetInfo = JSON.parse(updatedAsset);
    
        // stub를 사용해서 트랜잭션 타임스탬프 가져오기
        let txTimestamp = stub.getTxTimestamp();
        let timestampString;

        let tsSec = txTimestamp.seconds;
        let tsSecValue = tsSec.low;
        
        let dataTimeObj = new Date(tsSecValue*1000);

        // 타임스탬프 포매팅 'YYY-MM-DD HH:MM:SS'
        timestampString = dataTimeObj.getFullYear() + '-' + ('0' + (dataTimeObj.getMonth() + 1)).slice(-2) +'-' 
                        +('0'+dataTimeObj.getDate()).slice(-2)+' '+ (dataTimeObj.getHours() + 9) +':'+('0'+dataTimeObj.getMinutes()).slice(-2)+ ':'+dataTimeObj.getSeconds();

        // asset정보 업데이트 : owner, createdAt, expiredAt
        updatedAssetInfo.owner = args[1];
        updatedAssetInfo.createdAt = timestampString;
        updatedAssetInfo.expiredAt = 'FALSE'
    
        // Put the udpated asset information
        await stub.putState(searchKey, Buffer.from(JSON.stringify(updatedAssetInfo)));
        
    }
```







