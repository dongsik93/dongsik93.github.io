---
layout: post
title: "PyCon Korea Tutorial Day 1 (08.15)"
subtitle: "파이콘 후기"
date: 2019-09-26 01:00:00 +0900
categories: review
tags: pycon review
comments: true
---

## PyCon Korea 2019 - Tutorial Day 1

### 함께 해보자 ! Tensorflow 2.0

드디어 PyCon의 첫 일정인 튜토리얼을 들으러 코엑스로 아침부터 찾아갔다.

원래 이 날에는 들을 계획이 없었지만 기왕 가서 들어보는 김에 신청해서 듣게되었다.

가격은 15,000이였고 3시간짜리 프로그램이였다. (시간당 5,000원?)

![1](/img/in-post/pycon_d1_1.jpg)

10시 시작이였지만 일찍와서 아메리카노 한잔과 함께 티켓을 교환하고 강의실로 들어갔다.

> 사실 이 날에는 관심있는 강의가 없어서 자의반? 타의반? 형이 관심있어 하는 AI에 대한 강의를 듣게 되었다. 
>
> 말로만 듣던 **Tensorflow** 에 대해 알아보자 ? 지식을 넓히자 ? 이런 마음이 컸다

강의장에 들어가니 슬라이드가 띄워져 있었고, 잘 보려고 앞줄에 앉았다.

![2](/img/in-post/pycon_d1_2.jpg)

강사님?(호칭을 뭐라고 해야할지 모르겠어서 강사님으로...ㅎ)이 시작하기에 앞서 대략적으로 과거와 현재, 그리고 미래의 AI의 방향에 대해 말씀해주셨다. 첫날이라 그런지 티켓교환 줄이 길어져 10분정도 딜레이가 됐다 (이 때부터 뭔가 불안...)

```
과거
- Rule + Answer를 가지고 답을 찾음 : 75%

발전
- Answer + 답을 가지고 Rule을 찾음
- 유사한 사항이 오면 분류가 가능
- 단 데이터(answer)가 많이 필요하고, 각각의 답을 다 정해줘야 한다(labeling이 중요하다고...)
- Labeling은 사람이..
```

음.. 시작부터 오...어려울것 같다? 이라는 생각이 들었지만 앞자리여서 고개를 열심히 끄덕이면서 집중했다😂

```
data의 편향성이 labeling에 중요하다 !!
- 어느 한쪽에 치우지지 않는것..

지도학습 / 비지도학습

모델
- 학습된, 잘 만들어진 모데롤 다른 비즈니스에 활용, 서비스하는 단계
	- 자동번역 api, 음성인식 api
	- tensorflow 2.0이 모델을 가지고 서비스를 하는 것으로 확장
```

점점 더 처음 듣는 단어들이 많아 지면서 예제를 보여주기 시작하셨다

```python
import tensorflow as tf
import numpy as np
from tensorflow import keras


model = keras.Sequential([keras.layers.Dense(units=1, input_shape=[1])])
# 네트워크 구조 선언
## optimizer : 학습을 최적화 해주는 과정, 어떤 방법으로 찾을 것인지, 최적화 메소드에 따라서, 모델선정
## loss : 비교값, 
model.compile(optimizer="sgd",  loss="mean_squared_error")

xs = np.array([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0], dtype=float)
ys = np.array([-2.0, 1.0, 4.0 ,7.0, 10.0, 13.0], dtype=float)
# epochs : 반복학습 횟수
model.fit(xs, ys, epochs=500)

print(model.predict([10.0]))
```

**tensorflow  2.0** 에는 keras가 포함되어 있다...라고 하는데 저는 한번도 안써봤는데요...?😂

 _~~(사실 이 때부터 아 tensorflow를 다뤄본적이 있는 사람들을 위한 자리구나 라고 생각을 했다)~~_

이후에도 여러 예제를 들어주시면서 열심히 고개를 끄덕이면서 타이핑했지만 이제와서 보니 뭘 적은지도 모르겠다.. 그나마 들어봤던 **정규화**에 대해서 설명을 해주셨는데

```python
Why to normalize ?

- normalize가 없으면 편향(bias)이 생김 : 데이터별로 분산정도가 다르기 때문에
# 255.0으로 나는 이유는 0 ~ 1사이의 실수값으로 normalize하기 위해
## 아래는 최대값으로 나눔
training_images = training_images/255.0
test_images = test_images/255.0
```

그리고 이번 강의의 목적, **tensorflow 2.0**에 대해서 설명을 해주셨다.

```
Keras 호환 API +

Eag execution + 

autograph + 

TensorFlow.Data

- 빠르고 유연하며 사용이 편리한 입력 파이프라인
- ETL 과정의 최적화(데이터 가져오고, 변환하고, 로딩)


tensorflow 확장 tf-hub

- tensorflow.js : 프론트단으로 
  - 서버, clioud까지 가지 않아도 프론트단에서 해결할 수있게끔 서비스가 내려옴
- tensorflow.lite : 안드로이드 
- chrome 브라우저가 학습 
```

그러던 중 갑자기 프로젝터 연결이 끊어졌다... (아직 한시간이나 남았는데요..?)

당황하시던 강사님의 모습이 아직도 눈에 선하다

프로젝터가 나가버려서 입으로 남은 시간을 채우셔야했는데, 그 와중에 강의듣던 사람들에게 항의까지 받으니... 정말 고생하셨다

프로젝터가 나가버린 후 관계자분들이 왔다갔다 고치려고 돌아다니고, 사실 이 때부터 거의 집중이 안됐다. 그래도 고생하시는 강사님을  보면서 열심히 고개를 끄덕였다..

강의가 끝나기 10분정도 전쯤 드디어 프로젝터가 고쳐졌고 그렇게 강의가 마무리 되었다.

그리고 결국 나중에 이 강의는 환불처리가 되었다 (강사님 고생하셨어요...)

![3](/img/in-post/pycon_d1_3.PNG)

AI에 대해 무지한 내가 들었기 때문에 뭔가 덜 와닿았던 강의였던 것 같고, 튜토리얼이 초보자들 또는 새로운 것을 접하는 사람들을 위해 진행하는 교육 프로그램이라고 나와 있어서 되게 쉬울 것 같았지만 도메인에 대한 이해가 있고, 라이브러리들을 사용한 경험이 있던 사람들이 들었다면 더욱 유익한 강의가 됐을것 같았다.

<br>

[Lablup INC](https://lablup.com){: class="underlineFill"}