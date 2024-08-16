import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import CatChat from "../../assets/CatChat.png";

const GlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
  }
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const TutorialPage = styled.div`
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  display: ${(props) => (props.active ? "flex" : "none")};
  cursor: pointer;
`;

const Bubble = styled.svg`
  width: 180px;
  height: 40px;
  fill: none;
`;

const Path = styled.path`
  fill: white;
  fill-opacity: 0.7;
  stroke: black;
`;

const BubbleText = styled.text`
  fill: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-anchor: middle;
  font-family: "OldGalmuri";
`;

const RightTopFixed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 50px;
  gap: 15px;
`;

const LeftBottomFixed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 10px;
  left: 40px;
  gap: 10px;
`;

const LeftTopFixed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 40px;
`;

const PixelChat = styled.div`
  width: 150px;
  height: 150px;
  flex-shrink: 0;
  background-image: url(${CatChat});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  display: flex;
  justify-content: center;
`;

const PixelChatText = styled.p`
  width: 100px;
  color: #000;
  //font-family: "ONE(Ed.) Galmuri11 Regular";
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  position: absolute;
  top: 35px;
  font-family: "OldGalmuri";
`;

const InfoText = styled.h1`
  color: #fff;
  margin-bottom: 10px;
  font-family: "OldGalmuri";
`;

function TutorialModal({ isOpen, onClose, currentPage, setCurrentPage }) {
  if (!isOpen) {
    return null;
  }

  const handleBackgroundClick = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    setCurrentPage(1);
    onClose();
  };

  return (
    <ModalOverlay onClick={handleBackgroundClick}>
      <GlobalStyle />
      <RightTopFixed>
        <Bubble viewBox="0 0 208 55">
          <Path d="M181.201 41V54.5H0.5V0.5H181.201V13.75V14.038L181.45 14.1825L206.912 28.947L181.494 40.5451L181.201 40.6786V41Z" />
          <BubbleText x="90" y="35">
            모임 정보 수정
          </BubbleText>
        </Bubble>
        <Bubble viewBox="0 0 208 55">
          <Path d="M181.201 41V54.5H0.5V0.5H181.201V13.75V14.038L181.45 14.1825L206.912 28.947L181.494 40.5451L181.201 40.6786V41Z" />
          <BubbleText x="90" y="35">
            초대 링크 공유
          </BubbleText>
        </Bubble>
        <Bubble viewBox="0 0 208 55">
          <Path d="M181.201 41V54.5H0.5V0.5H181.201V13.75V14.038L181.45 14.1825L206.912 28.947L181.494 40.5451L181.201 40.6786V41Z" />
          <BubbleText x="90" y="35">
            모임 정보 공유
          </BubbleText>
        </Bubble>
      </RightTopFixed>
      <LeftBottomFixed>
        <Bubble viewBox="0 0 208 55">
          <Path d="M22.7529 41V54.5H175.5V0.5H22.7529V13.75V14.0135L22.5355 14.1624L0.958893 28.949L22.4902 40.5599L22.7529 40.7016V41Z" />
          <BubbleText x="100" y="35">
            채팅창 열기
          </BubbleText>
        </Bubble>
        <Bubble viewBox="0 0 208 55">
          <Path d="M22.7529 41V54.5H175.5V0.5H22.7529V13.75V14.0135L22.5355 14.1624L0.958893 28.949L22.4902 40.5599L22.7529 40.7016V41Z" />
          <BubbleText x="100" y="35">
            마이크 on/off
          </BubbleText>
        </Bubble>
        <Bubble viewBox="0 0 208 55">
          <Path d="M22.7529 41V54.5H175.5V0.5H22.7529V13.75V14.0135L22.5355 14.1624L0.958893 28.949L22.4902 40.5599L22.7529 40.7016V41Z" />
          <BubbleText x="100" y="35">
            홈으로 나가기
          </BubbleText>
        </Bubble>
      </LeftBottomFixed>
      <LeftTopFixed>
        <Bubble viewBox="0 0 208 55">
          <Path d="M22.7529 41V54.5H175.5V0.5H22.7529V13.75V14.0135L22.5355 14.1624L0.958893 28.949L22.4902 40.5599L22.7529 40.7016V41Z" />
          <BubbleText x="100" y="35">
            참여자 목록
          </BubbleText>
        </Bubble>
      </LeftTopFixed>
      <TutorialPage active={currentPage === 1}>
        <InfoText>아무 곳이나 클릭하면 다음 페이지로 넘어갑니다</InfoText>
        <PixelChat style={{ right: "0px", bottom: "50px" }}>
          <PixelChatText>먼저 친구들과 중심 장소를 찾아봐</PixelChatText>
        </PixelChat>
      </TutorialPage>
      <TutorialPage active={currentPage === 2}>
        <InfoText>아무 곳이나 클릭하면 튜토리얼 창이 닫힙니다.</InfoText>
        <PixelChat style={{ right: "180px", bottom: "50px" }}>
          <PixelChatText>찾은 중간 장소가 별로면 게임을 해봐~</PixelChatText>
        </PixelChat>
      </TutorialPage>
    </ModalOverlay>
  );
}

export default TutorialModal;
