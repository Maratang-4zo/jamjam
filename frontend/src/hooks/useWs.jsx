import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const API_BASE_URL = "http://localhost:8080";

const useWs = () => {
  const [connected, setConnected] = useState(false);
  const [chat, setChat] = useState("");
  const [chatLogs, setChatLogs] = useState([]);
  const client = useRef({});
  const [roomUUID, setRoomUUID] = useState(null);
  const [attendeeUUID, setAttendeeUUID] = useState(null);

  const connect = (roomUUID, attendeeUUID) => {
    setRoomUUID(roomUUID);
    setAttendeeUUID(attendeeUUID);
    client.current = new Client({
      webSocketFactory: () => new SockJS(API_BASE_URL + "/ws"),
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      onConnect: () => {
        console.log("Connected");
        subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });
    client.current.activate();
  };

  const subscribe = () => {
    setConnected(true);
    client.current.subscribe(
      `/topic/rooms/${roomUUID}`,
      (message) => {
        handleMessage(JSON.parse(message.body));
      },
      {
        headers: {
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
        displayChatLogs(message);
        break;
      case "ROOM_UPDATE":
        updateRoomStatus(message);
        break;
      default:
        console.error("Unknown message type:", message.type);
    }
  };

  const sendChat = () => {
    client.current.publish({
      destination: `/app/${roomUUID}/chat/send`,
      body: JSON.stringify({
        nickname: "hi",
        content: chat,
      }),
    });
    setChat("");
  };

  const displayChatLogs = (message) => {
    console.log("hihi");
    const n = message.nickname + ": " + message.content;
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
    chat,
    chatLogs,
    setChat,
    sendChat,
    connect,
    disconnect,
  };
};

export default useWs;
