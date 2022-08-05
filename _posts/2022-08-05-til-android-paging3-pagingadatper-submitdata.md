---
layout: post
title: "[Android] Paging3 PagingAdater가 UI를 업데이트하기까지"
subtitle: "Paging3 데이터가 UI 업데이트 되는 과정"
date: 2022-08-05 22:00:00 +0900
categories: til
tags: android paging
comments: true
---



# [Android] Paging3 PagingAdater - submitData



> 생각해보니 Paging3를 사용하고있는데 이에 대해서 정리를 한번도 하지 않은 것 같다. 먼저 데이터가 UI에 그려지는 흐름부터 시작해서, 데이터를 처리, 가공해주는 부분까지 알아보도록 하자



Paging3를 사용해 데이터가 넘어와 pagingAdapter에 submitData에 PagingData를 넣어주면 PagingAdater에서 데이터를 받아 뷰를 그려준다

그렇다면 submitData는 어떻게 PagingAdapter에 데이터를 넘겨주는걸까?

그 내부를 알아보자



```kotlin
// PagingDataAdapter.kt
// #1
suspend fun submitData(pagingData: PagingData<T>) {
	differ.submitData(pagingData)
}
// #2
fun submitData(lifecycle: Lifecycle, pagingData: PagingData<T>) {
  differ.submitData(lifecycle, pagingData)
}
```

- `#1`
    - 첫번째 submitData는 supend 함수이다. 따라서 Flow를 사용할 때 해당 함수를 사용하면 된다.
    - submitData는 업데이트가 UI로 발송되는 동일한 CoroutineDispatcher에서 호출되어야 한다 (보통 Dispatchers.Main)
    - pagingData에서 페이지 로드를 표현할 때부터 pagingData가 무효화(invalidate)될 때 까지 suspend된다
    - 최신 데이터를 표현하기 위해 일반적으로 collectLatest를 사용한다
- `#2`
    - 두번째 submitData는 RxJava나 LiveData를 위해 제공되는 함수이다
    - suspend 함수의 경우 CoroutineScope의 취소에 따라서 자동으로 취소되지만, 그렇지 않은 경우 lifeCycle에 의존하기 위해서 파라미터로 lifeCycle을 넘겨준다



다음은 submitData 내부에서 `differ.submitData(pagingData)` 를 실행하는데, differ와 해당 differ의 submitData를 알아보자

```kotlin
// PagingDataAdpater.kt
private val differ = AsyncPagingDataDiffer(
  diffCallback = diffCallback,
  updateCallback = AdapterListUpdateCallback(this),
  mainDispatcher = mainDispatcher,
  workerDispatcher = workerDispatcher
)
```

- differ의 선언부를 보면 `AsyncPagingDataDiffer` 가 할당되어있다
- diffCallback은 PagingDataAdapter를 상속받으면서 생성자로 넘겨준 DiffCallback을 의미한다

```kotlin
// AsyncPagingDataDiffer.kt
private val submitDataId = AtomicInteger(0)
// #1
suspend fun submitData(pagingData: PagingData<T>) {
    submitDataId.incrementAndGet()
    differBase.collectFrom(pagingData)
}
// #2
fun submitData(lifecycle: Lifecycle, pagingData: PagingData<T>) {
    val id = submitDataId.incrementAndGet()
    lifecycle.coroutineScope.launch {
        // Check id when this job runs to ensure the last synchronous call submitData always
        // wins.
        if (submitDataId.get() == id) {
            differBase.collectFrom(pagingData)
        }
    }
}
```

- `#2`
    - 해당 함수는 RxJava, LiveData 사용자들을 위한 함수인데 여기서 lifeCycle을 사용해 `#1` 과 동일한 처리가 가능하도록 해준다
- `#1`. `#2`
    - differBase.collectForm(pagingData)를 호출

```kotlin
// PagingDataDiffer.kt
public suspend fun collectFrom(pagingData: PagingData<T>) {
    collectFromRunner.runInIsolation { // #1
        receiver = pagingData.receiver

        // TODO: Validate only empty pages between separator pages and its dependent pages.
        pagingData.flow.collect { event ->  // #2 
            withContext<Unit>(mainDispatcher) {
                if (event is PageEvent.Insert && event.loadType == REFRESH) { // #3
										
								...

                } else {
                    if (postEvents()) {
                        yield()
                    }

                    // Send event to presenter to be shown to the UI. 
                    presenter.processEvent(event, processPageEventCallback) // #4

                    if (event is PageEvent.Drop) { // #5
                        lastAccessedIndexUnfulfilled = false
                    } else if (evnet is PageEvent.Insert) {
												...
										}

                    ...

                }
            }
        }
    }
}
```

- `#1`
    - collectFromRunner는 이전 호출을 취소하여 InIsolation을 실행하기 위해 전달된 블록의 단일 실행을 보장하는 클래스이다(SingleRunner)
    - 해당 클래스의 runInIsolation은 Mutex에 의해 지원되며, 이는 공평하므로 runInIsolation의 동시 호출자는 (이전 호출을 취소하여) 마지막 호출이 승리하면서 순서대로 트리거된다. 즉 **우선 순위를 사용할 때 현재 실행 중인 블록의 우선 순위가 더 높은 경우 새 블록이 취소되고, 현재 실행 중인 블록의 우선 순위가 낮으면 현재 실행 중인 블록이 취소된다**
- `#2`
    - 여기에서 파라미터로 전달된 `pagingData`의 이벤트를 collect한다
    - 따라서 추가로 발생하는 data의 업데이트, 즉 Paging 이벤트는 해당 Lambda 내부로 들어오며 submitData는 호출되지 않는다.
    - 단, refresh() / retry()의 경우 submitData를 호출한다
- `#3`
    - event는 insert, drop, loadStateUpdate 로 나뉘며, event의 loadType은 refresh, prepend, append로 나뉜다
- `#4`
    - event가 insert 이면서 loadType이 refresh인 경우를 제외하면 collect된 event를 presenter에 해당 event를 전달한다



거의다 온것같다. event를 전달받는 presenter를 살펴보자

```kotlin
// PagePresenter.kt
// #1
private val pages: MutableList<TransformablePage<T>> = insertEvent.pages.toMutableList()

// #2
fun processEvent(pageEvent: PageEvent<T>, callback: ProcessPageEventCallback) {
    when (pageEvent) {
        is PageEvent.Insert -> insertPage(pageEvent, callback)
        is PageEvent.Drop -> dropPages(pageEvent, callback)
        is PageEvent.LoadStateUpdate -> {
            callback.onStateUpdate(
                loadType = pageEvent.loadType,
                fromMediator = pageEvent.fromMediator,
                loadState = pageEvent.loadState
            )
        }
    }
}

// #3
private fun insertPage(insert: PageEvent.Insert<T>, callback: ProcessPageEventCallback) {
    val count = insert.pages.fullCount()
    val oldSize = size
    when (insert.loadType) {
        REFRESH -> throw IllegalArgumentException() // #3-1
        PREPEND -> {
            val placeholdersChangedCount = minOf(placeholdersBefore, count)
            val placeholdersChangedPos = placeholdersBefore - placeholdersChangedCount

            val itemsInsertedCount = count - placeholdersChangedCount
            val itemsInsertedPos = 0

            // first update all state...
            pages.addAll(0, insert.pages) // #3-2
            storageCount += count
            placeholdersBefore = insert.placeholdersBefore

            // ... then trigger callbacks, so callbacks won't see inconsistent state
            callback.onChanged(placeholdersChangedPos, placeholdersChangedCount)
            callback.onInserted(itemsInsertedPos, itemsInsertedCount)
            val placeholderInsertedCount = size - oldSize - itemsInsertedCount
            if (placeholderInsertedCount > 0) {
                callback.onInserted(0, placeholderInsertedCount)
            } else if (placeholderInsertedCount < 0) {
                callback.onRemoved(0, -placeholderInsertedCount)
            }
        }
        APPEND -> {
            ...

            // first update all state...
            pages.addAll(pages.size, insert.pages) // #3-3
            storageCount += count
            placeholdersAfter = insert.placeholdersAfter

            // ... then trigger callbacks, so callbacks won't see inconsistent state
            callback.onChanged(placeholdersChangedPos, placeholdersChangedCount)
            callback.onInserted(itemsInsertedPos, itemsInsertedCount)
            val placeholderInsertedCount = size - oldSize - itemsInsertedCount
            if (placeholderInsertedCount > 0) {
                callback.onInserted(
                    position = size - placeholderInsertedCount,
                    count = placeholderInsertedCount
                )
            } else if (placeholderInsertedCount < 0) {
                callback.onRemoved(size, -placeholderInsertedCount)
            }
        }
    }
    insert.combinedLoadStates.forEach { type, fromMediator, state -> // #3-4
        callback.onStateUpdate(type, fromMediator, state)
    }
}
```

- `#1`
    - `pages`, Paging 정보가 저장되는 변수이다
- `#2`
    - 파라미터로 전달받은 event에 따라서 데이터를 처리한다
- `#3`
    - insertPage만 살펴보자
    - callback에 event update처리, callback.onChanged, callback.onInserted …
        - 여기서 callback은 PagingAdapter를 상속받을때 넘겨준 diffcallback이다
        - UI Update가 일어나는 곳
    - #3-1
        - 이전 `collectForm`에서 event가 insert, loadType이 refresh인 경우를 처리했기 때문에 exception을 발생시킨다
    - #3-2
        - paging 정보를 pages 변수에 추가한다
        - loadType이 prepend이기 때문에 0부터 넘겨받은 pages까지 넣어준다
    - #3-3
        - loadType이 append이기 때문에 기존에 pages가 가지고있던 index 부터 넘겨받은 pages까지 넣어준다
    - #3-4
        - loadType에 따라서 데이터 처리가 완료되면 `CombinedLoadStates` 를 순회하며 상태를 update시켜준다
        - paging3에서 사용하는 `loadStateFlow` 에서 collect되는 정보들이 여기서 전달됨을 알 수 있다

이상으로 PagingData가 submitData된 이후 부터 UI에 업데이트, 데이터 저장을 알아봤다

PagingDataAdapter를 상속받아 adapter를 만들 때 무지성으로 diffCallback을 넘겨주고있었는데, 어디에서 어떻게 처리되는지를 알아보는 시간이였다.. (잘못된 부분 있으면 댓글 부탁드립니다)