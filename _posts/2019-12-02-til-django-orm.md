---
layout: post
title: "Django ORM 정리"
subtitle: "django orm"
date: 2019-12-02 01:00:00 +0900
categories: til
tags: tech, django, db
comments: true
---

## Django ORM 정리

### ORM

- 개념
  - ORM(Object Relational Mapping)
  - 객체와 관계형 데이터베이스를 연결해주는 역할
  - 쉽게 말해 OOP언어와 데이터를 다루는 RDBMS 와의 상이한 시스템을 매핑하여, 데이터 관련 OOP 프로그래밍을 쉽게 하도록 도와주는 기술이다
- 작동
  - 하나의 모델클래스는 하나의 테이블에 매핑
  - 모델 클래스의 속성은 테이블의 컬럼에 매핑
- 장점
  - sql 쿼리문을 몰라도 쉽게 사용이 가능,
  - 데이터 베이스엔진을 변경하더라고 orm을 통한 api변경은 필요 없다
- 단점
  - orm이 반드시 효율적인 sql로 변환해 주는거은 아님

#### ORM의 방식

- `Lazy-Loading`
  - 개념
    - 명령을 실행할 때마다 db에서 데이터를 가져오는것이 아니라 모든 명령 처리가 끝나고 실제로 데이터를 불러와야 할 시점이 왔을 때 db에 쿼리를 실행하는 방식
  - 장점
    - 매 단계마다 쿼리를 실행하지 않기 때문에 쿼리 요청을최소화 할 수 있다
  - 단점
    - Nested Serializer(중첩)일때 성능이 최악으로..
      - 정보를  가져오고.. 가져오고 쿼리수행되고 또 가져오고..
  - 해결
    - `Eager-Loading`
      - 사전에 쓸 데이터를 포함하여 쿼리를 날리기 때문에 비효율적으로 늘어나는 쿼리 요청을 사전에 방지할 수 있다
      - 장고 orm에서는 **prefetch_related**로
      - 이미 한번 불러왔기 때문에 가져오기만(fetch)하면 됨
      - local data cache에 가져온 데이터 저장

#### ORM 성능이슈 및 해결

- `N+1 Problem`

  - 개념

    - 쿼리 1번으로 N건의  데이터를 가져왔는데 원하는 데이터를 얻기 위해 이 **N건의 데이터를 데이터 수 만큼 반복해서 2차적으로 쿼리를 수행하는 문제**
    - 모든 Post의 모든 Comment를 불러낼 때 쿼리가 N + 1번 발생하게되고, 불필요한 db커넥션이 생성
    - 성능 측면에서 지극히 비효율적이지만, 로직을 이해하기 쉽다는 장점때문에 사용

  - 해결

    - Eager-Loading 구현
    - 1:N 관계일 때 **select_related**

    ```sql
    Post.objects.all().select_related('comment')
    ```

    - N:M 관계일 때 **prefetch_related**

<br>

참고사이트

- [개발자, Trend를 파헤치다 - Django ORM 성능 튜닝](https://show-me-the-money.tistory.com/48){: class="underlineFill"}