import { Link } from "react-router-dom";
import styled from "styled-components";
import logoImg from "../assets/logo.png";
import WelcomeImg from "../assets/welcome.png";

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100vh;
  padding: 0px 60px 30px 60px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Container = styled.div`
  height: 80vh;
  width: 90vw;
  border-radius: 20px;
  border: 3px black solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 60px;
  background-color: ${(props) => props.theme.mainPointBgColor};
`;

const LogoImg = styled.img`
  width: 150px;
`;

const Frame = styled.div`
  align-items: center;
  background-color: #ffd459;
  border: 1px solid;
  border-color: #000000;
  display: flex;
  gap: 10px;
  height: 52px;
  justify-content: center;
  padding: 10px 20px;
  width: 342px;
`;

const TextWrapper = styled.div`
  color: #000000;
  font-family: "Open Sans-Bold", Helvetica;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
  width: fit-content;
`;

const Element = styled.img`
  height: 407px;
  object-fit: cover;
  width: 470px;
`;

function Login() {
  return (
    <BackGround>
      <Link to={"/"}>
        <LogoImg src={logoImg} />
      </Link>
      <Container>
        <Element alt="Element" src={WelcomeImg} />
        <Frame>
          <a
            href="https://kauth.kakao.com/oauth/authorize?client_id=d0c40d33caea40d7483ca465f88676f1&redirect_uri=http://3.36.28.64:8000/oauth/kakao/callback
&response_type=code"
          >
            <TextWrapper>카카오 로그인 /회원가입</TextWrapper>
          </a>
        </Frame>
      </Container>
    </BackGround>
  );
}

export default Login;
