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
import {
  estimatedForceCloseAtAtom,
  roomAtom,
  roomPageAtom,
} from "../recoil/atoms/roomState";
import { axiosUpdateUserInfo } from "../apis/mapApi";
import { useNavigate, useParams } from "react-router-dom";
import { axiosIsRoomValid, axiosGetRoomInfo } from "../apis/roomApi";
import useWs from "../hooks/useWs";
import useOpenVidu from "../hooks/useOpenVidu";
import Loading from "../components/fixed/Loading";
import GameFinishButtons from "../components/mainroom/GameFinishButtons";
import GameChoice from "../components/mainroom/GameChoice";
import FinalResult from "../components/mainroom/FinalResult";
import Game from "../components/mainroom/Game";
import Watching from "../components/fixed/Watching";
import { isHostOutAtom, isPlayingGameAtom } from "../recoil/atoms/loadingState";

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
  const [handleCopyClick, setHandleCopyClick] = useState(null);
  const [handleKakaoClick, setHandleKakaoClick] = useState(null);
  const [modalTop, setModalTop] = useState("50px");
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const setRoomInfo = useSetRecoilState(roomAtom);
  const roomPage = useRecoilValue(roomPageAtom);
  const [joinLoading, setJoinLoading] = useState(false);
  const [isDisabledOn, setIsDisalbedOn] = useState(false);
  const [isHostOut, setIsHostOut] = useRecoilState(isHostOutAtom);
  const [isPlayingGame, setIsPlayingGame] = useRecoilState(isPlayingGameAtom);
  const estimatedClosedAt = useRecoilValue(estimatedForceCloseAtAtom);
  const { connect, connected } = useWs();
  const { joinSession, joined } = useOpenVidu();

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        // 방 유효성 검사
        const response = await axiosIsRoomValid({ roomUUID });
        const res = response.data;
        if (!res.hasToken) {
          setRoomInfo((prev) => ({
            ...prev,
            roomUUID: res.roomUUID,
            roomName: res.roomName,
            meetingDate: res.meetingDate,
            roomPurpose: res.purpose,
          }));
          navigate(`/room/${roomUUID}/join`);
        } else {
          if (res.roomStatus === "ABORTED" || res.roomStatus === "FINISHED") {
            navigate("/");
            alert("종료된 방입니다.");
          } else if (res.roomStatus === "PLAYING") {
            setIsPlayingGame(true);
          } else if (res.roomStatus === "RESERVED") {
            setIsHostOut(true);
          }
          // 방 정보 가져오기
          const roomResponse = await axiosGetRoomInfo({ roomUUID });
          const roomData = roomResponse.data;

          console.log(roomData);

          const { myUUID } = userInfo;
          const myAttendeeInfo = roomData.attendees.find(
            (attendee) => attendee.attendeeUUID === myUUID,
          );

          const nowAttendees = roomData.attendees.filter(
            (attendee) => attendee.attendeeStatus !== "EXITED",
          );

          if (
            !myAttendeeInfo ||
            !myAttendeeInfo.address ||
            !myAttendeeInfo.lat ||
            !myAttendeeInfo.lon
          ) {
            setIsFindDepartureModalOpen(true);
          }

          setRoomInfo((prev) => ({
            ...prev,
            roomUUID,
            roomName: roomData.roomName,
            meetingDate: roomData.roomTime,
            centerPlace: roomData.roomCenterStart,
            attendees: [...nowAttendees],
            roomPurpose: roomData.roomPurpose,
            hostUUID: roomData.hostUUID,
          }));

          setUserInfo((prev) => ({
            ...prev,
            myUUID,
            isHost: roomData.isHost,
            departure: {
              address: myAttendeeInfo?.address || "",
              lat: myAttendeeInfo?.lat || null,
              lon: myAttendeeInfo?.lon || null,
            },
            nickname: myAttendeeInfo?.nickname || "",
            duration: myAttendeeInfo?.duration || null,
            route: myAttendeeInfo?.route || null,
            profileImageUrl: myAttendeeInfo?.profileImageUrl || "",
          }));

          if (!connected) {
            await connect(roomUUID);
          }

          if (!joined) {
            await joinSession();
          }
        }
      } catch (error) {
        console.error("방 유효성 검사 실패:", error);
        alert("존재하지 않는 방입니다.");
        navigate("/invalid-room");
      } finally {
        setJoinLoading(false);
      }
    };

    initializeRoom();
  }, [roomUUID, navigate, setRoomInfo, setUserInfo]);

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

  const handleOpenShareModal = (
    title,
    top,
    kakaoClickFn,
    copyClickFn,
    isDisabled,
  ) => {
    setModalTitle(title);
    setModalTop(top);
    setHandleKakaoClick(() => kakaoClickFn);
    setHandleCopyClick(() => copyClickFn);
    setIsShareModalOpen(true);
    setIsDisalbedOn(isDisabled);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <Wrapper>
      {isPlayingGame ? <Watching /> : null}
      {isHostOut ? (
        <Loading
          message={"방장이 나가서 대기"}
          estimatedForceCloseAt={estimatedClosedAt}
        />
      ) : null}
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
          onCopyClick={handleCopyClick}
          onKakaoClick={handleKakaoClick}
          isDisabled={isDisabledOn}
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
