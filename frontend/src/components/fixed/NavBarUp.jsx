import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import LoginModal from "./LoginModal"; // LoginModal import
import { useRecoilState } from "recoil"; // RecoilState import
import { loginModalState } from "../../recoil/atoms/loginState"; // loginModalState atom import
import logo from "../../assets/logo.png";

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
  const [isModalVisible, setModalVisible] = useRecoilState(loginModalState); // Recoil 상태 사용
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  // 로그인 상태 확인
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const LogoImage = styled.img`
    height: 100%;
    max-height: 70px;
    width: auto;
    max-width: 70px;
    object-fit: contain;
  `;
  return (
    <>
      <Wrapper>
        <Left>
          <Link to={`/room/create`}>CREATE</Link>
        </Left>
        <Link to={`/`}>
          <LogoImage src={logo} alt="Logo" />
        </Link>
        <Right>
          {isLoggedIn ? (
            <Link to={`/mypage`}>MY PAGE</Link> // 로그인 상태일 때
          ) : (
            <LoginP onClick={() => setModalVisible(true)}>LOGIN</LoginP> // 로그인되지 않은 상태일 때
          )}
        </Right>
      </Wrapper>
      <LoginModal /> {/* LoginModal을 직접 렌더링 */}
    </>
  );
}

export default NavBarUp;
