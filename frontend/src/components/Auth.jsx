// import React, { useEffect } from "react";
// import axios from "axios";

// const Auth = () => {
//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         const response = await axios.get(
//           "https://jjam.shop/api/login/authorize", // "http://70.12.114.94:8080/api/login/authorize"
//           {
//             withCredentials: true,
//           },
//         );

//         const accessToken = response.headers["accessToken"];
//         console.log(accessToken);
//         if (accessToken) {
//           window.localStorage.setItem("accessToken", accessToken);

//           console.log("Access Token:", accessToken);
//         } else {
//           console.error("토큰을 가져올 수 없습니다.");
//         }
//       } catch (error) {
//         console.error("axios 요청 실패 ", error);
//         if (error.response) {
//           console.error("Response data:", error.response.data);
//           console.error("Response status:", error.response.status);
//           console.error("Response headers:", error.response.headers);
//         } else if (error.request) {
//           console.error("Request data:", error.request);
//         } else {
//           console.error("Error message:", error.message);
//         }
//       }
//     };

//     fetchToken();
//   });

//   return <></>;
// };

// export default Auth;
