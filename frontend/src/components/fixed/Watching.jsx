import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: none;
  display: flex;
  align-items: center;
  justify-content: end;
  z-index: 3000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  h1 {
    color: ${(props) => props.theme.bgColor};
    font-size: 30px;
    font-family: "DungGeunMo";
  }
`;

function Watching() {
  return (
    <Wrapper>
      <h1>게임 중! 관전 모드 입니다.</h1>
    </Wrapper>
  );
}

export default Watching;
