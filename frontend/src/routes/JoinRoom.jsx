import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import wavebutton from "../assets/wavebutton.svg";

const APP_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const link = `https://kauth.kakao.com/oauth/authorize?client_id=${APP_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const loginHandler = () => {
  window.location.href = link;
};

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const KakaotalkButton = styled.button`
  margin-top: 150px;
  height: 123px;
  width: 381px;
  background-image: url(${wavebutton});
  background-size: 100% 100%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: "pixel", Helvetica;
  font-size: 30px;
  color: #ffe845;

  & p {
    margin: 0;
  }
`;

const OrText = styled.h3`
  color: #000;
  font-family: "pixel", Helvetica;
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  margin: 70px 0;
`;

const NicknameInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  margin-bottom: 70px;

  & label {
    font-family: "NewGalmuriRegular", Helvetica;
    font-size: 30px;
    color: #000;
  }

  & input {
    border: 3px solid #000;
    height: 85px;
    width: 513px;
    padding-left: 22px;
    font-size: 40px;
  }
`;

const EnterButton = styled.button`
  height: 54px;
  width: 350px;
  background-color: #d9d9d9;
  border-radius: 15px;
  box-shadow: 0px 4px 4px #00000040;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "DungGeunMo", Helvetica;
  font-size: 30px;
  color: #000;

  & p {
    margin: 0;
  }
`;

// const Container = styled.div`
//   display: flex;
//   height: ${(props) => props.theme.wrapperHeight};
//   padding: 209px 703px;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   gap: 70px;
// `;
function JoinRoom() {
  return (
    <Wrapper>
      <NavBarUp />
      {/* <Container> */}
      <KakaotalkButton>
        <p onClick={loginHandler}>카카오톡으로 로그인</p>
      </KakaotalkButton>
      <OrText>or</OrText>
      <NicknameInput>
        <label> 닉네임: </label>
        <input type="text" />
      </NicknameInput>
      <EnterButton>
        <p>비회원으로 접속</p>
      </EnterButton>
      {/* </Container> */}
    </Wrapper>
  );
}

export default JoinRoom;
