import styled, { keyframes } from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import ResultBox from "../components/finalresult/ResultBox";
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  border-left: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  animation: ${fadeIn} 2s ease-in-out;
`;

const AnimatedButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
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
      <ButtonContainer>
        <AnimatedButton>SHARE</AnimatedButton>
        <AnimatedButton>MAIN</AnimatedButton>
        <AnimatedButton>종료</AnimatedButton>
      </ButtonContainer>
      {/* </Container> */}
    </Wrapper>
  );
}

export default FinalResult;
