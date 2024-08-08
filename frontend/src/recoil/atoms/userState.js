import { atom } from "recoil";
export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    myUUID: "abcd1234",
    isHost: false,
    isLogin: false,
    departure: {
      address: "서울 강남구 강남대로 298 (역삼동, KB라이프타워)",
      lat: 37,
      lon: 127,
    },
    duration: null, //소요시간
    route:
      "ydrdFc{aeW@??@@r@DfBDv@I@Bh@J|@Px@^j@n@As@AHLmA`BW\\g@p@aChDoAbBy@hA", //중심지까지 경로
    profileImgUrl:
      "https://github.com/user-attachments/assets/abd3aedb-207c-429f-a47a-8d631a34a41b", // 이미지
    nickname: "김민경",
    email: "",
    winningRate: {},
    meetingHistory: [],
  },
});
