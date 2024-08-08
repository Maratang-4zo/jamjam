import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import {
  roomAtom,
  isGameFinishAtom,
  isNextMiddleExistAtom,
  selectedStationAtom,
  totalRoundAtom,
  currentRoundAtom,
  chatModalVisibleAtom,
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
  padding: 7px 17px;
  justify-content: center;
  align-items: center;
  gap: 8.229px;
  flex-shrink: 0;
  border-radius: 15px;
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
  z-index: ${(props) => (props.isTutorialModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
`;

const SmallBtn = styled.button`
  display: flex;
  width: 45px;
  height: 45px;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 15px;
  border: 3px solid #000;
  background: ${(props) => props.theme.subaccentColor + "86"};
  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "#00000086")};
    color: ${(props) => (props.disabled ? "none" : props.theme.subaccentColor)};
    transition: 0.3s;
  }
  position: ${(props) => (props.isTutorialModalOpen ? "relative" : "static")};
  z-index: ${(props) => (props.isTutorialModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
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
  z-index: 1200; // 적절한 z-index 값 설정
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    color: black;
    width: 100%;
    font-size: 15px;
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
  background-color: ${(props) => props.theme.bgColor + "a8"};
  padding: 20px;
  border-radius: 10px;
  z-index: 1300;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  p {
    color: black;
    font-weight: 600;
  }
`;

const ConfirmAddressBtns = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const ConfirmAddressBtn = styled.button`
  padding: 10px 20px;
  background: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #303030;
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
  const navigate = useNavigate();
  const roomState = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const setRoomState = useSetRecoilState(roomAtom);
  const setChatVisible = useSetRecoilState(chatModalVisibleAtom);
  const [isGameFinish, setIsGameFinishAtom] = useRecoilState(isGameFinishAtom);
  const isNextMiddleExist = useRecoilValue(isNextMiddleExistAtom);
  const [selectedStation, setSelectedStation] =
    useRecoilState(selectedStationAtom);
  const setIsNextMiddleExist = useSetRecoilState(isNextMiddleExistAtom);
  const [totalRound, setTotalRound] = useRecoilState(totalRoundAtom);
  const [currentRound, setCurrentRound] = useRecoilState(currentRoundAtom);
  const [isMiddleLoading, setIsMiddleLoading] = useState(false);
  const [isFinalLoading, setIsFinalLoading] = useState(false);
  const [isFindDepartureOpen, setIsFindDepartureOpen] = useState(false);
  const [address, setAddress] = useState(null);
  const [confirmAddressOpen, setConfirmAddressOpen] = useState(false);

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

  const handleDecision = () => {
    if (selectedStation) {
      setRoomState((prev) => ({
        ...prev,
        centerPlace: selectedStation,
      }));
      setIsNextMiddleExist(true);
    }
  };

  const handleNextRoundBtnClick = () => {
    setCurrentRound((prev) => (prev += 1));
    navigate(`/room/${roomState.roomUUID}/gamechoice`);
    setSelectedStation(null);
    setIsGameFinishAtom(false);
    setIsNextMiddleExist(false);
  };

  const handleFinalResultBtnClick = () => {
    setSelectedStation(null);
    setIsGameFinishAtom(false);
    setIsNextMiddleExist(false);
    setIsFinalLoading(true);
    // 여기부터는 axios 호출 끝나고 넣을 애들
    navigate(`/room/${roomState.roomUUID}/result`);
    // setIsFinalLoading(false);
  };

  const handleAddressSelect = (data) => {
    setAddress(data);
    setConfirmAddressOpen(true);
  };

  const handleConfirmAddress = () => {
    onAddressSelect(address);
    setConfirmAddressOpen(false);
  };

  const handleClickOutside = (e) => {
    if (e.target.closest(".station-btn") === null) {
      setSelectedStation(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleGameButtonClick = () => {
    if (!roundSetting) {
      setRoundSetting(true);
    } else {
      setRoundSetting(false);
    }
  };

  const increaseRound = () => {
    if (round < 3) setRound((prev) => prev + 1);
  };

  const decreaseRound = () => {
    if (round > 1) setRound((prev) => prev - 1);
  };

  const handleConfirmGame = () => {
    navigate(`/room/${roomState.roomUUID}/gamechoice`);
    setTotalRound(round);
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

  return (
    <>
      {isMiddleLoading ? <Loading message={"모임장소 찾는"} /> : null}
      <BottomBtns>
        <SmallBtn
          onClick={openTutorialModal}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          <SmallIcon src={questionIcon} />
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
              확인
            </OkBtn>
          </RoundBox>
        ) : (
          <BigBtn
            onClick={handleGameButtonClick}
            disabled={!roomState.isCenterExist || !userInfo.isHost}
            isTutorialModalOpen={isTutorialModalOpen}
            highlight={currentTutorialPage === 2}
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
      <AddressButton onClick={() => setIsFindDepartureOpen(true)}>
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
    </>
  );
}
export default MainButtons;
