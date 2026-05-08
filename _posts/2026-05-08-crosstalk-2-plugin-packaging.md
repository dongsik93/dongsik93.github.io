---
layout: post
title: "[AI Agent] Crosstalk 만들기 - 2편: Claude Code 플러그인으로 패키징하기"
subtitle: "스크립트 두세 개를 한 번 깔리는 도구로 — 마켓플레이스, install, i18n까지"
date: 2026-05-08 20:00:00 +0900
categories: til
tags: claude-code plugin marketplace cmux multi-agent crosstalk i18n install
comments: true
---

# 1편 끝나고 남은 한 가지 찜찜함

[1편](/2026/05/07/crosstalk-1-multi-agent-debate)에서 `/fight` 슬래시 커맨드를 만들어서 잘 쓰고 있었다. 그런데 *내 손에서만* 잘 굴러갔다.

구성은 이랬다.

```
~/.claude/commands/fight.md           # 슬래시 커맨드 정의
~/.claude/scripts/fight_bridge.sh     # cmux 통신 헬퍼
```

이 두 파일이 *내 머신에* 있어야 동작한다. 다른 노트북에서 다시 쓰려면 또 깔아야 하고, 친구한테 권하려고 해도 *brew로 cmux 깔고 / fight.md 복사하고 / bridge 권한 주고 / 푸터 시그니처는 네 CLI 버전에 따라 달라질 수 있고...* 한 다음에야 동작한다.

> "내 손에서 도는 도구"는 내 손을 떠나는 순간 도구가 아니다.

그래서 이걸 **Claude Code 플러그인**으로 패키징하기로 했다. 잘 모르는 친구도 한 줄로 깔 수 있게.

```
/plugin marketplace add dongsik93/crosstalk
/plugin install crosstalk@dongsik93/crosstalk
/crosstalk:install
```

2편은 그 패키징 과정 — 의외로 *기술적*으로는 어렵지 않은데 *판단할 게* 많은 작업이었다.

## Claude Code 플러그인 구조 — marketplace vs plugin

처음 부딪힌 건 *메타데이터 파일이 두 개*라는 점이었다. 둘 다 헷갈릴 수 있어서 정리부터.

```
crosstalk/                                    # GitHub 레포
├── .claude-plugin/
│   └── marketplace.json                      # 마켓 메타 (이 레포가 어떤 플러그인 모음인가)
├── plugins/
│   └── crosstalk/
│       ├── .claude-plugin/
│       │   └── plugin.json                   # 플러그인 메타 (이 폴더가 어떤 플러그인인가)
│       └── commands/
│           ├── debate.md
│           ├── review.md
│           └── ...
└── assets/
    ├── scripts/crosstalk_bridge.sh
    ├── user-commands/crosstalk.md            # 단독 명령용
    ├── rules/{en,ko}/...                     # 빌트인 룰
    └── personas/{en,ko}/...                  # 빌트인 페르소나
```

**`.claude-plugin/marketplace.json`** — *레포 root에 두는* 마켓플레이스 메타. "이 레포에 어떤 플러그인들이 들어있는지" 카탈로그.

```json
{
  "name": "crosstalk",
  "owner": { "name": "dongsik93" },
  "metadata": {
    "description": "Multi-agent AI debate via cmux split panes — run Claude, Codex, and Gemini in one command.",
    "version": "0.1.6"
  },
  "plugins": [
    { "name": "crosstalk", "version": "0.1.6", "source": "./plugins/crosstalk" }
  ]
}
```

**`plugins/<name>/.claude-plugin/plugin.json`** — 각 플러그인 *자체*의 메타.

```json
{
  "name": "crosstalk",
  "version": "0.1.6",
  "description": "Multi-agent AI debate slash commands powered by cmux split panes.",
  "author": { "name": "dongsik93" }
}
```

같은 정보(이름/버전/설명)가 *두 곳에 다*. 처음엔 *왜 이렇게 중복?* 했는데, 한 마켓플레이스 레포가 여러 플러그인을 가질 수 있는 구조라 그렇다 (`plugins[]` 배열). 마켓 레벨에서는 카탈로그 메타, 플러그인 레벨에서는 플러그인 자체 메타.

설치 흐름은 두 단계다.

```
/plugin marketplace add dongsik93/crosstalk
   ↓ ~/.claude/plugins/marketplaces/dongsik93-crosstalk/ 에 레포 클론
/plugin install crosstalk@dongsik93/crosstalk
   ↓ marketplace.json 읽고 → plugins[0].source 의 폴더를 활성화
```

마켓 메타가 `version: 0.1.5`라고 쓰여 있으면 마켓 캐시에 저장되고, 다음에 `/plugin install`을 해도 이미 0.1.5가 있으니 갱신을 안 한다. **patch bump 없이는 마켓 캐시가 stale인 채로 굳어버린다**. (이거 때문에 나중에 patch release 6번을 돌리게 된다.)

## 콜론 네임스페이스 — `/crosstalk:install`의 의미

플러그인이 제공하는 명령은 `/<plugin>:<command>` 형태다.

- `/crosstalk:install`
- `/crosstalk:debate`
- `/crosstalk:review`
- `/crosstalk:setup`
- `/crosstalk:launch`
- ...

콜론으로 네임스페이스가 분리되니까 다른 플러그인의 같은 이름 명령과 안 부딪힌다. 좋다.

근데 사람이 매번 `/crosstalk:debate <주제>` 라고 치는 건 길다. 단축으로 `/crosstalk <주제>` (콜론 없이) 가 되면 좋겠는데, 이건 플러그인 명령으로 만들 수 없다. **사용자 레벨 슬래시 커맨드** (`~/.claude/commands/<name>.md`) 만 콜론 없는 호출이 가능하기 때문이다.

해결: `/crosstalk:install` 이 사용자 홈에 단독 명령 파일을 *복사해 깔아주는* 식.

```bash
# install이 하는 일 일부
cp "$MARKETPLACE_ROOT/assets/user-commands/crosstalk.md" ~/.claude/commands/
```

이러면 `/crosstalk <주제>` 도 동작 (debate 본문을 그대로 따라가도록 위임).

## `/crosstalk:install` — 셋업 자동화의 핵심

플러그인을 깔면 끝나는 게 아니라 *사용자 환경*도 같이 검증/셋업해야 한다.

`/crosstalk:install` 한 번이 처리하는 것:

1. **환경 검증** — Node.js / npm / cmux / jq / gh
2. **AI CLI 자동 설치 안내** — claude / codex / gemini 중 누락된 것
3. **언어 선택** — `English` / `한국어` AskUserQuestion
4. **Crosstalk 컴포넌트 사용자 홈 복사** — bridge / 단독 명령 / 빌트인 룰·페르소나
5. **완료 안내 + 다음 단계**

사용자 화면은 이런 식으로 흘러간다.

![/crosstalk:install 실행 결과](/img/in-post/crosstalk-install.png)
> 환경 검증 → AI CLI 자동 설치 → 언어 선택 → 컴포넌트 복사가 한 흐름으로

이게 *플러그인 자체 설치* 다음에 한 번 더 도는 단계다. 처음엔 "왜 두 단계?" 싶었는데, 환경 검증 + AI CLI 설치 + 권한 체크는 플러그인 메타로 표현 못 한다. 결국 *플러그인 첫 명령이 세팅용*인 형태가 자연스러웠다.

### `--presets-only` 빠른 경로

빌트인 룰/페르소나만 다시 깔고 싶을 때를 위한 옵션:

```
/crosstalk:install --presets-only --language ko
```

→ 환경 검증 / CLI 설치 / 언어 선택 모두 건너뛰고 룰·페르소나만 보충. 사용자가 새 언어로 toggle 했을 때 자가치유에도 쓰인다.

## `/crosstalk:launch` — cmux 자동 셋업

cmux split을 사용자가 매번 직접 만들면 친절하지 못하다. `/crosstalk:launch` 한 번에:

1. cmux 안에서 호출됐는지 확인 (`cmux ping`)
2. cmux 외부면 → cmux 앱 띄우고 *cmux 안에서 다시 launch* 안내
3. cmux 안이면 → 본인 surface 식별 → 우측에 split 추가 → 새 pane에서 codex/gemini 시작
4. 각 pane이 *진짜 입력 가능 상태*가 될 때까지 대기 (`wait-ready` 폴링)
5. ready 통과한 pane만 cmux 탭에 라벨 박기 (`ct-codex`, `ct-gemini`)

### sleep 15 → wait-ready 폴링

처음엔 단순했다.

```bash
cmux send "$NEW_SURFACE_1" "codex"
sleep 15   # CLI 시작 대기
cmux rename-tab "$NEW_SURFACE_1" "ct-codex"
```

문제는 *15초가 항상 맞진 않다*는 것. 빠른 머신에서는 5초면 뜨는데 15초 강제 대기. 느린 환경에서는 15초도 부족할 수 있고. 그리고 라벨링이 *시작 전*에 박히면, 라벨 우선 detect 로직이 *아직 안 떠있는 pane을 codex로 오판* 할 수 있다.

bridge에 `wait-ready` 케이스를 추가했다.

```
~/.claude/scripts/crosstalk_bridge.sh wait-ready <surface> <expected-kind>
```

- 화면 푸터 패턴이 expected-kind와 일치하면 → `STATE: ready` (exit 0)
- OAuth/로그인 화면 감지 → `STATE: auth-needed` (exit 2)
- READY_MAX_WAIT(20초) 초과 → `STATE: timeout` (exit 1)

라벨은 ready 통과한 pane만 박는다.

```bash
~/.claude/scripts/crosstalk_bridge.sh wait-ready "$NEW_SURFACE_1" "$SURFACE_KIND_1"
RC1=$?
[ "$RC1" -eq 0 ] && \
  ~/.claude/scripts/crosstalk_bridge.sh label "$NEW_SURFACE_1" "$SURFACE_KIND_1"
```

빠른 머신에선 4~6초에 끝나고, 느린 환경에선 20초까지 기다린다. auth 화면이면 즉시 *수동 인증 필요* 안내 — sleep 15에서는 절대 못 잡던 분기.

### 라벨링이 푸터 의존을 줄여준다

cmux 탭에 `ct-codex` / `ct-gemini` / `ct-claude` 라벨이 박혀 있으면 detect는 *라벨 우선*, 푸터 매칭은 폴백.

![ct-codex 라벨이 박힌 cmux 탭](/img/in-post/crosstalk-tab-label.png)

```bash
LABEL=$(get-label "$SURFACE")
if [ -n "$LABEL" ]; then
  echo "$LABEL"; exit 0
fi
# 라벨 없으면 푸터 패턴 폴백 (1편의 self-match 방어 로직)
```

CLI 버전이 올라가서 푸터 디자인이 바뀌어도 라벨이 박혀 있으면 안 깨진다.

## i18n — `--language en|ko`

처음엔 한국어 안내만 있었다. 그러다 README를 영어로 갈아엎으면서 *UI 안내*도 양쪽 다 줘야겠다 싶었다. 풀 번역은 부담스러우니 절충안.

```
~/.claude/crosstalk/config.json
{
  "active_rules": "default",
  "active_persona": "default",
  "language": "en"        ← 사용자가 install 때 선택
}
```

```
~/.claude/crosstalk/
├── rules/
│   ├── en/{default,brainstorm,debate}.md
│   └── ko/{default,brainstorm,debate}.md
└── personas/
    ├── en/{default,senior-junior,critic-builder,triple-perspective}.md
    └── ko/{default,senior-junior,critic-builder,triple-perspective}.md
```

룰/페르소나는 *언어별 본문*으로 갖고, 메시지 템플릿의 *사용자 안내*만 언어별 분기. *transport 핵심 지시*는 영어 고정.

전환은 install 다시 안 돌려도 가능.

```
/crosstalk:setup --language ko
   → config.json .language = "ko" 갱신
   → 그 다음 라벨링까지 한 번에
```

### 누락 시 자동 복원 — `ensure-presets`

새 언어로 toggle 했을 때 *그 언어 디렉토리가 비어있으면* 디렉토리 비었으니 `/crosstalk:install` 다시 돌리세요라는 안내가 뜨는 게 부자연스럽다. bridge가 자동으로 채워주게 했다.

```
~/.claude/scripts/crosstalk_bridge.sh ensure-presets <lang>
   → ~/.claude/crosstalk/{rules,personas}/<lang>/ 가 비어있으면
   → 마켓 캐시에서 빌트인 자동 복사 (사용자 편집 보존)
```

이걸 debate / review / rules / persona / status 명령들이 *룰 본문 읽기 직전*에 호출. 사용자는 toggle 한 번이면 자동으로 새 언어 룰까지 갖춰진다.

```bash
# debate.md 안
~/.claude/scripts/crosstalk_bridge.sh ensure-presets "$LANGUAGE" >/dev/null 2>&1 || true
RULES_PATH=~/.claude/crosstalk/rules/${LANGUAGE}/${RULES_NAME}.md
```

이 자동 복원 덕분에 사용자가 install을 다시 안 돌려도 된다. 안 보이는 곳에서 알아서 굴러가는 작은 친절.

## 테스트 중 발견된 불편한 것들 (v0.1.0 → v0.1.6)

릴리즈 6번 돌면서 잡은 것들. 다 *작은데 짜증 났던* 거.

### 별칭(`/crosstalk:i`)이 동작 안 함

처음엔 자주 치는 명령에 단축 별칭을 만들려고 했다.

```
/crosstalk:i   → install
/crosstalk:d   → debate
/crosstalk:l   → launch
```

근데 슬래시 커맨드는 다른 슬래시 커맨드를 *호출*할 수 없다. `/crosstalk:i`를 만들어도 그건 *그냥 마크다운 문서*고, 본문에 "이 명령은 /crosstalk:install 과 동일하게 동작한다"라고 적어도 모델이 그걸 *직접 실행* 못 한다. 그냥 텍스트로 안내만 떠버림.

별칭 모두 제거. *콜론 없는 단독 명령* (`/crosstalk`) 만이 유일한 단축.

### 마켓 캐시 stale → patch bump 강제

같은 버전 그대로 푸시하면 마켓이 *이미 최신*이라며 갱신을 안 한다. 사용자 입장에서는 새 코드 받으려면 *수동으로 캐시 삭제*해야 하는데 너무 번거롭다.

```
/plugin marketplace remove dongsik93/crosstalk
/plugin marketplace add dongsik93/crosstalk
```

해결은 별 게 없고 — *고치면 패치 버전 올린다*. v0.1.0 → v0.1.6까지 6번 올라간 것도 절반은 *마켓 캐시 갱신용*이었다.

> 작은 fix라도 *사용자 머신까지 도달하려면* 버전이 올라야 한다. 마켓을 끼고 배포하는 도구의 숙명.

### `self pane` 라벨링 누락

`/crosstalk:setup` 라벨링 단계에서 *본인이 떠있는 pane(claude)* 만 빼먹고 옆 pane만 라벨 박는 케이스가 있었다. detect가 라벨을 우선 보니까, *본인은 푸터 매칭 폴백*으로 잡혀서 가끔 unknown 처리되는 사고.

setup이 self pane도 자동으로 `ct-claude` 라벨 박게 수정.

```bash
SELF=$(~/.claude/scripts/crosstalk_bridge.sh list-all | awk -F'\t' '$3=="self" {print $1}')
~/.claude/scripts/crosstalk_bridge.sh label "$SELF" claude
```

### Gemini 응답이 늦으면 사용자가 timeout 인식 → 재시도 → 답변 두 개

이건 좀 복잡한 사고였다. Gemini는 답변 시작이 느린 케이스가 잦은데, MAX_WAIT 안에 답이 안 오면 사용자한테 *timeout? 재시도?* 가 떴다. 사용자가 재시도를 누르면 *attempt 2* 메시지를 보내는데, 그 사이 *attempt 1 답변*이 늦게 도착해서 두 답변이 동시에 떠다니는 사고.

해결은 두 트랙으로 갔다.

1. **agent별 MAX_WAIT 차등**: gemini=360s, codex=240s, claude=180s. 처음부터 충분히 잡고 시작.
2. **활동 감지 자동 연장**: 화면/응답 파일에 변화가 *최근 30초 안에* 있으면 *살아있는 한* 자동으로 60초씩 연장 (최대 3회). Gemini가 답변 *시작*이 늦어도 *살아있으면* 안 죽임.

```bash
ACTIVITY_GRACE=30 ACTIVITY_EXTEND_BY=60 ACTIVITY_EXTEND_MAX=3
```

이걸로 timeout 사고는 거의 사라졌다. (그러나 *진짜 본질적 해결*은 v0.2의 callback 구조였다 — 이건 3편에서.)

## Codex CLI와의 차이 — 왜 양방향이 안 되는가

Claude Code는 슬래시 커맨드 + 마켓플레이스. Codex CLI는 [Skill 시스템](https://platform.openai.com/docs/codex)이다.

```
~/.codex/skills/<skill-name>/
└── SKILL.md
```

Codex는 SKILL.md 파일에 *언제 이 스킬을 발동할지* 자연어로 적으면 모델이 알아서 트리거한다. 슬래시 커맨드가 아니고 *상황 기반 발동*.

이론상 양쪽에 다 깔면 *어느 CLI에서도 토론 사회자 역할*이 가능해야 한다. 그런데 *cmux 안에서 Codex가 다른 pane을 깨우는 부분*이 까다로워서 (각 CLI가 cmux 명령을 *진짜로 실행*하는 거랑 *그냥 답변에 적기만 하는 거*가 다름) v0.1에서는 Codex pane은 *참여자*로만 동작하게 두고, *사회자=Claude 고정*. v0.2 이후 Codex 사회자 모드는 따로 검토 예정.

지금은 Claude Code → Codex pane / Gemini pane 단방향이다.

## 마치며

플러그인 패키징은 *기술적*으로 어렵지 않았다. JSON 메타 두 개 + 컴포넌트 복사 스크립트 + 환경 검증.

오히려 *판단할 게* 많았다.

- 별칭은 어디까지? (콜론 없는 단독 명령 하나만 두는 게 깔끔)
- 자가치유는 어디까지 자동? (사용자 편집 보존 + 누락만 보충)
- patch bump는 얼마나 자주? (수동 캐시 삭제보다는 patch가 낫다)
- i18n은 풀 번역? (UI만 분기, 핵심 지시는 영어 고정 절충)
- Codex/Gemini까지 양방향? (v0.1은 단방향, v0.2 이후 검토)

각 결정이 *사용자가 한 번 깔고 잊어버려도 되는* 도구가 되느냐 마느냐를 결정한다. *내 손에서 도는 도구*에서 *남의 손에 깔리는 도구*로 가는 거리는 생각보다 멀었다.

레포: [github.com/dongsik93/crosstalk](https://github.com/dongsik93/crosstalk) — public 공개됨.

```
/plugin marketplace add dongsik93/crosstalk
/plugin install crosstalk@dongsik93/crosstalk
/crosstalk:install
/crosstalk:launch
/crosstalk 비 오는 날 국밥이 답인가?
```

## 다음 편 예고

여기까지가 *패키징* 이야기다. 사용자가 깔 수 있는 도구로 만들었고, v0.1.6까지 잘 돌아갔다.

그런데 *진짜 본질적인 문제* 하나가 남아 있었다.

v0.1.6까지 굴려보다가 어느 순간 깨달았다.

> *"내가 명령어 때릴 거면 이거 안 만들지. 지네들끼리 핑퐁해야 하는데..."*

1편/2편에서 만든 토론 시스템은 사회자(Claude)가 *답을 끝없이 폴링*하는 구조였다. 폴링하는 동안 다른 거 시키면 흐름이 깨지고, 한 번 깨지면 복구가 안 됐다.

3편은 *polling을 버리고 callback으로 갔다*는 회고. v0.1.x → v0.2.0 메이저 변경 — 똑똑한 폴링보다 멍청한 콜백이 낫다는 깨달음의 기록.

## 참고 링크

- [Claude Code Plugin 공식 문서](https://docs.anthropic.com/en/docs/claude-code/plugins)
- [Codex Skill 시스템](https://platform.openai.com/docs/codex)
- [crosstalk 레포](https://github.com/dongsik93/crosstalk)
- [1편: Claude + Codex + Gemini, 셋이서 토론하는 슬래시 커맨드](/2026/05/07/crosstalk-1-multi-agent-debate)
