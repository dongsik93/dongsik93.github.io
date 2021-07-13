---
layout: post
title: "[Android] Drag and Drop - Kotlin"
subtitle: "drag and drop, kotlin"
date: 2021-02-05 21:00:00 +0900
categories: til
tags: kotlin android
comments: true


---



# [Android] Drag and Drop - Kotlin



리사이클러뷰의 아이템 이동을 드래그앤 드랍으로 구현해보자



### 1. 움직여야할 아이템 생성

- 먼저 리사이클러뷰를 통해 움직이게 될 아이템들을 만들어 준다

- xml에 RecyclerView를 생성해준다

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <layout xmlns:app="http://schemas.android.com/apk/res-auto">
      
      <androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
          android:layout_width="match_parent"
          android:layout_height="match_parent">
          
          <androidx.recyclerview.widget.RecyclerView
              android:id="@+id/rv_drag_and_drop"
              android:layout_width="match_parent"
              android:layout_height="wrap_content"
              app:layout_constraintTop_toTopOf="parent"
              app:layout_constraintStart_toStartOf="parent"
              app:layout_constraintEnd_toEndOf="parent" />
  
      </androidx.constraintlayout.widget.ConstraintLayout>
  </layout>
  ```

- 그 다음 RecyclerView에 들어갈 item layout 생성

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <layout xmlns:app="http://schemas.android.com/apk/res-auto">
  
      <androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
          android:layout_width="match_parent"
          android:layout_height="wrap_content">
  
          <TextView
              android:id="@+id/tv_grade"
              android:layout_width="wrap_content"
              android:layout_height="wrap_content"
              android:layout_marginStart="@dimen/md_32"
              android:textSize="@dimen/md_14"
              android:textColor="#000000"
              android:text="1"
              app:layout_constraintTop_toTopOf="parent"
              app:layout_constraintStart_toStartOf="parent"
              app:layout_constraintBottom_toBottomOf="parent" />
          
          <TextView
              android:id="@+id/tv_title"
              android:layout_width="wrap_content"
              android:layout_height="wrap_content"
              android:layout_marginStart="@dimen/md_16"
              android:text="코끼리"
              android:textColor="#000000"
              app:layout_constraintTop_toTopOf="parent"
              app:layout_constraintStart_toEndOf="@id/tv_grade"
              app:layout_constraintBottom_toBottomOf="parent" />
          
          <ImageView
              android:id="@+id/iv_move"
              android:layout_width="wrap_content"
              android:layout_height="wrap_content"
              android:layout_marginEnd="@dimen/md_32"
              android:src="@drawable/ic_approve_line_move"
              app:layout_constraintTop_toTopOf="parent"
              app:layout_constraintEnd_toEndOf="parent"
              app:layout_constraintBottom_toBottomOf="parent" />
      </androidx.constraintlayout.widget.ConstraintLayout>
  </layout>
  ```

- 마지막으로 아이템 어댑터를 만들어준다

  ```kotlin
  class DragAndDropAdatper(val list: MutableList<String>) :
      RecyclerView.Adapter<DragAndDropAdatper.DragAndDropViewHolder>() {
  
      override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DragAndDropViewHolder {
          return DragAndDropViewHolder(
              DataBindingUtil.inflate(
                  LayoutInflater.from(parent.context),
                  R.layout.item_drag_and_drop,
                  parent,
                  false
              )
          )
      }
  
      override fun onBindViewHolder(holder: DragAndDropViewHolder, position: Int) {
          holder.bind()
      }
  
      override fun getItemCount(): Int = list.size
  
      inner class DragAndDropViewHolder(val binding: ItemDragAndDropBinding) :
          RecyclerView.ViewHolder(binding.root) {
          fun bind() {}
      }
  }
  ```





### 2. ItemTouchHelperCallback 구현하기

- 아이템들을 만들었으면 이제 본격적으로 drag and drop을 구현해야 한다

- 가장 먼저 `ItemTouchHelperCallback` 을 상속받는 custom callback을 만들어야한다

  ```kotlin
  class MyTouchHelperCallback(
      private val itemMoveListener: OnItemMoveListener
  ) : ItemTouchHelper.Callback() {
  
      interface OnItemMoveListener {
          fun onItemMove(fromPosition: Int, toPosition: Int)
      }
      
      /**
       * 어느 방향으로 움직일지에 따라서 flag 받는것을 정의
       * 드래그는 위, 아래 액션이기 때문에 up, down 을 넘겨줌
       */
      override fun getMovementFlags(
          recyclerView: RecyclerView,
          viewHolder: RecyclerView.ViewHolder
      ): Int {
          val dragFlags = ItemTouchHelper.UP or ItemTouchHelper.DOWN
          return makeMovementFlags(dragFlags, 0)
      }
  
      /**
       * 어느 위치에서 어느 위치로 변경하는지
       */
      override fun onMove(
          recyclerView: RecyclerView,
          viewHolder: RecyclerView.ViewHolder,
          target: RecyclerView.ViewHolder
      ): Boolean {
          itemMoveListener.onItemMove(viewHolder.adapterPosition, target.adapterPosition)
          return true
      }
  
      /**
       * 좌우 스와이프
       */
      override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {}
  }
  ```

  - 주석처럼 3가지 메소드를 구현한다
  - `getMovementFlags`
    - 어느 방향으로 움직일지에 따라서 flag를 받는것을 정의한다
    - `ItemTouchHelper.UP` , `ItemTouchHelper.DOWN` 은 위, 아래 방향을 의미한다
  - `onMove`
    - 순서를 변경했을 때 리스트의 데이터를 변경하기 위해 해당 adapter에서 Callback 메소드를 통해 실행 할 수 있도록 해야한다
    - 그렇기 때문에 Listener를 생성해주고 생성자로 받아와서 `onMove` 에서 이 Listener를 실행시킨다
  - `onSwiped`
    - 좌우 스와이프 동작을 구현할 때는 이 메소드를 구현하면 된다

- 이제 adapter에서 위에서 만든 CallbackListener를 구현해주면 된다

  ```kotlin
  class DragAndDropAdatper(
      val list: MutableList<String>
  ) : ...,  MyTouchHelperCallback.OnItemMoveListener {
  
      ...
      
      interface OnStartDragListener {
          fun onStartDrag(viewHolder: DragAndDropViewHolder)
      }
      
      override fun onItemMove(fromPosition: Int, toPosition: Int) {
          Collections.swap(list, fromPosition, toPosition)
          notifyItemMoved(fromPosition, toPosition)
      }
  }
  ```

  - Collections.swap 을 통해 변경된 아이템을 교체하고, notifyItemMoved를 사용해서 아이템 변경을 알린다
  - 이미지뷰를 통해 drag and drop을 하기위해 drag가 시작될 때 drag를 하도록 해야하므로 Listener를 생성해준다



### 3. ItemTouchHelper 연결

```kotlin
val adapter = DragAndDropAdapter(list)
binding.rvDragAndDrop.layoutManager = LinearLayoutManager(this)
val callback = MyTouchHelperCallback(adapter)
val touchHelper = ItemTouchHelper(callback)
touchHelper.attachToRecyclerView(binding.rvDragAndDrop)
binding.rvDragAndDrop.adapter = adapter
adapter.startDrag(object : DragAndDropAdapter.OnStartDragListener {
    override fun onStartDrag(viewHolder: DragAndDropAdapter.DragAndDropViewHolder) {
        touchHelper.startDrag(viewHolder)
    }
})
```

- 위에서 만든 `MyTouchHelperCallback` 객체를 만들어서 `ItemTouchHelper` 객체를 만든 다음 `attachToRecyclerView` 를 통해서 리사이클러뷰에 붙여준다
- 그리고 `ItemTouchHelper` 의 멤버 메소드인 `startDrag` 를 adapter의 리스너에 연결해주면 끝





### 4. 리사이클러뷰 아이템 갱신

- 위의 순서까지 마무리하면 드래그앤 드롭은 완성되지만, 아이템이 드래그앤 드롭으로 변경된 후 뷰가 갱신되지 않는 현상이 발생한다

- 이를 해결해보도록 하자

  ```kotlin
  // MyTouchHelperCallback.kt
  class MyTouchHelperCallback() ... {
      /* move 이벤트에 대한 boolean 값 */
      private var isMoved = false
  
      override fun onMove(
          recyclerView: RecyclerView,
          viewHolder: RecyclerView.ViewHolder,
          target: RecyclerView.ViewHolder
      ): Boolean {
          itemMoveListener.onItemMove(viewHolder.adapterPosition, target.adapterPosition)
          isMoved = true
          return true
      }
  
      /**
       * 드래그앤 드롭으로 순서를 변경한 후 터치를 종료하는 시점을 체크
       */
      override fun onSelectedChanged(viewHolder: RecyclerView.ViewHolder?, actionState: Int) {
          super.onSelectedChanged(viewHolder, actionState)
          if (isMoved) {
              isMoved = false
              adapter.afterDragAndDrop()
          }
      }
  }
  ```

  - 드래그앤 드롭으로 순서를 변경한 후 터치를 종료하는 시점을 체크하기 위해서 `onSelectedChanged` 메소드를 구현해 준다
  - `onMove` 에서 움직임을 감지하고, `onSelectedChanged`에서 종료 시점을 체크해서 adapter의 afterDragAndDrop을 호출해준다
  - `afterDragAndDrop` 에서는 `notifyDataSetChanged`를 호출해주면 끝 !!

  ```kotlin
  // DranAndDrop.kt
  fun afterDragAndDrop() {
      notifyDataSetChanged()
  }
  ```






이상으로 리사이클러뷰를 통한 아이템 리스트 생성부터 리스트 편집, 리사이클러뷰 갱신까지 하는 방법을 정리해보았다 !