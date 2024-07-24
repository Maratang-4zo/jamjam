from datetime import datetime

from map_info.kakao_map_crawling import get_places
from map_info import app, db
from flask import jsonify, request
from ..models.place import Place

# 지도 데이터 크롤링 후 db 저장
@app.route('/crawling', methods=["POST"])
def addData():

    # keywords = ['스터디룸', '식당', '카페']
    keywords = ['공원']
    for keyword in keywords:
        data = get_places(keyword)
        if isinstance(data, list): # data가 리스트 형태로 반환되었는지 확인

            # TODO: 여기서 select all 로 한번에 받아오기

            for item in data:
                # db에는 있는 정보인데 api에서 받아오지 못하면 -> 폐업한 곳 -> is_delete를 True로 업데이트
                existing_place = Place.query.filter_by(id=item['id']).first()
                if existing_place:
                    existing_place.is_delete = True
                    existing_place.update_time = datetime.now()
                else:
                    new_result = Place(**item)
                    db.session.add(new_result)
            db.session.commit()
        else:
            return jsonify({"error": "Invalid data format"}), 400
    return jsonify({"response": "complete"}), 201
