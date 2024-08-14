import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  aroundStationsAtom,
  chatAtom,
  estimatedForceCloseAtAtom,
  isNextMiddleExistAtom,
  isWsConnectedAtom,
  roomAtom,
  roomPageAtom,
  wsClientAtom,
} from "../recoil/atoms/roomState";
import {
  currentRoundAtom,
  currentRoundUUIDAtom,
  gameCountAtom,
  gameRecordAtom,
  gameSessionUUIDAtom,
  gameStateAtom,
  isWinnerAtom,
  playerState,
  roundCenterAtom,
  selectedGameAtom,
  totalRoundAtom,
  winnerNicknameAtom,
  winnerUUIDAtom,
} from "../recoil/atoms/gameState";
import { useNavigate } from "react-router-dom";
import { userInfoAtom } from "../recoil/atoms/userState";
import {
  isCenterMoveLoadingAtom,
  isFindCenterLoadingAtom,
  isHistoryLoadingAtom,
  isHostOutAtom,
  isMainConnectingAtom,
  isPlayingGameAtom,
  isThreeStationLoadingAtom,
} from "../recoil/atoms/loadingState";
import useOpenVidu from "./useOpenVidu";

const API_BASE_URL = "https://jjam.shop";

const useWs = () => {
  const navigate = useNavigate();
  const setRoomPage = useSetRecoilState(roomPageAtom);
  const [connected, setConnected] = useRecoilValue(isWsConnectedAtom);
  const [chatLogs, setChatLogs] = useRecoilState(chatAtom);
  const [client, setClient] = useRecoilState(wsClientAtom); // 초기화 null로 변경
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
  const [players, setPlayers] = useRecoilState(playerState);
  const setSelectedGame = useSetRecoilState(selectedGameAtom);
  const setIsWinner = useSetRecoilState(isWinnerAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const setAroundStations = useSetRecoilState(aroundStationsAtom);
  const setTotalRound = useSetRecoilState(totalRoundAtom);
  const [gameSessionUUID, setGameSessionUUID] =
    useRecoilState(gameSessionUUIDAtom);
  const setGameRecord = useSetRecoilState(gameRecordAtom);
  const [currentRoundUUID, setCurrentRoundUUID] =
    useRecoilState(currentRoundUUIDAtom);
  const setGameState = useSetRecoilState(gameStateAtom);
  const setWinnerUUID = useSetRecoilState(winnerUUIDAtom);
  const setWinnerNickname = useSetRecoilState(winnerNicknameAtom);
  const setGameCount = useSetRecoilState(gameCountAtom);
  const setCurrentRound = useSetRecoilState(currentRoundAtom);
  const [roundCenter, setRoundCenter] = useRecoilState(roundCenterAtom);
  const setIsCenterMoveLoading = useSetRecoilState(isCenterMoveLoadingAtom);
  const setIsFindCenterLoading = useSetRecoilState(isFindCenterLoadingAtom);
  const setIsThreeStationLoading = useSetRecoilState(isThreeStationLoadingAtom);
  const setIsHistoryLoading = useSetRecoilState(isHistoryLoadingAtom);
  const setIsMainConnecting = useSetRecoilState(isMainConnectingAtom);
  const setIsHostOut = useSetRecoilState(isHostOutAtom);
  const setIsPlayingGame = useSetRecoilState(isPlayingGameAtom);
  const setEstimatedForceCloseAt = useSetRecoilState(estimatedForceCloseAtAtom);
  const setIsNextMiddleExist = useSetRecoilState(isNextMiddleExistAtom);
  const { leaveSession } = useOpenVidu();

  const connect = useCallback(
    (roomUUID) => {
      return new Promise((resolve, reject) => {
        if (connected) {
          console.log("Already connected");
          return resolve();
        }
        if (client) {
          client.deactivate(); // 이전 연결이 있다면 비활성화
        }
        const nowClient = new Client({
          webSocketFactory: () => new SockJS(API_BASE_URL + "/api/ws"),
          debug: (str) => {
            console.log(str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 20000,
          heartbeatOutgoing: 20000,
          onConnect: () => {
            console.log("Connected");
            setConnected(true);
            subscribe(roomUUID);
            resolve();
          },
          onStompError: (frame) => {
            console.error(frame);
            setConnected(false);
            reject(frame);
            handleStompError(frame);
          },
          onWebSocketError: (evt) => {
            handleWebSocketError(evt);
          },
          onWebSocketClose: (evt) => {
            handleWebSocketClose(evt);
          },
        });
        setClient(nowClient);
        nowClient.activate();
      });
    },
    [connected],
  );

  const handleStompError = (frame) => {
    if (frame.headers && frame.headers["message"]) {
      alert(`Handshake 실패: ${frame.headers["message"]}`);
    } else {
      alert("Handshake 실패: 알 수 없는 오류");
    }
    // 재연결 시도 중지
    client.current.deactivate();
  };

  const handleWebSocketClose = (event) => {
    if (event.code === 1006) {
      // 비정상적인 종료 코드
      alert("WebSocket 연결이 비정상적으로 종료되었습니다.");
      // 재연결 시도 중지
      client.current.deactivate();
    }
    alert(event.code);
    client.current.deactivate();
  };

  const handleWebSocketError = (error) => {
    alert("WebSocket 연결에 실패했습니다.");
    // 재연결 시도 중지
    client.current.deactivate();
  };

  const subscribe = (roomUUID) => {
    client.current.subscribe(
      `/sub/rooms/${roomUUID}`,
      (message) => {
        handleMessage(message);
      },
      null,
      {},
    );

    client.current.subscribe(`/user/sub/errors`, (message) => {
      alert(message.body);
    });
  };

  const disconnect = useCallback(() => {
    if (client.current) {
      client.current.deactivate();
      setConnected(false);
    }
  }, []);

  const handleMessage = useCallback((message) => {
    console.log("Received message:", message);
    const messageBody = JSON.parse(message.body);
    switch (message.headers.type) {
      case "CHAT_RECEIVED":
        handleChatLogs(messageBody);
        break;
      case "ROOM_UPDATE":
        updateRoomStatus(messageBody);
        break;
      case "AVATAR_POSITION":
        handleAvatarPosition(messageBody);
        break;
      case "ROOM_INFO_UPDATE":
        handleRoomInfoUpdate(messageBody);
        break;
      case "DEPARTURE_UPDATE":
        handleDepartureUpdate(messageBody);
        break;
      case "ROOM_CENTER_UPDATE":
        handleRoomCenterUpdate(messageBody);
        break;
      case "GAME_CENTER_UPDATE":
        handleGameCenterUpdate(messageBody);
        break;
      case "AROUND_STATIONS":
        handleGetAroundStations(messageBody);
        break;
      case "GAME_SESSION_READY":
        handleGameSessionReady(messageBody);
        break;
      case "CENTER_HISTORY":
        handleCenterHistory(messageBody);
        break;
      case "GAME_READY":
        handleGameReady(messageBody);
        break;
      case "GAME_END":
        handleGameEnd(messageBody);
        break;
      case "GAME_WINNER":
        handleGameWinner(messageBody);
        break;
      case "GAME_COUNTDOWN":
        handleGameCountdown(messageBody);
        break;
      case "GAME_START":
        handleGameStart(messageBody);
        break;
      case "GAME_RESULT_APPLY":
        handleGameResultApply(messageBody);
        break;
      case "GAME_RESET":
        handleGameReset(messageBody);
        break;
      case "HOST_FIND_CENTER":
        handleHostFindCenter(messageBody);
        break;
      case "GAME_NEXT_ROUND":
        handleNextRound(messageBody);
        break;
      case "WINNER_NEXT_PAGE":
        handleWinnerNextPage(messageBody);
        break;
      case "HOST_GO_MAIN":
        handleHostGoMain(messageBody);
        break;
      case "ROOM_ROOT_LEAVE":
        handleRoomRootLeave(messageBody);
        break;
      case "ROOM_LEAVE":
        handleRoomLeave(messageBody);
        break;
      case "ROOM_ENTER":
        handleRoomEnter(messageBody);
        break;
      case "ROOM_FORCE_EXIT":
        handleRoomExit(messageBody);
        break;
      default:
        console.error("Unknown message type:", message.type);
    }
  }, []);

  const handleRoomEnter = (message) => {
    const {
      attendeeUUID,
      address,
      nickname,
      lat,
      lon,
      isRoot,
      profileImageUrl,
    } = message;

    const newAttendee = {
      address,
      lat,
      lon,
      attendeeUUID,
      nickname,
      profileImageUrl,
    };

    if (!address || !lat || !lon) {
      setRoomInfo((prev) => ({
        ...prev,
        isAllHasDeparture: false,
      }));
    }

    if (isRoot) {
      setIsHostOut(false);
      setEstimatedForceCloseAt(null);
    }

    // 현재 유저의 정보 업데이트
    if (userInfo.myUUID === attendeeUUID) {
      setUserInfo((prev) => ({
        ...prev,
        isHost: isRoot,
        nickname,
        departure: {
          address,
          lat,
          lon,
        },
      }));
    }

    // roomInfo 업데이트
    setRoomInfo((prevRoomInfo) => ({
      ...prevRoomInfo,
      attendees: [...prevRoomInfo.attendees, newAttendee],
      hostUUID: isRoot ? attendeeUUID : prevRoomInfo.hostUUID,
    }));

    // 채팅로그에 추가
    const newChatLog = {
      type: "alert",
      alertType: "in",
      attendeeUUID,
      nickname,
    };
    setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
  };

  const handleRoomLeave = (message) => {
    const { attendeeUUID, nickname, lat, lon, attendeeStatus } = message;

    setRoomInfo((prevRoomInfo) => ({
      ...prevRoomInfo,
      attendees: prevRoomInfo.attendees.filter(
        (attendee) => attendee.attendeeUUID !== attendeeUUID,
      ),
    }));

    const newChatLog = {
      type: "alert",
      alertType: "out",
      attendeeUUID,
      nickname,
    };
    setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
  };

  const handleRoomRootLeave = ({
    attendeeUUID,
    estimatedForceCloseAt,
    nickname,
  }) => {
    setIsHostOut(true);

    setRoomInfo((prevRoomInfo) => ({
      ...prevRoomInfo,
      attendees: prevRoomInfo.attendees.filter(
        (attendee) => attendee.attendeeUUID !== attendeeUUID,
      ),
    }));

    setEstimatedForceCloseAt(estimatedForceCloseAt);

    const newChatLog = {
      type: "alert",
      alertType: "out",
      attendeeUUID,
      nickname,
    };
    setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
  };

  const handleRoomExit = () => {
    setIsHostOut(false); // 호스트가 나간 상태를 false로 설정

    // OpenVidu 세션 종료
    leaveSession(); // useOpenVidu 훅에서 제공하는 leaveSession 함수 호출

    // STOMP WebSocket 연결 종료
    disconnect(); // WebSocket 연결을 해제하는 함수 호출

    // 홈 페이지로 이동
    navigate("/");

    // 추가적인 클린업 작업이 필요한 경우 이곳에 작성
  };

  const handleHostGoMain = ({ isMainConnecting }) => {
    setIsMainConnecting(isMainConnecting);
    setIsPlayingGame(false);
  };

  const handleWinnerNextPage = ({ isThreeStationLoading }) => {
    setIsThreeStationLoading(isThreeStationLoading);
  };

  const sendNextRound = ({ gameRoundUUID, currentRound, totalRound }) => {
    client.current.publish({
      destination: `/pub/game/round.next`,
      body: JSON.stringify({ gameRoundUUID, currentRound, totalRound }),
    });
  };

  const sendGoResult = ({ gameSessionUUID }) => {
    client.current.publish({
      destination: `/pub/game/session.end`,
      body: JSON.stringify({ gameSessionUUID }),
    });
  };

  const handleNextRound = ({ next }) => {
    if (next === "nextRound") {
      setCurrentRound((prev) => (prev += 1));
    } else {
      setCurrentRound(1);
    }
    setRoomPage(next);
    setIsNextMiddleExist(false);
  };

  const handleHostFindCenter = ({ isFindCenterLoading }) => {
    setIsFindCenterLoading(isFindCenterLoading);
  };

  // 최종 장소 리셋
  const sendReset = ({ gameSessionUUID }) => {
    client.current.publish({
      destination: `/pub/game/session.reset`,
      body: JSON.stringify({ gameSessionUUID }),
    });
  };

  const handleGameReset = ({ gameSessionUUID }) => {
    setRoundCenter({});
    setRoomPage("main");
    setGameSessionUUID("");
    setTotalRound(0);
    setCurrentRound(1);
    setCurrentRoundUUID("");
    setGameRecord([]);
    setWinnerUUID("");
    setIsWinner(false);
    setSelectedGame(0);
    setPlayers([]);
    setIsMainConnecting(false);

    // 기존의 roomInfo.attendees를 업데이트
    setRoomInfo((prev) => {
      const updatedAttendees = prev.attendees.map((attendee) => {
        // 기존에 WAITING 상태였던 참가자의 상태를 ENTERED로 변경
        if (attendee.attendeeStatus === "WAITING") {
          return {
            ...attendee,
            attendeeStatus: "ENTERED",
          };
        }
        // 나머지 참여자는 그대로 유지
        return attendee;
      });

      return {
        ...prev,
        attendees: updatedAttendees, // 업데이트된 attendees 배열로 설정
      };
    });
  };

  const handleGameResultApply = ({
    gameSessionUUID,
    roomCenterStart,
    attendees, // 게임에 참여한 사람들의 정보
  }) => {
    setIsMainConnecting(false);
    setRoomPage("main");
    setIsCenterMoveLoading(false);
    setGameSessionUUID("");
    setTotalRound(0);
    setCurrentRound(1);
    setCurrentRoundUUID("");
    setGameRecord([]);
    setWinnerUUID("");
    setIsWinner(false);
    setSelectedGame(0);
    setPlayers([]);

    // 기존의 roomInfo.attendees를 업데이트
    setRoomInfo((prev) => {
      // 기존의 attendees에서 게임에 참여하지 않은 사람들만 필터링
      const updatedAttendees = prev.attendees.map((existingAttendee) => {
        const updatedAttendee = attendees.find(
          (attendee) => attendee.attendeeUUID === existingAttendee.attendeeUUID,
        );

        // 만약 현재 존재하는 attendee가 게임에 참여한 사람이라면
        if (updatedAttendee) {
          return {
            ...updatedAttendee, // 새로 받은 정보로 업데이트
            attendeeStatus: "ENTERED", // 상태를 ENTERED로 바꿔줌
          };
        }

        // 게임에 참여하지 않았던 사람은 그대로 유지, 상태만 변경
        if (existingAttendee.attendeeStatus === "WAITING") {
          return {
            ...existingAttendee,
            attendeeStatus: "ENTERED",
          };
        }

        // 그렇지 않은 경우는 그대로 유지
        return existingAttendee;
      });

      return {
        ...prev,
        centerPlace: roomCenterStart, // 새로운 centerPlace로 업데이트
        attendees: updatedAttendees, // 업데이트된 attendees 배열로 설정
      };
    });
  };

  // 최종 장소 기록에 반영
  const sendFinalStation = ({ finalStationName }) => {
    client.current.publish({
      destination: `/pub/game/session.station`,
      body: JSON.stringify({ gameSessionUUID, finalStationName }),
    });
  };

  const handleGameStart = ({ gameRoundUUID }) => {
    setGameCount(0);
    setGameState("ing");
  };

  const handleGameCountdown = ({ gameRoundUUID, countdown }) => {
    setGameCount(countdown);
  };

  const sendGameStart = (gameRoundUUID) => {
    client.current.publish({
      destination: `/pub/game/round.start`,
      body: JSON.stringify({ gameRoundUUID }),
    });
  };

  const handleGameEnd = ({ gameRoundUUID }) => {
    setGameState("end");
    setGameCount(99);
  };

  const handleGameReady = ({ gameRoundUUID }) => {
    setCurrentRoundUUID(gameRoundUUID);
    setRoomPage("game");
    sendGameStart(gameRoundUUID);
  };

  const sendRoundInfo = ({ round, gameId, gameSessionUUID, stationName }) => {
    client.current.publish({
      destination: `/pub/game/round.setting`,
      body: JSON.stringify({ round, gameId, gameSessionUUID, stationName }),
    });
  };

  const handleCenterHistory = ({ gameSessionUUID, roundRecordList }) => {
    setGameRecord(roundRecordList);
    setRoomPage("finalresult");
    setIsHistoryLoading(false);
    setIsNextMiddleExist(false);
  };

  const handleGameSessionReady = ({ gameSessionUUID, roundCnt }) => {
    setTotalRound(roundCnt);
    setGameSessionUUID(gameSessionUUID);
  };

  // 게임 라운드 설정
  const sendGameRound = ({ roundCnt, roomUUID, finalStationName }) => {
    console.log("useWs의 sendGameRound", {
      roundCnt,
      roomUUID,
      finalStationName,
    });
    client.current.publish({
      destination: `/pub/game/session.setting`,
      body: JSON.stringify({
        roundCnt,
        roomUUID,
        finalStationName,
      }),
    });
  };

  const handleGetAroundStations = ({ aroundStations }) => {
    setAroundStations(aroundStations);
    setIsThreeStationLoading(false);
    setRoomPage("gamefinish");
  };

  const handleGameWinner = ({ gameRoundUUID, attendeeUUID }) => {
    // winnerUUID 설정
    setWinnerUUID(attendeeUUID);

    // attendees 배열에서 attendeeUUID와 일치하는 사람을 찾기
    const winner = roomInfo.attendees.find(
      (attendee) => attendee.attendeeUUID === attendeeUUID,
    );

    // 해당 유저가 있으면 그 사람의 닉네임을 winnerNicknameAtom에 저장
    if (winner) {
      setWinnerNickname(winner.nickname);
    }

    // 현재 유저가 승자인지 확인하고 isWinner 상태 업데이트
    if (userInfo.myUUID === attendeeUUID) {
      setIsWinner(true);
    }
  };

  const sendNextRoundCenter = ({ roundStationName }) => {
    client.current.publish({
      destination: `/pub/game/round.station`,
      body: JSON.stringify({
        gameRoundUUID: currentRoundUUID,
        roundStationName,
      }),
    });
  };

  const handleGameCenterUpdate = ({ roundCenterStation }) => {
    setRoundCenter(roundCenterStation);
    setIsNextMiddleExist(true);
    setGameState("before");
  };

  const handleRoomCenterUpdate = ({ roomCenterStart, attendees }) => {
    setRoomInfo((prev) => ({
      ...prev,
      centerPlace: roomCenterStart,
      attendees,
      isCenterExist: true,
    }));
    setRoundCenter(roomCenterStart);
    setIsFindCenterLoading(false);
    setGameState("before");
  };

  const handleDepartureUpdate = ({
    attendeeUUID,
    address,
    lat,
    lon,
    allHasDeparture,
    centerExist,
  }) => {
    setRoomInfo((prevRoomInfo) => {
      const updatedAttendees = prevRoomInfo.attendees.map((attendee) =>
        attendee.attendeeUUID === attendeeUUID
          ? { ...attendee, address, lat, lon }
          : attendee,
      );
      return {
        ...prevRoomInfo,
        attendees: updatedAttendees,
        isAllHasDeparture: allHasDeparture,
        isCenterExist: centerExist,
      };
    });
  };

  const handleRoomInfoUpdate = ({ meetingDate, name, purpose }) => {
    setRoomInfo((prev) => ({
      ...prev,
      meetingDate,
      roomName: name,
      roomPurpose: purpose,
    }));
  };

  const sendChat = ({ content }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/chat/send`,
        body: JSON.stringify({ content }),
      });
    }
  };

  const handleChatLogs = (message) => {
    const { attendeeUUID, content, createdAt } = message;
    const attendant = roomInfo.attendees.find(
      (attendee) => attendee.attendeeUUID === attendeeUUID,
    );
    const nickname = attendant ? attendant.nickname : "Unknown";
    const newChatLog = {
      type: "chat",
      attendeeUUID,
      nickname,
      content,
      createdAt,
    };
    setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
    console.log(message);
  };

  const updateRoomStatus = useCallback((message) => {
    console.log("Room status updated:", message);
  }, []);

  const handleAvatarPosition = useCallback(
    (message) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((player) =>
          player.attendeeUUID === message.attendeeUUID
            ? { ...player, bottom: message.bottom }
            : player,
        );
        return updatedPlayers;
      });
    },
    [setPlayers],
  );

  const sendGame = useCallback(({ newBottom }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/updatePosition`,
        body: JSON.stringify({ bottom: newBottom }),
      });
    }
  }, []);

  // useEffect(() => {
  //   connect().catch((error) => {
  //     console.error("WebSocket connection failed:", error);
  //   });
  //   return () => {
  //     disconnect();
  //   };
  // }, []);

  return {
    connect,
    subscribe,
    disconnect,
    handleMessage,
    sendChat,
    sendGame,
    sendGameRound,
    sendRoundInfo,
    sendNextRoundCenter,
    sendFinalStation,
    sendReset,
    sendNextRound,
    sendGoResult,
  };
};

export default useWs;
