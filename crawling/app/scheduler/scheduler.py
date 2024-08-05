import time
import pandas as pd
from app.crawler.crawler import crawling_places
from app.models.model import LocalInfo
from apscheduler.schedulers.background import BackgroundScheduler
from app import app


# 스케줄러 작업 함수
def scheduler_add_data():
    print("Scheduler_Add_Data is alive!")
    start_time = time.time()  # 시작 시간 측정

    with app.app_context():  # 애플리케이션 컨텍스트 설정
        all_data = []

        data = crawling_places() # API를 통해 데이터 수집

        if isinstance(data, list):  # data가 리스트 형태로 반환되었는지 확인
            all_data.extend(data)
        else:
            print("Invalid data format")
            return

        end_kakao_request = time.time()  # 카카오맵 API로 장소 요청 후 받아오는 시간 측정

        # API로 가져온 새로운 데이터를 DataFrame으로 변환
        new_data_df = pd.DataFrame(all_data)
        new_data_df['id'] = new_data_df['id'].astype(str)

        # DB에 있는 Place 데이터 가져오기
        existing_data = LocalInfo.get_all_places()

        if len(existing_data) == 0:  # DB에 아무 데이터가 없다면 새로운 데이터 삽입
            LocalInfo.bulk_insert(new_data_df.to_dict(orient='records'))
        else:
            existing_data_df = pd.DataFrame(existing_data)
            existing_data_df['id'] = existing_data_df['id'].astype(str)  # id 열의 데이터 타입을 동일하게 맞추기
            update_database(new_data_df, existing_data_df)

        end_db_update = time.time()

        print(f"총 경과 시간: {end_db_update - start_time} seconds")
        print(f"카카오맵 api에 장소 리퀘스트 소요 시간: {end_kakao_request - start_time} seconds")
        print(f"db status 업데이트 소요 시간: {end_db_update - end_kakao_request} seconds")


def update_database(new_data_df, existing_data_df):
    """데이터베이스 업데이트 함수"""
    if existing_data_df.empty:
        LocalInfo.bulk_insert(new_data_df.to_dict(orient='records'))
        return

    # id를 기준으로 교집합, 차집합 찾기
    common_ids = existing_data_df.merge(new_data_df, on='id')['id']  # 합집합
    to_delete = existing_data_df[~existing_data_df['id'].isin(common_ids)]  # 차집합: old-new
    to_insert = new_data_df[~new_data_df['id'].isin(existing_data_df['id'])]  # 차집합: new-old
    to_update = new_data_df[new_data_df['id'].isin(existing_data_df['id'])]  # 교집합

    # 삭제 필드 업데이트
    LocalInfo.bulk_delete(to_delete['id'].tolist())

    # 새로운 데이터 삽입
    LocalInfo.bulk_insert(to_insert.to_dict(orient='records'))

    # 교집합 부분 업데이트
    for _, row in to_update.iterrows():
        LocalInfo.update_place(row['id'], row.to_dict())


# 스케줄러 시작 함수
def start_scheduler():
    # timezone을 설정해두지 않으면 경고문구가 뜰 수 있다!
    # BackgroundScheduler을 통해 schedule 인스턴스를 생성한다.
    schedule = BackgroundScheduler(daemon=True, timezone='Asia/Seoul')

    # 추가하고 싶은 작업을 add_job 매서드를 통해 설정한다.
    # 작업을 매주 월요일 3:00 AM에 실행하도록 설정한다.
    schedule.add_job(scheduler_add_data, 'cron', day_of_week='mon', hour=3, minute=0)

    # 스케줄을 start()로 호출한다
    schedule.start()

