import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Added to align content to the right */
  gap: 50px;
  padding: 0px 70px;
`;

const Frame = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 1011px;
`;

const Header = styled.div`
  color: #000000;
  font-family: "Pixelroborobo-Medium", Helvetica;
  font-size: 70px;
  font-weight: 500;
  height: 205px;
  text-align: center;
`;

const GamesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1690px;
`;

const GameCard = styled.div`
  background-color: #ffffff;
  border: 3px solid #000000;
  border-radius: 50px;
  height: 613px;
  width: 490px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 40px; /* Adjust padding as needed */
`;

const GameName = styled.div`
  height: 94px;
  width: 243px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverlapGroup = styled.div`
  background-color: #ffe845;
  border: 3px solid #000000;
  border-radius: 20px;
  height: 94px;
  width: 241px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  color: #000000;
  font-family: "Galmuri11-Regular", Helvetica;
  font-size: 45px;
  font-weight: 400;
  text-align: center;
`;

const PlayButton = styled.button`
  all: unset;
  background-image: url(./rectangle-1.svg); /* Assuming the path to the image */
  background-size: 100% 100%;
  height: 77px;
  width: 191px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const PlayButtonText = styled.div`
  color: #ffe845;
  font-family: "Pixelroborobo-Medium", Helvetica;
  font-size: 40px;
  font-weight: 500;
`;

function GameChoice() {
  return (
    <Wrapper>
      <NavBarLeft />
      <Frame>
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
              backgroundImage: "url(./2nd-img.svg)",
              backgroundSize: "100% 100%",
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
      </Frame>
    </Wrapper>
  );
}

export default GameChoice;
