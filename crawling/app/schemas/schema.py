from flask_marshmallow import Marshmallow
from marshmallow import fields

ma = Marshmallow()

class LocalInfoSchema(ma.Schema):
    local_info_id = fields.Integer()
    station_name = fields.String()
    name = fields.String()
    id = fields.Integer()
    category = fields.String()
    road_address = fields.String()
    address = fields.String()
    phone = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()
    is_deleted = fields.Boolean()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
