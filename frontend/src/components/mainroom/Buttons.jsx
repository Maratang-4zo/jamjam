import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { roomAtom } from "../../recoil/atoms/roomState";
import { userInfoAtom } from "../../recoil/atoms/userState";
import alertIcon from "../../assets/icons/alertIcon.png";
import TutorialModal from "./Tutorial"; // TutorialModal 임포트

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
    if (props.isModalOpen) {
      return props.highlight ? props.theme.bgColor : "gray";
    }
    return props.disabled ? "gray" : props.theme.bgColor;
  }};
  color: ${(props) => {
    if (props.isModalOpen) {
      return props.highlight ? "black" : "darkgray";
    }
    return props.disabled ? "darkgray" : "inherit";
  }};
  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "black")};
    color: ${(props) => (props.disabled ? "none" : props.theme.bgColor)};
    transition: 0.3s;
  }
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  position: ${(props) => (props.isModalOpen ? "relative" : "static")};
  z-index: ${(props) => (props.isModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isModalOpen ? "none" : "auto")};
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
  position: ${(props) => (props.isModalOpen ? "relative" : "static")};
  z-index: ${(props) => (props.isModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isModalOpen ? "none" : "auto")};
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

function Buttons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const roomState = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  return (
    <>
      <BottomBtns>
        <SmallBtn onClick={openModal} isModalOpen={isModalOpen}>
          <SmallIcon src={alertIcon} />
        </SmallBtn>
        <BigBtn
          disabled={!roomState.isCenterExist || !userInfo.isHost}
          isModalOpen={isModalOpen}
          highlight={currentPage === 2}
        >
          GAME
        </BigBtn>
        <BigBtn
          disabled={
            !roomState.isAllHasDeparture ||
            !userInfo.isHost ||
            roomState.isCenterExist
          }
          isModalOpen={isModalOpen}
          highlight={currentPage === 1}
        >
          중심 찾기
        </BigBtn>
      </BottomBtns>
      <RightBtns>
        <SmallBtn isModalOpen={isModalOpen}>수정</SmallBtn>
        <SmallBtn isModalOpen={isModalOpen}>초대</SmallBtn>
        <SmallBtn isModalOpen={isModalOpen}>공유</SmallBtn>
      </RightBtns>
      <TutorialModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default Buttons;
