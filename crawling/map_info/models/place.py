from datetime import datetime

from map_info import db

class Place(db.Model):
    __tablename__ = 'place_tb'

    result_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255))                                        # 이름
    road_address = db.Column(db.String(255))                                # 도로명 주소
    address = db.Column(db.String(255))                                     # 지번 주소
    phone = db.Column(db.String(20))                                        # 전화번호
    latitude = db.Column(db.Float)                                          # 위도
    longitude = db.Column(db.Float)                                         # 경도
    subway_name = db.Column(db.String(255))                                 # 지하철역 이름
    is_delete = db.Column(db.Boolean, default=False)                        # 삭제 여부
    create_at = db.Column(db.DateTime, default=datetime.now())              # 생성일시
    update_at = db.Column(db.DateTime, default=datetime.now())              # 수정일시