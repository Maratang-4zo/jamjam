// import { useEffect, useRef, useState, useCallback, useContext } from "react";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import {
//   aroundStationsAtom,
//   chatAtom,
//   estimatedForceCloseAtAtom,
//   isNextMiddleExistAtom,
//   roomAtom,
//   roomPageAtom,
// } from "../recoil/atoms/roomState";
// import {
//   currentRoundAtom,
//   currentRoundUUIDAtom,
//   gameCountAtom,
//   gameRecordAtom,
//   gameSessionUUIDAtom,
//   gameStateAtom,
//   isWinnerAtom,
//   playerState,
//   roundCenterAtom,
//   selectedGameAtom,
//   totalRoundAtom,
//   winnerNicknameAtom,
//   winnerUUIDAtom,
// } from "../recoil/atoms/gameState";
// import { useNavigate } from "react-router-dom";
// import { userInfoAtom } from "../recoil/atoms/userState";
// import { axiosPatchNextMiddle } from "../apis/mapApi";
// import {
//   isCenterMoveLoadingAtom,
//   isFindCenterLoadingAtom,
//   isHistoryLoadingAtom,
//   isHostOutAtom,
//   isMainConnectingAtom,
//   isPlayingGameAtom,
//   isThreeStationLoadingAtom,
// } from "../recoil/atoms/loadingState";
// import useOpenVidu from "./useOpenVidu";
// import { WebSocketContext, useWebSocket } from "../context/WebsocketContext.js";

// const API_BASE_URL = "https://jjam.shop";

// const useWs = () => {
//   const {
//     client,
//     connected,
//     subscribed,
//     connect,
//     disconnect,
//     sendChat,
//     sendGame,
//     sendGameRound,
//     sendRoundInfo,
//     sendNextRoundCenter,
//     sendFinalStation,
//     sendReset,
//     sendNextRound,
//     sendGoResult,
//     sendGameStart,
//   } = useWebSocket();

//   const navigate = useNavigate();
//   const setRoomPage = useSetRecoilState(roomPageAtom);
//   const [chatLogs, setChatLogs] = useRecoilState(chatAtom);
//   const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
//   const [players, setPlayers] = useRecoilState(playerState);
//   const setSelectedGame = useSetRecoilState(selectedGameAtom);
//   const setIsWinner = useSetRecoilState(isWinnerAtom);
//   const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
//   const setAroundStations = useSetRecoilState(aroundStationsAtom);
//   const setTotalRound = useSetRecoilState(totalRoundAtom);
//   const [gameSessionUUID, setGameSessionUUID] =
//     useRecoilState(gameSessionUUIDAtom);
//   const setGameRecord = useSetRecoilState(gameRecordAtom);
//   const [currentRoundUUID, setCurrentRoundUUID] =
//     useRecoilState(currentRoundUUIDAtom);
//   const setGameState = useSetRecoilState(gameStateAtom);
//   const setWinnerUUID = useSetRecoilState(winnerUUIDAtom);
//   const setWinnerNickname = useSetRecoilState(winnerNicknameAtom);
//   const setGameCount = useSetRecoilState(gameCountAtom);
//   const setCurrentRound = useSetRecoilState(currentRoundAtom);
//   const [roundCenter, setRoundCenter] = useRecoilState(roundCenterAtom);
//   const setIsCenterMoveLoading = useSetRecoilState(isCenterMoveLoadingAtom);
//   const setIsFindCenterLoading = useSetRecoilState(isFindCenterLoadingAtom);
//   const setIsThreeStationLoading = useSetRecoilState(isThreeStationLoadingAtom);
//   const setIsHistoryLoading = useSetRecoilState(isHistoryLoadingAtom);
//   const setIsMainConnecting = useSetRecoilState(isMainConnectingAtom);
//   const setIsHostOut = useSetRecoilState(isHostOutAtom);
//   const setIsPlayingGame = useSetRecoilState(isPlayingGameAtom);
//   const setEstimatedForceCloseAt = useSetRecoilState(estimatedForceCloseAtAtom);
//   const setIsNextMiddleExist = useSetRecoilState(isNextMiddleExistAtom);
//   const { leaveSession } = useOpenVidu();

//   const subscribe = useCallback((roomUUID) => {
//     if (client.current) {
//       client.current.subscribe(
//         `/sub/rooms/${roomUUID}`,
//         (message) => handleMessage(message),
//         null,
//         {},
//       );

//       client.current.subscribe(`/user/sub/errors`, (message) => {
//         alert(message.body);
//       });
//     }
//   }, []);

//   const handleMessage = useCallback((message) => {
//     console.log(message);
//     const messageBody = JSON.parse(message.body);
//     switch (message.headers.type) {
//       case "CHAT_RECEIVED":
//         handleChatLogs(messageBody);
//         break;
//       case "ROOM_UPDATE":
//         updateRoomStatus(messageBody);
//         break;
//       case "AVATAR_POSITION":
//         handleAvatarPosition(messageBody);
//         break;
//       case "ROOM_INFO_UPDATE":
//         handleRoomInfoUpdate(messageBody);
//         break;
//       case "DEPARTURE_UPDATE":
//         handleDepartureUpdate(messageBody);
//         break;
//       case "ROOM_CENTER_UPDATE":
//         handleRoomCenterUpdate(messageBody);
//         break;
//       case "GAME_CENTER_UPDATE":
//         handleGameCenterUpdate(messageBody);
//         break;
//       case "AROUND_STATIONS":
//         handleGetAroundStations(messageBody);
//         break;
//       case "GAME_SESSION_READY":
//         handleGameSessionReady(messageBody);
//         break;
//       case "CENTER_HISTORY":
//         handleCenterHistory(messageBody);
//         break;
//       case "GAME_READY":
//         handleGameReady(messageBody);
//         break;
//       case "GAME_END":
//         handleGameEnd(messageBody);
//         break;
//       case "GAME_WINNER":
//         handleGameWinner(messageBody);
//         break;
//       case "GAME_COUNTDOWN":
//         handleGameCountdown(messageBody);
//         break;
//       case "GAME_START":
//         handleGameStart(messageBody);
//         break;
//       case "GAME_RESULT_APPLY":
//         handleGameResultApply(messageBody);
//         break;
//       case "GAME_RESET":
//         handleGameReset(messageBody);
//         break;
//       case "HOST_FIND_CENTER":
//         handleHostFindCenter(messageBody);
//         break;
//       case "GAME_NEXT_ROUND":
//         handleNextRound(messageBody);
//         break;
//       case "WINNER_NEXT_PAGE":
//         handleWinnerNextPage(messageBody);
//         break;
//       case "HOST_GO_MAIN":
//         handleHostGoMain(messageBody);
//         break;
//       case "ROOM_ROOT_LEAVE":
//         handleRoomRootLeave(messageBody);
//         break;
//       case "ROOM_LEAVE":
//         handleRoomLeave(messageBody);
//         break;
//       case "ROOM_ENTER":
//         handleRoomEnter(messageBody);
//         break;
//       case "ROOM_FORCE_EXIT":
//         handleRoomExit(messageBody);
//         break;
//       default:
//         console.error("Unknown message type:", message.type);
//     }
//   }, []);

//   const handleRoomEnter = (message) => {
//     const {
//       attendeeUUID,
//       address,
//       nickname,
//       lat,
//       lon,
//       isRoot,
//       profileImageUrl,
//     } = message;

//     const newAttendee = {
//       address,
//       lat,
//       lon,
//       attendeeUUID,
//       nickname,
//       profileImageUrl,
//     };

//     if (isRoot) {
//       setIsHostOut(false);
//       setEstimatedForceCloseAt(null);
//     }

//     // 현재 유저의 정보 업데이트
//     if (userInfo.myUUID === attendeeUUID) {
//       setUserInfo((prev) => ({
//         ...prev,
//         isHost: isRoot,
//         nickname,
//         departure: {
//           address,
//           lat,
//           lon,
//         },
//       }));
//     }

//     // roomInfo 업데이트
//     setRoomInfo((prevRoomInfo) => ({
//       ...prevRoomInfo,
//       attendees: [...prevRoomInfo.attendees, newAttendee],
//       hostUUID: isRoot ? attendeeUUID : prevRoomInfo.hostUUID,
//     }));

//     // 채팅로그에 추가
//     const newChatLog = {
//       type: "alert",
//       alertType: "in",
//       attendeeUUID,
//       nickname,
//     };
//     setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
//   };

//   const handleRoomLeave = (message) => {
//     const { attendeeUUID, nickname, lat, lon, attendeeStatus } = message;

//     setRoomInfo((prevRoomInfo) => ({
//       ...prevRoomInfo,
//       attendees: prevRoomInfo.attendees.filter(
//         (attendee) => attendee.attendeeUUID !== attendeeUUID,
//       ),
//     }));

//     const newChatLog = {
//       type: "alert",
//       alertType: "out",
//       attendeeUUID,
//       nickname,
//     };
//     setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
//   };

//   const handleRoomRootLeave = ({
//     attendeeUUID,
//     estimatedForceCloseAt,
//     nickname,
//   }) => {
//     setIsHostOut(true);

//     setRoomInfo((prevRoomInfo) => ({
//       ...prevRoomInfo,
//       attendees: prevRoomInfo.attendees.filter(
//         (attendee) => attendee.attendeeUUID !== attendeeUUID,
//       ),
//     }));

//     setEstimatedForceCloseAt(estimatedForceCloseAt);

//     const newChatLog = {
//       type: "alert",
//       alertType: "out",
//       attendeeUUID,
//       nickname,
//     };
//     setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
//   };

//   const handleRoomExit = () => {
//     setIsHostOut(false); // 호스트가 나간 상태를 false로 설정

//     // OpenVidu 세션 종료
//     leaveSession(); // useOpenVidu 훅에서 제공하는 leaveSession 함수 호출

//     // STOMP WebSocket 연결 종료
//     disconnect(); // WebSocket 연결을 해제하는 함수 호출

//     // 홈 페이지로 이동
//     navigate("/");

//     // 추가적인 클린업 작업이 필요한 경우 이곳에 작성
//   };

//   const handleHostGoMain = ({ isMainConnecting }) => {
//     setIsMainConnecting(isMainConnecting);
//     setIsPlayingGame(false);
//   };

//   const handleWinnerNextPage = ({ isThreeStationLoading }) => {
//     setIsThreeStationLoading(isThreeStationLoading);
//   };

//   const handleNextRound = ({ next }) => {
//     if (next === "nextRound") {
//       setCurrentRound((prev) => (prev += 1));
//     } else {
//       setCurrentRound(1);
//     }
//     setRoomPage(next);
//     setIsNextMiddleExist(false);
//   };

//   const handleHostFindCenter = ({ isFindCenterLoading }) => {
//     setIsFindCenterLoading(isFindCenterLoading);
//   };

//   const handleGameReset = ({ gameSessionUUID }) => {
//     setRoundCenter({});
//     setRoomPage("main");
//     setGameSessionUUID("");
//     setTotalRound(0);
//     setCurrentRound(1);
//     setCurrentRoundUUID("");
//     setGameRecord([]);
//     setWinnerUUID("");
//     setIsWinner(false);
//     setSelectedGame(0);
//     setPlayers([]);
//     setIsMainConnecting(false);
//   };

//   const handleGameResultApply = ({
//     gameSessionUUID,
//     roomCenterStart,
//     attendees,
//   }) => {
//     setIsMainConnecting(false);
//     setRoomPage("main");
//     setIsCenterMoveLoading(false);
//     setGameSessionUUID("");
//     setTotalRound(0);
//     setCurrentRound(1);
//     setCurrentRoundUUID("");
//     setGameRecord([]);
//     setWinnerUUID("");
//     setIsWinner(false);
//     setSelectedGame(0);
//     setPlayers([]);
//     setRoomInfo((prev) => ({
//       ...prev,
//       centerPlace: roomCenterStart,
//       attendees,
//     }));
//   };

//   const handleGameStart = ({ gameRoundUUID }) => {
//     setGameCount(0);
//     setGameState("ing");
//   };

//   const handleGameCountdown = ({ gameRoundUUID, countdown }) => {
//     setGameCount(countdown);
//   };

//   const handleGameEnd = ({ gameRoundUUID }) => {
//     setGameState("end");
//     setGameCount(99);
//   };

//   const handleGameReady = ({ gameRoundUUID }) => {
//     setCurrentRoundUUID(gameRoundUUID);
//     setRoomPage("game");
//     sendGameStart(gameRoundUUID);
//   };

//   const handleCenterHistory = ({ gameSessionUUID, roundRecordList }) => {
//     setGameRecord(roundRecordList);
//     setRoomPage("finalresult");
//     setIsHistoryLoading(false);
//     setIsNextMiddleExist(false);
//   };

//   const handleGameSessionReady = ({ gameSessionUUID, roundCnt }) => {
//     setTotalRound(roundCnt);
//     setGameSessionUUID(gameSessionUUID);
//   };

//   const handleGetAroundStations = ({ aroundStations }) => {
//     setAroundStations(aroundStations);
//     setIsThreeStationLoading(false);
//     setRoomPage("gamefinish");
//   };

//   const handleGameWinner = ({ gameRoundUUID, attendeeUUID }) => {
//     // winnerUUID 설정
//     setWinnerUUID(attendeeUUID);

//     // attendees 배열에서 attendeeUUID와 일치하는 사람을 찾기
//     const winner = roomInfo.attendees.find(
//       (attendee) => attendee.attendeeUUID === attendeeUUID,
//     );

//     // 해당 유저가 있으면 그 사람의 닉네임을 winnerNicknameAtom에 저장
//     if (winner) {
//       setWinnerNickname(winner.nickname);
//     }

//     // 현재 유저가 승자인지 확인하고 isWinner 상태 업데이트
//     if (userInfo.myUUID === attendeeUUID) {
//       setIsWinner(true);
//     }
//   };

//   const handleGameCenterUpdate = ({ roundCenterStation }) => {
//     setRoundCenter(roundCenterStation);
//     setIsNextMiddleExist(true);
//     setGameState("before");
//   };

//   const handleRoomCenterUpdate = ({ roomCenterStart, attendees }) => {
//     setRoomInfo((prev) => ({
//       ...prev,
//       centerPlace: roomCenterStart,
//       attendees,
//       isCenterExist: true,
//     }));
//     setRoundCenter(roomCenterStart);
//     setIsFindCenterLoading(false);
//     setGameState("before");
//   };

//   const handleDepartureUpdate = ({
//     attendeeUUID,
//     address,
//     lat,
//     lon,
//     isAllHasDeparture,
//     isCenterExist,
//   }) => {
//     setRoomInfo((prevRoomInfo) => {
//       const updatedAttendees = prevRoomInfo.attendees.map((attendee) =>
//         attendee.attendeeUUID === attendeeUUID
//           ? { ...attendee, address, lat, lon }
//           : attendee,
//       );
//       return {
//         ...prevRoomInfo,
//         attendees: updatedAttendees,
//         isAllHasDeparture,
//         isCenterExist,
//       };
//     });
//   };

//   const handleRoomInfoUpdate = ({ meetingDate, name, purpose }) => {
//     setRoomInfo((prev) => ({
//       ...prev,
//       meetingDate,
//       roomName: name,
//       roomPurpose: purpose,
//     }));
//   };

//   const handleChatLogs = useCallback(
//     (message) => {
//       const { attendeeUUID, content, createdAt } = message;
//       const attendant = roomInfo.attendees.find(
//         (attendee) => attendee.attendeeUUID === attendeeUUID,
//       );
//       const nickname = attendant ? attendant.nickname : "Unknown";
//       const newChatLog = {
//         type: "chat",
//         attendeeUUID,
//         nickname,
//         content,
//         createdAt,
//       };
//       setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
//       console.log(message);
//     },
//     [roomInfo.attendees, setChatLogs],
//   );

//   const updateRoomStatus = useCallback((message) => {
//     console.log("Room status updated:", message);
//   }, []);

//   const handleAvatarPosition = useCallback(
//     (message) => {
//       setPlayers((prevPlayers) => {
//         const updatedPlayers = prevPlayers.map((player) =>
//           player.attendeeUUID === message.attendeeUUID
//             ? { ...player, bottom: message.bottom }
//             : player,
//         );
//         return updatedPlayers;
//       });
//     },
//     [setPlayers],
//   );

//   return {
//     connect,
//     connected,
//     disconnect,
//     subscribed,
//     subscribe,
//     sendChat,
//     sendGame,
//     sendGameRound,
//     sendRoundInfo,
//     sendNextRoundCenter,
//     sendFinalStation,
//     sendReset,
//     sendNextRound,
//     sendGoResult,
//   };
// };

// export default useWs;
