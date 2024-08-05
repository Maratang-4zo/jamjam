import os
import pandas as pd
import requests
from app.config import KAKAO_REST_API_KEY, KAKAO_SEARCH_KEYWORD_URL

file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'subwayinfo.csv')
df = pd.read_csv(file_path, header=None, names=['C1', 'C2', 'C3', 'C4', 'C5'])

# 지하철 이름으로 위/경도 반환
def get_station_info(station_name):
    try:
        # 첫번째로 만나는 역 정보 반환
        station_row = df[df['C1'] == station_name].iloc[0]
        return station_row['C3'], station_row['C4']
    except IndexError:
        return None, None

# 카카오 API로 모든 지하철역에 대해 상권정보 요청 & 파싱
def get_places(keyword):

    # 요청 헤더
    headers = {
        'Authorization': f'KakaoAK {KAKAO_REST_API_KEY}'
    }

    places = []

    for station_name in df['C1']:

        # 요청 파라미터
        center_lon, center_lat = get_station_info(station_name)

        if center_lon is None or center_lat is None:
            print(f"Coordinates for {keyword} not found.")
            return []

        page = 1
        while True: # 모든 페이지 순회
            params = {
                'query': keyword,
                'x': center_lat,
                'y': center_lon,
                'radius': 1000,  # 반경 1km (미터 단위)
                'size': 15,  # 한 페이지에 가져올 결과 수 (최대 15개)
                'page': page
                # 'sort': 'distance'  # 정렬 옵션 (거리순)
            }

            response = requests.get(KAKAO_SEARCH_KEYWORD_URL, headers=headers, params=params) # API 호출

            data = response.json() # JSON 응답

            # 결과가 없으면 루프 종료
            if not data['documents']:
                break

            # 파싱
            for place in data['documents']:
                place_info = {
                    'station_name': station_name,
                    'name': place['place_name'],
                    'id': place['id'],
                    'category': keyword,
                    'road_address': place['road_address_name'],
                    'address': place['address_name'],
                    'phone': place.get('phone', '정보 없음'),
                    'latitude': place['y'],
                    'longitude': place['x']
                }
                places.append(place_info)

            # 다음 페이지 확인
            if data.get('meta', {}).get('is_end'):
                break

            page += 1  # 다음 페이지로 이동

    return places
