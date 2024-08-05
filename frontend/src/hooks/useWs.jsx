import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatAtom, roomAtom } from "../recoil/atoms/roomState";

const API_BASE_URL = "https://jjam.shop/api/ws";

const useWs = () => {
  const [connected, setConnected] = useState(false);
  const [chatLogs, setChatLogs] = useRecoilState(chatAtom);
  const client = useRef({});
  const roomInfo = useRecoilValue(roomAtom);

  const connect = (roomUUID, attendeeUUID) => {
    return new Promise((resolve, reject) => {
      client.current = new Client({
        webSocketFactory: () => new SockJS(API_BASE_URL),
        connectHeaders: {
          roomUUID,
          attendeeUUID,
        },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 20000,
        heartbeatOutgoing: 20000,
        onConnect: () => {
          console.log("Connected");
          subscribe(roomUUID, attendeeUUID);
          resolve();
        },
        onStompError: (frame) => {
          console.error(frame);
          reject(frame);
        },
      });
      client.current.activate();
    });
  };

  const subscribe = (roomUUID, attendeeUUID) => {
    setConnected(true);
    client.current.subscribe(
      `/sub/rooms/${roomUUID}`,
      (message) => {
        handleMessage(JSON.parse(message.body));
      },
      {
        headers: {
          roomUUID,
          attendeeUUID,
        },
      },
    );
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
      default:
        console.error("Unknown message type:", message.type);
    }
  };

  const sendChat = ({ content, roomUUID, attendeeUUID }) => {
    client.current.publish({
      destination: `/pub/chat/send`,
      body: JSON.stringify({
        content,
      }),
      headers: {
        roomUUID,
        attendeeUUID,
      },
    });
  };

  const handleChatLogs = (message) => {
    const { attendeeUUID, content, createdAt } = message;
    const attendant = roomInfo.attendants.find(
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
  };
};

export default useWs;
