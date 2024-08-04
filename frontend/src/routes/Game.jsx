import React, { useRef } from "react";
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

function Game() {
  const location = useLocation();
  const { selectedGame } = location.state || {};
  const handleClick = useRef(() => {});

  return (
    <Wrapper>
      <NavBarLeft />
      <ContentWrapper>
        <GameScreen onClick={() => handleClick.current()}>
          {selectedGame === 1 && <Game1 handleClick={handleClick} />}
          {selectedGame === 2 && <Game2 />}
          {selectedGame === 3 && <Game3 />}
        </GameScreen>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Game;
