import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Mypage from "./routes/MyPage";
import Room from "./routes/MainRoom";
import CreateRoom from "./routes/CreateRoom";
import JoinRoom from "./routes/JoinRoom";
import Reconnect from "./routes/Reconnect";
import InvalidRoom from "./routes/InvalidRoom";
import Han from "./routes/Han";
import NewHome from "./routes/NewHome";
import { WebSocketProvider } from "./context/WebsocketContext";

function Router() {
  return (
    <BrowserRouter>
      {/* <WebSocketProvider> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/room/create" element={<CreateRoom />} />
        <Route path="/room/:roomUUID" element={<Room />} />
        <Route path="/room/:roomUUID/join" element={<JoinRoom />} />
        <Route path="/room/:roomUUID/reconnect" element={<Reconnect />} />
        <Route path="/invalid-room" element={<InvalidRoom />} />
        <Route path="/newhome" element={<NewHome />} />
        <Route path="/han" element={<Han />} />
      </Routes>
      {/* </WebSocketProvider> */}
    </BrowserRouter>
  );
}

export default Router;
