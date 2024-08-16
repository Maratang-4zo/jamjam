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
  currentRoundUUIDAtom,
} from "../../recoil/atoms/gameState";
import { userInfoAtom } from "../../recoil/atoms/userState";
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
  background-image: url(${gameBg});
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
  &:hover {
    background-color: ${(props) =>
      props.disabled ? "gray" : props.theme.accentColor};
    color: ${(props) => (props.disabled ? "black" : props.theme.bgColor)};
    transition: 0.2s;
  }
`;

const BlockContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  height: 100%;
  flex-direction: row; // row 방향으로 정렬
  gap: 20px; // 아이콘 간의 간격
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
  position: relative; // absolute에서 relative로 변경
  border-radius: 50%;
  border: 1px solid black;
  bottom: ${(props) => `${props.bottom}px`};
`;

const WinMessage = styled.div`
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  width: 100%;
  height: 40%;
  background-color: #00000084;

  display: ${(props) => (props.show ? "block" : "none")};
  z-index: 1; // 텍스트가 배경 위에 위치하도록 z-index 설정
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    text-align: center;
    font-size: 48px;
    font-family: "pixel";
    font-weight: bold;
    color: black;
  }
`;

const Countdown = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
  font-weight: bold;
  font-family: "DungGeunMo";
  color: #000;
`;

const WinBox = styled.div`
  height: 100%;
  width: 100%;
  background-color: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0;
`;

function Game() {
  const handleClick = useRef(() => {}); // handleClick 통일
  const [showButton, setShowButton] = useState(false);
  const roomInfo = useRecoilValue(roomAtom);
  const isWinner = useRecoilValue(isWinnerAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const myUUID = userInfo.myUUID;
  const gameRoundUUID = useRecoilValue(currentRoundUUIDAtom);
  const setAroundStations = useSetRecoilState(aroundStationsAtom);

  const [isLoading, setIsLoading] = useRecoilState(isThreeStationLoadingAtom);
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
      } catch (err) {
        console.log("역 3개 가져오기 실패", err);
      }
    } else {
      alert("권한이 없습니다.");
    }
  };

  useEffect(() => {
    if (countdown === 0 && !win && !winner) {
      const handleBlockClick = () => {
        console.log("지금 현재 접속해 있는 사람의 UUID:", myUUID);
        sendGame(gameRoundUUID);
      };
      handleClick.current = handleBlockClick;
    }
  }, [countdown, win, winner, sendGame]);

  return (
    <Wrapper>
      <ContentWrapper>
        {isLoading ? <Loading message={"장소 로딩"} /> : null}
        <GameScreen
          onClick={() => {
            console.log("Game screen clicked");
            handleClick.current();
          }}
        >
          {" "}
          {/* 클릭 이벤트 수정 */}
          {countdown === 99 ? <Countdown>READY</Countdown> : null}
          {countdown > 0 && countdown < 99 ? (
            <Countdown>{countdown === 1 ? "START" : countdown}</Countdown>
          ) : null}
          {countdown === 0 ? (
            <>
              <BlockContainer>
                {players.map((player, index) => (
                  <Block
                    key={player.attendeeUUID}
                    bottom={player.bottom}
                    profileImageUrl={player.profileImageUrl}
                    style={{
                      left: `${(index - (players.length - 1) / 2) * 60}px`,
                    }} // 각 플레이어를 좌우로 퍼지게 배치
                  />
                ))}
              </BlockContainer>
            </>
          ) : null}
          {gameState === "end" ? (
            <WinBox>
              <WinMessage show={gameState === "end"}>
                <span>{winner && `${winner} WIN!!!`}</span>
              </WinMessage>
              <StyledButton disabled={!isWinner} onClick={handleNextPageBtn}>
                장소 선택하러 가기
              </StyledButton>
            </WinBox>
          ) : null}
        </GameScreen>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Game;
