import React from "react";
import styled from "styled-components";
import jamSmile from "../../assets/intro/jamSmile.PNG";

const Section = styled.div`
  height: 100vh;
  width: 100vw;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 100px;
  font-family: "DungGeunMo";
  position: relative;
  padding-left: 0%;
  background-color: #ffe845;
`;

const Image = styled.img`
  position: relative;
  height: 70%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  margin-top: 20px;
  position: relative;
  text-align: left;
`;

function FourthSection() {
  return (
    <Section>
      <TextContainer>
        모두가 만족
        <br />할 수 있으니까!
      </TextContainer>
      <Image src={jamSmile} />
    </Section>
  );
}

export default FourthSection;
