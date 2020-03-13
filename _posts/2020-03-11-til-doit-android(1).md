---
layout: post
title: "안드로이드 스튜디오와 기본 레이아웃 익히기"
subtitle: "Do it! 안드로이드(1)"
date: 2020-03-11 17:00:00 +0900
categories: til
tags: android
comments: true
---



## [Android] 안드로이드 스튜디오와 기본 레이아웃 익히기

### 뷰(View)

뷰?

- 일반적으로 컨트롤이나 위젯으로 불리는 UI 구성 요소
- 이러한 뷰를 여러 개 포함하고 있는 것을 뷰그룹(ViewGroup)
- 뷰그룹은 뷰를 상속하여 뷰그릅도 뷰처럼 다룰 수 있도록 만들어져 있다
  - 즉 여러 개의 뷰를 담고있는 뷰그룹 역시 또 다른 하나의 뷰
  - 이러한 관계는 컴포지트 패턴(Composite Pattern)을 사용한 것
- 뷰 중에서 일반적인 컨트롤의 역할을 하는 것을 위젯(Widget)이라고 한다
- 뷰그룹 중에서 내부에 뷰들을 포함하고 있으면서 그것들을 배치하는 역할을 하는 것을 레이아웃(Layout)이라고 부른다



#### 뷰의 크기 속성

- 뷰는 화면의 일정 영역을 차지하기 때문에 모든 뷰는 크기 속성을 필수 값으로 가지고 있어야 한다

- `android:` 는 안드로이드의 기본 API에서 정의한 속성이라는 의미

  - 커스터마이징했거나, 서드파티라이브러리를 사용했을 때 그 안에 정의된 속성이라면 다른 단어가 속성 앞에 붙을 수 있다

  ```
  속성Prefix: 속성명1 = "속성값1"
  android:layout_width = "wrap_content"
  app:layout_constraintLeft_toLeftOf = "parent"
  ```

- 뷰의 필수 속성

  - layout_width
  - layout_height
  - 화면 안에 들어있으려면 먼저 뷰의 크기와 위치가 결정되어야 하기 때문에 필수 속성

- 각각 크기의 값은 `wrap_content`, `match_parent`, `숫자로 크기 지정` 세가지 값 중 하나가 들어간다

  - `wrap_content` : 뷰에 들어 있는 내용물의 크기에 자동으로 맞춘다
  - `match_parent` : 뷰를 담고 있는 뷰그룹의 여유 공간을 꽉 채운다
  - `숫자로 크기 조정` : 숫자를 사용해 크기를 지정, 크기는 단위가 필요하다
    - 단위 : dp, sp



#### 제약 레이아웃

제약조건이란? (Constraint)

- 뷰가 레이아웃 안의 다른 요소와 어떻게 연결되는지를 알려주는 것
- 뷰의 연결점(Anchor Point)과 대상(Target)을 연결한다
- 연결선을 만들 때는 뷰의 연결점과 타깃이 필요하다
- 타겟
  - 같은 레이아웃 안에 들어있는 다른 뷰의 연결점
  - 부모 레이아웃의 연결점
  - 가이드라인
- 대상 뷰와 연결점
  - 위쪽, 아래쪽, 왼쪽, 오른쪽
  - 가로축의 가운데(CenterX), 세로축의 가운데(CenterY)
  - 베이스라인(Baseline) : 텍스트를 보여주는 뷰인 경우에만
- 마진(Margin)
  - 버튼이 벽면과 얼마나 떨어져 있는지 나타내는 값
- 바이어스(Bias)
  - 화면을 비율로 나눈 후 어느 곳에 위치시킬 것인지를 결정하는 값
  - % 단위로
- Constraint Widget
  - 부모 여유 공간 채우기 - match_constraint
    - 사각형 안쪽의 선이 구불구불한 선으로 표시됨
  - 뷰의 내용물 채우기 - wrap_content
    - 사각형 안쪽의 선이 중앙을 향하는 화살표로 표시됨
  - 고정 크기 - 지정한 값
    - 사각형 안쪽의 선이 직선으로 표시됨
- 규칙
  - `layout_constraint[소스 뷰의 연결점]_[타깃 뷰의 연결점] = "[타겟 뷰의 id]"`
  - layout_constraintTop_toBottomOf="@+id/button"



#### 가이드라인

- 여러개의 뷰를 일정한 기준 선에 정렬할 때 사용
- 뷰처럼 화면에 추가할 수 있지만 그 크기가 0이고 화면에 보이지 않으며 레이아웃에서 없는것으로 간주된다
  - 즉 화면 배치를 위해 추가되었지만 실제 화면의 구성요소는 아닌 것으로 생각하면 된다

```xml
<!--세로 축 기준으로 가이드 라인 추가-->
<androidx.constraintlayout.widget.Guideline
        android:id="@+id/guideline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        app:layout_constraintGuide_begin="100dp" />
```

- 필수 속성인 `layout_width`, `layout_height` 가 들어가 있다
- 가이드라인의 필수 속성은 `android:orientation`
  - 가로 또는 세로 방향을 지정

- 부모 레이아웃의 벽면에서 얼마나 떨어뜨려 위치하는지
  - `layout_constraintGuide_begin` 
    - 세로방향인 경우 왼쪽부터
    - 가로방향인 경우 위쪽부터 거리 지정
  - `layout_constraintGuide_end`
    - 세로방향인 경우 오른쪽부터
    - 가로방향인 경우 아래쪽부터 거리 지정
  - `layout_constraintGuide_percent`
    - layout_constraintGuide_begin 대신 지정하되 % 단위로 거리 지정
  - 제약조건을 설정하는 속성은 외부 라이브러리의 속성이므로 모두 `app:`가 앞에 붙는다



#### xml 속성들

- `xmlns:`
  - `xmlns:android` : 안드로이드 기본 SDK에 포함되어 있는 속성을 사용
  - `xmls:app` : 프로젝트에서 사용하는 외부 라이브러리에 포함되어 있는 속성을 사용
  - `xmlns:tools` : 안드로이드 스튜디오의 디자이너 도구 등에서 화면에 보여줄 때 사용

- `android:id` 
  - ConstraintLayout 태그 안에 들어있다
  - XML 레이아웃 파일 안에서 뷰를 구분할 때 사용
  - XML 레이아웃 파일에서 정의한 뷰를 자바 소스 파일에서 찾을 때 사용

- 뷰의 크기 단위

  | 단위        | 단위 표현        | 설명                                                         |
  | ----------- | ---------------- | ------------------------------------------------------------ |
  | px          | 픽셀             | 화면 픽셀의 수                                               |
  | dp \|\| dip | 밀도 독립적 픽셀 | 160dpi 화면을 기준으로 한 픽셀                               |
  | sp \|\| sip | 축척 독립적 픽셀 | 텍스트 크기를 지정할 때 사용하는 단위.<br>가변 글꼴을 기준으로 한 픽셀로 dp와 유사하나 <br>글꼴의 설정에 따라 1sp당 픽셀수가 달라짐 |
  | in          | 인치             | 1인치로 된 물리적 길이                                       |
  | mm          | 밀리미터         | 1밀리미터로 된 물리적 길이                                   |
  | em          | 텍스트 크기      | 글꼴과 상관없이 동일한 텍스트 크기 표시                      |

  - 실제 앱의 화면을 구성할 때는 dp 단위를 주로 사용
  - 텍스트 크기는 sp 사용





본 문서는 Do it! 안드로이드 앱 프로그래밍을 보고 작성하였습니다.