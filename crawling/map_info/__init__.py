import pymysql
from flask import Flask
from config import DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT

app = Flask(__name__)

db = pymysql.connect(
    host=f'{DB_HOST}',     # MySQL Server Address
    port=DB_PORT,     # MySQL Server Port
    user=f'{DB_USERNAME}',      # MySQL username
    passwd=f'{DB_PASSWORD}',    # password for MySQL username
    db=f'{DB_NAME}',   # Database name
    charset='utf8'
)

# from map_info.models import *  # 모델 import
from map_info.apis import *
