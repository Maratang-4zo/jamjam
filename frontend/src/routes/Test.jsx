import React, { useRef, useState, useEffect, useCallback } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";

const APPLICATION_SERVER_URL = "https://jjam.shop/";

const OpenViduExample = () => {
  const ovRef = useRef(null);
  const sessionRef = useRef(null);
  const publisherRef = useRef(null);

  const [subscribers, setSubscribers] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // 1. 세션 생성 및 토큰 발급
  const createSession = useCallback(async () => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/wr/rooms/",
      );
      const sessionId = response.data; // 서버가 반환한 세션 ID
      setSessionId(sessionId);
      return createToken(sessionId);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  }, []);

  const createToken = useCallback(async (sessionId) => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/wr/rooms/token",
        { sessionId },
      );
      return response.data.token;
    } catch (error) {
      console.error("Error creating token:", error);
    }
  }, []);

  // 2. 세션 참여
  const joinSession = useCallback(async () => {
    const token = await createSession(); // 세션 생성 및 토큰 발급

    ovRef.current = new OpenVidu();
    sessionRef.current = ovRef.current.initSession();

    // 구독된 스트림 관리
    sessionRef.current.on("streamCreated", (event) => {
      const subscriber = sessionRef.current.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    // 스트림이 종료되면 제거
    sessionRef.current.on("streamDestroyed", (event) => {
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((sub) => sub !== event.stream.streamManager),
      );
    });

    try {
      await sessionRef.current.connect(token);

      publisherRef.current = ovRef.current.initPublisher(undefined, {
        audioSource: true,
        videoSource: true,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
      });

      sessionRef.current.publish(publisherRef.current);
    } catch (error) {
      console.error("Error connecting to the session:", error);
    }
  }, [createSession]);

  // 3. 세션 떠나기
  const leaveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
    sessionRef.current = null;
    publisherRef.current = null;
    setSubscribers([]);
  }, []);

  // 4. 마이크 및 카메라 제어
  const toggleMic = useCallback(() => {
    if (publisherRef.current) {
      const audioEnabled = publisherRef.current.stream.audioActive;
      publisherRef.current.publishAudio(!audioEnabled);
      setIsMicOn(!audioEnabled);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (publisherRef.current) {
      const videoEnabled = publisherRef.current.stream.videoActive;
      publisherRef.current.publishVideo(!videoEnabled);
      setIsCameraOn(!videoEnabled);
    }
  }, []);

  useEffect(() => {
    // 컴포넌트가 언마운트 될 때 세션에서 나가기
    return () => {
      leaveSession();
    };
  }, [leaveSession]);

  return (
    <div>
      <div>
        <button onClick={joinSession}>Join Session</button>
        <button onClick={leaveSession}>Leave Session</button>
        <button onClick={toggleMic}>{isMicOn ? "Mute" : "Unmute"}</button>
        <button onClick={toggleCamera}>
          {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
        </button>
      </div>
      <div id="video-container">
        <div id="publisher-container">
          {/* 퍼블리셔 비디오를 렌더링 */}
          <video
            autoPlay={true}
            ref={(video) =>
              video &&
              publisherRef.current &&
              publisherRef.current.addVideoElement(video)
            }
          />
        </div>
        <div id="subscribers-container">
          {subscribers.map((subscriber, index) => (
            <div key={index}>
              {/* 구독된 스트림을 렌더링 */}
              <video
                autoPlay={true}
                ref={(video) => video && subscriber.addVideoElement(video)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenViduExample;
