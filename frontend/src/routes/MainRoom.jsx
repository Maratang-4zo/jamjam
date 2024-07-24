import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import Map from "../components/mainroom/Map";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  align-items: center;
`;

function Room() {
  return (
    <Wrapper>
      <NavBarLeft />
      <Map />
    </Wrapper>
  );
}

export default Room;
