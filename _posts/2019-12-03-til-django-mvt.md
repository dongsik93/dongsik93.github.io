---
layout: post
title: "Django MVT Pattern"
subtitle: "django MVT"
date: 2019-12-03 21:00:00 +0900
categories: til
tags: django db
comments: true
---

## Django MTV패턴

> Python 웹 프레임워크인 Django의 개발방식에 대해 알아보자

### MTV Pattern

- Django의 `MTV` 패턴은 자바의 MVC패턴(Model, View, Controller) 방식과 거의 동일한 개념이다
- 테이블을 정의하는 `모델(Model)`, 사용자가 보는 화면의 모습을 정의하는 `템플릿(Template)`, 애프릴케이션의 제어 흐름 및 처리 로직을 정의하는 `뷰(View)` 로 구분해서 개발을 진행한다
  - MVC에서는 Controller가 로직을 담당하고 View가 UI를 담당한다

### 왜 3가지로 나누어서 개발을 ..?

- 3가지로 나누어서 개발을 진행하면 Model, Template, View 모듈 간 독립성을 유지할 수 있다

- 각각의 역할에 따라 나눌 수 있다면 개발이 빨라지고, 디자이너, 응용개발자, DB설계자 간 협업도 쉬워지게 된다

- 소프트웨어 개발의 중요한 느슨한 결합(Loose Coupling)설계의 원칙에 부합하다

  > 소프트웨어 공학의 전통적 이론에 따르면 유지보수성이 높은 소프트웨어는 프로그램의 각 요소들이 **결합도는 낮게**, **응집도는 높게**구성되어야 한다고 말한다
  >
  > **결합도**란?
  >
  > 코드의 한 요소가 다른 것과 얼마나 연결되어 있는지, 또한 얼마나 의존적인지를 나타내는 정도

### Model

- 데이터베이스에 어떤 정보를 받고 이를 정의하는 곳
- Django에서는 `ORM`을 통해서 SQL언어를 사용하지 않고 Python 문법을 통해 데이터베이스를 정의한다

```python
# models.py의 예시
class Movie(models.Model):
	title = models.CharField(max_length=30)
    audience = models.IntegerField()
    poster_url = models.TextField()
    description = models.TextField()
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)    
```

- `Movie`클래스는 데이터베이스의 `테이블`에 해당되고, 클래스 안의 속성들은 데이터베이스 테이블의 `컬럼`에 해당한다

### View

- URL 요청이 들어오면 View에 정의된 해당 URL에 대한 View가 실행된다
- View를 정의하는 방식에 따라 `Function-based View(FBV)`와 `Class-based View(CBV)`로 나뉜다

```python
# views.py의 예시
## Function-based View
def list(request):
    movies = Movie.objects.all()
    return render(request, "movie/list.html", {"movies":movies})

## Class-based View
class List(ListView):
	def get_querset(self):
        return Movie.objects.all()
```

### Template

- 사용자가 보는 UI를 담당한다
- html 태그의 경우 그대로 사용 가능하며, 내부에서 Python문법을 사용할 때는 Django에서 제공하는 `Django template language`를 사용한다

```html
<!-- list.html 의 예시-->
{% raw %}{% extends "movie/base.html" %}{% endraw %}
{% raw %}{% block body %}{% endraw %}
    
    {% raw %}{% for movie in movies %}{% endraw %}
    <h1>list page</h1>
    {% raw %}{% endfor %}{% endraw %}

{% raw %}{% endblock %}{% endraw %}
```

<br> 참고사이트

- [결합도(Coupling), 응집도(Cohesion)](https://lazineer.tistory.com/93){: class="underlineFill"}
- [장고의 MVT 패턴](https://justmakeyourself.tistory.com/entry/django-mvt-pattern){: class="underlineFill"}
- [MTV패턴(장고Django)](https://jayzzz.tistory.com/68){: class="underlineFill"}
- [The Django template language](https://docs.djangoproject.com/ko/2.2/ref/templates/language){: class="underlineFill"}