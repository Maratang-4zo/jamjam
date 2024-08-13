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
import FourthSection from "../components/home/FourthSection";
import FifthSection from "../components/home/FifthSection";
import SixthSection from "../components/home/SixthSection";

import FirstCutPng from "../assets/intro/comic/FirstCut.png";
import SecondCutPng from "../assets/intro/comic/SecondCut.png";
import ThirdCutPng from "../assets/intro/comic/ThirdCut.png";

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
    transform: translateX(0);
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
  transition: opacity 0.5s ease-in-out;
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

const Image = styled.img`
  width: 40%;
  height: 30%;
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  left: 50%;
  transform: translate(-50%, -50%);
  transition: position 0.3s ease, top 0.3s ease, left 0.3s ease,
    transform 0.3s ease;
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
  height: 680px;
  flex-shrink: 0;
  top: ${(props) => (props.isSticky ? "10%" : "auto")};
  animation: ${(props) => (props.animate ? slideInRight : "none")} 0.8s forwards;
  right: 10%;
  left: 45%;
  opacity: ${(props) => (props.animate ? 1 : 0)};
`;

const SecondCut = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: url(${SecondCutPng}) no-repeat center center;
  background-size: contain;
  width: 850px;
  height: 380px;
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
`;

const ComicSection = styled.div`
  position: relative;
  height: 250vh;
`;

function NewHome() {
  const setUserInfo = useSetRecoilState(userInfoAtom);
  const [animate, setAnimate] = useState({
    firstCut: false,
    secondThirdCut: false,
  });

  const defaultAnimate = {
    firstCut: false,
    secondThirdCut: false,
  };
  const [isSticky, setIsSticky] = useState({
    firstCut: false,
    secondThirdCut: false,
  });

  const defaultSticky = {
    firstCut: false,
    secondThirdCut: false,
  };
  const [visibleSections, setVisibleSections] = useState({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
  });

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
              console.log("first");
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
              console.log("second");
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
            setAnimate(defaultAnimate);
            setIsSticky(defaultSticky);
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
  };

  return (
    <Wrapper>
      <NavBarUp />
      <Container onScroll={handleScroll}>
        <FirstSection
          ref={(el) => (sectionRefs.current[0] = el)}
          id="firstSection"
        >
          <Image
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
        <Section
          ref={(el) => (sectionRefs.current[4] = el)}
          id="section4"
          isVisible={visibleSections.section4}
        >
          <FourthSection animate={visibleSections.section4} />
        </Section>
        <Section
          ref={(el) => (sectionRefs.current[5] = el)}
          id="section5"
          isVisible={visibleSections.section5}
        >
          <FifthSection animate={visibleSections.section5} />
        </Section>
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
