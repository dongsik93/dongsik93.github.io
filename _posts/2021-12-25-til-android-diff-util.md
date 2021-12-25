---
layout: post
title: "[Android] DiffUtil"
subtitle: "DiffUtil에 대해 알아보자"
date: 2021-12-25 15:00:00 +0900
categories: til
tags: android
comments: true
---



# [Android] DiffUtil



> RecyclerView DiffUtil에 대해서 알아보쟈



### DiffUtil 이란?

- RecyclerView에서 데이터 업데이트 처리를 효율적으로 작업하기위해 만들어진 클래스
- 두 목록간의 차이점을 찾고 업데이트 되어야 할 목록을 반환해주고, 어댑터에 대한 업데이트를 알리는데 사용된다
- `notifyDataSetChanged()` 라는 함수가 있지만 뷰를 업데이트시키는 과정에서 모든 데이터를 다시 그리기 때문에 비효율적이므로 `DiffUtil`을 사용해 데이터들을 비교후 변경된 부분만 효율적으로 업데이트 할 수 있다
- DiffUtil은 내부적으로 [Eugene W. Myers의 diff algorithm](http://www.xmailserver.org/diff2.pdf){: class="underlineFill"}을 사용한다.
    - 해당 알고리즘은 공간에 최적화 되어있어 아이템이 N개 있을 때 공간복잡도는 O(N)이다
    - 시간복잡도는 ond/new 두 리스트의 합인 N개의 아이템과, old가 new로 변환되기 위해 필요한 최소 작업개수 D가 있을 때 O(N + D^2)이다.
    - 시간복잡도가 꽤 높기 때문에 백그라운드스레드에서의 수행을 권장한다
    - 최대 사이즈는 2^26이다



### DiffUtil Callback

- `DiffUtil` 클래스에서는 두 가지 Callback을 제공하는데 `DiffUtil.Callback()` 과 `DiffUtil.ItemCallback()` 이 있다

- `DiffUtil.Callback()`

    ```kotlin
    class DiffTest(
        private val oldItem: List<String>(),
        private val newItem: List<String>()
    ) : DiffUtil.Callback() {
        override fun getOldListSize(): Int {}
        override fun getNewListSize(): Int {}
        override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {}
        override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {}
    }
    ```

    - 4개의 추상 메서드와 1개의 비 추상 메서드로 구성되어있으며, 위는 4개의 추상메서드이다
    - 추상메서드
        - areItemsTheSame(oldPosition: Int, newPosition: Int)
            - 두 객체가 동일한 항목을 나타내는지 확인
        - getOldListSize()
            - 바뀌기 전 리스트의 크기를 리턴
        - getNewListSize()
            - 바뀐 후 리스트의 크기를 리턴
        - areContentsTheSame(oldPosition: Int, newPosition: Int)
            - 두 항목의 데이터가 같은지 확인
            - 이 메서드는 areItemsTheSame이 true일때만 불린다
    - 비 추상 메서드
        - getChangePaylod(oldPosition: Int, newPosition: Int)
            - areItemsTheSame == true && areContentsTheSame == false인 경우에만 호출
    - `DiffUtil.Callback()` 은 2개의 아이템을 해당 클래스에 넣어주면 `diffREsult`로 결과가 나오게 된다

    ```kotlin
    private fun calcDiff(newItem: MutableList<String>) {
        val diffCallback = DiffTest(datSet, newItem)
        val diffResult: DiffUtil.DiffResult = DiffUtil.calculateDiff(diffCallback)
        diffResult.dispatchUpdatesTo(this)
    }
    ```

    - `DiffUtil.DiffResult`는 oldList가 newList로 변환하기 위한 정보를 포함하여 return을 해준다.
    - diffResult로 나온 값을 `dispatchUpdatesTo` 를 통해서 adapter에게 알려주면 된다

- `DiffUtil.ItemCallback()`

    - DiffUtil.Callback()을 사용하면 직접 백그라운드 스레드에서 비교 처리를 수행하고, 결과를 다시 넘겨주는 코드를 작성해야 했는데, `DiffUtil.ItemCallabck()`과 `AsyncListDiffe`를 사용하면 내부적으로 모든 일들을 처리해준다

    ```kotlin
    class DiffTest : DiffUtil.ItemCallback<String>() {
        override fun areItemsTheSame(oldItem: String, newItem: String): Boolean {}
        override fun areContentsTheSame(oldItem: String, newItem: String): Boolean {}
    }
    ```

    - 위의 2가지 추상 메서드만 구현해주면 된다

    ```kotlin
    private val asyncDiffer = AsyncListDiffer(this, DiffTest())
    
    ...
    
    override fun getItemCount() = asyncDiffer.currentList.size
    
    fun updateItem(newItem: List<String>) {
    		asyncDiffer.submitList(newItem)
    }
    ```

    - `AsyncListDiffer`를 생성해서 사용하면 된다
    - asyncDiffer에서 넘어오는 currentList는 `READ ONLY` 리스트로 변경이 불가능하기 때문에 submitListI()를 통해서 아이템을 변경해준다



### AreItemsTheSame vs AreContentsTheSame

- 위에서 areItemTheSame을 먼저 수행하고, true일때만 areContentsTheSame을 수행한다고 했는데 이를 더 자세하게 알아보자

- `areItemTheSame`

    ```java
    /**
     * Called by the DiffUtil to decide whether two object represent the same Item.
     * <p>
     * For example, if your items have unique ids, this method should check their id equality.
     *
     * @param oldItemPosition The position of the item in the old list
     * @param newItemPosition The position of the item in the new list
     * @return True if the two items represent the same object or false if they are different.
     */
    public abstract boolean areItemsTheSame(int oldItemPosition, int newItemPosition);
    ```

    - 두 객체가 같은 아이팀을 비교하는데, 보통 유니크한 id값을 사용하거나 값이 유니크해서 비교할 수 있는 속성들을 사용해서 비교하게된다
    - 그 후 areItemsTheSame의 결과 정보를 기준으로 areContentsTheSame을 한번 더 체크하게 된다
    - 결과 정보가 false일 경우에는 내부적으로 아이템을 remove처리하고, 새로운 아이템을 insert 하도록 동작한다
        - 단순하게 기존 아이템을 지우고, 갱신하는 식으로 동작하기 때문에 변경되면서 깜빡거릴수 있기 때문에 areItemsTheSame을 잘 정리해야 한다

- `areContentsTheSame`

    ```java
    /**
     * Called by the DiffUtil when it wants to check whether two items have the same data.
     * DiffUtil uses this information to detect if the contents of an item has changed.
     * <p>
     * DiffUtil uses this method to check equality instead of {@link Object#equals(Object)}
     * so that you can change its behavior depending on your UI.
     * For example, if you are using DiffUtil with a
     * {@link RecyclerView.Adapter RecyclerView.Adapter}, you should
     * return whether the items' visual representations are the same.
     * <p>
     * This method is called only if {@link #areItemsTheSame(int, int)} returns
     * {@code true} for these items.
     *
     * @param oldItemPosition The position of the item in the old list
     * @param newItemPosition The position of the item in the new list which replaces the
     *                        oldItem
     * @return True if the contents of the items are the same or false if they are different.
     */
    public abstract boolean areContentsTheSame(int oldItemPosition, int newItemPosition);
    ```

    - areItemsTheSame이 true가 되면 호출된다
    - areItemsTheSame을 통해서 유니크한 값이 같은걸 확인했다고 하더라도, 다른 값들이 다를 수 있기 때문에 두개의 아이템이 같은 데이터를 가지고 있는지 체크하는 기준을 구현해야 하는 곳이다
    - 보통 `==`으로 비교하게 되는데, kotlin의 Data Class의 equals를 통해 비교



참고사이트

- [[Android] RecyclerView Diffutil](<https://onemask514.tistory.com/48>){: class="underlineFill"}
- [[Android] ListAdapter로 리스트 효율적으로 관리하기](<https://s2choco.tistory.com/33>){: class="underlineFill"}
- [data class를 활용하여 RecyclerView.DiffUtil을 잘 활용하는 방법](<https://thdev.tech/kotlin/2020/09/22/kotlin_effective_03/>){: class="underlineFill"}

