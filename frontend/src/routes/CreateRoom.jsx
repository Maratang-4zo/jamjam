import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import Background from "../assets/CreateRoomBg.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css";
import { useForm, Controller } from "react-hook-form";
import { axiosCreateRoom } from "../apis/roomApi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../utils/Cookies";
import useOpenVidu from "../hooks/useOpenVidu";
import { useSetRecoilState } from "recoil";
import { userInfoAtom } from "../recoil/atoms/userState";
import { roomAtom } from "../recoil/atoms/roomState";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Content = styled.div`
  background-image: url(${Background});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 60%;
  width: 65%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative; /* 추가 */
`;

const Label = styled.label`
  color: white;
  font-weight: bold;
  min-width: 100px; /* 라벨의 최소 너비 설정 */
  font-family: "DungGeunMo";
`;

const DatePickerWrapper = styled.div`
  position: relative;
  width: 200px; /* 추가 */
`;

const DatePickerStyled = styled(DatePicker)`
  border-radius: 15px;
  padding: 10px;
  font-size: 16px;
  width: 100%; /* 수정 */
  box-sizing: border-box;
  border: 3px solid ${(props) => props.theme.subaccentColor};
  &:focus {
    border: 3px solid ${(props) => props.theme.accentColor};
    outline: 3px solid ${(props) => props.theme.bgColor};
  }
  font-family: "DungGeunMo";
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  width: 200px;
  box-sizing: border-box;
  border: 3px solid ${(props) => props.theme.subaccentColor};
  border-radius: 15px;
  &:focus {
    border: 3px solid ${(props) => props.theme.accentColor};
    outline: 3px solid ${(props) => props.theme.bgColor};
  }
  font-family: "DungGeunMo";
`;

const Input = styled.input`
  border-radius: 15px;
  padding: 10px;
  font-size: 16px;
  width: 200px;
  box-sizing: border-box;
  border: 3px solid ${(props) => props.theme.subaccentColor};
  &:focus {
    border: 3px solid ${(props) => props.theme.accentColor};
    outline: 3px solid ${(props) => props.theme.bgColor};
  }
  font-family: "DungGeunMo";
`;

const Button = styled.button`
  width: 100px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 15px;
  background: #fff;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${(props) => props.theme.infoColor};
    transition: 0.3s;
  }
  &:focus {
    border: 3px solid ${(props) => props.theme.bgColor};
  }
`;

const ButtonText = styled.p`
  font-family: "pixel" !important;
`;

const ErrorBox = styled.div`
  width: 200px;
  height: 30px;
  margin-top: 10px;
  text-align: center;
  font-family: "DungGeunMo";
`;

function CreateRoom() {
  const navigate = useNavigate();
  const setUserInfo = useSetRecoilState(userInfoAtom);
  const setRoomInfo = useSetRecoilState(roomAtom);
  const { createSession } = useOpenVidu();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const createRoomFn = async (data) => {
    try {
      const response = await axiosCreateRoom({
        purpose: data.purpose,
        meetingDate: data.meetingDate.toISOString(),
        nickname: data.nickname,
      });

      const { roomUUID, attendeeUUID } = response.data;

      await createSession();
      setUserInfo((prev) => ({
        ...prev,
        myUUID: attendeeUUID,
        isHost: true,
      }));

      setRoomInfo((prev) => ({
        ...prev,
        roomUUID: roomUUID,
        hostUUID: attendeeUUID,
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
        <ErrorBox>
          {errors.meetingDate && (
            <p style={{ color: "red" }}>{errors.meetingDate.message}</p>
          )}
        </ErrorBox>
        <FormWrapper onSubmit={handleSubmit(createRoomFn)}>
          <InputWrapper>
            <Label>닉네임:</Label>
            <Input
              placeholder="닉네임을 입력하세요"
              type="text"
              {...register("nickname")}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>모임 날짜:</Label>
            <DatePickerWrapper>
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
            </DatePickerWrapper>
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
              <option value="카페">카페</option>
              <option value="호프">호프</option>
              <option value="스터디룸">스터디룸</option>
              <option value="헬스클럽">헬스클럽</option>
              <option value="식당">식당</option>
              <option value="도서관">도서관</option>
              <option value="공원">공원</option>
              <option value="미술관">미술관</option>
              <option value="애견카페">애견카페</option>
              <option value="셀프사진">셀프사진</option>
            </Select>
          </InputWrapper>
          <Button type="submit">
            <ButtonText>생성</ButtonText>
          </Button>
        </FormWrapper>
      </Content>
    </Wrapper>
  );
}

export default CreateRoom;
