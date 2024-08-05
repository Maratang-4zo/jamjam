import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import wavebutton from "../assets/wavebutton.svg";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { axiosAttendRoom } from "../apis/roomApi";
import { useRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import { roomAtom } from "../recoil/atoms/roomState";
import useWs from "../hooks/useWs";
import useOpenVidu from "../hooks/useOpenVidu";

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
  overflow: hidden;
`;

const Container = styled.div`
  width: ${(props) => props.theme.wrapperWidth};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

const KakaotalkButton = styled.button`
  height: 100px;
  width: 350px;
  background: none;
  background-image: url(${wavebutton});
  background-size: 100% 100%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: "pixel", Helvetica;
  font-size: 25px;
  color: #ffe845;

  p {
    margin: 0;
  }
`;

const OrText = styled.h3`
  color: #000;
  font-family: "pixel", Helvetica;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  margin: 35px 0;
`;

const NicknameInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  margin-bottom: 70px;

  label {
    font-family: "NewGalmuriRegular", Helvetica;
    font-size: 25px;
    color: #000;
  }

  input {
    border: 3px solid #000;
    height: 60px;
    width: 350px;
    padding: 0 10px;
    font-size: 30px;
  }
`;

const EnterButton = styled.button`
  height: 45px;
  width: 300px;
  background-color: ${(props) => props.theme.infoColor};
  border-radius: 15px;
  box-shadow: 0px 4px 4px #00000040;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "DungGeunMo", Helvetica;
  font-size: 25px;
  color: #000;

  p {
    margin: 0;
  }
  &:hover {
    background-color: ${(props) => props.theme.infoColorHover};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function JoinRoom() {
  const { roomUUID } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);

  const attendRoomFn = async (data) => {
    try {
      const response = await axiosAttendRoom(roomUUID, data.nickname);

      // 참가자 정보 저장
      setUserInfo((prev) => ({
        ...prev,
        myUUID: response.data.attendeeUUID,
        nickname: data.nickname,
      }));

      navigate(`/room/${roomUUID}`);
    } catch (error) {
      console.log("방 참여 실패", error);
    }
  };

  return (
    <Wrapper>
      <NavBarUp />
      <Container>
        <KakaotalkButton>
          <p onClick={loginHandler}>카카오톡으로 로그인</p>
        </KakaotalkButton>
        <OrText>or</OrText>
        <Form onSubmit={handleSubmit(attendRoomFn)}>
          <NicknameInput>
            <label> 닉네임: </label>
            <input {...register("nickname")} type="text" />
          </NicknameInput>
          <EnterButton>
            <p>비회원으로 접속</p>
          </EnterButton>
        </Form>
      </Container>
    </Wrapper>
  );
}

export default JoinRoom;
