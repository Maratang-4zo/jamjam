import { atom } from "recoil";

export const roomAtom = atom({
  key: "roomState",
  default: {
    roomUUID: "",
    roomName: "어디서 볼래 사당빼고",
    meetingDate: "",
    roomPurpose: "",
    attendees: [],
    host: {},
    hostUUID: "",
    isAllHasDeparture: false, // 모두가 출발지 입력을 함
    isCenterExist: false,
    isAllReadyToGame: false,
    centerPlace: {},
    isValid: false,
  },
});

export const chatAtom = atom({
  key: "chat",
  default: [
    {
      type: "chat",
      nickname: "김민경",
      content: "이건 김민경 메시지야",
      senderUUID: "1234abcd",
      createdAt: "",
    },
    {
      type: "alert",
      alertType: "out",
      nickname: "김민경",
      attendeeUUID: "1234abcd",
    },
  ],
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
  default: "main", // main, gamechoice, game, gamefinish, result
});
