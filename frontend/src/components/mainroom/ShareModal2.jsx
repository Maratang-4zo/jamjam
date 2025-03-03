import styled from "styled-components";
import ShareModalSvg from "../../assets/ShareModal.svg";
import copyIcon from "../../assets/icons/copyIcon.png";
import kakaoIcon from "../../assets/icons/kakaoIcon.png";
import modalBg from "../../assets/final/finalModalBg.svg";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalWrapper = styled.div`
  position: fixed;
  bottom: ${(props) => props.bottom}; // 화면의 크기와 관계없이 버튼에 맞게 위치
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 110px;
  background-image: url(${modalBg});
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentDiv = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 175px;
  height: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const Title = styled.p`
  border-bottom: 1.5px solid black;
  text-align: center;
  width: 160px;
  font-family: "NewGalmuriBold";
  font-size: 20px;
  padding-bottom: 3px;
  margin-bottom: 3px;
`;

const BtnContainer = styled.div`
  width: 170px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const BtnDiv = styled.div`
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const ShareBtn = styled.button`
  border-radius: 50%;
  background-color: ${(props) => props.theme.infoColor};
  width: 45px;
  height: 45px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${(props) => props.theme.relaxColor};
    transition: 0.2s;
  }
`;

const BtnSpan = styled.span`
  font-size: 15px;
  font-family: "NewGalmuriRegular";
`;

const BtnIcon = styled.img`
  width: 35px;
  height: 35px;
`;

function ShareModal2({ title, onClose, bottom }) {
  return (
    <Overlay onClick={onClose}>
      <ModalWrapper bottom={bottom} onClick={(e) => e.stopPropagation()}>
        <ContentDiv>
          <Title>{title}</Title>
          <BtnContainer>
            <BtnDiv>
              <ShareBtn>
                <BtnIcon src={copyIcon} />
              </ShareBtn>
              <BtnSpan>복사하기</BtnSpan>
            </BtnDiv>
            <BtnDiv>
              <ShareBtn>
                <BtnIcon src={kakaoIcon} />
              </ShareBtn>
              <BtnSpan>카카오톡</BtnSpan>
            </BtnDiv>
          </BtnContainer>
        </ContentDiv>
      </ModalWrapper>
    </Overlay>
  );
}

export default ShareModal2;
