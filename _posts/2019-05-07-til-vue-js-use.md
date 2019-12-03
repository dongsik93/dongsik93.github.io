---
layout: post
title: "Vue.js 활용"
subtitle: "Vue.js"
date: 2019-05-07 18:00:00 +0900
categories: til
tags: js
comments: true
---

## Vue.js 활용

### directive


- `v-text`

```html
 <div id="app">
     <h1>{{message}}</h1>
     <h1 v-text="message"></h1>
</div>

const app = new Vue({
        el:"#app",
        data:{
            message:"안녕하세요",
        }
    })
```

- `v-html`
  - 웹사이트에서 임의의 html동적으로 렌더링하면 xss공격당할 수 있으니 v-html은 사용자가 제공한 컨텐츠에서 `절대로` 사용하면 안됨

```html
<div id="app">
    <div>
        <!-- h3가 적용이 안됨 -->
        {{msg}}
    </div>
    <!-- 적용됨 -->
    <div v-html="msg"></div>
</div>

 const app = new Vue({
        el:"#app",
        data:{
            message:"안녕하세요",
            msg:"<h3>이거됨?</h3>",
        }
    })
```

- `v-show`와 `v-if`의 차이
  - `v-show`는 렌더링은 했지만 안보이는 상태(html 코드는 존재하나 숨겨져 있는 상태)
  - `v-if`는 렌더링 자체가 안됨(html코드도 x)

```html
<div id="app">
    <!-- 보임 -->
    <h1 v-show="true">쇼 이거보임?</h1>
    <h1 v-if="true">이프 이거보임?</h1>
    
    <h1 v-show="false">쇼 이거보임?</h1>
    <h1 v-if="false">이프 이거보임?</h1>
</div>
```

- `v-for`와 `v-if`중 우선순위는 `v-for`
- `v-on` : 이벤트 등록
- `v-bind`
  - 약어 : `:`

```html
<a v-bind:href="url">네이버</a>
<!-- 약어 사용 -->
<a :href="url">네이버</a>

const app = new Vue({
        el:"#app",
        data:{
            url:"https://www.naver.com",
        }
    })
```

- `v-model`
  - `input` // `select` // `textarea` 에 사용할 수 있음
    - 입력값

```html
<select v-model="select">
    <!-- value = 보내주는 값, 태그 내의 한글은 보여주는 값 -->
    <option value="all">전체보기</option>
    <option value="complete">완료한것</option>
    <option value="active">아직 안한것</option>
</select>

const app = new Vue({
        el:"#app",
        data:{
            todos:[
                {text:"공부하기",complete:true},
                {text:"밥먹기",complete:true},
                {text:"퇴근하기",complete:true},
            ],
            select:'all',
        }
    })
```



- `console`창에서 접근

  - app.message
    - "안녕하세요"
  - app.todos[0].text
    - "공부하기"
  - app.$data
    - Vue인스턴스 밑에 data에 대한 속성값을 object로 리턴
  - app.$el
    - Vue인스턴스 밑에 el에 대한 속성값을 object로 리턴


### Computed속성

- `computed`와 `methods`의 차이
  - `methods`는 실행 할 때마다 계속해서 재실행
  - `computed`는 연산을 하고 렌더링 된 후에는 그 값을 계속 유지하고 있음(캐싱)

```html
<div id="app">
    {{message}}
    <!-- 선언문은 사용 불가 -->
    {{ const a = 10 }}
    <!-- 분기문도 사용 불가	-->
    {{ if(true){return 10}}}
    <!-- 3항 연산자는 사용 가능 -->
    {{ true ? 100 : 0 }}			
    {{message.split('').reverse().join('')}}
    {{message + "!!!!"}}
    
    <h1>{{ reverseMsg }}</h1> 
    <h1>{{ reverseMessage() }}</h1>

</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    const app = new Vue({
        el:"#app",
        data:{
            message:"hello",
        },
        computed:{
            reverseMsg:function(){
                return this.message.split('').reverse().join('')
            }
        },
        methods:{
            reverseMessage:function(){
                return this.message.split('').reverse().join('')
            }
        }
    })
</script>
```



#### the cat api

- the cap api와  axios를 사용

```html
<div id="app">
    <button v-on:click="getCat">야옹</button>
    <button v-on:click="getDog">멍멍</button>

    <img v-bind:src="img">
    <img v-bind:src="image2">
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>

    const app = new Vue({
        el:"#app",
        data:{
            image:"",
            image2:"",
        },
        methods:{
            //  여기는 function()으로 해줘야 함
            getCat:function(){
                const URL = "https://api.thecatapi.com/v1/images/search"
                // console.log(axios.get(URL) 
                // Promise 객체 반환 : resolved(성공)
                // 성공했을 땐 then(callback)
                // 외부 라이브러리의 callback 함수는 애로우 function으로
                axios.get(URL).then((response) => {
                    // console창에서 url보기
                    //console.log(response.data[0].url)
                    
                    // data안의 image에 url 저장
                    this.image = response.data[0].url
                })
            },
            // dog ceo
            getDog:function(){
                const URL = "https://dog.ceo/api/breeds/image/random"
                axios.get(URL).then((response) => {
                    this.image2 = response.data.message
                })
            }
        }
    })

</script>
```



- `methods`안의 함수 정의는 `function()`으로 해주고 그 함수 안에서의 `callback`함수는 `arrow function`으로 해줘야 함
  - this 객체가 가르키는 범위가 다르기 때문
  - callback함수를 function으로 해줬을 때 this객체는 window를 가리킴

- 여러개 출력

```html
<body>
    
    <div id="app">
        <!-- v-on의 약어는 @ -->
        <button v-on:click="getCat">야옹</button>
        <button @click="getDog">멍멍</button>
        <!-- 수정 -->
        <img v-for="image in images" v-bind:src="image">
        <img v-for="image2 in images2" v-bind:src="image2">
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script>
    
        const app = new Vue({
            el:"#app",
            data:{
                images:[],
                images2:[],
            },
            methods:{
                getCat:function(){
                    const URL = "https://api.thecatapi.com/v1/images/search"
                    axios.get(URL).then((response) => {
                        // 수정
                        this.images.push(response.data[0].url)
                    })
                },
                getDog:function(){
                    const URL = "https://dog.ceo/api/breeds/image/random"
                    axios.get(URL).then((response) => {
                        // 수정
                        this.images2.push(response.data.message)
                    })
                }
            }
        })

    </script>

</body>
```





#### Watch속성

- `computed`는 선언형 프로그래밍 방식
- `watch`는 명령형 : 동작을 , 변화가 일어나면 함수 실행

```html
<body>
    
    <div id="app">
        <h1 v-text="title"></h1>
        <input v-model="question">
        <!-- <h3>{{question}}</h3> -->
        <h3>{{answer}}</h3>
        <img v-bind:src="img">
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>   
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

    <script>
        const app = new Vue({
            el:"#app",
            data:{
                title:"질문을 입력해 주세요",
                question:"",
                img:"",
                answer:"",
            },
            watch:{
                // question이라는 값이 변동이 일어나면 함수를 실행시킴
                // 위에 만들었던 data의 이름과 동일하게 적어줘야 함
                
                question:function(){
                    this.answer = "입력중 입니다."
                    this.getAnswer()
                //     console.log(this.question)
                //     axios.get("https://yesno.wtf/api").then((response)=>{
                //         //console.log(response.data)

                //         // image를 가져옴
                //         this.answer = response.data.image
                //         // answer를 가져옴
                //         this.answer2 = response.data.answer
                //     })
                }
            },
            methods:{
                getAnswer:function(){
                    if(this.question[this.question.length-1] == "?"){
                        console.log(this.question)
                        this.answer = "생각중입니다"
                        axios.get("https://yesno.wtf/api").then((response)=>{
                            this.img = response.data.image
                            this.answer = response.data.answer
                        })
                    }
                }
            },
        })
    </script>

</body>
```





### 자료형

```js
typeof null
>>> object

typeof undefined
>>> undifined

null : 값이 없다
undefined : 정의되지 않았다

typeof (() => {})
>>> function

typeof (function(){})
>>> function

typeof []
>>> object

typeof ()
>>> object

typeof Nan
>>> number

1+"asdf"
>>> 1asdf

typeof 1 + typeof(()=>{})
>>> numberfunction (결과값이 이어서 붙여진 것)
>>> number / function
```
