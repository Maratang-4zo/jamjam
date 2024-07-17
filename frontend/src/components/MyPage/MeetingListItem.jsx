import styled from "styled-components";

const Container = styled.div`
  width: 180px;
  height: 105.199px;
  flex-shrink: 0;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid #cacaca;
  margin: 15px;
`;

const RoomName = styled.p`
  border-bottom: 1px solid #cacaca;
  text-align: center;
  padding: 5px;
  font-weight: 600;
`;

const RoomInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    margin-bottom: 10px;
  }
`;

function MeetingListItem({ meet }) {
  return (
    <Container>
      <RoomName>{meet.name}</RoomName>
      <RoomInfo>
        <h1>{meet.date}</h1>
        <p>{meet.place}</p>
      </RoomInfo>
    </Container>
  );
}

export default MeetingListItem;
