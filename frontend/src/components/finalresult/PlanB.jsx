import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { gameRecordAtom } from "../../recoil/atoms/gameState";
import { roomAtom } from "../../recoil/atoms/roomState";
import { playerState } from "../../recoil/atoms/gameState";

import car from "../../assets/final/car.png";

import opencar from "../../assets/opencar.png";
import gang from "../../assets/ganggangg.png";
import gwang from "../../assets/gwanggwang.png";
import mingang from "../../assets/final/mingang.png";
import practice from "../../assets/final/practice.jpg";

// 라운드는 전역변수에서 api 만들어지면 가져올 예정

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
  transition: transform 0.033s linear; /* 3 times faster */
  transform: ${(props) => `translateX(-${props.offset}px)`};
`;

const BgImage = styled.img`
  width: 100%; /* Fill the entire width of the BackgroundWrapper */
  height: 100%;
`;

const CarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0; /* Positioned to touch the left screen */
  height: 260px; /* Increased height to 260px (200px * 1.3) */
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(0%);
`;

const Car = styled.img`
  height: 100%; /* Ensures the car image fills the container */
`;

const Mingang = styled.img`
  position: absolute;
  height: 30%; /* Reduced size to 30% of the CarContainer height */
  top: 10%; /* Move the Mingang image up a bit */
  border-radius: 50%;
  overflow: hidden;
`;

const Pole = styled.div`
  position: absolute;
  top: -100%; /* Container의 위쪽까지 이어지도록 설정 */
  width: 12px;
  height: 110%; /* Banner의 상단에서 Container의 위쪽까지 */
  background-color: gray;
  border-radius: 6px;
`;

const Banner = styled.div`
  position: absolute;
  width: 180px;
  height: 96px;
  /* background-color: #195433; */
  background-color: #4e7f1c;
  font-family: "hangil";
  color: #edeeea;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.6px solid black;
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
  border: 2.4px solid #edeeea; /* Banner의 color와 같은 색 */
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #edeeea; /* 텍스트 색상을 Banner와 맞춤 */
`;

function Round3() {
  const [offset, setOffset] = useState(0);
  const [carPosition, setCarPosition] = useState(0);
  const [isCarStopped, setIsCarStopped] = useState(false); // 자동차가 멈췄는지 상태를 저장

  const gameRecord = useRecoilValue(gameRecordAtom);
  const roomInfo = useRecoilValue(roomAtom);
  const players = useRecoilValue(playerState); // playerState를 players로 받음

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev + 30; // 3 times faster

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
          // Adjust this value based on the car's width
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
    const round = roundRecords.length;

    if (positions[round] && roundRecords.length > 0) {
      return roundRecords.map((record, index) => {
        const isLastBanner = index === roundRecords.length - 1 && isCarStopped; // 마지막 배너인지 확인

        return (
          <Banner
            key={index}
            style={{
              top: "15%",
              left: positions[round][index],
              backgroundColor: isLastBanner ? "#2046f6" : undefined, // 마지막 배너의 배경색 변경
            }}
          >
            <InnerRectangle>
              {isLastBanner ? "안녕히 가십시오." : record.stationName}{" "}
            </InnerRectangle>
          </Banner>
        );
      });
    }
    return null;
  };

  return (
    <Container>
      <BackgroundWrapper offset={offset}>
        <BgImage src={practice} alt="Background" />
        <Banner style={{ top: "15%", left: "10%" }}>
          <InnerRectangle>{roomInfo.centerPlace.name}</InnerRectangle>
        </Banner>
        {renderBanners()}
      </BackgroundWrapper>
      <CarContainer style={{ left: `${carPosition}px` }}>
        {/* <Mingang
          src={gang}
          alt="Mingang"
          style={{ left: "300px", top: "10px" }}
        />
        <Mingang
          src={gwang}
          alt="Mingang"
          style={{ left: "250px", top: "10px" }}
        /> */}
        <Car src={car} alt="Car" />

        {players.map((player, index) => (
          <Mingang
            key={player.attendeeUUID}
            src={player.profileImageUrl}
            alt={player.nickname}
            style={{
              left: `${index * 50}px`, // 이미지를 차 위에 고르게 배치
              zIndex: 10 + index, // 이미지가 겹칠 때 순서 정렬
            }}
          />
        ))}
      </CarContainer>
    </Container>
  );
}

export default Round3;
