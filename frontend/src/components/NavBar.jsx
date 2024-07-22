import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.containerWidth};
  height: 70px;
  color: ${(props) => props.theme.textColor};
  display: flex;
  padding: 0px 24px;
  justify-content: space-between;
  align-items: center;
  border-top: 3px solid ${(props) => props.theme.accentColor};
  border-left: 3px solid ${(props) => props.theme.accentColor};
  border-right: 3px solid ${(props) => props.theme.accentColor};
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

function NavBar() {
  return (
    <Container>
      <Left>
        <Link to={`/room/:roomId/create`}>CREATE</Link>
      </Left>
      <h3>Logo</h3>
      <Right>
        <Link to={`/`}>LOGIN</Link>
      </Right>
    </Container>
  );
}

export default NavBar;
