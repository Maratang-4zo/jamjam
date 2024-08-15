// import { useCallback, useEffect, useRef, useState } from "react";
// import { OpenVidu } from "openvidu-browser";
// import axios from "axios";
// import { getCookie, setCookie } from "../utils/Cookies";
// import { useRecoilState } from "recoil";
// import {
//   isOVConnectedAtom,
//   currentSpeakersAtom,
//   OVSessionAtom,
//   OVRefAtom,
//   OVPublisherAtom,
//   isMicOnAtom,
// } from "../recoil/atoms/roomState";
// const APPLICATION_SERVER_URL = "https://jjam.shop/";

// const useOpenVidu = () => {
//   const [sessionRef, setSessionRef] = useRecoilState(OVSessionAtom);
//   const [ovRef, setOvRef] = useRecoilState(OVRefAtom);
//   const [publisherRef, setPublisherRef] = useRecoilState(OVPublisherAtom); // Publisher 객체를 저장할 ref 추가
//   const [connected, setConnected] = useRecoilState(isOVConnectedAtom);
//   const [currentSpeakers, setCurrentSpeakers] =
//     useRecoilState(currentSpeakersAtom);
//   const [isMicOn, setIsMicOn] = useRecoilState(isMicOnAtom); // 마이크 상태를 관리하는 상태 추가

//   const leaveSession = useCallback(() => {
//     if (sessionRef) {
//       sessionRef.disconnect();
//     }
//     setConnected(false);
//   }, []);

//   const initSession = useCallback(() => {
//     if (sessionRef) return; // 이미 초기화되었으면 리턴

//     const newOv = new OpenVidu();
//     const newSession = newOv.initSession();
//     f;

//     setOvRef(newOv);
//     setSessionRef(newSession);

//     newSession.on("streamCreated", function (event) {
//       newSession.subscribe(event.stream, "subscriber");
//     });

//     newSession.on("publisherStartSpeaking", (event) => {
//       setCurrentSpeakers((prevSpeakers) => [
//         ...prevSpeakers,
//         event.connection.connectionId,
//       ]);
//     });

//     newSession.on("publisherStopSpeaking", (event) => {
//       setCurrentSpeakers((prevSpeakers) =>
//         prevSpeakers.filter((id) => id !== event.connection.connectionId),
//       );
//     });
//   }, [setCurrentSpeakers]);

//   const createSession = async () => {
//     await axios.post(APPLICATION_SERVER_URL + "api/wr/rooms");
//     return createToken();
//   };

//   const createToken = () => {
//     return new Promise((resolve, reject) => {
//       axios
//         .post(APPLICATION_SERVER_URL + "api/wr/rooms/token")
//         .then((res) => {
//           const token = res.data.token;
//           setCookie("OpenviduToken", token);
//           resolve(token);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   };

//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       if (sessionRef) {
//         sessionRef.disconnect();
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       if (sessionRef) {
//         sessionRef.disconnect();
//       }
//     };
//   }, []);

//   const joinSession = useCallback(async () => {
//     initSession();

//     let token = getCookie("OpenviduToken");

//     if (!token) {
//       // 쿠키에 토큰이 없을 경우 토큰을 생성하여 쿠키에 저장
//       token = await createToken();
//     }

//     if (sessionRef && ovRef) {
//       sessionRef
//         .connect(token)
//         .then(() => {
//           const newPublisher = ovRef.initPublisher("publisher", {
//             audioSource: undefined, // The source of audio. If undefined default audio input
//             videoSource: false, // The source of video. If undefined default video input
//             publishAudio: true, // Whether you want to start the publishing with audio unmuted or muted
//             publishVideo: false, // Whether you want to start the publishing with video enabled or disabled
//           });
//           setPublisherRef(newPublisher); // Publisher 객체 저장
//           sessionRef.publish(newPublisher);
//           setConnected(true);
//         })
//         .catch((error) => {
//           console.log(
//             "There was an error connecting to the session:",
//             error.code,
//             error.message,
//           );
//         });
//     }
//   }, [initSession, createToken]);

//   const toggleMic = () => {
//     if (publisherRef) {
//       const audioEnabled = publisherRef.stream.audioActive;
//       publisherRef.publishAudio(!audioEnabled); // 마이크 상태 토글
//       setIsMicOn(!audioEnabled); // 마이크 상태 업데이트
//     }
//   };

//   return {
//     joinSession,
//     leaveSession,
//     createSession,
//     createToken,
//     toggleMic, // 마이크 토글 함수 반환
//   };
// };

// export default useOpenVidu;
