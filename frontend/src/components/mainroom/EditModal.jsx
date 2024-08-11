import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled, { createGlobalStyle } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { roomAtom } from "../../recoil/atoms/roomState";
import { useForm, Controller } from "react-hook-form";
import { axiosPatchRoomInfo } from "../../apis/roomApi";
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
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 70px;
`;

const ModalContentForm = styled.form`
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 70px;
`;

const Calendar = styled.div`
  width: 250px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #303030;
    transition: 0.2s;
  }
`;

const Btns = styled.div`
  margin-top: 10px;
  width: 180px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "OldGalmuri";
  font-size: 18px;
`;

const NameInput = styled.input`
  width: 250px;
  border: 1.5px solid #ffffff0f;
  padding: 5px;
  border-radius: 5px;
  outline: none;
  background: none;
  margin-bottom: 10px;
  background-color: #ffffff5c;
  font-family: "NewGalmuriRegular";
  font-size: 20px;
  &:focus {
    border: 1.5px solid white;
    transition: 0.1s;
  }
`;

const Select = styled.select`
  width: 250px;
  padding: 5px;
  border: 1.5px solid #ffffff0f;
  border-radius: 5px;
  outline: none;
  background-color: #ffffff5c;
  margin-bottom: 10px;
  font-family: "NewGalmuriRegular";
  font-size: 20px;
  option {
    background: none;
  }
  &:focus {
    border: 1.5px solid white;
    transition: 0.1s;
  }
`;

const InfoP = styled.p`
  width: 250px;
  padding: 10px;
  border-radius: 5px;
  outline: none;
  background: none;
  margin-bottom: 10px;
  background-color: #ffffff5c;
  display: flex;
  justify-content: space-between;
  span {
    font-weight: 600;
  }
`;

function EditModal({ isOpen, onClose }) {
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
  const userInfo = useRecoilValue(userInfoAtom);
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      roomName: roomInfo.roomName,
      roomPurpose: roomInfo.roomPurpose,
      meetingDate: new Date(roomInfo.meetingDate),
    },
  });

  const onSubmit = async (data) => {
    try {
      await axiosPatchRoomInfo({
        roomUUID: roomInfo.roomUUID,
        meetingDate: data.meetingDate.toISOString(),
        roomPurpose: data.roomPurpose,
        roomName: data.roomName,
      });

      setRoomInfo((prev) => ({
        ...prev,
        meetingDate: data.meetingDate.toISOString(),
        roomPurpose: data.roomPurpose,
        roomName: data.roomName,
      }));
    } catch (error) {
      console.error("방 정보 업데이트 실패:", error);
    }
    onClose();
  };

  useEffect(() => {
    if (roomInfo && roomInfo.meetingDate) {
      setValue("meetingDate", new Date(roomInfo.meetingDate));
    }
  }, [roomInfo, setValue]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const purpose = {
    sports: "스포츠",
    music: "음악",
    study: "스터디",
    travel: "여행",
    food: "음식",
  };

  return (
    <>
      <ModalOverlay onClick={handleOverlayClick}>
        <GlobalStyle />
        {userInfo.isHost ? (
          <ModalContentForm
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
          >
            <NameInput
              {...register("roomName")}
              placeholder={roomInfo.roomName}
            />

            <Select
              {...register("roomPurpose", {
                required: `${roomInfo.roomPurpose}`,
              })}
            >
              <option value="" disabled hidden>
                {roomInfo.roomPurpose}
              </option>
              <option value="sports">스포츠</option>
              <option value="music">음악</option>
              <option value="study">스터디</option>
              <option value="travel">여행</option>
              <option value="food">음식</option>
            </Select>
            <Calendar>
              <Controller
                control={control}
                name="meetingDate"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy/MM/dd"
                    inline
                  />
                )}
              />
            </Calendar>
            <Btns>
              <Button type="button" onClick={onClose}>
                취소
              </Button>
              <Button type="submit">확인</Button>
            </Btns>
          </ModalContentForm>
        ) : (
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit(onSubmit)}
          >
            <InfoP>
              방 이름
              <span>{roomInfo.roomName}</span>
            </InfoP>
            <InfoP>
              모임 목적
              <span>{purpose[roomInfo.roomPurpose]}</span>
            </InfoP>
            <Calendar>
              <Controller
                control={control}
                name="meetingDate"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy/MM/dd"
                    inline
                  />
                )}
              />
            </Calendar>
          </ModalContent>
        )}
      </ModalOverlay>
    </>
  );
}

export default EditModal;
