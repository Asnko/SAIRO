# SCH Campus AI — Mobile App

React Native + Expo (iOS 우선) 앱입니다.

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | React Native 0.76 + Expo SDK 52 |
| 라우팅 | Expo Router v4 (파일 기반) |
| 언어 | TypeScript |
| 내비게이션 | Bottom Tabs (expo-router) |
| 애니메이션 | React Native Reanimated 3 |
| 그라디언트 | expo-linear-gradient |
| 아이콘 | @expo/vector-icons (Ionicons) |
| 지도 SVG | react-native-svg |

## 프로젝트 구조

```
app/mobile/
├── app/                    # Expo Router 파일 기반 라우팅
│   ├── _layout.tsx         # 루트 레이아웃 (SafeArea, GestureHandler)
│   ├── index.tsx           # 진입점 (온보딩 or 탭으로 리다이렉트)
│   ├── onboarding.tsx      # 온보딩 3단계 슬라이드
│   └── (tabs)/
│       ├── _layout.tsx     # 탭 바 레이아웃
│       ├── home.tsx        # 홈 (AI 브리핑, 시간표, 공지)
│       ├── chat.tsx        # SCH-AI 채팅 (RAG)
│       ├── schedule.tsx    # 시간표 (주간/목록)
│       ├── map.tsx         # 캠퍼스 지도 + A* 경로
│       └── notes.tsx       # 메모 (목록/관계 그래프)
├── components/
│   └── ui/
│       ├── Card.tsx        # 카드 컴포넌트
│       ├── Tag.tsx         # 태그/필 컴포넌트
│       ├── SectionHeader.tsx
│       ├── IconSymbol.tsx  # Ionicons 래퍼
│       └── index.ts
├── constants/
│   ├── colors.ts           # 디자인 토큰 (SCH 브랜드 컬러)
│   ├── typography.ts       # 폰트 스케일
│   ├── layout.ts           # 간격, 반경, 높이
│   └── index.ts
├── store/
│   └── onboarding.ts       # 온보딩 상태
├── types/
│   └── index.ts            # 공통 TypeScript 타입
├── assets/
│   └── images/             # 아이콘, 스플래시 이미지 위치
├── app.json                # Expo 설정
├── babel.config.js
├── package.json
└── tsconfig.json
```

## 시작하기

```bash
cd app/mobile

# 의존성 설치
npm install

# iOS 시뮬레이터 실행
npm run ios

# 개발 서버만 시작
npm start
```

## 필요 환경

- Node.js 18+
- Xcode 15+ (iOS 시뮬레이터)
- EAS CLI (빌드 배포 시): `npm install -g eas-cli`

## 프로토타입 → 앱 변환 주요 사항

| 프로토타입 (web) | 앱 (mobile) |
|-----------------|-------------|
| `window.SCH` 전역 객체 | `constants/colors.ts` TypeScript 상수 |
| `div` + inline style | `View` + `StyleSheet.create` |
| CSS grid/flex | RN Flexbox |
| `window.addEventListener` | React hooks |
| HTML `<svg>` | `react-native-svg` |
| `position: absolute` overlay | `SafeAreaView` + `useSafeAreaInsets` |
| 탭바 직접 구현 | Expo Router `<Tabs>` |
| 온보딩 state | `store/onboarding.ts` |
