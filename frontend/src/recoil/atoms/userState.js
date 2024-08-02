import { atom } from "recoil";

export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    myUUID: "abcd1234",
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
    nickname: "김민경",
    email: "",
    winningRate: {},
    meetingHistory: [],
  },
});
