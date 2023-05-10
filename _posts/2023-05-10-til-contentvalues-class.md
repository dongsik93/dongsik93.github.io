---
layout: post
title: "[Android] ContentValues Class"
subtitle: "ContentValues Class"
date: 2023-05-10 18:00:00 +0900
categories: til
tags: android contentvalues mediastore
comments: true


---

# [Android] ContentValues Class

> ***\*MediaStore\**** 를 통해 데이터를 저장하기 전, ContentValues Class에 대해 알아보기



android.content.ContentValues.java에 들어가보면

This class is used to store a set of values that the ContentResolver can process.

말 그대로 ContentResolver가 처리할 수 있는 values들의 집합을 저장하는데 사용된다고 한다.

주로 SQLite 데이터베이스 또는 MediaStore와 같은 콘텐츠 공급자에 삽입하거나 업데이트할 값 집합을 정의하는 데 쓰인다.



```kotlin
val values = ContentValues().apply {
		put(MediaStore.Downloads.DISPLAY_NAME, displayName)
    put(MediaStore.Downloads.MIME_TYPE, mimeType)
    put(MediaStore.MediaColumns.RELATIVE_PATH, path)
    put(MediaStore.Downloads.IS_PENDING, 1)
}

val contentResolver = context.contentResolver
val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
```

위 코드처럼 key, value를 put 메서드를 통해 넣어줄 수 있고, 이를 통해 만들어진 ContentValues를 contentResolver.insert를 통해 제공해 uri를 얻어올 수 있다.



ContentValues는 정수, 문자열, 부동 소수점 등과 같은 기본 유형을 포함하여 다양한 데이터 유형을 지원하기 때문에 특정 데이터 유형을 각 키-값 쌍과 연결할 수 있도록 하여 type safety를 강화할 수 있기 때문에 키-값 구조 및 유형 안전성을 활용하여 데이터 작업의 정확성과 무결성을 보장할 수 있다.



