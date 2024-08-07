import React, { useEffect, useState } from "react";
import styled from "styled-components";
import car from "../../assets/final/car.png";
import mingang from "../../assets/final/mingang.png";
import practice from "../../assets/final/practice.jpg";

// 라운드는 전역변수에서 api 만들어지면 가져올 예정
const round = 2;

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

const Banner = styled.div`
  position: absolute;
  width: 100px;
  height: 50px;
  background-color: rgba(
    255,
    255,
    255,
    0.5
  ); /* Semi-transparent white background */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
`;

function Round3() {
  const [offset, setOffset] = useState(0);
  const [carPosition, setCarPosition] = useState(0);

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
        }

        return newPosition;
      });
    }, 100);
  };

  const renderBanners = () => {
    const banners = [];
    const positions = {
      1: ["10%", "90%"],
      2: ["10%", "52.5%", "90%"],
      3: ["10%", "40%", "60%", "90%"],
    };

    // 여기에서 변경됐던 지하철역 history 배열 만들어서 배열 이름만 바꾸면 될듯
    if (positions[round]) {
      positions[round].forEach((pos, index) => {
        banners.push(
          <Banner key={index} style={{ top: "15%", left: pos }}>
            Banner {index + 1}
          </Banner>,
        );
      });
    }

    return banners;
  };

  return (
    <Container>
      <BackgroundWrapper offset={offset}>
        <BgImage src={practice} alt="Background" />
        {renderBanners()}
      </BackgroundWrapper>
      <CarContainer style={{ left: `${carPosition}px` }}>
        <Car src={car} alt="Car" />
        <Mingang src={mingang} alt="Mingang" />
      </CarContainer>
    </Container>
  );
}

export default Round3;
