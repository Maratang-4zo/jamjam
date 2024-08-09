import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { chatAtom, roomAtom } from "../recoil/atoms/roomState";
import { playerState, selectedGameAtom } from "../recoil/atoms/playerState";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://jjam.shop";

const useWs = () => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [chatLogs, setChatLogs] = useRecoilState(chatAtom);
  const client = useRef(null); // 초기화 null로 변경
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
  const [players, setPlayers] = useRecoilState(playerState);
  const setSelectedGame = useSetRecoilState(selectedGameAtom);

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
      case "GAME_WINNER_UPDATE":
        handleWinnerUpdate(message);
        break;
      case "GAME_CENTERPLACE_UPDATE":
        handleGameCenterUpdate(message);
        break;
      default:
        console.error("Unknown message type:", message.type);
    }
  }, []);

  const sendUpdatePage = ({ roomNextPage, gameId }) => {
    client.current.publish({
      destination: `/pub/page`,
      body: JSON.stringify({
        roomNextPage,
        gameId,
      }),
    });
  };

  const handleWinnerUpdate = (message) => {
    return;
  };

  const handleGameCenterUpdate = (message) => {
    setRoomInfo((prev) => ({
      ...prev,
      centerPlace: message,
    }));
  };

  const handleRoomPageUpdate = ({ roomNextPage, roomUUID, gameId }) => {
    if (roomNextPage === "game") {
      setSelectedGame(gameId);
      navigate(`room/${roomUUID}/game`);
    } else if (roomNextPage === "gamechoice") {
      navigate(`room/${roomUUID}/gamechoice`);
    } else if (roomNextPage === "finalresult") {
      navigate(`room/${roomUUID}/result`);
    } else if (roomNextPage === "main") {
      navigate(`room/${roomUUID}`);
    }
  };

  const handleRoomCenterUpdate = ({ roomCenterStart, attendees }) => {
    setRoomInfo((prev) => ({
      ...prev,
      centerPlace: roomCenterStart,
      attendees,
    }));
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

  useEffect(() => {
    connect().catch((error) => {
      console.error("WebSocket connection failed:", error);
    });
    return () => {
      disconnect();
    };
  }, []);

  return {
    connected,
    chatLogs,
    connect,
    subscribe,
    disconnect,
    handleMessage,
    sendChat,
    sendGame,
    sendUpdatePage,
  };
};

export default useWs;
