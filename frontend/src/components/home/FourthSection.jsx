import React from "react";
import styled from "styled-components";
import jamGame from "../../assets/intro/jamGame.GIF";

const Section = styled.div`
  height: 100vh;
  width: 100vw;
  scroll-snap-align: start;
  font-size: 100px;
  font-family: "DungGeunMo";
  position: relative;
  padding-left: 0%;
  background-color: #ffe845;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Image = styled.img`
  position: relative;
  height: 70%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  position: relative;
  text-align: right; /* 오른쪽 정렬 */
`;

function FourthSection() {
  return (
    <Section>
      <Image src={jamGame} />
      <TextContainer>
        게임을 통한
        <br />
        모임장소 정하기
        <br />
        어때?
      </TextContainer>
    </Section>
  );
}

export default FourthSection;
