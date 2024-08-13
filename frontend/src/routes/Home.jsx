import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import { useSetRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import Cookies from "js-cookie";
import { getUserInfo } from "../apis/loginApi";

import JamHi1 from "../assets/intro/JamHi1.PNG";
import JamHi2 from "../assets/intro/JamHi2.PNG";
import JamHi3 from "../assets/intro/JamHi3.PNG";
import JamHi4 from "../assets/intro/JamHi4.PNG";
import JamHi5 from "../assets/intro/JamHi5.PNG";
import JamHi6 from "../assets/intro/JamHi6.PNG";
import JamHi7 from "../assets/intro/JamHi7.PNG";
import JamHi8 from "../assets/intro/JamHi8.PNG";

import SecondSection from "../components/home/SecondSection";
import ComicSection from "../components/home/ComicSection";
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
  overflow-x: hidden; /* 가로 스크롤을 없애기 위해 추가 */
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory; /* 스크롤 시 각 섹션으로 바로 전환되게 설정 */
  overflow-x: hidden; /* 가로 스크롤 방지 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "DungGeunMo";
  flex-direction: column;
  box-sizing: border-box; /* 섹션 내부의 모든 요소의 크기를 부모 요소의 크기에 맞춤 */
  overflow-x: hidden; /* 가로 스크롤 방지 */
`;

const FirstSection = styled(Section)`
  height: 200vh; /* FirstSection 높이를 다른 섹션보다 크게 설정 */
`;

const Image = styled.img`
  max-width: 90%; /* 이미지 크기 조정 */
  max-height: 90%;
  position: absolute; /* 이미지가 항상 중앙에 위치하도록 설정 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function Home() {
  const setUserInfo = useSetRecoilState(userInfoAtom);
  const images = [
    JamHi1,
    JamHi2,
    JamHi3,
    JamHi4,
    JamHi5,
    JamHi6,
    JamHi7,
    JamHi8,
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollTop;
    const sectionHeight = e.target.clientHeight;

    // FirstSection에서만 스크롤 위치에 따라 이미지 변경
    if (scrollPosition < 2 * sectionHeight) {
      const newImageIndex = Math.floor(
        scrollPosition / (sectionHeight / images.length),
      );
      if (newImageIndex < images.length) {
        setCurrentImageIndex(newImageIndex);
      }
    }
  };

  return (
    <Wrapper>
      <NavBarUp />
      <Container onScroll={handleScroll}>
        <FirstSection>
          <Image
            src={images[currentImageIndex]}
            alt={`JamHi ${currentImageIndex + 1}`}
          />
        </FirstSection>
        <Section>
          <SecondSection />
        </Section>
        <Section>
          <ComicSection />
        </Section>
        <Section>
          <ThirdSection />
        </Section>
        <Section>
          <FourthSection />
        </Section>
        <Section>
          <FifthSection />
        </Section>
        <Section>
          <SixthSection />
        </Section>
      </Container>
    </Wrapper>
  );
}

export default Home;
