import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import { useSetRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import { getUserInfo } from "../apis/loginApi";
import { getCookie } from "../utils/Cookies";

import JamHi1 from "../assets/intro/JamHi1.PNG";
import JamHi2 from "../assets/intro/JamHi2.PNG";
import JamHi3 from "../assets/intro/JamHi3.PNG";
import JamHi4 from "../assets/intro/JamHi4.PNG";
import JamHi5 from "../assets/intro/JamHi5.PNG";
import JamHi6 from "../assets/intro/JamHi6.PNG";
import JamHi7 from "../assets/intro/JamHi7.PNG";
import JamHi8 from "../assets/intro/JamHi8.PNG";

import SecondSection from "../components/home/SecondSection";
import ThirdSection from "../components/home/ThirdSection";
import SixthSection from "../components/home/SixthSection";

import FirstCutPng from "../assets/intro/comic/FirstCut.png";
import SecondCutPng from "../assets/intro/comic/SecondCut.png";
import ThirdCutPng from "../assets/intro/comic/ThirdCut.png";

import jamGame from "../assets/intro/jamGame.GIF";
import jamSmile from "../assets/intro/jamSmile.PNG";
import { useLeave } from "../hooks/useLeave";

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-10%);
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: 100vw;
  height: 100vh;
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  width: 100%;
  height: 95vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "DungGeunMo";
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: ${(props) =>
    props.id === "section6" && props.isVisible
      ? "opacity 0.7s ease-in-out"
      : "none"};
  background-color: ${(props) => props.theme.bgColor};
  position: relative; /* position 설정 추가 */
  z-index: 2; /* CombinedSection보다 높게 설정 */
`;

const FirstSection = styled.div`
  width: 100%;
  height: 250vh;
  scroll-snap-align: start;
  font-size: 2rem;
  font-family: "DungGeunMo";
  flex-direction: column;
  box-sizing: border-box;
  background-color: none;
  position: relative;
`;

const CombinedSection = styled.div`
  width: 100%;
  height: 250vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 2rem;
  font-family: "DungGeunMo";
  background-color: none;
  text-align: left;
  position: relative;
  overflow: hidden;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.5s ease;
  z-index: 1;
  white-space: pre-line;
`;

const FirstSectionImage = styled.img`
  width: 40%;
  height: auto;
  position: sticky;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: position 0.3s ease, top 0.3s ease, left 0.3s ease,
    transform 0.3s ease;
`;

const CombinedSectionImage = styled.img`
  width: 40%;
  height: auto;
  position: fixed;
  top: 50%;
  left: 0%; /* 스크린의 왼쪽에 고정 */
  transform: translateY(-50%);
  transition: opacity 0.5s ease;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  z-index: 500;
`;

const CombinedText = styled.div`
  position: fixed;
  top: 55%;
  left: 58%; /* 이미지 오른쪽에 텍스트 위치 */
  transform: translateY(-50%);
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.5s ease;
  z-index: 500;
  color: ${(props) => props.theme.textColor};
  font-size: 80px;
  white-space: pre-line; /* 줄 바꿈 반영 */
  text-align: right; /* 텍스트 왼쪽 정렬 */
  max-width: 100%; /* 텍스트가 화면 너비를 넘지 않도록 설정 */
  word-break: break-word; /* 긴 단어가 줄 바꿈되도록 설정 */
  transition: opacity 1s ease-in-out; /* 서서히 등장하는 효과 */
`;

const FirstCut = styled.div`
  position: ${(props) => (props.isSticky ? "sticky" : "absolute")};
  background: url(${FirstCutPng}) no-repeat center center;
  background-size: contain;
  width: 50%;
  height: 630px;
  flex-shrink: 0;
  top: 5%;
  left: 0%;
  z-index: 300;
  opacity: ${(props) => (props.animate ? 1 : 0)};
  animation: ${(props) => (props.animate ? slideInLeft : "none")} 0.8s forwards;
`;

const RightCut = styled.div`
  position: ${(props) => (props.isSticky ? "sticky" : "absolute")};
  width: 50%;
  height: 630px;
  flex-shrink: 0;
  top: 5%;
  left: 200%;
  transform: translateX(100%);
  opacity: ${(props) => (props.animate ? 1 : 0)};
  animation: ${(props) => (props.animate ? slideInRight : "none")} 0.8s forwards;
  animation-delay: 0.5s;
  will-change: transform;
`;

const SecondCut = styled.div`
  position: absolute;
  top: -60px;
  right: 0;
  background: url(${SecondCutPng}) no-repeat center center;
  background-size: contain;
  width: 850px;
  height: 400px;
  margin-bottom: 50px;
  flex-shrink: 0;
`;

const ThirdCut = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: url(${ThirdCutPng}) no-repeat center center;
  background-size: contain;
  width: 700px;
  height: 350px;
  flex-shrink: 0;
  margin-top: 0px;
`;

const ComicSection = styled.div`
  position: relative;
  height: 250vh;
`;

function NewHome() {
  const { leaveFn } = useLeave();
  // 모든 recoil 초기화
  useEffect(() => {
    leaveFn();
  }, []);

  const setUserInfo = useSetRecoilState(userInfoAtom);
  const [animate, setAnimate] = useState({
    firstCut: false,
    secondThirdCut: false,
  });

  const [isSticky, setIsSticky] = useState({
    firstCut: false,
    secondThirdCut: false,
  });

  const [visibleSections, setVisibleSections] = useState({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
  });

  const [isImageVisible, setIsImageVisible] = useState(true);
  const [combinedImageIndex, setCombinedImageIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCombinedSectionVisible, setIsCombinedSectionVisible] =
    useState(true);

  // images 배열 정의
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
  const [isTextVisible, setIsTextVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 0.5초 후에 텍스트를 서서히 나타나게 합니다.
    const timer = setTimeout(() => {
      setIsTextVisible(true);
    }, 500);

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
  }, []);
  // combinedImages 배열 정의
  const combinedImages = [jamGame, jamSmile];
  const combinedTexts = [
    `게임을 통한
  모임장소 
  정하기 어때?`,
    `모두가 만족
    할 수 있잖아!`,
  ];

  const initialState = {
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
  };

  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          if (sectionId === "section1") {
            if (
              entry.intersectionRatio >= 0.1 &&
              entry.intersectionRatio < 0.35
            ) {
              setAnimate((prev) => ({
                ...prev,
                firstCut: true,
              }));
              setTimeout(() => {
                setIsSticky((prev) => ({
                  ...prev,
                  firstCut: true,
                }));
              }, 500);
            }
            if (entry.intersectionRatio >= 0.35) {
              setAnimate((prev) => ({
                ...prev,
                secondThirdCut: true,
              }));
              setTimeout(() => {
                setIsSticky((prev) => ({
                  ...prev,
                  secondThirdCut: true,
                }));
              }, 500);
            }
          } else if (entry.intersectionRatio >= 0.5) {
            setVisibleSections({
              ...initialState,
              [sectionId]: true,
            });
            setAnimate({
              firstCut: false,
              secondThirdCut: false,
            });
            setIsSticky({
              firstCut: false,
              secondThirdCut: false,
            });
          }
        });
      },
      { threshold: [0.1, 0.35, 0.5] },
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
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
    const sectionStart = 0;
    const sectionEnd = e.target.clientHeight * 1;

    if (scrollPosition >= sectionStart && scrollPosition <= sectionEnd) {
      const newImageIndex = Math.floor(
        ((scrollPosition - sectionStart) / (sectionEnd - sectionStart)) *
          images.length,
      );
      setCurrentImageIndex(newImageIndex);
    }

    const combinedSection = sectionRefs.current[4];
    const combinedSectionTop = combinedSection.offsetTop;
    const combinedSectionHeight = combinedSection.clientHeight;

    const sixthSection = sectionRefs.current[6];
    const sixthSectionTop = sixthSection.offsetTop;

    if (
      scrollPosition >= combinedSectionTop &&
      scrollPosition < sixthSectionTop
    ) {
      setIsCombinedSectionVisible(true);
      setIsImageVisible(true);

      if (
        scrollPosition >= combinedSectionTop &&
        scrollPosition <= combinedSectionTop + combinedSectionHeight / 2
      ) {
        setCombinedImageIndex(0); // 첫 번째 이미지 및 텍스트
      } else if (
        scrollPosition >
        combinedSectionTop + combinedSectionHeight / 2
      ) {
        setCombinedImageIndex(1); // 두 번째 이미지 및 텍스트
      }
    } else {
      setIsCombinedSectionVisible(false); // SixthSection이 나타나면 CombinedSection을 숨김
      setIsImageVisible(false); // CombinedSection을 벗어나면 이미지와 텍스트 숨김
    }
  };

  return (
    <Wrapper>
      <NavBarUp />
      <Container onScroll={handleScroll}>
        <FirstSection
          ref={(el) => (sectionRefs.current[0] = el)}
          id="firstSection"
        >
          <FirstSectionImage
            src={images[currentImageIndex]}
            alt={`JamHi ${currentImageIndex + 1}`}
          />
        </FirstSection>
        <ComicSection ref={(el) => (sectionRefs.current[1] = el)} id="section1">
          <FirstCut animate={animate.firstCut} isSticky={isSticky.firstCut} />
          <RightCut
            id="right"
            animate={animate.secondThirdCut}
            isSticky={isSticky.secondThirdCut}
          >
            <SecondCut />
            <ThirdCut />
          </RightCut>
        </ComicSection>
        <Section
          ref={(el) => (sectionRefs.current[2] = el)}
          id="section2"
          isVisible={visibleSections.section2}
        >
          <SecondSection animate={visibleSections.section2} />
        </Section>
        <Section
          ref={(el) => (sectionRefs.current[3] = el)}
          id="section3"
          isVisible={visibleSections.section3}
        >
          <ThirdSection animate={visibleSections.section3} />
        </Section>

        <CombinedSection
          ref={(el) => (sectionRefs.current[4] = el)}
          id="section4"
          isVisible={isCombinedSectionVisible} // SixthSection 나타날 때 CombinedSection 숨김
        >
          <CombinedSectionImage
            src={combinedImages[combinedImageIndex]} // 스크롤에 따라 이미지 전환
            isVisible={isImageVisible}
          />

          <CombinedText isVisible={isImageVisible}>
            {combinedTexts[combinedImageIndex]}{" "}
            {/* 스크롤에 따라 텍스트 전환 */}
          </CombinedText>
        </CombinedSection>

        <Section
          ref={(el) => (sectionRefs.current[6] = el)}
          id="section6"
          isVisible={visibleSections.section6}
        >
          <SixthSection animate={visibleSections.section6} />
        </Section>
      </Container>
    </Wrapper>
  );
}

export default NewHome;
