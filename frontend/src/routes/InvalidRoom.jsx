import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import character from "../assets/character.png";
import chat from "../assets/CatChat2.png";
import { useLeave } from "../hooks/useLeave";

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
  align-items: start;
  justify-content: space-between;
  width: ${(props) => props.theme.wrapperWidth};
  padding: 20px;
  h1 {
    font-size: 100px;
    font-weight: 600;
  }
  h2 {
    font-size: 40px;
  }
  button {
    margin-top: 20px;
  }
`;

const ImgBox = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  right: 10px;

  .chat {
    width: 300px;
    height: 250px; /* 적절한 높이를 설정하세요 */
    background-image: url(${chat});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    justify-content: center;
    position: relative;
    a {
      position: absolute;
      top: 120px;
      font-size: 30px;
      text-decoration: underline;
    }
    span {
      position: absolute;
      top: 80px;
      font-size: 20px;
    }
  }
  img {
    margin-top: 70px;
  }
`;

function InvalidRoom() {
  const { leaveFn } = useLeave();
  // 모든 recoil 초기화
  useEffect(() => {
    leaveFn();
  }, []);

  return (
    <Wrapper>
      <NavBarUp />
      <Container>
        <div>
          <h1>404 Error</h1>
          <h2>Page not found</h2>
        </div>
        <ImgBox>
          <div className="chat">
            <span>I want to go </span>
            <Link to="/"> Home</Link>
          </div>
          <img src={character} alt="Character" />
        </ImgBox>
      </Container>
    </Wrapper>
  );
}

export default InvalidRoom;
