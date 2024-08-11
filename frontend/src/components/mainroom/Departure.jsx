import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useNavermaps } from "react-naver-maps";

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
  background-color: #bfbfbf;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
`;

const ModalTitle = styled.h1`
  font-size: 20px;
  font-family: "DungGeunMo";
  background-color: none;
  box-shadow: 0px 5px 3px -3px rgba(0, 0, 0, 0.25);
  border-bottom: 2px solid black;
  padding: 10px;
  width: 100%;
  text-align: center;
  cursor: default;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #000000;
  font-family: "DungGeunMo";
  &:focus {
    border: 2px solid #000000;
    outline: none;
    background-color: #eaeaea;
    transition: 0.2s;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #ffffff;
  color: #000000;
  border: 2px solid #000000;
  border-radius: 10px;
  cursor: pointer;
  font-family: "OldGalmuri";
  &:hover {
    background-color: ${(props) => props.theme.bgColor};
    transition: 0.2s;
  }
`;

function FindDeparture({ onClose, onAddressSelect }) {
  const navermaps = useNavermaps();
  const [inputAddress, setInputAddress] = useState(""); // 사용자가 입력한 주소
  const modalRef = useRef(null);

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

    const geocoder = navermaps.Service.geocode(
      { address },
      async (status, response) => {
        if (
          status === navermaps.Service.Status.OK &&
          response.result.items.length > 0
        ) {
          const items = response.result.items;
          const latitude = items[0].point.y;
          const longitude = items[0].point.x;

          onAddressSelect({ addressText: address, latitude, longitude });
          onClose();
        } else {
          fetchKakaoMapCoordinates(address);
        }
      },
    );
  };

  const fetchKakaoMapCoordinates = async (address) => {
    try {
      const apiKey = process.env.REACT_APP_KAKAO_REST_API_KEY;
      const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      });

      const data = await response.json();

      if (data.documents.length > 0) {
        const location = data.documents[0];
        const latitude = location.y;
        const longitude = location.x;

        onAddressSelect({ addressText: address, latitude, longitude });
        onClose();
      } else {
        alert("해당 주소의 좌표를 찾을 수 없습니다.");
      }
    } catch (error) {
      alert("Kakao Map API 호출 중 오류가 발생했습니다.");
    }
  };
  const handleSearch = () => {
    if (inputAddress.trim()) {
      const script = document.createElement("script");
      script.src =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = () => {
        const modalRect = modalRef.current.getBoundingClientRect();
        const popupWidth = 400;
        const popupHeight = 500;

        const left =
          window.screenX +
          modalRect.left +
          modalRect.width / 2 -
          popupWidth / 2;
        const top =
          window.screenY +
          modalRect.top +
          modalRect.height / 2 -
          popupHeight / 2;

        new window.daum.Postcode({
          oncomplete: handleComplete,
          width: popupWidth,
          height: popupHeight,
        }).open({
          q: inputAddress,
          left,
          top,
        });
      };

      document.body.appendChild(script);
    } else {
      alert("주소를 입력해주세요.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <Wrapper>
      <ModalContent ref={modalRef}>
        <ModalTitle>출발지를 입력해주세요.</ModalTitle>
        <Input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="검색할 주소를 입력하세요"
        />
        <SearchButton onClick={handleSearch}>확인</SearchButton>
      </ModalContent>
    </Wrapper>
  );
}

export default FindDeparture;
