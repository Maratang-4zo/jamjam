import React from "react";
import styled from "styled-components";
import JamMap from "../../assets/intro/JamMap.PNG";

const Section = styled.div`
  height: 100vh;
  width: 100vw;
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
  left: 0;
  height: 70%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  margin-top: 20px;
  position: relative;
  right: 0; /* 이미지 오른쪽에 위치하도록 조정 */
  text-align: right; /* 오른쪽 정렬 */
`;

function ThirdSection() {
  return (
    <Section>
      <Image src={JamMap} />
      <TextContainer>
        만나는 사람과의
        <br />
        거리, 장소 등
        <br />
        신경써야 할게 많잖아
      </TextContainer>
    </Section>
  );
}

export default ThirdSection;
