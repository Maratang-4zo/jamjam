import { atom } from "recoil";

export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    myUUID: "50105103-dfb7-47f3-8c97-e36b1e44e8de",
    isHost: true,
    isLogin: false,
    departure: null,
    duration: null, //소요시간
    route: null, //중심지까지 경로
    profile: null, // 이미지
    nickname: null,
    email: null,
    winningRate: {},
    meetingHistory: [],
  },
});
