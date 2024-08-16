import GameBoxes from "../gamechoice/GameBoxes";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { roomAtom } from "../../recoil/atoms/roomState";
import {
  currentRoundAtom,
  gameSessionUUIDAtom,
  playerState,
  roundCenterAtom,
  selectedGameAtom,
} from "../../recoil/atoms/gameState";
import { userInfoAtom } from "../../recoil/atoms/userState";
import { useWebSocket } from "../../context/WebsocketContext";

const WavyAni = keyframes`
    0% {
        --_i: calc(0 * var(--s));
    }
    12.5% {
        --_i: calc(0.5 * var(--s));
    }
    25% {
        --_i: calc(1 * var(--s));
    }
    37.5% {
        --_i: calc(1.5 * var(--s));
    }
    50% {
        --_i: calc(2 * var(--s));
    }
    62.5% {
        --_i: calc(2.5 * var(--s));
    }
    75% {
        --_i: calc(3 * var(--s));
    }
    87.5% {
        --_i: calc(3.5 * var(--s));
    }
    100% {
        --_i: calc(4 * var(--s));
    }
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
  margin-right: 40px;
  width: calc(100% - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 35px;
  z-index: 1;
`;

const PlayButton = styled.button`
  --s: 0.5em;
  padding: 0.4em 0.5em;
  background-color: ${(props) =>
    props.disabled ? "gray" : "#000"}; /* Host가 아닐 때 회색 */
  color: ${(props) =>
    props.disabled ? "#fff" : "#ffe845"}; /* Host가 아닐 때 텍스트 색상 */
  --_s: calc(var(--s) * 4) 51% repeat-x;
  --_r: calc(1.345 * var(--s)) at left 50%;
  --_g1: #000 99%, #0000 101%;
  --_g2: #0000 99%, #000 101%;
  --mask: radial-gradient(var(--_r) top calc(var(--s) * 1.9), var(--_g1))
      calc(50% - 2 * var(--s) - var(--_i, 0px)) 0 / var(--_s),
    radial-gradient(var(--_r) top calc(var(--s) * -0.9), var(--_g2))
      calc(50% - var(--_i, 0px)) var(--s) / var(--_s),
    radial-gradient(var(--_r) bottom calc(var(--s) * 1.9), var(--_g1))
      calc(50% - 2 * var(--s) + var(--_i, 0px)) 100% / var(--_s),
    radial-gradient(var(--_r) bottom calc(var(--s) * -0.9), var(--_g2))
      calc(50% + var(--_i, 0px)) calc(100% - var(--s)) / var(--_s);
  -webkit-mask: var(--mask);
  mask: var(--mask);
  cursor: ${(props) =>
    props.disabled
      ? "not-allowed"
      : "pointer"}; /* Host가 아닐 때 not-allowed */
  margin-bottom: 20px;
  height: 100px;
  width: 270px;
  margin: 10px 0 0 0;
  border: none;
  font-family: "pixel";
  font-size: 24px;
  animation: ${WavyAni} 0.3s linear infinite paused;

  &:hover {
    animation-play-state: ${(props) => (props.disabled ? "paused" : "running")};
    background-color: ${(props) =>
      props.disabled ? "gray" : "#000"}; /* Host가 아닐 때 색상 유지 */
    color: ${(props) =>
      props.disabled
        ? "#fff"
        : "#ffe845"}; /* Host가 아닐 때 텍스트 색상 유지 */
  }

  &:active {
    background-image: linear-gradient(#0004 0 0);
  }

  &:focus-visible {
    -webkit-mask: none;
    outline-offset: 0.1em;
    padding: 0.2em 0.5em;
    margin: 0.2em 0;
  }
`;

const PlayButtonText = styled.div`
  color: #ffe845;
  font-family: "pixel", Helvetica;
  font-size: 36px;
  font-weight: 500;
`;

function GameChoice() {
  const roomInfo = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const roundCenter = useRecoilValue(roundCenterAtom);
  const setPlayerState = useSetRecoilState(playerState);
  const { sendRoundInfo } = useWebSocket();
  const [selectedGame, setSelectedGame] = useRecoilState(selectedGameAtom);
  const currentRound = useRecoilValue(currentRoundAtom);
  const gameSessionUUID = useRecoilValue(gameSessionUUIDAtom);

  useEffect(() => {
    const initialPlayers = roomInfo.attendees
      .filter(
        (attendee) =>
          attendee.status === "ENTERED" || attendee.status === "CREATED",
      )
      .map((attendee) => ({
        nickname: attendee.nickname,
        attendeeUUID: attendee.attendeeUUID,
        profileImageUrl: attendee.profileImageUrl,
        bottom: 0,
      }));
    setPlayerState(initialPlayers);
    console.log(playerState);
    console.log(initialPlayers);
  }, [roomInfo, userInfo, setPlayerState]);

  const handlePlayButtonClick = () => {
    if (selectedGame != null) {
      sendRoundInfo({
        round: currentRound,
        gameId: 1,
        gameSessionUUID: gameSessionUUID,
        stationName: roundCenter.name,
      });
    }
  };

  return (
    <>
      <ContentContainer>
        <Header>Choose The Game</Header>
        <GameBoxes
          selectedGame={selectedGame}
          setSelectedGame={userInfo.isHost ? setSelectedGame : null}
        ></GameBoxes>
        <PlayButton disabled={!userInfo.isHost} onClick={handlePlayButtonClick}>
          <PlayButtonText>PLAY</PlayButtonText>
        </PlayButton>
      </ContentContainer>
    </>
  );
}

export default GameChoice;
