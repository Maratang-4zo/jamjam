import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import ResultBox from "../finalresult/ResultBox";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfoAtom } from "../../recoil/atoms/userState";
import { axiosPatchNextMiddle } from "../../apis/mapApi";
import { roomAtom } from "../../recoil/atoms/roomState";
import {
  gameSessionUUIDAtom,
  roundCenterAtom,
} from "../../recoil/atoms/gameState";
import { isMainConnectingAtom } from "../../recoil/atoms/loadingState";
import Loading from "../fixed/Loading";
import modalBg from "../../assets/final/finalModalBg.svg";
import { axiosGetKakaoCalendar } from "../../apis/loginApi";
import { useWebSocket } from "../../context/WebsocketContext";
import { useNavigate } from "react-router-dom";
import { useLeave } from "../../hooks/useLeave";

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

const fadeIn = (top) => keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(${parseInt(top) + 20}px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(${parseInt(top)}); 
  }
`;

const fadeIn2 = (top) => keyframes`
0% { 
  opacity: 0; 
}
100% { 
  opacity: 1; 
}
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  animation: ${fadeIn(0)} 2s ease-in-out;
`;

const AnimatedButton = styled.button`
  height: 60px;
  width: 140px;
  padding: 10px 20px;
  font-family: "NewGalmuriBold";
  font-size: 30px;
  border: none;
  border-radius: 15px;
  border: 2px solid black;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background-color: ${(props) =>
    props.disabled ? "#a9a9a9" : props.theme.subBgColor};
  color: black;
  transition: transform 0.3s;

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "scale(1.1)")};
    background-color: #a9a9a9;
    color: ${(props) => (props.disabled ? "black" : "white")};
    border: ${(props) =>
      props.disabled ? "2px solid black" : "2px solid white"};
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background: transparent;
`;

const ModalWrapper = styled.div`
  animation: ${(props) => fadeIn2(props.top)} 0.5s ease-in-out;
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  transform: translate(-50%, -100%);
  width: 250px;
  height: 100px;
  background-color: #d3d3d3;
  border: 2px solid black;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  top: 40px;
  /* justify-content: center; */
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
  flex-direction: column;
`;

const ModalButton = styled.button`
  height: 40px;
  width: 100px;
  font-family: "NewGalmuriBold";
  font-size: 16px;
  border: 1px solid black;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => props.theme.subBgColor};
  color: black;
  margin-top: 10px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
    background-color: #a9a9a9;
    color: white;
  }
`;

function FinalResult() {
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
  const [mainClicked, setMainClicked] = useState(false);
  const [showMainModal, setShowMainModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { sendReset, sendFinalStation } = useWebSocket();
  const gameSessionUUID = useRecoilValue(gameSessionUUIDAtom);
  const roundCenter = useRecoilValue(roundCenterAtom);
  const [isMainConnecting, setIsMainConnecting] =
    useRecoilState(isMainConnectingAtom);
  const { leaveFn } = useLeave();

  const mainButtonRef = useRef(null);
  const shareButtonRef = useRef(null);

  const handleKeepCenter = async () => {
    try {
      await axiosPatchNextMiddle({
        startStation: roomInfo.centerPlace.name,
      });
      sendFinalStation({
        gameSessionUUID,
        finalStationName: roundCenter.name,
      });
      setShowMainModal(false);
    } catch (err) {
      console.log("중심 장소 변경 실패", err);
      alert("다시 시도해 주세요.");
    }
  };

  const handleResetCenter = async () => {
    sendReset({ gameSessionUUID });
    setShowMainModal(false);
  };

  const handleMainClick = () => {
    setShowMainModal((prev) => !prev);
    setShowShareModal(false);
  };

  const handleShareClick = () => {
    setShowShareModal((prev) => !prev);
    setShowMainModal(false);
  };

  const handleOverlayClick = () => {
    setShowMainModal(false);
    setShowShareModal(false);
  };

  const handleInfoCopyClick = () => {
    const date = new Date(Date.parse(roomInfo.meetingDate));

    const formattedDate = new Intl.DateTimeFormat("ko", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

    const infoText = `${roomInfo.roomName} 모임 결과\n\n- 모임 장소: ${
      roundCenter?.name ? roundCenter.name : roomInfo.centerPlace.name
    }\n- 모임 목적: ${roomInfo.roomPurpose}\n- 모임 날짜: ${formattedDate}`;
    navigator.clipboard
      .writeText(infoText)
      .then(() => {
        alert("모임 정보 복사 완료!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleInfoKakaoClick = async () => {
    try {
      await axiosGetKakaoCalendar(roomInfo.roomUUID);
    } catch (err) {
      console.log("카카오톡 캘린더 연동 실패", err);
      alert("연동 실패! 다시 시도해 주세요");
    }
  };

  const handleExitBtn = async () => {
    if (userInfo.isHost) {
      try {
        await axiosPatchNextMiddle({
          startStation: roomInfo.centerPlace.name,
        });
        alert("방이 정상적으로 종료되었습니다.");
        leaveFn();
        navigate("/");
      } catch (err) {
        console.log("방 종료 실패", err);
      }
    } else {
      alert("권한이 없습니다.");
    }
  };

  return (
    <Wrapper>
      {isMainConnecting ? <Loading message={"로딩"} /> : null}
      <ResultBox />
      <ButtonContainer>
        <AnimatedButton ref={shareButtonRef} onClick={handleShareClick}>
          SHARE
        </AnimatedButton>
        <AnimatedButton
          ref={mainButtonRef}
          disabled={!userInfo.isHost}
          onClick={handleMainClick}
        >
          MAIN
        </AnimatedButton>
        <AnimatedButton disabled={!userInfo.isHost} onClick={handleExitBtn}>
          종료
        </AnimatedButton>
      </ButtonContainer>

      {showMainModal && (
        <>
          <Overlay onClick={handleOverlayClick} />
          <ModalWrapper
            top={`${mainButtonRef.current.getBoundingClientRect().top}px`}
            left={`${
              mainButtonRef.current.getBoundingClientRect().left +
              mainButtonRef.current.offsetWidth / 2
            }px`}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalButton onClick={handleKeepCenter}>유지하기</ModalButton>
            <ModalButton onClick={handleResetCenter}>리셋하기</ModalButton>
          </ModalWrapper>
        </>
      )}

      {showShareModal && (
        <>
          <Overlay onClick={handleOverlayClick} />
          <ModalWrapper
            top={`${shareButtonRef.current.getBoundingClientRect().top - 25}px`}
            left={`${
              shareButtonRef.current.getBoundingClientRect().left +
              shareButtonRef.current.offsetWidth / 2
            }px`}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalButton onClick={handleInfoCopyClick}>복사하기</ModalButton>
            <ModalButton onClick={handleInfoKakaoClick}>카카오톡</ModalButton>
          </ModalWrapper>
        </>
      )}
    </Wrapper>
  );
}

export default FinalResult;
