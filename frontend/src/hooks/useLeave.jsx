import { useResetRecoilState } from "recoil";
import {
  aroundStationsAtom,
  chatAtom,
  chatModalVisibleAtom,
  isNextMiddleExistAtom,
  roomAtom,
  roomPageAtom,
  selectedStationAtom,
} from "../recoil/atoms/roomState";
import { useWebSocket } from "../context/WebsocketContext";
import { useOpenVidu } from "../context/OpenViduContext";

export const useLeave = () => {
  const { disconnect } = useWebSocket();
  const { leaveSession } = useOpenVidu();

  const resetRoomInfo = useResetRecoilState(roomAtom);
  const resetChat = useResetRecoilState(chatAtom);
  const resetChatModal = useResetRecoilState(chatModalVisibleAtom);
  const resetIsNextMiddleExist = useResetRecoilState(isNextMiddleExistAtom);
  const resetAroundStations = useResetRecoilState(aroundStationsAtom);
  const resetSelectedStations = useResetRecoilState(selectedStationAtom);
  const resetRoomPage = useResetRecoilState(roomPageAtom);
};
