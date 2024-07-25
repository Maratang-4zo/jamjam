import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import Map from "../components/mainroom/Map";
import { useEffect, useState } from "react";
import FindDeparture from "../components/mainroom/Departure";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  display: flex;
  align-items: center;
`;

function Room() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  useEffect(() => {
    setIsModalOpen(true);
  }, []);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleAddressSelect = (data) => {
    setSelectedAddress(data);
    console.log("Selected Address Data:", data);
  };
  return (
    <Wrapper>
      <NavBarLeft />
      {isModalOpen && (
        <FindDeparture
          onClose={handleCloseModal}
          onAddressSelect={handleAddressSelect}
        />
      )}
      {selectedAddress && (
        <div>
          <h2>선택한 주소:</h2>
          <p>{selectedAddress.address}</p>
          <p>위도: {selectedAddress.latitude}</p>
          <p>경도: {selectedAddress.longitude}</p>
        </div>
      )}
      <Map />
    </Wrapper>
  );
}

export default Room;
