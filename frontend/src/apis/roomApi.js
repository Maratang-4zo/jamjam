import axios from "axios";

const BASE_URL = `https://jjam.shop`;

// 방 생성
export function axiosCreateRoom({ purpose, meetingDate, nickname }) {
  const params = {
    name: "",
    purpose,
    meetingDate,
    nickname,
  };

  return axios
    .post(BASE_URL + "/api/rooms", params, {
      withCredentials: true, // 자격 증명을 포함하도록 설정
    })
    .then((res) => {
      console.log("방 생성 완료");
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      console.error("방 생성 실패");
      console.log(err);
    });
}

// 방 참여 todo3
export function axiosJoinRoom({ purpose, meetingDate, nickname }) {
  const params = {
    name: "",
    purpose,
    meetingDate,
    nickname,
  };

  return axios
    .post(BASE_URL + "/api/rooms", params)
    .then((res) => {
      console.log("방 생성 완료");
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      console.error("방 생성 실패");
      console.log(err);
    });
}
