import styled from "styled-components";

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.containerWidth};
  height: ${(props) => props.theme.containerHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
`;

function Intro() {
  return (
    <Container>
      <h1>Intro</h1>
    </Container>
  );
}

export default Intro;
