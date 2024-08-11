import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import ResultBox from "../finalresult/ResultBox";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfoAtom } from "../../recoil/atoms/userState";
import { axiosPatchNextMiddle } from "../../apis/mapApi";
import { roomAtom } from "../../recoil/atoms/roomState";
import useWs from "../../hooks/useWs";
import {
  gameSessionUUIDAtom,
  roundCenterAtom,
} from "../../recoil/atoms/gameState";
import { isMainConnectingAtom } from "../../recoil/atoms/loadingState";
import Loading from "../fixed/Loading";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  border-left: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  animation: ${fadeIn} 2s ease-in-out;
`;

const AnimatedButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

function FinalResult() {
  const userInfo = useRecoilValue(userInfoAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
  const [mainClicked, setMainClicked] = useState(false);
  const { sendReset, sendFinalStation } = useWs();
  const gameSessionUUID = useRecoilValue(gameSessionUUIDAtom);
  const roundCenter = useRecoilValue(roundCenterAtom);
  const [isMainConnecting, setIsMainConnecting] =
    useRecoilState(isMainConnectingAtom);

  // 방 종료
  const handleExitBtn = async () => {
    if (userInfo.isHost) {
      try {
        const res = await axiosPatchNextMiddle({
          startStation: roomInfo.centerPlace.name,
        });
      } catch (err) {
        console.log("중심 장소 변경 실패", err);
      }
    } else {
      alert("권한이 없습니다.");
    }
  };

  // 중심 장소 변경 후 메인으로
  const handleUpdatedCenter = async () => {
    try {
      const res = await axiosPatchNextMiddle({
        startStation: roomInfo.centerPlace.name,
      });
      setMainClicked(false); // 버튼을 다시 리셋
      sendFinalStation({
        finalStationName: roundCenter.name,
      });
    } catch (err) {
      console.log("중심 장소 변경 실패", err);
      alert("다시 시도해 주세요.");
    }
  };

  // 중심 장소 리셋 후 메인으로
  const handleResetCenter = async () => {
    sendReset({ gameSessionUUID });
    setMainClicked(false); // 버튼을 다시 리셋
  };

  // MAIN 버튼 클릭 핸들러
  const handleMainClick = () => {
    setMainClicked(true);
  };

  return (
    <Wrapper>
      {isMainConnecting ? <Loading message={"로딩"} /> : null}
      <ResultBox />
      <ButtonContainer>
        <AnimatedButton>SHARE</AnimatedButton>
        {mainClicked ? (
          <>
            <AnimatedButton onClick={handleResetCenter}>
              중심역 리셋
            </AnimatedButton>
            <AnimatedButton onClick={handleUpdatedCenter}>
              중심역 유지
            </AnimatedButton>
          </>
        ) : (
          <AnimatedButton disabled={!userInfo.isHost} onClick={handleMainClick}>
            MAIN
          </AnimatedButton>
        )}
        <AnimatedButton disabled={!userInfo.isHost} onClick={handleExitBtn}>
          종료
        </AnimatedButton>
      </ButtonContainer>
    </Wrapper>
  );
}

export default FinalResult;
