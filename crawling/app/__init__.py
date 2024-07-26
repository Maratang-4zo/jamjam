from flask import Flask
# from app.config import Config
app = Flask(__name__)
# app.config.from_object(Config)

# 데이터베이스 연결 초기화
from app.db.connection import db

# API 엔드포인트 등록
from app.apis import api
