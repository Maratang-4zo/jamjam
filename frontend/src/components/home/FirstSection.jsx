import React, { useState, useRef } from "react";
import styled from "styled-components";
import JamHi1 from "../../assets/intro/JamHi1.PNG";
import JamHi2 from "../../assets/intro/JamHi2.PNG";
import JamHi3 from "../../assets/intro/JamHi3.PNG";
import JamHi4 from "../../assets/intro/JamHi4.PNG";
import JamHi5 from "../../assets/intro/JamHi5.PNG";
import JamHi6 from "../../assets/intro/JamHi6.PNG";
import JamHi7 from "../../assets/intro/JamHi7.PNG";
import JamHi8 from "../../assets/intro/JamHi8.PNG";

const Section = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "DungGeunMo";
  flex-direction: column;
  overflow: auto; /* 이 부분을 수정하여 스크롤 가능하게 설정 */
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const TextContainer = styled.div`
  margin-top: 20px;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
`;

function FirstSection() {
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
  const [isLastImage, setIsLastImage] = useState(false);

  const handleScroll = () => {
    console.log("Scroll event detected"); // 이 로그가 출력되는지 확인하세요
  };

  return (
    <Section onScroll={handleScroll}>
      <ImageContainer>
        <Image src={images[currentImageIndex]} alt="JamHi" />
      </ImageContainer>
      {isLastImage && (
        <TextContainer isVisible={true}>안녕! 나는 잼잼이야</TextContainer>
      )}
    </Section>
  );
}

export default FirstSection;
