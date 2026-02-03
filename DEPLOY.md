# 배포 가이드 (Deployment Guide)

현재 프로젝트는 **Frontend (Vercel)** 와 **Backend (Render)** 로 나누어 배포하는 것이 가장 적합합니다.
그 이유는 **SQLite (로컬 파일 DB)** 와 **이미지 업로드** 기능 때문입니다. Vercel의 서버리스 기능은 파일을 영구 저장하지 못하므로, Vercel만 사용할 경우 데이터가 계속 초기화됩니다.

---

## 1단계: GitHub에 코드 올리기
작성된 코드를 GitHub 저장소에 Push 하세요.

```bash
git add .
git commit -m "배포 준비 완료"
git push origin main
```

---

## 2단계: Backend 배포 (Render.com)
Render는 무료로 백엔드 서버를 구동할 수 있으며, 설정이 간단합니다.

1. [Render.com](https://render.com) 회원가입 및 로그인.
2. 대시보드에서 **New +** 버튼 -> **Web Service** 선택.
3. GitHub 저장소 연동.
4. 설정값 입력:
   - **Root Directory**: `backend` (반드시 입력!)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Deploy Web Service** 클릭.
6. 배포가 완료되면, 상단에 `https://your-backend-name.onrender.com` 주소가 생성됩니다. 이 주소를 복사해두세요.

> **주의사항**: Render 무료 티어는 15분간 사용이 없으면 **Sleep Mode**로 들어가, 다음 접속 시 30초 정도 로딩이 걸릴 수 있습니다. 또한, 무료 티어에서는 **서버 재실행 시 데이터(DB, 업로드 이미지)가 초기화**될 수 있습니다. (영구 저장을 원하시면 Render Disks(유료)를 추가하거나 DB를 분리해야 합니다.)

---

## 3단계: Frontend 배포 (Vercel)
프론트엔드는 Vercel에 배포하여 빠르고 안정적으로 서비스합니다.

1. [Vercel.com](https://vercel.com) 로그인 -> **Add New...** -> **Project**.
2. GitHub 저장소 Import.
3. **Configure Project** 설정:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `Edit` 버튼 클릭 -> `frontend` 폴더 선택.
4. **Environment Variables** (환경 변수) 설정:
   - Key: `VITE_API_URL`
   - Value: 위에서 복사한 **Render 백엔드 주소** (예: `https://my-bootcamp-api.onrender.com`) - **마지막 슬래시(/) 제거**
5. **Deploy** 클릭.

---

## 완료!
이제 Vercel에서 제공하는 URL로 접속하면 배포된 서비스를 확인할 수 있습니다.

### FAQ
**Q. 데이터가 자꾸 사라져요!**
A. 현재 SQLite(파일 DB)를 사용하고 있어서, Render 무료 서버가 재시작될 때 파일이 초기화됩니다. 데이터를 영구 보존하려면 **Postgres(Supabase 등)** 로 DB를 변경해야 합니다.

**Q. 이미지가 안 보여요!**
A. 이미지를 서버 로컬 폴더(`uploads/`)에 저장하고 있어서, 서버가 재시작되면 이미지도 함께 사라집니다. 이를 해결하려면 **Cloudinary**나 **S3** 같은 스토리지 서비스를 연동해야 합니다.

*이 가이드는 현재 코드 구조를 유지하면서 가장 빠르게 배포하는 방법입니다.*
