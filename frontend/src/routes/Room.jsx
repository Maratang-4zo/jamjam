import { Link } from "react-router-dom";
import styled from "styled-components";
import RoomNav from "../components/Room/RoomNav";
import Map from "../components/Room/Map";
import RoomChat from "../components/Room/RoomChat";
import RoomInfo from "../components/Room/RoomInfo";

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 0px 60px 30px 60px;
  background-color: ${(props) => props.theme.btnColor};
`;
const Container = styled.div`
  height: 90vh;
  width: 100vw;
  display: flex;
  justify-content: space-evenly;
  position: absolute;
  bottom: 0;
  align-items: center;
`;

function Room() {
  return (
    <BackGround>
      <RoomNav />
      <Container>
        <RoomInfo />
        <Map />
        <RoomChat />
      </Container>
    </BackGround>
  );
}

export default Room;
