---
layout: post
title: "Firebase,Vue 채팅구현"
subtitle: "채팅 구현"
date: 2019-05-09 18:00:00 +0900
categories: til
tags: js
comments: true
---

## Firebase와 Vue를 이용해 채팅 구현해보기

### Chat

- `firebase`와 `vue`를 이용해 채팅 구현

  - Realtim Database - testmode
  - `firebase`와 `vue` 설정(initialize)

  ```html
  <!-- head태그에 -->
  <!-- Vue -->
  <script src="https://unpkg.com/vue/dist/vue.js"></script>
  <!-- firebase 설정 -->
  <script src="https://www.gstatic.com/firebasejs/5.9.1/firebase.js"></script>
  <!-- VueFire -->
  <script src="https://unpkg.com/vuefire/dist/vuefire.js"></script>
  <script>
      var config = {
          apiKey: "AIzaSyA_S-CkyzfjiLK8fmGJj7UyjeeAPVRDYQE",
          databaseURL: "https://chat-5777c.firebaseio.com",
          projectId: "chat-5777c",
      };
      firebase.initializeApp(config);
  </script>
  ```

- `firebase login ui` 

```html
<!-- head태그 -->
<!-- firebase login ui -->
<script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
```

- `login ui`시작

```js
<div id="app">
        <div id="firebaseui-auth-container"></div>  
</div>
    
const auth = firebase.auth()
const ui = new firebaseui.auth.AuthUI(auth)
```



- app.initUi()

```javascript
<script>    
        const database = firebase.database()
        const auth = firebase.auth()
        const ui = new firebaseui.auth.AuthUI(auth)

        const app = new Vue({
            el:"#app",
            firebase:{
                // 메세지와 연결
                message:database.ref('message')
            },
            methods:{
                // ui적용
                initUi:function(){
                    // 설정 값
                    const config = {
                        // 어떤식으로 로그인 하는지
                        signInOptions:[
                            firebase.auth.EmailAuthProvider.PROVIDER_ID
                        ],
                        // 로그인이 성공한 다음에 어떻게 하는지
                        callbacks:{
                            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                            // User successfully signed in.
                            // Return type determines whether we continue the redirect automatically
                            // or whether we leave that to developer to handle.
                                this.currentUser.uid = authResult.user.uid
                                this.currentUser.email = authResult.user.email
                                this.currentUser.displayName = authResult.user.displayName

                                // 위 구조가 true이면 redirect하는데 redirect할 필요가 없으니까 로그인 창이 숨겨지도록 false를 return해줌
                                return false;
                            }
                        }
                    }   
                    ui.start('#firebaseui-auth-container',config)
                }
            },

        })
    
</script>
```



- `vue lifecycle` : vue 인스턴스 생성 주기

![994C103B5A7878FE22](C:\Users\student\dongsik\TIL\JS\994C103B5A7878FE22.jpg)



```javascript
// methods와 같은 레벨에 추가,
// mounted라는 타이밍에 iniUi를 실행
mounted: function(){
    this.initUi()
}
```

- `firebase` - Authentication 설정 - 로그인 방법 설정 - 이메일 사용 설정
- 로그인 정보 수정

```javascript
// mounted라는 타이밍에 iniUi를 실행
mounted: function(){
    // 로그인정보가 변경이 되면 
    auth.onAuthStateChanged( (user)=>{
        // user가 존재하면
        if(user){
            this.currentUser.uid = user.uid
            this.currentUser.email = user.email
            this.currentUser.displayName = user.displayName
            // undefined이면(존재하지 않으면), 즉 로그아웃했으면
        }else{
            this.initUi()
        }
    })
```

- 로그인 / 로그아웃 구현

```html
<body>
    
    <div id="app">
        <div v-if="currentUser.uid">   
            <!-- 로그인 했을 때 -->
            <!-- 채팅 칠수 있는 공간으로 -->
            <span>{{currentUser.displayName}}님 안녕하세요</span>
            <span>{{currentUser.email}}님 안녕하세요</span>
            <button @click="logout" >로그아웃</button>
        </div>
        <div v-else>
            <!-- 로그인 안했을 때 -->
            <div id="firebaseui-auth-container"></div>  
        </div>
    </div>
    
    <script>    
    
        const database = firebase.database()
        const auth = firebase.auth()
        const ui = new firebaseui.auth.AuthUI(auth)

        const app = new Vue({
            el:"#app",
            firebase:{
                // 메세지와 연결
                message:database.ref('message')
            },
            data:{
                newMessage:'',
                currentUser:{
                    uid:'',
                    email:'',
                    displayName:'',
                }
            },
            methods:{
                // ui적용
                initUi:function(){
                    // 설정 값
                    const config = {
                        // 어떤식으로 로그인 하는지
                        signInOptions:[
                            firebase.auth.EmailAuthProvider.PROVIDER_ID
                        ],
                        // 로그인이 성공한 다음에 어떻게 하는지
                        callbacks:{
                            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                            // User successfully signed in.
                            // Return type determines whether we continue the redirect automatically
                            // or whether we leave that to developer to handle.
                                this.currentUser.uid = authResult.user.uid
                                this.currentUser.email = authResult.user.email
                                this.currentUser.displayName = authResult.user.displayName

                                // 위 구조가 true이면 redirect하는데 redirect할 필요가 없으니까 로그인 창이 숨겨지도록 false를 return해줌
                                return false;
                            }
                        }
                    }   
                    ui.start('#firebaseui-auth-container',config)
                },
                logout:function(){
                    // 현재 vue인스턴스와 firebase에 로그인 되어있는 정보를 날려줌
                    // vue인스턴스 초기화
                    this.currentUser = {
                        uid:'',
                        email:'',
                        displayName:'',
                    }
                    // firebase초기화
                    auth.signOut()
                }
            },
            // mounted라는 타이밍에 iniUi를 실행
            mounted: function(){
                // 로그인정보가 변경이 되면 
                auth.onAuthStateChanged( (user)=>{
                    // user가 존재하면
                    if(user){
                        this.currentUser.uid = user.uid
                        this.currentUser.email = user.email
                        this.currentUser.displayName = user.displayName
                    // undefined이면(존재하지 않으면), 즉 로그아웃했으면
                    }else{
                        this.initUi()
                    }
                })

            }

        })
    
    </script>

</body>
```



- 채팅창 만들기

```html
<body>
    <!-- 채팅창 -->
    <!-- enter나 보내기를 눌러도 값을 보낼 수 있도록 -->
    <input type="text" v-model="newMessage" @keyup.enter="createMessage">
    <button @click="createMessage">보내기</button>
   
    <li v-for="m in message">
        <b>{{m.author}}</b> : {{m.content}}
    </li>

    // methods에 추가
    createMessage:function(){
        // firebase데이터베이스에 푸시
        this.$firebaseRefs.message.push({
        author: this.currentUser.displayName,
        content: this.newMessage
        })
        this.newMessage = '' 
        },
    
</body>
```

- `github.io`에 추가하면 됨
  - github은 html코드를 렌더링 해주기 때문

- `firebase`에 배포