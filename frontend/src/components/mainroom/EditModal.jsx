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
      meetingDate: roomInfo.meetingDate ? new Date(roomInfo.meetingDate) : null,
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
      const date = new Date(roomInfo.meetingDate);
      setValue("meetingDate", !isNaN(date) ? date : null);
    }
  }, [roomInfo.meetingDate, setValue]);

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
              <option value="카페">카페</option>
              <option value="호프">호프</option>
              <option value="스터디룸">스터디룸</option>
              <option value="헬스클럽">헬스클럽</option>
              <option value="식당">식당</option>
              <option value="도서관">도서관</option>
              <option value="공원">공원</option>
              <option value="미술관">미술관</option>
              <option value="애견카페">애견카페</option>
              <option value="셀프사진">셀프사진</option>
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
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <InfoP>
              방 이름
              <span>{roomInfo.roomName}</span>
            </InfoP>
            <InfoP>
              모임 목적
              <span>{roomInfo.roomPurpose}</span>
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
