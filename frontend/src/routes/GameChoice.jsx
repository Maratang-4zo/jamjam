import GameBoxes from "../components/gamechoice/GameBoxes";
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: 100%;
  height: 100vh;
  color: ${(props) => props.theme.textColor};
  display: flex;
  overflow: hidden;
  z-index: 1;
`;

const NavBarContainer = styled.div`
  left: 0;
  top: 0;
  bottom: 0;
  width: 150px;
`;

const Header = styled.div`
  color: #000000;
  font-family: "pixel", Helvetica;
  font-size: 60px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 14px;
  margin-top: -20px;
`;

const ContentContainer = styled.div`
  margin-right: 40px;
  width: calc(100% - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 35px;
  z-index: 1;
`;
function GameChoice() {
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <NavBarContainer>
          <NavBarLeft />
        </NavBarContainer>
        <ContentContainer>
          <Header>Choose The Game</Header>
          <GameBoxes></GameBoxes>
        </ContentContainer>
      </Wrapper>
    </>
  );
}

export default GameChoice;
