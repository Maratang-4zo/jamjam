import styled from "styled-components";
import MeetingListItem from "./MeetingListItem";
import { useState } from "react";

const Container = styled.div`
  width: 800px;
  height: 550px;
  /* background-color: aliceblue; */
  position: relative;
  svg {
    fill: ${(props) => props.theme.btnColor};
    position: absolute;
    right: 0;
  }
`;

const File = styled.div`
  width: inherit;
  height: 510px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 0px solid #000;
  background: #ffd459;
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 5px 5px 10px 0px #000;
  padding: 20px;
`;

const Title = styled.h1`
  background-color: ${(props) => props.theme.mainBgColor};
  height: 70px;
  margin-bottom: 20px;
  text-align: center;
  align-content: center;
  font-size: 20px;
  font-weight: 600;
`;

const ContentBox = styled.div`
  background-color: ${(props) => props.theme.mainBgColor};
  height: 350px;
  padding: 20px;
  display: flex;
  justify-content: center;
  overflow: scroll;
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

function MeetingList() {
  const [List, setList] = useState([
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
    { name: "선배 마라탕4조", date: "2024-02-31", place: "역삼역" },
  ]);
  return (
    <Container>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="283"
        height="87"
        viewBox="0 0 283 87"
      >
        <path d="M32.8013 2.88208C33.4543 1.28485 35.0085 0.241211 36.734 0.241211H245.249C246.952 0.241211 248.491 1.25825 249.158 2.8252L282.467 81.04C283.66 83.8425 281.604 86.9533 278.558 86.9533H4.75797C1.73842 86.9533 -0.317382 83.8919 0.825278 81.0969L32.8013 2.88208Z" />
        <path d="M32.8013 2.88208C33.4543 1.28485 35.0085 0.241211 36.734 0.241211H245.249C246.952 0.241211 248.491 1.25825 249.158 2.8252L282.467 81.04C283.66 83.8425 281.604 86.9533 278.558 86.9533H4.75797C1.73842 86.9533 -0.317382 83.8919 0.825278 81.0969L32.8013 2.88208Z" />
      </svg>
      <File>
        <Title>ㅇㅇㅇ 님의 모임 기록</Title>
        <ContentBox>
          <Content>
            {List.map((meet) => (
              <MeetingListItem meet={meet} />
            ))}
          </Content>
        </ContentBox>
      </File>
    </Container>
  );
}

export default MeetingList;
