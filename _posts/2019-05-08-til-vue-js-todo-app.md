---
layout: post
title: "Vue.js todo"
subtitle: "Vue.js"
date: 2019-05-08 18:00:00 +0900
categories: til
tags: js
comments: true
---

## JS를 이용한 Todo app 만들기

### Todo app



- 새로고침해도 데이터 안날아 가게

- 브라우저가 가지고있는 스토리지에 저장!



- `momentum` 설치
  - 개발자도구 - Application - Local Storage - chrome-extension
  - 작성한 Todo는 여기에 저장됨



```html
<style>
    .completed{
        // 삭선
        text-decoration: line-through;
        // 투명도
        opacity: 0.6;

    }
</style>

<div id="app">
        <h1>{{title}}</h1>
        <!-- 목록 선택 -->
        <select v-model="status">
            <option value="all">전체보기</option>
            <option value="active">할일</option>
            <option value="completed">한일</option>
        </select>

        <!-- todo추가 -->
        <!-- 엔터키가 눌렸을 때 addTodo실행 -->
        <input type="text" v-model="newTodo" @keyup.enter="addTodo">

        <!-- 클래스는 이렇게 적어야 됨. completed가 true이면 작동, false이면 작동안함 -->
        <!-- v-bind:key 를 통해 체크박스 오류 해결-->
        <li v-for="todo, idx in todosByStatus()" v-bind:class="{completed: todo.completed}" v-bind:key="todo.id">
            <!-- 체크박스 & 양방향 바인딩 -->
            <!-- v-model에 의해 completed값이 true인 애들은 체크박스에 체크된 상태로 나옴 -->
            <input type="checkbox" v-model="todo.completed">
            {{todo.content}}
            <button v-if="todo.completed" @click="delTodo(idx)">삭제</button>
        </li>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>   
    <script>

        const app = new Vue({
            el:"#app",
            data:{
                title:"MyTodo",
                todos:[
                    {id:1,content:"공부하기", completed:false},
                    {id:2,content:"퇴근하기", completed:true},
                ],
                // 사용자가 입력한 값을 그때 그때 저장되는 변수
                newTodo:'',
                status:'all',
            },
            methods:{
                addTodo:function(){
                    this.todos.push(
                        {id:Date.now(),content:this.newTodo,complete:false}
                    )
                    this.newTodo = ''
                },
                delTodo:function(idx){
                    this.todos.splice(idx,1)
                },
                todosByStatus:function(){
                    if(this.status == "active"){
                        return this.todos.filter((todo)=>{
                            return !todo.completed
                        })
                    } else if(this.status == "completed"){
                        // true값인 배열의 결과를 리턴
                        return this.todos.filter((todo)=>{
                            return todo.completed
                        })
                    } else{
                        return this.todos
                    }
                },
            },
        })
</script>
```



- 웹 스토리지에 저장하기
  - 로컬스토리지 접근(console창)
    - localStorage.getItem('email') : Read에대한 동작
    - localStorage.setItem('my-name-is', 'dongsik') : 로컬 스토리지에 저장, Create
    - localStorage.removeItem('my-name-is')

```html
<script>

        const STORAGE_KEY = "vue-todos"
        const todoStorage = {
            save:function(todos){
                localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
            },
            fetch:function(){
                // 아무값이 없으면 빈 배열을 넣겠다
                return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            }
        }

        const app = new Vue({
            el:"#app",
            data:{
                title:"MyTodo",
                // 데이터를 임의로 넣는게 아니라 로컬스토리지에 있는 데이터로 사용하겠다
                // 새로고침 해도 저장이 되어 있는 상태를 유지
                todos:todoStorage.fetch(),
                // 사용자가 입력한 값을 그때 그때 저장되는 변수
                newTodo:'',
                status:'all',
            },
            methods:{
                addTodo:function(){
                    this.todos.push(
                        {id:Date.now(),content:this.newTodo,complete:false}
                    )
                    this.newTodo = ''
                },
                delTodo:function(idx){
                    this.todos.splice(idx,1)
                },
                todosByStatus:function(){
                    if(this.status == "active"){
                        return this.todos.filter((todo)=>{
                            return !todo.completed
                        })
                    } else if(this.status == "completed"){
                        // true값인 배열의 결과를 리턴
                        return this.todos.filter((todo)=>{
                            return todo.completed
                        })
                    } else{
                        return this.todos
                    }
                },
            },
            watch:{
                // todos에 변화가 일어나면 todoStorage.save 실행
                todos:{
                    handler:function(todos){
                       todoStorage.save(todos)
                    },
                    // todos자체(전체)가 변하는걸 바라보고 있던걸, completed가 변화하고 있는걸 감지해서 실행하겠다라는 의미
                    deep:true
                }
            }
        })
</script>
```



- `firebase`와 연동하기

  - 프로젝트 생성
  - 개발 - database - Realtime Database
  - `vuefire` cdn 사용

  ```html
  <head>
    <!-- Vue -->
    <script src="https://unpkg.com/vue/dist/vue.js"></script>
    <!-- Firebase -->
    <script src="https://gstatic.com/firebasejs/4.2.0/firebase.js"></script>
    <!-- VueFire -->
    <script src="https://unpkg.com/vuefire/dist/vuefire.js"></script>
  </head>
  ```

  - `firebase` 문서로 이동 - 웹 시작하기 - 스크립트에 추가
  - apiKey // PROJECT_ID== DATABASE_NAME 를 설정에서 가져와서 수정

  ```html
  <!--수정-->
  <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)">
  <button v-if="todo.completed" @click="delTodo(todo)">삭제</button>
  
  <script>
      // 서비스를 사용하겠다라고 선언 한것
      var config = {
          apiKey: "<API_KEY>",
          databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
          projectId: "<PROJECT_ID>",
      };
      firebase.initializeApp(config);
  
      const database = firebase.database()
  
      const app = new Vue({
          el:"#app",
          data:{
              title:"MyTodo",
              newTodo:'',
              status:'all',
          },
          firebase:{
              todos:database.ref('todos')
          },
          methods:{
              addTodo:function(){
                  // firebase로 연결된 reference에다가 push
                  this.$firebaseRefs.todos.push(
                      {id:Date.now(),content:this.newTodo,complete:false}
                  )
                  this.newTodo = ''
              },
              delTodo:function(idx){
                  this.$firebaseRefs.todos.child(todo['.key']).remove()
              },
              todosByStatus:function(){
                  if(this.status == "active"){
                      return this.todos.filter((todo)=>{
                          return !todo.completed
                      })
                  } else if(this.status == "completed"){
                      return this.todos.filter((todo)=>{
                          return todo.completed
                      })
                  } else{
                      return this.todos
                  }
              },
              updateTodo:function(todo){
                  // 열거형 표현법
                  const editTodo = {...todo}
              },
          },
          watch:{
              todos:{
                  handler:function(todos){
                      todoStorage.save(todos)
                  },
                  deep:true
              }
          }
      })
  </script>
  ```

  - 제대로 하려면 `firebase`문서와 `vue`문서를 제대로 읽어봐야 제대로 구현 가능
