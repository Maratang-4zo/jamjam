import axios from "axios";
import Cookies from "js-cookie";
// const BASE_URL = `https://jjam.shop`;

// 쿠키에서 accessToken을 가져오는 함수
const getAccessTokenFromCookie = () => {
  return Cookies.get("accessToken");
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: `http://localhost:8080`,
  withCredentials: true,
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessTokenFromCookie(); // 쿠키에서 토큰을 가져옴

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; // Authorization 헤더에 토큰 추가
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 사용자 정보 가져오기 함수
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/api/members/info");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패", error);
    throw error;
  }
};

// 닉네임 업데이트 함수
export const updateUserNickname = async (nickname) => {
  try {
    await axiosInstance.post("/api/members/info", { nickname });
  } catch (error) {
    console.error("닉네임 수정 실패", error);
    throw error;
  }
};

// 승률 가져오기 함수
export const axiosGetWinRate = async () => {
  try {
    const response = await axiosInstance.get("/api/members/game-history");
    return response.data;
  } catch (error) {
    console.error("닉네임 수정 실패", error);
    throw error;
  }
};
