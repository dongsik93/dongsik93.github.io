---
layout: post
title: "JS method"
subtitle: "JavaScript"
date: 2019-05-02 18:00:00 +0900
categories: til
tags: js
comments: true
---

## JS method


- ##### 함수호출

```javascript
function printHello(){
    console.log('hello')
}

function baz(){
    setTimeout(printHello, 3000)
}

function bar(){
    baz()
}

function foo(){
    bar()
}

foo()
```

`Call Stack` 

- `foo ` (foo가 끝나지 않고) -> `bar` -> `baz` -> 3초 기다리고 ->  `printHello` 하고 나머지 함수들 종료



#### Call back 함수

- addeventListener ('click', Call back 함수)



### Array(배열) helper method



- ##### forEach()

  - forEach에는 매개변수 3개 들어옴
  - forEach(function(currentValue(요소 값), Index(요소 인덱스), Original(자기자신)))

```javascript
const colors = ["red", "green", "yellow"]

// for(const color of colors){
//     console.log(color)
// }

// 위, 아래는 같은 결과

colors.forEach( (color) => {
    console.log(color)
})
```



```javascript
function handlePosts(){
    const posts = [
        {id:1, title:"hihi"},
        {id:13, title:"hello"},
        {id:17, title:"123123"},
    ]
    for(let i=0; i < posts.length; i++){
        console.log(posts[i].title)
    }
}

handlePosts()

function handlePosts2(){
    const posts = [
        {id:1, title:"hihi"},
        {id:13, title:"hello"},
        {id:17, title:"123123"},
    ]
    posts.forEach(function(post, index){
        console.log(post.title)
        console.log(index)
    })
}

handlePosts2()
```



- ##### map()

  - 하나하나 돌면서 그 값을 배열로 리턴해줌

```javascript
const numbers = [1,2,3]

const double = numbers.map(function(number){
    return number * 2
})

console.log(double)
>>> [2,4,6]
```

```javascript
const images = [
    {h:"30px", w:"30px"},
    {h:"50px", w:"500px"},
    {h:"100px", w:"1000px"},
]
// h만 가지고 있는 배열을 따로 만들기
const h = images.map(function(height){
    return height.h
})

console.log(h)
>>> [ '30px', '50px', '100px' ]

const trips = [
    {distance : 30, time:10},
    {distance : 90, time:50},
    {distance : 59, time:25},
]
// 속도값이 들어있는 배열을 반환

const speed = trips.map((trip)=>{
    return trip.distance / trip.time
})

console.log(speed)
>>> [ 3, 1.8, 2.36 ]
```

- ##### filter()

  - 조건에 맞는 전체

```javascript
const products = [
    {name: 'phone', value:100},
    {name: 'notebook', value:200},
    {name: 'desktop', value:300},
    {name:'mouse', value:1}
]

const twoH = products.filter(function(p){
    return p.value === 200
})

console.log(twoH)
```



```javascript
// 1번
const numbers = [10,20,30]

function rejet(array, callback){
    return array.filter(function(item){
        return callback(item)
    })
}

const lessThan15 = rejet(numbers, function(number){
    return number < 15
})

console.log(lessThan15)

// 2번
const numbers = [10,20,30]

function rejet(array, callback){
    return array.filter(function(item){
        // !는 true이면 false로 false이면 true로
        // 함수에는 ! 안됨
        return !callback(item)
    })
}

const lessThan15 = rejet(numbers, function(number){
    return number > 15
})

console.log(lessThan15)

// 3번
const numbers = [10,20,30]

function rejet(array, callback){
    return array.filter(callback)
}

const lessThan15 = rejet(numbers, function(number){
    return number < 15
})

console.log(lessThan15)
```

- ##### find()

  - 조건에 맞은 첫번째 인자를 찾음

```javascript
const heros = [
    {name: "tony stark"},
    {name: "thor"},
    {name: "iron man"},
]

const tony = heros.find(function(hero){
    return hero.name == "tony stark"
})

console.log(tony)
```



- ##### 동기 // 비동기
  - `blocking` - `python`
    - 다른 함수가 실행이 되지 않도록 막고있음
  - `non-blocking` - `javascript`
    - 안 막음
    - 순서대로 실행되는걸 보장하지 않음
    - `single thread `이기 때문 그래서 `call back`을 사용해 blocking할수 있도록 함
      - 많은 `call back`은 안좋아서 ES6에서 `promise` 라는걸로..?



```javascript
// function makeOrdeR(){}
const makeOrder = function(order){
    let coffee

    setTimeout(function(){
        coffee = order
    },3000)

    return coffee
}

const coffee = makeOrder("Americano")
console.log(coffee)

>>> undefined
3초후
>>> 

// nonblocking으로 돌아가니까 안되는 것
```

- `call back`을 이용한 해결

```javascript
const makeOrder = function(order, serve){
    let coffee

    setTimeout( function(){
        coffee = order
        serve(coffee)
    }, 3000)
    return coffee
}
// 두번째에는 다음에 실행시킬 함수를 넣어줌
const coffee = makeOrder("Americano", console.log)
>>> 3초 후에 
>>> Americano
```

- `Promise`를 이용한 해결

```javascript
// 1 . 오더를 받는다.
// 2 . 종업원이 약속을 한다.(잘 됐는지 안됐는지를)
// 2-1. 다 만들면 resolve로 커피를 주고
// 2-2. 문제가 있으면 reject로 알려준다.

const makeOrder = (order) => /* Promise 객체 생성*/ new Promise(function(resolve, reject){
        let coffee

        setTimeout(function() {
            // 실패한 경우
            if(order === undefined){
                reject("주문 잘못하셨어요")
            } else{
                // 성공한 경우
                coffee = order
                resolve(coffee)
            }
        }, 3000)
    })

makeOrder()
// then이 실행되려면 항상 앞의 함수가 성공해야 함.
.then((coffee) => {console.log(coffee)}) // 성공
.catch((error) => {console.log(error)}) // 실패

>>> 3초후
>>> Americano

makeOrder()
.then((coffee) => {console.log(coffee)})
.catch((error) => {console.log(error)})

>>> 3초후
>>> 주문 잘못하셨어요

makeOrder()
.then((coffee) => {console.log(coffee)}) // 성공
.catch((error) => {console.log(error)}) // 실패
.then((coffee) => {console.log(coffee)}) // 성공을하던 실패를하던 출력 : then과 catch의 순서가 중요한 이유

// makeOrder에 undefined가 넘어가기 때문에 "주문 잘못하셨어요"가 출력되고
// .then과 .catch를 건너 뛰고 2번째 .then을 출력
>>> 3초후
>>> 주문 잘못하셨어요
>>> undefined
```



















