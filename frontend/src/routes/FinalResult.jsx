import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import ResultBox from "../components/finalresult/ResultBox";
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

// const Container = styled.div`
//   display: flex;
//   /* justify-content: center; */
//   /* text-align: center; */
// `;

function FinalResult() {
  return (
    <Wrapper>
      <NavBarUp />
      {/* <Container> */}
      <ResultBox></ResultBox>
      {/* </Container> */}
    </Wrapper>
  );
}

export default FinalResult;
