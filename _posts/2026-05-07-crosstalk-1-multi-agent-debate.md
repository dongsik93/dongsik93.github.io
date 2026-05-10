---
layout: post
title: "[AI Agent] Crosstalk 만들기 - 1편: Claude + Codex + Gemini, 셋이서 토론하는 슬래시 커맨드"
subtitle: "구독제 그대로 쓰면서 멀티 에이전트 토론장 만들기 (cmux + /fight)"
date: 2026-05-07 12:00:00 +0900
categories: til
tags: claude-code codex gemini cmux multi-agent slash-command tmux mcp crosstalk
comments: true
---

# 시작은 단순한 의문이었다

요즘 코딩할 때 Claude Max, Codex Pro, Gemini Pro 세 개를 다 구독해서 쓰고 있다. 각 모델 강점이 달라서 작업 종류마다 골라 쓴다.

- Claude: 긴 컨텍스트, 코드 리팩토링
- Codex (GPT-5.5): 추론, 알고리즘
- Gemini 3 Pro: 멀티모달, 큰 코드베이스 분석

근데 어느 날 문득 이런 생각이 들었다.

> *얘네 셋이 같이 토론하면 더 좋은 결론이 나오지 않을까?*

PR 리뷰처럼 한 사람 의견에 갇히고 싶지 않은 작업이 종종 있고, 안드로이드 신규 프로젝트 Compose 대 XML 같은 결정 문제도 셋의 의견을 다 듣고 싶었다. 그래서 만들어봤다.

![AI 셋이서 토론하는 모습](/img/in-post/ai-fight-debate.gif)
> *Claude(사회자) + Codex + Gemini 다자 토론 — `/fight` 한 번으로 자동 진행*

## 첫 시도, claude-octopus 헤드리스 토론

처음엔 [claude-octopus](https://github.com/nyldn/claude-octopus)를 썼다. Claude Code 안에서 여러 모델을 한 번에 호출해 답을 받아오는 도구. *주제 던지면 모델별 답변을 모아서 종합 의견까지* 자동으로 만들어줘서, 처음엔 내가 원했던 게 이거 같았다.

근데 며칠 쓰다 보니 점점 *답답함*이 쌓였다.

CLI 환경에서 AI를 직접 띄워 쓰는 진짜 가치는 **추론 과정을 옆에서 보면서 개입할 수 있다는 점**이다. Claude가 어떤 파일을 먼저 읽는지, Codex가 어떤 가정을 깔고 결론을 내는지, Gemini가 무엇을 빠뜨렸는지 — 이게 다 화면에 뜨는 게 CLI다. 헤드리스 도구는 *최종 종합*만 던져주고 그 뒤 사고 흐름은 블랙박스다. 결론이 미덥지 않아도 *왜* 그렇게 나왔는지 모르니 후속 질문을 던질 곳이 없다.

내가 원했던 건 한 줄로 정리됐다.

> *토론을 자동화한 헤드리스 도구*가 아니라, **각 AI의 사고 과정을 그대로 보면서 내가 사회자로 끼어들 수도 있는** 토론.

그러려면 셋이 동시에 *내 화면에 띄워져* 있어야 한다. 헤드리스 호출이 아니라 진짜 인터랙티브 CLI 세 개가 옆에 나란히. 거기서부터 다시 도구를 찾기 시작했다.

## PAL MCP의 clink — visible 호출의 첫 단추

처음 발견한 건 [PAL MCP 서버](https://github.com/BeehiveInnovations/pal-mcp-server)였다. Claude Code에서 다른 AI CLI를 호출하는 `clink` 도구가 있는데, 코드 리뷰 같은 작업을 다른 모델에 맡기고 결과만 받아올 수 있었다.

그런데 곧 한계가 보였다.

PAL의 다른 도구들(`chat`, `consensus`, `thinkdeep`)은 API 키 기반이라 종량제 과금이다. 구독제 그대로 활용 가능한 건 `clink` 하나뿐이었다. clink는 CLI를 직접 띄워서 결과를 받아오는 구조라 구독제로 동작한다.

```
[Claude Code] → MCP 호출 → [PAL] → 자식 프로세스(codex CLI) → [Codex Pro 구독]
```

clink 자체는 훌륭한 도구지만, 두 모델을 **자동으로 토론시키는** 기능은 없었다. 1회성 호출만 가능. 자동 토론을 원하면 직접 만들어야 했다.

## 멀티플렉서 선택, cmux

자동 토론을 만들려면 두 CLI를 나란히 띄워두고 외부에서 텍스트를 주입해야 한다. 처음엔 tmux를 떠올렸다.

```bash
tmux send-keys -t fight:0.1 '안녕' Enter
tmux capture-pane -t fight:0.1 -p
```

tmux도 충분히 가능했지만, 검색하다가 [cmux](https://github.com/manaflow-ai/cmux)라는 macOS 전용 멀티플렉서를 발견했다. *AI 에이전트를 여러 pane에 띄워 운용하는 시나리오*를 1순위로 두고 만들어진 도구다. Ghostty 설정을 그대로 활용하고, hook과 멀티 에이전트 명령(`claude-teams` 등)을 자체 제공한다.

cmux의 장점은 분명했다.

- 정식 CLI/Socket API (`cmux send`, `cmux read-screen`, `cmux send-key`)
- AI 응답 완료 감지 훅 (`cmux hooks setup`)
- `cmux claude-teams` 등 멀티 에이전트 명령 내장
- ANSI escape 처리를 cmux가 알아서 해줘 화면 캡처가 깔끔

```bash
$ cmux --help
Commands:
  list-pane-surfaces         # 모든 분할창 surface 목록
  send <surface> <text>      # 특정 surface에 텍스트 입력
  send-key <surface> <key>   # 특정 surface에 키 입력 (enter 등)
  read-screen <surface>      # 화면 텍스트 캡처
  ...
```

## /fight 슬래시 커맨드 설계

원하는 흐름은 이렇다.

```
[사용자]
> /fight 안드로이드 신규 프로젝트, Compose vs XML?

[Claude Code]
🔍 cmux pane 스캔...
  ✓ surface:4 → codex 감지
  ✓ surface:5 → gemini 감지

? 누구와 토론할까요?
  ○ codex (1:1)
  ○ gemini (1:1)
  ● 모두 (다자, Claude 사회자)
  ○ 취소

> [선택] 모두

━━━ Round 1/10 ━━━
🟦 Claude: ...
🟧 Codex: ...
🟪 Gemini: ...

(라운드 반복)

━━━ 종합 ━━━
🎯 결론: ...
```

구성 요소는 두 개다.

1. `~/.claude/commands/fight.md` — Claude Code 슬래시 커맨드 정의
2. `~/.claude/scripts/fight_bridge.sh` — cmux 통신 헬퍼

### bridge 스크립트 구조

```bash
$ ~/.claude/scripts/fight_bridge.sh
Usage: fight_bridge.sh {peer|list-peers|detect|send|capture|lines|wait|stop} [args...]
```

- `peer` — 본인 제외한 첫 번째 surface ID 반환
- `list-peers` — 본인 제외한 모든 surface와 각 CLI 종류
- `detect <surface>` — 화면 보고 어느 CLI인지 감지 (claude/codex/gemini)
- `send <surface> <text>` — 텍스트 와 Enter 전송
- `wait <surface> <since-line>` — 출력 안정될 때까지 대기, 새 텍스트 반환
- `stop <surface>` — Ctrl+C 전송 (긴급 정지)

## 구현하면서 만난 함정 3개

### 함정 1, CLI 자동 감지의 self-match 문제

각 surface가 어떤 CLI인지 알아야 사용자에게 codex와 토론, gemini와 토론 같은 옵션을 보여줄 수 있다. cmux는 surface ID와 작업 디렉토리만 줄 뿐, 거기 떠있는 CLI 종류는 모른다.

1차 시도는 `read-screen`으로 화면 내용 받아서 시그니처 패턴 매칭이었다.

```bash
if echo "$CONTENT" | grep -q 'OpenAI Codex'; then echo codex; ...
```

테스트 결과는 이랬다.

```
surface:1 → gemini   ❌ (실제로는 Claude Code)
surface:4 → codex    ✅
surface:5 → gemini   ✅
```

원인을 추적해보니 surface:1(Claude pane)에서 직전에 `cmux read-screen surface:5`로 Gemini 화면을 출력해본 적이 있었고, 그 출력이 화면에 텍스트로 남아있어서 self-match가 일어난 것이었다.

해결은 화면 본문을 무시하고 푸터(하단 8~20줄)만 스캔하는 것. CLI 푸터는 항상 화면 하단에 고정된다.

| CLI | 푸터 시그니처 |
|-----|--------------|
| Claude | `◐ medium · /effort`, `⏵⏵ accept edits on (shift+tab to cycle)` |
| Codex | `gpt-5.5 default ·`, `Token usage: total=` |
| Gemini | `GEMINI.md files`, `gemini-3-pro (default)` |

```bash
FOOTER=$(cmux read-screen --surface "$SURFACE" --lines 80 | tail -20)
if echo "$FOOTER" | grep -qE 'GEMINI\.md files'; then echo gemini
elif echo "$FOOTER" | grep -qE 'gpt-[0-9]+(\.[0-9]+)? default ·|Token usage:'; then echo codex
elif echo "$FOOTER" | grep -qE '◐ [a-z]+ · /effort|⏵⏵ accept edits on'; then echo claude
fi
```

3개 모두 정확히 분류됐다.

### 함정 2, Gemini의 paste-bracket

`send` 명령으로 Codex와 Claude는 문제없이 메시지가 전송됐는데 Gemini만 Enter가 안 먹혔다. 사용자가 추가로 Enter를 한 번 더 눌러야만 메시지가 전송됐다.

원인은 paste-bracket 모드였다. 텍스트가 한 번에 우다닥 들어오면 Gemini는 paste로 인식하고 Enter도 텍스트의 일부로 흡수한다. 두 번째 Enter는 새로 들어온 키 입력으로 인식해서 send 처리되는 식.

해결은 send 명령에서 상대가 Gemini면 Enter를 두 번 보내는 것이다.

```bash
cmux send --surface "$SURFACE" "$TEXT"
cmux send-key --surface "$SURFACE" enter
KIND=$("$0" detect "$SURFACE")
if [ "$KIND" = gemini ]; then
  sleep 0.3
  cmux send-key --surface "$SURFACE" enter   # 한 번 더
fi
```

### 함정 3, cmux JSON의 키 순서가 매번 다름

`cmux identify`로 본인 surface ID를 뽑는 부분에서 가끔 빈 값이 반환됐다. 처음엔 cmux 소켓 불안정으로 의심했는데, 알고 보니 JSON 키 순서가 호출마다 달랐던 게 원인이었다.

```json
// 어느 호출
"caller": {
  "surface_ref": "surface:1",
  "tab_ref": "tab:1",
  ...
}
// 다른 호출
"caller": {
  "tab_ref": "tab:1",
  "workspace_ref": "workspace:1",
  "is_browser_surface": false,
  "surface_ref": "surface:1",   // ← 4번째 줄
  ...
}
```

`grep -A1 '"caller"'` 패턴은 caller 다음 1줄만 보니까 surface_ref가 첫 줄이 아닐 때 빈 값을 반환했다. awk 기반으로 caller 블록 안의 surface_ref만 정확히 매칭하도록 고쳤다.

## 다자 토론 룰

다자 모드는 Claude를 사회자로 둔다.

1. 매 라운드마다 Codex와 Gemini에게 같은 질문 동시 전송
2. 둘의 답변과 Claude 본인 의견을 종합
3. 셋 다 [AGREE]면 합의 도달, 종료
4. 일부만 [AGREE]면 의견 차이 정리해서 다음 라운드 질문 생성
5. 최대 10라운드 (1:1은 15턴)

발언 길이는 한 단락(3-5문장)으로 제한. 토큰 절약과 핵심만 추리는 효과를 같이 본다.

## 실제로 돌려본 결과

주제는 안드로이드 신규 프로젝트 Compose 대 XML.

3라운드 만에 합의 도달했다.

```
━━━ Round 1/10 ━━━
🟦 Claude: 신규 프로젝트라면 Compose가 디폴트. 선언형 UI, 코드량 감소, ...
🟧 Codex: [AGREE] Compose 우선이 합리적. 단 학습 곡선과 일부 ...
🟪 Gemini: 동의하지 않는다. XML이 여전히 더 안정적이고 팀 ...

━━━ Round 2/10 ━━━
🟦 Claude: Gemini 우려에 일부 동의. 하지만 ...
🟧 Codex: 균형을 잡자면 ...
🟪 Gemini: Compose 전환 비용을 무시할 수 없다 ...

━━━ Round 3/10 ━━━
🟦 Claude: 통합안 — Compose 디폴트, 단 (a) XML 전문성과 일정 타이트, 
            (b) WebView/고성능 커스텀 렌더링 핵심이면 예외 허용.
🟧 Codex: [AGREE] 가장 현실적인 기준.
🟪 Gemini: [AGREE] 우려했던 전환 비용과 리스크가 구체적 조건으로 제어 가능.

🎯 결론: 신규 안드로이드 프로젝트의 디폴트는 Compose.
   단 (a) 팀이 XML 전문성만 보유하고 출시 일정이 매우 타이트할 때,
   (b) 앱 핵심이 WebView, AppWidget, 레거시 SDK 뷰, 고성능 커스텀 렌더링일 때
   는 합리적 예외.
```

흥미로운 점이 몇 가지 있었다.

- Gemini가 처음엔 보수적(XML 우선 주장)이다가 라운드 3에서 양보
- Codex는 빠르게 균형점 제시. 취향이 아니라 장기 유지비 대 단기 납기 리스크의 트레이드오프
- Claude는 사회자 역할에 충실 — 양측 의견을 종합해서 통합안 제시

각 모델의 *성격*이 보였다. 단순히 같은 답을 내는 게 아니라 의견 분포가 진짜 토론 같다.

## 한계점

만들고 나서 보이는 한계도 명확하다.

### macOS와 cmux에 종속됨

cmux 자체가 macOS 전용이다. Linux/Windows에선 tmux로 직접 옮겨야 하는데, tmux는 ANSI escape 파싱과 출력 안정 감지를 직접 처리해야 해서 코드가 더 길어진다. 크로스 플랫폼 지원하려면 추상화 레이어 한 단계 더 필요하다.

### 푸터 시그니처를 박아둔 점

CLI 감지 로직이 각 CLI의 푸터 텍스트(예: `GEMINI.md files`, `gpt-5.5 default ·`)를 정규식으로 매칭한다. 문제는 이 푸터 텍스트가 CLI 버전 업그레이드로 바뀌면 그대로 깨진다는 것이다.

지금은 Claude Code, Codex CLI, Gemini CLI 셋 다 활발히 개발 중이라 푸터 디자인이 자주 바뀐다. 이상적으론 cmux가 surface별로 실행 중인 프로세스 정보를 노출해주면 좋은데, 현재 cmux API에는 그런 게 없다. 차선책으로 사용자가 surface 이름을 직접 라벨링(예: `cmux rename-tab` 같은)하게 하는 방법도 있겠다.

### 전체 토론 결과가 저장되지 않음

토론 중 표시되는 라운드별 발언은 사용자에게 보여주기만 하고 디스크엔 안 남는다. 종합 의견까지 다 본 다음에 다시 보고 싶으면 cmux 스크롤백을 뒤져야 하는데, 화면 폭 제한 때문에 길면 잘려있다.

`--save debate.md` 같은 옵션으로 라운드별 발언을 마크다운으로 누적 저장하는 기능이 필요하다. 블로그 글감으로 모으거나, 나중에 의사결정 근거로 다시 보려면 필수.

### 답변이 매우 길면 화면 위쪽이 스크롤되어 잘림

`read-screen`이 현재 보이는 화면만 캡처해서, 한 발언이 길면 위쪽이 스크롤로 사라진다. 지금은 발언당 한 단락(3-5문장)으로 제한해서 회피하는데, 본문이 결정적으로 중요한 토론에선 스크롤백 옵션을 활용해야 한다.

### 새 CLI 추가할 때마다 케이스별 디버깅

Gemini의 paste-bracket처럼 CLI마다 입력 처리 방식이 미묘하게 다르다. Qwen Code, Aider, OpenCode 같은 다른 CLI를 추가하면 또 새로운 우회 트릭이 필요할 가능성이 높다.

### 각 CLI 안에서 일어나는 동작을 제어할 수 없음

이게 가장 큰 한계다. `/fight`는 토론을 위해 메시지를 주고받는 정도까지만 다룬다. 그런데 Claude Code, Codex CLI, Gemini CLI는 단순 채팅 도구가 아니라 각자 도구를 호출하고, 파일을 읽고, 셸 명령을 실행하는 에이전트다. 토론 도중에 상대 AI가 갑자기 파일을 수정하거나 빌드를 돌리거나 외부 API를 호출해도 막을 방법이 없다.

예를 들어 Codex에게 *이 PR의 보안 리스크를 토론해줘*라고 보냈을 때, Codex가 토론 답변만 주는 게 아니라 진짜로 PR 파일을 열고 grep을 돌리고, 심지어 파일을 수정해버릴 수도 있다. 각 CLI의 권한 설정(approval mode, sandbox)이 토론 컨텍스트와 무관하게 그대로 적용되는 것이다.

이상적으론 토론 모드에 들어갔을 때 모든 참여 CLI를 *읽기 전용 + 토론만*으로 일시 전환할 수 있어야 한다. 하지만 cmux를 통한 키 입력만으로는 그런 모드 전환이 불가능하다. 각 CLI가 토론용 안전 모드를 노출해주거나, 토론 시작 시 권한을 명시적으로 잠그는 명령을 자동 주입하는 식의 접근이 필요해 보인다.

지금은 운영 측면에서 *토론 주제는 코드 변경을 유발하지 않는 것으로만 한정한다*는 사용자 측 약속에 의존하는 상태다.

## 다음에 해보고 싶은 것

- `--vs gemini` 같은 옵션으로 선택 단계 스킵
- 토론 내용을 마크다운으로 자동 저장 (`--save debate.md`)
- 4자, 5자 토론 — Claude 두 개를 캐릭터 다르게(시니어/주니어)
- 토론 분위기 모드 — `--devils-advocate`로 의도적 반대 입장 강제
- cmux 푸터 의존 제거 — surface 라벨링 방식으로 전환
- 토론 안전 모드 — 토론 시작 전 각 CLI에 *파일 수정 금지, 셸 실행 금지* 같은 가드레일을 미리 깔아두는 방식

## 마치며

PAL MCP에서 시작해서 cmux를 거쳐 `/fight`까지 한 흐름으로 만들면서, 결국 AI 도구는 잘 조립하는 게 핵심이라는 걸 다시 느꼈다. 각 도구의 한계를 이해하고 나면, 그것들을 엮어서 새로운 워크플로우를 만들 수 있다.

요즘은 PR 리뷰할 때도 이걸 쓴다.

```
/fight 이 PR의 핵심 리스크는 뭐고, 머지해도 되는지?
```

세 모델이 각자 다른 각도에서 보고 합의하는 결론은, 한 모델 의견보다 훨씬 신뢰가 간다.

## 다음 편 예고

여기까지가 *내 손으로 만들어보기*까지의 이야기다. 한 가지 마음에 걸리는 게 있었다 — 스크립트 두세 개 + 슬래시 커맨드 마크다운으로만 굴러가는 구조라, *다른 머신에서 다시 쓰려면 또 셋업해야 한다*는 점. 그리고 비개발자 친구가 쓸 수 있을까? 라는 질문에 답이 안 나왔다.

그래서 다음 편에서는 이걸 **Claude Code 플러그인으로 패키징**한 과정을 다룬다.

- 마켓플레이스 메타데이터 vs 플러그인 메타데이터의 구분
- `/plugin:command` 콜론 네임스페이스의 의미
- `:install` 같은 셋업 명령으로 *비개발자도 한 번에* 설치되도록 만들기
- 환경 검증 + npm 자동 설치 자동화 (`omx`나 `mise` 같은 도구가 왜 그렇게 동작하는지 직접 만들어봐야 안다)
- Codex CLI와의 양방향 지원 (Codex Skill 시스템과의 차이)
- v0.1 → v0.2 단계적 릴리즈 전략

레포: [github.com/dongsik93/crosstalk](https://github.com/dongsik93/crosstalk) — 패키징 완료 후 public 공개 (2편 참조).

> 참고: 이 글에 등장하는 `/fight`는 *PoC 시점의 이름*입니다. 이후 플러그인으로 패키징하면서 `crosstalk`으로 리네임했고, 본문의 `~/.claude/scripts/fight_bridge.sh`도 현재는 `~/.claude/scripts/crosstalk_bridge.sh`입니다.

## 참고 링크

- [PAL MCP Server](https://github.com/BeehiveInnovations/pal-mcp-server) — 원래 출발점이었던 MCP 서버
- [cmux](https://github.com/manaflow-ai/cmux) — Ghostty 기반 멀티 에이전트 터미널
- [Claude Code Slash Commands 공식 문서](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
