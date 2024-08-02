import React from "react";
import NavBarUp from "../components/fixed/NavBarUp";
import useWs from "../hooks/useWs"; // Adjust the path as necessary

function Ws({ roomUUID, attendeeUUID }) {
  const { connected, chat, chatLogs, setChat, sendChat } = useWs(
    roomUUID,
    attendeeUUID,
  );

  return (
    <>
      <NavBarUp />
      <div>
        <h1>Chat Room</h1>
        <div>
          {connected ? <p>Connected</p> : <p>Connecting...</p>}
          <div>
            <input
              type="text"
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              placeholder="Type a message"
            />
            <button onClick={sendChat}>Send</button>
          </div>
          <div>
            <h2>Messages</h2>
            <ul>
              {chatLogs.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Ws;
