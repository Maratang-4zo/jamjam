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

  //테스트용
  useEffect(() => {
    console.log("오픈비두 정보들:", {
      currentSpeakers,
      sessionRef,
    });
  }, [currentSpeakers, sessionRef]);

  const leaveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
    joined.current = false;
  }, []);

  const initSession = useCallback(() => {
    if (sessionRef.current) return;

    const newOv = new OpenVidu();
    const newSession = newOv.initSession();

    ovRef.current = newOv;
    sessionRef.current = newSession;

    newSession.on("streamCreated", function (event) {
      console.log("신입받아라");
      newSession.subscribe(event.stream, "subscriber");
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
    await axios.post(APPLICATION_SERVER_URL + "api/wr/rooms");
    return createToken();
  }, []);

  const createToken = useCallback(() => {
    return new Promise((resolve, reject) => {
      axios
        .post(APPLICATION_SERVER_URL + "api/wr/rooms/token")
        .then((res) => {
          const token = res.data.token;
          setCookie("OpenviduToken", token);
          resolve(token);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const joinSession = useCallback(async () => {
    initSession();

    let token = getCookie("OpenviduToken");

    if (!token) {
      try {
        token = await createToken();
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

      sessionRef.current.on("streamCreated", (event) => {
        console.log("New stream created:", event.stream.streamId);
        sessionRef.current.subscribe(event.stream, "subscriber");
      });

      joined.current = true;
      console.log("Successfully joined session");
    } catch (error) {
      console.error(
        "Error connecting to the session:",
        error.code,
        error.message,
      );
    }
  }, [createToken, initSession]);

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
    }),
    [
      currentSpeakers,
      isMicOn,
      joinSession,
      leaveSession,
      createSession,
      createToken,
      toggleMic,
    ],
  );

  return (
    <OpenViduContext.Provider value={contextValue}>
      {children}
    </OpenViduContext.Provider>
  );
};
