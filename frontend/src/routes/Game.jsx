import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.accentColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.bgColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  align-items: center;
`;

function Game() {
  return (
    <Wrapper>
      <NavBarLeft />
      <h1>게임화면</h1>
    </Wrapper>
  );
}

export default Game;
