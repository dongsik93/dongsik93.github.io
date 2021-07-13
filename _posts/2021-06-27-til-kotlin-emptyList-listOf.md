---
layout: post
title: "[Kotlin] emptyList와 listOf"
subtitle: "Kotlin emptyList, listOf"
date: 2021-06-27 18:30:00 +0900
categories: til
tags: kotlin android
comments: true

---



둘 다 kotlin.collections 패키지 안에 포함되어 있지만 다른점에 대해서 알아보자



### emptyList()

```kotlin
/** * Returns an empty read-only list. The returned list is serializable (JVM). * @sample samples.collections.Collections.Lists.emptyReadOnlyList */ 
public fun <T> emptyList(): List<T> = EmptyList
```



emptyList()의 반환값을 EmptyList라는 Object이다

그렇다면 EmptyList Object는 ?



```kotlin
internal object EmptyList : List<Nothing>, Serializable, RandomAccess {
    private const val serialVersionUID: Long = -7390468764508069838L

    override fun equals(other: Any?): Boolean = other is List<*> && other.isEmpty()
    override fun hashCode(): Int = 1
    override fun toString(): String = "[]"

    override val size: Int get() = 0
    override fun isEmpty(): Boolean = true
    override fun contains(element: Nothing): Boolean = false
    override fun containsAll(elements: Collection<Nothing>): Boolean = elements.isEmpty()

    override fun get(index: Int): Nothing = throw IndexOutOfBoundsException("Empty list doesn't contain element at index $index.")
    override fun indexOf(element: Nothing): Int = -1
    override fun lastIndexOf(element: Nothing): Int = -1

    override fun iterator(): Iterator<Nothing> = EmptyIterator
    override fun listIterator(): ListIterator<Nothing> = EmptyIterator
    override fun listIterator(index: Int): ListIterator<Nothing> {
        if (index != 0) throw IndexOutOfBoundsException("Index: $index")
        return EmptyIterator
    }

    override fun subList(fromIndex: Int, toIndex: Int): List<Nothing> {
        if (fromIndex == 0 && toIndex == 0) return this
        throw IndexOutOfBoundsException("fromIndex: $fromIndex, toIndex: $toIndex")
    }

    private fun readResolve(): Any = EmptyList
}
```

List 인터페이스를 구현하고 있고, override 된 함수들을 모두 보면 비어있는 리스트의 반환 값들을 정적으로 선언해 놓았는데, 이를 통해 **비어있는 Immutable List**임을 확인할 수 있다





### listOf()

```kotlin
/**
 * Returns a new read-only list of given elements.  The returned list is serializable (JVM).
 * @sample samples.collections.Collections.Lists.readOnlyList
 */
public fun <T> listOf(vararg elements: T): List<T> = if (elements.size > 0) elements.asList() else emptyList()

/**
 * Returns an empty read-only list.  The returned list is serializable (JVM).
 * @sample samples.collections.Collections.Lists.emptyReadOnlyList
 */
@kotlin.internal.InlineOnly
public inline fun <T> listOf(): List<T> = emptyList()

/**
 * Returns an empty new [MutableList].
 * @sample samples.collections.Collections.Lists.emptyMutableList
 */
@SinceKotlin("1.1")
@kotlin.internal.InlineOnly
public inline fun <T> mutableListOf(): MutableList<T> = ArrayList()
```



세 가지의 listOf 가 존재하는데, 첫번째 두번째는 전달받은 값을 포함하는 ImmutableList 라고 볼 수 있다 마지막 세번째 코드는 emptyList()를 반환하고 있다



또 @inlineOnly 가 있는것으로 보아 세번째 listOf()를 호출하면 결국 emptyList()로 치환되어 실행되게 된다



### 결론

listOf()와 emptyList() 두 함 수는 표현식이 다를 뿐 ImmutableList를 만들어 내는 함수라고 할 수 있다



