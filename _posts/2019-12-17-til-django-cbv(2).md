---
layout: post
title: "Django Class Based View (2)"
subtitle: "CBV에 대한 이해 (2)"
date: 2019-12-17 10:00:00 +0900
categories: til
tags: django cbv
comments: true
---

## Django Class Based views (2)

> CBV를 좀 더 자세하게 알아보자
>
> 제네릭 뷰가 어떻게 구성되어 있는지 !!

<br>

### Generic View제네릭 뷰

- 반복적으로 사용되는 공통 부분을 패턴화하여 사용하기 쉽게 추상화 해둔 것

- #### **Base View**

  - View, TemplateView, RedirectView
  - 모든 CBV의 부모 클래스로서 기본적인 기능들이 들어있다
  - 직접 쓸 일은 거의 없지만 다른 클래스들을 사용함으로써 간접적으로 항상 사용되고 있다
  - [전체 코드 보기](https://github.com/django/django/blob/2.1/django/views/generic/base.py){: class="underlineFill"}
  - `View`
    - 최상위 부모 제네릭 뷰 클래스

  ```python
  class View:
      """
      Intentionally simple parent class for all views. Only implements
      dispatch-by-method and simple sanity checking.
      """
  
      http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']
  
      def __init__(self, **kwargs):
          """
          Constructor. Called in the URLconf; can contain helpful extra
          keyword arguments, and other things.
          """
          # Go through keyword arguments, and either save their values to our
          # instance, or raise an error.
          for key, value in kwargs.items():
              setattr(self, key, value)
  
      @classonlymethod
      def as_view(cls, **initkwargs):
          """Main entry point for a request-response process."""
          for key in initkwargs:
              if key in cls.http_method_names:
                  raise TypeError("You tried to pass in the %s method name as a "
                                  "keyword argument to %s(). Don't do that."
                                  % (key, cls.__name__))
              if not hasattr(cls, key):
                  raise TypeError("%s() received an invalid keyword %r. as_view "
                                  "only accepts arguments that are already "
                                  "attributes of the class." % (cls.__name__, key))
  
          def view(request, *args, **kwargs):
              self = cls(**initkwargs)
              if hasattr(self, 'get') and not hasattr(self, 'head'):
                  self.head = self.get
              self.request = request
              self.args = args
              self.kwargs = kwargs
              return self.dispatch(request, *args, **kwargs)
          view.view_class = cls
          view.view_initkwargs = initkwargs
  
          # take name and docstring from class
          update_wrapper(view, cls, updated=())
  
          # and possible attributes set by decorators
          # like csrf_exempt from dispatch
          update_wrapper(view, cls.dispatch, assigned=())
          return view
  
      def dispatch(self, request, *args, **kwargs):
          # Try to dispatch to the right method; if a method doesn't exist,
          # defer to the error handler. Also defer to the error handler if the
          # request method isn't on the approved list.
          if request.method.lower() in self.http_method_names:
              handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
          else:
              handler = self.http_method_not_allowed
          return handler(request, *args, **kwargs)
  
      def http_method_not_allowed(self, request, *args, **kwargs):
          logger.warning(
              'Method Not Allowed (%s): %s', request.method, request.path,
              extra={'status_code': 405, 'request': request}
          )
          return HttpResponseNotAllowed(self._allowed_methods())
  
      def options(self, request, *args, **kwargs):
          """Handle responding to requests for the OPTIONS HTTP verb."""
          response = HttpResponse()
          response['Allow'] = ', '.join(self._allowed_methods())
          response['Content-Length'] = '0'
          return response
  
      def _allowed_methods(self):
          return [m.upper() for m in self.http_method_names if hasattr(self, m)]
  ```

  - **init**
    - **as_view**에 인자를 넘겨주게 되면 그 인자가 `*kwargs`로 넘어와 이 dict 를 순회하며 해당 설정을 해주게 된다. 예를 들어 `template_name` 값을 지정했다고 하면 인스턴스 변수를 생성하여 이에 값을 할당하고 해당 변수가 필요할 경우 클래스 변수보다 인스턴스 변수를 먼저 참조한다.
  - **as_view**
    - view를 하나 만들어서 이를 return 한다.  클래스를 정의한 후에 이에 해당하는 함수를 만들어 그 함수를 사용하는 방식으로 동작하기 때문에 CBV도 결국 기본적인 동작은 함수를 베이스로 한다.
  - **dispatch**
    - **as_view** 메소드 내부에서 호출된다. request method에 들어있는 method가 정의된 **http_method_names**에 해당된다면 request에서 이를 가져오게되고, 정상적인 method가 아니라면 `http_method_not_allowed`를 호출하게 된다.
  - `TemplateView`
    - 주어진 템플릿으로 렌더링

  ```python
  class TemplateView(TemplateResponseMixin, ContextMixin, View):
      """
      Render a template. Pass keyword arguments from the URLconf to the context.
      """
      def get(self, request, *args, **kwargs):
          context = self.get_context_data(**kwargs)
          return self.render_to_response(context)
  ```

  - **TemplateView**는 `TemplateResponseMixin`, `ContextMixin`, `View` 3개의 class를 상속받는다
  - 기본 **View**는 항상 맨 오른쪽에 위치하며, Mixin들은 View의 왼쪽에 위치하게 된다

  - **TemplateResponseMixin**

    ```python
    class TemplateResponseMixin:
        """A mixin that can be used to render a template."""
        """Template의 기본적인 설정들"""
        template_name = None
        template_engine = None
        response_class = TemplateResponse
        content_type = None
    
        def render_to_response(self, context, **response_kwargs):
            """
            Return a response, using the `response_class` for this view, with a
            template rendered with the given context.
            Pass response_kwargs to the constructor of the response class.
            rendering하는 과정
            """
            response_kwargs.setdefault('content_type', self.content_type)
            return self.response_class(
                request=self.request,
                template=self.get_template_names(),
                context=context,
                using=self.template_engine,
                **response_kwargs
            )
    
        def get_template_names(self):
            """
            Return a list of template names to be used for the request. Must return
            a list. May not be called if render_to_response() is overridden.
            template의 이름을 설정
            """
            if self.template_name is None:
                raise ImproperlyConfigured(
                    "TemplateResponseMixin requires either a definition of "
                    "'template_name' or an implementation of 'get_template_names()'")
            else:
                return [self.template_name]
    ```

    - **TemplateResponseMixin**은 template의 기본적인 설정, template의 이름, rendering 하는 과정들을 담당한다. 

  - **ContextMixin**

    ```python
    class ContextMixin:
        """
        A default context mixin that passes the keyword arguments received by
        get_context_data() as the template context.
        """
        extra_context = None
    
        def get_context_data(self, **kwargs):
            kwargs.setdefault('view', self)
            if self.extra_context is not None:
                kwargs.update(self.extra_context)
            return kwargs
    ```

    - context를 받아서 처리해주는 함수
    - 정적인 context에 대해서는 **extra_context** 변수를 사용해서 처리
    - 동적인 경우에는 **get_context_data**함수를 오버라이딩해서 사용한다

  - **TemplateView**를 상속한 CBV의  예

  ```python
  # CBV
  from django.views.generic import TemplateView
  from articles.models import Article
  
  # 동적인 context
  index = TemplateView.as_view(
  	template_name = "index.html",
      extra_context = {'one': 1},
  )
  
  # 정적인 context (eg. request.user)
  class MyTemplateView(TemplateView):
      template_name = "index.html"
      # 오버라이딩
      def get_context_data(self, **kwargs):
          # 기본 구현 호출
          context = super().get_context_data(**kwargs)
          # Article의 QuerySet을 더한다
          context['latest_articles'] = Article.objects.all()[:5]
          # QuerySet이 아닌 다르게 더하기
          context.update({
              'one': 1,
              'userName' : self.request.user,
          })
          return context
  ```

  - `RedirectView`
    - 주어진 URL로 리다이렉트

  ```python
  class RedirectView(View):
      """Provide a redirect on any GET request."""
      permanent = False
      url = None
      pattern_name = None
      query_string = False
  
      def get_redirect_url(self, *args, **kwargs):
          """
          Return the URL redirect to. Keyword arguments from the URL pattern
          match generating the redirect request are provided as kwargs to this
          method.
          """
          if self.url:
              url = self.url % kwargs
          elif self.pattern_name:
              url = reverse(self.pattern_name, args=args, kwargs=kwargs)
          else:
              return None
  
          args = self.request.META.get('QUERY_STRING', '')
          if args and self.query_string:
              url = "%s?%s" % (url, args)
          return url
  
      def get(self, request, *args, **kwargs):
          url = self.get_redirect_url(*args, **kwargs)
          if url:
              if self.permanent:
                  return HttpResponsePermanentRedirect(url)
              else:
                  return HttpResponseRedirect(url)
          else:
              logger.warning(
                  'Gone: %s', request.path,
                  extra={'status_code': 410, 'request': request}
              )
              return HttpResponseGone()
  
      def head(self, request, *args, **kwargs):
          return self.get(request, *args, **kwargs)
  
      def post(self, request, *args, **kwargs):
          return self.get(request, *args, **kwargs)
  
      def options(self, request, *args, **kwargs):
          return self.get(request, *args, **kwargs)
  
      def delete(self, request, *args, **kwargs):
          return self.get(request, *args, **kwargs)
  
      def put(self, request, *args, **kwargs):
          return self.get(request, *args, **kwargs)
  
      def patch(self, request, *args, **kwargs):
          return self.get(request, *args, **kwargs)
  ```

  - **get**
    -  **get_redirect_url**을 호출하여 url을 얻는다. 
    - url을 얻지 못하면 에러 출력, url을 제대로 얻었다면 **permanent**에 의해 분기되지만 결과적으로 redirect된다
  - **get_redirect_url**
    - 클래스 변수 url을 통해 직접 url을 받아오거나 **pattern_name**을 통해 url의 name 값을 받아왔으면 이를 return
    - 추가로 **parment**나 **query_string**을 지정해줄 수 있다
  - **head, post, options ... patch**
    - 모두 get 함수를 실행시킨다

<br>

참고사이트
- [django 공식문서](https://docs.djangoproject.com/ko/2.2/topics/class-based-views/generic-display/){: class="underlineFill"}
- [CBV (1) CBV와 Base Views](https://ssungkang.tistory.com/entry/Django-CBV-1-CBV-와-Base-Views){: class="underlineFill"}
- [클래스형 뷰 (CBV)](https://wikidocs.net/9623){: class="underlineFill"}
- [Django class based views for beginners](https://www.slideshare.net/spinlai/django-class-based-views-for-beginners){: class="underlineFill"}

