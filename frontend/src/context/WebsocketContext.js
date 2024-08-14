import { createContext, useContext, useMemo, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext({});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const client = useRef(null);
  const connected = useRef(false);

  const connect = () => {
    return new Promise((resolve, reject) => {
      if (connected.current) {
        console.log("Already connected");
        return resolve();
      }
      if (client.current) {
        client.current.deactivate();
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

  const sendGame = ({ newBottom }) => {
    if (client.current) {
      client.current.publish({
        destination: `/pub/game/updatePosition`,
        body: JSON.stringify({ bottom: newBottom }),
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
      connected,
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
