import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { playerState } from "../../recoil/atoms/playerState";
import { useLocation } from "react-router-dom";
import useWs from "../../hooks/useWs";
import sendGame from "../../hooks/useWs";

const Block = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: ${(props) => props.bottom}px;
  left: ${(props) => props.left}px;
  transition: bottom 0.1s;
  background-image: url(${(props) => props.profile});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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
  const [win, setWin] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [players, setPlayers] = useRecoilState(playerState);
  const [winner, setWinner] = useState(null); // 승리자 상태 추가
  const location = useLocation();
  const { roomUUID, attendeeUUID } = location.state || {};
  const { sendGame } = useWs(); // useWs 훅 사용

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      handleClick.current = () => {
        if (!win && !winner) {
          // 승리자가 없을 때만 클릭 이벤트 처리
          setPlayers((prevPlayers) => {
            const updatedPlayers = prevPlayers.map((player) => {
              if (player.attendeeUUID === attendeeUUID) {
                const newBottom = player.bottom + 10;
                if (newBottom >= 480) {
                  setWin(true);
                  setWinner(player.nickname); // 승리자 설정
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
    <>
      {countdown > 0 ? (
        <Countdown>{countdown === 1 ? "START" : countdown - 1}</Countdown>
      ) : (
        <>
          {players.map((player, index) => (
            <Block
              key={player.attendeeUUID}
              bottom={player.bottom}
              profile={player.profile} // 각 플레이어의 프로필 이미지 설정
              left={50 * index + 50} // 간격을 주어 중앙정렬
            />
          ))}
          <WinMessage show={!!winner}>
            {winner && `${winner} WIN!!!`}
          </WinMessage>
        </>
      )}
    </>
  );
}

export default Game1;
