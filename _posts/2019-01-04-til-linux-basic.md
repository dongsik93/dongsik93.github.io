---
layout: post
title: "Linux basic"
subtitle: "Linux"
date: 2019-01-04 18:00:00 +0900
categories: til
tags: linux
comments: true
---


## Linux

## CLI(Command Line Interface)

cli - 키보드 만으로 컴퓨터를 조작

gui - 키보드와 마우스로 조작



### Witch OS?

- Unix based OS (Linux, MacOS)
- Unix => 서버 관리하는 시점에서 무조건 사용하게 됨



###  prompt

- 컴퓨터가 명령을 받을 준비가 됨 => $ 가 깜빡깜빡
- `> `표시는 명령어를 계속 입력해 달라는 의미 => 탈출은 ctrl + C
- 뭔가 막혔을 때 탈출! Ctrl + C



### 기본 명령어

| 명령어   | 설명                                                 | 사용법       |
| -------- | ---------------------------------------------------- | ------------ |
| `echo`   | 다음에 들어오는 내용을 리턴 (화면 출력 stdo)         | echo "hello" |
| `yes`    | 시스템 점검할 때 쓰이는 명령어, 입력값을 계속 반복함 |              |
| `ctrl+C` | 작업중지                                             |              |
| `↑`,`↓`  | 이전 명령어, 다음 명령어                             |              |
| `ctrl+L` | 터미널 깔끔하게 정리                                 | = clear      |

### 파일 조작

| 명령어           | 설명                                                   | 사용법                      |
| ---------------- | ------------------------------------------------------ | --------------------------- |
| `>`              | 왼쪽의 출력물을 오른쪽 파일로 전송하기 (덮어씀)        | echo "hello" > hello.txt    |
| `>>`             | 왼쪽의 출력물을 오른쪽 파일로 붙이기                   | echo "hihi" >> hello.txt    |
| `cat`            | `<file>`의 내용을 화면에 출력                          | cat hello.txt               |
| `ls`             | 파일 / 디렉토리들의 목록을 보여줌                      |                             |
| `ls -a`          | 숨김파일까지 보여줌                                    |                             |
| `ls -t`          | 최근 수정파일 순서로 정렬                              |                             |
| `ls -l`          | 권한 / 사용자 / 생성일까지 세세한                      |                             |
| `mv <old> <new>` | `<old>`의 이름을 `<new>`로 변경(확장자도, 이동도 가능) | mv hello hello.txt          |
| `cp <old> <new>` | `<old>`를 `<new>`로 복사                               | cp hello.txt copy_hello.txt |
| `rm <file>`      | `<file>`지우기                                         | rm hello.txt                |
| `rm -r <dir>`    | `<dir>`과 그 하위 폴더와 파일까지 전부 지우기          | rm -r .git                  |
| `rm -rf <dir>`   | 강제적으로 폴더지우기 (권한에 따라 안지워질때)         | rm -rf .git                 |
| 탭               | 자동완성!! + 오타줄임                                  | 명령어 + 탭                 |
| 두번 탭          | 목록을 출력!!                                          | 명령어 + 탭탭               |

### 파일 검사

| 명령어          | 내용                            | 사용법                    |
| --------------- | ------------------------------- | ------------------------- |
| `curl -O <url>` | 파일 다운로드                   | curl -O https://naver.com |
| `curl`          | url과 상호작용                  | curl https://naver.com    |
| `head <file>`   | 파일의 앞부분 출력              | head bohemian.txt         |
| `tail <file>`   | 파일의 뒷부분 출력              | tail bohemian.txt         |
| `wc <file>`     | 파일의 라인수 / 단어수 / 바이트 | wc bohemian.txt           |

### 디렉토리

| 명령어     | 내용                    | 사용법 |
| ---------- | ----------------------- | ------ |
| `ls`       | 파일 / 폴더 내용을 출력 |        |
| `pwd`      | print working directory |        |
| `cd <dir>` | `<dir>` 위치로 이동     |        |
| `cd -`     | 뒤로가기                |        |
| `cd ..`    | 상위 폴더로 이동        |        |

- `/`  : 최상위 루트
- `~`  : 홈 디렉토리

