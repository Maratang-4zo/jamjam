import { atom } from "recoil";

export const roomAtom = atom({
  key: "roomState",
  default: {
    roomId: null,
    sessionId: null,
    roomName: "",
    attendants: [],
    host: {},
    hostuuid: "",
    isAllHasDeparture: true, // 모두가 출발지 입력을 함
    isCenterExist: false,
    isAllReadyToGame: false,
    centerPlace: { address: "", latitude: 0, longitude: 0 },
    isValid: false,
  },
});

export const chatAtom = atom({
  key: "chat",
  default: [],
});
