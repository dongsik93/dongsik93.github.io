---
layout: post
title: "Django와 Vue를 이용한 카카오페이 API"
subtitle: "Django에 카카오페이 연결하기"
date: 2019-10-20 13:00:00 +0900
categories: til
tags: django
comments: true
---

## Django + Vue - 카카오페이 API

내가 못찾는건지 없는건지 모르겠지만 생각보다 django에 카카오페이 API를 활용한 글이 적어서 직접 해보고 글을 남긴다

> ##### 환경
>
> macOS Catalina
>
> Django 2.2.6
>
> Python 3.7.4
>
> djangorestframework 3.10.3
>
> Vue.js 3.x
>
> Vuetify 2.1.3
>
> node.js 10.16.3 LTS

<br>

- KakaoDeveloper에 내 앱이 등록되어 있다는 가정하에 시작하겠습니다

- 사실 카카오 REST API 개발가이드에 상당히 자세하게 나와있어서 큰 어려움은 없었다

<br>

#### 시작하기

- PC웹에서의 카카오페이 결제 과정이다

![pay1](/img/in-post/post-kakaopay-django/pay1.png)

- 단건결제 프로세스를 테스트한다

```
카카오페이 API는 사용자의 AccessToken 뿐만 아니라, 어드민 키(Admin Key)로도 요청 가능합니다. 어드민 키를 사용할 때에는 어드민 키가 탈취되는 일이 없도록 앱 내에서 직접 어드민 키로 API를 호출하지 않고, 가맹점 서버에서 API를 호출하시기 바랍니다.
```

`Request`

```curl
POST /v1/payment/ready HTTP/1.1
Host: kapi.kakao.com
Authorization: KakaoAK {admin_key}
Content-type: application/x-www-form-urlencoded;charset=utf-8
```

- 카카오페이는 사용자의 Access Token과 Admin Key로 요청기 가능한데 Admin Key를 사용해서 요청해보겠다.
- 헤더에 `Authorization` , `Content-type` 을 함께 요청하고
- 아래 사진의 파라미터 값들과 함께 POST 요청을 한다

![pay2](/img/in-post/post-kakaopay-django/pay2.png)

<br>

#### 요청보내기(front)

1. Vue에서 axios요청을 보내기위해 _Payment.vue_ 컴포넌트를 생성한다
2. 로컬에서 테스트를 하기 때문에 vue와 django서버를 돌려준다

```js
// Payment.vue
<template>
    <div>
        <v-container>
            <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">결제하기</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">결제 정보 입력</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                            <v-col cols="12" sm="6">
                                <v-select
                                :items="items"
                                v-model="value"
                                label="충전금액*"
                                required
                                ></v-select>
                            </v-col>
                            </v-row>
                        </v-container>
                    <small>결제는 카카오페이로 진행됩니다</small>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">취소</v-btn>
                    <v-btn color="blue darken-1" text @click="pay">결제</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Payment',
    data: () => ({
      dialog: false,
      items: [5000, 10000, 20000],
      value:''
    }),
    methods:{
        pay(){
            let baseUrl = "http://127.0.0.1:8000/"
            let form = new FormData()
            form.append('amount', this.value)
            axios.post(baseUrl+"accounts/kakaoPay/", form)
        }
    }
}
</script>
```

- vuetify의 modal을 이용해서 충전 할 포인트를 선택하고 이 값만큼 요청해준다
- 백엔드 요청주소인 `http://127.0.0.1:8000/accounts/kakaopay/` 에 충전양(amount)를 같이 POST 요청

![pay3](/img/in-post/post-kakaopay-django/pay3.png)

#### 요청받기(back)

- 해당 url로 온 요청을 처리하기 위한 _views.py_ 의 _KakaoPay_

```python
# views.py
@api_view(['POST'])
def kakaoPay(request):
    url = "https://kapi.kakao.com"
    headers = {
        'Authorization': "KakaoAK " + "Admin Key Here",
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    }
    params = {
        'cid': "TC0ONETIME",
        'partner_order_id': '1001',
        'partner_user_id': 'dongsik',
        'item_name': '포인트',
        'quantity': 1,
        'total_amount': 0,
        'vat_amount': 200,
        'tax_free_amount': 0,
        'approval_url': 'http://localhost:8080',
        'fail_url': 'http://localhost:8080',
        'cancel_url': 'http://localhost:8080',
    }
    response = requests.post(url+"/v1/payment/ready", params=params, headers=headers)
    response = json.loads(response.text)
    return Response(response)    
```

- headers에 넣어주는 값들
  - `Authorization` : KakaoAK+" "(스페이스바) 와 Admin키를 붙여서 
  - `Content-type`
- params에 넣어주는 값들
  - `cid` : 테스트 환경이기 때문에 카카오에서 제공하는 테스트 아이디를 넣어준다
  - `partner_order_id` : 가맹점 주문번호, 임의의 값을 넣는다
  - `partner_user_id` : 가맹점 회원 id, 일단 임의의 값을 넣고 나중에 요청할 때 수정해주기로
  - `item_name` : 상품명, 포인트 충전이기 때문에 수정
  - `vat_amount` : 상품 부가세 부분
  - `tax_free_amount` : 상품 비과세 부분
  - `approval_url` : 결제 성공했을 때 redirect url
  - `fail_url` : 결제 실패했을 때 redirect url
  - `cancel_url` : 결제 취소시 redirect url

- `requests.post(url+"/v1/payment/ready", params=params, headers=headers)`
  - /v1/payment/ready 주소로 헤더, 파라미터 값와 함께 POST요청을 보냄
  - 성공시
    - 리턴값으로 JSON객체로 응답이 옴
    - `tid` : 결제 고유 번호
    - `next_redirect_app_url` : 요청한 클라이언트가 모바일 앱일 경우 해당 url을 통해 카카오톡 결제페이지를 띄움
    - `next_redirect_mobile_url` : 요청한 클라이언트가 모바일 웹일 경우 해당 url을 통해 카카오톡 결제페이지를 띄움
    - `next_redirect_pc_url` : 요청한 클라이언트가 pc 웹일 경우 redirect. 카카오톡으로 TMS를 보내기 위한 사용자입력화면이으로 redirect
    - `android_app_scheme` : 카카오페이 결제화면으로 이동하는 안드로이드 앱스킴
    - `ios_app_scheme` : 카카오페이 결제화면으로 이동하는 iOS 앱스킴
    - `created_at` : 결제 준비 요청 시간
  - 실패시
    - 에러코드와, 왜 에러가 났는지를 리턴해준다

- 응답받은 정보를 보내준다

#### 요청에 대한 결과 처리(front)

- axios요청에 대한 성공 / 실패시에 대한 처리를 위해 다시 _Payment.vue_ 로 가서 처리해준다

```js
<script>
import axios from 'axios'

export default {
    name: 'Payment',
    data: () => ({
      dialog: false,
      items: [5000, 10000, 20000],
      value:''
    }),
    methods:{
        pay(){
            let baseUrl = "http://127.0.0.1:8000/"
            let form = new FormData()
            form.append('amount', this.value)
            axios.post(baseUrl+"accounts/kakaoPay/", form)
            .then(res =>{
                let payUrl = res.data.next_redirect_pc_url
                console.log(res)
                location.href = payUrl
            })
            .catch(e =>{
                alert("에러가 발생했습니다. 다시 시도해주세요")
                this.$router.push('/')
            })
        }
    }
}
</script>
```

- `.then` 을 통해서 성공에 대한 결과를 처리

  - res 에는 요청에 대한 응답 결과가 나오는데, 이 중 웹 pc환경에서 사용하는 `next_redirect_pc_url` 을 사용
  - `location.href` 를 통해 payUrl로 이동

  ![pay4](/img/in-post/post-kakaopay-django/pay4.png)

  - payUrl 이동 결과 화면
  - 휴대폰 번호와 생년 월일을 입력 후 화면

  ![pay5](/img/in-post/post-kakaopay-django/pay5.png)

  - 핸드폰으로 들어가서 진행을 해보자

  ![pay6](/img/in-post/post-kakaopay-django/pay6.jpeg)

  - 위에서 10,000으로 요청한 금액과, 상품이름인 포인트, 부가세가 잘 적용된 모습이다.

  ![pay7](/img/in-post/post-kakaopay-django/pay7.jpeg)

  - 테스트 환경이기 때문에 카카오페이 비밀번호 인증단계가 생략된 모습이다

  ![pay8](/img/in-post/post-kakaopay-django/pay8.jpeg)

  - 결제가 완료되면 이렇게 결제 정보가 카톡으로 넘어온다
  - 결제가 완료되면 _views.py_ 에 지정해준 결제 성공했을 때 url로 이동하게 된다

<br>

- 결제정보를 db에 저장하고, 포인트 충전 처리를 해주면 마무리 될 것 같다
- 카카오페이 기능을 추가하는데 어렵고 오래걸릴줄 알았지만 카카오 개발자센터가 생각보다 자세하게 나와있고, 차근차근 잘 따라하면 쉽게 할 수 있다 !

<br>

참고사이트

- [Kakao Developers_ : 카카오페이 API 개발가이드](https://developers.kakao.com/docs/restapi/kakaopay-api#시작하기-전에){: class="underlineFill"}