import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { chatModalVisibleAtom, roomAtom } from "../../recoil/atoms/roomState";
import { userInfoAtom } from "../../recoil/atoms/userState";
import alertIcon from "../../assets/icons/alertIcon.png";
import TutorialModal from "./Tutorial";
import { axiosGetMiddle } from "../../apis/mapApi";

const BottomBtns = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
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

const RightBtns = styled.div`
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

function Buttons({ onOpenEditModal, onOpenShareModal }) {
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [currentTutorialPage, setCurrentTutorialPage] = useState(1);
  const roomState = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const setRoomState = useSetRecoilState(roomAtom);
  const setChatVisible = useSetRecoilState(chatModalVisibleAtom);

  const openTutorialModal = () => {
    setIsTutorialModalOpen(true);
    document.body.classList.add("modal-open");
    setChatVisible(false); // 채팅 모달을 닫음
  };

  const closeTutorialModal = () => {
    setIsTutorialModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleFindCenter = async () => {
    try {
      const data = await axiosGetMiddle({ roomUUId: roomState.roomUUID });
      setRoomState((prev) => ({
        ...prev,
        centerPlace: data,
        isCenterExist: true,
      }));
    } catch (error) {
      console.error("중심찾기 실패!!!", error);
    }
  };

  return (
    <>
      <BottomBtns>
        <SmallBtn
          onClick={openTutorialModal}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          <SmallIcon src={alertIcon} />
        </SmallBtn>
        <BigBtn
          disabled={!roomState.isCenterExist || !userInfo.isHost}
          isTutorialModalOpen={isTutorialModalOpen}
          highlight={currentTutorialPage === 2}
        >
          GAME
        </BigBtn>
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
      <RightBtns>
        <SmallBtn
          onClick={onOpenEditModal}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          수정
        </SmallBtn>
        <SmallBtn
          onClick={() => onOpenShareModal("초대 링크 공유", "50px")}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          초대
        </SmallBtn>
        <SmallBtn
          onClick={() => onOpenShareModal("모임 정보 공유", "110px")}
          isTutorialModalOpen={isTutorialModalOpen}
        >
          공유
        </SmallBtn>
      </RightBtns>
      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={closeTutorialModal}
        currentPage={currentTutorialPage}
        setCurrentPage={setCurrentTutorialPage}
      />
    </>
  );
}

export default Buttons;
