import styled, { keyframes } from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: 100vw; // 전체 뷰포트를 사용하도록 수정
  height: 100vh; // 전체 화면을 채우도록 수정
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  overflow: hidden; // 내부 스크롤 제거
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll; // 세로 스크롤 가능하도록 설정
  scroll-snap-type: y mandatory; // 스크롤 스냅 설정
`;

const Section = styled.div`
  height: 100vh; // 각 섹션이 전체 화면을 채우도록 설정
  scroll-snap-align: start; // 스크롤 스냅 시작점 설정
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  animation: ${fadeIn} 2s ease-in-out; // 애니메이션 효과 추가
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

function Home() {
  return (
    <>
      <Wrapper>
        <NavBarUp />
        <Container>
          <Section>안녕하세요 잼잼입니당</Section>
          <Section>페이지 투!!</Section>
          <Section>
            <ButtonContainer>
              <AnimatedButton>YES</AnimatedButton>
              <AnimatedButton>LOGIN</AnimatedButton>
            </ButtonContainer>
          </Section>
        </Container>
      </Wrapper>
    </>
  );
}

export default Home;
