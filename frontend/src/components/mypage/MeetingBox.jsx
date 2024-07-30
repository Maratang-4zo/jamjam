import React from "react";
import styled from "styled-components";

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
  return (
    <>
      <MeetingHistory>
        <MeetingTextWrapper>2024-07-24</MeetingTextWrapper>
        <Element>
          000님의 방
          <br />
          사당역
          <br />
          스터디
        </Element>
      </MeetingHistory>
      <MeetingHistory>
        <MeetingTextWrapper>2024-07-19</MeetingTextWrapper>
        <Element>
          1반 헤쳐모여
          <br />
          역삼역
          <br />
          맛집 탐방
        </Element>
      </MeetingHistory>
      {/* 추가 MeetingHistory 컴포넌트들 */}
    </>
  );
}

export default MeetingBox;
