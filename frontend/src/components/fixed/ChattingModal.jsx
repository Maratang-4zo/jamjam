import React from "react";
import styled from "styled-components";

const SideModal = styled.div`
  position: fixed;
  bottom: 0;
  left: ${({ isVisible }) => (isVisible ? "50px" : "-600px")};
  width: 360px;
  height: 100%;
  background-color: #00000063;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  /* transition: left 0.3s ease-in-out; */
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
  background-color: ${(props) => props.theme.accentColor};
  border-bottom: 1px solid #ccc;
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
`;

const ChatInputWrapper = styled.div`
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

function ChattingModal({ isVisible, toggleModal }) {
  return (
    <SideModal isVisible={isVisible}>
      <ChatHeader>
        <span>Chat</span>
        <CloseButton onClick={toggleModal}>X</CloseButton>
      </ChatHeader>
      <ChatMessages>
        {/* 채팅 메시지들이 여기에 표시될 것입니다. */}
      </ChatMessages>
      <ChatInputWrapper>
        <ChatInput type="text" placeholder="Type a message..." />
        <SendButton>Send</SendButton>
      </ChatInputWrapper>
    </SideModal>
  );
}

export default ChattingModal;
