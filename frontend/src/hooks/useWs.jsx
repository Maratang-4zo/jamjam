import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatAtom, roomAtom } from "../recoil/atoms/roomState";
import { playerState } from "../recoil/atoms/playerState";

const API_BASE_URL = "https://jjam.shop";

const useWs = () => {
  const [connected, setConnected] = useState(false);
  const [chatLogs, setChatLogs] = useRecoilState(chatAtom);
  const client = useRef(null); // 초기화 null로 변경
  const roomInfo = useRecoilValue(roomAtom);
  const [players, setPlayers] = useRecoilState(playerState);

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
      default:
        console.error("Unknown message type:", message.type);
    }
  }, []);

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
  }, [connect, disconnect]);

  return {
    connected,
    chatLogs,
    sendChat,
    connect,
    subscribe,
    disconnect,
    handleMessage,
    sendGame,
  };
};

export default useWs;
