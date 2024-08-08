import { atom } from "recoil";
export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    myUUID: "",
    isHost: false,
    isLogin: false,
    departure: {},
    duration: null, //소요시간
    route: null, //중심지까지 경로
    profileImageUrl: null, // 이미지
    nickname: null,
    email: null,
    winningRate: {},
    meetingHistory: [],
  },
});
