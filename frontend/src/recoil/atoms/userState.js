import { atom } from "recoil";

export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    isHost: false,
    isLogin: false,
    departure: {
      addressText: "",
      latitude: null,
      longitude: null,
    },
    time: null,
    route: null,
    profile: null, // 이미지
    nickname: "",
    email: "",
    winningRate: {},
    meetingHistory: [],
  },
});
