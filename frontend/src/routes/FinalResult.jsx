import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function FinalResult() {
  return (
    <Wrapper>
      <NavBarUp />
      <h1>최종 결과 화면</h1>
    </Wrapper>
  );
}

export default FinalResult;
