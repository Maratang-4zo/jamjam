import axios from "axios";

// export const getToken = async (code) => {
//   try {
//     const res = await axios.post(
//       "https://kauth.kakao.com/oauth/token",
//       {
//         grant_type: "authorization_code",
//         client_id: process.env.REACT_APP_KAKAO_CLIENT_ID,
//         redirect_uri: process.env.REACT_APP_REDIRECT_URI,
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
//     console.error("액세스 토큰 받아오기 실패", error);
//     throw error;
//   }
// };

// export const sendTokenToBackend = async (token) => {
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
//     console.log(response.data);
//   } catch (error) {
//     console.error("백엔드에게 토큰 보내기 실패", error);
//   }
// };

export const getUserInfo = async () => {
  try {
    const response = await axios.get("/api/members/info");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패", error);
    throw error;
  }
};

export const updateUserNickname = async (nickname) => {
  try {
    await axios.post("/api/members/info", { nickname });
  } catch (error) {
    console.error("닉네임 수정 실패", error);
    throw error;
  }
};
