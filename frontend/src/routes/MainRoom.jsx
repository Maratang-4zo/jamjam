import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import Map from "../components/mainroom/Map";
import FindDeparture from "../components/mainroom/Departure";
import EditModal from "../components/mainroom/EditModal";
import Buttons from "../components/mainroom/Buttons";
import ShareModal from "../components/mainroom/ShareModal";
import { useRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import { roomAtom } from "../recoil/atoms/roomState";
import { axiosUpdateUserInfo } from "../apis/mapApi";
import { useNavigate, useParams } from "react-router-dom";
import { axiosIsRoomValid } from "../apis/roomApi";
import { getCookie } from "../utils/Cookies";
import { jwtDecode } from "jwt-decode";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  border-left: none;
  display: flex;
  align-items: center;
`;

function Room() {
  const { roomUUID } = useParams();
  const navigate = useNavigate();
  const [isFindDepartureModalOpen, setIsFindDepartureModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalTop, setModalTop] = useState("50px");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);

  // 유효성 검사 및 이것저것 검사하는데 이거 주석 풀면 mainRoom에 영원히 못들어가니까 주석처리해놓을게요 일단..
  // useEffect(() => {
  //   const checkRoomValidity = async () => {
  //     try {
  //       const response = await axiosIsRoomValid({ roomUUID });
  //       const isValid = response.data.room === true;

  //       if (isValid) {
  //         const roomToken = getCookie("roomToken");
  //         if (roomToken) {
  //           const myUUID = jwtDecode(roomToken).attendeeUUID;
  //           const isMyUUIDPresent = response.data.attendees.some(
  //             (attendee) => attendee.uuid === myUUID,
  //           );
  //           if (isMyUUIDPresent) {
  //             if (
  //               !userInfo.departure.addressText &&
  //               !userInfo.departure.latitude &&
  //               !userInfo.departure.longitude
  //             ) {
  //               setIsFindDepartureModalOpen(true);
  //             }
  //             setRoomInfo((prev) => ({
  //               ...prev,
  //               roomUUID,
  //               isValid: true,
  //               roomName: response.data.roomName,
  //               meetingDate: response.data.roomTime,
  //               centerPlace: response.data.roomStartCenter,
  //               attendees: response.data.attendees,
  //               roomPurpose: response.data.roomPurpose,
  //               hostUUID: response.data.hostUUID,
  //             }));
  //             if (response.data.hostUUID === myUUID) {
  //               setUserInfo((prev) => ({
  //                 ...prev,
  //                 isHost: true,
  //               }));
  //             }
  //           } else {
  //             navigate("/invalid-room");
  //           }
  //         } else {
  //           navigate(`/room/${roomUUID}/join`);
  //         }
  //       } else {
  //         navigate("/invalid-room");
  //       }
  //     } catch (error) {
  //       console.error("방 유효성 검사 실패:", error);
  //       setRoomInfo((prev) => ({
  //         ...prev,
  //         isValid: false,
  //       }));
  //       navigate("/invalid-room");
  //     }
  //   };

  //   checkRoomValidity();
  // }, [roomUUID, navigate, setRoomInfo, userInfo.departure]);

  const handleCloseFindDepartureModal = () => {
    setIsFindDepartureModalOpen(false);
  };

  const handleAddressSelect = async (data) => {
    const { addressText, latitude, longitude, meetingDate } = data;
    if (
      userInfo.departure.addressText !== addressText ||
      userInfo.departure.latitude !== latitude ||
      userInfo.departure.longitude !== longitude
    ) {
      setSelectedAddress({ addressText, latitude, longitude });
      setUserInfo((prev) => ({
        ...prev,
        departure: {
          addressText,
          latitude,
          longitude,
        },
      }));
    }

    if (roomInfo.meetingDate !== meetingDate) {
      setRoomInfo((prev) => ({
        ...prev,
        meetingDate,
      }));
      try {
        await axiosUpdateUserInfo({
          addressText,
          latitude,
          longitude,
        });
      } catch (err) {
        console.error("사용자 정보 업데이트 실패");
      }
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleOpenShareModal = (title, top) => {
    setModalTitle(title);
    setModalTop(top);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <Wrapper>
      <NavBarLeft />
      {isFindDepartureModalOpen && (
        <FindDeparture
          onClose={handleCloseFindDepartureModal}
          onAddressSelect={handleAddressSelect}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onAddressSelect={handleAddressSelect}
        />
      )}
      {isShareModalOpen && (
        <ShareModal
          title={modalTitle}
          top={modalTop}
          onClose={handleCloseShareModal}
        />
      )}
      <Map selectedAddress={userInfo.departure} />
      <Buttons
        onOpenEditModal={handleOpenEditModal}
        onOpenShareModal={handleOpenShareModal}
      />
    </Wrapper>
  );
}

export default Room;
