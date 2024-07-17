import styled from "styled-components";

const Container = styled.div`
  width: 300px;
  height: 80vh;
  flex-shrink: 0;
  background-color: ${(props) => props.theme.roomChatBgColor};
  border: 3px solid black;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin-left: 20px; */
`;

function RoomChat() {
  return (
    <Container>
      <h1>Chat</h1>
    </Container>
  );
}

export default RoomChat;
