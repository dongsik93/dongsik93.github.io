---
layout: post
title: "[Android] 온디바이스 AI 삽질기 - 4편: QLoRA 파인튜닝 실전, loss가 안 내려가면 어떡하나"
subtitle: "밤에 스크립트 돌려놓고 다음 날 아침에 확인하는 삶"
date: 2026-03-15 18:00:00 +0900
categories: til
tags: android ai llm on-device gemma finetuning qlora loss rouge
comments: true
---



# [Android] 온디바이스 AI 삽질기 - 4편: QLoRA 파인튜닝 실전, loss가 안 내려가면 어떡하나

> 학습 돌려놓고 다음 날 확인했더니 loss가 그대로였다



## 드디어 학습을 돌린다

환경도 세팅했고 데이터도 준비했다. Phase 1 학습 스크립트를 돌렸다.

```bash
python train_phase1.py
```

로그가 흘러나오기 시작했다.

```
{'loss': 2.41, 'learning_rate': 1e-04, 'epoch': 0.1}
{'loss': 2.38, 'learning_rate': 9.8e-05, 'epoch': 0.2}
{'loss': 2.35, 'learning_rate': 9.6e-05, 'epoch': 0.3}
...
```

loss가 조금씩 내려가고 있었다. 일단 돌아가고 있다는 뜻이다. M1 Mac Mini가 팬을 돌리기 시작했다.

epoch당 약 1.5~2시간이 걸렸다. 3 epoch이니까 총 5~6시간. 밤에 학습 돌려놓고 다음 날 아침에 결과를 확인하는 사이클로 진행했다.



## 학습 중에 볼 것들

loss 로그가 계속 나오는데, 뭘 봐야 하는지 처음엔 몰랐다. Claude한테 물어봤다.

핵심은 세 가지다.

**1. train loss가 내려가는가**
학습이 진행될수록 loss가 줄어들어야 한다. 안 줄어들면 learning_rate가 너무 낮거나 데이터 포맷이 잘못된 것.

**2. eval loss가 train loss를 따라가는가**
eval loss가 train loss보다 훨씬 높으면 과적합. 모델이 학습 데이터를 외운 것이지 일반화를 못 하고 있다는 신호.

**3. eval loss가 중간에 올라가진 않는가**
올라가기 시작하면 그 시점이 최적 checkpoint. 더 학습해봤자 오히려 나빠진다.

실제 Phase 1 학습 결과:

```
Epoch 1: train_loss=1.87, eval_loss=1.92
Epoch 2: train_loss=1.54, eval_loss=1.61
Epoch 3: train_loss=1.31, eval_loss=1.48
```

train과 eval이 함께 내려가고 있어서 일단 합격.



## Phase 2: 합성 데이터로 도메인 적응

Phase 1 어댑터를 베이스로 Phase 2를 이어서 돌렸다. Phase 2는 도메인 적응이라 learning_rate를 Phase 1보다 낮게 잡았다. 과적합 방지를 위해.

```python
# Phase 2는 learning_rate를 절반으로
learning_rate=5e-5,  # Phase 1: 1e-4
```

Phase 2 결과:

```
Epoch 1: train_loss=1.12, eval_loss=1.18
Epoch 2: train_loss=0.94, eval_loss=1.02
Epoch 3: train_loss=0.81, eval_loss=0.97
```

loss가 1 아래로 내려왔다. 숫자 자체보다는 계속 내려가고 있다는 게 중요하다.



## 파인튜닝 전후 비교

학습이 끝난 후 동일한 테스트 데이터로 베이스 모델과 파인튜닝 모델을 비교했다.

평가 지표는 **ROUGE-L**. 생성된 요약이 정답 요약과 얼마나 겹치는지를 측정하는 지표다. 1에 가까울수록 좋고, 0.35 이상이면 실용 수준이라는 기준을 잡았다.

**난이도별 ROUGE-L 비교**

| 난이도 | 베이스 모델 | 파인튜닝 후 | 개선 |
|---|---|---|---|
| Easy | 0.31 | 0.52 | +0.21 |
| Medium | 0.24 | 0.44 | +0.20 |
| Hard | 0.18 | 0.35 | +0.17 |

숫자보다 실제 출력을 보는 게 더 직관적이다.

**베이스 모델 출력 예시 (Medium)**

```
입력: 이번 주 금요일 오후 3시에 팀 회의가 있습니다. 
     자료는 목요일까지 공유 부탁드립니다.

베이스 모델: 안녕하세요! 무엇을 도와드릴까요? 
            회의 관련 내용을 말씀해 주시겠어요?
```

프롬프트를 무시하고 대화를 시작하려 했다. 요약 태스크를 제대로 이해 못 한 것.

**파인튜닝 후 출력**

```
파인튜닝 모델: 이번 주 금요일 오후 3시에 팀 회의가 예정되어 있습니다. 
              회의 자료는 목요일까지 공유해 주시기 바랍니다.
```

요약 포맷을 정확히 따르고 있다. 말투도 원하는 대로 나왔다.



## 잘 안 됐던 것들

**Hard 샘플에서 정보 누락**

600자 이상 긴 텍스트는 파인튜닝 후에도 중간 내용을 빠뜨리는 경우가 있었다. 앞부분과 뒷부분은 잘 잡는데 중간이 날아가는 패턴.

1B 모델의 컨텍스트 처리 한계라서 파인튜닝으로 해결하기 어렵다.

**숫자/날짜 환각**

가끔 텍스트에 없는 날짜를 만들어내는 경우가 있었다. 3월 24일이라고 썼는데 3월 25일이 나오는 식.

이것도 1B 모델의 고질적인 문제. 중요한 숫자는 별도로 검증하는 로직이 필요하다.



## 삽질 기록

**삽질 1: loss가 전혀 안 내려갔다**

처음 돌렸을 때 loss가 2.4에서 꿈쩍도 안 했다. 30분 지켜봐도 2.4, 1시간 지켜봐도 2.4.

원인은 데이터 포맷이었다. Gemma chat template 형식이 맞지 않아서 모델이 패턴 자체를 못 읽고 있던 것. `<start_of_turn>`, `<end_of_turn>` 토큰이 빠져 있었다.

```python
# 잘못된 포맷
"text": f"user: {instruction}\n\n{input_text}\nmodel: {output_text}"

# 올바른 포맷
"text": (
    f"<start_of_turn>user\n{instruction}\n\n{input_text}<end_of_turn>\n"
    f"<start_of_turn>model\n{output_text}<end_of_turn>"
)
```

포맷 고치고 나서 loss가 정상적으로 내려가기 시작했다.

**삽질 2: MPS out of memory**

배치 크기를 키우다가 메모리 에러가 났다.

```
RuntimeError: MPS backend out of memory
```

`per_device_train_batch_size=4`에서 `gradient_accumulation_steps=4`로 실질 배치 16을 만드는 게 M1 16GB에서 한계였다. 배치 크기 올리려다 죽는다.

**삽질 3: Phase 2 로드 실패**

Phase 1 어댑터를 Phase 2에서 로드할 때 에러가 났다.

```
ValueError: Attempting to unscale FP16 gradients
```

`from_pretrained`에 어댑터 경로를 넘기는 방식과 `load_adapter()`를 따로 쓰는 방식이 충돌했다. 전자로 통일하고 나서 해결됐다.



## 정리

- Phase 1 (뉴스 요약) → Phase 2 (비즈니스 문서) 순서로 2단계 학습
- loss 모니터링: train/eval 같이 내려가는지 확인
- 파인튜닝 전후 ROUGE-L: 0.18~0.31 → 0.35~0.52 로 개선
- 데이터 포맷 (chat template)이 제일 중요. 여기서 삽질함
- Hard 샘플 정보 누락, 날짜 환각은 1B 모델 한계

다음 편에서는 학습된 모델을 Android 기기에서 실행할 수 있도록 변환하는 과정이다. 여기서부터 진짜 삽질이 시작된다.



---

*[5편 - 파인튜닝 모델을 Android에 올리기: 변환 삽질기](#) 에서 계속*



#### 참고사이트

- [ROUGE Score 설명 - HuggingFace](https://huggingface.co/spaces/evaluate-metric/rouge){: class="underlineFill"}
- [Gemma chat template - Google](https://ai.google.dev/gemma/docs/formatting){: class="underlineFill"}
- [unsloth-mlx 학습 가이드](https://github.com/unslothai/unsloth){: class="underlineFill"}
