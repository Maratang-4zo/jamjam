import React from "react";
import styled from "styled-components";
import jamThinking from "../../assets/intro/jamThinking.PNG";
import questionMark from "../../assets/intro/questionMark.PNG";

const Section = styled.div`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "DungGeunMo";
  background-color: #ffe845;
  position: relative;
`;

const OverlapGroup = styled.div`
  position: relative;
  height: 70%;
  width: 70%;
`;

const Img = styled.img`
  position: relative;
  height: 90%;
  top: 50%;
  left: 160%; /* 왼쪽으로 30% 이동 */
  transform: translate(-50%, -50%);
  object-fit: cover;
`;

const QuestionText = styled.div`
  position: absolute;
  top: 15%;
  left: 165%;
  transform: translateX(-50%);
  font-size: 3rem;
  font-weight: bold;
  color: #000;
`;

const IMG = styled.img`
  height: 12%;
  position: absolute;
  object-fit: cover;
`;

const TextContainer = styled.div`
  position: absolute;
  left: -80%;
  text-align: left;
  font-size: 90px;
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
      <OverlapGroup>
        <QuestionText>WHERE?</QuestionText>
        <Img alt="Img" src={jamThinking} />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "30%",
            top: "0%",
            left: "180%",
            transform: "rotate(-15deg)",
          }}
        />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "20%",
            top: "30%",
            left: "210%",
            transform: "rotate(10deg)",
          }}
        />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "25%",
            top: "60%",
            left: "190%",
            transform: "rotate(5deg)",
          }}
        />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "20%",
            top: "5%",
            left: "100%",
            transform: "rotate(20deg)",
          }}
        />
        <IMG
          alt="Img"
          src={questionMark}
          style={{
            height: "22%",
            top: "60%",
            left: "90%",
            transform: "rotate(-10deg)",
          }}
        />
      </OverlapGroup>
    </Section>
  );
}

export default SecondSection;
