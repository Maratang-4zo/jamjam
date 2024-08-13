import axios from "axios";

const BASE_URL = `https://jjam.shop`;

// 방 생성
export function axiosCreateRoom({ purpose, meetingDate, nickname }) {
  const params = {
    purpose,
    meetingDate,
    nickname,
  };

  return axios.post(BASE_URL + "/api/rooms", params, {
    withCredentials: true, // 자격 증명을 포함하도록 설정
  });
  // .then((res) => {
  //   console.log("방 생성 완료");
  //   console.log(res);
  // })
  // .catch((err) => {
  //   console.error("방 생성 실패");
  //   console.log(err);
  // });
}

// 방 유효성 검사
export function axiosIsRoomValid({ roomUUID }) {
  return axios.get(BASE_URL + `/api/rooms/${roomUUID}/exists`);
}

// 방 정보 받기
export function axiosGetRoomInfo({ roomUUID }) {
  return axios.get(BASE_URL + `/api/rooms/${roomUUID}`);
}

// 방 참여 요청
export function axiosAttendRoom({ roomUUID, nickname }) {
  const params = {
    roomUUID,
    nickname,
  };

  return axios.post(BASE_URL + `/api/rooms/${roomUUID}/join`, params);
}

// 방 정보 변경
export function axiosPatchRoomInfo({
  roomUUID,
  meetingDate,
  roomPurpose,
  roomName,
}) {
  const params = {
    meetingDay: meetingDate,
    name: roomName,
    purpose: roomPurpose,
  };

  return axios.patch(BASE_URL + `/api/rooms/${roomUUID}/`, params);
}
