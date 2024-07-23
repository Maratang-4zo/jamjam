import requests
from config import KAKAO_REST_API_KEY, KAKAO_SEARCH_KEYWORD_URL

def getPlaces(keyword, center_lat, center_lon):

    # 요청 헤더
    headers = {
        'Authorization': f'KakaoAK {KAKAO_REST_API_KEY}'
    }

    # 요청 파라미터
    params = {
        'query': keyword,
        'x': center_lon,
        'y': center_lat,
        'radius': 1000,  # 반경 1km (미터 단위)
        'size': 5  # 한 페이지에 가져올 결과 수 (최대 15개)
        # 'sort': 'distance'  # 정렬 옵션 (거리순)
    }

    response = requests.get(KAKAO_SEARCH_KEYWORD_URL, headers=headers, params=params) # API 호출

    data = response.json() # JSON 응답

    # 파싱
    places = []
    for place in data['documents']:
        print(place)
        print('---------------------------------')
        place_info = {
            'name': place['place_name'],
            'road_address': place['road_address_name'],
            'address': place['address_name'],
            'phone': place.get('phone', '정보 없음'),
            'latitude': place['y'],
            'longitude': place['x']
        }
        places.append(place_info)

    return places
