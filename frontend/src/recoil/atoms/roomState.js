import { atom } from "recoil";

export const roomAtom = atom({
  key: "roomState",
  default: {
    roomUUID: null,
    sessionId: null,
    roomName: "방 이름 예시",
    attendants: [
      {
        nickname: "김민경",
        attendeeUUID: "abcd1234",
      },
    ],
    host: {},
    hostUUID: "",
    isAllHasDeparture: true, // 모두가 출발지 입력을 함
    isCenterExist: false,
    isAllReadyToGame: false,
    centerPlace: { address: "", latitude: 0, longitude: 0 },
    isValid: false,
  },
});

export const chatAtom = atom({
  key: "chat",
  default: [
    {
      nickname: "김민경",
      content: "이건 김민경 메시지야",
      senderUUID: "1234abcd",
      timestamp: "",
    },
    {
      nickname: "김민경",
      content: "이건 김민경 메시지야",
      senderUUID: "1234abcd",
      timestamp: "",
    },
    {
      nickname: "김민경",
      content: "이건 김민경 메시지야",
      senderUUID: "1234abcd",
      timestamp: "",
    },
    {
      nickname: "김민경",
      content: "이건 김민경 메시지야",
      senderUUID: "1234abcd",
      timestamp: "",
    },
    { nickname: "김민", content: "야", senderUUID: "1234acd", timestamp: "" },
    {
      nickname: "김민경",
      content: "이건 김민경 메시지야",
      senderUUID: "1234abcd",
      timestamp: "",
    },
    { nickname: "김민", content: "야", senderUUID: "1234acd", timestamp: "" },
    { nickname: "김민", content: "야", senderUUID: "1234acd", timestamp: "" },
    {
      nickname: "김민경",
      content: "이건 김민경 메시지야",
      senderUUID: "1234abcd",
      timestamp: "",
    },
    {
      nickname: "김민경",
      content: "이건 김민경 메시지야",
      senderUUID: "1234abcd",
      timestamp: "",
    },
  ],
});

export const chatModalVisibleAtom = atom({
  key: "chatModalVisible",
  default: false,
});
