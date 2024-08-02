import { useCallback, useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";

const APPLICATION_SERVER_URL = "http://localhost:8080/";

const useOpenVidu = () => {
  const sessionRef = useRef(null);
  const ovRef = useRef(null);
  const [sessionId, setSessionId] = useState("");
  const [inputSessionId, setInputSessionId] = useState("");
  const [connected, setConnected] = useState(false);

  const leaveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
    setConnected(false);
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

  const createSession = async () => {
    const res = await axios.post(APPLICATION_SERVER_URL + "api/sessions");
    return res.data.sessionId;
  };

  const createToken = (sessionId) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
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
    setSessionId(targetSessionId);
    return await createToken(targetSessionId);
  };

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

  const joinExistingSession = async (event) => {
    event.preventDefault();
    if (inputSessionId) {
      await joinSession(inputSessionId);
      setInputSessionId(""); // 입력 필드 초기화
    }
  };

  const joinSession = useCallback(
    async (existingSessionId = null) => {
      initSession();

      getToken(existingSessionId).then((token) => {
        if (sessionRef.current && ovRef.current) {
          sessionRef.current
            .connect(token)
            .then(() => {
              const newPublisher = ovRef.current.initPublisher("publisher");
              sessionRef.current.publish(newPublisher);
              setConnected(true);
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
    },
    [initSession],
  );

  return {
    sessionId,
    inputSessionId,
    connected,
    handleInputChange,
    joinExistingSession,
    joinSession,
    leaveSession,
  };
};

export default useOpenVidu;
