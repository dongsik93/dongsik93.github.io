---
layout: post
title: "Bootstrap"
subtitle: "bootstrap"
date: 2019-01-17 18:00:00 +0900
categories: til
tags: html
comments: true
---

## Bootstrap

### CDN활용을 통해 Bootstrap에 작성된 CSS, JS를 활용(클래스로)

head의 맨 밑에 추가

```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
```

body의 맨 밑에 추가

```html
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
```

불러들이는 순서 때문에..

- CSS를 만들어 놓은거를 클래스로 추가해 사용

### Spacing

```html
# margin border를 기준으로 외부 여백
<h1 class="m-5">	전체
<h1 class="ml-5">   왼쪽
<h1 class="mx-0">   양쪽(x축)
<h1 class="my-0">   위아래(y축)

mt-0 0    0px
mt-1 0.25 4px                     <!-- 0.25rem 으로 구현되어 있음 --> 
mt-2 0.5  8px
mt-3 1    16px
mt-4 1.5  24px
mt-5 3    48px 까지 존재
    
mx-auto
    
# padding border를 기준으로 내부 여백
class="py-0" 

m-n0 음수
```

### Color

#### .bg-color

primary : 파란색    // .bg-primary

secondary  : 회색

success : 초록색

info : 하늘색

warning : 노란색

danger : 빨간색

light : 흰색

dark : 검정색

#### .alert-color

alert-primary 

#### .btn-color

btn-secondary



### Border - 테두리

#### .border-color

#### .rounded-circle / pill



### Display

#### .d-block : 왼쪽부터 오른쪽 전체

#### .d-inline

#### .d-None



### 반응형 맛보기

### .d-sm-none



### position

#### .position-static



### text

#### .text-left

#### .text-right

#### .text-center



### breakpoint

- sm // md // lg // xl

- small // medium // large // extra large



### font

#### .font-weight-bold



앞으로 컴포넌트들은 공식문서에서 확인하기

https://getbootstrap.com/



<div1>
​    <input type="text" placeholder="Search">
</div>


## Bootstrap_02

Documentation - Utilities 들어가면 많이 있음



#### Flex - https://flexboxfroggy.com/#ko

### https://css-tricks.com/snippets/css/a-guide-to-flexbox/

flex = 정렬

#### grid 

- 공간을 얼마나 차지하는지
- 반응형 웹을 만들기 위해서

```html
@media (min-width:500px) and (max-width:900px){
            h1 {
                color : red;
            }
        }
        @media (min-width:0px) and (max-width:499px){
            h1 {
                color : green;
            }
        } 

<!-- 미디어 쿼리 사용 -->

```

#### grid option

| Extra small <576px  | Small ≥576px                         | Medium ≥768px | Large ≥992px | Extra large ≥1200px |            |
| ------------------- | ------------------------------------ | ------------- | ------------ | ------------------- | ---------- |
| Max container width | None (auto)                          | 540px         | 720px        | 960px               | 1140px     |
| Class prefix        | `.col-`                              | `.col-sm-`    | `.col-md-`   | `.col-lg-`          | `.col-xl-` |
| # of columns        | 12                                   |               |              |                     |            |
| Gutter width        | 30px (15px on each side of a column) |               |              |                     |            |
| Nestable            | Yes                                  |               |              |                     |            |
| Column ordering     | Yes                                  |               |              |                     |            |

- grid는 가로를 12칸으로 나눔(완전히 같게)

```html
<!--   -->
<div class="container">
    <div class="row">
        <!-- 좌우 영역 -->
        <!-- "col-sm" 을 넣으면 sm 사이즈에 맞춰서 자동으로 칸을 나눠줌 -->
        <div class="col-sm">  
          One of three columns
        </div>
        <!-- "col-6"은 12칸중 6칸을 차지해라 -->
        <div class="col-6">
          One of three columns
        </div>
        <div class="col-sm">
          One of three columns
        </div>
    </div>
</div>
```

진자

```html
<div class="container">
      <div class="row">
        {% raw %}{% for i in range(10) %}{% endraw %}
        <div class="col-md-4">
          <div class="card mb-4 shadow-sm">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect fill="#17a2b8" width="100%" height="100%"></rect><text fill="#eceeef" dy=".3em" x="50%" y="50%">Dongsik</text></svg>
            <div class="card-body">
              <p class="card-text">아 배가 준나 고파요</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                </div>
                <small class="text-muted">9 mins</small>
              </div>
            </div>
          </div>
        </div>
        {% raw %}{% endfor %}{% endraw %}
        </div>
    </div>

```

