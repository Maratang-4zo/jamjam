import React, { useState } from "react";
import styled from "styled-components";
import pie from "../../assets/pie.png";

const Info = styled.div`
  align-self: stretch;
  border-right: 1.4px solid #000000;
  width: 35%;
  position: relative;
`;

const ProfileWrapper = styled.div`
  align-items: center;
  border: 0.7px solid #000000;
  border-radius: 35px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  height: 84px;
  justify-content: center;
  margin: 10px 0;
  width: 84px;
`;

const Profile = styled.div`
  color: #6b6b6b;
  font-family: "Inter-Bold", Helvetica;
  font-size: 10.5px;
  font-weight: 700;
  text-decoration: underline;
`;

const Nickname = styled.label`
  color: #000000;
  font-family: "Galmuri11-Regular", Helvetica;
  font-size: 17.5px;
  text-decoration: underline;
  cursor: pointer;
`;

const Email = styled.div`
  background: transparent;
  border: none;
  color: #6b6b6b;
  font-family: "Galmuri11-Regular", Helvetica;
  font-size: 17.5px;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;
`;

const WinningRate = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PieChart = styled.img`
  height: 280px;
`;

const ModalOverlay = styled.div`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 500px;
  height: 300px;
  background: ${(props) => props.theme.bgColor || "#ffe845"};
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: black;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

function InfoBox() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleModalOpen = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setModalContent("");
  };
  return (
    <>
      <Info>
        <ProfileWrapper>
          <Profile>{"{profile}"}</Profile>
        </ProfileWrapper>
        <Nickname onClick={() => handleModalOpen("닉네임 수정")}>
          {"{nickname}"}
        </Nickname>
        <Email onClick={() => handleModalOpen("이메일 수정")}>
          {"{email}"}
        </Email>
      </Info>
      <WinningRate>
        <PieChart alt="Pie chart" src={pie} />
      </WinningRate>
      <ModalOverlay isVisible={modalVisible}>
        <ModalContent>
          <CloseButton onClick={handleModalClose}>X</CloseButton>
          {modalContent}
        </ModalContent>
      </ModalOverlay>
    </>
  );
}

export default InfoBox;
