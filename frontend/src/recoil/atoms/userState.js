import { atom } from "recoil";
export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    myUUID: "abcd1234",
    isHost: false,
    isLogin: false,
    departure: {
      address: "서울 강남구 강남대로 298 (역삼동, KB라이프타워)",
      lat: 37,
      lon: 127,
    },
    duration: null, //소요시간
    route: null, //중심지까지 경로
    profileImageUrl: null, // 이미지
    nickname: null,
    email: null,
    winningRate: {},
    meetingHistory: [],
  },
});
