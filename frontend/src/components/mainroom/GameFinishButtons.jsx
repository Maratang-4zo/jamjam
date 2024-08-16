import React, { useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import {
  roomAtom,
  isNextMiddleExistAtom,
  aroundStationsAtom,
  selectedStationAtom,
} from "../../recoil/atoms/roomState";
import Loading from "../fixed/Loading";
import {
  gameRecordAtom,
  isWinnerAtom,
  totalRoundAtom,
  currentRoundAtom,
  gameSessionUUIDAtom,
  currentRoundUUIDAtom,
  winnerUUIDAtom,
  winnerNicknameAtom,
} from "../../recoil/atoms/gameState";
import { lineColor } from "../../utils/lineColor";
import { lineName } from "../../utils/lineName";
import { isHistoryLoadingAtom } from "../../recoil/atoms/loadingState";
import { useWebSocket } from "../../context/WebsocketContext";

const BottomBtns = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  align-items: end;
  gap: 10px;
`;

const BigBtn = styled.button`
  display: flex;
  width: 150px;
  height: 45px;
  padding: 7px 17px;
  justify-content: center;
  align-items: center;
  gap: 8.229px;
  flex-shrink: 0;
  border-radius: 15px;
  border: 3px solid #000;
  background-color: ${(props) => {
    if (props.isTutorialModalOpen) {
      return props.highlight ? props.theme.bgColor : "gray";
    }
    return props.disabled ? "gray" : props.theme.bgColor;
  }};
  color: ${(props) => {
    if (props.isTutorialModalOpen) {
      return props.highlight ? "black" : "lightgray";
    }
    return props.disabled ? "lightgray" : "inherit";
  }};
  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "black")};
    color: ${(props) => (props.disabled ? "none" : props.theme.bgColor)};
    transition: 0.3s;
  }
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  position: ${(props) => (props.isTutorialModalOpen ? "relative" : "static")};
  z-index: ${(props) => (props.isTutorialModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
`;
const RightBtns = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const StationBtn = styled.div`
  width: 170px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 30px;
  border: 5px solid ${(props) => props.color};
  background-color: ${(props) => props.theme.subaccentColor + "95"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  cursor: pointer;

  &:hover .inner {
    transform: rotateY(180deg);
  }
  &:focus {
    outline: none;
    background-color: ${(props) => props.theme.infoColorHover + "95"};
  }

  .inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .front,
  .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
  }

  .front {
    span {
      color: ${(props) => props.theme.accentColor};
      font-family: "Galmuri11";
      font-size: 30px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }

  .back {
    background-color: none;
    transform: rotateY(180deg);
    span {
      color: ${(props) => props.theme.accentColor};
      font-family: "Galmuri11";
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
`;

function GameFinishButtons() {
  const { roomUUID } = useParams();
  const roomState = useRecoilValue(roomAtom);
  const setRoomState = useSetRecoilState(roomAtom);
  const isNextMiddleExist = useRecoilValue(isNextMiddleExistAtom);
  const aroundStations = useRecoilValue(aroundStationsAtom);
  const [selectedStation, setSelectedStation] =
    useRecoilState(selectedStationAtom);
  const setIsNextMiddleExist = useSetRecoilState(isNextMiddleExistAtom);
  const totalRound = useRecoilValue(totalRoundAtom);
  const [currentRound, setCurrentRound] = useRecoilState(currentRoundAtom);
  const [isFinalLoading, setIsFinalLoading] =
    useRecoilState(isHistoryLoadingAtom);
  const [isWinner, setIsWinner] = useRecoilState(isWinnerAtom);
  const { sendNextRound, sendGoResult, sendNextRoundCenter } = useWebSocket();
  const gameSessionUUID = useRecoilValue(gameSessionUUIDAtom);
  const gameRoundUUID = useRecoilValue(currentRoundUUIDAtom);
  const setGameRecord = useSetRecoilState(gameRecordAtom);
  const setWinnerUUID = useSetRecoilState(winnerUUIDAtom);
  const setWinnerNicknameUUID = useSetRecoilState(winnerNicknameAtom);

  const handleStationClick = (station) => {
    console.log("여기", station);
    setSelectedStation(station);
  };

  const handleDecision = async () => {
    if (selectedStation) {
      sendNextRoundCenter({
        gameRoundUUID,
        roundStationName: selectedStation,
      });
    } else {
      alert("역을 선택해주세요");
    }
  };

  const handleNextRoundBtnClick = () => {
    sendNextRound({ gameRoundUUID, currentRound, totalRound });
    setSelectedStation(null);
    setIsNextMiddleExist(false);
    setIsWinner(false);
    setWinnerUUID("");
    setWinnerNicknameUUID("");
  };

  const handleFinalResultBtnClick = async () => {
    sendGoResult({ gameSessionUUID });
    setSelectedStation(null);
    setIsNextMiddleExist(false);
    setIsFinalLoading(true);
    setIsWinner(false);
    setWinnerUUID("");
    setWinnerNicknameUUID("");
  };

  const handleClickOutside = (e) => {
    if (
      e.target.closest(".station-btn") === null &&
      e.target.closest(".submit-btn") === null
    ) {
      setSelectedStation(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ zIndex: "100", height: "100%" }}>
      {isFinalLoading ? <Loading message={"모임장소 내역 불러오는"} /> : null}
      <BottomBtns>
        {!isNextMiddleExist ? (
          <BigBtn
            className="submit-btn"
            onClick={handleDecision}
            disabled={!selectedStation || !isWinner}
          >
            결정
          </BigBtn>
        ) : totalRound === currentRound ? (
          <BigBtn onClick={handleFinalResultBtnClick} disabled={!isWinner}>
            Final Result
          </BigBtn>
        ) : (
          <BigBtn onClick={handleNextRoundBtnClick} disabled={!isWinner}>
            Next Round
          </BigBtn>
        )}
      </BottomBtns>
      {!isNextMiddleExist ? (
        <RightBtns>
          {aroundStations.map((station, index) => (
            <StationBtn
              tabIndex="0"
              key={index}
              className="station-btn"
              color={lineColor[station.subwayLines[0]]}
              onClick={() => handleStationClick(station)}
            >
              <div className="inner">
                <div className="front">
                  <span>{station.name}</span>
                </div>
                <div className="back">
                  <span>
                    {station.subwayLines
                      .map((line) => lineName[line])
                      .join(" ")}
                  </span>
                </div>
              </div>
            </StationBtn>
          ))}
        </RightBtns>
      ) : null}
    </div>
  );
}

export default GameFinishButtons;
