import { useResetRecoilState } from "recoil";
import {
  aroundStationsAtom,
  chatAtom,
  chatModalVisibleAtom,
  estimatedForceCloseAtAtom,
  isNextMiddleExistAtom,
  roomAtom,
  roomPageAtom,
  selectedStationAtom,
} from "../recoil/atoms/roomState";
import { useWebSocket } from "../context/WebsocketContext";
import { useOpenVidu } from "../context/OpenViduContext";
import { userInfoAtom } from "../recoil/atoms/userState";
import {
  currentRoundAtom,
  currentRoundUUIDAtom,
  gameCountAtom,
  gameRecordAtom,
  gameSessionUUIDAtom,
  gameStateAtom,
  isWinnerAtom,
  playerState,
  roundCenterAtom,
  selectedGameAtom,
  totalRoundAtom,
  winnerNicknameAtom,
  winnerUUIDAtom,
} from "../recoil/atoms/gameState";
import {
  isCenterMoveLoadingAtom,
  isFindCenterLoadingAtom,
  isHistoryLoadingAtom,
  isHostOutAtom,
  isMainConnectingAtom,
  isPlayingGameAtom,
  isThreeStationLoadingAtom,
} from "../recoil/atoms/loadingState";
import { useNavigate } from "react-router-dom";

export const useLeave = () => {
  const navigate = useNavigate();

  const { disconnect } = useWebSocket();
  const { leaveSession } = useOpenVidu();

  const resetRoomInfo = useResetRecoilState(roomAtom);
  const resetChat = useResetRecoilState(chatAtom);
  const resetChatModal = useResetRecoilState(chatModalVisibleAtom);
  const resetIsNextMiddleExist = useResetRecoilState(isNextMiddleExistAtom);
  const resetAroundStations = useResetRecoilState(aroundStationsAtom);
  const resetSelectedStations = useResetRecoilState(selectedStationAtom);
  const resetRoomPage = useResetRecoilState(roomPageAtom);
  const resetEstimatedForceClose = useResetRecoilState(
    estimatedForceCloseAtAtom,
  );

  const resetUserInfo = useResetRecoilState(userInfoAtom);

  const resetPlayerState = useResetRecoilState(playerState);
  const resetSelectedGame = useResetRecoilState(selectedGameAtom);
  const resetIsWinner = useResetRecoilState(isWinnerAtom);
  const resetWinnerUUID = useResetRecoilState(winnerUUIDAtom);
  const resetWinnerNickname = useResetRecoilState(winnerNicknameAtom);
  const resetGameSessionUUID = useResetRecoilState(gameSessionUUIDAtom);
  const resetGameRecord = useResetRecoilState(gameRecordAtom);
  const resetTotalRound = useResetRecoilState(totalRoundAtom);
  const resetCurrentRound = useResetRecoilState(currentRoundAtom);
  const resetCurrentRoundUUID = useResetRecoilState(currentRoundUUIDAtom);
  const resetGameState = useResetRecoilState(gameStateAtom);
  const resetGameCount = useResetRecoilState(gameCountAtom);
  const resetRoundCenter = useResetRecoilState(roundCenterAtom);

  const resetIsFindCenterLoading = useResetRecoilState(isFindCenterLoadingAtom);
  const resetIsCenterMoveLoading = useResetRecoilState(isCenterMoveLoadingAtom);
  const resetIsHistoryLoading = useResetRecoilState(isHistoryLoadingAtom);
  const resetIsThreeStationLoading = useResetRecoilState(
    isThreeStationLoadingAtom,
  );
  const resetIsMainConnecting = useResetRecoilState(isMainConnectingAtom);
  const resetIsHostOut = useResetRecoilState(isHostOutAtom);
  const resetIsPlayingGame = useResetRecoilState(isPlayingGameAtom);
  const leaveFn = () => {
    navigate("/");
    disconnect();
    leaveSession();
    resetRoomInfo();
    resetChat();
    resetChatModal();
    resetIsNextMiddleExist();
    resetAroundStations();
    resetSelectedStations();
    resetRoomPage();
    resetEstimatedForceClose();
    resetUserInfo();
    resetPlayerState();
    resetSelectedGame();
    resetIsWinner();
    resetWinnerUUID();
    resetWinnerNickname();
    resetGameSessionUUID();
    resetGameRecord();
    resetTotalRound();
    resetCurrentRound();
    resetCurrentRoundUUID();
    resetGameState();
    resetGameCount();
    resetRoundCenter();
    resetIsFindCenterLoading();
    resetIsCenterMoveLoading();
    resetIsHistoryLoading();
    resetIsThreeStationLoading();
    resetIsMainConnecting();
    resetIsHostOut();
    resetIsPlayingGame();
  };

  return { leaveFn };
};
