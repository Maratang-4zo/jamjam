import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function FourthSection() {
  return (
    <Section>
      <ButtonContainer>
        <AnimatedButton>
          <StyledLink to={"/room/create"}>YES</StyledLink>
        </AnimatedButton>
        <AnimatedButton>LOGIN</AnimatedButton>
      </ButtonContainer>
    </Section>
  );
}

export default FourthSection;
