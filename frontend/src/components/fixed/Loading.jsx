import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLeave } from "../../hooks/useLeave";

const Wrapper = styled.div`
  font-family: "DungGeunMo";
  width: 100%;
  height: 100%;
  background-color: #000000a6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  h1 {
    color: ${(props) => props.theme.bgColor};
    font-size: 40px;
  }
  p {
    color: ${(props) => props.theme.subaccentColor};
    font-size: 20px;
    margin-top: 10px;
  }
`;

function Loading({ message, estimatedForceCloseAt }) {
  const { leaveFn } = useLeave();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!estimatedForceCloseAt) return;

    const updateRemainingTime = () => {
      const now = new Date();
      const estimatedTime = new Date(estimatedForceCloseAt + "Z");
      const difference = estimatedTime - now;

      if (difference > 0) {
        const minutes = Math.floor(difference / 1000 / 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`방 종료까지 ${minutes}분 ${seconds}초 남았습니다.`);
      } else if (difference <= 0 && difference > -10) {
        setTimeLeft("방이 종료되었습니다.");
      } else {
        leaveFn();
        navigate("/");
        alert("방이 종료되었습니다");
      }
    };

    // 초기 호출
    updateRemainingTime();

    // 매 초마다 남은 시간을 업데이트
    const timerId = setInterval(updateRemainingTime, 1000);

    // 컴포넌트 언마운트 시 타이머 클리어
    return () => clearInterval(timerId);
  }, [estimatedForceCloseAt]);

  return (
    <Wrapper>
      <h1>{message} 중...</h1>
      {timeLeft && <p>{timeLeft}</p>}
    </Wrapper>
  );
}

export default Loading;
