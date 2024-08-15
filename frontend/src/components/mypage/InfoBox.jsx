import React from "react";
import styled from "styled-components";
import GameBox from "./GameBox";
import ProfileBox from "./ProfileBox";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
/* Rectangle 1844 */




const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  align-self: stretch;
  //border-right: 3px solid #000000;
`;


function InfoBox() {
  return (
    <Container>
      <Info>
        <ProfileBox />
      </Info>

    </Container>
  );
}

export default InfoBox;
