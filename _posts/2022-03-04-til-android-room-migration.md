---
layout: post
title: "[Android] Room Migration"
subtitle: "Room Database Migration"
date: 2022-03-04 18:00:00 +0900
categories: til
tags: android room
comments: true
---



# [Android] Room Migration



### Room을 사용하면서 겪었던 Migration 이야기



기획자 : 이 화면에서 추가적으로 데이터를 보여주세요 !

백엔드 : 새로운 필드 하나를 추가했습니다 !



이미 서비스중인 앱에 위와 같은 요구사항은 빈번하게 일어난다.

단순히 entity를 수정하고 빌드하고 앱을 업데이트 하게한다면?



`Looks like you've changed schema but forgot to update the version number. You can simply fix this by increasing the version number.`라는 경고와 함께 앱이 죽는 경우를 많이 보게된다

에러 로그만 잘 읽으면 반은간다. 룸 버젼을 올려보자.



### 1. 데이터베이스 버전 올리기

Database 파일의 Database Version을 올려주자

```kotlin
@Database(
    entities = [
        SampleEntity::class,
    ],
    version = 2, // 이 부분을 1에서 2로 변경
    exportSchema = false
)
```



룸 버전을 올리고 앱을 다시 빌드하면

`A migration from 1 to 2 was required but not found. Please provide the necessary Migration path via RoomDatabase.Builder.addMigrations(Migraion...)` 라는 에러가 또 나면서 앱이 죽었다. 음.. 반도 못갔나보다.

마이그레이션이 없다는 말인데 마이그레이션 코드를 넣어보도록 하자



### 2. 마이그레이션 코드 작성

Sample 테이블에 money 컬럼이 추가된다고 했을 때 마이그레이션 코드를 작성해보자

```kotlin
private val MIGRATION_1_TO_2: Migration = object : Migration(1,2) {
		override fun migrate(database: SupportSQLiteDatabase) {
				database.run {
						execSQL("ALTER TABLE sample ADD money INTEGER NOT NULL DEFAULT 0")
				}
		}
}
```

sample 테이블에 money 컬럼을 추가하면서 not null 제약조건에 기본값을 넣어주는 쿼리를 작성해서 넣어준다



### 3. 마이그레이션 추가

작성한 마이그레이션 코드를 이제 적용시켜 보자

```kotlin
.addMigrations(MIGRATION_1_TO_2)
```

마이그레이션 코드를 적용해줄 때 추가로 설정을 해줄 수 있다

```kotlin
.fallbackToDestructiveMigration()
```

`fallbackToDestructiveMigration()`

- 이전 데이터베이스 스키마를 최신 스키마 버전으로 마이그레이션하는 마이그레이션을 찾을 수 없는 경우 Room에서 데이터베이스 테이블을 삭제한다
- 기기의 데이터베이스 버전이 최신 스키마 버전과 일치하지 않는 경우 Room은 데이터베이스에서 필요한 마이그레이션을 실행한다
- 데이터베이스를 현재 버전으로 가져올때 마이그레이션 집합을 찾을 수 없으면 IllegalStateException이 발생하고, 이 메서드를 호출하여 충돌하는 대신 데이터베이스를 다시 생성하도록 한다



### ‼️ 주의할 점

`.addMigrations()` 메소드를 사용할 때 마이그레이션 코드는 여러개 넣을 수 있다

```
A migration can handle more than 1 version (e.g. if you have a faster path to choose when going version 3 to 5 without going to version 4). If Room opens a database at version 3 and latest version is&gt;= 5, Room will use the migration object that can migrate from 3 to 5 instead of 3 to 4 and 4 to 5.
```

가령 기기의 현재 버전이 3이라고 했을 때 최신 버전이 5라고 하면 4를 건너뛰고 5로 마이그레이션을 할 수 있도록 한다라는 말인데, 이렇게 적용시키기 위해서는

`.addMigrations(MIGRATION_3_TO_4, MIGRATION_4_TO_5)` 이런식으로 해당 메소드에 3-4, 4-5에 해당하는 마이그레이션 코드를 넘겨줘야 한다

```java
// RoomOpenHelper.java
@Override
public void onUpgrade(SupportSQLiteDatabase db, int oldVersion, int newVersion) {
    boolean migrated = false;
    if (mConfiguration != null) {
        List<Migration> migrations = mConfiguration.migrationContainer.findMigrationPath(
                oldVersion, newVersion);
        if (migrations != null) {
            mDelegate.onPreMigrate(db);
            for (Migration migration : migrations) {
                migration.migrate(db);
            }
            ValidationResult result = mDelegate.onValidateSchema(db);
            if (!result.isValid) {
                throw new IllegalStateException("Migration didn't properly handle: "
                        + result.expectedFoundMsg);
            }
            mDelegate.onPostMigrate(db);
            updateIdentity(db);
            migrated = true;
        }
    }
    if (!migrated) {
        if (mConfiguration != null
                && !mConfiguration.isMigrationRequired(oldVersion, newVersion)) {
            mDelegate.dropAllTables(db);
            mDelegate.createAllTables(db);
        } else {
            throw new IllegalStateException("A migration from " + oldVersion + " to "
                    + newVersion + " was required but not found. Please provide the "
                    + "necessary Migration path via "
                    + "RoomDatabase.Builder.addMigration(Migration ...) or allow for "
                    + "destructive migrations via one of the "
                    + "RoomDatabase.Builder.fallbackToDestructiveMigration* methods.");
        }
    }
}
```

실제 migrate하는 소스를 봐보니 넘겨받은 migrations을 startVersion, endVersion으로 받아서 for문으로 처리하는 로직이 들어있었다

그 말은 3버전에서 7버전으로의 마이그레이션이 필요하다면  .addMigrations(MIGRATION_3_TO_4, MIGRATION_6_TO_7) 이런식으로 넘겨야 한다는 의미인것 같다

마이그레이션 같은 처리는 실제로 매우매우매우 중요한 작업이다보니 실제 배포하기전 충분한 테스트(fallback으로 떨어져서 기존 db가 날아가지는 않았는지, 등등)를 해보고 올려야 한다 😂