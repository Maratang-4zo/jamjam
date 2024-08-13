import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { gameRecordAtom } from "../../recoil/atoms/gameState";
import { roomAtom } from "../../recoil/atoms/roomState";
import { playerState } from "../../recoil/atoms/gameState";

import subwaybg from "../../assets/sbBG.jpg";
import subway from "../../assets/subway.png";

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
  width: 600%; /* 배경 이미지의 실제 너비 */
  height: 100%;
  transition: transform ${(props) => props.speed}s linear;
  transform: ${(props) => `translateX(-${props.offset}px)`};
  z-index: 1;
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
  z-index: 1;
`;

const CarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const Profile = styled.img`
  height: 100%;
  border-radius: 50%;
  margin: 0 5px;
`;

const Banner = styled.div`
  margin-top: 100px;
  position: absolute;
  width: 600px;
  height: 120px;
  background-color: white;
  font-family: "hangil";
  color: black;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.6px solid black;
  z-index: 3;
  text-align: center;
`;

function Round3() {
  const [offset, setOffset] = useState(0);
  const [speed, setSpeed] = useState(0.000120040204012);
  const [isLastBannerVisible, setIsLastBannerVisible] = useState(false);
  const backgroundRef = useRef(null);

  const gameRecord = useRecoilValue(gameRecordAtom);
  const roomInfo = useRecoilValue(roomAtom);
  const players = useRecoilValue(playerState);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLastBannerVisible) {
        setSpeed((prevSpeed) => Math.max(prevSpeed - 0.005, 0)); // 속도를 점점 줄임
        if (speed <= 0.005) {
          clearInterval(interval); // 속도가 0에 가까워지면 멈춤
        }
        return;
      }

      setOffset((prev) => {
        const newOffset = prev + 30;

        if (
          backgroundRef.current &&
          newOffset >= backgroundRef.current.scrollWidth - window.innerWidth
        ) {
          setIsLastBannerVisible(true); // 배경이 끝까지 도달하면 멈춤
        }

        return newOffset;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isLastBannerVisible, speed]);

  const renderBanners = () => {
    const positions = {
      1: ["88%"],
      2: ["30%", "88%"],
      3: ["30%", "60%", "88%"],
    };
    const roundRecords = gameRecord[0]?.roundRecordList || [];
    const round = roundRecords.length;

    if (positions[round] && roundRecords.length > 0) {
      return roundRecords.map((record, index) => {
        const isLastBanner = index === roundRecords.length - 1;

        const positionInPx = parseFloat(positions[round][index]); // 전체 배경 길이에 대한 비율로 위치 계산

        return (
          <Banner
            key={index}
            ref={isLastBanner ? backgroundRef : null}
            style={{
              top: "15%",
              left: `${positionInPx}%`, // 배너가 배경 전체 크기의 비율로 나타나도록 조정
            }}
          >
            {record.stationName}
          </Banner>
        );
      });
    }
    return null;
  };

  return (
    <Container>
      <BackgroundWrapper ref={backgroundRef} offset={offset} speed={speed}>
        <BgImage src={subwaybg} alt="Background" />
        <Banner style={{ top: "15%", left: "10%" }}>
          {roomInfo.centerPlace.name}
        </Banner>
        {renderBanners()}
      </BackgroundWrapper>
      <SubwayImage src={subway} alt="Subway" />
      <CarContainer>
        {players.map((player, index) => (
          <Profile
            key={player.attendeeUUID}
            src={player.profileImageUrl}
            alt={player.nickname}
            style={{
              zIndex: 10 + index,
              width: `${100 / players.length}%`,
            }}
          />
        ))}
      </CarContainer>
    </Container>
  );
}

export default Round3;
