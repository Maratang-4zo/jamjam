import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000000a6;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
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

function Loading({ message, estimatedForceCloseAt }) {
  return (
    <Wrapper>
      <h1>{message} 중...</h1>
      {estimatedForceCloseAt ? `분 뒤에 방이 종료될 예정입니다.` : null}
    </Wrapper>
  );
}

export default Loading;
