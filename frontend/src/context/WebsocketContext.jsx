import React, { createContext, useState, useContext } from "react";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  return (
    <WebSocketContext.Provider
      value={{ client, setClient, connected, setConnected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
