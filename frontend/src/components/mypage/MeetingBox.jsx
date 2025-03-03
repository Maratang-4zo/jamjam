import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { axiosGetMeetingHistory } from "../../apis/loginApi";

const MeetingBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 21px;
  width: 100%;
`;

const MeetingRow = styled.div`
  display: flex;
  gap: 21px;
  width: 100%;
`;

const MeetingHistory = styled.div`
  background-color: #ffffff;
  border: 0.7px solid #000000;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  height: 152.6px;
  padding: 20px 15px;
  width: calc(25% - 15.75px); // 4개를 균등하게 배치하기 위한 너비
  min-width: 170px;
  justify-content: space-between;
`;

const MeetingTextWrapper = styled.div`
  color: #000000;
  font-family: "neodgm", Helvetica;
  font-size: 19.6px;
`;

const Element = styled.div`
  color: #000000;
  font-family: "neodgm", Helvetica;
  font-size: 19.6px;
`;

const BtmTxt = styled.div`
  color: #000000;
  font-family: "neodgm", Helvetica;
  font-size: 15px;
`;

function MeetingBox(props) {
  // const [meetingHistory, setMeetingHistory] = useState([]);

  const getMeetingString = (meeting) => {
    const dateObj = new Date(meeting);

    // 연도, 월, 일 추출
    const year = dateObj.getFullYear().toString().slice(2); // 2자리 연도
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // 월 (0부터 시작하므로 +1)
    const day = dateObj.getDate().toString().padStart(2, "0"); // 일

    // 요일 배열 생성
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = weekdays[dateObj.getDay()];

    // 최종 문자열 생성
    return `${year}.${month}.${day} (${dayOfWeek})`;
  };

  // useEffect(() => {
  //   const fetchMeetingHistory = async () => {
  //     try {
  //       const history = await axiosGetMeetingHistory();
  //       setMeetingHistory(history);
  //       props.setMeeting(history);
  //     } catch (error) {
  //       console.error("모임 기록 가져오기 실패", error);
  //     }
  //   };
  //
  //   fetchMeetingHistory();
  // }, []);

  if (!props.meetingHistory || props.meetingHistory.length === 0) {
    return <div>아직 만남이 이루어지지 않았어요ㅠㅠ</div>;
  }

  const groupMeetings = (meetings, size) => {
    return meetings.reduce((acc, _, index) => {
      if (index % size === 0) {
        acc.push(meetings.slice(index, index + size));
      }
      return acc;
    }, []);
  };

  const groupedMeetings = groupMeetings(props.meetingHistory, 4);

  return (
    <MeetingBoxContainer>
      {groupedMeetings.map((row, rowIndex) => (
        <MeetingRow key={rowIndex}>
          {row.map((meeting, index) => {
            const meetingDate = getMeetingString(meeting.meetingDate);
            return (
              <MeetingHistory key={index}>
                <div>
                  <MeetingTextWrapper>{meetingDate}</MeetingTextWrapper>
                  <Element>{meeting.finalStation}</Element>
                </div>
                <BtmTxt>
                  <br />
                  {meeting.name}
                  <br />
                  for {meeting.purpose}
                </BtmTxt>
              </MeetingHistory>
            );
          })}
        </MeetingRow>
      ))}
    </MeetingBoxContainer>
  );
}

export default MeetingBox;
