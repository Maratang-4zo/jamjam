import React, { useState, useEffect } from "react";
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
import axios from "axios";
import Cookies from "js-cookie";
// import Jam from "../assets/JoinRoomJam.gif";

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
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;
`;

const EnterForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙에 위치 */
  justify-content: center;
  width: 33.33%;
  height: 100%;
  border-left: 3px solid ${(props) => props.theme.accentColor};
  padding-left: 20px;
  padding-right: 40px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  margin-bottom: 30px;
  margin-left: 120px;
  font-family: "pixel", Helvetica;
  font-size: 22px;
  color: #000000aa;
  text-align: left;
  align-self: flex-start; /* 버튼 및 입력 폼의 왼쪽 상단에 위치 */
`;

const KakaotalkButton = styled.button`
  height: 100px;
  width: 350px;
  background: none;
  background-image: url(${wavebutton});
  background-size: 100% 100%;
  border: none;
  display: ${(props) => (props.hide ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: "pixel", Helvetica;
  font-size: 25px;
  color: #ffe845;
  margin-bottom: 20px; /* 아래 요소와 간격을 유지 */

  p {
    margin: 0;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* OR 텍스트와 양 옆의 선이 중앙에 위치 */
  width: 100%;
  margin: 35px 0;
`;

const Line = styled.div`
  height: 3px;
  background-color: #000;
  width: ${(props) => props.width || "100px"};
`;

const OrText = styled.h3`
  color: #000;
  font-family: "pixel", Helvetica;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  margin: 0 10px; /* OR 텍스트와 선 사이의 간격 */
`;

const NicknameInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  margin-bottom: 70px;
  width: 317px;

  label {
    font-family: "NewGalmuriRegular", Helvetica;
    font-size: 25px;
    color: #000;
    margin-bottom: 10px;
  }

  input {
    border: 3px solid #000;
    height: 60px;
    width: 100%;
    padding: 0 10px;
    font-size: 30px;
    background-color: transparent;
    color: #000;
  }
`;

const CharCount = styled.span`
  position: absolute;
  right: 10px;
  bottom: -25px;
  font-family: "NewGalmuriRegular", Helvetica;
  font-size: 14px;
  color: #000;
`;

const EnterButton = styled.button`
  height: 45px;
  width: 150px;
  background-color: black;
  border-radius: 15px;
  box-shadow: 0px 4px 4px #00000040;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "DungGeunMo", Helvetica;
  font-size: 25px;
  color: ${(props) =>
    props.theme.bgColor}; /* 버튼 텍스트 색상을 배경 색상과 일치 */

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
  width: 100%;
`;

function JoinRoom() {
  const { roomUUID } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nicknameValue = watch("nickname", ""); // watch input value
  const maxChars = 20; // Maximum number of characters
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const attendRoomFn = async (data) => {
    try {
      const response = await axiosAttendRoom(roomUUID, data.nickname);

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
        <EnterForm>
          <SectionTitle> 회원으로</SectionTitle>
          <KakaotalkButton hide={isLoggedIn}>
            <a
              href={`https://jjam.shop/api/login/authorize?redirectUri=/room/${roomUUID}/join`}
            >
              카카오톡으로 로그인
            </a>
          </KakaotalkButton>
          <Divider>
            <Line width="170px" /> {/* 양 옆 줄의 길이를 설정할 수 있음 */}
            <OrText hide={isLoggedIn}>or</OrText>
            <Line width="170px" />
          </Divider>
          <SectionTitle>비회원으로</SectionTitle>
          <Form onSubmit={handleSubmit(attendRoomFn)}>
            <NicknameInput>
              <label> 닉네임: </label>
              <input
                {...register("nickname", { maxLength: maxChars })}
                type="text"
                maxLength={maxChars}
              />
              <CharCount>
                {nicknameValue.length}/{maxChars}
              </CharCount>
            </NicknameInput>
            <EnterButton>
              <p>접속</p>
            </EnterButton>
          </Form>
        </EnterForm>
      </Container>
    </Wrapper>
  );
}

export default JoinRoom;
