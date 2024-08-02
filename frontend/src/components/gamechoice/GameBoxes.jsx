import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";
import wavebutton from "../../assets/wavebutton.svg";
import polygon from "../../assets/polygon.svg";
import YellowChatBubble from "../../assets/YellowChatBubble.svg"; // Assuming the correct path

const GamesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  width: 100%;
  /* z-index: 1; */
`;

const GameCard = styled.div`
  background-color: #ffffff;
  border: 3px solid #000000;
  border-radius: 35px;
  height: 429px;
  width: 343px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 28px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: 0.5s ease;
  /* z-index: 1; */

  &:hover .image {
    opacity: 0.3;
  }

  &:hover .middle {
    opacity: 1;
  }
`;
const GameCard2 = styled.div`
  height: 429px;
  width: 343px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 28px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: 0.5s ease;
  z-index: 1;

  &:hover .image {
    opacity: 0.3;
  }

  &:hover .middle {
    opacity: 1;
  }
`;

const Middle = styled.div`
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: ${({ top }) => top || "50%"};
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  img {
    width: ${({ width }) => width || "220px"};
    /* margin: ${({ margin }) => margin || "100"};
    padding: ${({ padding }) => padding || "300"}; */
  }
`;

const Image = styled.img`
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: 0.5s ease;
  backface-visibility: hidden;
`;

const GameName = styled.div`
  height: 66px;
  width: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverlapGroup = styled.div`
  background-color: #ffe845;
  border: 3px solid #000000;
  border-radius: 14px;
  height: 66px;
  width: 169px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  color: #000000;
  font-family: "Galmuri11-Regular", Helvetica;
  font-size: 31.5px;
  font-weight: 400;
  text-align: center;
`;

const PlayButton = styled.button`
  all: unset;
  background-image: url(${wavebutton});
  background-size: 100% 100%;
  height: 54px;
  width: 134px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 14px;
`;

const PlayButtonText = styled.div`
  color: #ffe845;
  font-family: "Pixelroborobo-Medium", Helvetica;
  font-size: 28px;
  font-weight: 500;
`;

function GameBoxes() {
  return (
    <>
      <GamesContainer>
        <GameCard>
          <Middle className="middle" top="50%">
            <img src={YellowChatBubble} alt="Yellow Chat Bubble" />
          </Middle>
          <GameName>
            <OverlapGroup>
              <TextWrapper>CHICKEN</TextWrapper>
            </OverlapGroup>
          </GameName>
        </GameCard>
        <GameCard2 style={{ backgroundImage: `url(${polygon})` }}>
          <Middle className="middle" top="80%">
            <img src={YellowChatBubble} alt="Yellow Chat Bubble" />
          </Middle>
          <GameName>
            <OverlapGroup>
              <TextWrapper>COFFEE</TextWrapper>
            </OverlapGroup>
          </GameName>
        </GameCard2>
        <GameCard>
          <Middle className="middle" top="50%">
            <img src={YellowChatBubble} alt="Yellow Chat Bubble" />
          </Middle>
          <GameName>
            <OverlapGroup>
              <TextWrapper>PIZZA</TextWrapper>
            </OverlapGroup>
          </GameName>
        </GameCard>
      </GamesContainer>
      <PlayButton>
        <PlayButtonText>PLAY</PlayButtonText>
      </PlayButton>
    </>
  );
}

export default GameBoxes;
