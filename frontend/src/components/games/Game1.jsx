import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  gameCountAtom,
  gameStateAtom,
  isWinnerAtom,
  playerState,
  winnerNicknameAtom,
} from "../../recoil/atoms/gameState";
import { useLocation } from "react-router-dom";
import { useWebSocket } from "../../context/WebsocketContext";
import gameBg from "../../assets/game/gameBg.jpg";

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

function Game1({ handleClick, onWin }) {
  const [bottom, setBottom] = useState(0);
  const [win, setWin] = useRecoilState(isWinnerAtom);
  const [countdown, setCountdown] = useRecoilState(gameCountAtom);
  const [players, setPlayers] = useRecoilState(playerState);
  const [winner, setWinner] = useRecoilState(winnerNicknameAtom); // 승리자 상태 추가
  const location = useLocation();
  const { roomUUID, attendeeUUID } = location.state || {};
  const { sendGame } = useWebSocket();
  const gameState = useRecoilValue(gameStateAtom);

  useEffect(() => {
    console.log("플레이어 상태 초기화 여부 확인:", players);
    console.log("카운트다운 상태 초기화 여부 확인:", countdown);
  }, []);

  useEffect(() => {
    console.log("player 리스트", players);
    if (countdown === 0) {
      handleClick.current = () => {
        if (!win && !winner) {
          // 승리자가 없을 때만 클릭 이벤트 처리
          setPlayers((prevPlayers) => {
            const updatedPlayers = prevPlayers.map((player) => {
              if (player.attendeeUUID === attendeeUUID) {
                const newBottom = player.bottom + 10;
                if (newBottom >= 480) {
                  onWin();
                }
                sendGame({ newBottom });
                return { ...player, bottom: newBottom };
              }
              return player;
            });
            return updatedPlayers;
          });
        }
      };
    }
  }, [countdown, handleClick, win, winner, roomUUID, attendeeUUID, onWin]);

  return (
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
                profileImageUrl={player.profileImageUrl} // 각 플레이어의 프로필 이미지 설정
              />
            ))}
          </BlockContainer>
          <WinMessage show={gameState === "end"}>
            {winner && `${winner} WIN!!!`}
          </WinMessage>
        </>
      ) : null}
    </Container>
  );
}

export default Game1;
