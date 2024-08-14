import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

// 슬라이드 인 애니메이션
const slideIn = keyframes`
  from {
    transform: translateX(10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  display: flex;
  width: 150px;
  /* height: 170px; */
  flex-direction: column;
  align-items: flex-start;
  border-radius: 20px;
  background: none;
  border: 2px solid black;
  position: absolute;
  left: 60px; /* NavBarLeft 바로 오른쪽에 위치하도록 조정 */
  top: ${({ top }) => top}px; /* 클릭한 Avatar의 위치에 따라 조정 */
  overflow: hidden;
  animation: ${slideIn} 0.3s ease-out; /* 슬라이드 인 애니메이션 */
`;

const ModalHeader = styled.div`
  height: 50px;
  flex-shrink: 0;
  align-self: stretch;
  background: ${(props) => props.bgColor};
`;

const ModalBody = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 5px;
  flex: 1 0 0;
  align-self: stretch;
  background-color: #ffffffd7;
`;

const Nickname = styled.h1`
  color: var(--Color, #000);
  margin-top: 20px;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  font-family: "DungGeunMo";
`;

const Departure = styled.p`
  color: var(--Color, #000);
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  font-family: "DungGeunMo";
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 30px;
  left: 10px;
  border-radius: 30%;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #000;
  animation: spin 1s ease infinite;
  position: absolute;
  left: 60px; /* NavBarLeft 바로 오른쪽에 위치하도록 조정 */
  top: ${({ top }) => top}px; /* 클릭한 Avatar의 위치에 따라 조정 */

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function UserInfoModal({ user, top, onClose }) {
  const modalRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Spinner top={top} />}
      <Profile
        src={user.profileImageUrl}
        onLoad={handleImageLoad}
        style={{ display: "none" }} // 이미지를 로드하기 위한 숨김 처리
      />
      {isImageLoaded && (
        <ModalOverlay top={top} ref={modalRef}>
          <ModalHeader bgColor={user.color} />
          <Profile src={user.profileImageUrl} />
          <ModalBody>
            <Nickname>{user.nickname}</Nickname>
            <Departure>
              {user.address ? user.address : "출발지가 없습니다"}
            </Departure>
          </ModalBody>
        </ModalOverlay>
      )}
    </>
  );
}

export default UserInfoModal;
