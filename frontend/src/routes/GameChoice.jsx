import GameBoxes from "../components/gamechoice/GameBoxes";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import wavebutton from "../assets/wavebutton.svg";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  border-left: none;
  width: 100%;
  height: 100vh;
  color: ${(props) => props.theme.textColor};
  display: flex;
  overflow: hidden;
  z-index: 1;
`;

const NavBarContainer = styled.div`
  left: 0;
  top: 0;
  bottom: 0;
  width: 150px;
`;

const Header = styled.div`
  color: #000000;
  font-family: "pixel", Helvetica;
  font-size: 60px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 40px;
  margin-top: -20px;
`;

const ContentContainer = styled.div`
  margin-right: 40px;s
  width: calc(100% - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 35px;
  z-index: 1;
`;

const PlayButton = styled.button`
  all: unset;
  background-image: url(${wavebutton});
  background-size: 100% 100%;
  height: 80px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 40px;
`;

const PlayButtonText = styled.div`
  color: #ffe845;
  font-family: "Pixelroborobo-Medium", Helvetica;
  font-size: 36px;
  font-weight: 500;
`;

function GameChoice() {
  const [selectedGame, setSelectedGame] = useState(null);
  const navigate = useNavigate();
  const { roomUUID } = useParams();

  const handlePlayButtonClick = () => {
    if (selectedGame != null) {
      navigate(`/room/${roomUUID}/game`, { state: { selectedGame } });
    }
  };
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <NavBarContainer>
          <NavBarLeft />
        </NavBarContainer>
        <ContentContainer>
          <Header>Choose The Game</Header>
          <GameBoxes
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
          ></GameBoxes>
          <PlayButton onClick={handlePlayButtonClick}>
            <PlayButtonText>PLAY</PlayButtonText>
          </PlayButton>
        </ContentContainer>
      </Wrapper>
    </>
  );
}

export default GameChoice;
