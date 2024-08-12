from app import db
from datetime import datetime


class LocalInfo(db.Model):
    __tablename__ = 'local_info'

    __table_args__ = (
        db.Index('ix_station_name_category', 'station_name', 'category'),
    )

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
        # SQLAlchemy 행 객체를 Python dict 로 변환
        return [place.to_dict() for place in LocalInfo.query.filter_by(is_deleted=False).all()]

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

    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            'local_info_id': self.local_info_id,
            'station_name': self.station_name,
            'name': self.name,
            'id': self.id,
            'category': self.category,
            'road_address': self.road_address,
            'address': self.address,
            'phone': self.phone,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'is_deleted': self.is_deleted,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

