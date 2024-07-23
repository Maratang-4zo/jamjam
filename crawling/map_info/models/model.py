from map_info import db

# define Result Model
class Result(db.Model):
    __tablename__ = 'result_tb'

    result_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255))            # 이름
    road_address = db.Column(db.String(255))           # 도로명 주소
    address = db.Column(db.String(255))          # 지번 주소
    phone = db.Column(db.String(20))            # 전화번호
    latitude = db.Column(db.Float)                     # 위도
    longitude = db.Column(db.Float)                    # 경도