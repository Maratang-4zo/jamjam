import {useCallback, useEffect, useRef, useState} from "react";
import {OpenVidu} from "openvidu-browser";
import axios from "axios";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";

function Han() {
    // const APPLICATION_SERVER_URL = "http://localhost:8080/";
    const APPLICATION_SERVER_URL = "https://jjam.shop/";

    // const API_BASE_URL = "http://localhost:8080/";
    const API_BASE_URL = "https://jjam.shop/";

    axios.defaults.withCredentials = true;

    const sessionRef = useRef(null);
    const ovRef = useRef(null);
    const [sessionId, setSessionId] = useState("f64fd068-647a-4be1-a7d1-7bdc55740093");
    const [inputSessionId, setInputSessionId] = useState("");
    const roomUUID = useRef("f64fd068-647a-4be1-a7d1-7bdc55740093");
    const attendeeUUID = useRef("ec163708-0062-4c8c-9038-14f740b4affc");
    const gameSessionUUID = useRef(null);
    const gameRoundUUID = useRef(null);
    const [connected, setConnected] = useState(false);
    const [chat, setChat] = useState('');
    const [chatLogs, setChatLogs] = useState([]);
    const [gameLogs, setGameLogs] = useState([]);
    const client = useRef({});
    const [at, setAt] = useState(null);

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
            roomUUID.current = inputSessionId;
            await joinSession(roomUUID.current);
            setInputSessionId(""); // 입력 필드 초기화

    };

    const joinSession = useCallback(async (existingSessionId = null) => {
        // initSession();

        // getToken(existingSessionId).then((token) => {
        //     if (sessionRef.current && ovRef.current) {
        //         sessionRef.current
        //             .connect(token)
        //             .then(() => {
        //                 const newPublisher = ovRef.current.initPublisher("publisher");
        //                 sessionRef.current.publish(newPublisher);
        //             })
        //             .catch((error) => {
        //                 console.log(
        //                     "There was an error connecting to the session:",
        //                     error.code,
        //                     error.message,
        //                 );
        //             });
        //     }
        // });


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
                handleStompError(frame);
            },
            onWebSocketError: evt => {
                handleWebSocketError(evt);

            },
            onWebSocketClose: evt => {
                handleWebSocketClose(evt);
            },
        });


        client.current.activate();
    }

    const handleWebSocketError = (error) => {
        alert('WebSocket 연결에 실패했습니다.');
        // 재연결 시도 중지
        client.current.deactivate();
    };

    const handleWebSocketClose = (event) => {
        if (event.code === 1006) { // 비정상적인 종료 코드
            alert('WebSocket 연결이 비정상적으로 종료되었습니다.');
            // 재연결 시도 중지
            client.current.deactivate();
        }
        alert(event.code)
        client.current.deactivate();
    };

    const handleStompError = (frame) => {
        if (frame.headers && frame.headers['message']) {
            alert(`Handshake 실패: ${frame.headers['message']}`);
        } else {
            alert('Handshake 실패: 알 수 없는 오류');
        }
        // 재연결 시도 중지
        client.current.deactivate();
    };

    const subscribe = () => {
        client.current.subscribe(`/sub/rooms/${roomUUID.current}`, (message) => {
            handleMessage(message);
        }, null, {});

        client.current.subscribe(`/user/sub/errors`, (message) => {
            alert(message.body);
        })
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
            case "GAME_SESSION_READY":
                setSessionReady(body);
                break;
            case "GAME_READY":
                setGameReady(body);
                break;
            case "GAME_COUNTDOWN":
                setGameCountdown(body);
                break;
            case "GAME_START":
                setGameStart(body);
                break;
            case "GAME_PLAY":
                setGamePlay(body);
                break;
            case "GAME_END":
                setGameEnd(body);
                break;
            case "GAME_WINNER":
                setGameWinner(body);
                break;
            case "GAME_CENTER_UPDATE":
                setGameCenterUpdate(body);
                break;
            case "CENTER_HISTORY":
                setCenterHistory(body);
                break;
            case "GAME_RESULT_APPLY":
                setGameResultApply(body);
                break;
            case "GAME_RESET":
                setGameReset(body);
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
    const setGameSession = () => {
        client.current.publish({
            destination: `/pub/game/session.setting`,
            body: JSON.stringify({
                roundCnt: 3,
                roomUUID: roomUUID.current,
                finalStationName: "이수역"
            })
        })
    }
    const setSessionReady = (body) => {
        gameSessionUUID.current = body.gameSessionUUID;
        setGameLogs(prev => [...prev, "gameSessionUUID: "+gameSessionUUID.current])
    }
    const setRound = () => {
        client.current.publish({
            destination: `/pub/game/round.setting`,
            body: JSON.stringify({
                round: 1,
                gameId: 1,
                gameSessionUUID: gameSessionUUID.current,
                roomUUID: roomUUID.current,
                stationName: "이수역"
            })
        })
    }
    const setGameReady = (body) => {
        gameRoundUUID.current = body.gameRoundUUID;
        setGameLogs(prev => [...prev, "gameRoundUUID: "+gameRoundUUID.current])
    }
    const gameStart = () => {
        client.current.publish({
            destination: `/pub/game/round.start`,
            body: JSON.stringify({
                gameRoundUUID: gameRoundUUID.current,
                roomUUID: roomUUID.current
            })
        })
    }
    const setGameCountdown = (body) => {
        setGameLogs(prev => [...prev, "gameCountdown: "+body.countdown])
    }
    const setGameStart = (body) => {
        setGameLogs(prev => [...prev, "gameStart: "+body.gameRoundUUID])
    }
    const gamePlay = () => {
        client.current.publish({
            destination: `/pub/game/round.play`,
            body: JSON.stringify({
                gameRoundUUID: gameRoundUUID.current,
                attendeeUUID: attendeeUUID.current,
                roomUUID: roomUUID.current,
                data: 10
            })
        })
    }
    const setGamePlay = (body) => {
        setGameLogs(prev => [...prev, "gamePlay: "+body.gameRoundUUID+" attendeeUUID: "+body.attendeeUUID+" data: "+body.data])
    }
    const setGameEnd = (body) => {
        setGameLogs(prev => [...prev, "gameEnd: "+body.gameRoundUUID])
    }
    const setGameWinner = (body) => {
        setGameLogs(prev => [...prev, "gameWinner: "+body.gameRoundUUID+" attendeeUUID: "+body.attendeeUUID])
    }
    const gameRoundStation = () => {
        client.current.publish({
            destination: `/pub/game/round.station`,
            body: JSON.stringify({
                gameRoundUUID: gameRoundUUID.current,
                roomUUID: roomUUID.current,
                roundStationName: "역삼역"
            })
        })
    }
    const setGameCenterUpdate = (body) => {
        setGameLogs(prev => [...prev, "gameCenterUpdate: "+body.gameRoundUUID+" data: "+body])
    }
    const setCenterHistory = (body) => {
        setGameLogs(prev => [...prev, "centerHistory: "+body])
    }
    const gameRoundHistory = () => {
        client.current.publish({
            destination: `/pub/game/session.end`,
            body: JSON.stringify({
                gameSessionUUID: gameSessionUUID.current
            })
        })
    }
    const gamesessionStation = () => {
        client.current.publish({
            destination: `/pub/game/session.station`,
            body: JSON.stringify({
                gameSessionUUID: gameSessionUUID.current,
                finalStationName: "이수역역",
                roomUUID: roomUUID.current

            })
        })
    }
    const setGameResultApply = (body) => {
        setGameLogs(prev => [...prev, "gameResultApply: "+body.gameSessionUUID+" finalStationName: "+body.finalStationName])
    }
    const gameReset = () => {
        client.current.publish({
            destination: `/pub/game/session.reset`,
            body: JSON.stringify({
                roomUUID: roomUUID.current,
                gameSessionUUID: gameSessionUUID.current
            })
        })
    }
    const setGameReset = (body) => {
        setGameLogs(prev => [...prev, "gameReset: "+body.gameSessionUUID])
    }
    const cookietest = () => {
        axios.get(`${API_BASE_URL}api/test/attendees/${at}`,{}).then((res)=>{
            console.log(res)
            alert("쉿 >.O 이건 비밀친구")
        })
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
                    placeholder="룸UUID 입력"
                />
                <button type="submit">룸UUID 바꿔서 들어가기</button>
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
                당신을 위한 쿠키를 세팅해주겠다.
                <input
                    type="text"
                    value={at}
                    onChange={(e) => setAt(e.target.value)}
                    placeholder="attendeeId 입력"
                />
                <button onClick={cookietest}>attendee PK로 토큰 생성해보즈아</button>
            </div>
            <div>
                <div>
                    <button onClick={setGameSession}>세션만들기</button>
                    <button onClick={setRound}>게임라운드선택</button>
                    <button onClick={gameStart}>게임시작</button>
                    <button onClick={gamePlay}>게임플레이</button>
                    <button onClick={gameRoundStation}>중심역이동</button>
                    <button onClick={gameRoundHistory}>게임기록확인</button>
                    <button onClick={gamesessionStation}>최종게임기록반영</button>
                    <button onClick={gameReset}>게임리셋</button>
                    <div>
                        <ul>
                            {gameLogs.map((msg, idx) => (
                                <li key={idx}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                </div>
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