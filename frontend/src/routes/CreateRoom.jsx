import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import Background from "../assets/CreateRoomBg.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css";
import { useForm, Controller } from "react-hook-form";
import { axiosCreateRoom } from "../apis/roomApi";
import { useNavigate } from "react-router-dom";
import useWs from "../hooks/useWs";
import { jwtDecode } from "jwt-decode";
import { useRecoilState } from "recoil";
import { roomAtom } from "../recoil/atoms/roomState";
import { getCookie } from "../utils/Cookies";
import useOpenVidu from "../hooks/useOpenVidu";
import { userInfoAtom } from "../recoil/atoms/userState";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  background-image: url(${Background});
  background-size: cover;
  background-position: center;
  width: 90%;
  flex: 1;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  color: white;
  font-weight: bold;
  min-width: 100px; /* 라벨의 최소 너비 설정 */
`;

const DatePickerStyled = styled(DatePicker)`
  padding: 10px;
  font-size: 16px;
  width: 200px;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  width: 200px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 15px;
  border: 3px solid var(--Color, #000);
  background: #fff;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.p`
  font-family: "pixel" !important;
`;

const ErrorBox = styled.div`
  width: 200px;
  height: 50px;
  margin-top: 10px;
  text-align: center;
`;

function CreateRoom() {
  const navigate = useNavigate();
  const { connect } = useWs();
  const { createSession } = useOpenVidu();
  const [roomInfo, setRoomInfo] = useRecoilState(roomAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const createRoomFn = async (data) => {
    try {
      const response = await axiosCreateRoom(
        data.purpose,
        data.meetingDate.toISOString(),
        data.nickname,
      );

      const roomToken = getCookie("roomToken");
      const { roomUUID, attendeeUUID } = jwtDecode(roomToken);

      setRoomInfo((prev) => ({
        ...prev,
        meetingDate: data.meetingDate.toISOString(),
        purpose: data.purpose,
        roomUUID: roomUUID,
        hostUUID: attendeeUUID,
        attendants: [...prev.attendants, attendeeUUID],
        isValid: true,
      }));

      const sessionToken = await createSession(roomUUID, attendeeUUID);
      await connect(roomUUID, attendeeUUID);
      setUserInfo((prev) => ({
        ...prev,
        sessionToken,
        myUUID: attendeeUUID,
        isHost: true,
        nickname: data.nickname,
      }));

      navigate(`/room/${roomUUID}`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Wrapper>
      <NavBarUp />
      <Content>
        <FormWrapper onSubmit={handleSubmit(createRoomFn)}>
          <InputWrapper>
            <Label>닉네임:</Label>
            <input type="text" {...register("nickname")} />
          </InputWrapper>
          <InputWrapper>
            <Label>모임 날짜:</Label>
            <Controller
              name="meetingDate"
              control={control}
              defaultValue={null}
              rules={{ required: "날짜를 선택하세요" }}
              render={({ field }) => (
                <DatePickerStyled
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="날짜를 선택하세요"
                />
              )}
            />
          </InputWrapper>

          <InputWrapper>
            <Label>모임 목적:</Label>
            <Select
              {...register("purpose", {
                required: "카테고리를 입력해주세요.",
              })}
            >
              <option value="" disabled hidden>
                카테고리를 선택하세요
              </option>
              <option value="sports">스포츠</option>
              <option value="music">음악</option>
              <option value="study">스터디</option>
              <option value="travel">여행</option>
              <option value="food">음식</option>
            </Select>
          </InputWrapper>
          <Button type="submit">
            <ButtonText>생성</ButtonText>
          </Button>
        </FormWrapper>
        <ErrorBox>
          {errors.meetingDate && (
            <p style={{ color: "red" }}>{errors.meetingDate.message}</p>
          )}
        </ErrorBox>
      </Content>
    </Wrapper>
  );
}

export default CreateRoom;
