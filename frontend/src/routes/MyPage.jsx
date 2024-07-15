import { Link } from "react-router-dom";
import styled from "styled-components";
import InfoBox from "../components/MyPage/InfoBox";
import logoImg from "../assets/logo.png";
import MeetingList from "../components/MyPage/MeetingList";

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 30px 80px 80px 80px;
  background-color: ${(props) => props.theme.subPointBgColor};
`;

const Container = styled.div`
  height: 80vh;
  border-radius: 20px;
  border: 3px black solid;
  display: flex;
  justify-content: space-between;
  padding: 50px 30px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const LogoImg = styled.img`
  width: 100px;
`;

function Mypage() {
  return (
    <BackGround>
      <Link to={"/"}>
        <LogoImg src={logoImg} />
      </Link>
      <Container>
        <InfoBox></InfoBox>
        <MeetingList></MeetingList>
      </Container>
    </BackGround>
  );
}

export default Mypage;
