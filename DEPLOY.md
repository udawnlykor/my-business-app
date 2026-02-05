# 배포 가이드 (Deployment Guide)

이 가이드는 **Supabase (DB)**, **Render (Backend)**, **Vercel (Frontend)** 를 사용하여 서비스를 배포하는 방법을 설명합니다.

---

## 1단계: GitHub에 코드 올리기 (Push)
작성된 코드를 GitHub 저장소에 올립니다.

```bash
git add .
git commit -m "배포 설정 추가"
git push origin main
```

---

## 2단계: Backend 배포 (Render)
`render.yaml` 파일을 만들어 두었으므로, 설정이 매우 간단합니다.

1. [Render.com](https://render.com) 로그인/가입.
2. **Dashboard** -> **New +** -> **Blueprint Instance** 선택.
3. GitHub 저장소를 연결합니다 (`Connect a repository`).
4. `render.yaml` 파일이 자동으로 인식됩니다.
5. **Apply** 버튼을 누르면 배포가 시작됩니다.
6. 배포가 완료되면, 대시보드 상단에 있는 **Service URL** (예: `https://truelove-backend.onrender.com`)을 복사해두세요.

> **참고**: 데이터베이스 주소(`DATABASE_URL`)는 이미 코드(`backend/database.py`)에 설정해두셨으므로, Render에서 별도로 설정하지 않아도 됩니다. (보안을 위해 나중에 환경변수(`Environment variables`)로 옮기는 것을 권장합니다.)

---

## 3단계: Frontend 배포 (Vercel)
프론트엔드를 Vercel에 배포하고, 백엔드와 연결합니다.

1. [Vercel.com](https://vercel.com) 로그인 -> **Add New...** -> **Project**.
2. GitHub 저장소를 Import 합니다.
3. **Configure Project** 화면에서:
   - **Framework Preset**: `Vite` (자동 선택됨)
   - **Root Directory**: `Edit` 클릭 -> `frontend` 폴더 선택.
4. **Environment Variables** (환경 변수) 펼치기:
   - **Key**: `VITE_API_URL`
   - **Value**: 아까 복사한 **Render 백엔드 주소** (예: `https://truelove-backend.onrender.com`)
   - **중요**: 주소 맨 뒤에 `/` 슬래시가 **없어야** 합니다.
5. **Deploy** 클릭.

---

## 4단계: 완료 및 확인
Vercel 배포가 끝나면 제공되는 도메인으로 접속하여 로그인 및 기능을 테스트해보세요!

- **이미지 업로드 주의사항**: 현재 이미지는 Render 서버 내부 폴더(`uploads/`)에 저장됩니다. Render 무료 버전은 서버가 재시작되면 이 파일들이 **삭제**됩니다. 영구적인 이미지 저장을 원하시면 추후 **Supabase Storage** 연동 작업이 필요합니다.
