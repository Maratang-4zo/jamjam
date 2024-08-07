import { atom } from "recoil";

export const roomAtom = atom({
  key: "roomState",
  default: {
    roomUUID: null,
    roomName: null,
    meetingDate: null,
    roomPurpose: null,
    attendees: [
      // {
      //   address: null,
      //   lat: null,
      //   lon: null,
      //   nickname: null,
      //   profileImageUrl: null,
      //   duration: null,
      //   route: null,
      //   attendeeUUID: null,
      // },
    ],
    hostUUID: "",
    isAllHasDeparture: false, // 모두가 출발지 입력을 함
    isCenterExist: false,
    isAllReadyToGame: false,
    centerPlace: null,
    // {
    //   name: null,
    //   latitude: null,
    //   longitude: null,
    //   region: null,
    //   subwayLines: [],
    // },
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
  default: [
    // {
    //   name: "범계역",
    //   latitude: 37.38977654,
    //   longitude: 126.9507652,
    //   region: "CAPITAL",
    //   subwayLines: ["LINE_4"],
    //   stores: [
    //     {
    //       name: "숨맑은집 안양범계점",
    //       category: "카페",
    //       roadAddress: "경기 안양시 동안구 평촌대로223번길 44",
    //       address: "경기 안양시 동안구 호계동 1045-8",
    //       phone: "031-441-9550",
    //       latitude: 37.3908,
    //       longitude: 126.953,
    //       updatedAt: "2024-08-04T16:13:33",
    //     },
    //     {
    //       name: "크리에이티브로스터스",
    //       category: "카페",
    //       roadAddress: "경기 안양시 동안구 평촌대로223번길 59",
    //       address: "경기 안양시 동안구 호계동 1046-4",
    //       phone: "",
    //       latitude: 37.3902,
    //       longitude: 126.953,
    //       updatedAt: "2024-08-04T16:13:33",
    //     },
    //   ],
    // },
    // {
    //   name: "평촌역",
    //   latitude: 37.3942323,
    //   longitude: 126.9637945,
    //   region: "CAPITAL",
    //   subwayLines: ["LINE_4", "LINE_2", "LINE_1", "LINE_3"],
    //   stores: [],
    // },
    // {
    //   name: "명학역",
    //   latitude: 37.38445321,
    //   longitude: 126.9355928,
    //   region: "CAPITAL",
    //   subwayLines: ["LINE_1"],
    //   stores: [],
    // },
  ],
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
  default: [
    // "d58414fc-762d-4688-a2d7-abda358ef09d",
    // "d58414fc-762d-4688-a2d7-abda358ef08d",
  ],
});
