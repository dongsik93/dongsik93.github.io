---
layout: post
title: "git 협업"
subtitle: "git"
date: 2019-01-02 17:55:00 +0900
categories: til
tags: git
comments: true
---

## Github 협업

### 나는 A역할 ( pm이 하는 역할 )

1. new repository 생성 해주기 (public으로)
2. 생성 후 settings  - collaborators -  들어가서 b 초대해주기
3. git bash로 들어가서 폴더 생성 후 해당 위치에서 파일 생성
4. 파일 수정 후 저장
5. git init -> git status -> 해서 git으로 파일 올리기
6. b가 파일 수정이 끝나면 git pull로 파일 끌어오기
7. 파일 열어서 수정 후 다시 git push해주기
8. 반복





### B역할

1. 링크열어서 초대장 확인
2. 주소 복사해서 git clone해주기
3. 파일 다운로드된거 파일 열고 수정해주기
4. 반복





### 주의사항

- A가 파일을 사용하고 있을 때 B가 파일을 수정하게되면 충돌이 일어남
- 그래서 항상 push하기전에 push해도 되냐고 물어봐야함
- 파일 수정후 pull을 해주라고  해야함



### 명령어

- git log : commit 기록을 보여줌



### 예외사항

- ### a와 b와 git hub의 싱크가 다 안맞을 때

  - b가 먼저 push

  - a가 pull하면 오류 발생

  - ```terminal
     Your local changes to the following files would be overwritten by merge:
            end-to-end.md
    Please commit your changes or stash them before you merge.
    ```

  - git add -> git commit -m 하고

  - git pull 다시 하기

  - ```terminal
    Auto-merging end-to-end.md
    CONFLICT (content): Merge conflict in end-to-end.md
    Automatic merge failed; fix conflicts and then commit the result.
    ```

  - pull하고 파일 열어보면 a코드가 위 // b코드가 아래로 나누어져서 기록이 되어 있음

  - ```md
    <<<<<<< HEAD
    
    # 마 무승부가 어디있나 마!
    -------------------------------------------------------------------
    침소리펄소리
    
    > > > > > > > 1bbb7b644403a8578073196fa256cd9f346ea8bf
    ```

  - 이 부분 중 선택해서 수정을 해야함 ( a와 b가 조율해서 ) 

  - 남기고 싶은 "침소리 펄소리"만을 제외하고 싹다 지워주기

  - ```terminal
    침소리펄소리 # 이거만 남기고 지우기
    ```

  - 수정 완료 하고 git add / git commit / git push 해주면 끝

  - b가 pull로 땡겨서 파일 확인하면 올바르게 수정된 파일이 올라옴!!!
