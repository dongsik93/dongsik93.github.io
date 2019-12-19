---
layout: post
title: "Django Class Based View (4)"
subtitle: "CBV에 대한 이해 (4)"
date: 2019-12-20 10:00:00 +0900
categories: til
tags: django cbv
comments: true
---

## Django Class Based views (4)

> CBV를 좀 더 자세하게 알아보자
>
> 제네릭 뷰 중 Edit View에 대해 공부 !

<br>

### Generic Edit View

- 폼을 통해 객체를 생성, 수정, 삭제하는 기능을 제공하는 뷰
- **FormView**, **CreateView**, **UpdateView**, **DeleteView**로 구성

#### `FormView`

- 폼이 주어지면 해당 폼을 출력

```python
class FormView(TemplateResponseMixin, BaseFormView):
    """A view for displaying a form and rendering a template response."""
```

- **TemplateResponseMixin**과 **BaseFormView**를 상속받는다

- **BaseFormView**

  ```python
  class BaseFormView(FormMixin, ProcessFormView):
      """A base view for displaying a form."""
  ```

  - **BaseFormView**는 다시 **FormMixin**, **ProcessFormView**를 상속받는다
  - **FormMixin**

  ```python
  class FormMixin(ContextMixin):
      """Provide a way to show and handle a form in a request."""
      initial = {}
      form_class = None
      success_url = None
      prefix = None
  
      def get_initial(self):
          """Return the initial data to use for forms on this view."""
          return self.initial.copy()
  
      def get_prefix(self):
          """Return the prefix to use for forms."""
          return self.prefix
  
      def get_form_class(self):
          """Return the form class to use."""
          return self.form_class
  
      def get_form(self, form_class=None):
          """Return an instance of the form to be used in this view."""
          if form_class is None:
              form_class = self.get_form_class()
          return form_class(**self.get_form_kwargs())
  
      def get_form_kwargs(self):
          """Return the keyword arguments for instantiating the form."""
          kwargs = {
              'initial': self.get_initial(),
              'prefix': self.get_prefix(),
          }
  
          if self.request.method in ('POST', 'PUT'):
              kwargs.update({
                  'data': self.request.POST,
                  'files': self.request.FILES,
              })
          return kwargs
  
      def get_success_url(self):
          """Return the URL to redirect to after processing a valid form."""
          if not self.success_url:
              raise ImproperlyConfigured("No URL to redirect to. Provide a success_url.")
          return str(self.success_url)  # success_url may be lazy
  
      def form_valid(self, form):
          """If the form is valid, redirect to the supplied URL."""
          return HttpResponseRedirect(self.get_success_url())
  
      def form_invalid(self, form):
          """If the form is invalid, render the invalid form."""
          return self.render_to_response(self.get_context_data(form=form))
  
      def get_context_data(self, **kwargs):
          """Insert the form into the context dict."""
          if 'form' not in kwargs:
              kwargs['form'] = self.get_form()
          return super().get_context_data(**kwargs)
  ```

  - 클래스 변수들
    - initial
      - 딕셔너리형식으로 form에 대한 초기 데이터를 포함
    - form_class
      - 인스턴스화 하기위한 form_class를 지정
    - success_url
      - form이 성공적으로 처리될 때 리디렉션할 URL
  - get_initial
    - form에 대한 초기 데이터를 검색, default로 초기 복사본을  return한다
  - get_form_class
    - 사용할 form class를 return
  - get_form
    - 클래스 변수 form_class가 있으면 인스턴스화 하고, 없으면 get_form_class가 실행되어 인스턴스화한 후 return
  - form_valid / form_invalid
    - form이 유효하다면 success_url로 리디렉션, 유효하지 않다면 렌더링
  - **ProcessFormView**

  ```python
  class ProcessFormView(View):
      """Render a form on GET and processes it on POST."""
      def get(self, request, *args, **kwargs):
          """Handle GET requests: instantiate a blank version of the form."""
          return self.render_to_response(self.get_context_data())
  
      def post(self, request, *args, **kwargs):
          """
          Handle POST requests: instantiate a form instance with the passed
          POST variables and then check if it's valid.
          """
          form = self.get_form()
          if form.is_valid():
              return self.form_valid(form)
          else:
              return self.form_invalid(form)
  
      # PUT is a valid HTTP verb for creating (with a known URL) or editing an
      # object, note that browsers only support POST for now.
      def put(self, *args, **kwargs):
          return self.post(*args, **kwargs)
  ```

  - **ProcessFormView**는 GET, POST 워크플로우를 제공한다
  - get
    - get요청을 처리하며 빈 form을 인스턴스화
  - post
    - post요청을 처리하며 전달받은 form을 인스턴스화
    - 전달받은 form이 유효한지, 유효하지 않은지를 검사
  - **TemplateResponseMixin**은 template의 기본적인 설정, template의 이름, rendering 하는 과정들을 담당한다

#### `CreateView`

- 객체를 생성하는 폼 출력

```python
class CreateView(SingleObjectTemplateResponseMixin, BaseCreateView):
    """
    View for creating a new object, with a response rendered by a template.
    """
    template_name_suffix = '_form'
```

- GET요청에 나타나는 **CreateView**페이지는 default로 `_form`의 template_name_suffix를 사용한다

- **SingleObjectTemplateResponseMixin**, **BaseCreateView**를 상속받는다

  - **BaseCreateView**

  ```python
  class BaseCreateView(ModelFormMixin, ProcessFormView):
      """
      Base view for creating a new object instance.
      Using this base class requires subclassing to provide a response mixin.
      """
      def get(self, request, *args, **kwargs):
          self.object = None
          return super().get(request, *args, **kwargs)
  
      def post(self, request, *args, **kwargs):
          self.object = None
          return super().post(request, *args, **kwargs)
  ```

  - **SingleObjectTemplateResponseMixin**

  ```python
  class SingleObjectTemplateResponseMixin(TemplateResponseMixin):
      template_name_field = None
      template_name_suffix = '_detail'
  
      def get_template_names(self):
          """
          Return a list of template names to be used for the request. May not be
          called if render_to_response() is overridden. Return the following list:
          * the value of ``template_name`` on the view (if provided)
          * the contents of the ``template_name_field`` field on the
            object instance that the view is operating upon (if available)
          * ``<app_label>/<model_name><template_name_suffix>.html``
          """
          try:
              names = super().get_template_names()
          except ImproperlyConfigured:
              # If template_name isn't specified, it's not a problem --
              # we just start with an empty list.
              names = []
  
              # If self.template_name_field is set, grab the value of the field
              # of that name from the object; this is the most specific template
              # name, if given.
              if self.object and self.template_name_field:
                  name = getattr(self.object, self.template_name_field, None)
                  if name:
                      names.insert(0, name)
  
              # The least-specific option is the default <app>/<model>_detail.html;
              # only use this if the object in question is a model.
              if isinstance(self.object, models.Model):
                  object_meta = self.object._meta
                  names.append("%s/%s%s.html" % (
                      object_meta.app_label,
                      object_meta.model_name,
                      self.template_name_suffix
                  ))
              elif getattr(self, 'model', None) is not None and issubclass(self.model, models.Model):
                  names.append("%s/%s%s.html" % (
                      self.model._meta.app_label,
                      self.model._meta.model_name,
                      self.template_name_suffix
                  ))
  
              # If we still haven't managed to find any template names, we should
              # re-raise the ImproperlyConfigured to alert the user.
              if not names:
                  raise
  
          return names
  ```

  - `django.views.generic.detail.SingleObjectTemplateResponseMixin`
  - 클래스 변수
    - template_name_field
      - 후보 템플릿의 이름을 결정하는데 사용할 수 있는 현재 개체 인스턴스 필드
    - template_name_suffix
      - 자동으로 생성된 후보 템플릿 이름에 추가할 접미사로, 기본 접미사는 `_detail`이다
  - get_template_names
    - template_name값이 제공된 경우 return
    - 작동중인 개체 인스턴스의 template_name_field 내용이 사용가능한 경우 return
    - `<app_label>/<model_name><template_name_suffix>.html` 형식으로 return
    - **render_to_response()**이 오버라이딩된 경우 호출되지 않을 수 있다

- 사용 예시

```python
# forms.py
from django import forms 
from django.db import models

from .models import Comment

class CommentForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['userName', 'contents', ...]
```

```python
# views.py
from django.views.generic import CreateView
from .forms import CommentForm

class CommentCreateView(CreateView):
    template_name = 'commentBoard/comment_new.html'
    success_url = '/'
    form_class = CommentForm
```

```python
# urls.py
urlpatterns = [
    path('comment/new/', views.CommentCreateView.as_view(), name='comment_new'),
]
```



#### `UpdateView`

- 기존 객체를 수정하는 폼을 출력

```python
class UpdateView(SingleObjectTemplateResponseMixin, BaseUpdateView):
    """View for updating an object, with a response rendered by a template."""
    template_name_suffix = '_form'
```

- **SingleObjectTemplateResponseMixin**, **BaseUpdateView**상속

  - **BaseUpdateView**

  ```python
  class BaseUpdateView(ModelFormMixin, ProcessFormView):
      """
      Base view for updating an existing object.
      Using this base class requires subclassing to provide a response mixin.
      """
      def get(self, request, *args, **kwargs):
          self.object = self.get_object()
          return super().get(request, *args, **kwargs)
  
      def post(self, request, *args, **kwargs):
          self.object = self.get_object()
          return super().post(request, *args, **kwargs)
  ```

  - 기존의 object를 업데이트하기 위한 view
  - response mixin을 제공하기 위해 하위클래스가 필요하다
  - **ModelFormMixin**

  ```python
  class ModelFormMixin(FormMixin, SingleObjectMixin):
      """Provide a way to show and handle a ModelForm in a request."""
      fields = None
  
      def get_form_class(self):
          """Return the form class to use in this view."""
          if self.fields is not None and self.form_class:
              raise ImproperlyConfigured(
                  "Specifying both 'fields' and 'form_class' is not permitted."
              )
          if self.form_class:
              return self.form_class
          else:
              if self.model is not None:
                  # If a model has been explicitly provided, use it
                  model = self.model
              elif getattr(self, 'object', None) is not None:
                  # If this view is operating on a single object, use
                  # the class of that object
                  model = self.object.__class__
              else:
                  # Try to get a queryset and extract the model class
                  # from that
                  model = self.get_queryset().model
  
              if self.fields is None:
                  raise ImproperlyConfigured(
                      "Using ModelFormMixin (base class of %s) without "
                      "the 'fields' attribute is prohibited." % self.__class__.__name__
                  )
  
              return model_forms.modelform_factory(model, fields=self.fields)
  
      def get_form_kwargs(self):
          """Return the keyword arguments for instantiating the form."""
          kwargs = super().get_form_kwargs()
          if hasattr(self, 'object'):
              kwargs.update({'instance': self.object})
          return kwargs
  
      def get_success_url(self):
          """Return the URL to redirect to after processing a valid form."""
          if self.success_url:
              url = self.success_url.format(**self.object.__dict__)
          else:
              try:
                  url = self.object.get_absolute_url()
              except AttributeError:
                  raise ImproperlyConfigured(
                      "No URL to redirect to.  Either provide a url or define"
                      " a get_absolute_url method on the Model.")
          return url
  
      def form_valid(self, form):
          """If the form is valid, save the associated model."""
          self.object = form.save()
          return super().form_valid(form)
  
  ```

  - ModelForms에서 작동하는 mixin
  - **SingleObjectMixin**의 하위 클래스이기 때문에 ModelForm이 조작하고 있는 객체의 유형을 설명하는 모델과 Queryset 속성에 접근할 수 있다
  - fields
    - 모델을 사용하는, 즉 form class를 자동으로 생성하는 경우 필수 속성이다
    - 이 속성을 생략하게되면 `ImproperlyConfigured exception` 발생

- 사용 예시

```python
# views.py
class CommentUpdateView(UpdateView):
    model = Comment
    context_object_name = 'Comment'
    form_class = CommentForm
    template_name = 'commentBoard/Comment_update.html'
    success_url = '/'

    # get object
    def get_object(self): 
        comment = get_object_or_404(Comment, pk=self.kwargs['pk'])

        return comment
```

- **context_object_name**을 정해서 해당 이름으로 template에서 사용 할 수 있게 해줌
- **template_name**을 `commentBoard/Comment_update.html`로 템플릿 파일로 지정
- **success_url** 을 통해 리디렉션할 url 설정
- `comment`는 해당 데이터 객체의 pk를 받아서 해당 pk와 일치하는 Comment 데이터 객체를 찾게 된다.

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('comment/<int:pk>/edit/', views.CommentUpdateView.as_view(), name='comment_edit'),
]
```

- 여기서 pk를 `CommentUpdateView`에 전달하게 됨



#### `DeleteView`

- 기존 객체를 삭제하는 폼을 출력

```python
class DeleteView(SingleObjectTemplateResponseMixin, BaseDeleteView):
    """
    View for deleting an object retrieved with self.get_object(), with a
    response rendered by a template.
    """
    template_name_suffix = '_confirm_delete'
```

- **SingleObjectTemplateResponseMixin**, **BaseDeleteView** 상속

  - **BaseDeleteView**

  ```python
  class BaseDeleteView(DeletionMixin, BaseDetailView):
      """
      Base view for deleting an object.
      Using this base class requires subclassing to provide a response mixin.
      """
  ```

  - UpdateView와 마찬가지로 mixin을 위해 하위클래스
  - **DeletionMixin**

  ```python
  class DeletionMixin:
      """Provide the ability to delete objects."""
      success_url = None
  
      def delete(self, request, *args, **kwargs):
          """
          Call the delete() method on the fetched object and then redirect to the
          success URL.
          """
          self.object = self.get_object()
          success_url = self.get_success_url()
          self.object.delete()
          return HttpResponseRedirect(success_url)
  
      # Add support for browsers which only accept GET and POST for now.
      def post(self, request, *args, **kwargs):
          return self.delete(request, *args, **kwargs)
  
      def get_success_url(self):
          if self.success_url:
              return self.success_url.format(**self.object.__dict__)
          else:
              raise ImproperlyConfigured(
                  "No URL to redirect to. Provide a success_url.")
  ```

  - success_url
    - 지정된 개체가 삭제되었을 때 리디렉션할 url
    - `/parent/{parent_id}/` 처럼 사전 문자열 형식을 포함할 수 있다

<br>

참고사이트

- [django 공식문서](https://docs.djangoproject.com/ko/2.2/topics/class-based-views/generic-display/){: class="underlineFill"}
