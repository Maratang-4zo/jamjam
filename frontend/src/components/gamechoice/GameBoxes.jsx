import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import polygon from "../../assets/polygon.svg";
import YellowChatBubble from "../../assets/YellowChatBubble.svg"; // Assuming the correct path
import stairs from "../../assets/game/stairs.gif";
import SecondCardBg from "../../assets/2ndImg.png";

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
  /* clip-path: polygon(
    20% 0%,
    80% 0%,
    100% 12%,
    100% 88%,
    80% 100%,
    20% 100%,
    0% 88%,
    0% 12%
  ); */
  background-image: url(${SecondCardBg});
  /* border: ${(props) =>
    props.selected
      ? "9px solid #000000"
      : "3px solid #000000"}; // 선택된 카드의 테두리 두께 조정 */
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
  /* pointer-events: none; */

  &:hover .middle {
    opacity: 1;
  }

  &:hover .middle2 {
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.56);
    clip-path: polygon(
      15% 0%,
      85% 0%,
      100% 10%,
      100% 90%,
      85% 100%,
      15% 100%,
      0% 90%,
      0% 10%
    );
  }
`;

const GameCard3 = styled.div`
  background-color: #ffffff;
  border: 3px solid black;
  /* border: ${(props) =>
    props.selected
      ? "9px solid #000000"
      : "3px solid #000000"}; // 선택된 카드의 테두리 두께 조정 */
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

  &:hover .middle2 {
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 33px;
    background: rgba(0, 0, 0, 0.56);
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
  }
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
  font-family: "OldGalmuri", Helvetica;
  font-size: 29px;
  font-weight: 400;
  text-align: center;
`;

const TextAboveBubble = styled.div`
  position: absolute;
  top: ${({ top }) => top || "40%"};
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 19px;
  font-family: "NewGalmuriRegular", sans-serif;
`;

const Middle2 = styled.div`
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #000000; /* 검정색 글씨 */
  font-size: 30px;
  font-weight: bold;
  font-family: "NewGalmuriBold", sans-serif;
`;

function GameBoxes({ selectedGame, setSelectedGame }) {
  const handleClick = (gameId) => {
    if (setSelectedGame) {
      setSelectedGame(gameId);
    }
  };

  return (
    <>
      <GamesContainer>
        <GameCard1 selected={selectedGame === 1} onClick={() => handleClick(1)}>
          <Middle className="middle" top="50%">
            <TextAboveBubble>
              마우스 클릭으로 가장 먼저 위로 올라가는 사람이 승리!
            </TextAboveBubble>
            <img src={YellowChatBubble} alt="Yellow Chat Bubble" />
          </Middle>
          <GameName>
            <OverlapGroup>
              <TextWrapper>YoungCha</TextWrapper>
            </OverlapGroup>
          </GameName>
        </GameCard1>
        <GameCard2>
          <Middle2 className="middle2">Coming Soon!</Middle2>

          <GameName>
            <OverlapGroup>
              <TextWrapper>COFFEE</TextWrapper>
            </OverlapGroup>
          </GameName>
        </GameCard2>
        <GameCard3>
          <Middle2 className="middle2">Coming Soon!</Middle2>
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
