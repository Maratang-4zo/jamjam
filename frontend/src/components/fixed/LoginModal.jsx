import { useState } from "react";
import styled from "styled-components";
import wavebutton from "../../assets/wavebutton.svg";

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
  justify-content: center;
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

function LoginModal({ isVisible, toggleModal }) {
  return (
    <>
      <ModalBackground isVisible={isVisible} onClick={toggleModal} />
      <SideModal isVisible={isVisible}>
        <button onClick={toggleModal}>Close</button>
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
