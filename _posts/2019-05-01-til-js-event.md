---
layout: post
title: "JS Event"
subtitle: "javascript"
date: 2019-05-01 18:00:00 +0900
categories: til
tags: js
comments: true
---

## JS Event

### EventListener


- ##### 마우스 이벤트

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="me"></div>
    <button id="my-btn">click</button>

    <script>
        /*
            [무엇]을  [언제]   [어떻게] 한다.
            버튼을   클릭하면     뿅    한다.
        */

        // 1. 무엇 => 버튼
        const button =  document.querySelector('#my-btn')
        console.log(button)

        // 3. 어떻게 => 뿅이라는 단어를 쓴다
        const what = (e) => {
            const area = document.querySelector('#me')
            area.innerHTML = "<h1>뿅</h1>"
            console.log(e)
        }
        
        // 2. 언제 => 버튼을 '클릭' 하면
        // button.addEventListener('click', what)
        // what대신에 익명함수로 : 1회용으로 쓰기 위해
        // event에 소괄호는 함수의 인자가 한개이기 때문에 생략이 가능
        button.addEventListener('click', event => {
            const area = document.querySelector('#me')
            area.innerHTML = "<h1>뿅</h1>"
            console.log(event)
        })
        
		// 1. 무엇 => 얍 버튼
        const yap = document.querySelector('#hello-btn')
        // 2. 언제 => 얍 버튼을 '클릭' 하면
        yap.addEventListener('click', event => {
            // 3. 어떻게 => 안녕하세요라는 단어의 색깔을 바꾼다
            const hello = document.querySelector('#hello')
            hello.style.color = 'red'
        })
    </script>
</body>
</html>
```

- ##### 키보드 이벤트

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
        .bg {
            background-color: #F7F7F7;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <div class="bg">
        <img id="dino" width="100px" heigth="100px" src="https://is4-ssl.mzstatic.com/image/thumb/Purple118/v4/88/e5/36/88e536d4-8a08-7c3b-ad29-c4e5dabc9f45/AppIcon-1x_U007emarketing-sRGB-85-220-0-6.png/246x0w.jpg" alt="dino">
    </div>

    <script>
        const dino = document.querySelector('#dino')
        dino.addEventListener('click', (e) => {
            console.log("아야")
        })
   
        let x = 0
        let y = 0
        document.addEventListener('keydown', e => {
            // console.log(e)
            if(e.code === "ArrowUp"){
                console.log("위 화살표")
                y -= 20
                dino.style.marginTop = `${y}px`
            }else if(e.code === "ArrowDown"){
                console.log("아래 화살표")
                y += 20
                dino.style.marginTop = `${y}px`
            }else if(e.code === "ArrowLeft"){
                console.log("왼쪽 화살표")
                x -= 20
                dino.style.marginRight = `${x}px`
            }else if(e.code === "ArrowRight"){
                console.log("오른쪽 화살표")
                x += 20
                dino.style.marginRight = `${x}px`
            }else{
                console.log(`${e.code}버튼을 눌렀습니다`)
            }
        })
    </script>
</body>
</html>
```



webAPI

- JSONPlaceholder
  - rest api를 테스트할 수 있도록



- javascript로 요청보내기

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <script>
        // const URL = "https://jsonplaceholder.typicode.com/posts"

        // // 인스턴스 생성
        // const XHR = new XMLHttpRequest()

        // // (1)어떤방식인지, (2)어디로 보낼지
        // XHR.open('GET', URL)
        // XHR.send()
        // XHR.addEventListener('load', function(e){
        //     const result = e.target.response
        //     // console.log(result)
        //     // javascript에서 읽을 수 있는 데이터로 변환
        //     const parseData = JSON.parse(result)
        //     console.log(parseData)
        // })

        const URL = "https://jsonplaceholder.typicode.com/posts"
        const XHR = new XMLHttpRequest()

        XHR.open('POST', URL)
        // Header에  
        XHR.setRequestHeader(
            'Content-type', 'application/json;charset=UTF-8'
        )
        // 이 데이터를 post방식으로 서버에 전달
        const data = {
            title : "안녕하세요",
            body : "곧 있으면 점심시간", 
            userId : 1
        }
        // data를 json으로 바꿔서 보내기
        const jsonData = JSON.stringify(data)
        XHR.send(jsonData)
        XHR.addEventListener('load', function(e){
            const result = e.target.response
            // javascript에서 읽을 수 있는 데이터로 변환
            const parseData = JSON.parse(result)
            console.log(parseData)
        })
    </script>
</body>
</html>
```
