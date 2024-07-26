import pymysql
from app.config import DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT

def get_db_connection():
    connection = pymysql.connect(
        host=f'{DB_HOST}',     # MySQL Server Address
        port=DB_PORT,     # MySQL Server Port
        user=f'{DB_USERNAME}',      # MySQL username
        passwd=f'{DB_PASSWORD}',    # password for MySQL username
        db=f'{DB_NAME}',   # Database name
        charset='utf8'
    )
    return connection

db = get_db_connection()
