import { Link } from "react-router-dom";
import styled from "styled-components";
import InfoBox from "../components/MyPage/InfoBox";
import logoImg from "../assets/logo.png";
import MeetingList from "../components/MyPage/MeetingList";

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 0px 60px 30px 60px;
  height: 100vh;
  background-color: ${(props) => props.theme.subPointBgColor};
`;

const Container = styled.div`
  height: 700px;
  width: 1440px;
  border-radius: 20px;
  border: 3px black solid;
  display: flex;
  justify-content: space-evenly;
  padding: 60px 30px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const LogoImg = styled.img`
  width: 150px;
`;

function Mypage() {
  return (
    <BackGround>
      <Link to={"/"}>
        <LogoImg src={logoImg} />
      </Link>
      <Container>
        <InfoBox />
        <MeetingList></MeetingList>
      </Container>
    </BackGround>
  );
}

export default Mypage;
