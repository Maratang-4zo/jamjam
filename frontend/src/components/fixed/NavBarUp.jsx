import { Link } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import LoginModal from "./LoginModal"; // LoginModal import

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: 70px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  padding: 0px 24px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid ${(props) => props.theme.accentColor};
  position: relative;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 65px;
  flex: 1 0 0;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 65px;
  flex: 1 0 0;
`;

const LoginP = styled.p`
  cursor: pointer;
`;

function NavBarUp() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <Wrapper>
        <Left>
          <Link to={`/room/create`}>CREATE</Link>
        </Left>
        <Link to={`/`}>로고자리입니다</Link>
        <Right>
          <LoginP onClick={toggleModal}>LOGIN</LoginP>
        </Right>
      </Wrapper>
      <LoginModal isVisible={isModalVisible} toggleModal={toggleModal} />
    </>
  );
}

export default NavBarUp;
