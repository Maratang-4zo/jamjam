import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { gameRecordAtom } from "../../recoil/atoms/gameState";
import { roomAtom } from "../../recoil/atoms/roomState";
import { playerState } from "../../recoil/atoms/gameState";
import { lineColor } from "../../utils/lineColor";

import subbg from "../../assets/final/subbg.jpg";
import profileBg from "../../assets/final/profileBg.PNG";
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
  width: 300%; /* 배경 이미지의 실제 너비 */
  height: 100%;
  transform: ${(props) => `translateX(-${props.offset}px)`};
  transition: transform ${(props) => props.speed}s linear;
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
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const ProfileWrapper = styled.div`
  position: relative;
  width: 100px; /* 너비와 높이를 고정하거나 필요에 따라 조정 */
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px; /* 각 프로필 사이의 간격 */
`;

const ProfileBG = styled.img`
  position: absolute;
  width: 140%;
  height: 140%;
  top: -17%;
  left: -22%;
  z-index: 1;
`;

const Profile = styled.img`
  position: relative;
  height: 80px; /* 프로필 이미지의 고정된 높이 */
  width: 80px; /* 프로필 이미지의 고정된 너비 */
  border-radius: 50%;
  z-index: 2;
`;

const Banner = styled.div`
  margin-top: 100px;
  position: absolute;
  width: 600px;
  height: 120px;
  border-radius: 30px;
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

const Round3 = () => {
  const [offset, setOffset] = useState(0);
  const [speed, setSpeed] = useState(0.3);
  const [isLastBannerVisible, setIsLastBannerVisible] = useState(false);
  const backgroundRef = useRef(null);

  const gameRecord = useRecoilValue(gameRecordAtom);
  const roomInfo = useRecoilValue(roomAtom);
  const players = useRecoilValue(playerState);

  useEffect(() => {
    let animationFrameId;

    const updateOffset = () => {
      setOffset((prev) => {
        const newOffset = prev + 10; // 전체적으로 속도를 줄임

        if (
          backgroundRef.current &&
          newOffset >= backgroundRef.current.scrollWidth - window.innerWidth
        ) {
          setIsLastBannerVisible(true);
          return prev; // 마지막 배너가 보이면 멈춤
        }

        return newOffset;
      });

      if (!isLastBannerVisible) {
        animationFrameId = requestAnimationFrame(updateOffset);
      }
    };

    updateOffset();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isLastBannerVisible]);

  const renderBanners = () => {
    const positions = {
      1: ["87%"],
      2: ["40%", "87%"],
      3: ["30%", "60%", "87%"],
    };
    const roundRecords = gameRecord;
    const round = roundRecords.length;

    if (positions[round] && roundRecords.length > 0) {
      console.log(roundRecords);
      console.log(gameRecord);
      return roundRecords.map((record, index) => {
        const isLastBanner = index === roundRecords.length - 1;
        const positionInPx = parseFloat(positions[round][index]);

        return (
          <Banner
            key={index}
            ref={isLastBanner ? backgroundRef : null}
            style={{
              top: "15%",
              left: `${positionInPx}%`,
              border: `6px solid ${lineColor[record.subwayLines[0]]}`,
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
        <Banner
          style={{
            top: "15%",
            left: "10%",
            border: `6px solid ${
              lineColor[roomInfo.centerPlace.subwayLines[0]]
            }`, // Use lineColor here
          }}
        >
          {roomInfo.centerPlace.name}
        </Banner>
        {renderBanners()}
      </BackgroundWrapper>
      <SubwayImage src={subway} alt="Subway" />
      <CarContainer>
        {players.map((player, index) => (
          <ProfileWrapper key={player.attendeeUUID}>
            <ProfileBG src={profileBg} alt="Profile Background" />
            <Profile src={player.profileImageUrl} alt={player.nickname} />
          </ProfileWrapper>
        ))}
      </CarContainer>
    </Container>
  );
};

export default Round3;
