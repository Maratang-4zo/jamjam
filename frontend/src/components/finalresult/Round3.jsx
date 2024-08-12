import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { gameRecordAtom } from "../../recoil/atoms/gameState";
import { roomAtom } from "../../recoil/atoms/roomState";
import { playerState } from "../../recoil/atoms/gameState";

import subbg from "../../assets/subbg.jpg";
import subway from "../../assets/subway.png";
import car from "../../assets/final/car.png";

import opencar from "../../assets/opencar.png";
import gang from "../../assets/ganggangg.png";
import gwang from "../../assets/gwanggwang.png";
import mingang from "../../assets/final/mingang.png";
import practice from "../../assets/final/practice.jpg";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 310%;
  height: 100%;
  transition: transform ${(props) => props.speed}s linear;
  transform: ${(props) => `translateX(-${props.offset}px)`};
  z-index: 1; /* BackgroundWrapper가 위에 위치하도록 설정 */
`;

const BgImage = styled.img`
  width: 100%;
  height: 100%;
`;

const SubwayImage = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* Subway가 가장 아래에 위치하도록 설정 */
`;

const CarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2; /* CarContainer가 BackgroundWrapper 위에 위치 */
`;

const Car = styled.img`
  height: 100%;
`;

const Mingang = styled.img`
  position: absolute;
  height: 30%;
  top: 10%;
  border-radius: 50%;
  overflow: hidden;
`;

const Banner = styled.div`
  position: absolute;
  width: 180px;
  height: 96px;
  background-color: #4e7f1c;
  font-family: "hangil";
  color: #edeeea;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.6px solid black;
  z-index: 3;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: -100%;
    width: 12px;
    height: 110%;
    background-color: gray;
    border-radius: 6px;
  }
  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

const InnerRectangle = styled.div`
  width: 90%;
  height: 90%;
  border: 2.4px solid #edeeea;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #edeeea;
`;

function Round3() {
  const [offset, setOffset] = useState(0);
  const [speed, setSpeed] = useState(0.033); // 초기 속도 (3배 빠름)
  const [carPosition, setCarPosition] = useState(0);
  const [isCarStopped, setIsCarStopped] = useState(false);

  const gameRecord = useRecoilValue(gameRecordAtom);
  const roomInfo = useRecoilValue(roomAtom);
  const players = useRecoilValue(playerState);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev + 30;

        // Banner가 중앙에 올 때 속도 조절
        const centralPosition = window.innerWidth / 2;
        if (
          newOffset >= centralPosition - 100 &&
          newOffset <= centralPosition + 100
        ) {
          setSpeed(0.1); // 속도 느리게
        } else {
          setSpeed(0.033); // 원래 속도
        }

        if (newOffset >= window.innerWidth * 2) {
          clearInterval(interval);
          moveCarToEnd();
        }

        return newOffset;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const moveCarToEnd = () => {
    const interval = setInterval(() => {
      setCarPosition((prev) => {
        const newPosition = prev + 10;

        if (newPosition >= window.innerWidth - 600) {
          clearInterval(interval);
          setIsCarStopped(true);
        }

        return newPosition;
      });
    }, 100);
  };

  const renderBanners = () => {
    const positions = {
      1: ["90%"],
      2: ["52.5%", "90%"],
      3: ["40%", "60%", "90%"],
    };
    const roundRecords = gameRecord[0]?.roundRecordList || [];
    // const round = roundRecords.length;
    const round = 1;
    if (positions[round] && roundRecords.length > 0) {
      return roundRecords.map((record, index) => {
        const isLastBanner = index === roundRecords.length - 1 && isCarStopped;

        return (
          <Banner
            key={index}
            style={{
              top: "15%",
              left: positions[round][index],
              backgroundColor: isLastBanner ? "#2046f6" : undefined,
            }}
          >
            <InnerRectangle>
              {isLastBanner ? "안녕히 가십시오." : record.stationName}
            </InnerRectangle>
          </Banner>
        );
      });
    }
    return null;
  };

  return (
    <Container>
      <BackgroundWrapper offset={offset} speed={speed}>
        <BgImage src={subbg} alt="Background" />
        <Banner style={{ top: "15%", left: "10%" }}>
          <InnerRectangle>{roomInfo.centerPlace.name}</InnerRectangle>
        </Banner>
        {renderBanners()}
      </BackgroundWrapper>
      <SubwayImage src={subway} alt="Subway" />
      <CarContainer style={{ left: `${carPosition}px` }}>
        {players.map((player, index) => (
          <Mingang
            key={player.attendeeUUID}
            src={player.profileImageUrl}
            alt={player.nickname}
            style={{
              left: `${index * 50}px`,
              zIndex: 10 + index,
            }}
          />
        ))}
      </CarContainer>
    </Container>
  );
}

export default Round3;
