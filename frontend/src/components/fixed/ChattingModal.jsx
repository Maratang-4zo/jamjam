import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useWs from "../../hooks/useWs";
import { useRecoilValue } from "recoil";
import { chatAtom, roomAtom } from "../../recoil/atoms/roomState";
import { userInfoAtom } from "../../recoil/atoms/userState";

const SideModal = styled.div`
  position: fixed;
  bottom: 0;
  left: ${({ isVisible }) => (isVisible ? "50px" : "-600px")};
  width: 360px;
  height: 100%;
  background-color: #000000a1;
  transition: left 0.3s ease-in-out;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const ChatTitle = styled.h1`
  font-size: 20px;
  color: white;
`;

const CloseButton = styled.button`
  color: white;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatBubble = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 15px;
  background-color: ${({ isSender }) => (isSender ? "#4caf50" : "#f1f1f1")};
  color: ${({ isSender }) => (isSender ? "white" : "black")};
  align-self: ${({ isSender }) => (isSender ? "flex-end" : "flex-start")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ChatInputWrapper = styled.form`
  border-top: 1px solid #ccc;
  padding: 10px;
  display: flex;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px;
  border: none;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  border-radius: 4px;
  cursor: pointer;
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
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
  font-family: "ONE(Ed.) Galmuri11 Bold";
`;

const ChatInfoTime = styled.span`
  color: #d6d6d6;
  font-size: 12px;
  font-family: Galmuri11;
`;

const ChatContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;

const ChatContentLine = styled.p`
  color: #fff;
  font-family: "ONE(Ed.) Galmuri11 Regular";
  font-size: 20px;
`;

function ChattingModal({ isVisible, toggleModal }) {
  const { sendChat } = useWs();
  const roomInfo = useRecoilValue(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const [chatContent, setChatContent] = useState("");
  const chatLogs = useRecoilValue(chatAtom);

  const handleChange = (event) => {
    setChatContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendChat(chatContent);
    setChatContent(""); // Clear input after sending
  };

  const groupMessages = () => {
    const grouped = [];
    let currentGroup = { user: null, nickname: null, time: null, messages: [] };

    chatLogs.forEach((chat, index) => {
      const chatTime = new Date(chat.timestamp);
      const chatTimeFormatted = `${chatTime.getHours()}:${chatTime.getMinutes()}`;

      if (
        currentGroup.user === chat.senderUUID &&
        currentGroup.time === chatTimeFormatted
      ) {
        currentGroup.messages.push(chat.content);
      } else {
        if (currentGroup.user) {
          grouped.push(currentGroup);
        }
        currentGroup = {
          user: chat.senderUUID,
          nickname: chat.nickname,
          time: chatTimeFormatted,
          messages: [chat.content],
        };
      }

      if (index === chatLogs.length - 1) {
        grouped.push(currentGroup);
      }
    });

    return grouped;
  };

  const groupedMessages = groupMessages();

  return (
    <SideModal isVisible={isVisible}>
      <ChatHeader>
        <ChatTitle>{roomInfo.roomName}</ChatTitle>
        <CloseButton onClick={toggleModal}>X</CloseButton>
      </ChatHeader>
      <ChatMessages>
        {groupedMessages.map((group, index) => (
          <ChatBox key={index}>
            <ChatInfoBox>
              <ChatInfoUser>{group.nickname}</ChatInfoUser>
              <ChatInfoTime>{group.time}</ChatInfoTime>
            </ChatInfoBox>
            <ChatContentBox>
              {group.messages.map((message, idx) => (
                <ChatContentLine key={idx}>{message}</ChatContentLine>
              ))}
            </ChatContentBox>
          </ChatBox>
        ))}
      </ChatMessages>
      <ChatInputWrapper onSubmit={handleSubmit}>
        <ChatInput
          type="text"
          placeholder="Type a message..."
          value={chatContent}
          onChange={handleChange}
        />
        <SendButton type="submit">Send</SendButton>
      </ChatInputWrapper>
    </SideModal>
  );
}

export default ChattingModal;
