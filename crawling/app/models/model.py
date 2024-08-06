from app import db
from datetime import datetime


class LocalInfo(db.Model):
    __tablename__ = 'local_info'

    local_info_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    station_name = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    id = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(255), nullable=True)
    road_address = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    is_deleted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @staticmethod
    def get_all_places():
        return LocalInfo.query.filter_by(is_deleted=False).all()

    @staticmethod
    def bulk_insert(place_data_list):
        db.session.bulk_insert_mappings(LocalInfo, place_data_list)
        db.session.commit()

    @staticmethod
    def update_place(place_id, update_data):
        place = LocalInfo.query.get(place_id)
        if place:
            for key, value in update_data.items():
                setattr(place, key, value)
            place.updated_at = datetime.utcnow()
            db.session.commit()

    @staticmethod
    def bulk_delete(ids):
        LocalInfo.query.filter(LocalInfo.local_info_id.in_(ids)).update({'is_deleted': True})
        db.session.commit()

