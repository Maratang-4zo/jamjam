import React, { useEffect } from "react";
import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import { useSetRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import Cookies from "js-cookie";
import { getUserInfo } from "../apis/loginApi";

import FirstSection from "../components/home/FirstSection";
import SecondSection from "../components/home/SecondSection";
import ThirdSection from "../components/home/ThirdSection";
import FourthSection from "../components/home/FourthSection";
import FifthSection from "../components/home/FifthSection";
import SixthSection from "../components/home/SixthSection";
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: 100vw;
  height: 100vh;
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  overflow: hidden;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
`;

const Section = styled.div`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "DungGeunMo";
  flex-direction: column;
`;

function Home() {
  const setUserInfo = useSetRecoilState(userInfoAtom);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      getUserInfo()
        .then((data) => {
          setUserInfo((prevState) => ({
            ...prevState,
            isLogin: true,
            profile: data.profile,
            nickname: data.nickname,
            email: data.email,
          }));
        })
        .catch((error) => {
          console.error("사용자 정보 가져오기 실패", error);
        });
    }
  }, [setUserInfo]);

  return (
    <Wrapper>
      <NavBarUp />
      <Container>
        <FirstSection />
        <Section>
          <SecondSection />
        </Section>
        <ThirdSection />
        <FourthSection />
        <FifthSection />
        <SixthSection />
      </Container>
    </Wrapper>
  );
}

export default Home;
