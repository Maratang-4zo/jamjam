// frontend/src/components/finalresult/Round3.jsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import fstBg from "../../assets/final/fstBg.png";
import sndBg from "../../assets/final/sndBg.png";
import thdBg from "../../assets/final/thdBg.png";
import car from "../../assets/final/car.png";
import mingang from "../../assets/final/mingang.png";

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
  width: 300%;
  height: 100%;
  display: flex;
  transition: transform 0.1s linear;
  transform: ${(props) => `translateX(-${props.offset}px)`};
`;

const BgImage = styled.img`
  width: 33.333%;
  height: 100%;
`;

const CarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 260px; /* Increased height to 260px (200px * 1.3) */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Car = styled.img`
  height: 100%; /* Ensures the car image fills the container */
`;

const Mingang = styled.img`
  position: absolute;
  height: 30%; /* Reduced size to 30% of the CarContainer height */
  border-radius: 50%;
  overflow: hidden;
`;

function Round3() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev + 10);

      if (offset >= window.innerWidth * 2) {
        setOffset(0); // Reset offset to create a looping effect
      }
    }, 100);

    return () => clearInterval(interval);
  }, [offset]);

  return (
    <Container>
      <BackgroundWrapper offset={offset}>
        <BgImage src={fstBg} alt="Background 1" />
        <BgImage src={sndBg} alt="Background 2" />
        <BgImage src={thdBg} alt="Background 3" />
      </BackgroundWrapper>
      <CarContainer>
        <Car src={car} alt="Car" />
        <Mingang src={mingang} alt="Mingang" />
      </CarContainer>
    </Container>
  );
}

export default Round3;
