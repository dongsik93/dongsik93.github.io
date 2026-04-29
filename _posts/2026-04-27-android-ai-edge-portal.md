---
layout: post
title: "[Android] Google AI Edge Portal 프라이빗 프리뷰 선정 및 소개"
subtitle: "온디바이스 AI 개발의 가장 큰 장벽, 기기 파편화 테스트를 해결해 줄 구글의 새 무기"
date: 2026-04-27 18:00:00 +0900
categories: til
tags: android ai on-device litert google-ai-edge private-preview
comments: true
---

# Google AI Edge Portal 프라이빗 프리뷰 합격

요즘 사이드 프로젝트로 안드로이드 온디바이스 AI(On-device AI)를 붙여보려고 여러 모델과 프레임워크(MediaPipe, LiteRT 등)를 돌려보고 있었다.

온디바이스 AI를 만지다 보면 꼭 부딪히는 벽이 하나 있다. *내 폰(최신 플래그십)에서는 잘 도는데, 다른 기기에서는 어떨까?* 하는 하드웨어 파편화 문제다. NPU, GPU 가속은 기기마다 지원 여부와 칩셋(Snapdragon, Exynos 등)이 달라서, 개인이 수많은 기기를 사서 테스트하기란 불가능에 가깝다.

그러던 중 구글에서 이 문제를 풀어줄 AI Edge Portal의 Private Preview(비공개 테스트)를 진행한다는 소식을 듣고 지원했는데, 오늘 승인 메일을 받았다.

## AI Edge Portal이란?

*온디바이스 ML 모델을 위한 클라우드 기반 실제 기기 테스트 팜(Device Farm)*이다.

![Example Benchmark](/img/in-post/example-benchmark.png)
> *이미지 출처: [Google AI Edge Portal 공식 홈페이지](https://ai.google.dev/edge)*

구글 클라우드 콘솔(GCP) 안에서 작동한다. 개발자가 .tflite (또는 LiteRT) 모델을 업로드하면, 구글이 보유한 수백 대의 실제 안드로이드 기기 풀(Pool)에서 모델을 돌리고 벤치마크 결과를 돌려준다.

![Benchmark Creation](/img/in-post/benchmark-creation-v2.gif)
> *벤치마크 생성 과정 예시 (출처: [Google AI Edge Portal 공식 홈페이지](https://ai.google.dev/edge))*

공개된 소개 기준으로 가능한 테스트는 이렇다.
* 다양한 가속기 지원: CPU뿐 아니라 실제 기기의 GPU, NPU 가속기로 테스트
* 다양한 기기 풀: 수백 대의 실제 안드로이드 기기에서 모델 성능(Latency, Memory 등) 측정

![Benchmark Report](/img/in-post/benchmark-report-v2.gif)
> *벤치마크 분석 리포트 예시 (출처: [Google AI Edge Portal 공식 홈페이지](https://ai.google.dev/edge))*

*이 모델이 갤럭시 S24 NPU에서는 얼마나 빠를까? 구형 기기에서는 메모리가 터지지 않을까?* 하는 고민을 실제 기기 없이 클라우드에서 바로 검증할 수 있게 됐다.

## 어떻게 신청하나?

지금은 Private Preview 상태라 신청서를 낸 개발자/기업 중 심사를 거쳐 Allowlist에 추가해주는 방식이다.

온디바이스 AI 앱을 개발 중이거나 TFLite/LiteRT 모델의 하드웨어 가속 성능을 재보고 싶다면 신청해볼 만하다.

- 신청 링크: 구글이 제공한 공식 Sign-up Form 링크를 확인하세요.
- 관련 정보: 구글 공식 블로그의 AI Edge 관련 포스트를 참고하세요.

## 마무리

지금은 프라이빗 프리뷰 엠바고(NDA) 정책상 포털 내부 대시보드 화면이나 직접 돌려본 벤치마크 수치, 도구 사용법 등은 공개할 수 없다.

다만 온디바이스 AI 개발자한테는 가뭄에 단비 같은 서비스다. 퍼블릭 프리뷰나 GA로 풀려서 엠바고가 해제되면, *실제 1B 모델 파인튜닝부터 AI Edge Portal을 활용한 NPU 최적화까지* 이어지는 삽질기를 써볼 생각이다.

안드로이드 온디바이스 AI 생태계가 생각보다 훨씬 빠르게 굴러가고 있다.
