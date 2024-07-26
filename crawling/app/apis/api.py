from datetime import datetime
import time

import pandas as pd

from app.crawling import get_places
from app import app, db
from flask import jsonify

# 지도 데이터 크롤링 후 db 저장
@app.route('/crawling', methods=["POST"])
def addData():

    start_time = time.time()  # 시작 시간 측정

    keywords = ['스터디룸', '식당', '카페']
    all_data = []

    # API를 통해 데이터 수집
    for keyword in keywords:
        data = get_places(keyword)

        if isinstance(data, list): # data가 리스트 형태로 반환되었는지 확인
            all_data.extend(data)
        else:
            return jsonify({"error": "Invalid data format"}), 400

    end_kakao_request = time.time() # 카카오맵 API로 장소 요청 후 받아오는 시간 측정

    # DB에 있는 Place 정보를 DataFrame으로 가져오기
    all_places_df = pd.read_sql_query('select * from place_tb', con=db)

    # id 열의 데이터 타입을 동일하게 맞추기
    all_places_df['id'] = all_places_df['id'].astype(str)

    # API로 가져온 새로운 데이터를 DataFrame으로 변환
    new_data_df = pd.DataFrame(all_data)
    new_data_df['id'] = new_data_df['id'].astype(str)

    # id를 기준으로 교집합, 차집합 찾기
    common_ids = all_places_df.merge(new_data_df, on='id')['id']
    to_delete = all_places_df[~all_places_df['id'].isin(common_ids)]
    to_insert = new_data_df[~new_data_df['id'].isin(all_places_df['id'])]

    # 삭제 필드 업데이트
    if not to_delete.empty:
        delete_query = (f"UPDATE place_tb SET is_delete = TRUE, update_at = '{datetime.now()}' "
                        f"WHERE id IN ({','.join(map(str, to_delete['id'].tolist()))})")
        with db.cursor() as cursor:
            cursor.execute(delete_query)
            db.commit()

    # 새로운 데이터 삽입
    if not to_insert.empty:
        to_insert_records = to_insert.to_dict(orient='records')
        for record in to_insert_records:
            columns = ', '.join(record.keys())
            values = ', '.join([f"'{str(v)}'" for v in record.values()])
            insert_query = f"INSERT INTO place_tb ({columns}) VALUES ({values})"
            with db.cursor() as cursor:
                cursor.execute(insert_query)

        db.commit()

    end_db_update = time.time()

    print(f"총 경과 시간: {end_db_update - start_time} seconds")
    print(f"카카오맵 api에 장소 리퀘스트 소요 시간: {end_kakao_request - start_time} seconds")
    print(f"db status 업데이트 소요 시간: {end_db_update - end_kakao_request} seconds")

    return jsonify({"response": "complete"}), 201

