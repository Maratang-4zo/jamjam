import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #0000007a;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  h1 {
    color: ${(props) => props.theme.bgColor};
    font-size: 40px;
  }
`;

function Loading({ message }) {
  return (
    <Wrapper>
      <h1>{message} 중...</h1>
    </Wrapper>
  );
}

export default Loading;
