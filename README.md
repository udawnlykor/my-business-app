# Student Assignment & Community Dashboard

부트캠프 학생들을 위한 게이미피케이션 대시보드입니다.

## 주요 기능
- **로그인**: 비밀번호 없는 이름 기반 로그인 (쿠키 사용)
- **가계부/일지 인증**: 1일 1회 포인트 적립 (+5P)
- **콘텐츠 공유**: 무제한 링크 공유 및 포인트 적립 (+5P)
- **명예의 전당**: 포인트 기준 Top 3 랭킹 공개
- **활동 피드**: 모든 학생의 인증 게시물 실시간 확인 (카테고리 필터링)
- **관리자 모드**: `admin1234` 입력 시 모든 게시물 관리(삭제) 가능

## 기술 스택
- **Frontend**: React, Vite, Tailwind CSS, Axios, React Icons
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite
- **Database**: `bootcamp.db`

## 실행 방법

### 1. 백엔드 실행
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
*백엔드는 `http://localhost:8000`에서 실행됩니다.*

### 2. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```
*프론트엔드는 `http://localhost:5173`에서 실행됩니다.*

## 관리자 모드
우측 상단 로고 옆의 '관리자 아이콘'을 클릭하고 `admin1234`를 입력하세요.
관리자 모드 활성 시 모든 게시물을 삭제할 수 있는 권한이 부여됩니다.
