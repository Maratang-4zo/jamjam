from flask_marshmallow import Marshmallow
from marshmallow import fields

ma = Marshmallow()

class PlaceSchema(ma.Schema):
    result_id = fields.Integer()
    title = fields.String()
    road_address_name = fields.String()
    address_name = fields.String()
    phone_number = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()
    subway_name = fields.String()
    is_delete = fields.Boolean()
    create_at = fields.DateTime()
    update_at = fields.DateTime()