import styled from "styled-components";

const Info = styled.div`
  display: flex;
  width: 300px;
  height: 30px;
  padding: 10px 20px;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 20px;
  background: ${(props) => props.theme.mainBgColor};
`;

function UserInfo() {
  return (
    <div>
      <Info>
        <span>이름</span>
        <span>김민경</span>
      </Info>
      <Info>
        <span>나이</span>
        <span>24</span>
      </Info>
      <Info>
        <span>이메일</span>
        <span>infinitelove367@gmail.com</span>
      </Info>
    </div>
  );
}

export default UserInfo;
