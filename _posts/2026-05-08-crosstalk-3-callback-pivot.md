---
layout: post
title: "[AI Agent] Crosstalk 만들기 - 3편: 똑똑한 폴링보다 멍청한 콜백이 낫다"
subtitle: "Polling을 버리고 Callback으로 — Crosstalk v0.2 회고"
date: 2026-05-08 21:00:00 +0900
categories: til
tags: claude-code cmux multi-agent crosstalk callback polling refactor postmortem
comments: true
---

# v0.1.0이 가장 좋았다

[2편](/2026/05/08/crosstalk-2-plugin-packaging)까지 패키징을 끝내고 v0.1.6까지 잘 굴러갔다. 그런데 어느 순간 깨달았다.

> *기능을 붙일수록 본질이 사라졌다.*

v0.1.0 PoC 시점이 가장 깔끔한 토론기였다. 화면에 답변이 나오면 사회자(Claude)가 직접 보고 다음 사람한테 넘기는 *진짜 핑-퐁*. 그런데 v0.1.4에서 transport 도입, v0.1.5에서 활동 감지, v0.1.6에서 i18n까지 보강한 끝의 v0.1.6 토론은 *transport 프로토콜 따라가기 게임*이 되어 있었다.

3편은 그 *과한 보강의 함정*을 어떻게 인식했고 어떻게 풀었는지 회고. 결과적으로는 v0.2.0에서 메이저 변경으로 가야 했다.

## 첫 함정 — 긴 답변이 잘렸다

1편 한계점에서 적었던 그것. `cmux read-screen`이 화면에 보이는 영역만 캡처하니까, 답변이 길면 위쪽이 스크롤로 사라진다.

처음엔 *답변 길이를 한 단락으로 제한*해서 회피했다. 근데 PR 리뷰처럼 본문이 결정적으로 중요한 토론에선 한 단락으로 못 줄인다. 그래서 v0.1.4에서 **파일 기반 transport**를 도입했다.

```
═══ Transport (변경 불가) ═══
이 턴의 답변은 화면이 아니라 파일에 기록한다.

1. 답변 본문 전체를 다음 파일에 그대로 써라:
     ${RUN_DIR}/responses/<agent>-r<NN>-a<N>.md
2. 파일 작성이 끝나면 화면(터미널)에 정확히 한 줄을 출력해라:
     DONE <MSG_ID>
3. 파일 외에 추가 가공/요약/박스 출력은 하지 마라.
```

각 AI는 답변 본문을 파일에 쓰고, 화면에는 `DONE <msg-id>` 한 줄만. 사회자는 bridge `wait-turn` 으로 파일 안정성 + DONE 마커를 폴링하다가 둘 다 잡히면 *clean* 상태로 종료. attempt id, run id, msg-id 같은 식별자도 도입했다.

이게 잘 동작했다. *본문 잘림 문제는 해결*. 그런데 새로운 문제들이 줄줄이 나왔다.

## 두 번째 함정 — Gemini가 WriteFile 도구를 호출했다

`/crosstalk:debate 비 오는 날 국밥 어때?` 쳤더니 Gemini 화면이 이랬다.

![Gemini가 WriteFile 도구로 답변 파일을 4번 덮어쓰는 화면](/img/in-post/crosstalk-gemini-writefile-fail.png)
> WriteFile gemini-r01-a1.md → Accepted 가 줄줄이. 답변을 파일에 쓰라고 했더니 *진짜로* WriteFile 도구를 호출하고, 답을 바꿀 때마다 같은 파일을 덮어씀.

같은 파일을 4번 덮어썼다. 답변이 [AGREE] → [DISAGREE] → [DISAGREE] → 어쩌고 식으로 매번 바뀜.

원인 두 개:

1. **Gemini는 agentic CLI다.** "파일에 답변을 쓰라"고 하면 모델이 *진짜 WriteFile 도구를 호출*한다. claude/codex는 메시지 텍스트로만 출력하는데 (도구 사용을 보수적으로), gemini는 자기가 사고 처리해서 도구 사용. 화면에 diff/Accepted 로그가 가득.
2. **Enter 한 번이 두 번처럼 동작.** paste-bracket 우회용으로 Enter를 두 번 보내고 있었는데, gemini-cli는 두 번째 Enter를 *별도 submit*으로 받아서 *같은 메시지를 두 번 처리*. 그래서 답변 4번 출력.

해결은 두 트랙.

```bash
# (1) gemini는 Enter 1번만
case "$KIND" in
  codex|claude)
    sleep 0.5
    cmux send-key --surface "$SURFACE" enter   # 두 번째 Enter
    ;;
  gemini)
    : # 1번이면 충분. 두 번째 Enter가 별도 submit으로 처리됨.
    ;;
esac

# (2) gemini는 file 대신 screen 모드
[file — claude/codex]
파일에 본문 + 화면에 DONE 마커.

[screen — gemini]
파일 X, WriteFile/Shell 도구 X.
화면에 정확히 한 번만:
  CROSSTALK_BEGIN <MSG_ID>
  <답변 본문>
  CROSSTALK_END <MSG_ID>
```

bridge가 화면에서 `BEGIN/END` 사이를 추출해 파일로 저장하는 구조. AI 입장에선 *그냥 텍스트 출력*이라 도구 사고 안 남.

## 세 번째 함정 — Gemini는 답변이 늦었다

Gemini는 응답 시작이 *느린 케이스*가 잦았다. 30초+ 걸리는 경우가 흔한데, MAX_WAIT 안에 답이 안 오면 사회자가 *timeout? 재시도?* 를 띄웠다. 사용자가 "재시도"를 누르면 attempt 2 메시지를 보내는데, 그 사이 attempt 1 답변이 늦게 도착해서 두 답변이 동시에 떠다니는 사고.

해결도 두 트랙.

1. **agent별 MAX_WAIT 차등** — gemini=360s, codex=240s, claude=180s. 처음부터 충분히 잡고 시작.
2. **활동 감지 자동 연장** — 화면/파일에 변화가 *최근 30초 안에* 있으면 *살아있는 한* 자동으로 60초씩 연장 (최대 3회). Gemini가 답변 시작이 늦어도 살아있으면 안 죽임.

```bash
ACTIVITY_GRACE=30 ACTIVITY_EXTEND_BY=60 ACTIVITY_EXTEND_MAX=3
```

이걸로 timeout 사고는 거의 사라졌다.

### 잠깐 — Gemini는 그냥 포기해야 하나

이쯤 굴리다 보니 *Gemini는 아예 빼고 가는 게* 합리적이지 않나 싶었다. WriteFile 사고, 답변 두 번 출력, 응답 시작 늦음, 다른 CLI랑 다른 paste-bracket 동작 — 사고 절반이 gemini-cli 관련이었다.

다만 이게 *gemini-cli가 못 만들어졌다*기보다는 **목적이 다른 도구**라서 그런 측면이 크다. claude/codex는 *대화형으로 도구를 점진적으로* 쓰는 결인데, gemini-cli는 처음부터 *agentic 행동을 능동적으로* 하도록 만들어진 느낌. "파일에 답변 써라" 같은 요청에 *진짜로 WriteFile 도구 호출 + diff 표시*하는 게 그 도구의 본 의도에 가깝다. 다만 *토론기처럼 결정적 동작이 필요한 시나리오*에선 그 능동성이 거꾸로 작용했다.

구글 내부에서도 코딩 워크플로우의 주력 채널은 **Gemini Code Assist**(IDE), **Jules**(자율 에이전트), **Vertex AI** 같은 쪽이고 gemini-cli는 그 사이의 *경량 채널*에 가까워 보인다. 그래서 *cmux 같은 터미널 자동화* 환경에 가장 잘 맞는 도구는 아닐 수 있다 — *모델*이 아니라 *CLI 레이어*가 우리 시나리오랑 안 맞는 정도.

지금은 일단 Gemini도 같이 살리는 방향으로 잡아뒀다. 의견의 *제3자 시각*이 있는 게 토론 자체에 좋고, 사용자가 빼고 싶으면 `/crosstalk:launch`에서 codex만 띄우는 옵션도 있다. 다만 *기본 추천 구성에서 gemini를 제외*하는 건 v0.3.x쯤 진지하게 검토해볼 듯.

## 그런데 본문이 transport에 묻혔다

세 함정을 다 잡고 나서 v0.1.6을 굴려봤다. 사용자 화면이 이렇게 떴다.

```
> [Crosstalk safe mode]
  We will debate this topic: 비 오는 날 국밥
  
  Rules:
  1. Reply with one paragraph...
  2. Do not modify files... 
     One exception: each turn's Transport section may allow writing exactly one response file.
  ...
  
  ═══ 페르소나 (default) ═══
  ...
  
  ═══ 토론 규칙 (default) ═══
  ...
  
  ═══ 시스템 규칙 (변경 불가) ═══
  - 합의 시 [AGREE]
  - 이견 시 [DISAGREE: 사유]
  
  ═══ Transport (변경 불가) ═══
  파일에 쓰지 마라. WriteFile/Shell 같은 도구를 사용하지 마라.
  화면(터미널)에 아래 형식으로 정확히 한 번만 출력하라.
    CROSSTALK_BEGIN run-K4iN-r01-gemini-a1
    <답변 본문 한 단락>
    CROSSTALK_END run-K4iN-r01-gemini-a1
  그 외 텍스트(요약, 박스, 진행 상황)는 출력하지 마라.
  같은 답변을 여러 번 출력하지 마라.
```

매 턴 메시지가 페르소나 + 룰 + 시스템 + Transport 섹션으로 가득. 답변 본문이 들어갈 자리는 마지막 한 줄.

AI 입장에선 *프로토콜 따라가기*에 인지 자원 다 쓰고 *내용*에는 적게 쓴다. instruction following이 안 되거나, 답변이 *형식만 맞고 내용은 빈약*해진다. 토론은 *진짜 핑-퐁*이 아니라 *프로토콜 검증* 같았다.

사용자 화면에도 BEGIN/END/DONE 마커가 가득하고, gemini는 가끔 transport 무시하고 화면에 답변 그대로 적어버려서 사회자가 *protocol-error 분기 → 재시도 → 또 사고* 의 굴레.

이게 *내가 처음에 만들고 싶었던 토론*인가? 1편의 v0.1.0이 더 깔끔했다. 화면에 답변이 나오고, 사회자가 보고, 다음 사람한테 넘기고. 단순.

## 깨달음 — 한 마디

v0.1.6까지 굴리다가 어느 순간 정리됐다.

> *"내가 명령어 떄릴 거면 이거 안 만들지. 지네들끼리 핑퐁해야 하는데..."*

v0.1.4 ~ v0.1.6의 토론 시스템은 *사회자(Claude)가 wait-ping/wait-turn으로 무한 폴링*하는 구조였다. 사회자 bash 프로세스가 살아있어야 동작하고, 폴링하는 동안 사용자가 다른 거 시키면 *흐름이 깨짐*. 한 번 깨지면 사회자가 *어디까지 했는지 모르고* 멈춰버림.

다른 말로: **사회자를 *답을 기다리는 주체*로 만든 게 잘못이었다.** 사회자는 *답이 도착했을 때 깨어나는 주체*가 되어야 했다.

## v0.2.0 — 폴링 버리고 콜백으로

새 구조는 단순했다.

1. 사회자(Claude): 한 라운드만 메시지 보내고 → 슬래시 커맨드 종료. idle.
2. AI(codex/gemini): 답변 출력 → bridge ping 한 줄 호출.
3. bridge ping: manifest에서 사회자 surface 찾아 cmux send로 사회자 pane 입력.
4. 사회자(Claude): callback 메시지를 새 사용자 입력으로 받음 → 다음 라운드 자동 진행.
5. 반복.

핵심 변경 두 가지.

**1. `start-run`이 manifest에 사회자 surface 저장**
```json
{
  "run_id": "K4iN",
  "moderator_surface": "surface:1",
  ...
}
```

**2. `bridge ping`이 manifest 읽고 cmux send로 사회자 pane 깨움**
```bash
~/.claude/scripts/crosstalk_bridge.sh ping <RUN_ID> <AGENT> <ROUND>
   ↓
[crosstalk] codex R3 done — RUN_ID=K4iN. 답변은 cmux pane 화면에서 캡처해서 정리하고 다음 라운드 진행해.
   ↓ (사회자 pane 입력창에 박힘)
```

사회자 pane은 그 메시지를 *새 사용자 입력*으로 받고, debate.md 본문대로 *callback 핸들링*에 진입.

![callback 메시지가 claude pane 입력창에 박힌 직후 다음 단계 진행](/img/in-post/crosstalk-callback-pane.png)
> codex 답변이 끝나자마자 `[r40 done] ...` 한 줄이 사회자 pane에 도착 → Claude가 *받자마자* 다음 단계 진입

AI 입장에서는 한 줄.

```bash
~/.claude/scripts/crosstalk_bridge.sh ping K4iN codex 3
```

경로/포맷 외울 필요 없고, AI가 답변 출력 직후 한 번 호출하면 끝.

## Polling vs Callback — 비교

| | Polling (v0.1.x) | Callback (v0.2.0) |
|---|---|---|
| 사회자 bash 프로세스 | 살아있어야 함 | idle OK |
| 사용자가 중간에 개입 | 흐름 깨짐, 복구 어려움 | 깨져도 ping 도착 시 자연 재진입 |
| 메시지 헤더 분량 | 매 턴 페르소나+룰+transport 풀 셋업 | preamble 한 번 + 이후 짧은 follow-up |
| 답변 캡처 방법 | 파일 transport + DONE 마커 | 화면 그대로 + 사회자가 후처리 |
| AI 부담 | 프로토콜 따라가기 (BEGIN/END/DONE) | 답변 출력 + ping 한 줄 |
| 가장 흔한 실패 | gemini WriteFile / 답변 두 번 / timeout | ping을 안 보내면 사회자 idle (수동 ping으로 unblock) |

callback 흐름은 *답을 잘 받기 위한 휴리스틱*이 거의 필요 없다. 화면에 답이 와있고, ping이 *왔다*는 신호가 오면 그게 진실. 폴링/안정성/timeout 추정 다 폐기.

다만 *하나는 남았다*: AI가 ping을 안 보내면 사회자는 idle인 채로 영영 안 깨어남. 이건 자동 timeout으로 해결하면 *원래 polling 구조로 회귀*하는 거니까 안 했다. 대신 사용자가 *수동 ping*으로 unblock 가능.

```bash
# 수동 ping — codex가 답은 줬는데 ping 안 보낸 경우
~/.claude/scripts/crosstalk_bridge.sh ping K4iN codex 3
```

## 교훈

**1. 신호 받는 방법이 본문을 잡아먹지 않게 할 것**

v0.1.4 transport는 *답을 안전하게 받기 위한* 메커니즘이었다. 그런데 그 메커니즘이 *매 턴 메시지의 절반 이상*을 차지하면서 본문(토론 내용)을 압도했다. 신호는 *조용해야* 한다 — 메시지 본문 옆이 아니라 *별도 채널*로.

callback의 ping은 메시지 본문에 안 들어간다. AI는 답변만 출력하고, 끝나면 한 줄 호출. 메시지 본문에는 *주제와 직전 답변 한 줄 인용*만.

**2. 휴리스틱 위에 더 정교한 휴리스틱 쌓지 말 것**

화면 안정성으로 답변 완료를 추정 → 안정성 휴리스틱이 부정확 → 활동 감지 자동 연장 → 그것도 부정확 → 더 정교한 폴링... 이 사이클은 *근본 가정이 잘못된* 신호.

근본 가정은 *사회자가 답을 추측한다*였다. 그걸 *AI가 신호를 명시적으로 준다*로 바꾸자 휴리스틱이 다 사라졌다.

**3. v0.1.0이 좋았던 이유: 기능이 적어서 단순했음**

기능을 늘릴 때마다 *없앨 수 있는 가정*도 같이 봐야 했다. v0.1.4의 transport는 *긴 답변 잘림*이라는 가정 하나를 풀려고 *답변을 어디에 어떻게 쓸지* 라는 새 가정 다섯을 도입했다. 가정이 늘면 실패 모드도 늘고, 그걸 막으려고 코드가 늘고...

v0.2.0 callback은 *전부 화면에 답이 떠있다*는 v0.1.0의 가정으로 회귀했다. 다만 *사회자를 깨우는 방법*만 polling → callback으로 바꿨다. 작은 변경 + 큰 효과.

## 마치며

v0.2.0 푸시 후 첫 토론을 돌려봤다. 메시지 한 통 보내고 슬래시 커맨드 종료. 사회자 pane은 idle. 잠시 후 *codex pane에서 답변 출력 → ping 호출* → claude pane에 callback 메시지 도착 → 자동으로 다음 라운드 시작.

처음 본 그 흐름이 *정확히 1편의 v0.1.0에서 보던 그 흐름*이었다. *진짜 핑-퐁*. 화면이 깨끗하고, 메시지가 짧고, 사용자(나)도 중간에 끼어들어 *코덱스가 그건 좀 비약 같다, 다른 각도로 다시* 같이 *진짜 사회자처럼* 행동할 수 있다.

transport 옵션은 남겨뒀다 — `--transport file` 또는 `--transport screen`으로 *명시적으로 켤 때만* 사용. 긴 PR 리뷰 토론처럼 *답변 본문이 결정적*인 케이스에서는 여전히 유용. 단 기본은 *off*다.

```
v0.1.0 (PoC)        — 화면 캡처. 단순. 좋았음.
v0.1.4 ~ v0.1.6     — transport 보강. 본문 묻힘. 잘못된 길.
v0.2.0 (current)    — callback + 화면 캡처. v0.1.0의 가정 + ping callback. 회귀이자 진화.
```

다음 단계로 검토 중인 것:

- Codex CLI 사회자 모드 — 양방향 callback
- tmux 어댑터 — cmux 의존 제거
- 라운드 로그 영구 저장 — `~/Documents/crosstalk/<날짜>/`

특별히 새 함정이 또 나오기 전까지는 v0.2.x 안에서 정리할 예정.

레포: [github.com/dongsik93/crosstalk](https://github.com/dongsik93/crosstalk)

---

3편 시리즈를 마치며. *기능을 늘릴 때 가정도 같이 보기* — 이게 이번 회고의 한 줄이다. 다음에 또 비슷한 함정에 빠질 텐데, 그때는 조금 더 빨리 깨닫게 될 것 같다.

## 참고 링크

- [crosstalk 레포](https://github.com/dongsik93/crosstalk) — v0.2.0 소스
- [1편: Claude + Codex + Gemini, 셋이서 토론하는 슬래시 커맨드](/2026/05/07/crosstalk-1-multi-agent-debate)
- [2편: Claude Code 플러그인으로 패키징하기](/2026/05/08/crosstalk-2-plugin-packaging)
