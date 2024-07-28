import NavBarUp from "../components/fixed/NavBarUp";
import SockJS from "sockjs-client"
import {useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";


function Ws() {
    const API_BASE_URL = "http://localhost:8080";
    const roomId = 1

    const [connected, setConnected] = useState(false);
    const [chat, setChat] = useState('');
    const [chatLogs, setChatLogs] = useState([]);
    const client = useRef({});

    const connect = () => {
        client.current = new Client({
            webSocketFactory: () => new SockJS(API_BASE_URL + "/ws"),
            debug: function(str) {
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
                console.error(frame)
            }
        });
        client.current.activate();
    }

    const subscribe = () => {
        setConnected(true);
        client.current.subscribe(`/sub/rooms/${roomId}`, (message) => {
           handleMessage(JSON.parse(message.body));
        });
    }

    const disconnect = () => {
        if(client.current) {
            client.current.deactivate();
            setConnected(false);
        }
    }

    const handleMessage = (message) => {
        console.log(message.type)
        switch (message.type) {
            case 'CHAT_RECEIVED':
                displayChatLogs(message);
                break;
            case 'ROOM_UPDATE':
                updateRoomStatus(message);
                break;
            default:
                console.error('Unknown message type:', message.type);
        }
    }

    const sendChat = () => {
        client.current.publish({
            destination: `/pub/${roomId}/chat/send`,
            body: JSON.stringify({
                nickname: "hi",
                content: chat,
            })
        })
        setChat('');
    }

    const displayChatLogs = (message) => {
        console.log("hihi");
        const n = message.nickname + ": " + message.content;
        setChatLogs(prevChatLogs => [...prevChatLogs, n]);
        console.log(message)
    }

    const updateRoomStatus = (message) => {
        console.log('Room status updated:', message);
    }

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [])


    return (
        <>
            <NavBarUp/>
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

    )
}

export default Ws;