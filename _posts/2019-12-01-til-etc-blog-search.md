---
layout: post
title: "Jekyll blog에 Search 적용하기"
subtitle: "Simple-Jekyll-Search"
date: 2019-12-01 02:00:00 +0900
categories: til
tags: etc
comments: true
---

## Jekyll blog내에서 검색가능하게 만들기

> 바꾸기 전 블로그 테마에는 사이드 바에 카테고리별로 나누어져 있어서 포스트를 하나하나 확인하기 편했는데 
>
> 블로그 테마를 바꾼 뒤에는 태그로 달려있어서 찾아보기가 불편해졌다..
>
> 그래서 검색바가 있으면 좋겠다 라고 생각해서 한번 추가해보았다.
>
> 구글링을 통해서 여러글을 찾아봤는데 모두 [한량넷](http://www.halryang.net/simple-jekyll-search/)님의 블로그를 거의 그대로 가져와서 적용해보았다..

<br>

### 적용해보기

> 해당 파일들은 한량넷님 블로그에서 다운받을수 있다

1. 루트에 파일 2개를 추가해준다

   - `search2.json`
   - `Simple-Jekyll-Search.sublime-project`

   ```
   {
   	"folders":
   	[
   		{
   			"path": "."
   		}
   	]
   }
   ```

2. 루트에 `dest` 폴더에 파일을 추가

   - `jekyll-search.js`
   - `jekyll-search.min.js`

3. 루트에 `_plugins` 폴더에 파일 추가

   - `simple_search_filter.rb`

   ```ruby
   module Jekyll
     module CharFilter
       def remove_chars(input)
         input.gsub! '\\','&#92;'
         input.gsub! /\t/, '    '
         input.strip_control_and_extended_characters
       end
     end
   end
   
   Liquid::Template.register_filter(Jekyll::CharFilter)
   
   class String
     def strip_control_and_extended_characters()
       chars.each_with_object("") do |char, str|
         str << char if char.ascii_only? and char.ord.between?(32,126)
       end
     end
   end
   ```

4. 루트에 `search.html` 만들기

   ```html
   ---
   layout: default
   page_title: Search
   permalink: /search/
   ---
   
   <!— Html Elements for Search -->
   <div id="search-container">
   <input type="text" id="search-input" placeholder="search...">
   <ul id="results-container"></ul>
   </div>
   
   <!-- Script pointing to jekyll-search.js -->
   <script src="{{site.baseurl}}/dest/jekyll-search.js" type="text/javascript"></script>
   
   
   <script type="text/javascript">
         SimpleJekyllSearch({
           searchInput: document.getElementById('search-input'),
           resultsContainer: document.getElementById('results-container'),
           json: '{{ site.baseurl }}/search2.json',
           searchResultTemplate: '<li><a href="{url}" title="{desc}">{title}</a></li>',
           noResultsText: 'No results found',
           limit: 10,
           fuzzy: false,
           exclude: ['Welcome']
         })
   </script>
   ```

5. 헤더에 `SEARCH` 를 추가해서 위에 생성한 `search.html`을 연결해준다

<br>

### 확인 !!

![스크린샷 2019-12-01 오전 1.49.05](/img/in-post/blog-search.png)

> css만...해결해주면 될 듯 하다..

<br>

참고사이트

- [Simple-Jekylle-Search](https://github.com/christian-fei/Simple-Jekyll-Search)
- [한량넷](http://www.halryang.net/simple-jekyll-search/)