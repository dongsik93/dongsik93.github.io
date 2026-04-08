---
layout: post
title: "[Android] 온디바이스 AI 삽질기 - 3편: M1 Mac Mini 16GB로 LLM 파인튜닝 환경 세팅"
subtitle: "24GB도 아니고 M1 16GB로 1B 모델 파인튜닝 — 되긴 된다"
date: 2026-03-10 18:00:00 +0900
categories: til
tags: android ai llm on-device gemma finetuning qlora unsloth mlx
comments: true
---



# [Android] 온디바이스 AI 삽질기 - 3편: M1 Mac Mini 16GB로 LLM 파인튜닝 환경 세팅

> 클라우드 GPU 빌리면 되지 않냐고? 일단 집에 있는 걸로 해봤다.



## 왜 로컬인가

파인튜닝 환경은 크게 두 가지 선택지가 있다.

1. **Google Colab / 클라우드 GPU** — NVIDIA GPU 환경, 세팅 간단, 비용 발생
2. **로컬 머신** — 내 기계, 무료, Apple Silicon

구글 공식 가이드는 Colab T4 GPU 기준으로 나와 있다. 그냥 따라 하면 되는데, 문제는 집에 있는 Mac Mini가 M1이라는 것. 그리고 귀찮았다.

M1에서 되면 되는 거지, 하고 로컬로 시작했다.



## 스펙

```
Mac Mini M1
RAM: 16GB (통합 메모리)
저장공간: 256GB SSD
```

ML 하기에 열악한 환경이다. 공식 문서에서 권장하는 스펙도 아니다. 그런데 1B 모델 파인튜닝은 이걸로 돌아간다. QLoRA 덕분에.



## QLoRA가 뭔데 16GB로 되는 건가

1B 파라미터 모델을 풀 파인튜닝하면 메모리가 수십 GB 필요하다. 그걸 두 가지 기법으로 줄인 게 QLoRA다.

```
Quantization (양자화)
  → 모델 가중치를 4bit로 압축
  → 메모리 약 75% 절감

LoRA (Low-Rank Adaptation)
  → 전체 파라미터 대신 얇은 어댑터 레이어만 학습
  → 학습 파라미터: 전체의 약 1~2%
```

모델 원본은 4bit로 얼려두고, 그 위에 얇은 레이어만 새로 학습한다. M1 16GB에서도 1B 모델이 돌아가는 이유다.



## CUDA 환경이 아니라는 문제

파이썬 ML 생태계는 NVIDIA GPU (CUDA) 기반으로 돌아간다. Apple Silicon은 CUDA가 없다.

대신 Apple이 만든 **MLX**라는 프레임워크가 있다. M 시리즈 칩의 통합 메모리를 GPU처럼 쓸 수 있게 해준다.

파인튜닝 프레임워크로 많이 쓰는 Unsloth도 CUDA 전용이다. 그런데 **`unsloth-mlx`** 라는 MLX 버전이 따로 있다. API가 거의 동일해서 코드 변경이 최소화된다.

```
NVIDIA GPU 환경  → unsloth (CUDA)
Mac M 시리즈     → unsloth-mlx (MLX/Metal)
```



## 환경 세팅

### Python 설치

```bash
brew install python@3.11
python3.11 -m venv ~/venv/ai-finetune
source ~/venv/ai-finetune/bin/activate
```

### MLX + unsloth-mlx 설치

```bash
pip install mlx mlx-lm
pip install unsloth-mlx
pip install transformers datasets trl peft accelerate
pip install rouge-score  # 평가용
```

### 모델 다운로드

Gemma 모델은 HuggingFace에서 라이선스 동의 후 다운로드할 수 있다.

```bash
huggingface-cli login
huggingface-cli download google/gemma-3-1b-it
```

### 동작 확인

```bash
mlx_lm.generate \
  --model google/gemma-3-1b-it \
  --prompt "다음 텍스트를 요약해줘: 내일 오후 2시에 회의가 있습니다. 참석 부탁드립니다." \
  --max-tokens 100
```

첫 실행에 모델 로딩이 조금 걸리는데 이후엔 빠르다.



## 학습 스크립트 구조

학습은 2단계로 나눠서 진행했다.

```
Phase 1: 뉴스 요약 데이터로 한국어 요약 능력 강화
    ↓
Phase 2: 합성 비즈니스 문서 데이터로 도메인 적응
```

Phase 1을 먼저 하는 이유는 뉴스 데이터가 문법이 정확하고 구조가 명확해서 요약 능력 자체를 다지기 좋기 때문이다. 요약을 제대로 못 배운 상태에서 도메인 데이터를 넣으면 효과가 반감된다.

핵심 학습 설정:

```python
from unsloth_mlx import FastLanguageModel
from trl import SFTTrainer, SFTConfig

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="google/gemma-3-1b-it",
    max_seq_length=2048,
    load_in_4bit=True,   # QLoRA: 4bit 양자화
)

model = FastLanguageModel.get_peft_model(
    model,
    r=16,                # LoRA rank
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0.05,
    use_gradient_checkpointing="unsloth",
)

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=train_dataset,
    args=SFTConfig(
        output_dir="./checkpoints/phase1",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,  # 실질 배치: 4 × 4 = 16
        learning_rate=1e-4,
        fp16=True,   # MPS는 bf16 미지원
        bf16=False,
        gradient_checkpointing=True,
    ),
)
```

M1이라 `bf16=False`, `fp16=True` 로 설정해야 한다. MPS(Metal Performance Shaders)가 bf16을 지원하지 않는다.



## 실제로 돌려보니

**학습 속도**: Phase 1 기준 epoch당 약 1.5~2시간. 3 epoch 돌리면 5~6시간.

**메모리**: 학습 중 통합 메모리 13~14GB 점유. 16GB 기준 빠듯하다. 다른 앱 띄워두면 스왑이 발생하면서 느려진다. 학습 돌리는 동안 맥은 다른 작업 안 하는 게 낫다.

**발열**: 팬이 꽤 돈다. Mac Mini가 조용한 기계인데 학습 중에는 꽤 시끄럽다.

그래도 **돌아간다**. 16GB로 1B 모델 파인튜닝이 가능하다는 게 신기했다.



## Colab이랑 뭐가 다른가

구글 공식 가이드는 Colab T4 GPU 기준이라 세팅이 다르다.

| | Colab T4 | M1 Mac Mini |
|---|---|---|
| 프레임워크 | unsloth (CUDA) | unsloth-mlx (MLX) |
| 양자화 도구 | BitsAndBytes | MLX 자체 4bit |
| bf16 | ✅ | ❌ (fp16 사용) |
| 학습 속도 | 빠름 | 느림 |
| 비용 | 유료 (Pro 기준) | 무료 |
| 데이터 지속성 | 세션 끊기면 날아감 | 로컬 저장 |

개념은 같고 도구만 다르다. Colab이 빠르긴 한데 세션 끊기면 체크포인트 날아가는 게 스트레스였다. 로컬은 느려도 안 날아간다.



## 정리

- M1 Mac Mini 16GB로 1B 모델 파인튜닝 가능
- QLoRA 덕분에 가능한 것 (풀 파인튜닝이면 불가)
- CUDA 없으니 unsloth-mlx + MLX 사용
- 학습 중 메모리 13~14GB 사용, 다른 앱 끄는 게 좋음
- Phase 1 (뉴스) → Phase 2 (비즈니스 문서) 2단계 학습

다음 편에서는 실제 학습을 돌리면서 어떤 일이 있었는지, 그리고 결과가 어떻게 나왔는지를 정리한다.



---

*[4편 - QLoRA 파인튜닝 실전: loss가 안 내려가면 어떡하나](#) 에서 계속*



#### 참고사이트

- [Apple MLX GitHub](https://github.com/ml-explore/mlx){: class="underlineFill"}
- [unsloth-mlx GitHub](https://github.com/unslothai/unsloth){: class="underlineFill"}
- [10. 파인튜닝 방식 비교: Google 공식 vs 우리 방식 (내부 문서 기반)](https://ai.google.dev/gemma/docs/core/finetuning_and_evaluation){: class="underlineFill"}
