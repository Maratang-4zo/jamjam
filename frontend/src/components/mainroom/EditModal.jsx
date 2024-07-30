import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useRecoilValue } from "recoil";
import { userInfoAtom, userPlaceAtom } from "../../recoil/atoms/userState";
import FindDeparture from "./Departure";

const GlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow: hidden;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 1001;
  display: ${(props) => (props.hidden ? "none" : "flex")};
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 70px;
`;

const Calendar = styled.div`
  width: 200px;
  height: 200px;
  background: #ba3939;
  margin-bottom: 20px;
  display: ${(props) => (props.isHost ? "block" : "none")};
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Btns = styled.div`
  margin-top: 10px;
  width: 180px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddressInfo = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 5px;
  width: 100%;
  text-align: left;
`;

const FindBtn = styled.button`
  width: 200px;
  background-color: none;
  border-radius: 15px;
  border: 2px solid black;
  padding: 10px 0;
  &:hover {
    background-color: #00000074;
    transition: 0.3s;
    color: white;
  }
`;

function EditModal({ isOpen, onClose, onAddressSelect }) {
  const { isHost } = useRecoilValue(userInfoAtom);
  const userPlace = useRecoilValue(userPlaceAtom);
  const [address, setAddress] = useState(null);
  const [isFindDepartureOpen, setIsFindDepartureOpen] = useState(false);

  const handleAddressSelect = (data) => {
    setAddress(data);
    setIsFindDepartureOpen(false);
  };

  const editInfoFn = () => {
    if (address) {
      onAddressSelect(address);
    }
    onClose();
  };

  const handleRetry = () => {
    setAddress(null);
    setIsFindDepartureOpen(true);
  };

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <ModalOverlay onClick={handleOverlayClick}>
        <GlobalStyle />
        <ModalContent
          hidden={isFindDepartureOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar isHost={isHost}>캘린더 자리입니다</Calendar>
          {!address && !isFindDepartureOpen && (
            <FindBtn onClick={() => setIsFindDepartureOpen(true)}>
              {userPlace.addressText}
              <hr />
              다시 찾을래요
            </FindBtn>
          )}
          {address && (
            <>
              <FindBtn onClick={() => setIsFindDepartureOpen(true)}>
                {address.addressText}
                <hr />
                다시 찾을래요
              </FindBtn>
            </>
          )}
          <Btns>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={editInfoFn}>확인</Button>
          </Btns>
        </ModalContent>
      </ModalOverlay>
      {isFindDepartureOpen && (
        <FindDeparture
          onClose={() => setIsFindDepartureOpen(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}
    </>
  );
}

export default EditModal;
