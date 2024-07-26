import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import Map from "../components/mainroom/Map";
import { useEffect, useState } from "react";
import FindDeparture from "../components/mainroom/Departure";
import Buttons from "../components/mainroom/Buttons";

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
      <Map />
      <Buttons />
    </Wrapper>
  );
}

export default Room;
