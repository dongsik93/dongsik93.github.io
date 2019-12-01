---
layout: post
title: "GET방식과 POST방식"
subtitle: "GET/POST 비교"
date: 2019-12-01 21:00:00 +0900
categories: til
tags: tech
comments: true
---

## GET방식과 POST방식의 비교

> 기초를 다지자....
>
> 아무것도 모른다....
>
> 차근차근..

### HTTP 패킷

> HTTP에 대한 부분은 따로 HTTP/1.1과 HTTP/2를 비교하면서 포스팅을 할 예정이다

클라이언트가 서버로 요청을 했을 때 보내는 데이터를 `HTTP 패킷`이라 표현한다

##### HTTP 패킷의 구조

- Header
  - 키-값 방식으로 정보가 들어간다
  - 7가지의 HTTP 메서드 방식
  - Accept, Cookie, Content-Type등과 같은 클라이언트 정보를 담는다
- Body
  - 보통 비어있지만 특정 데이터를 담아서 서버에 요청을 보낼 수 있다

### GET방식

##### 설명

- 클라이언트로부터의 데이터를 이름과 값이 결합된 스트링 형태로 전달

```
www.example.com?id=dongsik&pass=1234
```

- 위와 같이 클라이언트의 데이터를 URL 뒤에 붙여서 보낸다
  - URL 뒤에 `?` 마크를 통해 URL의 끝, 데이터 표현의 시작점을 알려준다
  - URL 뒤에 붙이므로, Header에 포함되어 서버에 요청한다
  - Header에 포함해야 하기 때문에 키-값 쌍으로 넣으며 2개 이상의 키-값 쌍을 보낼때에는 `&`로 구분해서 요청한다
- GET 방식에서 Body에 특별한 내용을 넣을 것이 없으므로 `BODY가 빈 상태로 보내진다`
  - 따라서 Header의 내용중 Body 데이터를 설명하는 `Content-Type`이라는 Header는 들어가지 않는다

##### 특징

- 전송할 수 있는 데이터는 255바이트이다
  - HTTP/1.1 IE에서 2048까지 가능하다고 한다
- 전송속도가 POST방식보다 빠르다
  - GET방식의 요청은 `캐싱`(한번 접근 후, 또 요청할 시 빠르게 접근하기 위해 데이터를 저장시켜 놓는다) 때문이다
- 데이터베이스에 대한 질의어 데이터와 같은 **요청 자체를 위한 정보를 전송할 때** 사용된다
- 데이터가 URL뒤에 붙기 때문에 **최소한의 보안도 유지되지 않는다**

<br>

### POST방식

##### 설명

- 클라이언트와 서버간에 인코딩하여 서버로 전송한다

- 데이터 전송을 기반으로 한 요청 메서드이다

- URL에 붙여 보내지 않고 Body에 데이터를 넣어서 보낸다

  - 그렇기 때문에 Header의 `Content-Type`이라는 필드에 어떤 데이터 타입인지 명시해야 한다

  ```
  Content-Type의 예시
  - application/x-www-form-urlencoded
  - text/html
  - multipart/form-data
  등등 7가지 타입이 존재한다
  ```

##### 특징

- 입력한 데이터가 URL에 보이지 않으므로 GET방식보다 보안에 우수하다
  - 단지 보이지 않아서 우수할 뿐이지 두 방식 모두 보안을 생각한다면 암호화가 필요하다
- 전송할 데이터의 길이에 제한이 없다
- 복잡한 형태의 데이터를 전송할 때 유용하다
- 데이터베이스에 대한 갱신 작업과 같은 **서버측에서의 정보 갱신 작업을 원할 때** 사용한다

### GET / POST 차이

GET은 Idempotent, POST는 Non-idempotent하게 설계되었다.

> Idempotent(멱등)
>
> 수학이나 전산학에서 연산의 한 성질을 나타내는 것으로, 연산을 여러 번 적용하더라도 결과가 달라지지 않는 성질

- GET이 Idempotent하도록 설계되었다는 것은 GET으로 **서버에게 동일한 요청을 여러 번 전송하더라도 동일한 응답이 돌아와야 한다는 것**을 의미한다.
  - 주로 조회를 할 때 사용하는 이유

- 반대로 POST는 Non-idempotent하기 때문에 **서버에게 동일한 요청을 여러 번 전송해도 응답은 항상 다를 수 있다**
  - 서버의 상태나 데이터를 변경시킬 때 사용되는 이유

<br>

참고사이트

- [파라미터 전송 - GET, POST방식](https://all-record.tistory.com/100){: class="underlineFill"}
- [돌이의 서버이야기 : 네트워크 전송방식 - GET, POST 공통점 차이점 예제](https://soul0.tistory.com/185){: class="underlineFill"}
- [GET방식과 POST방식](https://mommoo.tistory.com/60){: class="underlineFill"}
- [GET과 POST의 차이](https://hongsii.github.io/2017/08/02/what-is-the-difference-get-and-post/){: class="underlineFill"}
