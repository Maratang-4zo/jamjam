import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: "DungGeunMo";
  h1 {
    color: ${(props) => props.theme.bgColor};
    font-size: 60px;
    margin-bottom: 10px;
  }
  h2 {
    color: ${(props) => props.theme.infoColor};
    font-size: 20px;
  }
`;

function Watching() {
  return (
    <Wrapper>
      <h2>게임 중인 방이에요.</h2>
      <h1>입장 대기 중</h1>
    </Wrapper>
  );
}

export default Watching;
