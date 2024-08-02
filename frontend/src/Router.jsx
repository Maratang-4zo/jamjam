import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import GameChoice from "./routes/GameChoice";
import Mypage from "./routes/MyPage";
import Room from "./routes/MainRoom";
import CreateRoom from "./routes/CreateRoom";
import Game from "./routes/Game";
import FinalResult from "./routes/FinalResult";
import JoinRoom from "./routes/JoinRoom";
import Reconnect from "./routes/Reconnect";
import Ws from "./routes/ws";
import ConnectOpenVidu from "./routes/OpenVidu";
// import Auth from "./components/Auth";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:userUUID" element={<Mypage />} />
        <Route path="/room/create" element={<CreateRoom />} />
<<<<<<< HEAD
        <Route path="/room/:roomUUID" element={<Room />} />
        <Route path="/room/:roomUUID/join" element={<JoinRoom />} />
        <Route path="/room/:roomUUID/gamechoice" element={<GameChoice />} />
        <Route path="/room/:roomUUID/game" element={<Game />} />
        <Route path="/room/:roomUUID/result" element={<FinalResult />} />
        <Route path="/room/:roomUUID/reconnect" element={<Reconnect />} />
        <Route path="/room/:roomUUID/ws" element={<Ws />} />
        <Route path="/room/:roomUUID/openvidu" element={<ConnectOpenVidu />} />
        <Route path="/oauth/kakao/callback" element={<Auth />} />
=======
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/room/:roomId/join" element={<JoinRoom />} />
        <Route path="/room/:roomId/gamechoice" element={<GameChoice />} />
        <Route path="/room/:roomId/game" element={<Game />} />
        <Route path="/room/:roomId/result" element={<FinalResult />} />
        <Route path="/room/:roomId/reconnect" element={<Reconnect />} />
        <Route path="/room/:roomId/ws" element={<Ws />} />
        <Route path="/room/:roomId/openvidu" element={<ConnectOpenVidu />} />
        {/* <Route path="/oauth/kakao/callback" element={<Auth />} /> */}
>>>>>>> c3b8021 (🔨 Fix: 기존 프론트 코드 삭제)
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
