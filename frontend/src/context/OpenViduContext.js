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
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import { roomAtom } from "../recoil/atoms/roomState";

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
  connectionMap: {},
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
  const [connectionMap, setConnectionMap] = useState({});
  const userInfo = useRecoilValue(userInfoAtom);
  const roomInfo = useRecoilValue(roomAtom);

  useEffect(() => {
    console.log("누가 말하고 있는가", {
      currentSpeakers,
    });
  }, [currentSpeakers]);

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
      newSession.subscribe(event.stream, "subscriber");
      // 새로운 참가자의 connectionId와 attendeeUUID 매핑
      setConnectionMap((prevMap) => ({
        ...prevMap,
        [event.stream.connection.connectionId]:
          roomInfo.attendees[roomInfo.attendees.length - 1].attendeeUUID,
      }));
    });

    newSession.on("publisherStartSpeaking", (event) => {
      setCurrentSpeakers((prevSpeakers) => [
        ...prevSpeakers,
        connectionMap[event.connection.connectionId],
      ]);
    });

    newSession.on("publisherStopSpeaking", (event) => {
      setCurrentSpeakers((prevSpeakers) =>
        prevSpeakers.filter(
          (uuid) => uuid !== connectionMap[event.connection.connectionId],
        ),
      );
    });
  }, [connectionMap]);

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

    if (!ovRef.current) {
      ovRef.current = new OpenVidu();
    }

    if (!sessionRef.current) {
      sessionRef.current = ovRef.current.initSession();
    }

    try {
      await sessionRef.current.connect(token);
      const newPublisher = ovRef.current.initPublisher("publisher", {
        audioSource: undefined,
        videoSource: false,
        publishAudio: true,
        publishVideo: false,
      });
      publisherRef.current = newPublisher;
      await sessionRef.current.publish(newPublisher);

      // connectionId와 attendeeUUID 매핑
      setConnectionMap((prevMap) => ({
        ...prevMap,
        [newPublisher.stream.connection.connectionId]: userInfo.myUUID, // 실제 attendeeUUID로 교체해야 합니다
      }));

      joined.current = true;
      console.log("Successfully joined and published to session");
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
      connectionMap,
    }),
    [
      currentSpeakers,
      isMicOn,
      joinSession,
      leaveSession,
      createSession,
      createToken,
      toggleMic,
      connectionMap,
    ],
  );

  return (
    <OpenViduContext.Provider value={contextValue}>
      {children}
    </OpenViduContext.Provider>
  );
};
