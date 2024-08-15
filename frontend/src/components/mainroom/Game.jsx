import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { aroundStationsAtom, roomAtom } from "../../recoil/atoms/roomState";
import {
  gameCountAtom,
  gameStateAtom,
  isWinnerAtom,
  playerState,
  winnerNicknameAtom,
} from "../../recoil/atoms/gameState";
import { axiosGetAroundStores, axiosGetThreeStations } from "../../apis/mapApi";
import Loading from "../fixed/Loading";
import { isThreeStationLoadingAtom } from "../../recoil/atoms/loadingState";
import { useWebSocket } from "../../context/WebsocketContext";
import gameBg from "../../assets/game/gameBg.jpg";

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
  position: relative;
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
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: ${(props) => (props.show ? "flex" : "none")};
`;

const Container = styled.div`
  background-image: url(${gameBg});
`;

const BlockContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  height: 100%;
`;

const Block = styled.div`
  width: 50px;
  height: 50px;
  transition: bottom 0.1s;
  background-image: url(${(props) => props.profileImageUrl});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 10px;
  position: relative;
  border-radius: 50%;
  border: 1px solid black;
  bottom: ${(props) => `${props.bottom}px`}; // 추가된 부분
`;

const WinMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  color: #ff0000;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const Countdown = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
  font-weight: bold;
  color: #000;
`;

function Game() {
  const location = useLocation();
  const { selectedGame, roomUUID, attendeeUUID } = location.state || {};
  const handleBlockClick = useRef(() => {});
  const [showButton, setShowButton] = useState(false);
  const roomInfo = useRecoilValue(roomAtom);
  const isWinner = useRecoilValue(isWinnerAtom);
  const setAroundStations = useSetRecoilState(aroundStationsAtom);

  const [isLoading, setIsLoading] = useRecoilState(isThreeStationLoadingAtom);
  const [bottom, setBottom] = useState(0);
  const [win, setWin] = useRecoilState(isWinnerAtom);
  const [countdown, setCountdown] = useRecoilState(gameCountAtom);
  const [players, setPlayers] = useRecoilState(playerState);
  const [winner, setWinner] = useRecoilState(winnerNicknameAtom);
  const gameState = useRecoilValue(gameStateAtom);
  const { sendGame } = useWebSocket();

  const handleWin = () => {
    setWin(true);
    setShowButton(true);
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

  useEffect(() => {
    if (countdown === 0 && !win && !winner) {
      handleBlockClick.current = () => {
        setPlayers((prevPlayers) => {
          const updatedPlayers = prevPlayers.map((player) => {
            if (player.attendeeUUID === attendeeUUID) {
              const newBottom = player.bottom + 10;
              if (newBottom >= 480) {
                handleWin();
              }
              sendGame({ newBottom });
              return { ...player, bottom: newBottom };
            }
            return player;
          });
          return updatedPlayers;
        });
      };
    }
  }, [countdown, win, winner, attendeeUUID, sendGame]);

  return (
    <Wrapper>
      <ContentWrapper>
        {isLoading ? <Loading message={"장소 로딩"} /> : null}
        <GameScreen onClick={() => handleBlockClick.current()}>
          <Container>
            {countdown === 99 ? <Countdown>READY</Countdown> : null}
            {countdown > 0 && countdown < 99 ? (
              <Countdown>{countdown === 1 ? "START" : countdown}</Countdown>
            ) : null}
            {countdown === 0 ? (
              <>
                <BlockContainer>
                  {players.map((player) => (
                    <Block
                      key={player.attendeeUUID}
                      bottom={player.bottom}
                      profileImageUrl={player.profileImageUrl}
                    />
                  ))}
                </BlockContainer>
                <WinMessage show={gameState === "end"}>
                  {winner && `${winner} WIN!!!`}
                </WinMessage>
              </>
            ) : null}
          </Container>
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
