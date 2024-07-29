import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { roomAtom } from "../../recoil/atoms/roomState";
import { userInfoAtom } from "../../recoil/atoms/userState";
import alertIcon from "../../assets/icons/alertIcon.png";

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
  background-color: ${(props) =>
    props.disabled ? "gray" : props.theme.bgColor};
  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "black")};
    color: ${(props) => (props.disabled ? "none" : props.theme.bgColor)};
    transition: 0.3s;
  }
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
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
  const roomState = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  return (
    <>
      <BottomBtns>
        <SmallBtn>
          <SmallIcon src={alertIcon} />
        </SmallBtn>
        <BigBtn disabled={!roomState.isCenterExist || !userInfo.isHost}>
          GAME
        </BigBtn>
        <BigBtn
          disabled={
            !roomState.isAllHasDeparture ||
            !userInfo.isHost ||
            roomState.isCenterExist
          }
        >
          중심 찾기
        </BigBtn>
      </BottomBtns>
      <RightBtns>
        <SmallBtn>수정</SmallBtn>
        <SmallBtn>초대</SmallBtn>
        <SmallBtn>공유</SmallBtn>
      </RightBtns>
    </>
  );
}

export default Buttons;
