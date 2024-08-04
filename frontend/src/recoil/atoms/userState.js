import { atom } from "recoil";

export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    myUUID: "abcd1234",
    isHost: true,
    isLogin: false,
    sessionToken: null,
    departure: {
      addressText: "",
      latitude: null,
      longitude: null,
    },
    time: null, //소요시간
    route: null, //중심지까지 경로
    profile: null, // 이미지
    nickname: "김민경",
    email: "",
    winningRate: {},
    meetingHistory: [],
  },
});
