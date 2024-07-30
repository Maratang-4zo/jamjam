import { atom } from "recoil";

export const userPlaceAtom = atom({
  key: "userPlace",
  default: {
    addressText: "hi",
    latitude: null,
    longitude: null,
  },
});

export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    isHost: true,
  },
});
