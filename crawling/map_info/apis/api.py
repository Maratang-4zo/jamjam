from map_info.kakao_map_crawling import getPlaces
from map_info import app, db
from flask import jsonify
from ..models.model import Result

# 지도 데이터 크롤링 후 db 저장
@app.route('/crawling', methods=["POST"])
def addData():

    data = getPlaces('스터디룸', 37.4996, 127.0369) # 중심 위도, 경도 (역삼역)

    if isinstance(data, list): # data가 리스트 형태로 반환되었는지 확인
        for item in data:
            new_result = Result(**item)
            db.session.add(new_result)
        db.session.commit()
        return jsonify({"response": "complete"}), 201
    else:
        return jsonify({"error": "Invalid data format"}), 400