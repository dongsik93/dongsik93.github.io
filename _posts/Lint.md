## Lint 



- 소스 코드를 분석하여 프로그램 오류, 버그, 스타일 오류, 의심스러운 구조체에 표시를 달아놓기 위한 도구



- vue create로 생성할 때  lint설정을 해서 생성

  ```
  ## Window에서 gitbash로는 create가 잘 안됨 cmd로 진행
  
  > vue create test
  > default(babel, eslint) 선택
  ```

  - package.json

  ```
  # devDependencies
    "@vue/cli-plugin-babel": "^3.9.0",
    "@vue/cli-plugin-eslint": "^3.9.0",
    "@vue/cli-service": "^3.9.0",
    "babel-eslint": "^10.0.1",
    "eslint": "^5.16.0",
    "eslint-plugin-vue": "^5.0.0",
    "vue-template-compiler": "^2.6.10"
  ```

  - 위에 생성된 dependencies를 기존 프로젝트에 추가
  - 추가 후 npm instasll

  - `.eslintrc.js` 파일 생성
  - 기존 프로젝트에 추가



- 적용 후 코드를 보면 왼쪽에 노란점 / 빨간점이 찍힘
  - 노란점 : `WARNING`
    - 코드 일관성을 가져가면 좋겠다
  - 빨간점 : `ERROR`
    - 코드에 대해 에러가 존재하거나
    - 쓰지않는 변수들을 사용했을 때나
    - console.log 같은게 남아있을 때



- atom에 plugin `linter-eslint` 설치
  - 기본적으로 javascript에 대한 오류를 잡아줌
  - Settings에 List of scopes to run ESLint on에 `text.html.vue`를 추가해주면 vue도 가능



