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
import { getCookie, setCookie } from "../utils/Cookies";

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

  useEffect(() => {
    console.log("오픈비두 정보들:", {
      currentSpeakers,
      sessionRef,
      sessionId,
      subscribers,
    });
  }, [sessionRef, sessionId, subscribers]);

  const leaveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
    joined.current = false;
  }, []);

  const initSession = useCallback(() => {
    if (sessionRef.current) return;

    const newOv = new OpenVidu({
      audioSource: true,
      videoSource: false,
    });
    const newSession = newOv.initSession();

    ovRef.current = newOv;
    sessionRef.current = newSession;

    newSession.on("streamCreated", (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      subscriber.stream.play();
      console.log("Subscriber added:", subscriber);
      console.log(
        "isSubscribeToRemote:",
        subscriber.stream.isSubscribeToRemote,
      );
    });

    newSession.on("streamDestroyed", (event) => {
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((sub) => sub !== event.stream.streamManager),
      );
    });

    newSession.on("publisherStartSpeaking", (event) => {
      console.log("말하는중", event);
      setCurrentSpeakers((prevSpeakers) => [
        ...prevSpeakers,
        event.connection.data,
      ]);
    });

    newSession.on("publisherStopSpeaking", (event) => {
      setCurrentSpeakers((prevSpeakers) =>
        prevSpeakers.filter((id) => id !== event.connection.data),
      );
    });
  }, []);

  const createSession = useCallback(async () => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/wr/rooms",
      );
      const newSessionId = response.data.sessionId; // Assume the server returns the sessionId
      console.log(response.data);
      setSessionId(newSessionId);
      return createToken(newSessionId);
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }, []);

  const createToken = useCallback((sessionId) => {
    return new Promise((resolve, reject) => {
      axios
        .post(APPLICATION_SERVER_URL + "api/wr/rooms/token", { sessionId })
        .then((res) => {
          const token = res.data.token;
          setCookie("OpenviduToken", token);
          setCookie("OpenviduSessionId", sessionId);
          resolve(token);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const joinSession = useCallback(
    async (givenSessionId = null) => {
      initSession();

      let token = getCookie("OpenviduToken");
      let storedSessionId = getCookie("OpenviduSessionId");

      if (givenSessionId) {
        setSessionId(givenSessionId);
      } else if (storedSessionId) {
        setSessionId(storedSessionId);
      }

      if (!token || (givenSessionId && givenSessionId !== storedSessionId)) {
        try {
          token = await createToken(givenSessionId || storedSessionId);
        } catch (error) {
          console.error("Failed to create token:", error);
          return;
        }
      }

      try {
        await sessionRef.current.connect(token);

        const newPublisher = ovRef.current.initPublisher("publisher", {
          audioSource: undefined,
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
        console.log("Successfully joined session", sessionId);
      } catch (error) {
        console.error(
          "Error connecting to the session:",
          error.code,
          error.message,
        );
      }
    },
    [createToken, initSession],
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  const toggleMic = useCallback(() => {
    if (publisherRef.current) {
      const audioEnabled = publisherRef.current.stream.audioActive;
      publisherRef.current.publishAudio(!audioEnabled);
      setIsMicOn(!audioEnabled);
    }
  }, []);

  useEffect(() => {
    console.log("Mic state changed:", isMicOn);
  }, [isMicOn]);

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
    ],
  );

  return (
    <OpenViduContext.Provider value={contextValue}>
      {children}
    </OpenViduContext.Provider>
  );
};
