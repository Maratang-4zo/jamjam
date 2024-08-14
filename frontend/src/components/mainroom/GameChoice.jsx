import GameBoxes from "../gamechoice/GameBoxes";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import wavebutton from "../../assets/wavebutton.svg";
import { roomAtom } from "../../recoil/atoms/roomState";
import {
  currentRoundAtom,
  gameSessionUUIDAtom,
  playerState,
  selectedGameAtom,
} from "../../recoil/atoms/gameState";
import { userInfoAtom } from "../../recoil/atoms/userState";
import useWs from "../../hooks/useWs";

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
  font-family: "pixel", Helvetica;
  font-size: 36px;
  font-weight: 500;
`;

function GameChoice() {
  const [localSelectedGame, setLocalSelectedGame] = useState(null);
  const roomInfo = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const setPlayerState = useSetRecoilState(playerState);
  const { sendRoundInfo } = useWs();
  const [selectedGame, setSelectedGame] = useRecoilState(selectedGameAtom);
  const currentRound = useRecoilValue(currentRoundAtom);
  const gameSessionUUID = useRecoilValue(gameSessionUUIDAtom);

  useEffect(() => {
    const initialPlayers = roomInfo.attendees
      .filter((attendee) => attendee.attendeeStatus === "ENTERED")
      .map((attendee) => ({
        nickname: attendee.nickname,
        attendeeUUID: attendee.attendeeUUID,
        profileImageUrl: attendee.profileImageUrl,
        bottom: 0,
      }));
    setPlayerState(initialPlayers);
  }, [roomInfo, userInfo, setPlayerState]);

  const handlePlayButtonClick = () => {
    if (localSelectedGame != null) {
      sendRoundInfo({
        round: currentRound,
        gameId: localSelectedGame,
        gameSessionUUID: gameSessionUUID,
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
