import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Game1 from "../games/Game1";
import Game2 from "../games/Game2";
import Game3 from "../games/Game3";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  aroundStationsAtom,
  roomAtom,
  roomPageAtom,
} from "../../recoil/atoms/roomState";
import { axiosGetAroundStores, axiosGetThreeStations } from "../../apis/mapApi";
import gameBg from "../../assets/game/gameBg.jpg";
import Loading from "../fixed/Loading";
import { isWinnerAtom } from "../../recoil/atoms/gameState";
import { isThreeStationLoadingAtom } from "../../recoil/atoms/loadingState";

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
  /* background-image: url(${gameBg}); */
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
  font-family: "OldGalmuri";
  background-color: ${(props) =>
    props.disabled ? "gray" : props.theme.bgColor};
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
  const [showButton, setShowButton] = useState(false);
  const roomInfo = useRecoilValue(roomAtom);
  const isWinner = useRecoilValue(isWinnerAtom);
  const setAroundStations = useSetRecoilState(aroundStationsAtom);
  const [isLoading, setIsLoading] = useRecoilState(isThreeStationLoadingAtom);

  const handleWin = () => {
    setShowButton(true); // 승리 시 버튼 표시
  };

  const handleNextPageBtn = async () => {
    if (isWinner) {
      setIsLoading(true);
      try {
        const data = await axiosGetThreeStations(roomInfo.roomUUID);
        try {
          const aroundStationsData = await Promise.all(
            data.map(async (station) => {
              const response = await axiosGetAroundStores({
                stationName: station.name,
                category: roomInfo.roomPurpose,
              });
              return {
                ...station,
                stores: response.data,
              };
            }),
          );
          setAroundStations(aroundStationsData);
        } catch (error) {
          console.log("역 주변 상권정보 가져오기 실패", error);
        }
      } catch (err) {
        console.log("역 3개 가져오기 실패", err);
      }
    } else {
      alert("권한이 없습니다.");
    }
  };

  return (
    <Wrapper>
      <ContentWrapper>
        {isLoading ? <Loading message={"장소 로딩"} /> : null}
        <GameScreen onClick={() => handleClick.current()}>
          {selectedGame === 1 && (
            <>
              {console.log("Game1 렌더링됨")}
              <Game1 handleClick={handleClick} onWin={handleWin} />
            </>
          )}
          {selectedGame === 2 && <Game2 />}
          {selectedGame === 3 && <Game3 />}
          <Game1 handleClick={handleClick} onWin={handleWin} />

          <StyledButton
            disabled={!isWinner}
            show={showButton}
            onClick={handleNextPageBtn}
          >
            장소 선택하러 가기
          </StyledButton>
        </GameScreen>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Game;
