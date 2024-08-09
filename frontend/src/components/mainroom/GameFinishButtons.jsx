import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import {
  roomAtom,
  isNextMiddleExistAtom,
  aroundStationsAtom,
  selectedStationAtom,
  roomPageAtom,
} from "../../recoil/atoms/roomState";
import Loading from "../fixed/Loading";
import { axiosPatchNextMiddle } from "../../apis/mapApi";
import {
  gameRecordAtom,
  gameRecordUUIDAtom,
  isWinnerAtom,
  totalRoundAtom,
  currentRoundAtom,
} from "../../recoil/atoms/playerState";
import useWs from "../../hooks/useWs";
import { axiosGetRoundResult } from "../../apis/gameApi";

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
  const [isFinalLoading, setIsFinalLoading] = useState(false);
  const setRoomPage = useSetRecoilState(roomPageAtom);
  const [isWinner, setIsWinner] = useRecoilState(isWinnerAtom);
  const { sendUpdatePage } = useWs();
  const gameRecordUUID = useRecoilValue(gameRecordUUIDAtom);
  const setGameRecord = useSetRecoilState(gameRecordAtom);

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  const handleDecision = async () => {
    if (selectedStation) {
      try {
        const res = await axiosPatchNextMiddle({
          roomUUID,
          startStation: selectedStation.name,
        });
        setRoomState((prev) => ({
          ...prev,
          centerPlace: res.roomCenterStart,
          attendees: res.attendees,
        }));
      } catch (err) {
        console.log("방 중심 이동 실패", err);
      }
      setIsNextMiddleExist(true);
    }
  };

  const handleNextRoundBtnClick = () => {
    setCurrentRound((prev) => (prev += 1));
    sendUpdatePage({
      roomNextPage: "gamechoice",
    });
    setSelectedStation(null);
    setIsNextMiddleExist(false);
    setIsWinner(false);
  };

  const handleFinalResultBtnClick = async () => {
    setSelectedStation(null);
    setIsNextMiddleExist(false);
    setIsFinalLoading(true);
    setIsWinner(false);
    // 여기부터는 axios 호출 끝나고 넣을 애들
    try {
      const res = await axiosGetRoundResult({ gameRecordUUID });

      setGameRecord(res.roundRecordList);

      sendUpdatePage({
        roomNextPage: "result",
      });
    } catch (err) {
      console.log("최종 결과 불러오기 실패", err);
    } finally {
      setIsFinalLoading(false);
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.closest(".station-btn") === null) {
      setSelectedStation(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const lineColor = {
    LINE_1: "#0052A4", // 01호선
    LINE_2: "#009D3E", // 02호선
    LINE_3: "#EF7C1C", // 03호선
    LINE_4: "#00A5DE", // 04호선
    LINE_5: "#996CAC", // 05호선
    LINE_6: "#CD7C2F", // 06호선
    LINE_7: "#747F00", // 07호선
    LINE_8: "#EA545D", // 08호선
    LINE_9: "#BDB092", // 09호선
    GYEONGGANG: "#003DA5", // 경강선
    GYEONGUI: "#77C4A3", // 경의선
    GYEONGCHUN: "#0C8E72", // 경춘선
    AIRPORT: "#0090D2", // 공항철도
    GIMPOGOLD: "#AD8605", // 김포골드
    BUNDANG: "#FABE00", // 분당선
    SEOHAE: "#8FC31F", // 서해선
    SUIIN: "#FABE00", // 수인선
    SINBUNDANG: "#D31145", // 신분당선
    YONGINGYEONGJEON: "#6FB245", // 용인경전철
    UIISHINSEOLGYEONGJEON: "#B7C452", // 우이신설경전철
    UIJEONBUGYEONGJEON: "#F5A200", // 의정부경전철
    INCHEON: "#7CA8D5", // 인천선
    INCHEON2: "#ED8B00", // 인천2호선
  };

  const lineName = {
    LINE_1: "1호선",
    LINE_2: "2호선",
    LINE_3: "3호선",
    LINE_4: "4호선",
    LINE_5: "5호선",
    LINE_6: "6호선",
    LINE_7: "7호선",
    LINE_8: "8호선",
    LINE_9: "9호선",
    GYEONGGANG: "경강선",
    GYEONGUI: "경의선",
    GYEONGCHUN: "경춘선",
    AIRPORT: "공항철도",
    GIMPOGOLD: "김포골드",
    BUNDANG: "분당선",
    SEOHAE: "서해선",
    SUIIN: "수인선",
    SINBUNDANG: "신분당선",
    YONGINGYEONGJEON: "용인경전철",
    UIISHINSEOLGYEONGJEON: "우이신설경전철",
    UIJEONBUGYEONGJEON: "의정부경전철",
    INCHEON: "인천선",
    INCHEON2: "인천2호선",
  };
  return (
    <div style={{ zIndex: "100", height: "100%" }}>
      {isFinalLoading ? <Loading message={"모임장소 내역 불러오는"} /> : null}
      <BottomBtns>
        {!isNextMiddleExist ? (
          <BigBtn
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
