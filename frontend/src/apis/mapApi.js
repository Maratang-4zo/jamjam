import axios from "axios";

const BASE_URL = `http://i11a604.p.ssafy.io:8080`;

// 중심 장소 정보 가져오기
export function axiosGetMiddle({ roomId }) {
  return axios
    .get(BASE_URL + `/api/rooms/${roomId}/middle`)
    .then((res) => {
      console.log("중심장소 가져오기 완료");
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      console.error("중심장소 가져오기 실패");
      console.log(err);
    });
}
