from flask import Flask
app = Flask(__name__)

# 데이터베이스 연결 초기화
# from app.db.connection import db
from app.db.connection import Session, engine

# API 엔드포인트 등록
from app.apis import api
