import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../apis/loginApi";

function Auth() {
  // useNavigate 함수: 로그인 후 사용자를 특정 경로로 이동
  const navigate = useNavigate();

  // useEffect 함수: URL에서 인가 코드를 추출 & 엑세스 토큰을 받아옴
  useEffect(() => {
    const fetchToken = async () => {
      const code = new URL(window.location.href).searchParams.get("code");
      try {
        const res = await getToken(code);
        localStorage.setItem("token", JSON.stringify(res.data.access_token));
        // 로그인 이후 사용자를 홈 페이지로 redirect

        await sendTokenToBackend(accessToken);

        navigate("/");
      } catch (err) {
        console.log(err);
      }
    };
    //  fetchToken 비동기 함수: 카카오로부터 인가 코드를 이용해 액세스 토큰을 받아오고, 'localStorage' 에 저장
    fetchToken();
  }, [navigate]);

  const sendTokenToBackend = async (token) => {
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

  return <></>;
}

export default Auth;
