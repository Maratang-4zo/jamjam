import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { roomAtom } from "../../recoil/atoms/roomState";
import FindDeparture from "./Departure";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userInfoAtom } from "../../recoil/atoms/userState";

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
  width: 250px;
  margin-bottom: 20px;
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

const FindBtn = styled.button`
  width: 250px;
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
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [roomInfo] = useRecoilState(roomAtom);
  const [address, setAddress] = useState(null);
  const [isFindDepartureOpen, setIsFindDepartureOpen] = useState(false);
  const [meetingDate, setMeetingDate] = useState(new Date());

  const handleAddressSelect = (data) => {
    setAddress(data);
    setIsFindDepartureOpen(false);
  };

  const editInfoFn = () => {
    const updatedAddress = address || userInfo.departure;

    setUserInfo((prevState) => ({
      ...prevState,
      departure: {
        address: updatedAddress.address,
        lat: updatedAddress.lat,
        lon: updatedAddress.lon,
      },
    }));

    onAddressSelect({
      addressText: updatedAddress.addressText,
      latitude: updatedAddress.latitude,
      longitude: updatedAddress.longitude,
      meetingDate: meetingDate.toISOString(),
    });

    onClose();
  };

  const handleRetry = () => {
    setAddress(null);
    setIsFindDepartureOpen(true);
  };

  useEffect(() => {
    if (roomInfo && roomInfo.meetingDate) {
      setMeetingDate(new Date(roomInfo.meetingDate)); // roomInfo의 meetingDate로 설정
    }
  }, [roomInfo]);

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
          <Calendar>
            <DatePicker
              selected={meetingDate}
              onChange={(date) => setMeetingDate(date)}
              dateFormat="yyyy/MM/dd"
              inline
            />
          </Calendar>
          {!address && !isFindDepartureOpen && (
            <FindBtn onClick={() => setIsFindDepartureOpen(true)}>
              {userInfo.departure.address}
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
