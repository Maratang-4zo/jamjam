import { useState } from "react";
import styled from "styled-components";
import wavebutton from "../../assets/wavebutton.svg";
import { useRecoilState } from "recoil"; // RecoilState import
import { loginModalState } from "../../recoil/atoms/loginState"; // loginModalState atom import

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
  position: fixed;
  top: 0;
  right: ${({ isVisible }) => (isVisible ? "0" : "-600px")};
  width: 400px;
  height: 100%;
  background-color: #ffe845;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease-in-out;
  z-index: 9999;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const CloseButton = styled.button`
  align-self: flex-start; /* 상단 왼쪽에 배치 */
  margin-bottom: 10px; /* Close 버튼 아래에 간격 추가 */
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
`;

const Divider = styled.div`
  width: 100%;
  height: 3px;
  background-color: black;
  margin-top: 12px;
  margin-bottom: 400px; /* Divider 아래에 간격 추가 */
`;

const KakaotalkButton = styled.button`
  height: 80px;
  width: 150px;
  background: none;
  background-image: url(${wavebutton});
  background-size: 100% 100%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: "pixel", Helvetica;
  font-size: 15px;
  color: #ffe845;

  & p {
    margin: 0;
  }
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
        <CloseButton onClick={toggleModal}>X</CloseButton>
        <Divider />
        <KakaotalkButton>
          <a href="https://jjam.shop/api/login/authorize?redirectUri=/">
            카카오톡으로 로그인
          </a>
        </KakaotalkButton>
      </SideModal>
    </>
  );
}

export default LoginModal;
