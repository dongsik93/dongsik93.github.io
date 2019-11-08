---
layout: post
title: "Axios"
subtitle: "Axios"
date: 2019-05-01 19:00:00 +0900
categories: til
tags: etc
comments: true
---

## axios

- Promise based HTTP client for the browser and node.js
- 라이브러리

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script>
        const URL = "https://jsonplaceholder.typicode.com/posts"
        // get을 요청하고, 그 요청값을 then
        // axios.get(URL).then((response) => {console.log(response.data)})

        const body = {
            title:"new post",
            body:"textext",
            userId:1
        }

        axios.post(URL, body).then(response => console.log(response.data))
    </script>
</body>
</html>
```


