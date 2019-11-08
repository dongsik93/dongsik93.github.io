---
layout: post
title: "api사용하기"
subtitle: "api"
date: 2019-01-18 18:00:00 +0900
categories: til
tags: html
comments: true
---

## api사용하기

### api 키 환경변수 설정



echo 'export KOBIS_KEY="키값"' >> ~/.bashrc
echo 'export NAVER_ID="아이디값"' >> ~/.bashrc
echo 'export NAVER_SECRET="시크릿키값"' >> ~/.bashrc



```python
import os
os.getenv("NAVER_ID")
os.getenv("KOBIS_KEY")
os.getenv("NAVEER_KEY")
```





영화별로

영화 대표코드 / 영화명(국문) / 영화명(영문) / 영화명(원문) / 개봉연도 / 상영시간 / 장르 / 감독명 / 관람등급 / 배우1 / 배우 2 / 배우 3

movieCd// movieNm//movieNmEn//movieNmOg // openDt // showTm // genreNm // peopleNm  

// watchGradeNm / actors 0 peopleNm /  actors 1 peopleNm /  actors 2 peopleNm





http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=키값



20184105



r (read)   : 읽기모드 , 해당 파일이 없으면 에러

r+  : 읽기, 쓰기가 둘다 가능, 파일이 없으면 에러

w (write)  : 쓰기모드, 해당 파일이 없으면 새로 만들어줌 , 덮어쓰기

w+  : 읽기, 쓰기가 둘다 가능, 파일이 없으면 새로 만들어줌

a (append) : 파일 추가 모드, 해당 파일이 없으면 새로 만들어줌, 이어쓰기

a+  : 읽기, 쓰기가 둘다 가능, 파일이 없으면 새로 만들어줌

csv 파일 쓰기

f = open("test.csv", "a+", encoding="UTF-8", newline="")

csv_w = csv.writer(f)

csv_w.writerow(["이름", "이메일", "전화번호"])

f.close()

csv 파일 읽기

f2 = open("test.csv", "r", encoding="UTF-8")

csv_r = csv.reader(f2)

for line in csv_r:

print(line[0])

f2.close()
