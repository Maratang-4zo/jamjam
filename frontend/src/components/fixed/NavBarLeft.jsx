import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import MicOn from "../../assets/icons/micon.png";
import HomeIcon from "../../assets/icons/homeIcon.png";
import MicOff from "../../assets/icons/micoff.png";
import ChatOn from "../../assets/icons/chaton.png";
import ChatOff from "../../assets/icons/chatoff.png";
import ChattingModal from "./ChattingModal";
import { useRecoilValue, useResetRecoilState } from "recoil";
import {
  chatAtom,
  currentSpeakersAtom,
  roomAtom,
} from "../../recoil/atoms/roomState";
import useOpenVidu from "../../hooks/useOpenVidu";
import { userInfoAtom } from "../../recoil/atoms/userState";
import UserInfoModal from "./userInfoModal";
import { userColor } from "../../utils/userColor";
import ColorThief from "colorthief";
import Spinner from "./Spinner";
import useWs from "../../hooks/useWs";

const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

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
  position: relative;
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
  border-radius: 30%;
  box-shadow: ${(props) => (props.isSpeaking ? "0 0 7px 2px #ffffff" : "none")};
  cursor: pointer;
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
  &.bounce {
    animation: ${bounceAnimation} 0.5s ease;
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
  const [bounce, setBounce] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalTop, setModalTop] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false); // 이미지 로드 상태 관리
  const roomInfo = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const chatLogs = useRecoilValue(chatAtom);
  const resetUserInfo = useResetRecoilState(userInfoAtom);
  const resetRoomInfo = useResetRecoilState(roomAtom);
  const currentSpeakers = useRecoilValue(currentSpeakersAtom);
  const { toggleMic, isMicOn } = useOpenVidu();
  const navigate = useNavigate();
  const prevChatLogsLength = useRef(chatLogs.length);
  const { leaveSession } = useOpenVidu();
  const { disconnect } = useWs();

  useEffect(() => {
    const loadImages = async () => {
      const loadImage = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });

      try {
        await Promise.all([
          loadImage(MicOn),
          loadImage(HomeIcon),
          loadImage(MicOff),
          loadImage(ChatOn),
          loadImage(ChatOff),
        ]);
        setImagesLoaded(true);
      } catch (error) {
        console.error("이미지 로드 실패:", error);
      }
    };

    loadImages();
  }, []);

  const handleChat = () => {
    setIsChatOn((prev) => !prev);
  };

  const handleMic = () => {
    toggleMic();
  };

  const handleHomeClick = () => {
    const confirmLeave = window.confirm("정말 나가시겠습니까?");
    if (confirmLeave) {
      navigate("/");
      resetUserInfo();
      resetRoomInfo();
      disconnect();
      leaveSession();
    }
  };

  const handleAvatarClick = async (attendee, index) => {
    let color = userColor[attendee.profileImageUrl];
    if (!color) {
      try {
        const colorThief = new ColorThief();
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = attendee.profileImageUrl;
        await new Promise((resolve) => {
          img.onload = () => {
            const result = colorThief.getColor(img);
            color = `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
            resolve();
          };
        });
      } catch (error) {
        color = "#000000"; // 기본 색상
        console.error("Error fetching color from image:", error);
      }
    }

    setSelectedUser({
      color,
      profileImageUrl: attendee.profileImageUrl,
      nickname: attendee.nickname,
      address: attendee.address,
    });

    const avatarTop = 10 + 45 * index;
    setModalTop(avatarTop);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    if (prevChatLogsLength.current !== chatLogs.length) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 500);
      return () => clearTimeout(timer);
    }
    prevChatLogsLength.current = chatLogs.length;
  }, [chatLogs]);

  return (
    <>
      <Wrapper>
        {!imagesLoaded ? (
          <Spinner /> // 이미지 로드가 완료되지 않은 경우 스피너를 표시
        ) : (
          <>
            <Attendants>
              {roomInfo.attendees.map((attendee, index) => (
                <Avatar
                  key={attendee.attendeeUUID}
                  src={attendee.profileImageUrl}
                  isSpeaking={currentSpeakers.includes(attendee.attendeeUUID)}
                  onClick={() => handleAvatarClick(attendee, index)}
                />
              ))}
            </Attendants>
            <Btns>
              <Btn onClick={handleChat} className={bounce ? "bounce" : ""}>
                <Icon src={isChatOn ? ChatOn : ChatOff} />
              </Btn>
              <Btn onClick={handleMic}>
                <Icon src={isMicOn ? MicOn : MicOff} />
              </Btn>
              <Btn onClick={handleHomeClick}>
                <Home src={HomeIcon} />
              </Btn>
            </Btns>
          </>
        )}
        {selectedUser && (
          <UserInfoModal
            user={selectedUser}
            top={modalTop}
            onClose={handleCloseModal}
          />
        )}
      </Wrapper>
      <ChattingModal isVisible={isChatOn} toggleModal={handleChat} />
    </>
  );
}

export default NavBarLeft;
