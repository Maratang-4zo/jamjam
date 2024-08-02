import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.accentColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.bgColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  border-left: none;
  display: flex;
  /* align-items: center;
  justify-content: center; 중앙 정렬 추가 */
`;

const GameScreen = styled.div`
  width: 1164px;
  height: 530px;
  flex-shrink: 0;
  border-radius: 30px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 40px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 100px;
  width: calc(100% - 250px); //NavBarLeft의 너비를 제외한 나머지 영역
  height: 100%;
`;

function Game() {
  return (
    <Wrapper>
      <NavBarLeft />
      <ContentWrapper>
        <GameScreen>
          <h1>게임화면</h1>
        </GameScreen>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Game;
