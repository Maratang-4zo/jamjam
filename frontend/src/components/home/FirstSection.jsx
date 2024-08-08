import React from "react";
import styled from "styled-components";
import jamHi from "../../assets/intro/jamHi.PNG";

const Section = styled.div`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "DungGeunMo";
  flex-direction: column;
`;

const Image = styled.img`
  width: auto;
  height: 40%;
`;

const TextContainer = styled.div`
  margin-top: 20px;
`;

function FirstSection() {
  return (
    <Section>
      <Image src={jamHi} />
      <TextContainer>안녕하세요 잼잼입니당</TextContainer>
    </Section>
  );
}

export default FirstSection;
