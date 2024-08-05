import React, { useEffect } from "react";
import axios from "axios";

const Auth = () => {
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(
          "https://jjam.shop/api/login/authorize", // "http://70.12.114.94:8080/api/login/authorize"
          {
            withCredentials: true,
          },
        );

        const accessToken = response.headers["accessToken"];
        console.log(accessToken);
        if (accessToken) {
          window.localStorage.setItem("accessToken", accessToken);

          console.log("Access Token:", accessToken);
        } else {
          console.error("토큰을 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error("axios 요청 실패 ", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    };

    fetchToken();
  });

  return <></>;
};

export default Auth;

// import axios from "axios";
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const APP_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
// const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

// // 카카오 인증 서버로부터 액세스 토큰 받아오기
// const getToken = async (code) => {
//   try {
//     console.log("액세스 토큰 요청 시작");
//     console.log("APP_KEY:", APP_KEY);
//     console.log("REDIRECT_URI:", REDIRECT_URI);
//     console.log("code:", code);

//     const res = await axios.post(
//       "https://kauth.kakao.com/oauth/token",
//       {
//         grant_type: "authorization_code",
//         client_id: APP_KEY,
//         redirect_uri: REDIRECT_URI,
//         code: code,
//       },
//       {
//         headers: {
//           "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
//         },
//       },
//     );
//     return res.data;
//   } catch (error) {
//     console.error(
//       "액세스 토큰 받아오기 실패",
//       error.response ? error.response.data : error.message,
//     );
//     throw error;
//   }
// };

// // 백엔드로 액세스 토큰 보내기
// const sendTokenToBackend = async (token) => {
//   try {
//     const response = await axios.post(
//       "https://jjam.shop/api/login",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );
//     const { accessToken, refreshToken } = response.data;

//     // 로컬 스토리지에 저장
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);

//     console.log("Access Token:", accessToken);
//     console.log("Refresh Token:", refreshToken);

//     console.log(response.data);
//   } catch (error) {
//     console.error(
//       "백엔드에게 토큰 보내기 실패",
//       error.response ? error.response.data : error.message,
//     );
//   }
// };

// // Auth 컴포넌트
// const Auth = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchToken = async () => {
//       const code = new URL(window.location.href).searchParams.get("code");
//       if (!code) {
//         console.error("인가 코드를 가져올 수 없습니다.");
//         return;
//       }

//       try {
//         console.log("인가 코드:", code); // 인가 코드 출력
//         const data = await getToken(code);
//         const accessToken = data.access_token;

//         console.log("액세스 토큰:", accessToken); // 액세스 토큰 출력

//         await sendTokenToBackend(accessToken);

//         navigate("/");
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchToken();
//   }, [navigate]);

//   return <></>;
// };

// export default Auth;

// import axios from "axios";
// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const APP_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
// const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

// // 카카오 인증 서버로부터 액세스 토큰 받아오기
// const getToken = async (code) => {
//   try {
//     console.log("액세스 토큰 요청 시작");
//     console.log("APP_KEY:", APP_KEY);
//     console.log("REDIRECT_URI:", REDIRECT_URI);
//     console.log("code:", code);

//     const res = await axios.post(
//       "https://kauth.kakao.com/oauth/token",
//       {
//         grant_type: "authorization_code",
//         client_id: APP_KEY,
//         redirect_uri: REDIRECT_URI,
//         code: code,
//       },
//       {
//         headers: {
//           "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
//         },
//       },
//     );
//     return res.data;
//   } catch (error) {
//     console.error(
//       "액세스 토큰 받아오기 실패",
//       error.response ? error.response.data : error.message,
//     );
//     throw error;
//   }
// };

// // 백엔드로 액세스 토큰 보내기
// const sendTokenToBackend = async (token) => {
//   try {
//     const response = await axios.post(
//       "https://jjam.shop/api/login",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );
//     const { accessToken, refreshToken } = response.data;

//     // 로컬 스토리지에 저장
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);

//     console.log("Access Token:", accessToken);
//     console.log("Refresh Token:", refreshToken);

//     console.log(response.data);
//   } catch (error) {
//     console.error(
//       "백엔드에게 토큰 보내기 실패",
//       error.response ? error.response.data : error.message,
//     );
//   }
// };

// // Auth 컴포넌트
// const Auth = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchToken = async () => {
//       const code = new URL(window.location.href).searchParams.get("code");
//       if (!code) {
//         console.error("인가 코드를 가져올 수 없습니다.");
//         return;
//       }

//       try {
//         console.log("인가 코드:", code); // 인가 코드 출력
//         const data = await getToken(code);
//         const accessToken = data.access_token;

//         console.log("액세스 토큰:", accessToken); // 액세스 토큰 출력

//         await sendTokenToBackend(accessToken);

//         navigate("/");
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchToken();
//   }, [navigate]);

//   return <></>;
// };

// export default Auth;
