---
layout: post
title: "[Android] 온디바이스 AI 삽질기 - 5편: 파인튜닝 모델을 Android에 올리기 (변환 삽질기)"
subtitle: "safetensors → tflite → .task → adb push, 중간에 막히는 게 한두 개가 아니다"
date: 2026-03-20 18:00:00 +0900
categories: til
tags: android ai llm on-device gemma mediapipe litert model-conversion
comments: true
---



# [Android] 온디바이스 AI 삽질기 - 5편: 파인튜닝 모델을 Android에 올리기 (변환 삽질기)

> 학습은 끝났다. 이제 기기에 올리기만 하면 된다. — 라고 생각했다.



## 변환이 왜 필요한가

파인튜닝이 끝나면 모델은 HuggingFace 형식의 `.safetensors` 파일로 저장된다. 그런데 이걸 Android에서 바로 쓸 수는 없다.

당시 기준으로 Android 온디바이스 추론은 **MediaPipe LLM Inference API**를 쓰는 게 표준이었다. MediaPipe는 `.task` 포맷을 요구한다.

변환 경로는 이렇다.

```
.safetensors (HuggingFace 형식)
    ↓ Step 1: LoRA 어댑터 머지
merged_model/ (safetensors)
    ↓ Step 2: MediaPipe converter
model.tflite
    ↓ Step 3: MediaPipe bundler
model.task
    ↓ Step 4: adb push
Android 기기
```

4단계. 각 단계마다 삽질이 기다리고 있었다.



## 삽질 1: GGUF 변환 시도 — 실패

처음엔 GGUF 포맷으로 변환하려고 했다. llama.cpp 생태계에서 많이 쓰는 포맷이라 자료가 많았다.

```bash
mlx_lm.fuse --export-gguf ...
```

```
ValueError: Model type gemma3_text not supported for GGUF conversion.
```

Gemma 3는 mlx_lm의 GGUF 변환이 미지원이었다. 그럼 llama.cpp로 직접 변환하면 되겠지 싶어서 시도했다.

```bash
python convert_hf_to_gguf.py ...
```

```
ModuleNotFoundError: No module named 'torch'
ModuleNotFoundError: No module named 'transformers'
```

PyTorch, transformers 전부 따로 설치해야 했다. 설치하고 다시 돌렸더니 이번엔 `tokenizer.model`이 없다는 에러. 결국 MediaPipe가 safetensors를 직접 지원한다는 걸 알고 나서 이 경로는 포기했다.



## 삽질 2: 구글 공식 바이너리가 없다

구글 공식 문서에 `convert_gemma_gguf_to_task` 바이너리 다운로드 링크가 있었다.

```
No such object: mediapipe-tasks/genai/converter/mac_arm64/convert_gemma_gguf_to_task
```

링크가 만료돼 있었다. 문서는 살아있는데 파일이 없는 상태.



## 삽질 3: JDK 버전 충돌

tasks-genai 구버전(0.10.14)을 쓰려고 했다.

```
class file has wrong version 65.0, should be 61.0
```

tasks-genai 0.10.20 이상부터 JDK 21로 컴파일됐는데, 프로젝트가 JDK 17이었다. 그렇다고 구버전을 쓰려니 Python 3.14 환경에서 mediapipe 최소 버전 제약에 걸려서 설치가 안 됐다.

결국 프로젝트 JDK를 17 → 21로 올리고, mediapipe와 tasks-genai 버전을 0.10.33으로 맞추는 것으로 해결했다.



## 정답: MediaPipe Python API로 safetensors 직접 변환

삽질 끝에 찾은 방법이다.

```bash
pip install mediapipe jax sentencepiece torch
```

### Step 1: LoRA 어댑터 머지

```bash
mlx_lm.fuse \
    --model google/gemma-3-1b-it \
    --adapter-path ./checkpoints/phase2/lora_adapter \
    --save-path ./models/merged_model
```

한 가지 함정: `mlx_lm.fuse`가 `tokenizer.model`을 복사하지 않는다. HuggingFace 캐시에서 수동으로 복사해야 한다.

```bash
cp ~/.cache/huggingface/hub/models--google--gemma-3-1b-it/snapshots/.../tokenizer.model \
    ./models/merged_model/
```

이걸 모르고 다음 단계로 넘어갔다가 tokenizer 에러로 한참 헤맸다.

### Step 2: safetensors → tflite

```python
from mediapipe.tasks.python.genai.converter import llm_converter

config = llm_converter.ConversionConfig(
    input_ckpt="./models/merged_model",
    ckpt_format="safetensors",
    model_type="GEMMA3_1B",
    backend="cpu",
    output_dir="./models/task_output",
    is_quantized=False,
    vocab_model_file="./models/merged_model/tokenizer.model",
    output_tflite_file="./models/task_output/model.tflite",
)

llm_converter.convert_checkpoint(config)
```

GPU 백엔드는 당시 미지원이었다. CPU 전용.

### Step 3: tflite → .task 번들

```python
from mediapipe.tasks.python.genai import bundler

config = bundler.BundleConfig(
    tflite_model="./models/task_output/model.tflite",
    tokenizer_model="./models/merged_model/tokenizer.model",
    start_token="<bos>",
    stop_tokens=["<eos>", "<end_of_turn>"],
    output_filename="./models/model.task",
    prompt_prefix_user="<start_of_turn>user\n",
    prompt_suffix_user="<end_of_turn>\n",
    prompt_prefix_model="<start_of_turn>model\n",
)

bundler.create_bundle(config)
```

결과물: `model.task` (~1.0GB, f16 기준)

### Step 4: 기기에 올리기

```bash
adb push ./models/model.task /data/local/tmp/
adb shell chmod 644 /data/local/tmp/model.task
```

Android 코드:

```kotlin
val options = LlmInference.LlmInferenceOptions.builder()
    .setModelPath("/data/local/tmp/model.task")
    .setMaxTokens(512)
    .build()
val llmInference = LlmInference.createFromOptions(context, options)
val result = llmInference.generateResponse(prompt)
```

여기서 중요한 것: **mediapipe 변환 버전과 tasks-genai 앱 버전이 반드시 일치해야 한다.** 버전이 다르면 `prefill_runner_ != nullptr` 에러와 함께 앱이 죽는다.

```
변환: mediapipe==0.10.33
앱:  tasks-genai:0.10.33  ← 반드시 같아야 함
```



## 드디어 기기에서 돌아갔다

adb push 하고 앱을 실행했다. 텍스트를 넣으니 요약이 나왔다.

TTFT는... 느렸다. 2~3초. 전체 응답까지 10초 가까이.

스트리밍도 없었다. 응답이 완성될 때까지 화면이 멈춰있었다.

이게 최선인가, 싶어서 찾아보다가 뭔가 이상한 걸 발견했다.

**MediaPipe LLM Inference API가 deprecated 되고 있었다.**

구글이 LLM 추론을 MediaPipe에서 빼서 **LiteRT-LM**이라는 새 SDK로 옮기는 중이었다. 내가 열심히 변환 파이프라인 만든 `.task` 포맷도, MediaPipe tasks-genai도 전부 레거시가 되는 중이었다.

그리고 LiteRT-LM 테스트 결과를 보니 TTFT 492ms, 스트리밍 지원.

현타가 왔다.



## 정리

- `.safetensors` → `.tflite` → `.task` 3단계 변환 필요
- GGUF 경로는 Gemma 3 미지원으로 막힘
- `tokenizer.model` 수동 복사 필수 (mlx_lm.fuse가 안 해줌)
- mediapipe 변환 버전 = tasks-genai 앱 버전 일치 필수
- 기기에서 돌아가긴 했는데 TTFT 2~3초, 스트리밍 없음
- 그리고 이 시점에 MediaPipe가 deprecated되고 있다는 걸 알았다

다음 편에서는 LiteRT-LM으로 전환하면서 겪은 일을 정리한다. 그리고 그 타이밍에 Gemma 4가 등장했다.



---

*[6편 - LiteRT-LM으로 갈아타는데 Gemma 4가 나왔다](#) 에서 계속*



#### 참고사이트

- [MediaPipe LLM Inference - Migration Guide](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/migration_guide){: class="underlineFill"}
- [MediaPipe Tasks GenAI Converter](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference/android){: class="underlineFill"}
- [mlx-lm GitHub](https://github.com/ml-explore/mlx-examples/tree/main/llms){: class="underlineFill"}
