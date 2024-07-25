import styled from "styled-components";
import NavBarUp from "../components/fixed/NavBarUp";
import Background from "../assets/CreateRoomBg.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import "../index.css";

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
  justify-content: flex-start;
  padding-top: 200px; /* 입력창들을 위로 옮기기 위한 패딩 */
`;

const FormWrapper = styled.div`
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
  margin-top: 100px; /* 버튼을 FormWrapper로부터 떨어뜨리기 위한 마진 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.p`
  font-family: "pixel" !important;
`;

function CreateRoom() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <Wrapper>
      <NavBarUp />
      <Content>
        <h1>방 만들기</h1>
        <FormWrapper>
          <InputWrapper>
            <Label>모임 날짜:</Label>
            <DatePickerStyled
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="날짜를 선택하세요"
            />
          </InputWrapper>
          <InputWrapper>
            <Label>모임 목적:</Label>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
        </FormWrapper>
        <Button>
          <ButtonText>생성</ButtonText>
        </Button>
      </Content>
    </Wrapper>
  );
}

export default CreateRoom;
