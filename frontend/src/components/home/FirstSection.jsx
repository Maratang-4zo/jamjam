import React, { useState } from "react";
import styled from "styled-components";
import JamHi1 from "../../assets/intro/JamHi1.PNG";
import JamHi2 from "../../assets/intro/JamHi2.PNG";
import JamHi3 from "../../assets/intro/JamHi3.PNG";
import JamHi4 from "../../assets/intro/JamHi4.PNG";
import JamHi5 from "../../assets/intro/JamHi5.PNG";
import JamHi6 from "../../assets/intro/JamHi6.PNG";
import JamHi7 from "../../assets/intro/JamHi7.PNG";
import JamHi8 from "../../assets/intro/JamHi8.PNG";
import handcursor from "../../assets/intro/handcursor.png";

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

const ImageContainer = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
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
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [isLastImage, setIsLastImage] = useState(false);

  const handleImageClick = () => {
    const currentIndex = images.indexOf(currentImage);
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentImage(images[nextIndex]);
      if (nextIndex === images.length - 1) {
        setIsLastImage(true);
      }
    }
  };

  return (
    <Section>
      <ImageContainer>
        <br />
        <Image
          src={currentImage}
          alt="JamHi"
          onClick={handleImageClick}
          style={{ cursor: isLastImage ? "default" : "pointer" }}
        />
      </ImageContainer>
      <TextContainer isVisible={isLastImage}>안녕! 나는 잼잼이야</TextContainer>
    </Section>
  );
}

export default FirstSection;
