import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
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

const LeftSection = styled.div`
  width: 66.67%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-left: 40px;
  position: relative;
`;

const RoomInfo = styled.div`
  font-family: "DungGeunMo", Helvetica;
  font-size: 50px;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 20px;
  margin-top: -25%;
  margin-right: 60px;
  text-align: right;
  line-height: 70px;
  span {
    font-family: "NewGalmuriBold", Helvetica;
    margin-right: 30px;
    font-size: 40px;
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 100px;
  height: 100px;
  border: 2px solid ${(props) => props.theme.accentColor};
  /* 이미지가 들어갈 위치 설정 */
`;

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
  max-width: 100%;
  flex-direction: column;
  align-items: center; /* 중앙에 위치 */
  justify-content: center;
  width: 33.33%;
  height: 100%;
  border-left: 3px solid ${(props) => props.theme.accentColor};
  padding-left: 40px;
  padding-right: 40px;
`;

// const SectionTitle = styled.h3`
//   margin: 0;
//   margin-bottom: 30px;
//   margin-left: 120px;
//   font-family: "pixel", Helvetica;
//   font-size: 22px;
//   color: #000000aa;
//   text-align: left;
//   align-self: flex-start; /* 버튼 및 입력 폼의 왼쪽 상단에 위치 */
// `;

const WavyAni = keyframes`
    0% {
        --_i: calc(0 * var(--s));
    }
    12.5% {
        --_i: calc(0.5 * var(--s));
    }
    25% {
        --_i: calc(1 * var(--s));
    }
    37.5% {
        --_i: calc(1.5 * var(--s));
    }
    50% {
        --_i: calc(2 * var(--s));
    }
    62.5% {
        --_i: calc(2.5 * var(--s));
    }
    75% {
        --_i: calc(3 * var(--s));
    }
    87.5% {
        --_i: calc(3.5 * var(--s));
    }
    100% {
        --_i: calc(4 * var(--s));
    }
`;

const KakaotalkButton = styled.button`
  /* display: ${(props) => (props.hide ? "none" : "block")}; */

  --s: 0.5em;
  padding: 0.4em 0.5em;
  background-color: #000;
  color: #ffe845;
  --_s: calc(var(--s) * 4) 51% repeat-x;
  --_r: calc(1.345 * var(--s)) at left 50%;
  --_g1: #000 99%, #0000 101%;
  --_g2: #0000 99%, #000 101%;
  --mask: radial-gradient(var(--_r) top calc(var(--s) * 1.9), var(--_g1))
      calc(50% - 2 * var(--s) - var(--_i, 0px)) 0 / var(--_s),
    radial-gradient(var(--_r) top calc(var(--s) * -0.9), var(--_g2))
      calc(50% - var(--_i, 0px)) var(--s) / var(--_s),
    radial-gradient(var(--_r) bottom calc(var(--s) * 1.9), var(--_g1))
      calc(50% - 2 * var(--s) + var(--_i, 0px)) 100% / var(--_s),
    radial-gradient(var(--_r) bottom calc(var(--s) * -0.9), var(--_g2))
      calc(50% + var(--_i, 0px)) calc(100% - var(--s)) / var(--_s);
  -webkit-mask: var(--mask);
  mask: var(--mask);
  cursor: pointer;
  margin-bottom: 20px; /* 아래 요소와 간격을 유지 */
  height: 100px;
  width: 270px;
  margin: 0;
  border: none;
  font-family: "pixel";
  font-size: 24px;
  animation: ${WavyAni} 0.3s linear infinite paused;

  &:hover {
    animation-play-state: running;
    background-color: #000;
    color: #ffe845;
  }

  &:active {
    background-image: linear-gradient(#0004 0 0);
  }

  &:focus-visible {
    -webkit-mask: none;
    outline-offset: 0.1em;
    padding: 0.2em 0.5em;
    margin: 0.2em 0;
  }
`;

const Divider = styled.div`
  /* display: ${(props) => (props.hide ? "none" : "flex")}; */

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
  margin-bottom: 40px;
  width: 270px;

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
  width: 100px;
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
  transition: transform 0.3s ease;

  ${Container} & {
    transform: ${(props) =>
      props.isLoggedIn ? "translateY(0)" : "translateY(0)"};
  }
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
      const response = await axiosAttendRoom({
        roomUUID,
        nickname: data.nickname,
      });

      console.log("Response:", response); // 응답 확인

      setUserInfo((prev) => ({
        ...prev,
        myUUID: response.data.attendeeUUID,
        nickname: data.nickname,
      }));

      console.log("Navigating..."); // 네비게이트 호출 전 확인
      navigate(`/room/${roomUUID}`);
    } catch (error) {
      console.log(data);
      console.log("방 참여 실패", error);
    }
  };

  return (
    <Wrapper>
      <NavBarUp />
      <Container>
        <LeftSection>
          <RoomInfo>
            '{roomInfo.roomName}'
            <br />
            <span> 방에 입장중</span>
          </RoomInfo>
          {/* 이미지 공간 */}
        </LeftSection>
        <ImageContainer>손 흔들고 있는 잼잼이 들어올 예정</ImageContainer>
        <EnterForm>
          {!isLoggedIn && (
            <>
              <KakaotalkButton>
                <a
                  href={`https://jjam.shop/api/login/authorize?redirectUri=/room/${roomUUID}/join`}
                >
                  카카오톡으로 로그인
                </a>
              </KakaotalkButton>
              <Divider>
                <Line width="130px" /> {/* 양 옆 줄의 길이를 설정할 수 있음 */}
                <OrText>or</OrText>
                <Line width="130px" />
              </Divider>
            </>
          )}
          <Form onSubmit={handleSubmit(attendRoomFn)} isLoggedIn={isLoggedIn}>
            <NicknameInput>
              <label>
                {" "}
                닉네임:
                <input
                  {...register("nickname", { maxLength: maxChars })}
                  type="text"
                  maxLength={maxChars}
                />
              </label>
              <CharCount>
                {nicknameValue.length}/{maxChars}
              </CharCount>
            </NicknameInput>
            <EnterButton type="submit">
              <p>접속</p>
            </EnterButton>
          </Form>
        </EnterForm>
      </Container>
    </Wrapper>
  );
}

export default JoinRoom;
