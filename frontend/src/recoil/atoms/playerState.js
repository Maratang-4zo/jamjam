import { atom } from "recoil";

export const playerState = atom({
  key: "playerState",
  default: [],
});

export const selectedGameAtom = atom({
  key: "selectedGame",
  default: 0,
});

export const isWinnerAtom = atom({
  key: "isWinner",
  default: false,
});

export const gameRecordUUIDAtom = atom({
  key: "gameRecordUUID",
  default: "",
});

// 중심역 히스토리
export const gameRecordAtom = atom({
  key: "gameRecord",
  default: [
    // {
    //   "round": 1,
    //   "stationName": "이수역",
    //   "attendeeUUID": "김수현uuid" // 라운드 승자
    // },
    // {
    //   "round": 2,
    //   "stationName": "이수역",
    //   "attendeeUUID": "김수현"
    // }
  ],
});

export const totalRoundAtom = atom({
  key: "totalRound",
  default: 0,
});

export const currentRoundAtom = atom({
  key: "currentRound",
  default: 1,
});
