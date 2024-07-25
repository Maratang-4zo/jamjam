import {useCallback, useEffect, useRef, useState} from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";

import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";

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

function CreateRoom() {
  const sessionRef = useRef(null);
  const ovRef = useRef(null);
  const [sessionId, setSessionId] = useState("")
  const [inputSessionId, setInputSessionId] = useState("");

  const APPLICATION_SERVER_URL = "http://localhost:8080/";

  const leaveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
  }, []);

  const handleInputChange = (event) => {
    setInputSessionId(event.target.value);
  };

  const initSession = useCallback(() => {
    const newOv = new OpenVidu();
    const newSession = newOv.initSession();

    ovRef.current = newOv;
    sessionRef.current = newSession;

    newSession.on("streamCreated", function (event) {
      newSession.subscribe(event.stream, "subscriber");
    });
  }, []);

  const createSession = async () => {
    const res = await axios.post(APPLICATION_SERVER_URL + "api/sessions");
    return res.data.sessionId;
  };

  const createToken = (sessionId) => {
    return new Promise((resolve, reject) => {
      axios
          .post(
              APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
          )
          .then((res) => {
            resolve(res.data.token);
          })
          .catch((err) => {
            reject(err);
          });
    });
  };

  const getToken = async (existingSessionId = null) => {
    const targetSessionId = existingSessionId || await createSession();
    setSessionId(targetSessionId);
    return await createToken(targetSessionId);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      // 새로고침, 창 닫기 막기 추가 여부 논의

      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  const joinExistingSession = async (event) => {
    event.preventDefault();
    if (inputSessionId) {
      await joinSession(inputSessionId);
      setInputSessionId(""); // 입력 필드 초기화
    }
  };

  const joinSession = useCallback(async (existingSessionId = null) => {
    initSession();

    getToken(existingSessionId).then((token) => {
      if (sessionRef.current && ovRef.current) {
        sessionRef.current
            .connect(token)
            .then(() => {
              const newPublisher = ovRef.current.initPublisher("publisher");
              sessionRef.current.publish(newPublisher);
            })
            .catch((error) => {
              console.log(
                  "There was an error connecting to the session:",
                  error.code,
                  error.message,
              );
            });
      }
    });
  }, []);

  return (
      <Wrapper>
        <NavBarUp/>
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
          <input type="button" onClick={leaveSession} value="LEAVE"/>
          <div>
            <div id="publisher">
              <h3>YOU</h3>
            </div>
            <div id="subscriber">
              <h3>OTHERS</h3>
            </div>
          </div>
        </div>
      </Wrapper>
  );
}

export default CreateRoom;