import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { chatAtom, roomAtom } from "../../recoil/atoms/roomState";
import { userInfoAtom } from "../../recoil/atoms/userState";
import sendIcon from "../../assets/icons/sendIcon.png";
import { useWebSocket } from "../../context/WebsocketContext";

const SideModal = styled.div`
  position: fixed;
  bottom: 0;
  left: ${({ isVisible }) => (isVisible ? "50px" : "-600px")};
  width: 360px;
  height: 100%;
  background-color: #000000b2;
  transition: left 0.3s ease-in-out;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
`;

const ChatTitle = styled.h1`
  font-size: 25px;
  color: white;
  font-family: "OldGalmuri";
`;

const CloseButton = styled.button`
  color: white;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
  font-family: "OldGalmuri";
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: none;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.infoColor + 80};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => props.theme.bgColor + 80};
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
`;

const ChatInputWrapper = styled.form`
  padding: 3px 3px 3px 10px;
  border: 2px solid #ccc;
  border-radius: 30px;
  display: flex;
`;

const ChatInput = styled.input`
  background: none;
  flex: 1;
  caret-color: white;
  color: white;
  font-family: "NewGalmuriRegular";
  font-size: 20px;
  border: none;
  &::placeholder {
    color: #ababab;
    font-family: "NewGalmuriRegular";
  }
  &:focus {
    border: none;
    outline: none;
  }
`;

const SendButton = styled.button`
  border: none;
  background: none;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    transition: 0.2s;
    background-color: #00000047;
  }
`;

const SendIcon = styled.img`
  width: 30px;
  height: 25px;
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  padding: 10px;
  background-color: none;
  border-radius: 10px;
`;

const ChatInfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ChatInfoUser = styled.span`
  color: #ffe845;
  font-size: 20px;
  font-family: "NewGalmuriBold";
`;

const ChatInfoTime = styled.span`
  color: #d6d6d6;
  font-size: 12px;
  font-family: "NewGalmuriBold";
`;

const ChatContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;

const ChatContentLine = styled.p`
  color: #fff;
  font-family: "NewGalmuriBold";
  font-size: 20px;
`;

const AlertMessage = styled.div`
  padding: 10px;
  background-color: #333;
  border-radius: 10px;
  color: #ff8c00;
  text-align: center;
  font-family: "NewGalmuriBold";
  font-size: 18px;
  margin: 5px 0;
`;

function ChattingModal({ isVisible, toggleModal }) {
  const { sendChat } = useWebSocket();
  const roomInfo = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const chatLogs = useRecoilValue(chatAtom);
  const [chatContent, setChatContent] = useState("");
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      scrollToBottom();
    }
  }, [isVisible, chatLogs]);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const handleChange = (event) => {
    setChatContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (chatContent) {
      setChatContent(""); // 입력창 초기화
      sendChat({
        content: chatContent,
      });
    }
  };

  const formatTime = (createdAt) => {
    // Ensure the time string is interpreted as UTC
    const chatTime = new Date(createdAt + "Z");
    const hours = chatTime.getHours().toString().padStart(2, "0");
    const minutes = chatTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const groupedChatLogs = [];
  let currentGroup = null;

  chatLogs.forEach((chat) => {
    if (chat.type === "chat") {
      if (
        currentGroup &&
        currentGroup.attendeeUUID === chat.attendeeUUID && // attendeeUUID로 그룹화
        formatTime(currentGroup.createdAt) === formatTime(chat.createdAt)
      ) {
        currentGroup.messages.push(chat.content);
      } else {
        if (currentGroup) {
          groupedChatLogs.push(currentGroup);
        }
        currentGroup = {
          attendeeUUID: chat.attendeeUUID,
          nickname: chat.nickname,
          createdAt: chat.createdAt,
          messages: [chat.content],
          type: "chat",
        };
      }
    } else {
      if (currentGroup) {
        groupedChatLogs.push(currentGroup);
        currentGroup = null;
      }
      groupedChatLogs.push(chat);
    }
  });

  if (currentGroup) {
    groupedChatLogs.push(currentGroup);
  }

  return (
    <SideModal isVisible={isVisible}>
      <ChatHeader>
        <ChatTitle>{roomInfo.roomName}</ChatTitle>
        <CloseButton onClick={toggleModal}>X</CloseButton>
      </ChatHeader>
      <ChatMessages ref={chatMessagesRef}>
        {groupedChatLogs.map((chat, index) => (
          <React.Fragment key={index}>
            {chat.type === "chat" ? (
              <ChatBox>
                <ChatInfoBox>
                  <ChatInfoUser>{chat.nickname}</ChatInfoUser>
                  <ChatInfoTime>{formatTime(chat.createdAt)}</ChatInfoTime>
                </ChatInfoBox>
                <ChatContentBox>
                  {chat.messages.map((message, idx) => (
                    <ChatContentLine key={idx}>{message}</ChatContentLine>
                  ))}
                </ChatContentBox>
              </ChatBox>
            ) : (
              <AlertMessage>
                {chat.nickname}님이{" "}
                {chat.alertType === "out"
                  ? "퇴장하셨습니다."
                  : "입장하셨습니다."}
              </AlertMessage>
            )}
          </React.Fragment>
        ))}
      </ChatMessages>
      <ChatInputWrapper onSubmit={handleSubmit}>
        <ChatInput
          type="text"
          placeholder="텍스트를 입력하세요."
          value={chatContent}
          onChange={handleChange}
        />
        <SendButton type="submit">
          <SendIcon src={sendIcon} />
        </SendButton>
      </ChatInputWrapper>
    </SideModal>
  );
}

export default ChattingModal;
