import React, { useRef, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import InfoBox from "../components/mypage/InfoBox";
import MeetingBox from "../components/mypage/MeetingBox";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import {axiosGetMeetingHistory, useKakaoLogout} from "../apis/loginApi";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";
import CustomCalendar from "../components/calendar/CustomCalendar";
import GameBox from "../components/mypage/GameBox";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow-y: scroll;
  }
`;

const DivWrapperContainer = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.bgColor || "#ffe845"};
  border: 2.1px solid ${(props) => props.theme.accentColor || "#000000"};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const Frame = styled.div`
  align-items: center;
  align-self: stretch;
  background-color: #fbfaf2;
  border: 2.1px solid #000000;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 18.9px;
  padding: 21px 50px;
  width: 100%;
`;

const TextWrapper = styled.div`
  align-self: stretch;
  color: #000000;
  font-family: "neodgm", Helvetica;
  font-size: 29.4px;
  font-weight: 400;
  text-align: center;
`;

const Btns = styled.div`
  align-items: center;
  display: inline-flex;
  gap: 69.3px;
`;

const Button = styled.div`
  align-items: center;
  border: 2.1px solid #000000;
  border-radius: 7px;
  display: inline-flex;
  padding: 4.2px 9.8px;
  cursor: pointer;
`;

const ButtonText = styled.div`
  color: #000000;
  font-family: "Elice DigitalBaeum-Bold", Helvetica;
  font-size: 11.2px;
  font-weight: 700;
  text-align: center;
`;

const Frame2 = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  //flex: 1;
  //flex-direction: column;
  gap: 7px;
  padding: 14px 50px;
  width: 100%;
`;

const Frame3 = styled.div`
  //align-items: center;
  //align-self: stretch;
  display: flex;
  //flex: 1;
  flex-direction: column;
  //gap: 7px;
  //padding: 14px 50px;
  width: 20%;
  min-width: 300px;
  max-width: 350px;
  justify-content: space-between;
  height: 100%;
`;

const Frame4 = styled.div`
  align-items: center;
  //align-self: stretch;
  display: flex;
  //flex: 1;
  flex-direction: column;
  //gap: 7px;
  padding: 14px 50px;
  width: 80%;
  max-width: 1600px;
`;

const InfoContainer = styled.div`
  align-items: center;
  align-self: stretch;
  //border: 1.4px solid #000000;
  display: flex;
  justify-content: space-between;
  //padding: 14px;
  width: 100%;
`;

const MeetingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 21px;
  height: 380px; // 두 줄을 표시할 수 있는 높이로 조정
  width: 100%;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const GameContainer = styled.div`
  align-items: center;
  align-self: stretch;
  //border: 1.4px solid #000000;
  display: flex;
  gap: 21px;
  height: 120.5px;
  //padding: 21px;
  width: 100%;
  overflow-x: auto;
`;

const Subtitle = styled.h1`
  color: black;
  font-size: 40px;
  font-family: "NewGalmuriRegular";
  text-align: left;
  margin-bottom: 20px;
`;

const Subtitle2 = styled.h3`
  color: black;
  font-size: 30px;
  font-family: "neodgm";
  text-align: left;
  margin-bottom: 20px;
`;

const Subtitle3 = styled.div`
  color: black;
  font-size: 30px;
  font-family: "neodgm";
  text-align: left;
  margin-bottom: 20px;
`;

const Today = styled.h1`
  color: #000000;
  font-family: "neodgm", Helvetica;
  font-size: 50px;
  font-weight: 400;
  text-align: start;
  margin-bottom: 30px;
`;
const Frame5 = styled.div``;

const Oneul = styled.div`
  /* Frame 1694 */

  box-sizing: border-box;
  font-size: 30px;

  color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 10px;
  gap: 10px;

  width: 120px;
  height: 50px;
  left: 50px;
  top: 50px;
  margin-bottom: 20px;
  background: #000000;
  border: 1px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;
const MyBox = styled.div`
  width: 100%;
  height: 100%;
  right: 50px;
  top: calc(50% - 980px / 2);
  min-height: 800px;
  padding: 30px 30px 30px;
  background: #fbfaf2;
  border: 3px solid #000000;
`;

const WinningRate = styled.div`
  flex: 4;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Mypage = () => {
  const [meetingHistory, setMeetingHistory] = useState([]);
  const infoBoxRef = useRef(null);
  const meetingBoxRef = useRef(null);
  const navigate = useNavigate();
  const [isLogined, setIsLogined] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const KakaoLogout = useKakaoLogout();
  const today = new Date();
  const dayKor = ["일", "월", "화", "수", "목", "금", "토"];

  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    const fetchMeetingHistory = async () => {
      try {
        const history = await axiosGetMeetingHistory();
        setMeetingHistory(history);
        // props.setMeeting(history);
      } catch (error) {
        console.error("모임 기록 가져오기 실패", error);
      }
    };

    fetchMeetingHistory();
  }, []);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setIsLogined(true); // accessToken이 있으면 로그인 상태로 설정
    } else {
      // accessToken이 없으면 팝업을 띄우고 로그인 페이지로 리다이렉트
      toast.error("로그인이 필요합니다! 로그인하러 슈슝", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => {
          navigate("/");
        },
      });
    }
  }, [navigate]);

  return (
    <>
      <GlobalStyle />
      <DivWrapperContainer>
        <NavBarUp />
        {/* {isLogined && ( // isLogined가 true일 때만 렌더링 */}
        <>
          <Frame>
            <TextWrapper>Hi,{userInfo.nickname}</TextWrapper>
            <Btns>
              <Button onClick={() => scrollToRef(infoBoxRef)}>
                <ButtonText>INFO</ButtonText>
              </Button>
              <Button onClick={() => scrollToRef(meetingBoxRef)}>
                <ButtonText>MEETING HISTORY</ButtonText>
              </Button>
              <Button>
                <ButtonText onClick={KakaoLogout}>LOG OUT</ButtonText>
              </Button>
            </Btns>
          </Frame>
          <Frame2>
            <Frame3>
              <Frame5>
                <Today>
                  <Oneul>오늘은</Oneul>
                  {today.getFullYear()}년
                  <br />
                  {today.getMonth() + 1}월 {today.getDate()}일
                  <br />
                  {dayKor[today.getDay()]}요일
                </Today>
                <CustomCalendar meetingHistory={meetingHistory}></CustomCalendar>
              </Frame5>
              <InfoContainer ref={infoBoxRef}>
                <InfoBox />
              </InfoContainer>
            </Frame3>
            <Frame4>
              <MyBox>
                <div>
                  <Subtitle3>모임 목록</Subtitle3>
                  <MeetingContainer ref={meetingBoxRef}>
                    <MeetingBox meetingHistory={meetingHistory}/>
                  </MeetingContainer>
                </div>
                <div>
                  <Subtitle3>게임별 승률</Subtitle3>
                  <MeetingContainer>
                    <GameBox />
                  </MeetingContainer>
                </div>
              </MyBox>
            </Frame4>
          </Frame2>
        </>
        {/* )} */}
      </DivWrapperContainer>
      <ToastContainer />
    </>
  );
};

export default Mypage;
