from database import engine

try:
    # 데이터베이스에 연결을 시도합니다.
    connection = engine.connect()
    print("✅ 축하합니다! Supabase DB 연결에 성공했습니다.")
    connection.close()
except Exception as e:
    print("❌ 연결 실패... 에러 내용을 확인하세요:")
    print(e)