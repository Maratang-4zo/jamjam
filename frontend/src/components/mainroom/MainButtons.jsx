import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import {
  roomAtom,
  chatModalVisibleAtom,
  roomPageAtom,
} from "../../recoil/atoms/roomState";
import { userInfoAtom } from "../../recoil/atoms/userState";
import alertIcon from "../../assets/icons/alertIcon.png";
import questionIcon from "../../assets/icons/questionMark.PNG";
import inviteIcon from "../../assets/icons/inviteIcon.png";
import shareIcon from "../../assets/icons/shareIcon.png";
import updateIcon from "../../assets/icons/updateIcon.png";
import TutorialModal from "./Tutorial";
import Loading from "../fixed/Loading";
import FindDeparture from "./Departure";
import { axiosGetMiddle } from "../../apis/mapApi";
import useWs from "../../hooks/useWs";
import { totalRoundAtom } from "../../recoil/atoms/gameState";

const BottomBtns = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: end;
  gap: 10px;
`;

const BigBtn = styled.button`
  display: flex;
  width: 150px;
  height: 45px;
  padding: 5px 0;
  justify-content: center;
  align-items: center;
  gap: 8.229px;
  flex-shrink: 0;
  border-radius: 15px;
  border: 3px solid #000;
  font-family: "DungGeunMo";
  font-size: 30px;
  background-color: ${(props) => {
    if (props.isTutorialModalOpen) {
      return props.highlight ? props.theme.bgColor : "gray";
    }
    return props.disabled ? "gray" : props.theme.bgColor;
  }};
  color: ${(props) => {
    if (props.isTutorialModalOpen) {
      return props.highlight ? "black" : "lightgray";
    }
    return props.disabled ? "lightgray" : "inherit";
  }};
  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "black")};
    color: ${(props) => (props.disabled ? "none" : props.theme.bgColor)};
    transition: 0.3s;
  }
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  position: ${(props) => (props.isTutorialModalOpen ? "relative" : "static")};
  z-index: ${(props) => (props.isTutorialModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
`;

const SmallBtn = styled.button`
  display: flex;
  width: 45px;
  height: 45px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 15px;
  border: 3px solid #000;
  background: ${(props) => props.theme.subaccentColor + "86"};
  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "#76767685")};
    transition: 0.3s;
  }
  position: ${(props) => (props.isTutorialModalOpen ? "relative" : "static")};
  z-index: ${(props) => (props.isTutorialModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
  span {
    font-size: 35px;
    font-family: "DungGeunMo";
    text-align: center;
  }
`;

const RightTopBtns = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const SmallIcon = styled.img`
  width: 35px;
  height: 35px;
`;

const RoundSetting = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 150px;
  flex-shrink: 0;
  border-radius: 15px 15px 0 0;
  border: 3px solid #000;
  border-bottom: none;
  background-color: ${(props) => props.theme.bgColor};
`;

const RoundBtn = styled.button`
  display: flex;
  width: 50px;
  height: 45px;
  justify-content: center;
  align-items: center;
  border-radius: 12px 0 0 0;
  border: none;
  border-right: 3px solid #000;
  background-color: ${(props) => props.theme.bgColor};
  color: black;
  font-size: 24px;
  &:hover {
    background-color: black;
    color: ${(props) => props.theme.bgColor};
    transition: 0.3s;
  }
  cursor: pointer;
`;

const RoundBtn2 = styled.button`
  display: flex;
  width: 50px;
  height: 45px;
  justify-content: center;
  align-items: center;
  border-radius: 0 12px 0 0;
  border: none;
  border-left: 3px solid #000;
  background-color: ${(props) => props.theme.bgColor};
  color: black;
  font-size: 24px;
  &:hover {
    background-color: black;
    color: ${(props) => props.theme.bgColor};
    transition: 0.3s;
  }
  cursor: pointer;
`;

const RoundBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const OkBtn = styled.button`
  display: flex;
  width: 150px;
  height: 45px;
  padding: 7px 17px;
  justify-content: center;
  align-items: center;
  gap: 8.229px;
  flex-shrink: 0;
  border-radius: 0 0 15px 15px;
  border: 3px solid #000;
  background-color: ${(props) => {
    if (props.isTutorialModalOpen) {
      return props.highlight ? props.theme.bgColor : "gray";
    }
    return props.disabled ? "gray" : props.theme.bgColor;
  }};
  color: ${(props) => {
    if (props.isTutorialModalOpen) {
      return props.highlight ? "black" : "lightgray";
    }
    return props.disabled ? "lightgray" : "inherit";
  }};
  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "black")};
    color: ${(props) => (props.disabled ? "none" : props.theme.bgColor)};
    transition: 0.3s;
  }
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  position: ${(props) => (props.isTutorialModalOpen ? "relative" : "static")};
  z-index: 1100;
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
`;

const AddressButton = styled.button`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff40;
  border: 3px solid #000000;
  border-radius: 14px;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1001; // 적절한 z-index 값 설정
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: ${(props) => (props.isTutorialModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
  p {
    font-family: "NewGalmuriBold";
    color: black;
    width: 100%;
    font-size: 20px;
  }
  &:hover {
    background-color: #00000040;
    transition: 0.3s;
  }
`;

const ConfirmAddressModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #a0a0a0;
  padding: 20px;
  border-radius: 10px;
  z-index: 1300;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  p {
    font-family: "DungGeunMo";
    color: black;
    font-size: 18px;
  }
`;

const ConfirmAddressBtns = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const ConfirmAddressBtn = styled.button`
  padding: 10px 20px;
  background: #ffffff;
  color: #000000;
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-family: "OldGalmuri";
  &:hover {
    background-color: ${(props) => props.theme.bgColor};
    transition: 0.2s;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1299;
`;

function MainButtons({ onOpenEditModal, onOpenShareModal, onAddressSelect }) {
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

  const [currentTutorialPage, setCurrentTutorialPage] = useState(1);
  const [roundSetting, setRoundSetting] = useState(false);
  const [round, setRound] = useState(1);
  const roomState = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const setRoomState = useSetRecoilState(roomAtom);
  const setChatVisible = useSetRecoilState(chatModalVisibleAtom);
  const [totalRound, setTotalRound] = useRecoilState(totalRoundAtom);
  const [isMiddleLoading, setIsMiddleLoading] = useState(false);
  const [isFindDepartureOpen, setIsFindDepartureOpen] = useState(false);
  const [address, setAddress] = useState(null);
  const [confirmAddressOpen, setConfirmAddressOpen] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false); // 스크립트 로드 상태 추가
  const { sendGameRound } = useWs();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true); // 스크립트 로드 완료 시 상태 업데이트
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openTutorialModal = () => {
    setIsTutorialModalOpen(true);
    document.body.classList.add("modal-open");
    setChatVisible(false);
  };

  const closeTutorialModal = () => {
    setIsTutorialModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleFindCenter = async () => {
    setIsMiddleLoading(true);
    try {
      const data = await axiosGetMiddle({ roomUUId: roomState.roomUUID });
      setRoomState((prev) => ({
        ...prev,
        centerPlace: data.roomCenterStart,
        isCenterExist: true,
        attendees: data.attendees,
      }));
    } catch (error) {
      console.error("중심찾기 실패!!!", error);
    } finally {
      setIsMiddleLoading(false);
    }
  };

  const handleAddressSelect = (data) => {
    setAddress(data);
    setConfirmAddressOpen(true);
  };

  const handleConfirmAddress = () => {
    onAddressSelect(address);
    setConfirmAddressOpen(false);
  };

  const handleGameButtonClick = () => {
    if (userInfo.isHost) {
      if (!roundSetting) {
        setRoundSetting(true);
      } else {
        setRoundSetting(false);
      }
    } else {
      alert("권한이 없습니다.");
    }
  };

  const increaseRound = () => {
    if (round < 3) setRound((prev) => prev + 1);
  };

  const decreaseRound = () => {
    if (round > 1) setRound((prev) => prev - 1);
  };

  const handleConfirmGame = () => {
    if (userInfo.isHost) {
      sendGameRound({
        roundCnt: round,
        roomUUID: roomState.roomUUID,
        finalStationName: roomState.centerPlace.name,
      });
    } else {
      alert("권한이 없습니다.");
    }
  };

  const handleCancelAddress = () => {
    setConfirmAddressOpen(false);
    setIsFindDepartureOpen(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setConfirmAddressOpen(false);
    }
  };

  const handleOpenFindDeparture = () => {
    if (isScriptLoaded) {
      setIsFindDepartureOpen(true);
    } else {
      alert(
        "주소 검색을 위한 스크립트를 로드하는 중입니다. 잠시만 기다려 주세요.",
      );
    }
  };

  return (
    <div style={{ zIndex: "100" }}>
      {isMiddleLoading ? <Loading message={"모임장소 찾는"} /> : null}
      <BottomBtns>
        <SmallBtn
          onClick={openTutorialModal}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          <span>?</span>
        </SmallBtn>
        {roundSetting ? (
          <RoundBox>
            <RoundSetting>
              <RoundBtn onClick={decreaseRound}>-</RoundBtn>
              <span>{round}</span>
              <RoundBtn2 onClick={increaseRound}>+</RoundBtn2>
            </RoundSetting>
            <OkBtn
              onClick={handleConfirmGame}
              isTutorialModalOpen={isTutorialModalOpen}
              highlight={currentTutorialPage === 2}
            >
              START
            </OkBtn>
          </RoundBox>
        ) : (
          <BigBtn
            onClick={handleGameButtonClick}
            disabled={!roomState.isCenterExist || !userInfo.isHost}
            isTutorialModalOpen={isTutorialModalOpen}
            highlight={currentTutorialPage === 2}
            style={{ fontSize: "45px" }}
          >
            GAME
          </BigBtn>
        )}

        <BigBtn
          onClick={handleFindCenter}
          disabled={
            !roomState.isAllHasDeparture ||
            !userInfo.isHost ||
            roomState.isCenterExist
          }
          isTutorialModalOpen={isTutorialModalOpen}
          highlight={currentTutorialPage === 1}
        >
          중심 찾기
        </BigBtn>
      </BottomBtns>
      <RightTopBtns>
        <SmallBtn
          onClick={onOpenEditModal}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          <SmallIcon src={userInfo.isHost ? updateIcon : alertIcon} />
        </SmallBtn>
        <SmallBtn
          onClick={() => onOpenShareModal("초대 링크 공유", "50px")}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          <SmallIcon src={inviteIcon} />
        </SmallBtn>
        <SmallBtn
          onClick={() => onOpenShareModal("모임 정보 공유", "110px")}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          <SmallIcon src={shareIcon} />
        </SmallBtn>
      </RightTopBtns>
      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={closeTutorialModal}
        currentPage={currentTutorialPage}
        setCurrentPage={setCurrentTutorialPage}
      />
      <AddressButton
        isTutorialModalOpen={isTutorialModalOpen}
        onClick={handleOpenFindDeparture}
      >
        <p>{userInfo.departure.address}</p>
      </AddressButton>
      {isFindDepartureOpen && (
        <FindDeparture
          onClose={() => setIsFindDepartureOpen(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}
      {confirmAddressOpen && (
        <ModalOverlay onClick={handleOverlayClick}>
          <ConfirmAddressModal>
            <p>{address.addressText}</p>
            <ConfirmAddressBtns>
              <ConfirmAddressBtn onClick={handleConfirmAddress}>
                확인
              </ConfirmAddressBtn>
              <ConfirmAddressBtn onClick={handleCancelAddress}>
                다시 찾기
              </ConfirmAddressBtn>
              <ConfirmAddressBtn onClick={() => setConfirmAddressOpen(false)}>
                취소
              </ConfirmAddressBtn>
            </ConfirmAddressBtns>
          </ConfirmAddressModal>
        </ModalOverlay>
      )}
    </div>
  );
}
export default MainButtons;
