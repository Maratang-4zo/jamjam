import styled from "styled-components";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useNavermaps } from "react-naver-maps";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { userInfoAtom } from "../../recoil/atoms/userState";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

function FindDeparture({ onClose, onAddressSelect }) {
  const navermaps = useNavermaps();
  const [fullAddress, setFullAddress] = useState(null);
  const setUserInfo = useSetRecoilState(userInfoAtom);

  useEffect(() => {
    if (fullAddress) {
      const geocoder = navermaps.Service.geocode(
        { address: fullAddress },
        (status, response) => {
          if (status !== navermaps.Service.Status.OK) {
            console.log("error");
            return alert("Something went wrong!");
          }
          const result = response.result;
          const items = result.items;
          const latitude = items[0].point.y;
          const longitude = items[0].point.x;

          // 데이터 전달 후 모달 닫기
          setUserInfo((prevState) => ({
            ...prevState,
            departure: {
              addressText: fullAddress,
              latitude,
              longitude,
            },
          }));
          onAddressSelect({ addressText: fullAddress, latitude, longitude });
          onClose();
        },
      );
    }
  }, [fullAddress, navermaps, onAddressSelect, onClose]);

  const handleComplete = (data) => {
    let address = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      address += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setFullAddress(address);
  };

  return (
    <Wrapper>
      <ModalContent>
        <h1>출발지를 입력해주세요.</h1>
        <DaumPostcodeEmbed onComplete={handleComplete} />
      </ModalContent>
    </Wrapper>
  );
}

export default FindDeparture;
