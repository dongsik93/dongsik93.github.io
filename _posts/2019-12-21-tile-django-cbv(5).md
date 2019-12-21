---
layout: post
title: "Django Class Based View (5)"
subtitle: "CBV에 대한 이해 (5)"
date: 2019-12-21 19:00:00 +0900
categories: til
tags: django cbv
comments: true
---

## Django Class Based views (5)

> CBV를 좀 더 자세하게 알아보자
>
> 제네릭 뷰 중 Date View에 대해 공부 !

<br>

### Generic Date View

- 날짜 기반 객체의 연/월/일 페이지로 구분해 보여주는 뷰
- **ArchiveIndexVIew**, **YearArchiveView**, **MonthArchiveView**, **DayArchiveView**, **TodayArchiveView**, **DateDetailView** 로 구성



#### `ArchiveIndexView`

- 날짜별로 최신 object를 보여주는 최상위 인덱스 페이지
- **allow_future**를 True로 설정하지 않는 한 미래의 날짜를 가진 object는 포함되지 않는다

```python
class ArchiveIndexView(MultipleObjectTemplateResponseMixin, BaseArchiveIndexView):
    """Top-level archive of date-based items."""
    template_name_suffix = '_archive'
```

- **MultipleObjectTemplateResponseMixin**, **BaseArchiveIndexView**를 상속받는다

  - **BaseArchiveIndexView**

  ```python
  class BaseArchiveIndexView(BaseDateListView):
      """
      Base class for archives of date-based items. Requires a response mixin.
      """
      context_object_name = 'latest'
  
      def get_dated_items(self):
          """Return (date_list, items, extra_context) for this request."""
          qs = self.get_dated_queryset()
          date_list = self.get_date_list(qs, ordering='DESC')
  
          if not date_list:
              qs = qs.none()
  
          return (date_list, qs, {})
  ```

  - 날짜 기반 아카이브에 대한 기본 클래스이다

  - **BaseDateListView**를 상속받는다

    ```python
    class BaseDateListView(MultipleObjectMixin, DateMixin, View):
        """Abstract base class for date-based views displaying a list of objects."""
        allow_empty = False
        date_list_period = 'year'
    
        def get(self, request, *args, **kwargs):
            self.date_list, self.object_list, extra_context = self.get_dated_items()
            context = self.get_context_data(
                object_list=self.object_list,
                date_list=self.date_list,
                **extra_context
            )
            return self.render_to_response(context)
    
        def get_dated_items(self):
            """Obtain the list of dates and items."""
            raise NotImplementedError('A DateView must provide an implementation of get_dated_items()')
    
        def get_ordering(self):
            """
            Return the field or fields to use for ordering the queryset; use the
            date field by default.
            """
            return '-%s' % self.get_date_field() if self.ordering is None else self.ordering
    
        def get_dated_queryset(self, **lookup):
            """
            Get a queryset properly filtered according to `allow_future` and any
            extra lookup kwargs.
            """
            qs = self.get_queryset().filter(**lookup)
            date_field = self.get_date_field()
            allow_future = self.get_allow_future()
            allow_empty = self.get_allow_empty()
            paginate_by = self.get_paginate_by(qs)
    
            if not allow_future:
                now = timezone.now() if self.uses_datetime_field else timezone_today()
                qs = qs.filter(**{'%s__lte' % date_field: now})
    
            if not allow_empty:
                # When pagination is enabled, it's better to do a cheap query
                # than to load the unpaginated queryset in memory.
                is_empty = not qs if paginate_by is None else not qs.exists()
                if is_empty:
                    raise Http404(_("No %(verbose_name_plural)s available") % {
                        'verbose_name_plural': qs.model._meta.verbose_name_plural,
                    })
    
            return qs
    
        def get_date_list_period(self):
            """
            Get the aggregation period for the list of dates: 'year', 'month', or
            'day'.
            """
            return self.date_list_period
    
        def get_date_list(self, queryset, date_type=None, ordering='ASC'):
            """
            Get a date list by calling `queryset.dates/datetimes()`, checking
            along the way for empty lists that aren't allowed.
            """
            date_field = self.get_date_field()
            allow_empty = self.get_allow_empty()
            if date_type is None:
                date_type = self.get_date_list_period()
    
            if self.uses_datetime_field:
                date_list = queryset.datetimes(date_field, date_type, ordering)
            else:
                date_list = queryset.dates(date_field, date_type, ordering)
            if date_list is not None and not date_list and not allow_empty:
                raise Http404(
                    _("No %(verbose_name_plural)s available") % {
                        'verbose_name_plural': queryset.model._meta.verbose_name_plural,
                    }
                )
    
            return date_list
    ```

    - 모든 날짜 기반 View에 대해 일반적인 동작을 제공하는 기본 클래스이다
    - 클래스 변수
      - allow_empty
        - 사용 가능한 object가 없는 경우 페이지를 표시할지 여부를 지정하는 변수
        - **True**이고, 사용할 수 있는 object가 없는경우 404페이지 대신 빈 페이지가 표시된다
        - default는 False
      - date_list_period
        - date_list의 집계 기간을 정의하는 문자열로 **year**(default), **month**, **day** 중 하나여야 한다
    - get_dated_items
      - **date_list, object_list, extra_conext**가 포함된 튜플을 return한다
      - date_list는 가능한 날짜의 목록들을, object_list는 ojbects의 목록, extra_context는 MultipleObjectMixin이 제공하는 context data에 추가되는 context dictionary이다
    - get_dated_queryset
      - allow_future, allow_empty에 따라 필터링된 QuerySet을 return
    - get_date_list
      - QuerySet에 date_type의 유무에 따라서 date_list를 return한다

  - **DateMixin**

    ```python
    class DateMixin:
        """Mixin class for views manipulating date-based data."""
        date_field = None
        allow_future = False
    
        def get_date_field(self):
            """Get the name of the date field to be used to filter by."""
            if self.date_field is None:
                raise ImproperlyConfigured("%s.date_field is required." % self.__class__.__name__)
            return self.date_field
    
        def get_allow_future(self):
            """
            Return `True` if the view should be allowed to display objects from
            the future.
            """
            return self.allow_future
    
        # Note: the following three methods only work in subclasses that also
        # inherit SingleObjectMixin or MultipleObjectMixin.
    
        @cached_property
        def uses_datetime_field(self):
            """
            Return `True` if the date field is a `DateTimeField` and `False`
            if it's a `DateField`.
            """
            model = self.get_queryset().model if self.model is None else self.model
            field = model._meta.get_field(self.get_date_field())
            return isinstance(field, models.DateTimeField)
    
        def _make_date_lookup_arg(self, value):
            """
            Convert a date into a datetime when the date field is a DateTimeField.
            When time zone support is enabled, `date` is assumed to be in the
            current time zone, so that displayed items are consistent with the URL.
            """
            if self.uses_datetime_field:
                value = datetime.datetime.combine(value, datetime.time.min)
                if settings.USE_TZ:
                    value = timezone.make_aware(value)
            return value
    
        def _make_single_date_lookup(self, date):
            """
            Get the lookup kwargs for filtering on a single date.
            If the date field is a DateTimeField, we can't just filter on
            date_field=date because that doesn't take the time into account.
            """
            date_field = self.get_date_field()
            if self.uses_datetime_field:
                since = self._make_date_lookup_arg(date)
                until = self._make_date_lookup_arg(date + datetime.timedelta(days=1))
                return {
                    '%s__gte' % date_field: since,
                    '%s__lt' % date_field: until,
                }
            else:
                # Skip self._make_date_lookup_arg, it's a no-op in this branch.
                return {date_field: date}
    ```

    - 모든 날짜 기반 View에 대해 공통적인 동작을 제공하는 Mixin
    - 클래스 변수
      - date_field
        - 페이지에 표시할 object 목록을 결정하는데 사용해야 하는 QuerySet 모델의 **DataField**나 **DateTimeField**의 이름
        - Timezone을 사용하고, date_field가 **DateTimeField**인 경우 날짜는 현재 시간대인 것으로 가정한다. 그렇지 않으면 QuerySet은 최종 사용자의 Timezone에 전날이나 다음날이 포함될 수 있다
        - 사용자별 Timezone 선택을 구현한 경우, 최종 사용자의 Timezone에 따라 동일한 URL에 다른 object가 표시될 수 있다. 이를 방지하려면 **DateField**를 date_field 속성으로 사용해야 한다

  - **MultipleObjectTemplateResponseMixin**

  ```python
  class MultipleObjectTemplateResponseMixin(TemplateResponseMixin):
      """Mixin for responding with a template and list of objects."""
      template_name_suffix = '_list'
  
      def get_template_names(self):
          """
          Return a list of template names to be used for the request. Must return
          a list. May not be called if render_to_response is overridden.
          """
          try:
              names = super().get_template_names()
          except ImproperlyConfigured:
              # If template_name isn't specified, it's not a problem --
              # we just start with an empty list.
              names = []
  
          # If the list is a queryset, we'll invent a template name based on the
          # app and model name. This name gets put at the end of the template
          # name list so that user-supplied names override the automatically-
          # generated ones.
          if hasattr(self.object_list, 'model'):
              opts = self.object_list.model._meta
              names.append("%s/%s%s.html" % (opts.app_label, opts.model_name, self.template_name_suffix))
          elif not names:
              raise ImproperlyConfigured(
                  "%(cls)s requires either a 'template_name' attribute "
                  "or a get_queryset() method that returns a QuerySet." % {
                      'cls': self.__class__.__name__,
                  }
              )
          return names
  ```

  - **DisplayView**에서 짚고 넘어가지 않았기 때문에 여기서 다뤄보도록 하자
  - `django.views.generic.list.MultipleObjectTemplateResponseMixin`
  - ListView에 대해 template기반 response rendering을 수행하는 mixin class이다
  - **self.object_list**는 QuerySet일 수 있지만 반드시 필요한 것은 아니다



#### `YearArchiveView`

- 연도에 대해서만 알아보자..

- 주어진 연도에 해당하는 객체 출력

```python
class YearArchiveView(MultipleObjectTemplateResponseMixin, BaseYearArchiveView):
    """List of objects published in a given year."""
    template_name_suffix = '_archive_year'
```

- **MultipleObjectTemplateResponseMixin**, **BaseYearArchiveView**를 상속

  - **BaseYearArchiveView**

  ```python
  class BaseYearArchiveView(YearMixin, BaseDateListView):
      """List of objects published in a given year."""
      date_list_period = 'month'
      make_object_list = False
  
      def get_dated_items(self):
          """Return (date_list, items, extra_context) for this request."""
          year = self.get_year()
  
          date_field = self.get_date_field()
          date = _date_from_string(year, self.get_year_format())
  
          since = self._make_date_lookup_arg(date)
          until = self._make_date_lookup_arg(self._get_next_year(date))
          lookup_kwargs = {
              '%s__gte' % date_field: since,
              '%s__lt' % date_field: until,
          }
  
          qs = self.get_dated_queryset(**lookup_kwargs)
          date_list = self.get_date_list(qs)
  
          if not self.get_make_object_list():
              # We need this to be a queryset since parent classes introspect it
              # to find information about the model.
              qs = qs.none()
  
          return (date_list, qs, {
              'year': date,
              'next_year': self.get_next_year(date),
              'previous_year': self.get_previous_year(date),
          })
  
      def get_make_object_list(self):
          """
          Return `True` if this view should contain the full list of objects in
          the given year.
          """
          return self.make_object_list
  ```

  - 클래스 변수

    - make_object_list
      - 해당 연도의 전체 object 목록을 검색하고 template으로 전달할지 여부를 지정하는 변수
      - **True**이면 context에서 object 목록을 사용할 수 있게 된다
      - **False**이면 None QuerySet이 object 목록으로 사용된다

  - get_make_object_list

    - context의 일부로 object 목록이 반환되는지 여부를 결정
    - 해당 연도의 전체 object 목록을 포함해야 하는 경우에는 **True**를 return한다

  - **YearMixin**

    ```python
    class YearMixin:
        """Mixin for views manipulating year-based data."""
        year_format = '%Y'
        year = None
    
        def get_year_format(self):
            """
            Get a year format string in strptime syntax to be used to parse the
            year from url variables.
            """
            return self.year_format
    
        def get_year(self):
            """Return the year for which this view should display data."""
            year = self.year
            if year is None:
                try:
                    year = self.kwargs['year']
                except KeyError:
                    try:
                        year = self.request.GET['year']
                    except KeyError:
                        raise Http404(_("No year specified"))
            return year
    
        def get_next_year(self, date):
            """Get the next valid year."""
            return _get_next_prev(self, date, is_previous=False, period='year')
    
        def get_previous_year(self, date):
            """Get the previous valid year."""
            return _get_next_prev(self, date, is_previous=True, period='year')
    
        def _get_next_year(self, date):
            """
            Return the start date of the next interval.
            The interval is defined by start date <= item date < next start date.
            """
            try:
                return date.replace(year=date.year + 1, month=1, day=1)
            except ValueError:
                raise Http404(_("Date out of range"))
    
        def _get_current_year(self, date):
            """Return the start date of the current interval."""
            return date.replace(month=1, day=1)
    ```

    - 1년 구성 요소에 대한 구문 분석 정보를 검색하고 제공하는데 사용

    - 클래스 변수

      - year_format
        - 연도를 파싱할 때 사용할 `strftime()`형식
        - default로 `%Y`이다

      > **strftime()** 이란?
      >
      > 주어진 포맷에 따라 객체를 문자열로 변환
      >
      > **%Y**는 세기가 있는 해(year)fmf 10진수로 변환한다
      >
      > **strptime()**은 주어진 포맷에 따라 문자열을 **datetime** 객체로 파싱한다

      - year
        - 문자열로 해당 연도의 값. default로 None, 이는 연도가 다른 방법을 사용하여 결정된다는 것을 의미한다

    - get_year_format()

      - 연도를 파싱할 때 사용할 strftime() 형식을 return

      > 코드 주석에는 strptime()을 사용한다고 하지만 django 공식문서에는 strftime()이라고 나와있다..

      - default로 year_format을 return

<br>

참고사이트

- [django 공식문서](https://docs.djangoproject.com/en/3.0/ref/class-based-views/generic-date-based/){: class="underlineFill"} 