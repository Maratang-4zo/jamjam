import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import Map from "../components/mainroom/Map";
import FindDeparture from "../components/mainroom/Departure";
import EditModal from "../components/mainroom/EditModal";
import MainButtons from "../components/mainroom/MainButtons";
import ShareModal from "../components/mainroom/ShareModal";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import { roomAtom, roomPageAtom } from "../recoil/atoms/roomState";
import { axiosUpdateUserInfo } from "../apis/mapApi";
import { useNavigate, useParams } from "react-router-dom";
import { axiosIsRoomValid, axiosGetRoomInfo } from "../apis/roomApi";
import { getCookie } from "../utils/Cookies";
import { jwtDecode } from "jwt-decode";
import useWs from "../hooks/useWs";
import useOpenVidu from "../hooks/useOpenVidu";
import Loading from "../components/fixed/Loading";
import GameFinishButtons from "../components/mainroom/GameFinishButtons";
import GameChoice from "../components/mainroom/GameChoice";
import { selectedGameAtom } from "../recoil/atoms/gameState";
import FinalResult from "../components/mainroom/FinalResult";
import Game from "../components/mainroom/Game";

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
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const setRoomInfo = useSetRecoilState(roomAtom);
  const roomPage = useRecoilValue(roomPageAtom);
  const [joinLoading, setJoinLoading] = useState(false);
  const { connect, connected } = useWs();
  const { joinSession, joined } = useOpenVidu();

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        // 방 유효성 검사
        await axiosIsRoomValid({ roomUUID });

        // 방 정보 가져오기
        const roomResponse = await axiosGetRoomInfo({ roomUUID });
        const roomData = roomResponse.data;

        const roomToken = getCookie("roomToken");
        if (roomToken) {
          const myUUID = jwtDecode(roomToken).attendeeUUID;
          const myAttendeeInfo = roomData.attendees.find(
            (attendee) => attendee.attendeeUUID === myUUID,
          );

          if (
            myAttendeeInfo &&
            (!myAttendeeInfo.address ||
              !myAttendeeInfo.lat ||
              !myAttendeeInfo.lon)
          ) {
            setIsFindDepartureModalOpen(true);
          }

          setRoomInfo((prev) => ({
            ...prev,
            roomUUID,
            isValid: true,
            roomName: roomData.roomName,
            meetingDate: roomData.roomTime,
            centerPlace: roomData.roomStartCenter,
            attendees: [...roomData.attendees],
            roomPurpose: roomData.roomPurpose,
            hostUUID: roomData.hostUUID,
          }));

          setUserInfo((prev) => ({
            ...prev,
            isHost: roomData.isHost,
            departure: {
              addressText: myAttendeeInfo.address,
              latitude: myAttendeeInfo.lat,
              longitude: myAttendeeInfo.lon,
            },
            nickname: myAttendeeInfo.nickname,
            duration: myAttendeeInfo.duration,
            route: myAttendeeInfo.route,
            myUUID,
          }));

          if (!connected) {
            await connect();
          }

          if (!joined) {
            await joinSession();
          }
        } else {
          navigate(`/room/${roomUUID}/join`);
        }
      } catch (error) {
        console.error("방 유효성 검사 실패:", error);
        navigate("/invalid-room");
      } finally {
        setJoinLoading(false);
      }
    };

    initializeRoom();
  }, [
    roomUUID,
    navigate,
    setRoomInfo,
    setUserInfo,
    connect,
    joinSession,
    connected,
    joined,
  ]);

  const handleCloseFindDepartureModal = () => {
    setIsFindDepartureModalOpen(false);
  };

  const handleAddressSelect = async (data) => {
    const { addressText, latitude, longitude } = data;
    if (
      !userInfo.departure ||
      userInfo.departure.address !== addressText ||
      userInfo.departure.lat !== latitude ||
      userInfo.departure.lon !== longitude
    ) {
      try {
        await axiosUpdateUserInfo({
          address: addressText,
          lat: latitude,
          lon: longitude,
        });

        setUserInfo((prev) => ({
          ...prev,
          departure: {
            address: addressText,
            lat: latitude,
            lon: longitude,
          },
        }));

        setRoomInfo((prev) => {
          const updatedAttendees = prev.attendees.map((attendee) =>
            attendee.attendeeUUID === userInfo.myUUID
              ? {
                  ...attendee,
                  addressText: addressText,
                  lat: latitude,
                  lon: longitude,
                  route: null,
                  duration: null,
                }
              : attendee,
          );

          return {
            ...prev,
            attendees: updatedAttendees,
            isCenterExist: false,
            centerPlace: null,
          };
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
      {joinLoading ? <Loading message={"접속"} /> : null}
      {isFindDepartureModalOpen && (
        <FindDeparture
          onClose={handleCloseFindDepartureModal}
          onAddressSelect={handleAddressSelect}
        />
      )}
      {isEditModalOpen && (
        <EditModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} />
      )}
      {isShareModalOpen && (
        <ShareModal
          title={modalTitle}
          top={modalTop}
          onClose={handleCloseShareModal}
        />
      )}
      {roomPage === "main" && (
        <>
          <MainButtons
            onOpenEditModal={handleOpenEditModal}
            onOpenShareModal={handleOpenShareModal}
            onAddressSelect={handleAddressSelect}
          />
          <Map />
        </>
      )}
      {roomPage === "gamechoice" && <GameChoice />}
      {roomPage === "game" && <Game />}
      {roomPage === "gamefinish" && (
        <>
          <GameFinishButtons />
          <Map />
        </>
      )}
      {roomPage === "result" && <FinalResult />}
    </Wrapper>
  );
}

export default Room;
