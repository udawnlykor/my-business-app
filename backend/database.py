import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 1. 환경 변수에서 DB 주소를 찾습니다.
# (Render 서버에선 설정된 값을 쓰고, 없으면 내 컴퓨터의 파일 DB를 씁니다)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bootcamp.db")

# 2. Render가 주는 주소는 'postgres://' 로 시작하는데,
# 파이썬은 'postgresql://' 이라고 해야 알아듣습니다. 그래서 이름을 살짝 고쳐줍니다.
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. SQLite(내 컴퓨터)일 때만 필요한 설정
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

# 엔진 생성
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()