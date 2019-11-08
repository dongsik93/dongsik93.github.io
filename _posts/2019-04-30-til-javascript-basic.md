---
layout: post
title: "JS basic"
subtitle: "JavaScript"
date: 2019-04-30 18:00:00 +0900
categories: til
tags: js
comments: true
---

## JS(java script)

### JS Basic Syntax

#### ES6

- `index.html` / `main.js` 만들기
  - `index.html` :  `!` + `tab`으로 자동완성
  - `body`에 `<sctript scr=".main.js"></script>` 로 
  - 스크립트 태그는 어디에 넣을까? : 바디태그 끝나기 전에 넣음

```javascript
// main.js
// 정적이던 문서에 움직임을 주기 위해서 JS사용
// index.html을 실행하면 팝업창에 메세지가 뜸 
alert("hello JS!!")	
```

```javascript
// main.js
//        문서에. 써줘 .   내용을
window.document.write('<h1>hello world!</h1>');
document.write('<h1>hello world!</h1>');
```

- `window` : 브라우저, 윈도우는 생략을 많이 함

  - `window.innerWidth` : 브라우저의 크기를 불러오는 함수

- ##### 자바스트립트의 함수를 변수로 사용 가능

- `document` : 윈도우 안에 포함되어있는 하얀색 바탕화면

  - 크롬창 `f12`를 눌러 개발자도구 - 콘솔창으로
  - 찾는건 `querySelector`를 이용해서 찾는다
  - `innerText`를 이용해 `querySelector`로 찾은 값을 가져오거나 변수처럼 사용해 값을 바꿀 수 있음
    - `document.querySelector('h1')`  
      - `document`에서 h1 태그를 찾아줘라는 함수
      - 첫번째 h1태그를 찾아줌
    - `document.querySelectorAll('h1')`
      - 얘는 전체를 찾아 리스트로 반환
    - `document.querySelector(".ah_k").innerText;`
      - 현재 naver 실검 1위를 찾아서 반환
    - `document.querySelector(".ah_k").innerText = "ssafy"`
      - 찾은값을 다른값으로 바꿈

- 변수설정 `var`

  - 요즘엔 `var`을 안쓰는걸 추천

  - ##### `'var`은 function-scoped'

```javascript
var name = 'ssafy';
```

```javascript
var a = 30

for (var a = 0; a < 10; a++){
    console.log(a)
}
console.log(a)

// 결과 : 
/*
0
1
2
3
4
5
6
7
8
9
10
*/
```

```javascript
function counter() {
    for(var i=0; i<10; i++){
        console.log('i',i)
    }
}
counter()
console.log('after loop i is', i)
// i is not defined
// function 밖에서는 접근이 안되기 때문
```



- 최신문법 `const` / `let` 

  - ##### 얘네는 block-scoped

    - block은 괄호와 괄호사이를 벗어나면 못가져옴

  - `let` 

    - `var`와 다른점은 `let`은 변수의 재사용이 안됨

  ```javascript
  let word = '외안되';
  document.write(word)
  // let은 평소 사용하던 변수와 똑같음
  word = "반갑습니다"
  document.write(word)
  
  let word = "이건 들어감 ??"
  // Identifier 'word' has already been declared
  // word라는 변수가 이미 사용이 되었기 때문에 오류 발생
  ```

  - `const`
    - 변하지 않는 값(상수)을 넣을 때 사용

  ```javascript
  const word2 = "왜안돼"
  document.write(word2)
  
  word2 = "무고"
  document.write(word2)
  // Assignment to constant variable
  // word2가 const, 즉 상수로 선언이 되어있기 때문에 수정 x
  ```


```javascript
const firstName = "happy";
const lastName = "hacking";
const fullName = firstName + lastName;
document.write('<h1>' + fullName + '!!' + '</h1>');
// happyhacking!!이 출력
document.write(`<h1>${fullname}!!</h1>`);
// 템블릿 문자열(Backtic)을 사용하면 f-string처럼 사용 가능
console.log(`Console ${fullName}`);
// print()와 같음
```

- `prompt` = input()

```javascript
const userName = prompt('너 누구야?');
// 페이지에 팝업창이 뜨면서 입력을 가능하게 해줌(input())
let message = `${userName}님 반갑습니다`;
document.write(`<h1>${message}</h1>`);
// 입력받은 값이 userName에 저장되어 있으므로 이를 message 변수에 담아서 출력
```

- `if문` 

```javascript
const userName = prompt('너 누구야!');
let message = '';
if(userName === 'admin') {
    document.write("관리자님 어서오세요");
} else if(userName === "dongsik"){
    document.write("마 !동식님 어서오세요");
} else{
    document.write(`${userName}님 어서오세요`);
}
```

- `==` : 느슨한 같음( 값을 비교 )
- `===` : 엄격한 같음 ( 형을 비교 ex) int, str...)

- 삼항연산자

```javascript
const number = 10
let result = number === 10 ? document.write("10은 10이지") : document.write("False")

number === 10 ? document.write("10은 10이지") : document.write("False")
```

- `hoisting`
  - 지양
  - `let` / `const`는 x

```javascript
console.log(number)

var number = 10

console.log(number)

// 실제로 js가 읽을때는 
/*
var number
console.log(number)
number = 10
console.log(number)로 바꾸어서 실행을 한다
*/
```



### Node.js

v 10.15.3

```
# js폴더로 이동
$ touch node.js
```

```javascript
// node.js
let a = 1
console.log(a)
```

```
$ node node.js
>>> 1 출력
```

- python과 똑같이 코드를 작성할 수 있는 환경

- `node.js`는 시스템을 통제 , `window`, `document` 명령어는 안됨

```javascript
// node.js
let list = [1,2,3,4]

for(let item of list){
    console.log(item)
}

for(let item2 in list){
    console.log(list[item2])
}

// 위의 for문은 for item in list와 동일
```



```javascript
for(let number of [1,2,3,4,5]){
    console.log(number)
}

for(const number of [1,2,3,4,5]){
    console.log(number)
}
// let과 const는 block-scoped이기 때문에 {}로 block이 끝나서 number가 서로 간섭없이 돌아가게 됨
```

- ##### javascript array method(배열)

```javascript
let numbers = [1,2,3,4]

numbers.reverse()
numbers.push('a') // push의 리턴은 push된 인자의 길이를 추가한 numbers의 길이 
numbers.pop() // 마지막 아이템 제거

numbers.shift() // 첫번째 아이템 제거
>>> [2,3,4]

numbers.unshift('a') // 맨앞에 아이템 추가
>>> ['a',1,2,3,4]

q = numbers.includes(1)
>>> true

q = numbers.join('-')
>>> 1-2-3-4

q = numbers.indexOf(3)
>>> 2

q = numbers.indexOf('b')
>>> -1 // 존재하지 않을 때
```

- ##### javascript object (딕셔너리)

```javascript
const me = {
    name:'ssafy',
    'phone number':'01011121112',
    languageLevel : {
        python:"master",
        django:'pro',
        javascript:'junior',
    }
}

console.log(me.name)
console.log(me['phone number'])
console.log(me.languageLevel)
console.log(me.languageLevel.python)
```

- ##### `JSON`형식으로 바꾸기

```javascript
const dessert = {
    coffee : 'Americano',
    iceCream : 'Cookie and cream',
}

console.log(typeof (dessert))
>>> object
console.log(dessert)
>>> { coffee: 'Americano', iceCream: 'Cookie and cream' }

// JSON형태로 바꾸기
// javascript에서 JSON을 읽을 수는 없고 string으로
const jsonData = JSON.stringify(dessert)
console.log(typeof (jsonData))
>>> string
console.log(jsonData)
>>> {"coffee":"Americano","iceCream":"Cookie and cream"}

// 다시 object로 변환
const parseData = JSON.parse(jsonData)
>>> object
console.log(typeof (parseData))
>>> { coffee: 'Americano', iceCream: 'Cookie and cream' }
```

- ##### 함수(1급객체) 

  - 1급객체의 조건(3가지 모두 충족해야 함)
    - 변수에 할당이 가능
    - 객체의 인자로 넘길 수 있어야 한다
    - 객체의 리턴값으로 리턴할 수 있어야 한다

- 함수형태의 여러 종류

- 함수 1

```javascript
function add(num1, nun2){
    return num1 + num2
}
consol.log(add(5,10))
>>> 15

// 변수에 할당
const sub = function(num1, num2){
    return num1 - num2
}
consol.log(sub(10,4))
>>> 6

// ES6
// function이 => 화살표로 바뀜
const mul = (num1, num2) => {
    return num1 * num2
}
console.log(mul(2,3))
>>> 6

```

- 함수 2

```javascript
const min = (list) => {
    // 여기서 선언한 let minV은 cosnt min 함수내의 블락 안에서만 사용이 가능함
    // Infinity는 가장 큰 값
    let minV = Infinity
    for(const i of list){
        // 블락 안의 minV이기 때문에 사용이 가능
        if(i <= minV){
            minV = i
        }
    }    
    return minV
}

console.log(min([11,33,44,55,6]))
>>> 6

const min = (list) => {
    let minV = Infinity
    for(const i of list){
        if(i <= minV){
            // 이렇게 여기서 let min을 다시 선언하게 되면 위에서 정의한 min이 아니라 새로 정의되는 min에다가 i를 저장하기 때문에 값이 다르게 나옴
            let minV = i
        }
    }    
    // 맨위 블락안의 min을 참조
    return minV
}

console.log(min([11,33,44,55,6]))
>>> 9999

```

- 함수 3'

```javascript
// return을 생략한 함수 형태
square = (num) => num ** 2
```

- 인자 없는 함수(잘 안씀)

```javascript
let noArgs = () => 'No args'
noArgs = _ => 'No args'
```

- 기본인자함수

```javascript
// 기본인자함수
const sayHello = (name='noName') => {
    return `hi ${name}`
}

console.log(sayHello('john'))
>>> hi john

console.log(sayHello())
>>> hi noName
```

- 익명함수(`***`)
  - 1회용으로 사용할 함수는 이름을 짓지 않을 수 있다.
  - `;` 뒤에 붙어야 함

```javascript
// 익명함수 선언
(function (num) { return (num**2)})

// 값을 넣어서 바로 출력
(function (num) { console.log(num**2)})(5);
>>> 5

// 익명함수 선언
((num) => { return (num**2)})

// 값을 넣어서 바로 출력
((num) => {console.log(num**2)})(5);
>>> 5
```



- ##### 콜백(Callback)

```javascript
// 배열을 인자로 받아서 그 배열의 모든 수의 합을 리턴
const num_sum = (numbers) =>{
    let sum = 0
    for(const number of numbers){
        sum += number
    }
    return sum
}

console.log(num_sum([1,2,3,4,5,6,7,8,9,10]))

// 배열을 인자로 받아서 그 배열의 모든 수를 다 빼는 함수
const num_sub = (numbers) =>{
    let sum = 0
    for(const number of numbers){
        sum -= number
    }
    return sum
}

console.log(num_sub([1,2,3,4,5,6,7,8,9,10]))

// 배열을 인자로 받아서 그 배열의 모든 수를 다 곱하는 함수
const num_mul = (numbers) =>{
    let sum = 1
    for(const number of numbers){
        sum *= number
    }
    return sum
}

console.log(num_mul([1,2,3,4,5,6,7,8,9,10]))
```

- 위의 함수들은 거의 다 비슷한 구조
- 간결함? 을 위해서

```javascript
// 배열의 요소들을 각각 [???] 한다.

const numbersEach = (numbers, callback) => {
    let sum
    for(const number of numbers){
        // 인자로 들여온 callback함수 실행
        sum = callback(number, sum)
    }
    return sum
}

const addEach = (number, sum=0) => {
    return number + sum
}

const subEach = (number, sum=0) => {
    return number - sum
}

const mulEach = (number, sum=1) => {
    return number * sum
}

console.log(numbersEach([1,2,3,4,5,6,7,8,9,10], addEach))
console.log(numbersEach([1,2,3,4,5,6,7,8,9,10], subEach))
console.log(numbersEach([1,2,3,4,5,6,7,8,9,10], mulEach))
```









​    



