---
layout: post
title: "Chat-bot"
subtitle: "Chat-bot"
date: 2018-12-21 18:00:00 +0900
categories: pro
tags: chatbot
comments: true
---



## 텔레그램 챗봇 만들기



### 서버연결

터미널

$ FLASK_APP=app.py flask run --host=$IP --port=$PORT

```python
from flask import Flask
import os

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"
# 배포할 때 설정을 쉽게 하기위해 설정    
app.run(host=os.getenv('IP','0.0.0.0'),port=int(os.getenv('PORT',8080)))
```



### format 함수

```python
"asdf{}".format(a)
== f"asdf{a}"
#f의 위치는 따옴표 밖에 위치해야 함
```



1) https://api.telegram.org/bot<token>/setWebhook?url=<url+/token>

-> https://api.telegram.org/bot<토큰>/setWebhook?url=https://python-dongsik93.c9users.io/<토큰>



2) https://api.telegram.org/bot<토큰>/getWebhookinfo    //웹훅을 이 주소로 설정했다라는 의미

### pprint 함수

```python
from pprint import pprint as pp
```

### 유저정보 / 입력한 데이터 

```python
# 유저 정보
chat_id = tele_dict["message"]["from"]["id"]
# 유저가 입력한 데이터
text = tele_dict["message"]["text"]
print(chat_id, text)
```

### sendMessage = 누구한테 보낼지 / 뭘 보낼지를 

```python
# 유저에게 그대로 돌려주기
requests.get(f'{api_url}/bot{token}/sendMessage?chat_id=chat_id}&text=text}')
# ?를 이용해 파라미터값으로 넘겨줌
# 파라미터와 파라미터는 &로 연결
# {}안에 들어가는거는 변수화를 시켜주는 것
```

### 메뉴 / 로또라는 입력값을 받으면 알려주는거

```python
if (text == "메뉴"):
	menu_list = ["한식","중식","양식","분식","선택식"]
	text = random.choice(menu_list)
elif (text == "로또"):
	text = random.sample(range(1,46),6)
```

### 실검 크롤링

```python
html = requests.get('https://www.naver.com/').text
soup = BeautifulSoup(html, 'html.parser')
title_list = soup.select('.PM_CL_realtimeKeyword_rolling span[class*=ah_k]')
i = []
for data in title_list:
    i.append(data.text)

 if (text == "실검"):
 	text = i
    
```





### 터미널

c9 ~/.bashrc입력 -> .bashrc 가 열림

```python
# 파이썬창에 추가
export TELE_TOKEN="토큰값"
export NAVER_ID="아이디"
export NAVER_SECRET="시크릿키"
```

터미널에

exec $SHELL

echo $TELE_TOKEN 을 입력하면 토큰값이 출력( 환경변수에 제대로 추가 됨 )



### 네이버 api



```python
a= "안녕하세요!!!!"
type(a) --> str출력
a[0] --> '안' 출력   #스트링도 리스트처럼 접근이 가능하다
a[1] --> '녕' 출력
a[:2] --> 처음부터 2번째까지 출력 --> '안녕'

a = [1,2,3]
a[0] = 1
a[1] = 2
a[2] = 3

a[-1] = 3
a[-2] = 2
a[-3] = 1
a[-4] = list index out of range
```



### 네이버 홈페이지에서 가져온 가이드

```html
curl "https://openapi.naver.com/v1/papago/n2mt" \
-H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" \
-H "X-Naver-Client-Id: id" \
-H "X-Naver-Client-Secret: pw" \
-d "source=ko&target=en&text=만나서 반갑습니다." -v
```

### papago번역

```python
#번역 (한칸띄우고) 입력 -> 입력결과가 번역되게
# text(유저가 입력한 데이터) 중 제일 앞 두글자가 번역인지를 확인
tran = False
if (text[:2]=="번역"):
    tran = True
    text = text.replace("번역","") #번역이라는 글씨가 없어짐
    
if (tran):
    papago = requests.post("https://openapi.naver.com/v1/papago/n2mt",  #요청을 보내는 주소
                headers = { # 유저 아이디와 비밀번호
                   "X-Naver-Client-Id":naver_client_id,
                   "X-Naver-Client-Secret":naver_client_secret
                },
                data = { #source=ko&target=en&text 이 필요하니까 소스 / 타겟 / 텍스트(번역 없앤 글자)
                    'source':'ko',
                    'target':'en',
                    'text':text
                }
    )
    pp(papago.json())
    text = papago.json()["message"]["result"]["translatedText"]
```

### clova 사진인식

```python
  img = False 
  if (tele_dict.get('message').get('photo')) is not None:
        img = True   
  if (img):
        text = "사용자가 이미지를 넣었어요"
        #텔레그램에게 사진 정보 가져오기
        file_id = tele_dict['message']['photo'][-1]['file_id']
        file_path = requests.get(f"{api_url}/bot{token}/getFile?file_id={file_id}").json()['result']['file_path']
        file_url = f"{api_url}/file/bot{token}/{file_path}"
        print(file_url)
        
        #사진을 네이버 유명인식 api로 넘겨주기
        file = requests.get(file_url, stream=True) # 실제 파일을 가져옴
        clova = requests.post("https://openapi.naver.com/v1/vision/celebrity",  #요청을 보내는 주소
                    headers = { # 유저 아이디와 비밀번호
                       "X-Naver-Client-Id":naver_client_id,
                       "X-Naver-Client-Secret":naver_client_secret
                    },
                    files = {
                        'image':file.raw.read() # 원본 데이터를 보내준다
                    }
        )
        #가져온 데이터 중에서 필요한 정보 빼오기
        pp(clova.json())
        #인식이 되었을 때
        if (clova.json().get('info').get('faceCount')):
            text = clova.json()['faces'][0]['celebrity']['value']
        #인식이 되지 않았을 때
        else :
            text = "얼굴이 없어요"   
```



### 배포

heroku에 가입하기

``` terminal
heroku login

touch runtime.txt // 생성후 열기

python-3.6.7  // 입력

touch Procfile // 생성 후 열기

web: python app.py // 입력 (띄어쓰기 중요)

touch requirements.txt 

pip freeze > requirements.txt    // 서버에 pip설치했다는걸 서버에 알려줌

git add .

git commit -m " "

heroku create <자신이 만들 특별한 id>

git push herok master
```

 https://dubiduba-chatbot.herokuapp.com/ deployed to Heroku 이거  url 누르기

새로운 챗봇 하나 만들기 (토큰2)

https://api.telegram.org/bot<토큰2>/setWebhook?url=https://dubiduba-chatbot.herokuapp.com/<토큰2>

헤로쿠 들어가서 새로고침

들어가서 -> settings -> reveal config vars클릭

들어가서   TELE_TOKEN <토큰2> 넣어주면 됨

네이버 id

네이버 id secret 



```terminal
git remove

```



### 오늘의 소스(종합)

```python
from flask import Flask, request
from pprint import pprint as pp
import os
import requests
import random
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

html = requests.get('https://www.naver.com/').text
soup = BeautifulSoup(html, 'html.parser')
title_list = soup.select('.PM_CL_realtimeKeyword_rolling span[class*=ah_k]')
i = []
for data in title_list:
    i.append(data.text)


api_url = 'https://api.hphk.io/telegram'
token = os.getenv('TELE_TOKEN')

@app.route(f'/{token}', methods=['POST'])
def telegram():
    # naver api를 사용하기 위한 변수
    naver_client_id = os.getenv('NAVER_ID')
    naver_client_secret = os.getenv('NAVER_SECRET')
    
    
    
    # tele_dict  = 데이터 덩어리
    tele_dict = request.get_json()
    pp(request.get_json())
    
    # 유저 정보
    chat_id = tele_dict["message"]["from"]["id"]
    # 유저가 입력한 데이터
    text = tele_dict.get("message").get("text")
    
    tran = False
    img = False
    
    # 사용자가 이미지를 넣었는지 체크체크
    if (tele_dict.get('message').get('photo')) is not None:
        img = True
    else:
    #번역 (한칸띄우고) 입력 -> 입력결과가 번역되게
    # text(유저가 입력한 데이터) 중 제일 앞 두글자가 번역인지를 확인
        if (text[:2]=="번역"):
            tran = True
            text = text.replace("번역","") #번역이라는 글씨가 없어짐
            
        
        
    
    if (tran):
        papago = requests.post("https://openapi.naver.com/v1/papago/n2mt",  #요청을 보내는 주소
                    headers = { # 유저 아이디와 비밀번호
                       "X-Naver-Client-Id":naver_client_id,
                       "X-Naver-Client-Secret":naver_client_secret
                    },
                    data = { #source=ko&target=en&text 이 필요하니까 소스 / 타겟 / 텍스트(번역 없앤 py글자)
                        'source':'ko',
                        'target':'en',
                        'text':text
                    }
        )
        pp(papago.json())
        text = papago.json()["message"]["result"]["translatedText"]
    elif (img):
        text = "사용자가 이미지를 넣었어요"
        #텔레그램에게 사진 정보 가져오기
        file_id = tele_dict['message']['photo'][-1]['file_id']
        file_path = requests.get(f"{api_url}/bot{token}/getFile?file_id={file_id}").json()['result']['file_path']
        file_url = f"{api_url}/file/bot{token}/{file_path}"
        print(file_url)
        
        #사진을 네이버 유명인식 api로 넘겨주기
        file = requests.get(file_url, stream=True) # 실제 파일을 가져옴
        clova = requests.post("https://openapi.naver.com/v1/vision/celebrity",  #요청을 보내는 주소
                    headers = { # 유저 아이디와 비밀번호
                       "X-Naver-Client-Id":naver_client_id,
                       "X-Naver-Client-Secret":naver_client_secret
                    },
                    files = {
                        'image':file.raw.read() # 원본 데이터를 보내준다
                    }
        )
        #가져온 데이터 중에서 필요한 정보 빼오기
        pp(clova.json())
        #인식이 되었을 때
        if (clova.json().get('info').get('faceCount')):
            text = clova.json()['faces'][0]['celebrity']['value']
        #인식이 되지 않았을 때
        else :
            text = "얼굴이 없어요"
    
    elif (text == "메뉴"):
        menu_list = ["한식","중식","양식","분식","선택식"]
        text = random.choice(menu_list)
    elif (text == "로또"):
        text = random.sample(range(1,46),6)
    elif (text == "실검"):
            text = i
        
    
    # 유저에게 그대로 돌려주기
    requests.get(f'{api_url}/bot{token}/sendMessage?chat_id={chat_id}&text={text}')
    
    return '', 200
    
# 배포할 때 설정을 쉽게 하기위해 설정    
app.run(host=os.getenv('IP','0.0.0.0'),port=int(os.getenv('PORT',8080)))






```



