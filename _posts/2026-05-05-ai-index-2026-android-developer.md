---
layout: post
title: "[AI] 2026 Stanford AI Index를 보며 미래에 대해 생각해보기"
subtitle: "AI 시대에 개발자는 무엇을 준비해야 할까"
date: 2026-05-05 09:00:00 +0900
categories: til
tags: ai developer career
comments: true

---

# [AI] 2026 Stanford AI Index를 보며 미래에 대해 생각해보기

Stanford HAI에서 2026 AI Index Report가 나왔다.

처음에는 그냥 AI 업계 동향을 보려고 열었는데, 읽다 보니 개발자로서 꽤 현실적으로 생각해볼 지점이 많았다.

특히 이번 리포트에서 계속 보이는 흐름은 AI는 더 빨리 좋아지고 있고, 더 많은 사람이 쓰고 있고, 더 많은 돈이 들어가고 있다는 것이다. 그런데 성능을 측정하는 기준이나 안전하게 쓰는 방법, 교육과 제도는 그 속도를 따라가지 못하고 있는 것 같다.

그래서 이번 글은 리포트를 단순 요약하기보다, AI에 관심 있는 개발자 입장에서 앞으로 무엇을 생각해야 할지 정리해보려고 한다.

## AI 성능은 아직 정체가 아니다

AI 성능이 이제 plateau에 들어간 것 아니냐는 이야기도 있었지만, Stanford HAI의 2026 AI Index는 반대로 말한다. plateau는 성장이 멈추고 평평해지는 구간을 말하는데, 리포트에서는 AI capability가 정체가 아니라 계속 가속 중이라고 본다.

리포트에 따르면 2025년 notable frontier model의 90% 이상은 산업계에서 만들어졌고, 일부 모델은 PhD 수준 과학 질문, 멀티모달 추론, 수학 대회 수준 문제에서 인간 기준선을 넘거나 근접했다. SWE-bench Verified 같은 코딩 벤치마크에서는 성능이 1년 사이 60% 수준에서 거의 100%에 가까워졌다고 정리한다. ([Stanford HAI, 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report))

개발자 입장에서 이건 단순히 AI가 코딩을 잘한다는 뜻만은 아닌 것 같다.

내가 보기에는 개발자의 기본 생산성 기준이 올라간다는 뜻에 가깝다. 예전에는 CRUD 구현, API 연결, UI 상태 처리, 테스트 코드 초안 같은 작업을 얼마나 빠르게 하느냐가 생산성의 큰 부분이었다. 그런데 이런 일들은 점점 AI가 보조하기 쉬운 영역이 된다.

그렇다면 개발자의 가치는 조금씩 다른 곳으로 이동하게 될 것 같다.

- 요구사항을 실제 시스템 구조로 해석하는 능력
- 제품의 제약을 고려해 AI 기능을 자연스럽게 녹이는 능력
- 생성된 코드가 아키텍처, 보안, 성능, UX에 맞는지 판단하는 능력
- 서버, 모델, 클라이언트 사이의 책임 경계를 설계하는 능력

즉 코드를 작성하는 사람에서 AI를 포함한 시스템을 설계하고 검증하는 사람으로 조금씩 이동하는 느낌이다.

## 벤치마크 점수만 믿기 어려워진다

AI 성능이 좋아지는 만큼, 벤치마크의 수명은 짧아지고 있다.

Technical Performance 챕터에서는 frontier model이 Humanity's Last Exam에서 1년 사이 30 percentage point 상승했고, 몇 년은 버틸 것 같던 평가가 몇 달 만에 포화되는 상황을 지적한다. 또 MMLU Math에서는 invalid question rate가 2%, GSM8K에서는 42%까지 나왔다는 리뷰도 소개한다. ([Stanford HAI, Technical Performance](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance))

이건 개발할 때도 꽤 중요한 힌트다.

앞으로 제품에 AI 기능을 넣을 때 이 모델이 벤치마크에서 1등이라는 것만으로는 충분하지 않다. 실제 제품에서는 이런 것들을 같이 봐야 한다.

- 한국어 입력에서의 안정성
- 실제 유저 플로우에서 실패하는 케이스
- hallucination이 생겼을 때의 복구 UX
- 네트워크 지연, 토큰 비용, 개인정보 처리
- 모델 업데이트 후 기존 기능에 생길 수 있는 영향

실제 서비스에는 도메인, 데이터, 권한, 개인정보, 장애 상황 같은 현실적인 제약이 있다. 그래서 모델 자체의 평균 성능보다 내 제품에서 어떻게 실패하는지를 보는 게 더 중요해질 수 있다.

## AI는 똑똑하지만 들쭉날쭉하다

이번 리포트에서 가장 인상적인 표현 중 하나는 jagged intelligence다.

예를 들어 Gemini Deep Think는 2025년 International Mathematical Olympiad에서 gold 수준의 35점을 기록했지만, ClockBench에서 최고 모델의 아날로그 시계 판독 정확도는 50.6%였고 인간 기준선은 90.1%였다. OSWorld에서는 AI agent가 운영체제 위의 실제 컴퓨터 작업을 수행하는 정확도가 약 12%에서 66.3%까지 올랐지만, 여전히 구조화된 benchmark에서도 세 번 중 한 번은 실패한다. ([Stanford HAI, Technical Performance](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance))

이 부분을 보면 AI가 어떤 영역에서는 엄청 똑똑해 보이지만, 다른 영역에서는 이상하게 기본적인 실수를 하는 이유를 어느 정도 이해할 수 있다.

제품에 AI 기능을 넣을 때도 마찬가지다. 어떤 기능에서는 사람보다 훨씬 좋은 결과를 보여주다가, 아주 기초적인 입력이나 edge case에서 이상한 실패를 할 수 있다. 그래서 AI 기능을 설계할 때는 다음 원칙이 중요해질 것 같다.

- AI 결과를 바로 실행하지 않고, 중요한 액션에는 confirmation을 둔다.
- 모델 출력은 domain rule로 한 번 더 검증한다.
- 실패했을 때 사용자가 직접 수정할 수 있는 UI를 둔다.
- AI가 알아서 해주는 구조보다 AI가 초안을 만들고 사람이 결정하는 구조에 가깝게 설계한다.

이건 UX 설계이기도 하고, 안전장치이기도 하다.

## AI 투자는 아직 식지 않았다

Economy 챕터에 따르면 2025년 글로벌 corporate AI investment는 전년 대비 130% 증가한 581.7 billion dollar를 기록했다. private investment는 344.7 billion dollar로 127.5% 증가했고, generative AI는 200% 이상 성장하며 private AI funding의 거의 절반을 차지했다. 미국의 private AI investment는 285.9 billion dollar로 중국의 12.4 billion dollar보다 23배 이상 컸다. ([Stanford HAI, Economy](https://hai.stanford.edu/ai-index/2026-ai-index-report/economy), [Shana Lynch, 2026](https://hai.stanford.edu/news/inside-the-ai-index-12-takeaways-from-the-2026-report))

투자 숫자를 보면 AI가 단기 유행으로 끝날 가능성은 낮아 보인다. 물론 버블이 섞여 있을 수는 있다. 하지만 회사들이 실제로 AI 제품, 인프라, 데이터, 인재에 돈을 쓰고 있다는 건 분명하다.

개발자 입장에서는 이걸 이렇게 해석할 수 있다.

- AI 기능이 들어간 제품이 더 많아진다.
- 기존 서비스에도 요약, 검색, 추천, 자동화, 챗봇 기능이 붙는다.
- 프론트엔드와 백엔드는 모델과 사용자를 연결하는 인터페이스가 된다.
- AI 기능을 잘 설계하고 운영하는 개발자의 수요가 생긴다.

즉 AI를 연구하는 사람이 아니더라도, AI를 제품에 연결하는 개발자는 점점 더 필요해질 수 있다.

## 노동시장 변화는 특히 주니어에게 먼저 올 수 있다

가장 민감한 부분은 일자리다.

2026 AI Index는 소프트웨어 개발자 22-25세 고용이 2024년 이후 거의 20% 감소했다고 정리한다. 또한 survey 응답 조직의 3분의 1은 향후 1년 안에 workforce reduction을 예상했다. 다만 리포트는 아직 overall employment data에서 대규모 실업이 나타난 것은 아니라고 선을 긋는다. ([Stanford HAI, Economy](https://hai.stanford.edu/ai-index/2026-ai-index-report/economy))

솔직히 이 부분은 좀 무섭게 느껴졌다. AI가 개발자를 바로 대체한다는 식으로 단순하게 볼 문제는 아니지만, 신입 개발자가 처음 맡던 일의 일부가 AI로 빠르게 대체될 수 있다는 점은 꽤 현실적으로 다가온다.

다만 미국 쪽 데이터를 보면 또 다른 흐름도 있는 것 같다. 내가 미국주식 블로그에서 정리했던 시타델 리포트 쪽은 전체 고용이 정체된 와중에도 AI 개발자와 소프트웨어 엔지니어 채용이 늘어난다는 쪽에 가까웠다. (30초 미주, 시타델 리포트 정리) 결국 개발자 수요가 그냥 사라진다기보다는, 신입 개발자에게 기대하던 일과 AI를 다룰 수 있는 개발자에게 기대하는 일이 갈라지고 있는 것 같다.

나는 이걸 개발자가 끝났다는 식으로 읽지는 않는다.

다만 신입 개발자의 시장 진입 난이도는 올라갈 수 있다고 본다. AI가 boilerplate 코드, 간단한 버그 수정, 문서 작성, 테스트 초안, UI 초안 등을 잘 처리하면, 회사 입장에서는 주니어에게 기대하던 일부 업무가 자동화될 수 있다.

그러면 개발자는 더 빨리 다음 단계 역량을 보여줘야 한다.

- 주어진 ticket을 구현하는 수준을 넘어 문제를 정의하는 능력
- AI output을 검토하고 production 수준으로 다듬는 능력
- 서비스 전체 구조와 데이터 흐름을 설명하는 능력
- 성능, 보안, 장애 상황까지 고려하는 능력
- 비개발자와 요구사항을 맞추고 제품 판단을 하는 능력

개발자에게는 단순히 구현만 하는 사람에서 제품 경험과 시스템 품질을 같이 보는 사람으로 포지션을 넓히는 게 중요해질 것 같다.

## AI 기능은 인프라와 비용 문제이기도 하다

AI가 제품 안에 들어온다고 해서 모든 것이 클라이언트나 한 서버 안에서 해결되는 것은 아니다. 오히려 뒤쪽 인프라 의존성은 더 커진다.

Research and Development 챕터에 따르면 2025년 글로벌 AI compute capacity는 2022년 이후 연 3.3배씩 성장해 17.1 million H100-equivalents에 도달했다. 미국은 5,427개의 data center를 보유해 다른 어떤 국가보다 많고, TSMC는 leading AI chip 대부분을 제조하는 핵심 병목으로 언급된다. ([Stanford HAI, Research and Development](https://hai.stanford.edu/ai-index/2026-ai-index-report/research-and-development))

일반 개발자 입장에서는 이 숫자가 멀게 느껴질 수 있다. 하지만 제품 관점에서는 꽤 직접적일 수 있다.

AI 기능을 제품에 붙이면 결국 아래 내용을 같이 봐야만 한다.

- 클라이언트에서 처리할지 서버 API를 사용할지
- 개인정보가 포함된 입력을 어디까지 외부로 보낼 수 있는지
- 사용자가 늘어났을 때 추론 비용을 감당할 수 있는지
- 응답 지연이 UX를 망치지 않는지
- 모델 제공사가 바뀌었을 때 구조를 갈아엎지 않아도 되는지

예전에는 API만 잘 붙이면 되는 기능도 많았다. 이제는 AI 기능 하나를 넣어도 compute cost, latency, privacy, fallback, observability를 같이 봐야 한다. 특정 영역만 보는 개발자보다 제품과 인프라를 함께 이해하는 개발자가 더 강해질 수 있다는 뜻이기도 하다.

## 책임 있는 AI는 성능보다 늦다

Responsible AI 챕터를 보면 조금 찝찝한 부분도 있다. capability benchmark 보고는 활발하지만, responsible AI benchmark 보고는 여전히 부족하다. AI Incident Database에 기록된 incident는 2024년 233건에서 2025년 362건으로 늘었다. Foundation Model Transparency Index의 평균 점수도 2024년 58에서 2025년 40으로 떨어졌다. ([Stanford HAI, Responsible AI](https://hai.stanford.edu/ai-index/2026-ai-index-report/responsible-ai))

성능은 올라가는데 투명성과 안전성은 같이 올라가지 않는다.

이건 개발자에게도 남의 일이 아니다. AI 기능이 제품에 들어가면 사용자는 그것을 모델 회사의 기능이 아니라 해당 제품의 기능으로 경험한다. 요약이 틀리거나, 추천이 편향되거나, 민감한 정보를 잘못 처리하면 최종 책임은 제품 경험에 남는다.

제품을 만들 때는 특히 이런 부분이 신경 쓰인다.

- 개인정보가 포함된 입력을 모델 API로 보낼 때의 동의와 고지
- 사용자가 AI 결과와 사람이 작성한 결과를 구분할 수 있는지
- AI 추천이 중요한 결정을 유도하지 않는지
- 틀린 결과를 수정하거나 신고할 수 있는지
- 모델 출력이 로그에 남을 때 민감정보가 섞이지 않는지

이제 AI 기능은 단순한 API 호출이 아니라 제품 리스크가 된다.

## 사람들은 AI를 기대하면서도 불안해한다

Public Opinion 챕터를 보면 전 세계적으로 AI 제품과 서비스가 단점보다 장점이 많다고 보는 비율은 2024년 55%에서 2025년 59%로 올랐다. 동시에 불안하다고 답한 비율도 52%로 증가했다. AI 전문가와 미국 대중의 시각 차이도 크다. 전문가의 73%는 AI가 사람들의 업무 방식에 긍정적 영향을 준다고 봤지만, 미국 대중은 23%만 그렇게 봤다. ([Stanford HAI, Public Opinion](https://hai.stanford.edu/ai-index/2026-ai-index-report/public-opinion))

사용자는 AI를 기대하면서도 불안해한다.

이걸 UX로 풀어야 한다. AI 기능을 크게 홍보하는 것보다, 사용자가 통제감을 느끼게 만드는 쪽이 더 중요해 보인다.

- AI가 무엇을 했는지 보여준다.
- 사용자가 적용 전 확인할 수 있게 한다.
- 되돌리기, 수정하기, 재생성하기를 쉽게 만든다.
- 민감한 영역에서는 자동 실행보다 제안 형태로 둔다.
- AI가 판단했다는 느낌보다 AI가 도와줬다는 경험을 만든다.

제품에서는 이런 디테일이 신뢰를 만든다. AI가 끼어드는 순간을 조심스럽게 설계해야 한다.

## 그래서 나는 뭘 준비해야 할까

2026 AI Index를 읽고, 개발자로서 준비해야겠다고 느낀 것은 대략 이 정도다.

먼저 AI API를 실제 기능으로 연결하는 작은 프로젝트를 꾸준히 만들어봐야겠다. 단순 챗봇보다 실제 문제에 붙여보는 게 좋다. 예를 들면 개인 메모 요약, 소비 내역 분류, 운동 기록 피드백, 이미지 기반 입력 보조 같은 것들이다.

그리고 evaluation을 공부하려고 한다. AI 기능은 동작한다는 것만으로 부족하다. 정확도, 실패율, 지연 시간, 비용, 사용자 수정률, 재시도율을 봐야 한다.

개인정보와 보안 기준도 다시 봐야 한다. 권한, 저장소 암호화, network logging, analytics event 설계가 AI 기능과 만나면 더 민감해진다.

UX 패턴도 따로 모아볼 생각이다. AI suggestion, streaming response, regenerate, citation, confidence, human confirmation 같은 패턴은 앞으로 자주 보게 될 것 같다.

마지막으로 backend와 data 쪽 이해를 넓혀야겠다. 특정 클라이언트나 화면 구현만으로는 AI 제품을 끝까지 책임지기 어렵다. RAG, embedding, vector search, prompt versioning, model routing 같은 개념은 최소한 대화할 수 있을 정도로 알아야 한다.

## 마무리

2026 AI Index는 AI가 얼마나 대단해졌는지를 보여주는 리포트이기도 하지만, 동시에 아직 얼마나 불안정하고 불투명한지도 보여준다.

나는 여기서 기회를 본다. AI 모델을 직접 만드는 사람이 아니어도(사실 그럴 능력은 안됨), AI를 사용자가 믿고 쓸 수 있는 제품 경험으로 바꾸는 일은 여전히 개발자의 영역이다.

앞으로의 개발자는 UI를 만들고 API를 붙이는 것에서 더 나아가, AI의 실패와 불확실성을 제품 안에서 다루는 역할을 하게 될 것 같다. 그래서 지금 준비해야 할 것은 AI가 내 일을 뺏을까만 고민하는 것이 아니라, AI가 들어간 제품을 내가 얼마나 잘 만들 수 있을지 직접 실험해보는 일이라고 생각한다.

## 참고

- [Stanford HAI - The 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report)
- [Stanford HAI - Research and Development](https://hai.stanford.edu/ai-index/2026-ai-index-report/research-and-development)
- [Stanford HAI - Technical Performance](https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance)
- [Stanford HAI - Economy](https://hai.stanford.edu/ai-index/2026-ai-index-report/economy)
- [Stanford HAI - Responsible AI](https://hai.stanford.edu/ai-index/2026-ai-index-report/responsible-ai)
- [Stanford HAI - Public Opinion](https://hai.stanford.edu/ai-index/2026-ai-index-report/public-opinion)
- [Stanford HAI - Inside the AI Index: 12 Takeaways from the 2026 Report](https://hai.stanford.edu/news/inside-the-ai-index-12-takeaways-from-the-2026-report)
