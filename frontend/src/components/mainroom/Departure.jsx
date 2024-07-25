import styled from "styled-components";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useNavermaps } from "react-naver-maps";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { userPlaceAtom } from "../../recoil/atoms/userState";

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
  z-index: 100;
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
  const setUserPlace = useSetRecoilState(userPlaceAtom);

  useEffect(() => {
    if (fullAddress) {
      const geocoder = navermaps.Service.geocode(
        { address: fullAddress },
        (status, response) => {
          if (status !== navermaps.Service.Status.OK) {
            console.log("error");
            return alert("Something went wrong!");
          }
          // console.log("응답 = ", response);
          const result = response.result;
          // console.log("결과 = ", result); // Container of the search result
          const items = result.items; // Array of the search result
          // console.log("아이템 = ", items);
          // do Something
          const latitude = items[0].point.y;
          const longitude = items[0].point.x;
          // console.log("위도 = ", latitude, " 경도 = ", longitude);

          // 데이터 전달 후 모달 닫기
          setUserPlace({ address: fullAddress, latitude, longitude });
          onClose();
        },
      );
      // console.log("지오코더 = ", geocoder);
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

    // console.log("Address:", address); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    setFullAddress(address); // 주소 상태 업데이트
  };

  return (
    <Wrapper>
      <ModalContent>
        <h1>출발지를 입력해주세요.</h1>
        <DaumPostcodeEmbed onComplete={handleComplete} />
        <button onClick={onClose}>찾기</button>
      </ModalContent>
    </Wrapper>
  );
}
export default FindDeparture;
