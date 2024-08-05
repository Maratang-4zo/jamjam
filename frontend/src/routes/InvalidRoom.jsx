import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 100px;
  width: calc(100% - 250px); //NavBarLeft의 너비를 제외한 나머지 영역
  height: 100%;
`;

function InvalidRoom() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      <Container>
        <h1>시간과 정신의 방</h1>
        <p>당신은 잘못된 방에 들어왔다.</p>
        <button onClick={goToHome}>탈출시켜주세요ㅜㅜ</button>
      </Container>
    </Wrapper>
  );
}

export default InvalidRoom;
