import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import MicOn from "../../assets/icons/micon.png";
import HomeIcon from "../../assets/icons/homeIcon.png";
import MicOff from "../../assets/icons/micoff.png";
import ChatOn from "../../assets/icons/chaton.png";
import ChatOff from "../../assets/icons/chatoff.png";
import ChattingModal from "./ChattingModal";

const Wrapper = styled.div`
  width: 50px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.accentColor};
  padding: 10px 0 0 0;
  border-right: 3px solid ${(props) => props.theme.accentColor};
  z-index: 10000;
`;

const Attendants = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 35px;
  height: 35px;
  background-color: yellow;
  border-radius: 50%;
`;

const Btns = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const Btn = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #ffffff34;
    transition: 0.4s;
  }
  &:active {
    background-color: #ffffff52;
  }
`;

const Icon = styled.img`
  width: 40px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const Home = styled.img`
  width: 50px;
  background-color: ${(props) => props.theme.bgColor};
  flex-shrink: 0;
  &:hover {
    background-color: ${(props) =>
      props.theme.bgColor + props.theme.accentOpacity};
  }
`;

function NavBarLeft() {
  const [isChatOn, setIsChatOn] = useState(false);
  const handleChat = () => setIsChatOn(!isChatOn);
  const [isMicOn, setIsMicOn] = useState(true);
  const handleMic = () => setIsMicOn(!isMicOn);

  return (
    <>
      <Wrapper>
        <Attendants>
          <Avatar />
          <Avatar />
          <Avatar />
        </Attendants>
        <Btns>
          <Btn onClick={handleChat}>
            <Icon src={isChatOn ? ChatOn : ChatOff} />
          </Btn>
          <Btn onClick={handleMic}>
            <Icon src={isMicOn ? MicOn : MicOff} />
          </Btn>
          <Link to={`/`}>
            <Home src={HomeIcon} />
          </Link>
        </Btns>
      </Wrapper>
      <ChattingModal isVisible={isChatOn} toggleModal={handleChat} />
    </>
  );
}

export default NavBarLeft;
