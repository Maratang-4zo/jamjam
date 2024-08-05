from datetime import datetime
from sqlalchemy import text, Table, MetaData, delete
from app import Session, engine

metadata = MetaData()
local_info_table = Table('local_info', metadata, autoload_with=engine)

class Place:
    @staticmethod
    def get_all_places():
        session = Session()
        try:
            result = session.execute(text('SELECT * FROM local_info WHERE is_deleted = 0')).fetchall()
            return [dict(row) for row in result]
        finally:
            session.close()

    @staticmethod
    def bulk_insert(place_data_list):
        session = Session()
        try:
            session.execute(local_info_table.insert(), place_data_list)
            session.commit()
        finally:
            session.close()

    @staticmethod
    def update_place(place_id, update_data):
        query = text("""
            UPDATE local_info SET
                station_name = :station_name,
                name = :name,
                category = :category,
                road_address = :road_address,
                address = :address,
                phone = :phone,
                latitude = :latitude,
                longitude = :longitude,
                is_deleted = FALSE,
                updated_at = :updated_at
            WHERE id = :id
        """)
        update_data['updated_at'] = datetime.now()
        update_data['id'] = place_id
        session = Session()
        try:
            session.execute(query, update_data)
            session.commit()
        finally:
            session.close()

    @staticmethod
    def bulk_delete(ids):
        session = Session()
        try:
            stmt = delete(local_info_table).where(local_info_table.c.id.in_(ids))
            session.execute(stmt)
            session.commit()
        finally:
            session.close()

    @staticmethod
    def insert_test():
        query = text("INSERT INTO local_info (station_name) VALUES (:station_name)")
        session = Session()
        try:
            session.execute(query, {'station_name': '테스트입니다'})
            session.commit()
        finally:
            session.close()
