import React from "react";
import styled, { keyframes } from "styled-components";
import jamThinking from "../../assets/intro/jamThinking.PNG";
import questionMark from "../../assets/intro/questionMark.PNG";

const Section = styled.div`
  height: 100vh;
  width: 100vw;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70px;
  font-family: "DungGeunMo";
  background-color: #ffe845;
  position: relative;
`;

const OverlapGroup = styled.div`
  position: absolute;
  height: 70%;
  width: 45%;
  right: 0;
`;

const Img = styled.img`
  position: absolute;
  height: 90%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
`;

const QuestionText = styled.div`
  position: absolute;
  top: 15%;
  right: 20%;
  transform: translateX(-50%);
  font-size: 3rem;
  font-weight: bold;
  color: #000;
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
`;

const IMG = styled.img`
  height: 12%;
  position: absolute;
  object-fit: cover;
  animation: ${floatAnimation} 2s ease-in-out infinite;
`;

const TextContainer = styled.div`
  width: 55%;
  position: absolute;
  left: 5%;
  text-align: left;
  font-size: 70px;
  line-height: 1; /* 줄 사이 간격 줄이기 */
  color: #000;
`;

function SecondSection() {
  return (
    <Section>
      <TextContainer>
        약속장소 정할 때
        <br />
        어디가야 할지
        <br />
        고민되지 않았어?
      </TextContainer>
      <OverlapGroup id="overlap">
        <QuestionText>WHERE?</QuestionText>
        <Img alt="Img" src={jamThinking} />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "30%",
            top: "0%",
            right: "10%",
            transform: "rotate(-15deg)",
          }}
        />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "20%",
            top: "30%",
            left: "0%",
            transform: "rotate(10deg)",
          }}
        />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "25%",
            top: "60%",
            right: "0",
            transform: "rotate(5deg)",
          }}
        />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "20%",
            top: "5%",
            left: "20%",
            transform: "rotate(20deg)",
          }}
        />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "22%",
            top: "60%",
            left: "10%",
            transform: "rotate(-10deg)",
          }}
        />
      </OverlapGroup>
    </Section>
  );
}

export default SecondSection;
