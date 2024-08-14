from sqlalchemy.exc import SQLAlchemyError

from app import db
from datetime import datetime, timedelta


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
    def bulk_insert(insert_data_list):
        db.session.bulk_insert_mappings(LocalInfo, insert_data_list)
        db.session.commit()

    @staticmethod
    def bulk_update(update_data_list):

        current_time = datetime.utcnow() + timedelta(hours=9) # 한국 시간: UTC + 9 시간
        for data in update_data_list:
            data['updated_at'] = current_time

        batch_size = 1000 # 데이터가 너무 많아지지 않도록 배치로 나누어 처리
        for i in range(0, len(update_data_list), batch_size):
            batch = update_data_list[i:i + batch_size]
            try:
                db.session.bulk_update_mappings(LocalInfo, batch)
                db.session.commit()
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"@@@@@ An error occurred: {e}")

    @staticmethod
    def bulk_delete(delete_data_list):
        current_time = datetime.utcnow() + timedelta(hours=9) # 한국 시간: UTC + 9 시간
        for data in delete_data_list:
            data['updated_at'] = current_time
            data['is_deleted'] = True

        batch_size = 1000 # 데이터가 너무 많아지지 않도록 배치로 나누어 처리
        for i in range(0, len(delete_data_list), batch_size):
            batch = delete_data_list[i:i + batch_size]
            try:
                db.session.bulk_update_mappings(LocalInfo, batch)
                db.session.commit()
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"@@@@@ An error occurred: {e}")

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

