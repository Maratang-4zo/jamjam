from flask_marshmallow import Marshmallow
from marshmallow import fields

ma = Marshmallow()  # 이 부분은 삭제합니다.

class ResultSchema(ma.Schema):
    result_id = fields.Integer()  # Integer 타입으로 수정
    title = fields.String()
    road_address_name = fields.String()
    jibun_address_name = fields.String()
    phone_number = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()