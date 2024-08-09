import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Mypage from "./routes/MyPage";
import Room from "./routes/MainRoom";
import CreateRoom from "./routes/CreateRoom";
import JoinRoom from "./routes/JoinRoom";
import Reconnect from "./routes/Reconnect";
import Ws from "./routes/ws";
import ConnectOpenVidu from "./routes/OpenVidu";
import InvalidRoom from "./routes/InvalidRoom";
import Han from "./routes/Han";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/room/:roomUUID" element={<Room />} />
        <Route path="/room/:roomUUID/join" element={<JoinRoom />} />
        <Route path="/room/:roomUUID/reconnect" element={<Reconnect />} />
        <Route path="/invalid-room" element={<InvalidRoom />} />
        {/* <Route path="/oauth/kakao/callback" element={<Auth />} /> */}
        <Route path="/han" element={<Han />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
