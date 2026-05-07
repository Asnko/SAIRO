<div align="center">

# 🎓 SAIRO

**S**oonchunhyang **A**ll-**I**n-one **R**esource **O**rganizer

_캠퍼스 라이프 초밀착 지능형 에이전트 🤖_

[![Status](https://img.shields.io/badge/status-in--development-FFD700?style=for-the-badge&logo=github)]()
[![Frontend](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)]()
[![Backend](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)]()
[![Repo](https://img.shields.io/badge/repo-monorepo-6E40C9?style=for-the-badge)]()

**SAIRO(사이로)** 는 순천향대학교 학생의 학사·학업·캠퍼스 이동 데이터를 하나의 지능형 시스템으로 통합 관리하는<br>**능동형 AI 비서 서비스**입니다.

<br>
</div>

## 📌 Overview & Goals

사용자가 질문하기 전에 상황을 인지하여 필요한 정보를 선제적으로 제공하는 **멀티모달 AI 에이전트**를 지향합니다. 캠퍼스 내 행정·학업·물리적 이동 등 모든 대학 생활 데이터를 지능형 시스템으로 통합 관리하여 **학업 효율 극대화**를 목표로 합니다.

<div align="center">

|        기대 효과        | 설명                                                                     |
| :---------------------: | :----------------------------------------------------------------------- |
|   ⚡️ **행정 효율화**    | 정보 검색 시간 단축 ➔ 학습 집중 시간 확보                                |
|  📈 **학업 성취 향상**  | 메모 간 맥락 연결 및 부족 포인트 분석을 통한 자기주도 학습 강화          |
| 🗺️ **캠퍼스 경험 혁신** | 학교 환경 특화 실시간 동선 가이드로 이동 시간 최소화 및 자원 활용 최적화 |

</div>

<br>

## ✨ Key Features

> **📰 1. 공지 자동 큐레이션**  
> 크롤링한 학사 공지를 `[장학 / 학사 / 행사]` 카테고리로 자동 분류하여 사용자 맞춤 피드 제공

> **💬 2. 근거 기반 학사 상담 챗봇**  
> 학교 규정집·과거 공지를 임베딩한 `RAG 파이프라인`을 통해 출처가 명확한 답변 제공

> **🧠 3. 학습 맥락 연결 메모**  
> 개별 강의 메모를 벡터화 후 유기적으로 연결, 이전 학습 맥락을 고려한 자동 요약 및 부족 구간 탐지

> **🗺️ 4. 캠퍼스 특화 최적 경로**  
> 계단·엘리베이터·경사도가 반영된 가중치 그래프 위에서 `A* 알고리즘`으로 실시간 최적 이동 경로 안내

<br>

## 🛠 Tech Stack

### 💻 Frontend

<img src="https://img.shields.io/badge/react_native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/expo-000020?style=for-the-badge&logo=expo&logoColor=white" />

### ⚙️ Backend

<img src="https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white" />
<img src="https://img.shields.io/badge/DJANGO--REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff6c5c&labelColor=ff1709" />

### 🤖 AI / ML

<img src="https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white" />
<img src="https://img.shields.io/badge/🦜🔗%20LangChain-1C3C3C?style=for-the-badge&logoColor=white" />
<img src="https://img.shields.io/badge/Vector%20DB-4B275F?style=for-the-badge&logoColor=white" />

### 🐳 Infrastructure

<img src="https://img.shields.io/badge/docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" />

<br>

## 🔬 Data & AI Pipeline

- **데이터 수집**
  - `학사 정보` : 각 학과 및 학교 공식 홈페이지 공지 사항 주기적 크롤링
  - `학업 데이터` : 사용자가 직접 작성한 강의 메모·과제 수행 내용
  - `물리 지형 데이터` : 캠퍼스 전 구역의 계단·엘리베이터·경사도 정보를 직접 수집·수치화한 가중치 데이터셋

- **AI 모델링 적용 방안**
  - **TensorFlow (LSTM)** ➔ 공지 사항 텍스트 자동 분류
  - **LangChain + RAG** ➔ 규정집·공지 임베딩 기반 근거형 학사 상담 챗봇
  - **Context Chain 구조** ➔ 메모 벡터화 및 연결을 통한 학습 맥락 추적·요약
  - **그래프 알고리즘 (A\*)** ➔ 캠퍼스 지형 가중치 그래프 기반 실시간 최적 경로

<br>

## 📂 Repository Structure

```text
SAIRO/
├── 📁 app/        # 클라이언트 어플리케이션
├── 📁 server/     # 백엔드 및 AI 서버
│   └── 📁 app/    # Django REST API · AI 모델 (RAG · LSTM)
├── 📁 data/       # 캠퍼스 지형 가중치 데이터셋
├── 📁 docs/       # 프로젝트 문서
└── 📄 README.md
```

<br>

## 🚀 Getting Started

```bash
# 1. Clone Repository
git clone https://github.com/Asnko/SAIRO.git
cd SAIRO

# 2. Server (TBD)

# 3. App (TBD)
```

<br>

## 🗺️ Roadmap

- [ ] 학사 공지 크롤러 + LSTM 분류기
- [ ] RAG 기반 학사 챗봇 MVP
- [ ] 캠퍼스 지형 데이터셋 구축 및 A\* 경로 탐색
- [ ] Context Chain 메모 시스템
- [ ] 앱 패키징 및 배포

<br>

## 👨‍💻 Our Team

<div align="center">

| <img src="https://github.com/Asnko.png?size=240" width="120" height="120" style="border-radius:50%; object-fit:cover;" alt="박준석"/> | <img src="https://github.com/yuhyunjaes.png?size=240" width="120" height="120" style="border-radius:50%; object-fit:cover;" alt="유현재"/> | <img src="https://github.com/dlwjdrms-spec.png?size=240" width="120" height="120" style="border-radius:50%; object-fit:cover;" alt="이정근"/> |
| :-----------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                [**박준석**](https://github.com/Asnko)                                                 |                                                [**유현재**](https://github.com/yuhyunjaes)                                                 |                                                [**이정근**](https://github.com/dlwjdrms-spec)                                                 |
|                                                                 (TBD)                                                                 |                                                                  Frontend                                                                  |                                                                     (TBD)                                                                     |

</div>

<br>

## 📄 License

TBD
