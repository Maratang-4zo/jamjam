import time
import pandas as pd
from app.crawling import get_places
from app.models import Place
from app import app
from flask import jsonify

# 지도 데이터 크롤링 후 db 저장
@app.route('/flask/crawling', methods=["POST"])
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

    # API로 가져온 새로운 데이터를 DataFrame으로 변환
    new_data_df = pd.DataFrame(all_data)
    new_data_df['id'] = new_data_df['id'].astype(str)

    # DB에 있는 Place 데이터 가져오기
    all_places = Place.get_all_places()

    if len(all_places) == 0: # DB에 아무 데이터가 없다면 새로운 데이터 삽입
        Place.bulk_insert(new_data_df.to_dict(orient='records'))
    else:
        all_places_df = pd.DataFrame(all_places)
        all_places_df['id'] = all_places_df['id'].astype(str) # id 열의 데이터 타입을 동일하게 맞추기

        # id를 기준으로 교집합, 차집합 찾기
        common_ids = all_places_df.merge(new_data_df, on='id')['id'] # 합집합
        to_delete = all_places_df[~all_places_df['id'].isin(common_ids)] # 차집합: old-new
        to_insert = new_data_df[~new_data_df['id'].isin(all_places_df['id'])] # 차집합: new-old
        to_update = new_data_df[new_data_df['id'].isin(all_places_df['id'])] # 교집합

        # 삭제 필드 업데이트
        Place.bulk_delete(to_delete['id'].tolist())

        # 새로운 데이터 삽입
        Place.bulk_insert(to_insert.to_dict(orient='records'))

        # 교집합 부분 업데이트
        for _, row in to_update.iterrows():
            Place.update_place(row['id'], row.to_dict())

    end_db_update = time.time()

    print(f"총 경과 시간: {end_db_update - start_time} seconds")
    print(f"카카오맵 api에 장소 리퀘스트 소요 시간: {end_kakao_request - start_time} seconds")
    print(f"db status 업데이트 소요 시간: {end_db_update - end_kakao_request} seconds")

    return jsonify({"response": "complete"}), 201


@app.route('/flask/check', methods=["GET"])
def healthCheck():
    return jsonify({"response": "ok"}), 200

@app.route('/flask/db/check', methods=["POST"])
def connectionCheck():
    Place.insert_test()
    return jsonify({"response": "complete"}), 201
