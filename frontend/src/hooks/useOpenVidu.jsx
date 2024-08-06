import { useCallback, useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import { getCookie, setCookie } from "../utils/Cookies";

const APPLICATION_SERVER_URL = "https://jjam.shop/";

const useOpenVidu = () => {
  const sessionRef = useRef(null);
  const ovRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const leaveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
    setConnected(false);
  }, []);

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
    await axios.post(APPLICATION_SERVER_URL + "api/wr/rooms");
    return createToken();
  };

  const createToken = () => {
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

  const joinSession = useCallback(async () => {
    initSession();

    let token = getCookie("OpenviduToken");

    if (!token) {
      // 쿠키에 토큰이 없을 경우 토큰을 생성하여 쿠키에 저장
      token = await createToken();
    }

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
  }, [initSession]);

  return {
    connected,
    joinSession,
    leaveSession,
    createSession,
    createToken,
  };
};

export default useOpenVidu;
