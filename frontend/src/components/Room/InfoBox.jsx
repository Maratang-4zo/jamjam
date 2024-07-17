import styled from "styled-components";
import { useForm } from "react-hook-form";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Calendar = styled.div`
  width: 295.973px;
  height: 229.275px;
  border: 1px solid black;
`;

const Form = styled.form`
  width: 295.973px;
  height: 229.275px;
  border: 1px solid black;
`;

function InfoBox() {
  const { register } = useForm();
  return (
    <Container>
      <Form>
        <input type="text" {...register("departure")} placeholder="내 출발지" />
        <p>현재 모임 장소</p>
        <p>예상 소요 시간</p>
        <input type="date" {...register("date")} placeholder="모임 날짜" />
      </Form>
      <Calendar>
        <h1>여기는 캘린더 자리입니다</h1>
      </Calendar>
    </Container>
  );
}

export default InfoBox;
