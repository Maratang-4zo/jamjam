import { BrowserRouter, Routes, Route } from "react-router-dom";
import Intro from "./routes/Intro";
import GameChoice from "./routes/GameChoice";
import Mypage from "./routes/MyPage";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import Room from "./routes/Room";
import CreateRoom from "./routes/CreateRoom";
import Game from "./routes/Game";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/:userId" element={<Mypage />} />
        <Route path="/:roomId" element={<Room />} />
        <Route path="/:roomId/create" element={<CreateRoom />} />
        <Route path="/:roomId/gamechoice" element={<GameChoice />} />
        <Route path="/:roomId/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
