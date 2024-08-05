import React from "react";
import styled, { createGlobalStyle } from "styled-components";
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

const GameCard1 = styled.div`
  background-color: #ffffff;
  border: ${(props) =>
    props.selected
      ? "9px solid #000000"
      : "3px solid #000000"}; // 선택된 카드의 테두리 두께 조정
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
  clip-path: polygon(
    20% 0%,
    80% 0%,
    100% 12%,
    100% 88%,
    80% 100%,
    20% 100%,
    0% 88%,
    0% 12%
  );
  background-color: #ffffff;
  border: ${(props) =>
    props.selected
      ? "9px solid #000000"
      : "3px solid #000000"}; // 선택된 카드의 테두리 두께 조정
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

const GameCard3 = styled.div`
  background-color: #ffffff;
  border: ${(props) =>
    props.selected
      ? "9px solid #000000"
      : "3px solid #000000"}; // 선택된 카드의 테두리 두께 조정
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

const TextAboveBubble = styled.div`
  position: absolute;
  top: ${({ top }) => top || "40%"};
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 20px;
  font-family: Arial, sans-serif;
`;

function GameBoxes({ selectedGame, setSelectedGame }) {
  return (
    <>
      <GamesContainer>
        <GameCard1
          selected={selectedGame === 1}
          onClick={() => setSelectedGame(1)}
        >
          <Middle className="middle" top="50%">
            <TextAboveBubble>
              마우스 클릭으로 가장 먼저 위로 올라가는 사람이 승리!
            </TextAboveBubble>
            <img src={YellowChatBubble} alt="Yellow Chat Bubble" />
          </Middle>
          <GameName>
            <OverlapGroup>
              <TextWrapper>YounCha</TextWrapper>
            </OverlapGroup>
          </GameName>
        </GameCard1>
        <GameCard2
          // style={{ backgroundImage: `url(${polygon})` }}
          selected={selectedGame === 2}
          onClick={() => setSelectedGame(2)}
        >
          <Middle className="middle" top="80%">
            <TextAboveBubble>어쩌구 저쩌구 블랑블랑</TextAboveBubble>
            <img src={YellowChatBubble} alt="Yellow Chat Bubble" />
          </Middle>
          <GameName>
            <OverlapGroup>
              <TextWrapper>COFFEE</TextWrapper>
            </OverlapGroup>
          </GameName>
        </GameCard2>
        <GameCard3
          selected={selectedGame === 3}
          onClick={() => setSelectedGame(3)}
        >
          <Middle className="middle" top="40%">
            <TextAboveBubble>어쩌구 저쩌구 블랑블랑</TextAboveBubble>

            <img src={YellowChatBubble} alt="Yellow Chat Bubble" />
          </Middle>
          <GameName>
            <OverlapGroup>
              <TextWrapper>PIZZA</TextWrapper>
            </OverlapGroup>
          </GameName>
        </GameCard3>
      </GamesContainer>
    </>
  );
}

export default GameBoxes;
