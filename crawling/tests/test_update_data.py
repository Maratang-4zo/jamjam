import pandas as pd

# 변경된 행의 수 리턴
def update_database(new_data_df, existing_data_df):

    if existing_data_df.empty:
        return len(new_data_df)

    # id를 기준으로 교집합, 차집합 찾기
    common_ids = existing_data_df.merge(new_data_df, on='id')['id']  # 합집합
    to_delete = existing_data_df[~existing_data_df['id'].isin(common_ids)]  # 차집합: old-new
    to_insert = new_data_df[~new_data_df['id'].isin(existing_data_df['id'])]  # 차집합: new-old
    to_update = new_data_df[new_data_df['id'].isin(existing_data_df['id'])]  # 교집합

    print('@@@ to_delete @@@')
    print(to_delete)
    print('@@@ to_insert @@@')
    print(to_insert)
    print('@@@ to_update @@@')
    print(to_update)

    return len(to_delete) + len(to_insert) + len(to_update)

def test_update_database():

    new_data_df = pd.read_csv('tests/new_data.csv') # CSV 파일에서 새로운 데이터 읽기
    existing_data_df = pd.read_csv('tests/existing_data.csv') # CSV 파일에서 기존 데이터 읽기

    changed_rows = update_database(new_data_df, existing_data_df)
    assert changed_rows == 6


