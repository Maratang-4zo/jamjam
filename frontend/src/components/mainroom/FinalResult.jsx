import styled, { keyframes } from "styled-components";
import ResultBox from "../finalresult/ResultBox";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfoAtom } from "../../recoil/atoms/userState";
import { axiosPatchNextMiddle } from "../../apis/mapApi";
import { roomAtom } from "../../recoil/atoms/roomState";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  border-left: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  animation: ${fadeIn} 2s ease-in-out;
`;

const AnimatedButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

// const Container = styled.div`
//   display: flex;
//   /* justify-content: center; */
//   /* text-align: center; */
// `;

function FinalResult() {
  const userInfo = useRecoilValue(userInfoAtom);
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);

  // 방 종료
  const handleExitBtn = async () => {
    try {
      const res = await axiosPatchNextMiddle({
        startStation: roomInfo.centerPlace.name,
      });
    } catch (err) {
      console.log("중심 장소 변경 실패", err);
    }
  };

  // 중심 장소 변경 후 메인으로
  const handleUpdatedCenter = async () => {
    try {
      const res = await axiosPatchNextMiddle({
        startStation: roomInfo.centerPlace.name,
      });
      setRoomInfo((prev) => ({
        ...prev,
        centerPlace: res.roomCenterStart,
        attendees: res.attendees,
      }));
    } catch (err) {
      console.log("중심 장소 변경 실패", err);
    }
  };

  // 중심 장소 리셋 후 메인으로
  const handleResetCenter = async () => {};

  return (
    <Wrapper>
      {/* <Container> */}
      <ResultBox></ResultBox>
      <ButtonContainer>
        <AnimatedButton>SHARE</AnimatedButton>
        {/* MAIN 버튼 누르면 home화면처럼 버튼 두개(중심역 리셋, 유지) 만든다음에 위에 함수 연결시키면 될것가타요 */}
        <AnimatedButton disabled={!userInfo.isHost}>MAIN</AnimatedButton>
        <AnimatedButton disabled={!userInfo.isHost} onClick={handleExitBtn}>
          종료
        </AnimatedButton>
      </ButtonContainer>
      {/* </Container> */}
    </Wrapper>
  );
}

export default FinalResult;
