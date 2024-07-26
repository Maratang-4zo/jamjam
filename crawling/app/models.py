from app import db
from datetime import datetime
import pymysql

class Place:
    @staticmethod
    def get_all_places():
        query = 'SELECT * FROM place_tb WHERE is_deleted = 0'
        with db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(query)
            result = cursor.fetchall()
        return result

    @staticmethod
    def insert_place(place_data):
        query = (
            "INSERT INTO place_tb (station_name, name, id, category, road_address, address, phone, latitude, longitude) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        )
        values = (
            place_data['station_name'],
            place_data['name'],
            place_data['id'],
            place_data['category'],
            place_data['road_address'],
            place_data['address'],
            place_data['phone'],
            place_data['latitude'],
            place_data['longitude']
        )
        with db.cursor() as cursor:
            cursor.execute(query, values)
        db.commit()

    @staticmethod
    def update_place(place_id, update_data):
        query = f"""
        UPDATE place_tb SET
            station_name = %s,
            name = %s,
            category = %s,
            road_address = %s,
            address = %s,
            phone = %s,
            latitude = %s,
            longitude = %s,
            is_deleted = FALSE,
            updated_at = %s
        WHERE id = %s
        """
        values = (
            update_data['station_name'],
            update_data['name'],
            update_data['category'],
            update_data['road_address'],
            update_data['address'],
            update_data['phone'],
            update_data['latitude'],
            update_data['longitude'],
            datetime.now(),
            place_id
        )
        with db.cursor() as cursor:
            cursor.execute(query, values)
        db.commit()

    @staticmethod
    def delete_place(place_id):
        query = "UPDATE place_tb SET is_deleted = TRUE, updated_at = %s WHERE id = %s"
        values = (
            datetime.now(),
            place_id
        )
        with db.cursor() as cursor:
            cursor.execute(query, values)
        db.commit()
