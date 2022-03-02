---
layout: post
title: "[Android] 클린아키텍처"
subtitle: "Clean Architecture에 대한 공부"
date: 2022-02-13 13:00:00 +0900
categories: til
tags: android
comments: true


---



# [Android] 클린아키텍처



## Clean Architecture

Robert C. Martin의 Clean Architecture는 이제 구글에서도 권장하는 아키텍처가 되었다.



![ca_1.png](/img/in-post/ca_1.png)



#### 계층 구조

클린아키텍처의 구조는 그림처럼 4가지 계층으로 되어있다.

계층을 나누는 이유는 계층을 분리하여 관심사를 분리시키기 위해서이며, 이런 아키텍처가 동작하기 위해서는 의존성 규칙을 지켜야 한다

여기서 의존성 규칙은 외부에서 내부로, 즉 고수준 정책을 향해야 한다 (원 안쪽으로 갈수록 의존성이 낮아진다)

한마디로 분리된 각각의 클래스가 한가지 역할만 하고 서로 의존을 어떻게 할지 규칙들이 정해져 있고, 이를 지켜야 한다는 말이다

이렇게 계층을 나눔으로써 얻을 수 있는 이점은 테스트가 용이해지고 유지보수 및 협업이 쉬워진다

1. **Entities**
    - 엔티티는 가장 일반적인 비즈니스 규칠을 캡슐화하고 DTO도 포함하는 전사적 비즈니스 규칙이다
    - 외부가 변경되더라도 이러한 규칙이 변경될 가능석이 적다
2. **Usecases**
    - Intereactor라고도 하며 소프트웨어의 어플리케이션 별 비즈니스 규칙을 나타낸다
    - 유스케이스 계층의 변경이 엔티티에 영항을 주면 안되며 데이터베이스, 공통 프레임워크 및 UI에 대한 변경으로부터 격리된다
3. **Interface Adapters (Presenters)**
    - 데이터를 엔티티 및 유스케이스의 편리한 형식에서 데이터베이스 및 웹에 적용할 수 있는 형식으로 변환한다
    - MVP의 Presenter, MVVM의 ViewModel 및 Repository가 포함된다
    - 순수한 비즈니스 로직만을 담당하는 역할
4. **Frameworks & Drivers (Web, DB)**
    - 웹 프레입워크, 데이터베이스, UI, HTTP 클라이언트 등으로 구성된 가장 바깥 쪽 계층이다



### Clean Architecture in Android



![ca_2.png](/img/in-post/ca_2.png)



안드로이드용으로 이해하기 쉽게 만들어진 클린아키텍처 구조는 Entity 레이어를 따로 두지않고 일반적으로 Presentation, Domain, Data 총 3개의 계층으로 크게 나눈다.



1. **Presentation**
    - UI(Activity, Fragment), Presenter 및 ViewModel을 포함한다
    - 즉, 화면과 입력에 대한 처리 등 UI와 직접적으로 관련된 부분을 담당한다
    - Presentation 레이어는 Domain 레이어에 대한 의존성을 가지고 있다
2. **Domain**
    - 애플리케이션의 비즈니스 로직을 포함하고 비즈니스 로직에서 필요한 Model과 UseCase를 포함한다
    - 각 개별 기능 또는 비즈니스 논리 단위인데 보통 한개의 행동을 담당하고 UseCase의 이름만 보고 무슨 기능을 가졌을지 짐작하고 구분할 수 있어야 한다
    - 안드로이드 프레임워크 의존정을 갖지 않고, kotlin코드로만 구성하고, Repository 인터페이스가 포함되어있다
    - Domain 레이어는 Presentation, Data레이어와 어떠한 의존성도 맺지 않고 독립적이다
3. **Data**
    - Repository 구현체, Room DB, Dao, Model 서버 API를 포함하고 있으며 로컬 또는 서버 API와 통신하여 데이터를 CRUD 하는 역할을 한다
    - Mapper 클래스를 통해 Data 계층의 모델을 Domain 계층의 모델로 변환해주는 역할을 한다
    - Domain레이어에 대한 의존성을 가지고 있다



## Code Sample



### 프로젝트 패키지 구조

위처럼 data, domain, presentation 3개의 계층으로 나눴다

보통 3개의 계층으로 나눌때 멀티모듈로 구성하게 되는데 아직 멀티모듈을 적용시키지 않아서 추후에 멀티모듈 적용 후 다시 포스팅을 해야겠다



![ca_3.png](/img/in-post/ca_3.png)



### 1. Presentation Layer

화면 이동이나 사용자의 입력을 처리하기 위한 관심사를 모아놓은 레이어이다



![ca_4.png](/img/in-post/ca_4.png)



단어장에 단어를 추가하는 화면과 관련된 AddActivity, AddViewModel 코드

- AddActivity

```kotlin
package com.example.bard.presentation.views.add

import android.content.Intent
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.bard.BR
import com.example.bard.R
import com.example.bard.databinding.ActivityAddBinding
import com.example.bard.domain.model.AddContent
import com.example.bard.domain.model.NoteData
import com.example.bard.presentation.base.BaseActivity
import com.example.bard.presentation.base.OnSingleClickListener
import com.example.bard.presentation.ext.repeatOnStart
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.flow.collect

@AndroidEntryPoint
class AddActivity : BaseActivity<ActivityAddBinding, AddViewModel>() {
    private val vm: AddViewModel by viewModels()
    private lateinit var binding: ActivityAddBinding

    override fun getLayoutId() = R.layout.activity_add
    override fun getBindingVariable() = BR._all
    override fun getViewModel() = vm

    private var adapter = setDefaultAdapter()
    private var isEdit = false

    override fun setActivity() {
        binding = getViewDataBinding()
        initRecyclerView()
        with(intent) {
            val noteId = getIntExtra("test", -1)
            if (noteId > 0) {
                vm.findNoteById(noteId)
                isEdit = true
            } else {
                setAdapter()
            }
        }

        repeatOnStart {
            vm.eventFlow.collect { event -> handleEvent(event) }
        }

        setListener()
    }

    private fun handleEvent(event: AddViewModel.AddEvent) {
        when (event) {
            is AddViewModel.AddEvent.Note -> {
                binding.apply {
                    etTitle.setText(event.data.title)
                    adapter = AddItemAdapter(event.data)
                    setAdapter()
                }
            }
            is AddViewModel.AddEvent.Success -> {
                if (isEdit) {
                    showToast("단어장 수정이 완료되었습니다.")
                    setResults(event.id)
                } else {
                    showToast("단어장 생성이 완료되었습니다.")
                    finish()
                }
            }
        }
    }

    private fun setAdapter() {
        binding.rvAddContent.adapter = adapter
    }

    private fun setListener() {
        binding.tvAdd.setOnClickListener {
            adapter.addItem()
        }

        /* 단어장 저장 */
        binding.tvSave.setOnClickListener(object : OnSingleClickListener() {
            override fun onSingleClick(view: View) {
                checkData {
                    val noteData = adapter.getAllItem().apply {
                        title = binding.etTitle.text.toString()
                    }
                    vm.saveNote(noteData)
                }
            }
        })
    }

    /**
     * 유효성 검사 후 데이터 input
     */
    private fun checkData(func: () -> Unit) {
        binding.apply {
            if (etTitle.text.isEmpty()) {
                showToast("제목을 입력해 주세요")
            } else {
                func.invoke()
            }
        }
    }

    private fun showToast(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }

    private fun initRecyclerView() {
        binding.apply {
            rvAddContent.layoutManager = LinearLayoutManager(this@AddActivity)
        }
    }

    private fun setDefaultAdapter(): AddItemAdapter {
        val itemList = mutableListOf<AddContent>()
        for (i in 0..3) { itemList.add(AddContent()) }
        return AddItemAdapter(
            NoteData(-1, "", itemList)
        )
    }

    private fun setResults(noteId: Int) {
        val data = Intent().apply {
            putExtra("result", isEdit)
            putExtra("noteId", noteId)
        }
        setResult(RESULT_OK, data)
        finish()
    }
}
```

- AddViewModel

```kotlin
package com.example.bard.presentation.views.add

import androidx.lifecycle.viewModelScope
import com.example.bard.domain.model.NoteData
import com.example.bard.domain.usecases.GetNoteByIdUseCase
import com.example.bard.domain.usecases.SetNoteUseCase
import com.example.bard.presentation.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AddViewModel @Inject constructor(
    private val setNoteUseCase: SetNoteUseCase,
    private val getNoteByIdUseCase: GetNoteByIdUseCase
) : BaseViewModel() {

    private val _eventFlow = MutableSharedFlow<AddEvent>()
    val eventFlow: SharedFlow<AddEvent> = _eventFlow

    fun saveNote(noteItem: NoteData, ) {
        viewModelScope.launch {
            event(AddEvent.Success(setNoteUseCase(noteItem)))
        }
    }

    fun findNoteById(noteId: Int) {
        viewModelScope.launch {
            getNoteByIdUseCase(noteId).apply {
                event(AddEvent.Note(NoteData(noteId, first, second,)))
            }
        }
    }

    private fun event(event: AddEvent) {
        viewModelScope.launch {
            _eventFlow.emit(event)
        }
    }

    sealed class AddEvent {
        data class Note(val data: NoteData) : AddEvent()
        data class Success(val id: Int) : AddEvent()
    }
}
```



### 2. Data Layer

Domain에서 요청하거나 원하는 데이터를 서버 API, Local DB와 통신해서 처리해주고, 알맞게 변환해주는 역할을 한다



![ca_5.png](/img/in-post/ca_5.png)



- NoteRepository 구현체가 있는 계층이다

```kotlin
package com.example.bard.data.repositories

import com.example.bard.data.source.local.DsDataBase
import com.example.bard.data.source.local.entity.DsNoteEntity
import com.example.bard.data.source.local.entity.DsWordEntity
import com.example.bard.domain.model.NoteData
import com.example.bard.domain.repositories.NoteRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import javax.inject.Inject

class NoteRepositoryImpl @Inject constructor(
    private val db: DsDataBase,
    private val ioDispatcher: CoroutineDispatcher
) : NoteRepository {

    override suspend fun saveNote(noteData: NoteData) = withContext(ioDispatcher) {
        var noteId = 0
        db.noteDao().withTransaction {
            if (noteData.noteId > 0) {
                val entity = db.noteDao().getNoteEntityById(noteData.noteId)
                db.noteDao().delete(entity)
            }
            noteId = db.noteDao().insert(DsNoteEntity.entity(noteData.title)).toInt()
            noteData.wordList.map { db.wordDao().insert(DsWordEntity.entity(noteId, it)) }
        }
        noteId
    }

    override suspend fun getNoteId(title: String) = withContext(ioDispatcher) {
        db.noteDao().getNoteEntityByTitle(title)
    }

    override suspend fun getAllNoteTitle() = withContext(ioDispatcher) {
        db.noteDao().getTitle()
    }

    override suspend fun getNoteById(noteId: Int) = withContext(ioDispatcher) {
        db.noteDao().getTitleById(noteId) to db.wordDao().getWordById(noteId)
    }

    override suspend fun getWordsByTitle(title: String) = withContext(ioDispatcher) {
        db.wordDao().getWordById(db.noteDao().getNoteEntityByTitle(title).id)
    }
}
```



### 3. Domain Layer

누구와도 의존성을 이루지 않는 독립적인 계층이다. 비즈니스 로직을 담당한다



![ca_6.png](/img/in-post/ca_6.png)



- UseCase
    - 1개 이상의 Repository를 받아 비즈니스 로직을 처리해며 하나의 유저 행동에 대한 비즈니스 로직을 가지고 있는 객체이다
    - 보통 하나의 UseCase는 하나의 로직을 담당하도록 구현하는데, 이로 인해 많은 UseCase클래스가 생긴다는 단점이 있다

```kotlin
package com.example.bard.domain.usecases

import com.example.bard.domain.repositories.NoteRepository
import javax.inject.Inject

class GetAllNoteTitleUseCase @Inject constructor(private val repository: NoteRepository) {
    /* 단어장 제목 리스트 가져오기 */
    suspend operator fun invoke() = repository.getAllNoteTitle()
}
```

- Repository Interface
    - UseCase에서 사용할 Repostiroy를 가지고 있으며, 실제 구현체는 DayaLayer에 있다

```kotlin
package com.example.bard.domain.repositories

import com.example.bard.domain.model.NoteData

interface NoteRepository {
    /* 단어장 저장 */
    suspend fun saveNote(noteData: NoteData): Int

    /* 단어장 id 가져오기 */
    suspend fun getNoteId(title: String): NoteData

    /* 단어장 제목 리스트 가져오기 */
    suspend fun getAllNoteTitle(): List<String>

    /* 단어장 id로 단어장 제목, 내용 가져오기 */
    suspend fun getNoteById(noteId: Int): Pair<String, List<NoteData>>

    /* 단어장 제목으로 해당 단어장 내용 가져오기 */
    suspend fun getWordsByTitle(title: String): List<NoteData>
}
```

반년전 처음 클린아키텍처를 접하고 만들었었던 앱이라 그런지 군데군데 잘못된 점들이 많이 보인다.

향후 잘못된 부분들을 수정하고, 멀티모듈로 리팩토링한 후 다시 포스팅 해야겠다



### 참고사이트

- [The Clean Architecture](http://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html){: class="underlineFill"}

- [[안드로이드] 클린 아키텍처(Clean Architecture) 정리 및 구현](https://youngest-programming.tistory.com/484){: class="underlineFill"}
- [Android ShowCase](https://github.com/igorwojda/android-showcase){: class="underlineFill"}

