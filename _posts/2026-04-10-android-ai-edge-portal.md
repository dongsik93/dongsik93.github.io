---
layout: post
title: "[Android] Google AI Edge Portal 프라이빗 프리뷰 선정 및 소개"
subtitle: "온디바이스 AI 개발의 가장 큰 장벽, 기기 파편화 테스트를 해결해 줄 구글의 새 무기"
date: 2026-04-10 18:00:00 +0900
categories: til
tags: android ai on-device litert google-ai-edge private-preview
comments: true
---

# Google AI Edge Portal 프라이빗 프리뷰 합격

최근 사이드 프로젝트로 안드로이드 온디바이스 AI(On-device AI)를 도입하기 위해 여러 가지 모델과 프레임워크(MediaPipe, LiteRT 등)를 테스트하고 있었습니다. 

온디바이스 AI를 개발하다 보면 가장 크게 부딪히는 벽이 하나 있습니다. 바로 "내 폰(최신 플래그십)에서는 잘 도는데, 다른 기기에서는 어떨까?" 하는 하드웨어 파편화 문제입니다. 특히 NPU, GPU 가속은 기기마다 지원 여부와 칩셋(Snapdragon, Exynos 등)이 달라서 개인이 수많은 기기를 사서 테스트하는 것은 불가능에 가깝습니다.

그러던 중, 구글에서 이 문제를 해결해 줄 AI Edge Portal의 Private Preview(비공개 테스트)를 진행한다는 소식을 듣고 지원했는데, 감사하게도 오늘 승인 메일을 받았습니다.

## AI Edge Portal이란?

간단히 말해 "온디바이스 ML 모델을 위한 클라우드 기반 실제 기기 테스트 팜(Device Farm)"입니다.

![Example Benchmark](/img/in-post/example-benchmark.png)
> *이미지 출처: [Google AI Edge Portal 공식 홈페이지](https://ai.google.dev/edge)*

구글 클라우드 콘솔(GCP) 내에서 작동하며, 개발자가 자신이 깎은 .tflite (또는 LiteRT) 모델을 업로드하면 구글이 보유한 수많은 실제 안드로이드 기기 풀(Pool)에서 모델을 돌려보고 벤치마크 결과를 알려주는 서비스입니다.

![Benchmark Creation](/img/in-post/benchmark-creation-v2.gif)
> *벤치마크 생성 과정 예시 (출처: [Google AI Edge Portal 공식 홈페이지](https://ai.google.dev/edge))*

공개된 소개에 따르면 다음과 같은 테스트가 가능합니다.
* 다양한 가속기 지원: CPU뿐만 아니라 실제 기기의 GPU와 NPU 가속기를 사용한 테스트
* 다양한 기기 풀: 수백 대의 실제 안드로이드 기기에서 모델 성능(Latency, Memory 등) 측정

![Benchmark Report](/img/in-post/benchmark-report-v2.gif)
> *벤치마크 분석 리포트 예시 (출처: [Google AI Edge Portal 공식 홈페이지](https://ai.google.dev/edge))*

이제 "이 모델이 갤럭시 S24 NPU에서는 얼마나 빠를까? 구형 기기에서는 메모리가 터지지 않을까?" 하는 고민을 실제 기기 없이도 클라우드에서 바로 검증할 수 있게 된 것입니다.

## 어떻게 신청하나요?

현재 이 서비스는 일반 대중에게 공개되지 않은 Private Preview 상태이며, 신청서를 제출한 개발자/기업 중 심사를 거쳐 권한(Allowlist)을 부여하고 있습니다.

온디바이스 AI 앱을 개발 중이시거나, TFLite/LiteRT 모델의 하드웨어 가속 성능을 측정해보고 싶은 분들이라면 꼭 신청해 보시길 강력히 추천합니다.

- 신청 링크: 구글이 제공한 공식 Sign-up Form 링크를 확인하세요.
- 관련 정보: 구글 공식 블로그의 AI Edge 관련 포스트를 참고하세요.

## 마무리

현재 프라이빗 프리뷰 엠바고(NDA) 정책상, 포털 내부의 상세한 대시보드 화면이나 제가 돌려본 구체적인 벤치마크 수치, 내부 도구 사용법 등은 아직 공개할 수 없습니다.

하지만 온디바이스 AI 개발자들에게 단비 같은 서비스가 될 것은 확실해 보입니다. 추후 이 서비스가 퍼블릭 프리뷰나 정식 버전(GA)으로 공개되어 엠바고가 풀리게 되면, "실제 1B 모델 파인튜닝부터 AI Edge Portal을 활용한 NPU 최적화까지" 이어지는 깊이 있는 개발 삽질기 시리즈를 연재해 보겠습니다.

안드로이드 온디바이스 AI 생태계가 생각보다 훨씬 빠르게 발전하고 있네요. 모두 즐거운 코딩 하세요.
