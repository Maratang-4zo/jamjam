import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

const OpenViduContext = React.createContext({
  sessionRef: null,
  ovRef: null,
  publisherRef: null,
  joined: false,
  currentSpeakers: [],
  joinSession: () => {},
  leaveSession: () => {},
  createSession: () => {},
  createToken: () => {},
  toggleMic: () => {},
  isMicOn: true,
  sessionId: null,
  setSessionId: () => {},
  error: null,
});

export const useOpenVidu = () => useContext(OpenViduContext);

export const OpenViduProvider = ({ children }) => {
  const APPLICATION_SERVER_URL = "https://jjam.shop/";
  const sessionRef = useRef(null);
  const ovRef = useRef(null);
  const publisherRef = useRef(null);
  const joined = useRef(false);
  const [currentSpeakers, setCurrentSpeakers] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("오픈비두 정보들:", {
      currentSpeakers,
      sessionRef: sessionRef.current,
      sessionId,
      subscribers,
    });
  }, [currentSpeakers, sessionId, subscribers]);

  const leaveSession = useCallback(() => {
    if (!sessionRef.current || !joined.current) return; // 가드 추가

    console.log("Leaving session");
    subscribers.forEach((subscriber) => {
      sessionRef.current.unsubscribe(subscriber);
    });
    if (publisherRef.current) {
      sessionRef.current.unpublish(publisherRef.current);
    }
    sessionRef.current.disconnect();

    setSubscribers([]);
    publisherRef.current = null;
    joined.current = false;
    setSessionId(null);
  }, [subscribers]);

  const initSession = useCallback(() => {
    if (sessionRef.current) return Promise.resolve();

    return new Promise((resolve) => {
      const newOv = new OpenVidu();
      const newSession = newOv.initSession();

      newSession.on("sessionDisconnected", (event) => {
        console.log("Session disconnected:", event);
        leaveSession();
      });

      ovRef.current = newOv;
      sessionRef.current = newSession;
      resolve();
    });
  }, [leaveSession]);

  const createSession = useCallback(async () => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/wr/rooms",
      );
      const newSessionId = response.data.sessionId;
      if (!newSessionId) {
        throw new Error("Server did not return a sessionId");
      }
      console.log("Server response:", response.data);
      setSessionId(newSessionId);
      return newSessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      setError("Failed to create session");
      throw error;
    }
  }, []);

  const createToken = useCallback(async (sessionId) => {
    if (!sessionId) {
      throw new Error("No sessionId provided");
    }
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/wr/rooms/token",
        { sessionId },
      );
      const token = response.data.token;
      if (!token) {
        throw new Error("Server did not return a token");
      }
      return token;
    } catch (error) {
      console.error("Error creating token:", error);
      setError("Failed to create token");
      throw error;
    }
  }, []);

  const joinSession = useCallback(
    async (givenSessionId = null) => {
      try {
        await initSession();

        const finalSessionId = givenSessionId || (await createSession());
        setSessionId(finalSessionId);

        const token = await createToken(finalSessionId);

        await sessionRef.current.connect(token);

        sessionRef.current.on("streamCreated", (event) => {
          const subscriber = sessionRef.current.subscribe(
            event.stream,
            undefined,
          );
          setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        });

        sessionRef.current.on("streamDestroyed", (event) => {
          setSubscribers((prevSubscribers) =>
            prevSubscribers.filter(
              (sub) => sub.stream.streamId !== event.stream.streamId,
            ),
          );
        });

        sessionRef.current.on("publisherStartSpeaking", (event) => {
          console.log("말하는중", event);
          setCurrentSpeakers((prevSpeakers) => [
            ...prevSpeakers,
            event.connection.data,
          ]);
        });

        sessionRef.current.on("publisherStopSpeaking", (event) => {
          setCurrentSpeakers((prevSpeakers) =>
            prevSpeakers.filter((id) => id !== event.connection.data),
          );
        });

        const newPublisher = ovRef.current.initPublisher("publisher", {
          audioSource: undefined, // Use default audio input
          videoSource: false,
          publishAudio: true,
          publishVideo: false,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
        });
        publisherRef.current = newPublisher;

        await sessionRef.current.publish(newPublisher);
        console.log("Successfully published to session");

        joined.current = true;
        console.log("Successfully joined session", finalSessionId);
      } catch (error) {
        console.error(
          "Error connecting to the session:",
          error.code,
          error.message,
        );
        setError(`Failed to join session: ${error.message}`);
      }
    },
    [createSession, createToken, initSession],
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      leaveSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      leaveSession();
    };
  }, [leaveSession]);

  const toggleMic = useCallback(() => {
    if (publisherRef.current) {
      const audioEnabled = publisherRef.current.stream.audioActive;
      publisherRef.current.publishAudio(!audioEnabled);
      setIsMicOn(!audioEnabled);
    }
  }, []);

  useEffect(() => {
    if (publisherRef.current) {
      setIsMicOn(publisherRef.current.stream.audioActive);
    }
  }, [publisherRef.current]);

  const contextValue = useMemo(
    () => ({
      sessionRef,
      ovRef,
      publisherRef,
      joined,
      currentSpeakers,
      joinSession,
      leaveSession,
      createSession,
      createToken,
      toggleMic,
      isMicOn,
      sessionId,
      setSessionId,
      subscribers,
      error,
    }),
    [
      currentSpeakers,
      isMicOn,
      joinSession,
      leaveSession,
      createSession,
      createToken,
      toggleMic,
      sessionId,
      subscribers,
      error,
    ],
  );

  return (
    <OpenViduContext.Provider value={contextValue}>
      {children}
    </OpenViduContext.Provider>
  );
};
