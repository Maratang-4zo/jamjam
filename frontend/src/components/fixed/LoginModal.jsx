import { useState } from "react";
import styled, { keyframes } from "styled-components";
import wavebutton from "../../assets/wavebutton.svg";
import { useRecoilState } from "recoil"; // RecoilState import
import { loginModalState } from "../../recoil/atoms/loginState"; // loginModalState atom import

const WavyAni = keyframes`
    0% {
        --_i: calc(0 * var(--s));
    }
    12.5% {
        --_i: calc(0.5 * var(--s));
    }
    25% {
        --_i: calc(1 * var(--s));
    }
    37.5% {
        --_i: calc(1.5 * var(--s));
    }
    50% {
        --_i: calc(2 * var(--s));
    }
    62.5% {
        --_i: calc(2.5 * var(--s));
    }
    75% {
        --_i: calc(3 * var(--s));
    }
    87.5% {
        --_i: calc(3.5 * var(--s));
    }
    100% {
        --_i: calc(4 * var(--s));
    }
`;

const ModalBackground = styled.div`
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const SideModal = styled.div`
  border: 3px solid black;
  position: fixed;
  top: 0;
  right: ${({ isVisible }) => (isVisible ? "0" : "-600px")};
  width: 400px;
  height: 100%;
  background-color: #ffe845;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease-in-out;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  font-family: "NewGalmuriBold";
  font-weight: 600;
`;

const KakaotalkButton = styled.button`
  --s: 0.25em; /* control the wave*/

  padding: 0.7em 0.8em;
  background-color: #000;
  color: #ffe845;
  --_s: calc(var(--s) * 4) 51% repeat-x;
  --_r: calc(1.345 * var(--s)) at left 50%;
  --_g1: #000 99%, #0000 101%;
  --_g2: #0000 99%, #000 101%;
  --mask: radial-gradient(var(--_r) top calc(var(--s) * 1.9), var(--_g1))
      calc(50% - 2 * var(--s) - var(--_i, 0px)) 0 / var(--_s),
    radial-gradient(var(--_r) top calc(var(--s) * -0.9), var(--_g2))
      calc(50% - var(--_i, 0px)) var(--s) / var(--_s),
    radial-gradient(var(--_r) bottom calc(var(--s) * 1.9), var(--_g1))
      calc(50% - 2 * var(--s) + var(--_i, 0px)) 100% / var(--_s),
    radial-gradient(var(--_r) bottom calc(var(--s) * -0.9), var(--_g2))
      calc(50% + var(--_i, 0px)) calc(100% - var(--s)) / var(--_s);
  -webkit-mask: var(--mask);
  mask: var(--mask);
  cursor: pointer;
  font-family: "DungGeunMo";
  font-weight: bold;
  font-size: 2rem;
  margin: 0;
  border: none;
  animation: ${WavyAni} 0.3s linear infinite paused;

  &:hover {
    animation-play-state: running;
    background-color: #000;
    color: #ffe845;
  }

  &:active {
    background-image: linear-gradient(#0004 0 0);
  }

  &:focus-visible {
    -webkit-mask: none;
    outline-offset: 0.1em;
    padding: 0.2em 0.5em;
    margin: 0.2em 0;
  }
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: start;
  padding: 5px 10px;
  border-bottom: 3px solid black;
  width: 100%;
  height: 70px;
  align-items: center;
`;

const ContentDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
`;
function LoginModal() {
  const [isVisible, setIsVisible] = useRecoilState(loginModalState); // Recoil 상태 사용

  const toggleModal = () => {
    setIsVisible(!isVisible); // 모달 상태를 전환
  };

  return (
    <>
      <ModalBackground isVisible={isVisible} onClick={toggleModal} />
      <SideModal isVisible={isVisible}>
        <ButtonDiv>
          <CloseButton onClick={toggleModal}>X</CloseButton>
        </ButtonDiv>
        <ContentDiv>
          <KakaotalkButton>
            <a href="https://jjam.shop/api/login/authorize?redirectUri=/">
              카카오톡으로 로그인
            </a>
          </KakaotalkButton>
        </ContentDiv>
      </SideModal>
    </>
  );
}

export default LoginModal;
