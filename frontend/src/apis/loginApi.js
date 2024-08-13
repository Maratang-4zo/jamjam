import axios from "axios";
import Cookies from "js-cookie";
import { useSetRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/Cookies";

// 쿠키에서 accessToken을 가져오는 함수
const getAccessTokenFromCookie = () => {
  return Cookies.get("accessToken");
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: `https://jjam.shop`,
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

export const useKakaoLogout = () => {
  const navigate = useNavigate();
  const setUserInfo = useSetRecoilState(userInfoAtom);

  const KakaoLogout = async () => {
    try {
      const response = await axiosInstance.post("api/logout");
      setUserInfo(null);
      navigate("/");
    } catch (error) {
      console.error("카카오 로그아웃 실패", error);
    }
  };

  return KakaoLogout;
};
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
export const updateUserNickname = async (newNickname) => {
  try {
    const response = await axiosInstance.patch("/api/members/info", {
      nickname: newNickname,
    });
    return response.data;
  } catch (error) {
    console.error("닉네임 수정 실패", error);
    if (error.response) {
      console.error("서버 응답:", error.response.data);
      throw new Error(`닉네임 수정 실패: ${error.response.data}`);
    } else if (error.request) {
      throw new Error("서버 응답 없음");
    } else {
      throw new Error(`오류 발생: ${error.message}`);
    }
  }
};
// 승률 가져오기 함수
export const axiosGetWinRate = async () => {
  try {
    const response = await axiosInstance.get("/api/members/game-history");
    return response.data;
  } catch (error) {
    console.error("승률 가져오기 실패", error);
    throw error;
  }
};

// 모임 기록 가져오기 함수
export const axiosGetMeetingHistory = async () => {
  try {
    const response = await axiosInstance.get("api/members/room-history");
    return response.data;
  } catch (error) {
    console.error("모임 기록 가져오기 실패");
  }
};

export function axiosGetKakaoCalendar(roomUUID) {
  const Token = getCookie("accessToken");
  return axios.get(`api/summary/kakaoCalendar/${roomUUID}`, {
    headers: {
      Token,
    },
  });
}
