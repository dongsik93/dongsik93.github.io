---
layout: post
title: "Django Class Based View (3)"
subtitle: "CBV에 대한 이해 (3)"
date: 2019-12-18 16:00:00 +0900
categories: til
tags: django cbv
comments: true
---

## Django Class Based views (3)

> CBV를 좀 더 자세하게 알아보자
>
> 제네릭 뷰 중 Display View에 대해 공부 !

<br>

### Generic Display View

- 객체의 목록 또는 하나의 객체 상세 정보를 보여주는 뷰

- **DetailView**와 **ListView**로 구성된다.

- `DetailView`

  - 조건에 맞는 하나의 객체를 출력한다

  ```python
  class DetailView(SingleObjectTemplateResponseMixin, BaseDetailView):
      """
      Render a "detail" view of an object.
      By default this is a model instance looked up from `self.queryset`, but the
      view will support display of *any* object by overriding `self.get_object()`.
      """
  ```

  - 아무런 내용 없이 **SingleObjectTemplateResponseMixin**과 **BaseDetailView** 두개의 클래스를 상속받는다

  - **BaseDetailView**

    ```python
    class BaseDetailView(SingleObjectMixin, View):
        """A base view for displaying a single object."""
        def get(self, request, *args, **kwargs):
            self.object = self.get_object()
            context = self.get_context_data(object=self.object)
            return self.render_to_response(context)
    ```

  - get요청에 대해서 db로부터 하나의 object를 가져와 이를 context에 담아 rendering해준다

  - **BaseDetailView**는 **SingleObjectMixin**의 상속을 받는다

  - **SingleObjectMixin**

    ```python
    class SingleObjectMixin(ContextMixin):
        """
        Provide the ability to retrieve a single object for further manipulation.
        """
        model = None
        queryset = None
        slug_field = 'slug'
        context_object_name = None
        slug_url_kwarg = 'slug'
        pk_url_kwarg = 'pk'
        query_pk_and_slug = False
    
        def get_object(self, queryset=None):
            """
            Return the object the view is displaying.
            Require `self.queryset` and a `pk` or `slug` argument in the URLconf.
            Subclasses can override this to return any object.
            """
            # Use a custom queryset if provided; this is required for subclasses
            # like DateDetailView
            if queryset is None:
                queryset = self.get_queryset()
    
            # Next, try looking up by primary key.
            pk = self.kwargs.get(self.pk_url_kwarg)
            slug = self.kwargs.get(self.slug_url_kwarg)
            if pk is not None:
                queryset = queryset.filter(pk=pk)
    
            # Next, try looking up by slug.
            if slug is not None and (pk is None or self.query_pk_and_slug):
                slug_field = self.get_slug_field()
                queryset = queryset.filter(**{slug_field: slug})
    
            # If none of those are defined, it's an error.
            if pk is None and slug is None:
                raise AttributeError(
                    "Generic detail view %s must be called with either an object "
                    "pk or a slug in the URLconf." % self.__class__.__name__
                )
    
            try:
                # Get the single item from the filtered queryset
                obj = queryset.get()
            except queryset.model.DoesNotExist:
                raise Http404(_("No %(verbose_name)s found matching the query") %
                              {'verbose_name': queryset.model._meta.verbose_name})
            return obj
    
        def get_queryset(self):
            """
            Return the `QuerySet` that will be used to look up the object.
            This method is called by the default implementation of get_object() and
            may not be called if get_object() is overridden.
            """
            if self.queryset is None:
                if self.model:
                    return self.model._default_manager.all()
                else:
                    raise ImproperlyConfigured(
                        "%(cls)s is missing a QuerySet. Define "
                        "%(cls)s.model, %(cls)s.queryset, or override "
                        "%(cls)s.get_queryset()." % {
                            'cls': self.__class__.__name__
                        }
                    )
            return self.queryset.all()
    
        def get_slug_field(self):
            """Get the name of a slug field to be used to look up by slug."""
            return self.slug_field
    
        def get_context_object_name(self, obj):
            """Get the name to use for the object."""
            if self.context_object_name:
                return self.context_object_name
            elif isinstance(obj, models.Model):
                return obj._meta.model_name
            else:
                return None
    
        def get_context_data(self, **kwargs):
            """Insert the single object into the context dict."""
            context = {}
            if self.object:
                context['object'] = self.object
                context_object_name = self.get_context_object_name(self.object)
                if context_object_name:
                    context[context_object_name] = self.object
            context.update(kwargs)
            return super().get_context_data(**context)
    ```

  > **slug**란
  >
  > URL의 구성요소로 웹사이트의 특정 페이지를 사람이 읽기 쉬운 형식의 식별자로 바꿔주는 것

  - 클래스 변수

    - pk_url_kwarg, slug_url_kwarg

      - 두 변수들은 default로 **pk**, **slug**로 지정되어있다
      - 얘네는 **urls.py**에서 넘겨주는 인자의 이름을 뜻한다

      ```python
      # urls.py
      
      urlpatterns = [
          path('<int:id>', views.post_detail, name="post_detail"),
      ]
      
      # views.py
      
      post_detail = DetailView.as_view(model=Post, pk_url_kwarg='id')
      ```

      - 위 처럼 id로 넘겨주려면 해당 값을 id로 수정해준다

  - get_object

    - 모델로부터 object를 얻어오는 메소드
    - 위에서 지정한 클래스 변수들에 대해서 queryset, pk, slug를 설정해서 원하는 queryset을 만들어주는 역할
    - 이 메소드를 통해 객체를 가져오고, 실패할 경우 에러를 표시

  - get_queryset

    - 클래스 변수 queryset이 지정되어 있으면 그 queryset에 맞게 객체를 return
    - 기본적으로는 모델의 모든 객체들을 전부 반환한다

  - get_context_data

    - 모델의 이름으로 context를 넘겨주는 역할
    - 모델 이름 외에도 object라는 이름으로도 사용이 가능

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

    - **template_name**값을 따로 설정한다면 이에 맞는 templates를 반환
    - 형태는 `앱이름/모델이름(소문자)_detail.html` 
- 사용 예시

```python
# modesl.py
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=20)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

```python
# urls.py
from django.urls import path
from . import views 

urlpatterns = [
    path('<int:pk>', views.post_detail, name="post_detail"),
]
```

```python
# views.py
from django.views.generic import DetailView
from .models import Post

post_detail = DetailView.as_view(model=Post)
```

```html
<!-- prac/post_detail.html -->

<h1>detail page</h1>

<h2>{% raw %}{{post.title}}{% endraw %}</h2>
<h3>{% raw %}{{post.content}}{% endraw %}</h3>
```

- `ListView`

  - 조건에 맞는 객체 목록 출력

  ```python
  class ListView(MultipleObjectTemplateResponseMixin, BaseListView):
      """
      Render some list of objects, set by `self.model` or `self.queryset`.
      `self.queryset` can actually be any iterable of items, not just a queryset.
      """
  ```

  - DetailView처럼 내용 없이 ListView도 **MultipleObjectTemplateResponseMixin**과 **BaseListView**를 상속받는다

  - **BaseListView**

    ```python
    class BaseListView(MultipleObjectMixin, View):
        """A base view for displaying a list of objects."""
        def get(self, request, *args, **kwargs):
            self.object_list = self.get_queryset()
            allow_empty = self.get_allow_empty()
    
            if not allow_empty:
                # When pagination is enabled and object_list is a queryset,
                # it's better to do a cheap query than to load the unpaginated
                # queryset in memory.
                if self.get_paginate_by(self.object_list) is not None and hasattr(self.object_list, 'exists'):
                    is_empty = not self.object_list.exists()
                else:
                    is_empty = not self.object_list
                if is_empty:
                    raise Http404(_("Empty list and '%(class_name)s.allow_empty' is False.") % {
                        'class_name': self.__class__.__name__,
                    })
            context = self.get_context_data()
            return self.render_to_response(context)
    ```

    - get요청을 받아 queryset으로 object_list를 만들고 rendering해준다
    - **MultipleObjectMixin**을 상속받는다

  - **MultipleObjectMixin**

    ```python
    class MultipleObjectMixin(ContextMixin):
        """A mixin for views manipulating multiple objects."""
        allow_empty = True
        queryset = None
        model = None
        paginate_by = None
        paginate_orphans = 0
        context_object_name = None
        paginator_class = Paginator
        page_kwarg = 'page'
        ordering = None
    
        def get_queryset(self):
            """
            Return the list of items for this view.
            The return value must be an iterable and may be an instance of
            `QuerySet` in which case `QuerySet` specific behavior will be enabled.
            """
            if self.queryset is not None:
                queryset = self.queryset
                if isinstance(queryset, QuerySet):
                    queryset = queryset.all()
            elif self.model is not None:
                queryset = self.model._default_manager.all()
            else:
                raise ImproperlyConfigured(
                    "%(cls)s is missing a QuerySet. Define "
                    "%(cls)s.model, %(cls)s.queryset, or override "
                    "%(cls)s.get_queryset()." % {
                        'cls': self.__class__.__name__
                    }
                )
            ordering = self.get_ordering()
            if ordering:
                if isinstance(ordering, str):
                    ordering = (ordering,)
                queryset = queryset.order_by(*ordering)
    
            return queryset
    
        def get_ordering(self):
            """Return the field or fields to use for ordering the queryset."""
            return self.ordering
    
        def paginate_queryset(self, queryset, page_size):
            """Paginate the queryset, if needed."""
            paginator = self.get_paginator(
                queryset, page_size, orphans=self.get_paginate_orphans(),
                allow_empty_first_page=self.get_allow_empty())
            page_kwarg = self.page_kwarg
            page = self.kwargs.get(page_kwarg) or self.request.GET.get(page_kwarg) or 1
            try:
                page_number = int(page)
            except ValueError:
                if page == 'last':
                    page_number = paginator.num_pages
                else:
                    raise Http404(_("Page is not 'last', nor can it be converted to an int."))
            try:
                page = paginator.page(page_number)
                return (paginator, page, page.object_list, page.has_other_pages())
            except InvalidPage as e:
                raise Http404(_('Invalid page (%(page_number)s): %(message)s') % {
                    'page_number': page_number,
                    'message': str(e)
                })
    
        def get_paginate_by(self, queryset):
            """
            Get the number of items to paginate by, or ``None`` for no pagination.
            """
            return self.paginate_by
    
        def get_paginator(self, queryset, per_page, orphans=0,
                          allow_empty_first_page=True, **kwargs):
            """Return an instance of the paginator for this view."""
            return self.paginator_class(
                queryset, per_page, orphans=orphans,
                allow_empty_first_page=allow_empty_first_page, **kwargs)
    
        def get_paginate_orphans(self):
            """
            Return the maximum number of orphans extend the last page by when
            paginating.
            """
            return self.paginate_orphans
    
        def get_allow_empty(self):
            """
            Return ``True`` if the view should display empty lists and ``False``
            if a 404 should be raised instead.
            """
            return self.allow_empty
    
        def get_context_object_name(self, object_list):
            """Get the name of the item to be used in the context."""
            if self.context_object_name:
                return self.context_object_name
            elif hasattr(object_list, 'model'):
                return '%s_list' % object_list.model._meta.model_name
            else:
                return None
    
        def get_context_data(self, *, object_list=None, **kwargs):
            """Get the context for this view."""
            queryset = object_list if object_list is not None else self.object_list
            page_size = self.get_paginate_by(queryset)
            context_object_name = self.get_context_object_name(queryset)
            if page_size:
                paginator, page, queryset, is_paginated = self.paginate_queryset(queryset, page_size)
                context = {
                    'paginator': paginator,
                    'page_obj': page,
                    'is_paginated': is_paginated,
                    'object_list': queryset
                }
            else:
                context = {
                    'paginator': None,
                    'page_obj': None,
                    'is_paginated': False,
                    'object_list': queryset
                }
            if context_object_name is not None:
                context[context_object_name] = queryset
            context.update(kwargs)
            return super().get_context_data(**context)
    ```

    - 내부적으로 **pagination**이 구현이 되어있다
    - get_context_data
      - context를 얻는 과정, pagination을 할 경우 queryset도 부분적으로 나눠서 가져와야 하기 때문에 바뀌는 부분은 if문을 통해 처리되어있다

- 사용 예시

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.post_list, name="post_list")
]
```

```python
from django.views.generic import ListView
from .models import Post

post_list = ListView.as_view(
    model=Post,
    paginate_by=2,
)
```

- 위와 같이 **pagenate_by**로 페이지네이션을 쉽게 구현할 수 있다
- 값을 2로 준다면 한 페이지에 두 개의 객체만 표시하게 된다
- 각 페이지는 url 뒤에 querystring으로 **?page=페이지수**로 접근할 수 있다

<br>
참고사이트

- [django 공식문서](https://docs.djangoproject.com/ko/2.2/topics/class-based-views/generic-display/){: class="underlineFill"}
- [CBV (1) CBV와 Base Views](https://ssungkang.tistory.com/entry/Django-CBV-1-CBV-와-Base-Views){: class="underlineFill"}
- [클래스형 뷰 (CBV)](https://wikidocs.net/9623){: class="underlineFill"}