import styled, { createGlobalStyle } from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import wavebutton from "../assets/wavebutton.svg";
import polygon from "../assets/polygon.svg";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: 100%;
  height: 100vh;
  color: ${(props) => props.theme.textColor};
  display: flex;
  overflow: hidden;
`;

const NavBarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 210px; /* Adjusted to 70% of the original width */
`;

const ContentContainer = styled.div`
  margin-left: 210px; /* Adjusted to 70% of the original margin */
  width: calc(100% - 210px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 49px; /* Adjusted to 70% of the original padding */
`;

const Header = styled.div`
  color: #000000;
  font-family: "Pixelroborobo-Medium", Helvetica;
  font-size: 49px; /* Adjusted to 70% of the original size */
  font-weight: 500;
  text-align: center;
  margin-bottom: 14px; /* Adjusted to 70% of the original margin */
`;

const GamesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px; /* Adjusted to 70% of the original gap */
  width: 100%;
`;

const GameCard = styled.div`
  background-color: #ffffff;
  border: 3px solid #000000;
  border-radius: 35px; /* Adjusted to 70% of the original radius */
  height: 429px; /* Adjusted to 70% of the original height */
  width: 343px; /* Adjusted to 70% of the original width */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 28px; /* Adjusted to 70% of the original padding */
  background-size: cover;
  background-position: center;
`;

const GameName = styled.div`
  height: 66px; /* Adjusted to 70% of the original height */
  width: 170px; /* Adjusted to 70% of the original width */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverlapGroup = styled.div`
  background-color: #ffe845;
  border: 3px solid #000000;
  border-radius: 14px; /* Adjusted to 70% of the original radius */
  height: 66px; /* Adjusted to 70% of the original height */
  width: 169px; /* Adjusted to 70% of the original width */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  color: #000000;
  font-family: "Galmuri11-Regular", Helvetica;
  font-size: 31.5px; /* Adjusted to 70% of the original size */
  font-weight: 400;
  text-align: center;
`;

const PlayButton = styled.button`
  all: unset;
  background-image: url(${wavebutton});
  background-size: 100% 100%;
  height: 54px; /* Adjusted to 70% of the original height */
  width: 134px; /* Adjusted to 70% of the original width */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 14px; /* Adjusted to 70% of the original margin */
`;

const PlayButtonText = styled.div`
  color: #ffe845;
  font-family: "Pixelroborobo-Medium", Helvetica;
  font-size: 28px; /* Adjusted to 70% of the original size */
  font-weight: 500;
`;

function GameChoice() {
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <NavBarContainer>
          <NavBarLeft />
        </NavBarContainer>
        <ContentContainer>
          <Header>Choose The Game</Header>
          <GamesContainer>
            <GameCard>
              <GameName>
                <OverlapGroup>
                  <TextWrapper>CHICKEN</TextWrapper>
                </OverlapGroup>
              </GameName>
            </GameCard>
            <GameCard
              style={{
                backgroundImage: `url(${polygon})`,
              }}
            >
              <GameName>
                <OverlapGroup>
                  <TextWrapper>COFFEE</TextWrapper>
                </OverlapGroup>
              </GameName>
            </GameCard>
            <GameCard>
              <GameName>
                <OverlapGroup>
                  <TextWrapper>PIZZA</TextWrapper>
                </OverlapGroup>
              </GameName>
            </GameCard>
          </GamesContainer>
          <PlayButton>
            <PlayButtonText>PLAY</PlayButtonText>
          </PlayButton>
        </ContentContainer>
      </Wrapper>
    </>
  );
}

export default GameChoice;
