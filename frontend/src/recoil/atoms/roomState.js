import { atom } from "recoil";

export const roomAtom = atom({
  key: "roomState",
  default: {
    attendants: [],
    isAllHasDeparture: true, // 모두가 출발지 입력을 함
    isCenterExist: false,
    isAllReadyToGame: false,
    centerPlace: { address: "", latitude: 0, longitude: 0 },
  },
});
