import { atom } from "recoil";

export const playerState = atom({
  key: "playerState",
  default: [],
});

export const selectedGameAtom = atom({
  key: "selectedGame",
  default: 0,
});
