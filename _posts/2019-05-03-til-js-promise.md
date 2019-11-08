---
layout: post
title: "JS promise"
subtitle: "JavaScript"
date: 2019-05-03 17:00:00 +0900
categories: til
tags: js
comments: true
---


## JS Prmoise


### Promise복습

```javascript
// arrow function으로 사용하려면 return과 {}를 생략해야 됨
const makeOrder = function (order) {
    return new Promise((resolve, reject) => {
        let coffee;
        setTimeout(function() {
            if(order === undefined){
                reject("주문 잘못함")
            }else{
                coffee = order
                resolve(coffee)
            }
        }, 3000)
    })
}
// nonblocking을 blocking으로 처리
const getCoffee = function(order){
    try{
        const coffee = makeOrder(order)
    }
    catch(error){
        console.log(error)
    }
}

getCoffee("Americano")
>>> UnhandledPromiseRejectionWarning: 주문 잘못함
// 현재 nonblocking하게 작동하기 때문에
```

- 해결
  - `async` 
  - `await`

```javascript
// async 추가
const getCoffee = async function(order){
    try{
        // await 추가
        // await가 붙으면 오른쪽 함수가 끝나지 않으면 반환 안됨
        const coffee = await makeOrder(order)
        console.log(coffee)
    }
    catch(error){
        console.log(error)
    }
}

getCoffee("Americano")
```