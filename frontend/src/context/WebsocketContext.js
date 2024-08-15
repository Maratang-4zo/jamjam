import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import React from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import {
  aroundStationsAtom,
  chatAtom,
  estimatedForceCloseAtAtom,
  isNextMiddleExistAtom,
  roomAtom,
  roomPageAtom,
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
// import useOpenVidu from "../hooks/useOpenVidu";
import { useOpenVidu } from "./OpenViduContext";

const WebSocketContext = React.createContext({
  connect: () => {},
  connected: false,
  disconnect: () => {},
  sendChat: () => {},
  sendGame: () => {},
  sendGameRound: () => {},
  sendRoundInfo: () => {},
  sendNextRoundCenter: () => {},
  sendFinalStation: () => {},
  sendReset: () => {},
  sendNextRound: () => {},
  sendGoResult: () => {},
  sendGameStart: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const client = useRef(null);
  const connected = useRef(false);

  const navigate = useNavigate();
  const setRoomPage = useSetRecoilState(roomPageAtom);
  const setChatLogs = useSetRecoilState(chatAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
  const setPlayers = useSetRecoilState(playerState);
  const setSelectedGame = useSetRecoilState(selectedGameAtom);
  const setIsWinner = useSetRecoilState(isWinnerAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const setAroundStations = useSetRecoilState(aroundStationsAtom);
  const setTotalRound = useSetRecoilState(totalRoundAtom);
  const setGameSessionUUID = useSetRecoilState(gameSessionUUIDAtom);
  const setGameRecord = useSetRecoilState(gameRecordAtom);
  const setCurrentRoundUUID = useSetRecoilState(currentRoundUUIDAtom);
  const setGameState = useSetRecoilState(gameStateAtom);
  const setWinnerUUID = useSetRecoilState(winnerUUIDAtom);
  const setWinnerNickname = useSetRecoilState(winnerNicknameAtom);
  const setGameCount = useSetRecoilState(gameCountAtom);
  const setCurrentRound = useSetRecoilState(currentRoundAtom);
  const setRoundCenter = useSetRecoilState(roundCenterAtom);
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

  const connect = (roomUUID) => {
    console.log("Attempting to connect with roomUUID:", roomUUID);
    return new Promise((resolve, reject) => {
      if (connected.current) {
        console.log("Already connected");
        return resolve();
      }
      if (client.current) {
        client.current.deactivate(); // 이전 연결이 있다면 비활성화
      }
      client.current = new Client({
        webSocketFactory: () => new SockJS("https://jjam.shop/api/ws"),
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
        heartbeatIncoming: 20000,
        heartbeatOutgoing: 20000,
        onConnect: () => {
          console.log("Connected");
          connected.current = true;
          subscribe(roomUUID);
          resolve();
        },
        onStompError: (frame) => {
          console.error(frame);
          connected.current = false;
          reject(frame);
        },
        onWebSocketError: (evt) => {
          console.error("WebSocket Error:", evt);
          connected.current = false;
        },
        onWebSocketClose: (evt) => {
          console.warn("WebSocket Closed:", evt);
          connected.current = false;
        },
      });
      client.current.activate();
    });
  };

  const disconnect = () => {
    if (client.current) {
      client.current.deactivate();
      connected.current = false;
    }
  };

  const subscribe = useCallback((roomUUID) => {
    if (client.current) {
      client.current.subscribe(
        `/sub/rooms/${roomUUID}`,
        (message) => handleMessage(message),
        null,
        {},
      );

      client.current.subscribe(`/user/sub/errors`, (message) => {
        alert(message.body);
      });
    }
  }, []);

  const handleMessage = (message) => {
    console.log(message);
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
      case "GAME_PLAY":
        handleGamePlay(messageBody);
        break;
      default:
        console.error("Unknown message type:", message.headers.type);
    }
  };

  const handleGamePlay = (message) => {
    setWinnerUUID(message.winnerUUID);

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.attendeeUUID === message.attendeeUUID
          ? { ...player, bottom: message.data }
          : player,
      ),
    );
  };

  const handleRoomEnter = (message) => {
    const {
      attendeeUUID,
      address,
      nickname,
      lat,
      lon,
      root,
      profileImageUrl,
      route,
      duration,
      attendeeStatus,
    } = message;

    const newAttendee = {
      address,
      lat,
      lon,
      attendeeUUID,
      nickname,
      profileImageUrl,
      route,
      duration,
      attendeeStatus,
    };

    if (root) {
      setIsHostOut(false);
      setEstimatedForceCloseAt(null);
    }

    // 현재 유저의 정보 업데이트
    if (userInfo.myUUID === attendeeUUID) {
      setUserInfo((prev) => ({
        ...prev,
        isHost: root,
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
      hostUUID: root ? attendeeUUID : prevRoomInfo.hostUUID,
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

  const handleRoomRootLeave = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ attendeeUUID, estimatedForceCloseAt, nickname }) => {
        // 최신 roomInfo 가져오기
        const currentRoomInfo = await snapshot.getPromise(roomAtom);
        const userInfo = await snapshot.getPromise(userInfoAtom);

        // attendees 배열에서 attendeeUUID와 일치하는 사람을 제외한 새로운 배열 생성
        const updatedAttendees = currentRoomInfo.attendees.filter(
          (attendee) => attendee.attendeeUUID !== attendeeUUID,
        );

        // roomInfo 업데이트
        set(roomAtom, {
          ...currentRoomInfo,
          attendees: updatedAttendees,
        });

        // 현재 유저가 호스트인지 확인
        console.log(userInfo);
        if (userInfo.isHost) {
          // isHost가 true라면 setIsHostOut(true)와 setEstimatedForceCloseAt(estimatedForceCloseAt) 실행 안 함
          console.log("현재 유저가 호스트이므로 상태 변경이 생략되었습니다.");
        } else {
          // isHost가 false라면, 호스트가 나간 상태를 true로 설정하고, 추정 강제 종료 시간 설정
          set(isHostOutAtom, true);
          set(estimatedForceCloseAtAtom, estimatedForceCloseAt);
        }
      },
    [],
  );

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
  };

  const handleGameResultApply = ({
    gameSessionUUID,
    roomCenterStart,
    attendees,
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
    setRoomInfo((prev) => ({
      ...prev,
      centerPlace: roomCenterStart,
      attendees,
    }));
  };

  const handleGameStart = ({ gameRoundUUID }) => {
    // console.log("게임시작!", gameRoundUUID);
    setGameCount(0);
    setGameState("ing");
  };

  const handleGameCountdown = ({ gameRoundUUID, countdown }) => {
    // console.log("카운트값 제대로 들어갔니..??", countdown);
    setGameCount(countdown);
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

  const handleCenterHistory = ({ gameSessionUUID, roundRecordList }) => {
    setGameRecord(roundRecordList);
    setRoomPage("finalresult");
    setIsHistoryLoading(false);
    setIsNextMiddleExist(false);
  };

  const handleGameSessionReady = ({ gameSessionUUID, roundCnt }) => {
    setTotalRound(roundCnt);
    setGameSessionUUID(gameSessionUUID);
    setRoomPage("gamechoice");
  };

  const handleGetAroundStations = ({ aroundStations }) => {
    setAroundStations(aroundStations);
    setIsThreeStationLoading(false);
    setRoomPage("gamefinish");
  };

  const handleGameWinner = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ gameRoundUUID, attendeeUUID }) => {
        // winnerUUID 설정
        set(winnerUUIDAtom, attendeeUUID);

        // 최신 roomInfo 가져오기
        const currentRoomInfo = await snapshot.getPromise(roomAtom);
        const userInfo = await snapshot.getPromise(userInfoAtom);

        // attendees 배열에서 attendeeUUID와 일치하는 사람을 찾기
        const winner = currentRoomInfo.attendees.find(
          (attendee) => attendee.attendeeUUID === attendeeUUID,
        );

        // 해당 유저가 있으면 그 사람의 닉네임을 winnerNicknameAtom에 저장
        if (winner) {
          set(winnerNicknameAtom, winner.nickname);
        }

        // 현재 유저가 승자인지 확인하고 isWinner 상태 업데이트
        if (userInfo.myUUID === attendeeUUID) {
          set(isWinnerAtom, true);
        }
      },
    [],
  );

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

  const handleChatLogs = useRecoilCallback(
    ({ snapshot }) =>
      async (message) => {
        const { attendeeUUID, content, createdAt } = message;
        const currentRoomInfo = await snapshot.getPromise(roomAtom);
        const attendant = currentRoomInfo.attendees.find(
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
      },
    [],
  );

  const updateRoomStatus = (message) => {
    console.log("Room status updated:", message);
  };

  const handleAvatarPosition = (message) => {
    console.log("플레이어들의 위치 업데이트???", message);
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((player) =>
        player.attendeeUUID === message.attendeeUUID
          ? { ...player, bottom: message.bottom }
          : player,
      );
      return updatedPlayers;
    });
  };

  const sendChat = ({ content }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/chat/send`,
        body: JSON.stringify({ content }),
      });
    }
  };

  const sendGameStart = (gameRoundUUID) => {
    client.current.publish({
      destination: `/pub/game/round.start`,
      body: JSON.stringify({ gameRoundUUID }),
    });
  };

  const sendGame = (gameRoundUUID) => {
    console.log("Sending game data:");
    if (client.current) {
      client.current.publish({
        destination: "/pub/game/round.play",
        body: JSON.stringify({
          gameRoundUUID: gameRoundUUID,
          data: 10,
        }),
      });
    }
  };

  const sendGameRound = ({ roundCnt, roomUUID, finalStationName }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/session.setting`,
        body: JSON.stringify({
          roundCnt,
          roomUUID,
          finalStationName,
        }),
      });
    }
  };

  const sendRoundInfo = ({ round, gameId, gameSessionUUID, stationName }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/round.setting`,
        body: JSON.stringify({ round, gameId, gameSessionUUID, stationName }),
      });
    }
  };

  const sendNextRoundCenter = ({ gameRoundUUID, roundStationName }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/round.station`,
        body: JSON.stringify({
          gameRoundUUID,
          roundStationName,
        }),
      });
    }
  };

  // 최종 게임 기록 반영하기
  const sendFinalStation = ({ gameSessionUUID, finalStationName }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/session.station`,
        body: JSON.stringify({ gameSessionUUID, finalStationName }),
      });
    }
  };

  const sendReset = ({ gameSessionUUID }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/session.reset`,
        body: JSON.stringify({ gameSessionUUID }),
      });
    }
  };

  const sendNextRound = ({ gameRoundUUID, currentRound, totalRound }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/round.next`,
        body: JSON.stringify({ gameRoundUUID, currentRound, totalRound }),
      });
    }
  };

  const sendGoResult = ({ gameSessionUUID }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/session.end`,
        body: JSON.stringify({ gameSessionUUID }),
      });
    }
  };

  const handlers = useMemo(
    () => ({
      connect,
      connected: connected.current, // connected.current를 사용,
      disconnect,
      sendChat,
      sendGame,
      sendGameRound,
      sendRoundInfo,
      sendNextRoundCenter,
      sendFinalStation,
      sendReset,
      sendNextRound,
      sendGoResult,
      sendGameStart,
    }),
    [],
  );

  return (
    <WebSocketContext.Provider value={handlers}>
      {children}
    </WebSocketContext.Provider>
  );
};
