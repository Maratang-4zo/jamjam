import React from "react";
import styled from "styled-components";
import firstJam from "../../assets/intro/comic/firstJam.png";
import secondJam from "../../assets/intro/comic/secondJam.png";
import thirdJam from "../../assets/intro/comic/thirdJam.png";
import CutFirstImg from "../../assets/intro/comic/CutFirst.svg";
import CutSecondImg from "../../assets/intro/comic/CutSecond.svg";
import CutThirdImg from "../../assets/intro/comic/CutThird.svg";
import firstChatImg from "../../assets/intro/comic/firstChat.svg";
import secondChatImg from "../../assets/intro/comic/secondChat.svg";
import thirdChatImg from "../../assets/intro/comic/thirdChat.svg";

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

const ScreenWrapper = styled.div`
  background-color: #ffe845;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 72%;
  transform: scale(1.4); /* Adjust the scale to your needs */
  transform-origin: center; /* Ensures the scaling happens from the center */
`;

const OverlapWrapper = styled.div`
  background-color: #ffe845;
  border: 3px solid;
  border-color: #000000;
  height: 708px; /* Original dimensions */
  width: 1344px; /* Original dimensions */
`;

const Overlap = styled.div`
  height: 659px;
  left: 66.5px;
  position: relative;
  top: -6.3px;
  width: 1193px;
`;

const SecondCut = styled.div`
  height: 366px;
  left: 357.7px;
  position: absolute;
  top: 0;
  width: 835.1px;
`;

const OverlapGroup = styled.div`
  height: 359.8px;
  position: relative;
  top: 6.3px;
`;

const CutSecond = styled.img`
  height: 299.6px;
  left: 0;
  position: absolute;
  top: 60.2px;
  width: 835.1px;
`;

const SecondJam = styled.img`
  height: 326.2px;
  left: 410.2px;
  position: absolute;
  top: 0;
  width: 397.6px;
`;

const SecondChat = styled.div`
  height: 149.1px;
  left: 184.8px;
  position: absolute;
  top: 35.7px;
  transform: rotate(180deg);
  width: 286.3px;
`;

const Div = styled.div`
  height: 149.1px;
  position: relative;
`;

const Vector = styled.img`
  height: 138.6px;
  left: 3.5px;
  position: absolute;
  top: 7.7px;
  transform: rotate(-180deg);
  width: 280px;
`;

const MaskGroup = styled.img`
  height: 149.1px;
  left: 0;
  position: absolute;
  top: 0;
  transform: rotate(-180deg);
  width: 286.3px;
`;

const TextWrapper = styled.div`
  color: #000000;
  font-family: "NewGalmuriBold", Helvetica;
  font-size: 35px;
  font-weight: 400;
  height: 44.8px;
  left: 25px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  text-align: center;
  top: 72px;
  transform: rotate(180deg);
  width: 226.8px;
`;

const FirstCut = styled.div`
  height: 592.9px;
  left: 0;
  position: absolute;
  top: 66.5px;
  width: 517.3px;
`;

const Overlap2 = styled.div`
  height: 592.9px;
  position: relative;
  width: 527.8px;
`;

const CutFirst = styled.img`
  height: 592.2px;
  left: 23.1px;
  position: absolute;
  top: 0;
  width: 494.2px;
`;

const FirstJam = styled.img`
  height: 424.2px;
  left: 0;
  position: absolute;
  top: 168.7px;
  width: 481.6px;
`;

const FirstChat = styled.div`
  height: 140px;
  left: 208px;
  position: absolute;
  top: 79.8px;
  width: 319.9px;
`;

const OverlapGroup2 = styled.div`
  height: 140px;
  position: relative;
`;

const Img = styled.img`
  height: 130.2px;
  left: 3.5px;
  position: absolute;
  top: 2.8px;
  width: 313.9px;
`;

const MaskGroup2 = styled.img`
  height: 140px;
  left: 0;
  position: absolute;
  top: 0;
  width: 319.9px;
`;

const TextWrapper2 = styled.div`
  color: #000000;
  font-family: "NewGalmuriBold", Helvetica;
  font-size: 35px;
  font-weight: 400;
  height: 44.8px;
  left: 47.6px;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  text-align: center;
  top: 44.1px;
  width: 226.8px;
`;

const CutThird = styled.img`
  height: 329px;
  left: 0;
  position: absolute;
  top: 0;
  width: 698.6px;
`;

const ThirdCut = styled.div`
  background-size: 100% 100%;
  height: 329px;
  left: 480px;
  position: absolute;
  top: 329.7px;
  width: 698.6px;
`;

const Overlap3 = styled.div`
  height: 329px;
  left: 23.1px;
  position: relative;
  width: 628.9px;
`;

const ThirdJam = styled.img`
  height: 243.6px;
  left: 0;
  position: absolute;
  top: 85.4px;
  width: 442.4px;
`;

const ThirdChat = styled.div`
  height: 140px;
  left: 308px;
  position: absolute;
  top: 0;
  width: 319.9px;
`;

export const Screen = () => {
  return (
    <Section>
      <ScreenWrapper>
        <OverlapWrapper>
          <Overlap>
            <SecondCut>
              <OverlapGroup>
                <CutSecond alt="Cut second" src={CutSecondImg} />
                <SecondJam alt="Second jam" src={secondJam} />
                <SecondChat>
                  <Div>
                    <Vector alt="Vector" src={secondChatImg} />
                    <TextWrapper>
                      아 사당 <br />
                      너무 멀다고
                    </TextWrapper>
                  </Div>
                </SecondChat>
              </OverlapGroup>
            </SecondCut>
            <FirstCut>
              <Overlap2>
                <CutFirst alt="Cut first" src={CutFirstImg} />
                <FirstJam alt="First jam" src={firstJam} />
                <FirstChat>
                  <OverlapGroup2>
                    <Img alt="Vector" src={firstChatImg} />
                    <TextWrapper2>사당에서 볼까?</TextWrapper2>
                  </OverlapGroup2>
                </FirstChat>
              </Overlap2>
            </FirstCut>
            <ThirdCut>
              <Overlap3>
                <CutThird alt="Cut Third" src={CutThirdImg} />
                <ThirdJam alt="Third jam" src={thirdJam} />
                <ThirdChat>
                  <OverlapGroup2>
                    <Img alt="Vector" src={thirdChatImg} />
                    <TextWrapper2>맨날 사당이야?</TextWrapper2>
                  </OverlapGroup2>
                </ThirdChat>
              </Overlap3>
            </ThirdCut>
          </Overlap>
        </OverlapWrapper>
      </ScreenWrapper>
    </Section>
  );
};

export default Screen;
