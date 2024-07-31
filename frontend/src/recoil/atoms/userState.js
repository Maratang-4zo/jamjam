import { atom } from "recoil";

export const userPlaceAtom = atom({
  key: "userPlace",
  default: {
    addressText: "",
    latitude: null,
    longitude: null,
  },
});

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
    profile: null,
    nickname: "",
    email: "",
    // winningRate: {},
    // meetingHistory: [],
  },
});
