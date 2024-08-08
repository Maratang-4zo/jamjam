import React from "react";
import styled from "styled-components";
import jamSmile from "../../assets/intro/jamSmile.PNG";

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
  left: 150px; /* 이미지 오른쪽에 위치하도록 조정 */
  text-align: right; /* 오른쪽 정렬 */
`;

function FourthSection() {
  return (
    <Section>
      <Image src={jamSmile} />
      <TextContainer>
        모두가 만족
        <br />할 수 있으니까!
      </TextContainer>
    </Section>
  );
}

export default FourthSection;
