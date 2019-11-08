---
layout: post
title: "Python OOP2"
subtitle: "python"
date: 2019-01-14 18:00:00 +0900
categories: til
tags: python
comments: true
---


## Python OOP2


### `self` 

- 인스턴스 객제 자기자신
- this 키워드와 같다고 생각하면 됨

- 특별한 상황을 제외하고는 무조건 메서드에서 `self`를 첫번째 인자로 설정한다

```python
iu.greeting()
# iu라를 객체에 greeting을 동작시키면 self안에 자기 자신을 매개변수로 해 함수를 호출
Person.greeting(iu)
# 두개 같은말
```

```python
# 클래스 선언부 내에서도 반드시 self를 통해 데이터 어트리뷰트(멤버변수)에 접근해야 한다

name = "?"

class Person:
    name = "홍길동"
    def greeting(self):
        print(f"{name}입니다")

p1 = Person()
print(p1.name)
p1.greeting()
# name이 self.name이 아니여서 클래스 밖의 변수 name = "?"을 참조하게 된다
```

### 클래스-인스턴스간 이름공간(name space)

- 클래스를 정의하면, 클래스 객체가 생성되고 해당되는 이름 공간(name space)이 생성된다.
- 인스턴스를 만들게 되면, 인스턴스 객체가 생성되고 해당되는 이름 공간이 생성된다.
- 인스턴스의 어트리뷰트가 변경되면, 변경된 데이터를 인스턴스 객체 이름 공간에 저장한다.
- 즉, 인스턴스에서 특정한 어트리뷰트에 접근하게 되면 인스턴스 -> 클래스 순으로 탐색을 한다.

```python
iu = Person() # Person인스턴스 공간이 생김
iu.name = "아이유" # Person인스턴스 내에 다른공간의 name 안에 "아이유"가 들어감
iu.greeting()

```

### 생성자 & 소멸자

- 생성자는 인스턴스 객체가 생성될 때 호출되는 함수이며, 소멸자는 객체가 소멸되는 과정에서 호출됨

```python
def __init__(self):
    print('생성될 때 자동으로 호출되는 메서드입니다.')
	# 인스턴스를 만드는 순간 생성자가 호출되어 print()가 실행됨
def __del__(self):
    print('소멸될 때 자동으로 호출되는 메서드입니다.')
	# 인스턴스를 삭제하는 순간 소멸자가 호출되어 실행
    
# 위의 형식처럼 양쪽에 언더스코어가 있는 메서드를 스페셜 메서드 혹은 매직 메서드라고 불립니다.
# __가 붙은건 파이썬 내 만들어진(구현된) 내장메서드 ? ? // 덮어씌우기 가능
```

```python
class Person():
    name = "임시이름"
    def __init__(self, name):
        print(f"응애 {name}")
        print(f"응애 {self.name}")
    def __del__(self):
        print("꽥")
        
hong = Person("홍길동")
>>> 응애 홍길동
>>> 응애 임시이름
>>> 꽥
# name은 인스턴스 생성시 홍길동이라는 인자(parameter)값을 받아 실행되는 name이고
# self.name은 클래스내의 멤버변수(data attribute)를 접근
# 각각 다른 이름공간(name space)에 존재한다는걸 생각해야함
```

### 변수 재할당 구조

- 꽥이 실행되는 이유는 person을 hong에 재할당 하면서 또 다른 person을 hong이 가르키기 때문에 기존의 person과는 연결이 끊어지고 새로 생성된 person과 연결이 된다. 따라서 연결이 끊어진 person은 쓸모없는게 되어버렸기 때문에 파이썬 내의 가비지컬렉션이 해당 person을 소멸시키기 때문에 소멸자가 실행 된 모습이다
- 연결이 끊어지는 순간에 객체가 사라짐
- 파이썬 생성주기? 생명주기? 참조( 검색해보기 )



### 클래스 변수  / 인스턴스 변수

```python
class Person():
    population = 0
    
    def __init__(self, name):
        self.name = name
        # 멤버변수 name 선언 없이 init 생성자 생성시 name인자값으로 받아온 name을 자기자신의 self.name을 불러와야하는데 현재 멤머변수(클래스 변수)로 선언되지 않았기 때문에 인스턴스 내의 이름공간에 만들어짐
        Person.population += 1
    def greeting(self):
        print(f"{self.name}입니다. 반가워요^_^")
        
dong= Person("동식")
print(dong.name)
friend = Person("tomas")
print(friend.name)

# 생성된 dong / friend의 각각의 인스턴스 내부에 저장되는 이름공간 안에 self.name이 저장됨
# 즉 인스턴스 변수로 name이 생성되는거

Person.population
# 생성자가 실행될때다 population 이 1개씩 올라감
# 생성자는 인스턴스가 만들어질때마다 실행됨
dong.population
# 인스턴스도 접근이 가능하다 왜냐하면 인스턴스도 클래스가 가지고 있는 값에 접근할 수 있다
# 단 인스턴스의 우선순위는 인스턴스 내의 이름공간 다음 클래스 순으로 탐색한다
```

### 정적 메서드 / 클래스 메서드

- 메서드 호출을 인스턴스가 아닌 클래스가 할 수 있도록 구성할 수 있습니다.
- 이때 활용되는게 정적 메서드 혹은 클래스 메서드입니다.
- 정적 메소드는 객체가 전달되지 않은 형태이며, 클래스 메서드는 인자로 클래스를 넘겨준다.

```python
Person.greeting()
# 오류가나는 이유는 인스턴스에서 호출한게 아니기 때문 해결은?
```

```python
class Dog():
    num_of_dogs = 0

    def __init__(self,name,age):
        self.nickname = name
        self.sal = age 
        # 클래스.변수 로 접근해야 클래스 내부의 변수를 정확히 가르킴
        Dog.num_of_dogs += 1
    def bark(self):
        print(f"왈왈!!!{self.nickname}")
	# staticmethod (정적 메서드)
    @staticmethod
    def info():
        print("개입니다")
    # classmethod (클래스 메서드) : cls(class)를 넣어줌
    @classmethod
    def count(cls):  
        print(f"{cls.num_of_dogs}마리가 태어났어요 ! ")
        
d1 = Dog("로또",5)
d2 = Dog("해피",3)
d3 = Dog("콜라",4)

d1.nickname
d1.sal
d1.num_of_dogs
d1.bark()
d2.bark()
d3.bark()
Dog.bark()
# self라는 인자값을 넣었기 때문에 Dog.bark()는 오류가 나옴
Dog.info()
# 이거처럼 self를 넣지 않고 @staticmethod로 만들어 줘야 클래스 내의 함수를 클래스로 접근가능
Dog.count()
# 클래스 내부의 함수를 접근할때
```

```python
# staticmethod의 예
class Calculator():
    @staticmethod
    def add(a,b):
        return a+b
    @staticmethod
    def div(a,b):
        return a/b
    @staticmethod
    def sub(a,b):
        return a-b
    @staticmethod
    def mul(a,b):
        return a*b
```

### 인스턴스 메서드

- self로 접근하는거

### 연산자 오버라이딩(중복정의)

- 인스턴스 객체 : 데이터 어트리뷰트 / 함수 등등이 정의된 

```python
class Person():
    population = 0
    
    def __init__(self, name, age):
        self.name = name
        self.age = age
        Person.population += 1
    
    def greeting(self):
        print(f"{self.name}입니다. 반가워요^_^")
    # 인스턴스끼리 비교를 하게 만듬
    # other에는 다른 인스턴스를 넣을것
    def __gt__(self, other):
        if(self.age > other.age):
            return "왼쪽이 더 늙었네 ^_^"
        else:
            return "오른쪽이 더 늙었네 ^_^"

p1 = Person("아저씨",50)
p2 = Person("아기",4)

p1 > p2     
```



### <span style = "color:red">상속</span>



- 클래스에서 가장 큰 특징은 '상속' 기능을 가지고 있다는 것이다.
- 부모 클래스의 모든 속성(변수 / 기타 나머지것)이 자식 클래스에게 상속 되므로 코드재사용성이 높아집니다.

```python
class Person():
    
    def __init__(self,name):
        self.name = name
    
    def greeting(self):
        print(f"{self.name}!!!! 안녕!!!")

# Person클래스의 모든 데이터를 가지고 시작 수정, 추가, 덮어쓰기 가능--- 상속        
class Student(Person):
    
    def __init__(self,name,student_id):
        self.name = name
        self.student_id = student_id

s1 = Student("싸피",123456)
s1.name
>>> 싸피
s1.greeting()
>>> 싸피!!!! 안녕!!!
# 자식 클래스에 greeting이 없더라도 부모 클래스에 정의를 했기 때문에 메소드를 호출 할 수 있다

issubclass(Student,Person)
# Student가 Person의 자식 클래스인지 확인
```

### super()

```python
class Person:
    def __init__(self, name, age, number, email):
        self.name = name
        self.age = age
        self.number = number
        self.email = email 
        
    def greeting(self):
        print(f'안녕, {self.name}')
        
class Student(Person):
    def __init__(self, name, age, number, email, student_id):
        self.name = name
        self.age = age
        self.number = number
        self.email = email 
        self.student_id = student_id
        
p1 = Person('홍길동', 200, '0101231234', 'hong@gildong')
s1 = Student('학생', 20, '12312312', 'student@naver.com', '190000')
```

상속을 했어도 동일한 코드가 반복되었기 때문에 super()를 이용해 수정하기 

```python
class Person:
    def __init__(self, name, age, number, email):
        self.name = name
        self.age = age
        self.number = number
        self.email = email 
        
    def greeting(self):
        print(f'안녕, {self.name}')
        
class Student(Person):
    def __init__(self, name, age, number, email, student_id):
        # super()키워드를 사용해 부모가 가지고 있던 함수를 물려받아 사용이 가능
        # 코드를 줄여준다
        super().__init__(name,age,number,email)
        self.student_id = student_id
        
p1 = Person('홍길동', 200, '0101231234', 'hong@gildong')
s1 = Student('학생', 20, '12312312', 'student@naver.com', '190000')
```

### 메소드 오버라이딩

```python
s1.greeting()
# Person의 메서드 greeting이 상속

student class에 greeting함수를 다시 작성해서 덮어쓰기
```











## typora 글자색 / 문단 / 등등

<p>
    p태그는 한줄이야
</p>

<span>

한 문장

</span>





p태그일경우 : 안녕하세요 </ 로 끝내면 띄어쓰기를 하지 않아도 아래 문장은 띄어쓰기가 됨

<span style="color:blue">안녕하세요</span>



## 절대경로 & 상대경로

- ### 절대경로

  - 

- ### 상대경로
  - 