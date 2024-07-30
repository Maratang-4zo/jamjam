import styled, { keyframes } from "styled-components";

const Container = styled.div`
  background-color: ${(props) => props.theme.subBgColor};
  width: 100%;
  height: 400px;
  margin-top: 80px;
  outline: 3px solid black; /* 3px outline 추가 */
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

function ResultBox() {
  return (
    <>
      <Container></Container>
      <ButtonContainer>
        <AnimatedButton>SHARE</AnimatedButton>
        <AnimatedButton>MAIN</AnimatedButton>
      </ButtonContainer>
    </>
  );
}

export default ResultBox;
