import {useCallback, useEffect, useRef, useState} from "react";
import {OpenVidu} from "openvidu-browser";
import axios from "axios";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";

function Han(){
    // const APPLICATION_SERVER_URL = "http://localhost:8080/";
    const APPLICATION_SERVER_URL = "https://jjam.shop/";

    // const API_BASE_URL = "http://localhost:8080/";
    const API_BASE_URL = "https://jjam.shop/";

    axios.defaults.withCredentials = true;

    const sessionRef = useRef(null);
    const ovRef = useRef(null);
    const [sessionId, setSessionId] = useState("324e6cea-ee55-49a4-9154-b14351f32539");
    const [inputSessionId, setInputSessionId] = useState("");
    const roomUUID = useRef("324e6cea-ee55-49a4-9154-b14351f32539");
    const attendeeUUID = useRef("30c4e699-0ca9-4680-82b1-40b9fdfd0e6a");

    const [connected, setConnected] = useState(false);
    const [chat, setChat] = useState('');
    const [chatLogs, setChatLogs] = useState([]);
    const client = useRef({});

    const leaveSession = useCallback(() => {
        if (sessionRef.current) {
            sessionRef.current.disconnect();
        }
    }, []);

    const handleInputChange = (event) => {
        setInputSessionId(event.target.value);
    };

    const initSession = useCallback(() => {
        const newOv = new OpenVidu();
        const newSession = newOv.initSession();

        ovRef.current = newOv;
        sessionRef.current = newSession;

        newSession.on("streamCreated", function (event) {
            newSession.subscribe(event.stream, "subscriber");
        });
    }, []);

    // openvidu
    const createSession = async () => {
        const res = await axios.post(APPLICATION_SERVER_URL + "api/wr/rooms", null, {withCredentials: true});
        return res.data.sessionId;
    };

    const createToken = (sessionId) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    APPLICATION_SERVER_URL + "api/wr/rooms/token",
                    null,
                    {withCredentials: true}
                )
                .then((res) => {
                    resolve(res.data.token);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    const getToken = async (existingSessionId = null) => {
        const targetSessionId = existingSessionId || (await createSession());
        // setSessionId(targetSessionId);
        return await createToken(targetSessionId);
    };
    //
    // useEffect(async () => {
    //     // const sg = window.prompt("gdgd", "c2999be7-65c6-4c55-b2a5-4b85b5d76c5e");
    //     // attendeeUUID.current = sg;
    //     // if (attendeeUUID.current.startsWith("c")) {
    //     //     await joinSession()
    //     // } else {
    //     //     await joinSession(roomUUID.current);
    //     // }
    //
    //
    //     connect();
    //
    //
    //     const handleBeforeUnload = () => {
    //         // 새로고침, 창 닫기 막기 추가 여부 논의
    //
    //         if (sessionRef.current) {
    //             sessionRef.current.disconnect();
    //         }
    //     };
    //
    //     window.addEventListener("beforeunload", handleBeforeUnload);
    //
    //     return () => {
    //         window.removeEventListener("beforeunload", handleBeforeUnload);
    //         if (sessionRef.current) {
    //             sessionRef.current.disconnect();
    //             disconnect();
    //         }
    //     };
    // }, [connected]);

    const joinExistingSession = async (event) => {
        event.preventDefault();
            attendeeUUID.current = inputSessionId;
            await joinSession(roomUUID.current);
            setInputSessionId(""); // 입력 필드 초기화

    };

    const joinSession = useCallback(async (existingSessionId = null) => {
        initSession();

        getToken(existingSessionId).then((token) => {
            if (sessionRef.current && ovRef.current) {
                sessionRef.current
                    .connect(token)
                    .then(() => {
                        const newPublisher = ovRef.current.initPublisher("publisher");
                        sessionRef.current.publish(newPublisher);
                    })
                    .catch((error) => {
                        console.log(
                            "There was an error connecting to the session:",
                            error.code,
                            error.message,
                        );
                    });
            }
        });



        connect();


        const handleBeforeUnload = (e) => {
            // 새로고침, 창 닫기 막기 추가 여부 논의
            e.preventDefault();

            if (sessionRef.current) {
                sessionRef.current.disconnect();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (sessionRef.current) {
                sessionRef.current.disconnect();
                disconnect();
            }
        };
    }, []);


    const connect = () => {
        client.current = new Client({
            webSocketFactory: () => new SockJS(API_BASE_URL + "api/ws"),
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
            },
        });


        client.current.activate();
    }

    const subscribe = () => {
        client.current.subscribe(`/sub/rooms/${roomUUID.current}`, (message) => {
            handleMessage(message);
        }, null, {});
    }

    const disconnect = () => {
        if(client.current) {
            client.current.deactivate();
        }
    }

    const handleMessage = (message) => {
        console.log(message.type)
        const body = JSON.parse(message.body)
        switch (message.headers["type"]) {
            case 'CHAT_RECEIVED':
                displayChatLogs(body);
                break;
            case 'ROOM_UPDATE':
                updateRoomStatus(body);
                break;
            default:
                console.error('Unknown message type:', message.type);
        }
    }

    const sendChat = () => {
        client.current.publish({
            destination: `/pub/chat/send`,
            body: JSON.stringify({
                nickname: attendeeUUID.current,
                content: chat,
            }),
            headers: {
                roomUUID: roomUUID.current,
                attendeeUUID: attendeeUUID.current
            }
        })
        setChat('');
    }

    const displayChatLogs = (message) => {
        console.log("hihi");
        const n = message.attendeeUUID + ": " + message.content;
        setChatLogs(prevChatLogs => [...prevChatLogs, n]);
        console.log(message)
    }

    const updateRoomStatus = (message) => {
        console.log('Room status updated:', message);
    }

    const gogo = ()  => {
        setConnected(true)
    }


    return (

        <>
            <h1>방 만들기</h1>
            <button onClick={() => joinSession()}>켜져라얍</button>
            <form onSubmit={joinExistingSession}>
                <input
                    type="text"
                    value={inputSessionId}
                    onChange={handleInputChange}
                    placeholder="참여할 세션 ID 입력"
                />
                <button type="submit">기존 방 참여하기</button>
            </form>
            {roomUUID.current && <p>현재 세션 ID: {roomUUID.current}</p>}
            <div id="session">
                <h1>세션 헤더</h1>
                <input type="button" onClick={leaveSession} value="LEAVE"/>
                <div>
                    <div id="publisher">
                        <h3>YOU</h3>
                    </div>
                    <div id="subscriber">
                        <h3>OTHERS</h3>
                    </div>
                </div>
            </div>
    <div>
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
    </div>
    </>
)
}

export default Han;