# 서버 세팅방법

## ubuntu 서버 폴더 세팅
우분투 폴더 위에 server 아래의 폴더들의 내용을 추가한다.

## 파일 추가 세팅
### jenkins 폴더에 backend의 빌드한 파일을 추가한다.
`jamjam-0.0.1-SNAPSHOT.jar`
### jenkins 폴더에 backend/jamjam/.env 파일을 추가한다.
`.env`
- 이 부분은 exec/1번에 명세되어 있다.

## 파일 실행
./deploy.sh을 실행한다.

## jenkins(docker) 설치
### docker 폴더로 들어간다.
docker compose up -d 를 수행한다.