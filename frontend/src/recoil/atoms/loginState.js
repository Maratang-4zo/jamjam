import { atom } from "recoil";

// 로그인 모달의 가시성 상태를 관리하는 atom
export const loginModalState = atom({
  key: "loginModalState", // atom의 고유 key
  default: false, // 초기 상태는 모달이 보이지 않는 상태
});
