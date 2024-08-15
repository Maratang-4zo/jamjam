import { useResetRecoilState } from "recoil";
import { roomAtom } from "../recoil/atoms/roomState";
import { useWebSocket } from "../context/WebsocketContext";
import { useOpenVidu } from "../context/OpenViduContext";

export const useLeave = () => {
  const { disconnect } = useWebSocket();
  const { leaveSession } = useOpenVidu();

  const resetRoomInfo = useResetRecoilState(roomAtom);
  //   const
};
