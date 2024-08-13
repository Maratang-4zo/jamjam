import { atom } from "recoil";

export const roomAtom = atom({
  key: "roomState",
  default: {
    roomUUID: "",
    roomName: "",
    meetingDate: "",
    roomPurpose: "",
    attendees: [],
    host: {},
    hostUUID: "",
    isAllHasDeparture: false, // 모두가 출발지 입력을 함
    isCenterExist: false,
    isAllReadyToGame: false,
    centerPlace: {
      name: "사당역",
      latitude: 37.476559992,
      longitude: 126.98163857,
      region: "CAPITAL",
      subwayLines: ["LINE_2", "LINE_4"],
    },
    isValid: false,
  },
});

export const chatAtom = atom({
  key: "chat",
  default: [],
});

export const chatModalVisibleAtom = atom({
  key: "chatModalVisible",
  default: false,
});

export const isNextMiddleExistAtom = atom({
  key: "isNextMiddleExist",
  default: false,
});

export const aroundStationsAtom = atom({
  key: "aroundStations",
  default: [],
});

export const selectedStationAtom = atom({
  key: "selectedStation",
  default: null,
});

export const currentSpeakersAtom = atom({
  key: "currentSpeakers",
  default: [],
});

export const roomPageAtom = atom({
  key: "roomPage",
  default: "result", // main, gamechoice, game, gamefinish, result
});

export const estimatedForceCloseAtAtom = atom({
  key: "estimatedForceCloseAt",
  default: null,
});
