import os
import pandas as pd
import requests
from config import KAKAO_REST_API_KEY, KAKAO_SEARCH_KEYWORD_URL

file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'subwayinfo.csv')
df = pd.read_csv(file_path, header=None, names=['C1', 'C2', 'C3', 'C4', 'C5'])

# 모든 지하철역에 대해 상권정보 요청 및 파싱
def crawling_places():
    keywords = ['스터디룸', '식당', '카페']
    all_places = []

    for keyword in keywords:
        for station_name in df['C1']:
            center_lon, center_lat = get_station_info(station_name)

            if center_lon is None or center_lat is None:
                print(f"Coordinates for {station_name} not found.")
                continue

            page = 1
            while True:
                data = fetch_places_from_api(keyword, center_lat, center_lon, page)
                if not data['documents']:
                    break

                places = parse_places(data, station_name, keyword)
                all_places.extend(places)

                if data.get('meta', {}).get('is_end'):
                    break

                page += 1

    return all_places


# 지하철 이름으로 위/경도 반환
def get_station_info(station_name):
    try:
        # 첫번째로 만나는 역 정보 반환
        station_row = df[df['C1'] == station_name].iloc[0]
        return station_row['C3'], station_row['C4']
    except IndexError:
        return None, None


# 카카오 API로 특정 지하철역에 대한 상권정보 요청
def fetch_places_from_api(keyword, center_lat, center_lon, page):
    # 요청 헤더
    headers = {
        'Authorization': f'KakaoAK {KAKAO_REST_API_KEY}'
    }
    params = {
        'query': keyword,
        'x': center_lat,
        'y': center_lon,
        'radius': 1000,
        'size': 15,
        'page': page
    }
    response = requests.get(KAKAO_SEARCH_KEYWORD_URL, headers=headers, params=params)
    return response.json()


# 카카오 API 응답을 파싱하여 장소 정보 추출
def parse_places(data, station_name, keyword):
    places = []
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
    return places

