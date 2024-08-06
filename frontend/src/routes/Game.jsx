import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import Game1 from "../components/games/Game1";
import Game2 from "../components/games/Game2";
import Game3 from "../components/games/Game3";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.accentColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.bgColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  border-left: none;
  display: flex;
`;

const GameScreen = styled.div`
  width: 1164px;
  height: 530px;
  flex-shrink: 0;
  border-radius: 30px;
  background: #fff;
  position: relative; // Position relative to contain the absolute positioning of Block and WinMessage
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 40px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 100px;
  width: calc(100% - 250px);
  height: 100%;
`;
const StyledButton = styled.button`
  background-color: #ffe845;
  border: 3px solid #000000;
  border-radius: 14px;
  height: 66px;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  position: absolute;
  bottom: 20px; // 하단 중앙에 위치하도록 설정
  left: 50%;
  transform: translateX(-50%);
  display: ${(props) =>
    props.show ? "flex" : "none"}; // show prop에 따라 표시 여부 결정
`;

function Game() {
  const location = useLocation();
  const { selectedGame } = location.state || {};
  const handleClick = useRef(() => {});
  // 나중에 websocket 연결하고 나서 false 로 바꿀겁니다
  const [showButton, setShowButton] = useState(true);

  const handleWin = () => {
    setShowButton(true); // 승리 시 버튼 표시
  };

  return (
    <Wrapper>
      <NavBarLeft />
      <ContentWrapper>
        <GameScreen onClick={() => handleClick.current()}>
          {selectedGame === 1 && (
            <Game1 handleClick={handleClick} onWin={handleWin} />
          )}
          {selectedGame === 2 && <Game2 />}
          {selectedGame === 3 && <Game3 />}
          <StyledButton show={showButton}>장소 선택하러 가기</StyledButton>
        </GameScreen>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Game;
