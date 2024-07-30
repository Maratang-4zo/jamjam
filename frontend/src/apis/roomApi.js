import axios from "axios";

const BASE_URL = `http://i11a604.p.ssafy.io:8080`;

// 방 생성
export function axiosCreateRoom({ purpose, meetingDate, nickname }) {
  const params = {
    name: "",
    purpose,
    meetingDate,
    nickname,
  };

  axios
    .post(BASE_URL + "/api/rooms", params)
    .then((res) => {
      console.log("방 생성 완료");
      console.log(res);
    })
    .catch((err) => {
      console.error("방 생성 실패");
      console.log(err);
    });
}
