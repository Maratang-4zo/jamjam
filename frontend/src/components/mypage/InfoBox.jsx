import React from "react";
import styled from "styled-components";
import GameBox from "./GameBox";
import ProfileBox from "./ProfileBox";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  align-self: stretch;
  border-right: 3px solid #000000;
`;

const WinningRate = styled.div`
  flex: 4;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function InfoBox() {
  return (
    <Container>
      <Info>
        <ProfileBox />
      </Info>
      <WinningRate>
        <GameBox />
      </WinningRate>
    </Container>
  );
}

export default InfoBox;
