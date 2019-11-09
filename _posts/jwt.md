## JWT에 대한 이해

> 저번에 jwt를 이용해서 인증을 구현하고 이번 프로젝트에서도 jwt를 이용한 소셜 로그인을 구현하게 되었지만, 사실 아직까지도 jwt가 뭐야? 왜 jwt를 쓰는데? 라는 질문에 명확하게 답하지 못하기 때문에 제대로 정리해보는 시간을 갖게 되었다.

### JWT란?

- JWT(JSON Web Token)은 당사자간에 정보를 안전하게 JSON 객체로 전송하기 위한 간결하고 독립적인 방법을 정의하는 공개표준([RFC 7519](https://tools.ietf.org/html/rfc7519))이다
- 이 정보는 디지털 서명되어 있으므로 신뢰할 수 있다
- JWT는 비밀(**HMAC** 알고리즘사용) 또는 **RSA** , **ECDSA**를 사용하는 공개 / 개인 키 쌍을 사용하여 서명할 수 있다.

- 

#### JWT의 목적

- JWT의 주요 목적은 두 관계자 사이에 안전하게 claim을 전송하는 것이다. claim이란 특정 관계자나 오브젝트에 대한 definition 혹은 assertions이다. 
- 다음은 signature가 들어간 claim의 예시이다.

```json
{
    “alg”: “HS256”,
	“typ”: “JWT”
}
{
    “sub”: “1234567890”,
    “name”: “John Doe”,
    “admin”: true
}
```

#### 어떠한 문제를 해결하는가?

- 단순하고 선택적으로 검증되고 암호화된 컨테이너 형식의 표준화 노력이다
- 위와 같은



JWT 공식사이트의 Sebastián E. Peyrott, Auth0 Inc. “The JWT Handbook.”을 요약 정리했다... 오역이 있을수 있으니 더 자세한 내용은 사이트를 참고해주세요...

- [JWT Handbook](