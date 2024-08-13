import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  aroundStationsAtom,
  chatAtom,
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
import { useNavigate } from "react-router-dom";
import { userInfoAtom } from "../recoil/atoms/userState";
import { axiosPatchNextMiddle } from "../apis/mapApi";
import {
  isCenterMoveLoadingAtom,
  isFindCenterLoadingAtom,
  isHistoryLoadingAtom,
  isMainConnectingAtom,
  isThreeStationLoadingAtom,
} from "../recoil/atoms/loadingState";

const API_BASE_URL = "https://jjam.shop";

const useWs = () => {
  const setRoomPage = useSetRecoilState(roomPageAtom);
  const [connected, setConnected] = useState(false);
  const [chatLogs, setChatLogs] = useRecoilState(chatAtom);
  const client = useRef(null); // 초기화 null로 변경
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

  const connect = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (connected) {
        console.log("Already connected");
        return resolve();
      }
      client.current = new Client({
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
          subscribe();
          resolve();
        },
        onStompError: (frame) => {
          console.error(frame);
          setConnected(false);
          reject(frame);
        },
      });
      client.current.activate();
    });
  }, [connected]);

  const subscribe = useCallback(() => {
    if (client.current) {
      client.current.subscribe(`/sub/rooms/${roomInfo.roomUUID}`, (message) => {
        handleMessage(JSON.parse(message.body));
      });
    }
  }, [roomInfo.roomUUID]);

  const disconnect = useCallback(() => {
    if (client.current) {
      client.current.deactivate();
      setConnected(false);
    }
  }, []);

  const handleMessage = useCallback((message) => {
    console.log(message.type);
    switch (message.type) {
      case "CHAT_RECEIVED":
        handleChatLogs(message);
        break;
      case "ROOM_UPDATE":
        updateRoomStatus(message);
        break;
      case "AVATAR_POSITION":
        handleAvatarPosition(message);
        break;
      case "ROOM_INFO_UPDATE":
        handleRoomInfoUpdate(message);
        break;
      case "DEPARTURE_UPDATE":
        handleDepartureUpdate(message);
        break;
      case "ROOM_CENTER_UPDATE":
        handleRoomCenterUpdate(message);
        break;
      case "ROOM_PAGE_UPDATE":
        handleRoomPageUpdate(message);
        break;
      case "GAME_CENTER_UPDATE":
        handleGameCenterUpdate(message);
        break;
      case "AROUND_STATIONS":
        handleGetAroundStations(message);
        break;
      case "GAME_SESSION_READY":
        handleGameSessionReady(message);
        break;
      case "CENTER_HISTORY":
        handleCenterHistory(message);
        break;
      case "GAME_READY":
        handleGameReady(message);
        break;
      case "GAME_END":
        handleGameEnd(message);
        break;
      case "GAME_WINNER":
        handleGameWinner(message);
        break;
      case "GAME_COUNTDOWN":
        handleGameCountdown(message);
        break;
      case "GAME_START":
        handleGameStart(message);
        break;
      case "GAME_RESULT_APPLY":
        handleGameResultApply(message);
        break;
      case "GAME_RESET":
        handleGameReset(message);
        break;
      case "HOST_FIND_CENTER":
        handleHostFindCenter(message);
        break;
      case "GAME_NEXT_ROUND":
        handleNextRound(message);
      default:
        console.error("Unknown message type:", message.type);
    }
  }, []);

  const sendNextRound = ({ gameRoundUUID, currentRound, totalRound }) => {
    client.current.publish({
      destination: `/pub/game/round.next`,
      body: JSON.stringify({ gameRoundUUID, currentRound, totalRound }),
    });
  };

  const handleNextRound = ({ next }) => {
    if (next === "nextRound") {
      setCurrentRound((prev) => (prev += 1));
    } else {
      setCurrentRound(1);
    }
    setRoomPage(next);
  };

  const handleHostFindCenter = ({ isFindCenterLoading }) => {
    setIsFindCenterLoading(isFindCenterLoading);
  };

  // 최종 장소 리셋
  const sendReset = ({ gameSessionUUID }) => {
    client.current.publish({
      destination: `/pub/game/session.station`,
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

  // 최종 장소 기록에 반영
  const sendFinalStation = ({ finalStationName }) => {
    client.current.publish({
      destination: `/pub/game/session.station`,
      body: JSON.stringify({ gameSessionUUID, finalStationName }),
    });
    console.log("hi");
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
    setIsHistoryLoading(false);
  };

  const handleGameSessionReady = ({ gameSessionUUID, roundCnt }) => {
    setTotalRound(roundCnt);
    setGameSessionUUID(gameSessionUUID);
  };

  // 게임 라운드 설정
  const sendGameRound = ({ roundCnt, roomUUID, finalStationName }) => {
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
  };

  const handleRoomPageUpdate = ({ roomNextPage, gameId }) => {
    setSelectedGame(gameId);
    setRoomPage(roomNextPage);
  };

  const handleRoomCenterUpdate = ({ roomCenterStart, attendees }) => {
    setRoomInfo((prev) => ({
      ...prev,
      centerPlace: roomCenterStart,
      attendees,
    }));
    setRoundCenter(roomCenterStart);
    setIsFindCenterLoading(false);
  };

  const handleDepartureUpdate = ({ attendeeUUID, address, lat, lon }) => {
    setRoomInfo((prevRoomInfo) => {
      const updatedAttendees = prevRoomInfo.attendees.map((attendee) =>
        attendee.attendeeUUID === attendeeUUID
          ? { ...attendee, address, lat, lon }
          : attendee,
      );
      return { ...prevRoomInfo, attendees: updatedAttendees };
    });
  };

  const handleRoomInfoUpdate = ({ meetingDate }) => {
    setRoomInfo((prev) => ({
      ...prev,
      meetingDate,
    }));
  };

  const sendChat = useCallback(({ content }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/chat/send`,
        body: JSON.stringify({ content }),
      });
    }
  }, []);

  const handleChatLogs = useCallback(
    (message) => {
      const { attendeeUUID, content, createdAt } = message;
      const attendant = roomInfo.attendees.find(
        (attendee) => attendee.attendeeUUID === attendeeUUID,
      );
      const nickname = attendant ? attendant.nickname : "Unknown";
      const newChatLog = {
        attendeeUUID,
        nickname,
        content,
        createdAt,
      };
      setChatLogs((prevChatLogs) => [...prevChatLogs, newChatLog]);
      console.log(message);
    },
    [roomInfo.attendees, setChatLogs],
  );

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
    connected,
    chatLogs,
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
  };
};

export default useWs;
