import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css";
import useOpenVidu from "../hooks/useOpenVidu";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function ConnectOpenVidu() {
  const {
    sessionId,
    joinSession,
    joinExistingSession,
    inputSessionId,
    handleInputChange,
    leaveSession,
  } = useOpenVidu();

  return (
    <Wrapper>
      <NavBarUp />
      <div>
        <h1>방 만들기</h1>
        <button onClick={() => joinSession()}>켜져라얍</button>
        <form onSubmit={joinExistingSession}>
          <input
            type="text"
            value={inputSessionId}
            onChange={handleInputChange}
            placeholder="참여할 세션 ID 입력"
          />
          <button type="submit">기존 방 참여하기</button>
        </form>
        {sessionId && <p>현재 세션 ID: {sessionId}</p>}
        <div id="session">
          <h1>세션 헤더</h1>
          <input type="button" onClick={leaveSession} value="LEAVE" />
          <div>
            <div id="publisher">
              <h3>YOU</h3>
            </div>
            <div id="subscriber">
              <h3>OTHERS</h3>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default ConnectOpenVidu;
