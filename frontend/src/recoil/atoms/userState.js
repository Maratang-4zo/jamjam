import { atom } from "recoil";

export const userPlaceAtom = atom({
  key: "userPlace",
  default: {
    address: "",
    latitude: 0,
    longitude: 0,
  },
});
