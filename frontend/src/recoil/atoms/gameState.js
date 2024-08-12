import { atom } from "recoil";

export const playerState = atom({
  key: "playerState",
  default: [],
});

// 어떤 게임을 선택했는지
export const selectedGameAtom = atom({
  key: "selectedGame",
  default: 0,
});

// 내가 승자인지 (현재 라운드)
export const isWinnerAtom = atom({
  key: "isWinner",
  default: false,
});

// 승자가 누구인지 (현재 라운드)
export const winnerUUIDAtom = atom({
  key: "winnerUUID",
  default: "",
});

export const winnerNicknameAtom = atom({
  key: "winnerNickname",
  default: "",
});

// 게임세션 UUID
export const gameSessionUUIDAtom = atom({
  key: "gameSessionUUID",
  default: "",
});

// 중심역 히스토리
export const gameRecordAtom = atom({
  key: "gameRecord",
  default: [],
});

// 전체 몇 라운드로 설정?
export const totalRoundAtom = atom({
  key: "totalRound",
  default: 0,
});

// 현재 라운드
export const currentRoundAtom = atom({
  key: "currentRound",
  default: 1,
});

// 현재 라운드 uuid
export const currentRoundUUIDAtom = atom({
  key: "currentRoundUUID",
  default: "",
});

// 현재 라운드 게임 상태 (게임 전, 게임 중, 게임 끝)
export const gameStateAtom = atom({
  key: "gameState",
  default: "before", // before, ing, end
});

// 게임 시작 카운트
export const gameCountAtom = atom({
  key: "gameCount",
  default: 99,
});

// 전 라운드의 중심을 저장함
export const roundCenterAtom = atom({
  key: "roundCenter",
  default: {},
});
