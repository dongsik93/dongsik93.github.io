---
layout: post
title: "[Android] Material Design(2)"
subtitle: "android "
date: 2020-03-25 18:30:00 +0900
categories: til
tags: material android
comments: true
---





# Material Design(2)



## Components





### App bars

- 현재 화면과 관련된 정보와 작업이 표시된다
- 위치에 따라 Top // Bottom으로 나눌 수 있다

![스크린샷 2020-03-24 오후 3.56.17](/img/in-post/md(2)/md_1.png)

​	container / navigation Icon / title / action items / overflow menu

- Bar

  - 이미지가 들어갈 수 있다

  ![스크린샷 2020-03-24 오후 4.00.06](/img/in-post/md(2)/md_2.png)

- 액션아이콘

  - 액션 아이콘은 가장 많이 사용하는 순서를 왼쪽부터 배치한다
  - 앱 바에 맞지 않는 활동들은 오버플로우 메뉴에 넣는다

![스크린샷 2020-03-24 오후 4.03.52](/img/in-post/md(2)/md_3.png)

- Bottom
  - 플로팅 버튼이 추가로 나타난다





### Backdrop

- 프론트 레이어, 백 레이어 2개의 면으로 구성

![스크린샷 2020-03-24 오후 4.11.30](/img/in-post/md(2)/md_4.png)

- 프론트 레이어
  - 주요 컨텐츠를 보여준다
- 백 레이어
  - 탭이나 스텝 등 현재 상황에 관한 내용을 알려주거나
  - 필터처럼 프론트 레이어에 있는 컨텐츠를 컨트롤할 수 있는 요소들을 보여준다
- 주 사용 예시
  - 네비게이션, 스테퍼, 텍스트 필드, 필터

![스크린샷 2020-03-24 오후 4.15.35](/img/in-post/md(2)/md_5.png)



### Navigation Menu

- ##### BottomNavigation

  - 앱의 하단에 메뉴를 구성 
  - 모바일이나 태블릿에서만 사용 
  - 3개 이상 -- 5개 이하로 메뉴를 구성한다
    - 초과하면 navigation drawer or tabs
    - 미만이면 tabs

  ![스크린샷 2020-03-24 오후 4.28.56](/img/in-post/md(2)/md_6.png) ![스크린샷 2020-03-24 오후 4.35.11](/img/in-post/md(2)/md_7.png)



- ##### Navigation drawer

  - 탐색 창을 통해 나타나게된다
  - 목적지가 5개 이상인 앱, 관련 없는 목적지 간 빠른 탐색이 가능

  ![스크린샷 2020-03-24 오후 4.43.35](/img/in-post/md(2)/md_8.png)

  container / header / divider / active text overlay / active text / inactive text / subtitle / scrim

  - 상태에는 active / inactive / focus / pressed / hover 가 있다



- ##### Navigation rail

  - 데스크탑이나 태블린 등 모바일화면보다 비교적 큰 화면에 사용
  - 이메일 보기와 같은 단일 작업에서 사용된다

  ![스크린샷 2020-03-24 오후 4.51.43](/img/in-post/md(2)/md_9.png)



### Buttons

- 사용자가 한번의 탭으로 선택을 할 수 있도록 한다 

- 버튼은 dialog, modal window, formm, card, toolbar등 여러곳에서 자주 쓰인다

  ![스크린샷 2020-03-25 오후 2.57.55](/img/in-post/md(2)/md_10.png)

  1. text button(낮은 강조)
  2. outline button(중간 강조)
  3. contained button(높은 강조)
  4. toggle button

  - 버튼의 강조 수준은 3단계로 나뉜다

    ![스크린샷 2020-03-25 오후 3.00.05](/img/in-post/md(2)/md_11.png)

    - 이러한 강조 수준으로 모양, 글자 타입, 위치등이 결정된다

  - 버튼의 상태

    ![스크린샷 2020-03-25 오후 3.00.49](/img/in-post/md(2)/md_12.png)



### Card

- 카드는 하나의 주제에 대한 내용과 액션들을 포함하고 있다

  ![스크린샷 2020-03-25 오후 3.01.36](/img/in-post/md(2)/md_13.png)

container / thumbnail / header text / subhead / media / supporting text / buttons / icons

- 각각의 카드는 내용 블록으로 이루어져 있다. 이 모든 블록은 전체적으로 하나의 주제나 목적지와 관련이 있다

  ![스크린샷 2020-03-25 오후 3.02.56](/img/in-post/md(2)/md_14.png)

- 카드에는 사용자가 카드의 내용과 상호작용을 할 수 있도록 UI 제어가 포함될 수 있다

  ![스크린샷 2020-03-25 오후 3.03.35](/img/in-post/md(2)/md_15.png)



### Chip

- 칩은 입력, 속성 또는 동작을 나타내는 요소이다 
- 칩의 종류에는 input chip, choice chip, filter chip, action chip등이 있다

![스크린샷 2020-03-25 오후 3.04.39](/img/in-post/md(2)/md_16.png)![스크린샷 2020-03-25 오후 3.04.48](/img/in-post/md(2)/md_17.png)

![스크린샷 2020-03-25 오후 3.04.57](/img/in-post/md(2)/md_18.png)![스크린샷 2020-03-25 오후 3.05.04](/img/in-post/md(2)/md_19.png)



### Dialogs

- dialog는 앱 콘텐츠 앞에 나타나 중요한 정보를 제공하거나 결정을 요구하는 모달 윈도우의 일종이다. 
- 나타날 때 모든 앱 기능을 비활성화하고 확인, 해제 또는 필요한 조치를 취할 때까지 화면에 유지한다. 
- 이러한 dialog는 사용자에게 방해가 될 수 있으므로, 적게 사용해야 한다. 
- 기본적으로 스크림을 어둡게하고 뷰포트의 가운데에 배치된다
- 종류에는 alert dialog, simple dialog, confirmation dialog, full-screen dialog

![스크린샷 2020-03-24 오후 3.38.07](/img/in-post/md(2)/md_20.png)



### Picker

- 사용자가 날짜 또는 날짜 범위를 선택할 수 있는 날짜 선택기

  ![스크린샷 2020-03-25 오후 3.08.56](/img/in-post/md(2)/md_21.png)

  - 모바일에서의 date picker의 모습

    title / selected date range / switch to keyboard input icon / 

    month and year label / current date / start date / selected range / end data



### Progress indicators 

- 진행률을 보여주는 요소로서 지정되지 않은 대기시간을 표시하거나 프로세스의 길이를 보여준다

  ![스크린샷 2020-03-25 오후 3.11.12](/img/in-post/md(2)/md_22.png)

  - 선형의 모습과 원형의 모습의 차이



### Selection controls

- Radio buttons 

  - 단일 옵션을 선택할 때 사용 
  - 모든 옵션들을 보여준다

  ![스크린샷 2020-03-25 오후 3.12.49](/img/in-post/md(2)/md_23.png)

- Checkboxes 

  - 목록에서 하나 이상의 옵션 선택 

  - 하위 선택 항목이 포함된 목록 표시

    ![스크린샷 2020-03-25 오후 3.14.02](/img/in-post/md(2)/md_24.png)

- switches 

  - 모바일 및 태블릿에서 단일 항목 설정/해제 
  - 항목을 즉시 활성화 또는 비활성화할 때 사용한다

  ![스크린샷 2020-03-25 오후 3.14.48](/img/in-post/md(2)/md_25.png)



### Snackbar

- 스낵바는 화면 하단의 앱 프로세스에 대한 간단한 메시지를 제공한다

- 스낵바는 앱이 수행했거나 수행할 프로세스를 사용자에게 알려준다 

- 화면 아래쪽으로 일시적으로 나타나며, 사용자 경험을 방해해서는 안되고 사용자 입력이 사라지도록 요구하지 않는다

  ![스크린샷 2020-03-25 오후 3.16.01](/img/in-post/md(2)/md_26.png)

  - 그리처럼 스낵바에 액션을 넣을 수도 있다



### TextField

- Filled text field, Outlined text 로 나뉜다 

  ![스크린샷 2020-03-25 오후 3.17.29](/img/in-post/md(2)/md_28.png)

- 텍스트 필드 컨테이너 

  - 텍스트 필드와 주변 내용 사이에 대비를 만들어 텍스트 필드의 검색 가능성을 향상시킨다

- 보조 요소들

  ![스크린샷 2020-03-25 오후 3.43.35](/img/in-post/md(2)/md_29.png)

  1. helper text 
     - 사용방법과 같은 입력필드에 대한 추가적인 방법들을 보여준다

  1. Error message 
     - 입력 라인 아래에 오류 메시지가 표시되며, 수정될 때까지 helper 텍스트를 대체한다. 

  1. icon 
     - 아이콘은 경고 메시지에 사용될 수도 있다 

  1. character counter 
     - 문자나 단어 제한이 있는 경우 문자 또는 워드 카운터를 사용해야 한다 
     - 사용된 문자의 비율과 총 문자 제한을 표시한다

- Input type

  - Single line text field 

    - 커서가 오른쪽 필드 가장자리에 도달하면 입력 라인보다 긴 텍스트가 자동으로 왼쪽으로 스크롤된 다. 

    - 긴 문장을 입력받는데에는 적합하지 않다

      ![스크린샷 2020-03-25 오후 3.46.11](/img/in-post/md(2)/md_30.png)

  - Multi-line text field

    - 모든 사용자 입력을 한 번에 표시한다
    - 텍스트가 오버플로되면 텍스트 필드가 확장되고(화면 요소를 아래로 이동), 텍스트가 새 라인으로 이동된다

    ![스크린샷 2020-03-25 오후 3.46.58](/img/in-post/md(2)/md_31.png)

  - Text areas

    - 텍스트 필드보다 크며 커서가 필드의 맨 아래로 가게되면 고정된 높이로 스크롤이 된다 
    - 웹에서 multi-line 대신에 사용한다

    ![스크린샷 2020-03-25 오후 3.47.37](/img/in-post/md(2)/md_32.png)

  - Ready-only field

    - 사용자가 편집할 수 없는 미리 채워진 텍스트가 표시된다

    ![스크린샷 2020-03-25 오후 3.47.37](/img/in-post/md(2)/md_33.png)



참고사이트 

- [Material Design](https://material.io/){: class="underlineFill"} 