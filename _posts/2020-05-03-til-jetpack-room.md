---
layout: post
title: "[Android] Room"
subtitle: "Android Jetpack Room "
date: 2020-05-03 18:30:00 +0900
categories: til
tags: room android jetpack
comments: true
---





## 룸(Room) 지속성 라이브러리



### 룸이란?

- 안드로이드 앱에서 SQLite 데이터베이스를 쉽고 편리하게 사용할 수 있도록 하는 기능

- SQLite 위에 만든 구글의 ORM



### 룸을 사용하는 이유

- 데이터 캐싱
  - 앱의 단일  정보 소스로 제공되는 캐시를 통해 인터넷 연결 여부와 관계없이 앱에 있는 주요 정보의 일관된 사본을 볼 수 있다



### 룸의 구성요소(Database, Entity, Dao)

- #### Database

  - 데이터베이스 홀더를 포함하며 앱의 지속적인 관계형 데이터에 대한 기본 연결을 위한 기본 액세스 포인트 역할을 한다
  - `@Database`로 처리된 클래스는 다음과 같은 조건을 충족해야 한다
    - `RoomDatabase`를 확장하는 추상클래스여야 한다
    - 어노테이션 내에 데이터베이스와 연결된 엔티티의 목록을 포함해야 한다
    - 인수가 0개인 추상 메서드를 포함하고 `@Dao`로  처리된 클래스를 반환해야 한다

  ```kotlin
  @Database(entities = arrayOf(User::class), version = 1)
      abstract class AppDatabase : RoomDatabase() {
          abstract fun userDao(): UserDao
  }
  ```

  ```kotlin
  val db = Room.databaseBuilder(
      applicationContext,
      AppDatabase::class.java, "database-name"
  ).build()
  ```

  - 앱이 단일 프로세스에서 실행되는 경우 AppDatabase 개체를 싱글톤 디자인 패턴에 따라 인스턴스화해야 한다
  - RoomDatabase 인스턴스는 리소스를 상당히 많이 소비하기 때문

  >**싱글톤 디자인 패턴**
  >
  >인스턴스가 프로그램 내에서 오직 하나만 생성되는 것을 보장하고, 프로그램 어디서든 인스턴스에 접근할 수 있도록 하는 패턴



- #### Entity

  - 데이터베이스 내의 테이블을 나타낸다
  - Room을 사용할 때 관련 필드 집합을 엔티티들로 정의한다
  - 각 엔티티에 대해 항목을 보관하기 위해 연결된 데이터베이스 객체 내에 테이블이 생성된다

  ```kotlin
  @Entity
  data class User(
      @PrimaryKey val uid: Int,
      @ColumnInfo(name = "first_name") val firstName: String?,
      @ColumnInfo(name = "last_name") val lastName: String?
  )
  ```

  - 필드를 유지하려면, 룸은 필드에 접근할 수 있어야 한다

  - ##### Primary key 사용

    - 각 Entity는 하나 이상의 필드를 기본 키로 정의해야 한다
    - 자동 ID를 할당하려면 `@PrimaryKey`의 `autoGenerate` 속성을 설정하면 된다
    - 복합 기본키는 `@Entity` 어노테이션의 `primaryKeys` 속성을 사용한다

    ```kotlin
    @Entity(primaryKeys = arrayOf("firstName", "lastName"))
    data class User(
        val firstName: String?,
        val lastName: String?
    )
    ```

    - `tableName` 속성을 사용해서 테이블의 이름을 다르게 지정할 수 있다
    - `@ColumnInfo`를 통해 컬럼의 이름을 다르게 지정할 수 있다

    ```kotlin
    @Entity(tableName = "users")
    data class User (
        @PrimaryKey val id: Int,
        @ColumnInfo(name = "first_name") val firstName: String?,
        @ColumnInfo(name = "last_name") val lastName: String?
    )
    ```

  - ##### 필드 무시

    - 기본적으로 Room은 Entity에 정의된 각 필드의 컬럼을 생성한다
    - Entity에 유지하지 않으려는 필드가 있으면 `@Ignore`를 사용한다
    - 상위 필드를 상속하면 일반적으로 `@Entity`속성의  `ignoreColumns`속성을 사용한다

    ```kotlin
    @Entity
    data class User(
        @PrimaryKey val id: Int,
        val firstName: String?,
        val lastName: String?,
        @Ignore val picture: Bitmap?
    )
    ```

  - ##### 특정 컬럼 색인 생성

    - 색인을 추가해 쿼리속도를 높일 수 있다
    - `@Entity` 내의 `indices` 속성을 통해 색인, 복합 색인을 나열한다
    - `unique`속성을 true로 설정해 제약조건을 표기

    ```kotlin
    @Entity(indices = arrayOf(Index(value = ["first_name", "last_name"],
                                    unique = true)))
    data class User(
        @PrimaryKey val id: Int,
        @ColumnInfo(name = "first_name") val firstName: String?,
        @ColumnInfo(name = "last_name") val lastName: String?,
        @Ignore var picture: Bitmap?
    )
    ```



- #### Data Access Objects(DAO)

  - 데이터베이스에 액세스하는 데 사용되는 메서드가 포함되어 있다

  - 인터페이스로서 쿼리를 사용하는 메소드를 정의한다

  - 룸을 사용해 앱의 데이터에 접근하려면 DAO를 사용한다.

  - 각 DAO에는 앱의 데이터베이스에 대한 추상적 액세스를 제공하는 방법이 포함되어 있으므로(interface내에 쿼리와 함께 함수만 정의) 이 Dao 객체들은 룸의 주요 구성요소를 형성한다.

  - 쿼리 builder나 직접적인 쿼리 대신 DAO 클래스를 사용하여 데이터베이스에 접근하여 데이터베이스 구조의 다양한 구성 요소를 분리할 수 있다.

  - 또한, DAO를 사용하면 애플리케이션을 테스트할 때 데이터베이스 접근을 쉽게 할 수 있다.

  - DAO는 인터페이스 또는 추상 클래스일 수 있다.

    - 추상 클래스인 경우 선택적으로 RoomDatabase를 유일한 매개 변수로 사용하는 생성자를 가질 수 있다.
    - Room은 **Compile time**에 각 DAO 구현을 생성한다.

  - ##### Insert

    - `@Insert` 어노테이션을 지정하면 Room은 단일 트랜잭션의 데이터베이스에 모든 매개변수를 삽입하는 구현을 생성한다

    ```kotlin
    @Dao
    interface MyDao {
        @Insert(onConflict = OnConflictStrategy.REPLACE)
        fun insertUsers(vararg users: User)
    
        @Insert
        fun insertBothUsers(user1: User, user2: User)
    
        @Insert
        fun insertUsersAndFriends(user: User, friends: List<User>)
    }
    ```

    - `@Insert`에 `onConflict` 속성을 지정해 테이블에 엔티티를 삽입할 때 같은 값인 경우 **충돌**이 발생하는데 이 충돌을 어떻게 해결할지를 정의할 수 있다
      - Replace로 지정하여 충돌 발생 시 새로 들어온 데이터로 교체한다

  - ##### Update

    - 데이터베이스에서 매개변수로 지정된 엔티티 집합을 수정한다

    ```kotlin
    @Dao
    interface MyDao {
        @Update
        fun updateUsers(vararg users: User)
    }
    ```

  - ##### Delete

    - 매개변수로 지정된 엔티티 집합을 데이터베이스에서 제거한다
    - 기본키를 사용하여 삭제할 엔티티를 찾는다

    ```kotlin
    @Dao
    interface MyDao {
        @Delete
        fun deleteUsers(vararg users: User)
    }
    ```

  - ##### Query

    - 데이터베이스에서 읽기/쓰기 작업을 수행할 수 있다
    - 각 `@Query` 메소드는 Compile time에 확인되므로 쿼리에 문제가 있으면 Runtime Error 대신 `Compile Error`가 발생한다
    - 룸은 반환된 객체의 필드 이름이 쿼리 응답의 해당 컬럼 이름과 일치하지 않는 경우 두가지 방법중 하나로 경고를 표시한다
      - 일부 필드 이름만 일치하는 경우 경고 표시
      - 필드 이름이 일치하지 않으면 오류 발생

    ```kotlin
    @Dao
    interface MyDao {
        @Query("SELECT * FROM user")
        fun loadAllUsers(): Array<User>
    }
    ```

    

  - ##### 쿼리에  매개변수 전달

    ```kotlin
    @Dao
    interface MyDao {
        @Query("SELECT * FROM user WHERE age > :minAge")
        fun loadAllUsersOlderThan(minAge: Int): Array<User>
    }
    ```

    - 컴파일시 :minAge bind 매개변수와  minAge 메소드 매개변수를 일치시킨다
    - 여러 매개변수를 전달하거나 여러번 참조할 수 있다

    ```kotlin
    @Dao
    interface MyDao {
        @Query("SELECT * FROM user WHERE age BETWEEN :minAge AND :maxAge")
        fun loadAllUsersBetweenAges(minAge: Int, maxAge: Int): Array<User>
    
        @Query("SELECT * FROM user WHERE first_name LIKE :search " +
               "OR last_name LIKE :search")
        fun findUserWithName(search: String): List<User>
    }
    ```

  - ##### 컬럼의 부분집합 반환

    - 대부분의 경우 엔티티의 몇가지 필드만 가져와야 하는데, 앱 UI에 표시되는 컬럼만 가져오면 리소스가 절약되고 쿼리도 더 빨리 완료될 수 있다

    ```kotlin
    data class NameTuple(
        @ColumnInfo(name = "first_name") val firstName: String?,
        @ColumnInfo(name = "last_name") val lastName: String?
    )
    ```

    ```kotlin
    @Dao
    interface MyDao {
        @Query("SELECT first_name, last_name FROM user")
        fun loadFullName(): List<NameTuple>
    }
    ```

    - first_name, last_name컬럼에 대한 값을 반환하고 이 값을 NameTuple 클래스의 필드에 매핑한다

  - ##### 인수 컬렉션 전달

    - 룸은 런타임 시 제공된 매개변수 수에 따라 Collection 매개변수 사이즈에 맞추어 를 자동으로 확장한다

    ```kotlin
    @Dao
    interface MyDao {
        @Query("SELECT first_name, last_name FROM user WHERE region IN (:regions)")
        fun loadUsersFromRegions(regions: List<String>): List<NameTuple>
    }
    ```

  - ##### Observable 쿼리

    - 쿼리를 실행할 때 데이터 변경 시 앱 UI가 자동으로 업데이트 시킬 수 있다
    - LiveData 유형의 리턴값을 사용하여  이를 실행할 수 있다

    ```kotlin
    @Dao
    interface MyDao {
        @Query("SELECT first_name, last_name FROM user WHERE region IN (:regions)")
        fun loadUsersFromRegionsSync(regions: List<String>): LiveData<List<User>>
    }
    ```

  - ##### 여러 테이블 쿼리

    - 여러 테이블에 엑세스 해야할 때 테이블을 조인한다

    ```kotlin
    @Dao
    interface MyDao {
        @Query(
            "SELECT * FROM book " +
            "INNER JOIN loan ON loan.book_id = book.id " +
            "INNER JOIN user ON user.id = loan.user_id " +
            "WHERE user.name LIKE :userName"
        )
        fun findBooksBorrowedByNameSync(userName: String): List<Book>
    }
    ```

    

### 엔티티 간 관계 정의

##### 일대 다 관계 정의

- 직접적인 관계를 활용할 수는 없지만 항목 간 외래 키 제약 조건을 정의할 수 있다

```kotlin
@Entity(foreignKeys = arrayOf(ForeignKey(
    entity = User::class,
    parentColumns = arrayOf("id"),
    childColumns = arrayOf("user_id"))
    )
)
data class Book(
    @PrimaryKey val bookId: Int,
    val title: String?,
    @ColumnInfo(name = "user_id") val userId: Int
)
```

- user_id 외래 키를 통해  User의 단일 인스턴스에 0개 이상의  Book 인스턴스를 연결할 수 있으므로 이를 활용해 User와 Book간의 일대다 관계를 모델링할 수 있다

- `onDelete = CASCADE`



##### 또 다른 엔티티를 내포하는 오브젝트 만들기

- `@Embedded` 어노테이션을 사용해 테이블 내의 하위 필드를  가지고 있는 엔티티를 나타낼 수 있다

```kotlin
data class Address(
    val street: String?,
    val state: String?,
    val city: String?,
    @ColumnInfo(name = "post_code") val postCode: Int
)

@Entity
data class User(
    @PrimaryKey val id: Int,
    val firstName: String?,
    @Embedded val address: Address?
)
```



##### 다대다 관계 정의

- 다대다 관계를 정의 하기 위해서는 세 가지 엔티티를 생성해야 한다

```kotlin
@Entity
data class Playlist(
    @PrimaryKey var id: Int,
    val name: String?,
    val description: String?
)

@Entity
data class Song(
    @PrimaryKey var id: Int,
    val songName: String?,
    val artistName: String?
)
```

```kotlin
@Entity(tableName = "playlist_song_join",
        primaryKeys = arrayOf("playlistId","songId"),
        foreignKeys = arrayOf(
            ForeignKey(entity = Playlist::class,
                       parentColumns = arrayOf("id"),
                       childColumns = arrayOf("playlistId")),
            ForeignKey(entity = Song::class,
                       parentColumns = arrayOf("id"),
                       childColumns = arrayOf("songId"))
        )
       )
data class PlaylistSongJoin(
    val playlistId: Int,
    val songId: Int
)
```



### 복잡한 데이터 참조

##### TypeConverter

- 룸은 primitive type과 wrapping  타입만 지원하므로 이 외에 다른 타입을 사용할 경우  TypeConverter를 사용해서 type을 치환해야 한다

```kotlin
class Converters {
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? {
        return value?.let { Date(it) }
    }

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? {
        return date?.time?.toLong()
    }
}
```

```kotlin
@Database(entities = arrayOf(User::class), version = 1)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}
```

- Converters 클래스를 정의한 후 Database 클래스에 `@TypeConverters` 어노테이션을 추가해 TypeConverter를 사용할 수 있다

```kotlin
@Entity
data class User(private val birthday: Date?)
```







