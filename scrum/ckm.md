# 20240723 한일
- 여기에서 OSRM 영감받았습니다.
    https://deview.kr/data/deview/session/attach/1000_T1_%E1%84%8B%E1%85%B5%E1%84%89%E1%85%A5%E1%86%A8%E1%84%8B%E1%85%AF%E1%86%AB_%E1%84%8C%E1%85%AE%E1%84%82%E1%85%B5%E1%84%8B%E1%85%A5%20%E1%84%80%E1%85%A2%E1%84%87%E1%85%A1%E1%86%AF%E1%84%8C%E1%85%A1%E1%84%8B%E1%85%B4%20%E1%84%83%E1%85%A9%E1%84%87%E1%85%A9%20%E1%84%80%E1%85%B5%E1%86%AF%E1%84%8E%E1%85%A1%E1%86%BD%E1%84%80%E1%85%B5%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%80%E1%85%A2%E1%84%87%E1%85%A1%E1%86%AF%E1%84%80%E1%85%B5.pdf

- OSRM에 대해서 공부하기

    
- 이 부분 실행 해보기
    https://yongj.in/utility/osrm-routing/

- GTFS 파일을 OSM과 융합해서 구현해보기. (프롬프트)
    https://chatgpt.com/share/3c903b70-54ef-4746-995f-76516c537d4e

# 20240724 한일
OSRM 으로 대중교통 한계가 있다고 생각을 하였습니다.
- 그래서 OpenTripPlanner 2.5.0을 사용해서 최적경로 구축
https://github.com/opentripplanner/OpenTripPlanner/releases/tag/v2.5.0

- 사용한 데이터의 osm은 아래의 링크에서 사용
https://download.geofabrik.de/asia/south-korea.html

- 사용한 gtfs 데이터는 여기서 사용 (2022년도 자료)
https://www.ktdb.go.kr/www/selectBbsNttView.do?key=45&bbsNo=2&nttNo=3704

- 생각해야 할점은 옛날 데이터가 있기때문에, gtfs 데이터를 추가하는 방법을 생각해야 한다.

사용한 명령어

- otp 서버를 킬 때 (같은 위치에 osm, gtfs 가 있어야 함.)
```
java -Xmx16G -jar otp-2.5.0-shaded.jar --build --serve c:/Users/SSAFY/OTP2
```

- 테스트 할 때 사용한 좌표
    - 최적경로 3가지를 추천해준다.

```
http://localhost:8080/otp/routers/default/plan?fromPlace=37.56224, 126.801396&toPlace=37.618741, 126.820845&mode=TRANSIT,WALK&date=2024-07-24&time=08:00am&numItineraries=3
```