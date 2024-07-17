import styled from "styled-components";
import MicIcon from "../../assets/mic.png";
import MicOffIcon from "../../assets/micoff.svg";
import DropDown from "react-bootstrap/Dropdown";
import { useState } from "react";

const Container = styled.div`
  width: 100vw;
  height: 10vh;
  flex-shrink: 0;
  background-color: ${(props) => props.theme.subPointBgColor};
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  border-bottom: 3px solid black;
  button {
    border: 2px solid black;
  }
`;

const Title = styled.h1`
  font-size: 30px;
`;

const BtnBox = styled.div`
  display: flex;
  align-items: center;
`;

const VoiceBtn = styled.button`
  width: 120px;
  height: 40px;
  background-color: ${(props) => props.theme.roomChatBgColor};
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
  &:hover {
    background-color: #00000088;
  }
`;

const MicBtn = styled.button`
  width: 40px;
  height: 40px;
  margin: 0 30px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: #ffffff7e;
  }
  &:active {
    background-color: ${(props) => props.theme.pointBtnColor};
  }
`;

function RoomNav() {
  const [isMicOn, setIsMicOn] = useState(false);
  const controlMic = () => setIsMicOn((prev) => !prev);
  return (
    <Container>
      <Title>000 님의 방</Title>
      <BtnBox>
        <VoiceBtn>
          <span>목록</span>
          <span>▼</span>
        </VoiceBtn>
        <MicBtn onClick={controlMic}>
          {isMicOn ? <img src={MicIcon} /> : <img src={MicOffIcon} />}
        </MicBtn>
      </BtnBox>
    </Container>
  );
}

export default RoomNav;
