INSERT INTO name (nick_id, name)
SELECT * FROM (
                  SELECT 1, '호랑이' UNION ALL
                  SELECT 2, '토끼' UNION ALL
                  SELECT 3, '사자' UNION ALL
                  SELECT 4, '코끼리' UNION ALL
                  SELECT 5, '여우' UNION ALL
                  SELECT 6, '늑대' UNION ALL
                  SELECT 7, '곰' UNION ALL
                  SELECT 8, '원숭이' UNION ALL
                  SELECT 9, '말' UNION ALL
                  SELECT 10, '돼지' UNION ALL
                  SELECT 11, '고양이' UNION ALL
                  SELECT 12, '개' UNION ALL
                  SELECT 13, '양' UNION ALL
                  SELECT 14, '소' UNION ALL
                  SELECT 15, '염소' UNION ALL
                  SELECT 16, '치타' UNION ALL
                  SELECT 17, '표범' UNION ALL
                  SELECT 18, '사슴' UNION ALL
                  SELECT 19, '여우' UNION ALL
                  SELECT 20, '너구리' UNION ALL
                  SELECT 21, '판다' UNION ALL
                  SELECT 22, '고릴라' UNION ALL
                  SELECT 23, '악어' UNION ALL
                  SELECT 24, '하마' UNION ALL
                  SELECT 25, '코뿔소' UNION ALL
                  SELECT 26, '얼룩말' UNION ALL
                  SELECT 27, '기린' UNION ALL
                  SELECT 28, '캥거루' UNION ALL
                  SELECT 29, '왈라비' UNION ALL
                  SELECT 30, '낙타' UNION ALL
                  SELECT 31, '양' UNION ALL
                  SELECT 32, '사슴' UNION ALL
                  SELECT 33, '비버' UNION ALL
                  SELECT 34, '수달' UNION ALL
                  SELECT 35, '라쿤' UNION ALL
                  SELECT 36, '호랑이' UNION ALL
                  SELECT 37, '토끼' UNION ALL
                  SELECT 38, '사자' UNION ALL
                  SELECT 39, '코끼리' UNION ALL
                  SELECT 40, '여우' UNION ALL
                  SELECT 41, '늑대' UNION ALL
                  SELECT 42, '곰' UNION ALL
                  SELECT 43, '원숭이' UNION ALL
                  SELECT 44, '말' UNION ALL
                  SELECT 45, '돼지' UNION ALL
                  SELECT 46, '고양이' UNION ALL
                  SELECT 47, '개' UNION ALL
                  SELECT 48, '양' UNION ALL
                  SELECT 49, '소' UNION ALL
                  SELECT 50, '염소' UNION ALL
                  SELECT 51, '치타' UNION ALL
                  SELECT 52, '표범' UNION ALL
                  SELECT 53, '사슴' UNION ALL
                  SELECT 54, '여우' UNION ALL
                  SELECT 55, '너구리' UNION ALL
                  SELECT 56, '판다' UNION ALL
                  SELECT 57, '고릴라' UNION ALL
                  SELECT 58, '악어' UNION ALL
                  SELECT 59, '하마' UNION ALL
                  SELECT 60, '코뿔소' UNION ALL
                  SELECT 61, '얼룩말' UNION ALL
                  SELECT 62, '기린' UNION ALL
                  SELECT 63, '캥거루' UNION ALL
                  SELECT 64, '왈라비' UNION ALL
                  SELECT 65, '낙타' UNION ALL
                  SELECT 66, '양' UNION ALL
                  SELECT 67, '사슴' UNION ALL
                  SELECT 68, '비버' UNION ALL
                  SELECT 69, '수달' UNION ALL
                  SELECT 70, '라쿤' UNION ALL
                  SELECT 71, '호랑이' UNION ALL
                  SELECT 72, '토끼' UNION ALL
                  SELECT 73, '사자' UNION ALL
                  SELECT 74, '코끼리' UNION ALL
                  SELECT 75, '여우' UNION ALL
                  SELECT 76, '늑대' UNION ALL
                  SELECT 77, '곰' UNION ALL
                  SELECT 78, '원숭이' UNION ALL
                  SELECT 79, '말' UNION ALL
                  SELECT 80, '돼지' UNION ALL
                  SELECT 81, '고양이' UNION ALL
                  SELECT 82, '개' UNION ALL
                  SELECT 83, '양' UNION ALL
                  SELECT 84, '소' UNION ALL
                  SELECT 85, '염소' UNION ALL
                  SELECT 86, '치타' UNION ALL
                  SELECT 87, '표범' UNION ALL
                  SELECT 88, '사슴' UNION ALL
                  SELECT 89, '여우' UNION ALL
                  SELECT 90, '너구리' UNION ALL
                  SELECT 91, '판다' UNION ALL
                  SELECT 92, '고릴라' UNION ALL
                  SELECT 93, '악어' UNION ALL
                  SELECT 94, '하마' UNION ALL
                  SELECT 95, '코뿔소' UNION ALL
                  SELECT 96, '얼룩말' UNION ALL
                  SELECT 97, '기린' UNION ALL
                  SELECT 98, '캥거루' UNION ALL
                  SELECT 99, '왈라비' UNION ALL
                  SELECT 100, '낙타'
              ) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM name WHERE nick_id = 1);

-- Similarly for the `nick` table
INSERT INTO nick (nick_id, nick)
SELECT * FROM (
                  SELECT 1, '씩씩한' UNION ALL
                  SELECT 2, '기분좋은' UNION ALL
                  SELECT 3, '당당한' UNION ALL
                  SELECT 4, '활기찬' UNION ALL
                  SELECT 5, '명랑한' UNION ALL
                  SELECT 6, '용감한' UNION ALL
                  SELECT 7, '기운찬' UNION ALL
                  SELECT 8, '힘찬' UNION ALL
                  SELECT 9, '즐거운' UNION ALL
                  SELECT 10, '행복한' UNION ALL
                  SELECT 11, '활발한' UNION ALL
                  SELECT 12, '밝은' UNION ALL
                  SELECT 13, '당찬' UNION ALL
                  SELECT 14, '자신감있는' UNION ALL
                  SELECT 15, '사려깊은' UNION ALL
                  SELECT 16, '겸손한' UNION ALL
                  SELECT 17, '인내심있는' UNION ALL
                  SELECT 18, '호기심많은' UNION ALL
                  SELECT 19, '재치있는' UNION ALL
                  SELECT 20, '총명한' UNION ALL
                  SELECT 21, '창의적인' UNION ALL
                  SELECT 22, '현명한' UNION ALL
                  SELECT 23, '침착한' UNION ALL
                  SELECT 24, '유쾌한' UNION ALL
                  SELECT 25, '온화한' UNION ALL
                  SELECT 26, '정직한' UNION ALL
                  SELECT 27, '친절한' UNION ALL
                  SELECT 28, '배려하는' UNION ALL
                  SELECT 29, '사려깊은' UNION ALL
                  SELECT 30, '용감한' UNION ALL
                  SELECT 31, '씩씩한' UNION ALL
                  SELECT 32, '기분좋은' UNION ALL
                  SELECT 33, '당당한' UNION ALL
                  SELECT 34, '활기찬' UNION ALL
                  SELECT 35, '명랑한' UNION ALL
                  SELECT 36, '용감한' UNION ALL
                  SELECT 37, '기운찬' UNION ALL
                  SELECT 38, '힘찬' UNION ALL
                  SELECT 39, '즐거운' UNION ALL
                  SELECT 40, '행복한' UNION ALL
                  SELECT 41, '활발한' UNION ALL
                  SELECT 42, '밝은' UNION ALL
                  SELECT 43, '당찬' UNION ALL
                  SELECT 44, '자신감있는' UNION ALL
                  SELECT 45, '사려깊은' UNION ALL
                  SELECT 46, '겸손한' UNION ALL
                  SELECT 47, '인내심있는' UNION ALL
                  SELECT 48, '호기심많은' UNION ALL
                  SELECT 49, '재치있는' UNION ALL
                  SELECT 50, '총명한' UNION ALL
                  SELECT 51, '창의적인' UNION ALL
                  SELECT 52, '현명한' UNION ALL
                  SELECT 53, '침착한' UNION ALL
                  SELECT 54, '유쾌한' UNION ALL
                  SELECT 55, '온화한' UNION ALL
                  SELECT 56, '정직한' UNION ALL
                  SELECT 57, '친절한' UNION ALL
                  SELECT 58, '배려하는' UNION ALL
                  SELECT 59, '사려깊은' UNION ALL
                  SELECT 60, '용감한' UNION ALL
                  SELECT 61, '씩씩한' UNION ALL
                  SELECT 62, '기분좋은' UNION ALL
                  SELECT 63, '당당한' UNION ALL
                  SELECT 64, '활기찬' UNION ALL
                  SELECT 65, '명랑한' UNION ALL
                  SELECT 66, '용감한' UNION ALL
                  SELECT 67, '기운찬' UNION ALL
                  SELECT 68, '힘찬' UNION ALL
                  SELECT 69, '즐거운' UNION ALL
                  SELECT 70, '행복한' UNION ALL
                  SELECT 71, '활발한' UNION ALL
                  SELECT 72, '밝은' UNION ALL
                  SELECT 73, '당찬' UNION ALL
                  SELECT 74, '자신감있는' UNION ALL
                  SELECT 75, '사려깊은' UNION ALL
                  SELECT 76, '겸손한' UNION ALL
                  SELECT 77, '인내심있는' UNION ALL
                  SELECT 78, '호기심많은' UNION ALL
                  SELECT 79, '재치있는' UNION ALL
                  SELECT 80, '총명한' UNION ALL
                  SELECT 81, '창의적인' UNION ALL
                  SELECT 82, '현명한' UNION ALL
                  SELECT 83, '침착한' UNION ALL
                  SELECT 84, '유쾌한' UNION ALL
                  SELECT 85, '온화한' UNION ALL
                  SELECT 86, '정직한' UNION ALL
                  SELECT 87, '친절한' UNION ALL
                  SELECT 88, '배려하는' UNION ALL
                  SELECT 89, '사려깊은' UNION ALL
                  SELECT 90, '용감한' UNION ALL
                  SELECT 91, '씩씩한' UNION ALL
                  SELECT 92, '기분좋은' UNION ALL
                  SELECT 93, '당당한' UNION ALL
                  SELECT 94, '활기찬' UNION ALL
                  SELECT 95, '명랑한' UNION ALL
                  SELECT 96, '용감한' UNION ALL
                  SELECT 97, '기운찬' UNION ALL
                  SELECT 98, '힘찬' UNION ALL
                  SELECT 99, '즐거운' UNION ALL
                  SELECT 100, '행복한'
              ) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM nick WHERE nick_id = 1);

INSERT INTO game (game_id, name, `order`, is_use, difficulty, description)
VALUES
    (1, '영차', 1, 0, 1, '마우스 클릭으로 가장 먼저 위로 올라가는 사람이 승리!'),
    (2, 'BigInteger', 2, 0, 0, '가장 큰 숫자를 뽑은 사람이 승리!'),
    (3, '숨은 jamjam 찾기', 3, 0, 2, '그림 속에 숨은 jamjam이를 가장 먼저 찾은 사람이 승리!')
    ON DUPLICATE KEY UPDATE
                         game_id = VALUES(game_id);


