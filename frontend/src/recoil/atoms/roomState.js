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
    centerPlace: {},
    isValid: false,
  },
});

export const chatAtom = atom({
  key: "chat",
  default: [
    // {
    //   nickname: "김민경",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234abcd",
    //   createdAt: "",
    // },
    // {
    //   nickname: "김민경",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234abcd",
    //   createdAt: "",
    // },
    // {
    //   nickname: "김민경",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234abcd",
    //   createdAt: "",
    // },
    // {
    //   nickname: "김민경",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234abcd",
    //   createdAt: "",
    // },
    // { nickname: "김민", content: "야", senderUUID: "1234acd", createdAt: "" },
    // {
    //   nickname: "김민경",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234abcd",
    //   createdAt: "",
    // },
    // { nickname: "김민", content: "야", senderUUID: "1234acd", createdAt: "" },
    // { nickname: "김민", content: "야", senderUUID: "1234acd", createdAt: "" },
    // {
    //   nickname: "김민경",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234abcd",
    //   createdAt: "",
    // },
    // {
    //   nickname: "김민경",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234abcd",
    //   createdAt: "",
    // },
    // {
    //   nickname: "김수현",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234ㅇㅇabcd",
    //   createdAt: "",
    // },
    // {
    //   nickname: "김수현",
    //   content: "이건 김민경 메시지야",
    //   senderUUID: "1234ㅇㅇabcd",
    //   createdAt: "",
    // },
  ],
});

export const chatModalVisibleAtom = atom({
  key: "chatModalVisible",
  default: false,
});

export const isGameFinishAtom = atom({
  key: "isGameFinish",
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

export const totalRoundAtom = atom({
  key: "totalRound",
  default: 0,
});

export const currentRoundAtom = atom({
  key: "currentRound",
  default: 1,
});

export const currentSpeakersAtom = atom({
  key: "currentSpeakers",
  default: [],
});
