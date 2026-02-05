import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 1. Supabase 주소를 직접 변수에 할당합니다.
# 알려주신 비밀번호와 주소를 합친 최종 결과물입니다.
SQLALCHEMY_DATABASE_URL = "postgresql://postgres.ivjxrylcilewspoxehay:piBGl8GqvXAOdmZk@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"

# 2. 엔진 생성 (연결 안정성을 위해 pool_pre_ping 추가)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True
)

# 3. 세션 및 베이스 설정
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()