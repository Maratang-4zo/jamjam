import { useCallback, useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";

import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import Background from "../assets/CreateRoomBg.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { useState } from "react";
import "../index.css";

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

const Content = styled.div`
  background-image: url(${Background});
  background-size: cover;
  background-position: center;
  width: 90%;
  flex: 1;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 200px; /* 입력창들을 위로 옮기기 위한 패딩 */
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  color: white;
  font-weight: bold;
  min-width: 100px; /* 라벨의 최소 너비 설정 */
`;

const DatePickerStyled = styled(DatePicker)`
  padding: 10px;
  font-size: 16px;
  width: 200px;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  width: 200px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 15px;
  border: 3px solid var(--Color, #000);
  background: #fff;
  margin-top: 100px; /* 버튼을 FormWrapper로부터 떨어뜨리기 위한 마진 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.p`
  font-family: "pixel" !important;
`;

function CreateRoom() {
  const sessionRef = useRef(null);
  const ovRef = useRef(null);
  const [sessionId, setSessionId] = useState("");
  const [inputSessionId, setInputSessionId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

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
    const targetSessionId = existingSessionId || (await createSession());
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
      <NavBarUp />
      <Content>
        <h1>방 만들기</h1>
        <FormWrapper>
          <InputWrapper>
            <Label>모임 날짜:</Label>
            <DatePickerStyled
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="날짜를 선택하세요"
            />
          </InputWrapper>
          <InputWrapper>
            <Label>모임 목적:</Label>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled hidden>
                카테고리를 선택하세요
              </option>
              <option value="sports">스포츠</option>
              <option value="music">음악</option>
              <option value="study">스터디</option>
              <option value="travel">여행</option>
              <option value="food">음식</option>
            </Select>
          </InputWrapper>
        </FormWrapper>
        <Button>
          <ButtonText>생성</ButtonText>
        </Button>
      </Content>
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

export default CreateRoom;
