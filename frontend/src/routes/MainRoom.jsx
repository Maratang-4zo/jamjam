import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NavBarLeft from "../components/fixed/NavBarLeft";
import Map from "../components/mainroom/Map";
import FindDeparture from "../components/mainroom/Departure";
import EditModal from "../components/mainroom/EditModal";
import Buttons from "../components/mainroom/Buttons";
import ShareModal from "../components/mainroom/ShareModal";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  width: ${(props) => props.theme.wrapperWidth};
  height: ${(props) => props.theme.wrapperHeight};
  color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.accentColor};
  border-left: none;
  display: flex;
  align-items: center;
`;

function Room() {
  const [isFindDepartureModalOpen, setIsFindDepartureModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalTop, setModalTop] = useState("50px");
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    setIsFindDepartureModalOpen(true);
  }, []);

  const handleCloseFindDepartureModal = () => {
    setIsFindDepartureModalOpen(false);
  };

  const handleAddressSelect = (data) => {
    setSelectedAddress(data);
    console.log("Selected Address Data:", data);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleOpenShareModal = (title, top) => {
    setModalTitle(title);
    setModalTop(top);
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <Wrapper>
      <NavBarLeft />
      {isFindDepartureModalOpen && (
        <FindDeparture
          onClose={handleCloseFindDepartureModal}
          onAddressSelect={handleAddressSelect}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onAddressSelect={handleAddressSelect}
        />
      )}
      {isShareModalOpen && (
        <ShareModal
          title={modalTitle}
          top={modalTop}
          onClose={handleCloseShareModal}
        />
      )}
      <Map selectedAddress={selectedAddress} />
      <Buttons onOpenEditModal={handleOpenEditModal} />
    </Wrapper>
  );
}

export default Room;
