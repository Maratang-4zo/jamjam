import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import "../../index.css";
import { useRecoilState } from "recoil"; // RecoilState import
import { loginModalState } from "../../recoil/atoms/loginState"; // loginModalState atom import

const Section = styled.div`
  height: 100vh;
  width: 100vw;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-family: "DungGeunMo";
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
  z-index: 1;
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 20px;
  animation: ${fadeIn} 3s ease-in-out;
`;

const AnimatedButton = styled.button`
  height: 60px;
  width: 120px;
  padding: 10px 20px;
  font-size: 30px;
  border: none;
  border-radius: 5%;
  cursor: pointer;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const AnimatedButton2 = styled.button`
  height: 60px;
  width: 120px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5%;
  cursor: pointer;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  transition: transform 0.3s;
  animation: ${fadeInUp} 1s ease-out; /* 애니메이션 추가 */

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PromptText = styled.div`
  font-family: "DungGeunMo", sans-serif; /* 'pixel' 폰트 사용 */
  font-size: 100px;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 100px;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

function SixthSection() {
  const [buttonsSwitched, setButtonsSwitched] = useState(false);
  const [, setModalVisible] = useRecoilState(loginModalState); // Recoil 상태 사용

  const handleButtonClick = () => {
    setButtonsSwitched(true);
  };

  const handleGuestButtonClick = () => {
    setModalVisible(true); // 비회원 버튼 클릭 시 모달 열기
  };

  return (
    <Section>
      <PromptText>지금 바로 해볼래?</PromptText>
      <ButtonContainer>
        {buttonsSwitched ? (
          <>
            <AnimatedButton2 onClick={handleGuestButtonClick}>
              회원으로
            </AnimatedButton2>
            <AnimatedButton2>
              <StyledLink to={"/room/create"}>비회원으로</StyledLink>
            </AnimatedButton2>
          </>
        ) : (
          <>
            <AnimatedButton onClick={handleButtonClick}>YES</AnimatedButton>
            <AnimatedButton onClick={handleButtonClick}>YES</AnimatedButton>
          </>
        )}
      </ButtonContainer>
    </Section>
  );
}

export default SixthSection;
