import axios from "axios";

const APP_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

// 카카오 인증 서버로부터 액세스 토큰 받아오기
// 여기서 code는 카카오 인증 서버로부터 전달된 인가코드. 이것으로 액세스 토큰 요청

export const getToken = async (code) => {
  const res = await axios.post(
    // 카카오의 토큰 발급 API 엔드포인트
    "https://kauth.kakao.com/oauth/token",
    {
      grant_type: "authorization_code",
      clinet_id: APP_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
    },
    {
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  );
  // 액세스 토큰은 res.data 에 들어있음!!
  return res;
};

// getUserData 함수: 카카오 API 로부터 사용자 데이터를 받아옴
export const getUserData = async (token) => {
  const user = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  return user.data;
};
