import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const APP_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

// 카카오 인증 서버로부터 액세스 토큰 받아오기
export const getToken = async (code) => {
  const res = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    {
      grant_type: "authorization_code",
      client_id: APP_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
    },
    {
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    },
  );
  return res;
};

// 백엔드로 액세스 토큰 보내기
export const sendTokenToBackend = async (token) => {
  try {
    const response = await axios.post(
      "https://localhost:8080/api/oauth/login",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
  } catch (error) {
    console.error("백엔드에게 토큰 보내기 실패", error);
  }
};

// Auth 컴포넌트
export function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      // 현재 URL에서 인가 코드 추출
      const code = new URL(window.location.href).searchParams.get("code");
      if (!code) {
        console.error("인가 코드를 가져올 수 없습니다.");
        return;
      }

      try {
        // 인가 코드를 이용해 액세스 토큰을 받아옴
        const res = await getToken(code);
        const accessToken = res.data.access_token;
        // // 액세스 토큰을 로컬 스토리지에 저장
        // localStorage.setItem("token", JSON.stringify(accessToken));

        // 백엔드로 액세스 토큰을 보냄
        await sendTokenToBackend(accessToken);

        // 홈 페이지로 리다이렉트
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    };

    // fetchToken 함수를 호출하여 인가 코드로부터 액세스 토큰을 받아옴
    fetchToken();
  }, [navigate]);

  return <></>;
}
