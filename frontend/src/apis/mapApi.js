import axios from "axios";
const BASE_URL = `https://jjam.shop`;

// 중심 장소 정보 가져오기
export function axiosGetMiddle({ roomUUID }) {
  return axios
    .get(`${BASE_URL}/api/rooms/${roomUUID}/middle`, {
      withCredentials: true, // 자격 증명을 포함하도록 설정
    })
    .then((res) => {
      console.log("중심장소 가져오기 완료");
      console.log(res);
    })
    .catch((err) => {
      console.error("중심장소 가져오기 실패");
      console.log(err);
    });
}

export function axiosUpdateUserInfo({ address, lat, lon }) {
  return axios.patch(BASE_URL + `/api/attendees`, {
    address,
    lat,
    lon,
  });
}

export function axiosGetThreeStations(roomUUID) {
  return axios.get(BASE_URL + `/api/rooms/${roomUUID}/around`);
}

export function axiosGetAroundStores({ stationName, category }) {
  return axios.get(
    BASE_URL +
      `/api/local-info?stationName=${stationName}&category=${category}`,
  );
}

export function axiosPatchNextMiddle({ roomUUID }) {
  return axios.patch(BASE_URL + `/api/rooms/${roomUUID}/move`);
}
