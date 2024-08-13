import styled from "styled-components";
import Round3 from "./Round3";

const round = 3;

const Container = styled.div`
  background-color: ${(props) => props.theme.subBgColor};
  width: 100%;
  height: 80%;
  margin-top: 50px;
  outline: 3px solid black; /* 3px outline 추가 */
`;

function ResultBox() {
  return (
    <>
      <Container>
        <Round3 />
      </Container>
    </>
  );
}

export default ResultBox;
