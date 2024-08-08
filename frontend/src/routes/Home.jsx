import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import Cookies from "js-cookie";
import { getUserInfo } from "../apis/loginApi";
import jamHi from "../assets/intro/jamHi.PNG";
import jamPointing from "../assets/intro/jamPointing.PNG";
import jamThinking from "../assets/intro/jamThinking.PNG";
import jamGame from "../assets/intro/jamGame.PNG";
// import "../index.css";
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

const SectionSplit = styled(Section)`
  flex-direction: row;
  justify-content: space-between;
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  animation: ${fadeIn} 2s ease-in-out;
`;

const AnimatedButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Image = styled.img`
  width: auto;
  height: 40%; /* 이미지 크기를 적절히 설정 */
`;

const TextContainer = styled.div`
  margin-top: 20px;
`;

const SideTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
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
    <>
      <Wrapper>
        <NavBarUp />
        <Container>
          <Section>
            <Image src={jamHi} />
            <TextContainer>안녕하세요 잼잼입니당</TextContainer>
          </Section>
          <SectionSplit>
            <Image src={jamThinking} style={{ height: "100%" }} />
            <TextContainer>혹시 약속정하는게 힘들지 않나요?</TextContainer>
          </SectionSplit>
          <Section>
            <Image src={jamGame} />
            <TextContainer>게임을 통해서 약속 정하기 어때요?</TextContainer>
          </Section>
          <Section>
            <ButtonContainer>
              <AnimatedButton>
                <Link to={"/room/create"}>YES</Link>
              </AnimatedButton>
              <AnimatedButton>LOGIN</AnimatedButton>
            </ButtonContainer>
          </Section>
        </Container>
      </Wrapper>
    </>
  );
}

export default Home;
