import styled from "styled-components";
import InfoBox from "./InfoBox";
import Btns from "./Btns";

const Container = styled.div`
  border: 1px solid black;
  width: 400px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;

function RoomInfo() {
  return (
    <Container>
      <InfoBox />
      <Btns />
    </Container>
  );
}

export default RoomInfo;
