import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatAtom, roomAtom } from "../recoil/atoms/roomState";
import { playerState } from "../recoil/atoms/playerState";

const API_BASE_URL = "https://jjam.shop";

const useWs = () => {
  const [connected, setConnected] = useState(false);
  const [chatLogs, setChatLogs] = useRecoilState(chatAtom);
  const client = useRef({});
  const roomInfo = useRecoilValue(roomAtom);
  const [players, setPlayers] = useRecoilState(playerState);

  const connect = () => {
    return new Promise((resolve, reject) => {
      if (connected) {
        console.log("Already connected");
        return resolve();
      }
      client.current = new Client({
        webSocketFactory: () => new SockJS(API_BASE_URL + "/api/ws"),
        debug: function (str) {
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
  };

  const subscribe = () => {
    client.current.subscribe(`/sub/rooms/${roomInfo.roomUUID}`, (message) => {
      handleMessage(JSON.parse(message.body));
    });
  };

  const disconnect = () => {
    if (client.current) {
      client.current.deactivate();
      setConnected(false);
    }
  };

  const handleMessage = (message) => {
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
  };

  const sendChat = ({ content }) => {
    client.current.publish({
      destination: `/pub/chat/send`,
      body: JSON.stringify({
        content,
      }),
    });
  };

  const handleChatLogs = (message) => {
    const { attendeeUUID, content, createdAt } = message;
    const attendant = roomInfo.attendees.find(
      (attendee) => attendee.attendeeUUID === attendeeUUID,
    );
    const nickname = attendant.nickname;
    const n = {
      attendeeUUID,
      nickname,
      content,
      createdAt,
    };
    setChatLogs((prevChatLogs) => [...prevChatLogs, n]);
    console.log(message);
  };

  const updateRoomStatus = (message) => {
    console.log("Room status updated:", message);
  };

  const handleAvatarPosition = (message) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((player) =>
        player.attendeeUUID === message.attendeeUUID
          ? { ...player, bottom: message.bottom }
          : player,
      );
      return updatedPlayers;
    });
  };

  const sendGame = ({ newBottom }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/updatePosition`,
        body: JSON.stringify({ bottom: newBottom }),
      });
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

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
