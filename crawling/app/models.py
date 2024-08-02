# from app import db
# from datetime import datetime
# import pymysql



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

    # @staticmethod
    # def insert_place(place_data):
    #     query = text("""
    #         INSERT INTO local_info (station_name, name, id, category, road_address, address, phone, latitude, longitude)
    #         VALUES (:station_name, :name, :id, :category, :road_address, :address, :phone, :latitude, :longitude)
    #     """)
    #     session = Session()
    #     try:
    #         session.execute(query, place_data)
    #         session.commit()
    #     finally:
    #         session.close()

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

    # @staticmethod
    # def delete_place(place_id):
    #     query = text("UPDATE local_info SET is_deleted = TRUE, updated_at = :updated_at WHERE id = :id")
    #     session = Session()
    #     try:
    #         session.execute(query, {'updated_at': datetime.now(), 'id': place_id})
    #         session.commit()
    #     finally:
    #         session.close()

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



#
# class Place:
#     @staticmethod
#     def get_all_places():
#         query = 'SELECT * FROM local_info WHERE is_deleted = 0'
#         connection = db.connect()
#         try:
#             with connection.cursor(pymysql.cursors.DictCursor) as cursor:
#                 cursor.execute(query)
#                 result = cursor.fetchall()
#         finally:
#             connection.close()
#         return result
#
#     @staticmethod
#     def insert_place(place_data):
#         query = (
#             "INSERT INTO local_info (station_name, name, id, category, road_address, address, phone, latitude, longitude) "
#             "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
#         )
#         values = (
#             place_data['station_name'],
#             place_data['name'],
#             place_data['id'],
#             place_data['category'],
#             place_data['road_address'],
#             place_data['address'],
#             place_data['phone'],
#             place_data['latitude'],
#             place_data['longitude']
#         )
#         connection = db.connect()
#         try:
#             with connection.cursor() as cursor:
#                 cursor.execute(query, values)
#             connection.commit()
#         finally:
#             connection.close()
#
#     @staticmethod
#     def update_place(place_id, update_data):
#         query = f"""
#         UPDATE local_info SET
#             station_name = %s,
#             name = %s,
#             category = %s,
#             road_address = %s,
#             address = %s,
#             phone = %s,
#             latitude = %s,
#             longitude = %s,
#             is_deleted = FALSE,
#             updated_at = %s
#         WHERE id = %s
#         """
#         values = (
#             update_data['station_name'],
#             update_data['name'],
#             update_data['category'],
#             update_data['road_address'],
#             update_data['address'],
#             update_data['phone'],
#             update_data['latitude'],
#             update_data['longitude'],
#             datetime.now(),
#             place_id
#         )
#         connection = db.connect()
#         try:
#             with connection.cursor() as cursor:
#                 cursor.execute(query, values)
#             connection.commit()
#         finally:
#             connection.close()
#
#     @staticmethod
#     def delete_place(place_id):
#         query = "UPDATE local_info SET is_deleted = TRUE, updated_at = %s WHERE id = %s"
#         values = (
#             datetime.now(),
#             place_id
#         )
#         connection = db.connect()
#         try:
#             with connection.cursor() as cursor:
#                 cursor.execute(query, values)
#             connection.commit()
#         finally:
#             connection.close()
#
#     @staticmethod
#     def insert_test():
#         query = (
#             "INSERT INTO local_info (station_name) VALUES (%s)"
#         )
#         values = (
#             '테스트입니다'
#         )
#         connection = db.connect()
#         try:
#             with connection.cursor() as cursor:
#                 cursor.execute(query, values)
#             connection.commit()
#         finally:
#             connection.close()
#
