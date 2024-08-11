import React from "react";
import styled from "styled-components";
import jamGame from "../../assets/intro/jamGame.GIF";

const Section = styled.div`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: center;
  font-size: 100px;
  font-family: "DungGeunMo";
  position: relative;
  padding-left: 0%;
  background-color: #ffe845;
`;

const Image = styled.img`
  position: relative;
  left: -160px;
  height: 70%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  margin-top: 20px;
  position: relative;
  left: 100px; /* 이미지 오른쪽에 위치하도록 조정 */
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
