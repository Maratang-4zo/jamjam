from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config import DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT

# 데이터베이스 URL 구성
DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 엔진 생성 및 세션 구성
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)
Session = sessionmaker(bind=engine)

def create_table():
    create_table_query = """
    CREATE TABLE IF NOT EXISTS local_info (
        local_info_id INT AUTO_INCREMENT PRIMARY KEY,
        station_name VARCHAR(255),
        name VARCHAR(255),
        id INT,
        category VARCHAR(255),
        road_address VARCHAR(255),
        address VARCHAR(255),
        phone VARCHAR(20),
        latitude FLOAT,
        longitude FLOAT,
        is_deleted TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    """
    with engine.connect() as connection:
        connection.execute(text(create_table_query))

# 테이블 생성 호출
create_table()

