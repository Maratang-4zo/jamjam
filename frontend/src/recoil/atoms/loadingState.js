import { atom } from "recoil";

// 중심찾기 로딩
export const isFindCenterLoadingAtom = atom({
  key: "isFindCenterLoading",
  default: false,
});

// 방 중심 위치 수정
// final result 버튼 누르면 true -> useWs에서 axios 호출끝나면 false
export const isCenterMoveLoadingAtom = atom({
  key: "isCenterMoveLoading",
  default: false,
});

// 중심역 변경 이력
export const isHistoryLoadingAtom = atom({
  key: "isHistoryLoading",
  default: false,
});

// 게임 끝나고 중심역 3개 로딩
export const isThreeStationLoadingAtom = atom({
  key: "isThreeStationLoading",
  default: false,
});

// 메인화면으로 넘어갈 때
export const isMainConnectingAtom = atom({
  key: "isMainConnecting",
  default: false,
});

// 방장이 나갔을 때
export const isHostOutAtom = atom({
  key: "isHostOut",
  default: false,
});
