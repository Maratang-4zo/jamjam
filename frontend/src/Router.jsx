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

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:userId" element={<Mypage />} />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/room/:roomId/join" element={<JoinRoom />} />
        <Route path="/room/:roomId/gamechoice" element={<GameChoice />} />
        <Route path="/room/:roomId/game" element={<Game />} />
        <Route path="/room/:roomId/result" element={<FinalResult />} />
        <Route path="/room/:roomId/reconnect" element={<Reconnect />} />
        <Route path="/room/:roomId/ws" element={<Ws />} />
        <Route path="/room/:roomId/openvidu" element={<ConnectOpenVidu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
