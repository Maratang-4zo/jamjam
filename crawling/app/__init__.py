from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from config import DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
ma = Marshmallow(app)

# 모델 import
from app.models import *

# API 엔드포인트 등록
from app.apis import *

# 스케줄러 시작
from app.scheduler.scheduler import start_scheduler
start_scheduler()

