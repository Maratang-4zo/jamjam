import React, { useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";

import InfoBox from "../components/mypage/InfoBox";
import MeetingBox from "../components/mypage/MeetingBox";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow-y: scroll;
  }
`;

const DivWrapperContainer = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.bgColor || "#ffe845"};
  border: 2.1px solid ${(props) => props.theme.accentColor || "#000000"};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const Frame = styled.div`
  align-items: center;
  align-self: stretch;
  background-color: #fbfaf2;
  border: 2.1px solid #000000;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 18.9px;
  padding: 21px 50px;
  width: 100%;
`;

const TextWrapper = styled.div`
  align-self: stretch;
  color: #000000;
  font-family: "DungGeunMo-Regular", Helvetica;
  font-size: 29.4px;
  font-weight: 400;
  text-align: center;
`;

const Btns = styled.div`
  align-items: center;
  display: inline-flex;
  gap: 69.3px;
`;

const Button = styled.div`
  align-items: center;
  border: 2.1px solid #000000;
  border-radius: 7px;
  display: inline-flex;
  padding: 4.2px 9.8px;
  cursor: pointer;
`;

const ButtonText = styled.div`
  color: #000000;
  font-family: "Elice DigitalBaeum-Bold", Helvetica;
  font-size: 11.2px;
  font-weight: 700;
  text-align: center;
`;

const Frame2 = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 7px;
  padding: 14px 50px;
  width: 100%;
`;

const InfoContainer = styled.div`
  align-items: center;
  align-self: stretch;
  border: 1.4px solid #000000;
  display: flex;
  justify-content: space-between;
  padding: 14px;
  width: 100%;
`;

const MeetingContainer = styled.div`
  align-items: center;
  align-self: stretch;
  border: 1.4px solid #000000;
  display: flex;
  gap: 21px;
  height: 220.5px;
  padding: 21px;
  width: 100%;
  overflow-x: auto;
`;

const Subtitle = styled.h1`
  color: black;
  font-size: 40px;
  font-family: "galmuriRegular";
  text-align: left;
`;

const Mypage = () => {
  const infoBoxRef = useRef(null);
  const meetingBoxRef = useRef(null);

  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <GlobalStyle />
      <DivWrapperContainer>
        <NavBarUp />
        <Frame>
          <TextWrapper>Hi, 길동</TextWrapper>
          <Btns>
            <Button onClick={() => scrollToRef(infoBoxRef)}>
              <ButtonText>INFO</ButtonText>
            </Button>
            <Button onClick={() => scrollToRef(meetingBoxRef)}>
              <ButtonText>MEETING HISTORY</ButtonText>
            </Button>
            <Button>
              <ButtonText>LOG OUT</ButtonText>
            </Button>
          </Btns>
        </Frame>
        <Frame2>
          <Subtitle>INFO</Subtitle>
          <InfoContainer ref={infoBoxRef}>
            <InfoBox />
          </InfoContainer>

          <Subtitle>MEETING HISTORY</Subtitle>
          <MeetingContainer ref={meetingBoxRef}>
            <MeetingBox />
          </MeetingContainer>
        </Frame2>
      </DivWrapperContainer>
    </>
  );
};

export default Mypage;
