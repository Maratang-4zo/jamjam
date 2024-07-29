import pymysql
from app.config import DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT


def get_db_connection():
    connection = pymysql.connect(
        host=f'{DB_HOST}',          # MySQL Server Address
        port=DB_PORT,               # MySQL Server Port
        user=f'{DB_USERNAME}',      # MySQL username
        passwd=f'{DB_PASSWORD}',    # password for MySQL username
        db=f'{DB_NAME}',            # Database name
        charset='utf8'
    )
    return connection


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
    with db.cursor() as cursor:
        cursor.execute(create_table_query)
        db.commit()


db = get_db_connection()
create_table()
