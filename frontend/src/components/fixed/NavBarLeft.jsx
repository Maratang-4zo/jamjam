import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import MicOn from "../../assets/icons/micon.png";
import HomeIcon from "../../assets/icons/homeIcon.png";
import MicOff from "../../assets/icons/micoff.png";
import ChatOn from "../../assets/icons/chaton.png";
import ChatOff from "../../assets/icons/chatoff.png";
import ChattingModal from "./ChattingModal";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chatModalVisibleAtom,
  currentSpeakersAtom,
  roomAtom,
} from "../../recoil/atoms/roomState";
import useOpenVidu from "../../hooks/useOpenVidu"; // useOpenVidu 훅을 임포트

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

const Avatar = styled.img`
  width: 35px;
  height: 35px;
  background: none;
  border-radius: 50%;
  box-shadow: ${(props) => (props.isSpeaking ? "0 0 7px 2px #ffffff" : "none")};
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
  const [isChatOn, setIsChatOn] = useRecoilState(chatModalVisibleAtom);
  const roomInfo = useRecoilValue(roomAtom);
  const currentSpeakers = useRecoilValue(currentSpeakersAtom);
  const { toggleMic, isMicOn } = useOpenVidu(); // toggleMic 함수와 isMicOn 상태 가져오기

  useEffect(() => {
    setIsChatOn(false); // 컴포넌트가 마운트될 때 채팅 모달 상태를 초기화
  }, [setIsChatOn]);

  const handleChat = () => setIsChatOn(!isChatOn);
  const handleMic = () => {
    toggleMic(); // 마이크 토글 함수 호출
  };

  return (
    <>
      <Wrapper>
        <Attendants>
          {roomInfo.attendees.map((attendee) => (
            <Avatar
              key={attendee.attendeeUUID}
              src={attendee.profileImageUrl}
              isSpeaking={currentSpeakers.includes(attendee.attendeeUUID)}
            />
          ))}
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
