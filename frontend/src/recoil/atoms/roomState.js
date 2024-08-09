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

// export const roomAtom = atom({
//   key: "roomState",
//   default: {
//     roomUUID: "27ac6a00-a9cc-45cb-8734-83854c1f5735",
//     roomName: "방 이름 예시",
//     meetingDate: "2024-08-15T02:00:32.000Z",
//     roomPurpose: "",
//     attendees: [
//       {
//         address: null,
//         lat: null,
//         lon: null,
//         nickname: "string",
//         duration: null,
//         route: null,
//         attendeeUUID: "4c0fb9e0-7060-48ac-b3de-6a97b1a277e2",
//         profileImageUrl:
//           "https://github.com/user-attachments/assets/9ab979f9-50a9-4b79-a755-d135a8772048",
//       },
//       {
//         address: "asdasdas",
//         lat: 37.47708963,
//         lon: 126.9635058,
//         nickname: "string",
//         duration: 32,
//         route: "iuecFo`zeWMi@FFHB@?@?",
//         attendeeUUID: "aef527b7-54b1-4a9c-9f93-315a99ccfa51",
//         // route: null,
//         profileImageUrl:
//           "https://github.com/user-attachments/assets/9ab979f9-50a9-4b79-a755-d135a8772048",
//       },
//       {
//         address: "null",
//         lat: 37.38979,
//         lon: 126.95081,
//         nickname: "mkkim",
//         profileImageUrl:
//           "https://github.com/user-attachments/assets/28991fc0-1e74-4c56-908b-6a133946a39a",
//         duration: "1시간",
//         route:
//           "euecFqazeWc[upA??kl@goA??_{CspA??ug@mi@??sOe}@??ir@qG??so@|a@??gkAhqA??wpAvm@",
//         attendeeUUID: "d58414fc-762d-4688-a2d7-abda358ef08d",
//       },
//       {
//         address: "null",
//         lat: 37.50062,
//         lon: 127.03646,
//         nickname: "김수현",
//         profileImageUrl:
//           "data:image/jpeg;base64,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",
//         duration: "50분",
//         route: "gsvcFcb`fWu]{bB??m`Ao_A??{Kai@??wWwoA??{Oqv@",
//         attendeeUUID: "d58414fc-762d-4688-a2d7-abda358ef09d",
//       },
//     ],
//     host: {},
//     hostUUID: "",
//     isAllHasDeparture: true, // 모두가 출발지 입력을 함
//     isCenterExist: false,
//     isAllReadyToGame: false,
//     centerPlace: {
//       name: "낙성대역",
//       latitude: 37.47708963,
//       longitude: 126.9635058,
//       region: "CAPITAL",
//       subwayLines: ["LINE_2"],
//     },
//     isValid: false,
//   },
// });
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

// export const aroundStationsAtom = atom({
//   key: "aroundStations",
//   default: [
//     {
//       name: "범계역",
//       latitude: 37.38977654,
//       longitude: 126.9507652,
//       region: "CAPITAL",
//       subwayLines: ["LINE_4"],
//       stores: [
//         {
//           name: "숨맑은집 안양범계점",
//           category: "카페",
//           roadAddress: "경기 안양시 동안구 평촌대로223번길 44",
//           address: "경기 안양시 동안구 호계동 1045-8",
//           phone: "031-441-9550",
//           latitude: 37.3908,
//           longitude: 126.953,
//           updatedAt: "2024-08-04T16:13:33",
//         },
//         {
//           name: "크리에이티브로스터스",
//           category: "카페",
//           roadAddress: "경기 안양시 동안구 평촌대로223번길 59",
//           address: "경기 안양시 동안구 호계동 1046-4",
//           phone: "",
//           latitude: 37.3902,
//           longitude: 126.953,
//           updatedAt: "2024-08-04T16:13:33",
//         },
//       ],
//     },
//     {
//       name: "평촌역",
//       latitude: 37.3942323,
//       longitude: 126.9637945,
//       region: "CAPITAL",
//       subwayLines: ["LINE_4"],
//       stores: [
//         {
//           name: "오픈라운지 스터디카페",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 시민대로 202",
//           address: "경기 안양시 동안구 호계동 1042",
//           phone: "",
//           latitude: 37.3915,
//           longitude: 126.953,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "위넌스터디카페 범계역점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 시민대로 187",
//           address: "경기 안양시 동안구 비산동 1112-1",
//           phone: "",
//           latitude: 37.3918,
//           longitude: 126.952,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "마인드스터디카페 범계점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 시민대로 175",
//           address: "경기 안양시 동안구 비산동 1108-1",
//           phone: "010-7177-0726",
//           latitude: 37.3913,
//           longitude: 126.95,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "마인드풀스터디카페 범계점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로217번길 25",
//           address: "경기 안양시 동안구 호계동 1049-2",
//           phone: "",
//           latitude: 37.3904,
//           longitude: 126.954,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "범계역 청년출구",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 동안로 지하 130",
//           address: "경기 안양시 동안구 호계동 1039-2",
//           phone: "031-476-9371",
//           latitude: 37.3897,
//           longitude: 126.951,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "벅스스터디카페",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 경수대로 813",
//           address: "경기 안양시 동안구 호계동 894-20",
//           phone: "",
//           latitude: 37.3919,
//           longitude: 126.944,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "스터디카페 더블루",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 시민대로 175",
//           address: "경기 안양시 동안구 비산동 1108-1",
//           phone: "010-3377-8209",
//           latitude: 37.3913,
//           longitude: 126.95,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "제이24스터디카페 호계점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 경수대로 715",
//           address: "경기 안양시 동안구 호계동 918-19",
//           phone: "",
//           latitude: 37.3855,
//           longitude: 126.951,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "르하임스터디카페 평촌학원가점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로 141",
//           address: "경기 안양시 동안구 호계동 1058",
//           phone: "031-360-6006",
//           latitude: 37.3846,
//           longitude: 126.959,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "포텐스터디카페 안양호계점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 경수대로685번길 3",
//           address: "경기 안양시 동안구 호계동 925-49",
//           phone: "010-2575-6549",
//           latitude: 37.383,
//           longitude: 126.952,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "모임 안양평촌점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로 221",
//           address: "경기 안양시 동안구 호계동 1047-8",
//           phone: "031-383-9227",
//           latitude: 37.3911,
//           longitude: 126.955,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "비에이블스터디카페 평촌센터",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로 133",
//           address: "경기 안양시 동안구 호계동 1058-6",
//           phone: "",
//           latitude: 37.3838,
//           longitude: 126.959,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "반올림스터디카페",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로 140",
//           address: "경기 안양시 동안구 평촌동 900-2",
//           phone: "010-7288-6718",
//           latitude: 37.3848,
//           longitude: 126.96,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "천일문스터디 카페 평촌점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로 141",
//           address: "경기 안양시 동안구 호계동 1058",
//           phone: "031-689-3299",
//           latitude: 37.3846,
//           longitude: 126.959,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "블루문스터디카페 평촌점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로 141",
//           address: "경기 안양시 동안구 호계동 1058",
//           phone: "",
//           latitude: 37.3846,
//           longitude: 126.959,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "타임유 스터디카페 평촌귀인점",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로 140",
//           address: "경기 안양시 동안구 평촌동 900-2",
//           phone: "010-8270-7874",
//           latitude: 37.3848,
//           longitude: 126.96,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "연결고리파티룸",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 관평로182번길 13",
//           address: "경기 안양시 동안구 관양동 1602-3",
//           phone: "",
//           latitude: 37.3935,
//           longitude: 126.961,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//         {
//           name: "카페포토",
//           category: "스터디룸",
//           roadAddress: "경기 안양시 동안구 평촌대로223번길 65",
//           address: "경기 안양시 동안구 호계동 1046-1",
//           phone: "010-4610-5209",
//           latitude: 37.3901,
//           longitude: 126.952,
//           updatedAt: "2024-08-04T16:13:32",
//         },
//       ],
//     },
//     {
//       name: "명학역",
//       latitude: 37.38445321,
//       longitude: 126.9355928,
//       region: "CAPITAL",
//       subwayLines: ["LINE_1"],
//       stores: [],
//     },
//   ],
// });
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

export const roomPageAtom = atom({
  key: "roomPage",
  default: "main", // main, gamechoice, game, gamefinish, result
});
