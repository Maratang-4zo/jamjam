import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { axiosGetMeetingHistory } from "../../apis/loginApi";

const MeetingHistory = styled.div`
  align-items: center;
  background-color: #ffffff;
  border: 0.7px solid #000000;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  height: 152.6px;
  justify-content: center;
  overflow: hidden;
  padding: 10.5px 14px;
  width: 151.2px;
`;

const MeetingTextWrapper = styled.div`
  color: #000000;
  font-family: "Galmuri11-Regular", Helvetica;
  font-size: 19.6px;
  text-align: center;
`;

const Element = styled.div`
  color: #000000;
  font-family: "Galmuri11-Regular", Helvetica;
  font-size: 19.6px;
  text-align: center;
`;

function MeetingBox() {
  const [meetingHistory, setMeetingHistory] = useState([]);

  useEffect(() => {
    const fetchMeetingHistory = async () => {
      try {
        const history = await axiosGetMeetingHistory();
        setMeetingHistory(history);
      } catch (error) {
        console.error("모임 기록 가져오기 실패", error);
      }
    };

    fetchMeetingHistory();
  }, []);

  if (!meetingHistory || meetingHistory.length === 0) {
    return <div>아직 만남이 이루어지지 않았어요ㅠㅠ</div>;
  }

  return (
    <>
      {meetingHistory.map((meeting, index) => {
        // const meetingDate = meeting.meetingDate.split("T")[0];
        return (
          <MeetingHistory key={index}>
            <MeetingTextWrapper>{meeting.meetingDate}</MeetingTextWrapper>
            <Element>
              {meeting.name}
              <br />
              {meeting.finalStation}
              <br />
              {meeting.purpose}
            </Element>
          </MeetingHistory>
        );
      })}
    </>
  );
}

export default MeetingBox;

// const [meetingHistory, setMeetingHistory] = useState([
//   {
//     name: "하이",
//     purpose: "식당",
//     meetingDate: "2023-08-07T10:00:00",
//     finalStation: "사당",
//   },
//   {
//     name: "멍멍",
//     purpose: "스터디",
//     meetingDate: "2023-08-08T09:00:00",
//     finalStation: "강남",
//   },
// ]);
