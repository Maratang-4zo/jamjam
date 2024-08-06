import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import {
  chatModalVisibleAtom,
  roomAtom,
  isGameFinishAtom,
  isNextMiddleExistAtom,
  aroundStationsAtom,
  selectedStationAtom,
  totalRoundAtom,
  currentRoundAtom,
} from "../../recoil/atoms/roomState";
import { userInfoAtom } from "../../recoil/atoms/userState";
import alertIcon from "../../assets/icons/alertIcon.png";
import TutorialModal from "./Tutorial";
import { axiosGetMiddle } from "../../apis/mapApi";
import { useNavigate } from "react-router-dom";

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

const SmallBtn = styled.button`
  display: flex;
  width: 45px;
  height: 45px;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 15px;
  border: 3px solid #000;
  background: ${(props) => props.theme.subaccentColor + "86"};
  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "#00000086")};
    color: ${(props) => (props.disabled ? "none" : props.theme.subaccentColor)};
    transition: 0.3s;
  }
  position: ${(props) => (props.isTutorialModalOpen ? "relative" : "static")};
  z-index: ${(props) => (props.isTutorialModalOpen ? 1100 : "auto")};
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
`;

const RightTopBtns = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const SmallIcon = styled.img`
  width: 35px;
  height: 35px;
`;

const RightBtns = styled.div`
  position: absolute;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const StationBtn = styled.div`
  width: 180px;
  height: 80px;
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
      font-size: 40px;
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

const fadeInUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(-0px);
    opacity: 1;
  }
`;

const RoundSetting = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 150px;
  flex-shrink: 0;
  border-radius: 15px 15px 0 0;
  border: 3px solid #000;
  border-bottom: none;
  background-color: ${(props) => props.theme.bgColor};
  animation: ${fadeInUp} 0.3s ease-in-out;
`;

const RoundBtn = styled.button`
  display: flex;
  width: 50px;
  height: 45px;
  justify-content: center;
  align-items: center;
  border-radius: 12px 0 0 0;
  border: none;
  border-right: 3px solid #000;
  background-color: ${(props) => props.theme.bgColor};
  color: black;
  font-size: 24px;
  &:hover {
    background-color: black;
    color: ${(props) => props.theme.bgColor};
    transition: 0.3s;
  }
  cursor: pointer;
  z-index: 1000;
`;
const RoundBtn2 = styled.button`
  display: flex;
  width: 50px;
  height: 45px;
  justify-content: center;
  align-items: center;
  border-radius: 0 12px 0 0;
  border: none;
  border-left: 3px solid #000;
  background-color: ${(props) => props.theme.bgColor};
  color: black;
  font-size: 24px;
  &:hover {
    background-color: black;
    color: ${(props) => props.theme.bgColor};
    transition: 0.3s;
  }
  cursor: pointer;
`;

const RoundBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const OkBtn = styled.button`
  display: flex;
  width: 150px;
  height: 45px;
  padding: 7px 17px;
  justify-content: center;
  align-items: center;
  gap: 8.229px;
  flex-shrink: 0;
  border-radius: 0 0 15px 15px;
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
  z-index: 1100;
  pointer-events: ${(props) => (props.isTutorialModalOpen ? "none" : "auto")};
`;

function Buttons({ onOpenEditModal, onOpenShareModal }) {
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [currentTutorialPage, setCurrentTutorialPage] = useState(1);
  const [roundSetting, setRoundSetting] = useState(false);
  const [round, setRound] = useState(1);
  const navigate = useNavigate();
  const roomState = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const setRoomState = useSetRecoilState(roomAtom);
  const setChatVisible = useSetRecoilState(chatModalVisibleAtom);
  const isGameFinish = useRecoilValue(isGameFinishAtom);
  const isNextMiddleExist = useRecoilValue(isNextMiddleExistAtom);
  const aroundStations = useRecoilValue(aroundStationsAtom);
  const [selectedStation, setSelectedStation] =
    useRecoilState(selectedStationAtom);
  const setIsNextMiddleExist = useSetRecoilState(isNextMiddleExistAtom);
  const [totalRound, setTotalRound] = useRecoilState(totalRoundAtom);
  const [currentRound, setCurrentRound] = useRecoilState(currentRoundAtom);

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

  const openTutorialModal = () => {
    setIsTutorialModalOpen(true);
    document.body.classList.add("modal-open");
    setChatVisible(false);
  };

  const closeTutorialModal = () => {
    setIsTutorialModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const handleFindCenter = async () => {
    try {
      const data = await axiosGetMiddle({ roomUUId: roomState.roomUUID });
      setRoomState((prev) => ({
        ...prev,
        centerPlace: data.roomCenterStart,
        isCenterExist: true,
        attendees: data.attendees,
      }));
    } catch (error) {
      console.error("중심찾기 실패!!!", error);
    }
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  const handleDecision = () => {
    if (selectedStation) {
      setRoomState((prev) => ({
        ...prev,
        centerPlace: selectedStation,
      }));
      setIsNextMiddleExist(true);
    }
  };

  const handleNextRoundBtnClick = () => {
    setCurrentRound((prev) => (prev += 1));
    navigate(`/room/${roomState.roomUUID}/gamechoice`);
    setSelectedStation(null);
  };

  const handleFinalResultBtnClick = () => {
    navigate(`/room/${roomState.roomUUID}/result`);
    setSelectedStation(null);
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

  const handleGameButtonClick = () => {
    if (!roundSetting) {
      setRoundSetting(true);
    } else {
      setRoundSetting(false);
    }
  };

  const increaseRound = () => {
    if (round < 3) setRound((prev) => prev + 1);
  };

  const decreaseRound = () => {
    if (round > 1) setRound((prev) => prev - 1);
  };

  const handleConfirmGame = () => {
    navigate(`/room/${roomState.roomUUID}/gamechoice`);
    setTotalRound(round);
  };

  return (
    <>
      <BottomBtns>
        {isGameFinish ? null : (
          <>
            <SmallBtn
              onClick={openTutorialModal}
              isTutorialModalOpen={isTutorialModalOpen}
            >
              <SmallIcon src={alertIcon} />
            </SmallBtn>
            {roundSetting ? (
              <RoundBox>
                <RoundSetting>
                  <RoundBtn onClick={decreaseRound}>-</RoundBtn>
                  <span>{round}</span>
                  <RoundBtn2 onClick={increaseRound}>+</RoundBtn2>
                </RoundSetting>
                <OkBtn
                  onClick={handleConfirmGame}
                  isTutorialModalOpen={isTutorialModalOpen}
                  highlight={currentTutorialPage === 2}
                >
                  확인
                </OkBtn>
              </RoundBox>
            ) : (
              <BigBtn
                onClick={handleGameButtonClick}
                disabled={!roomState.isCenterExist || !userInfo.isHost}
                isTutorialModalOpen={isTutorialModalOpen}
                highlight={currentTutorialPage === 2}
              >
                GAME
              </BigBtn>
            )}

            <BigBtn
              onClick={handleFindCenter}
              disabled={
                !roomState.isAllHasDeparture ||
                !userInfo.isHost ||
                roomState.isCenterExist
              }
              isTutorialModalOpen={isTutorialModalOpen}
              highlight={currentTutorialPage === 1}
            >
              중심 찾기
            </BigBtn>
          </>
        )}
        {isGameFinish && !isNextMiddleExist ? (
          <BigBtn onClick={handleDecision} disabled={!selectedStation}>
            결정
          </BigBtn>
        ) : null}
        {isGameFinish && isNextMiddleExist ? (
          totalRound === currentRound ? (
            <BigBtn onClick={handleFinalResultBtnClick}>Final Result</BigBtn>
          ) : (
            <BigBtn onClick={handleNextRoundBtnClick}>Next Round</BigBtn>
          )
        ) : null}
      </BottomBtns>

      {isGameFinish ? null : (
        <RightTopBtns>
          <SmallBtn
            onClick={onOpenEditModal}
            isTutorialModalOpen={isTutorialModalOpen}
          >
            수정
          </SmallBtn>
          <SmallBtn
            onClick={() => onOpenShareModal("초대 링크 공유", "50px")}
            isTutorialModalOpen={isTutorialModalOpen}
          >
            초대
          </SmallBtn>
          <SmallBtn
            onClick={() => onOpenShareModal("모임 정보 공유", "110px")}
            isTutorialModalOpen={isTutorialModalOpen}
          >
            공유
          </SmallBtn>
        </RightTopBtns>
      )}

      {isGameFinish && !isNextMiddleExist ? (
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

      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={closeTutorialModal}
        currentPage={currentTutorialPage}
        setCurrentPage={setCurrentTutorialPage}
      />
    </>
  );
}

export default Buttons;
