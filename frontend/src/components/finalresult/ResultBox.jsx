import styled from "styled-components";
import Round1 from "./Round1";
import Round2 from "./Round2";
import Round3 from "./Round3";

const round = 3;

const Container = styled.div`
  background-color: ${(props) => props.theme.subBgColor};
  width: 100%;
  height: 500px;
  margin-top: 80px;
  outline: 3px solid black; /* 3px outline 추가 */
`;

function ResultBox() {
  return (
    <>
      <Container>
        {round === 1 && <Round1 />}
        {round === 2 && <Round2 />}
        {round === 3 && <Round3 />}
      </Container>
    </>
  );
}

export default ResultBox;
