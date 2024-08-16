import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { userInfoAtom } from "../../recoil/atoms/userState";
import { getUserInfo, updateUserNickname } from "../../apis/loginApi";

const ProfileImage = styled.img`
  width: 70%;
  height: 70%;
  border-radius: 50%;
`;

const ProfileWrapper = styled.div`
  align-items: center;
  //border: 0.7px solid #000000;
  border-radius: 35px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  height: 84px;
  justify-content: center;
  margin: 10px 0;
  width: 84px;
`;

const Profile = styled.div`
  color: #6b6b6b;
  font-family: "Inter-Bold", Helvetica;
  font-size: 10.5px;
  font-weight: 700;
  text-decoration: underline;
`;

const Nickname = styled.label`
  color: #000000;
  font-family: "NewGalmuriRegular", Helvetica;
  font-size: 17.5px;
  text-decoration: underline;
  cursor: pointer;
`;

const Email = styled.div`
  background: transparent;
  border: none;
  color: #6b6b6b;
  font-family: "NewGalmuriRegular", Helvetica;
  font-size: 17.5px;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 500px;
  height: 300px;
  background: ${(props) => props.theme.bgColor || "#ffe845"};
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: black;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  font-size: 16px;
`;

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const B1 = styled.div `
  align-items: center;
  //border: 0.7px solid #000000;
  border-radius: 35px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  width: 100%;
  margin: 10px 0;
`

function ProfileBox() {
  const [modalVisible, setModalVisible] = useState(false); //닉네임 수정창 보이게
  const [modalContent, setModalContent] = useState(""); // 닉네임 수정창 내용
  const [newNickname, setNewNickname] = useState(""); // nickname 상태
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom); // userInfoAtom 에 변경된 nickname업뎃용

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo((prevState) => ({
          ...prevState,
          nickname: data.nickname,
          email: data.email,
          profileImageUrl: data.profile,
        }));
      } catch (error) {
        console.error("사용자 정보 가져오기 실패", error);
      }
    };

    fetchUserInfo();
  }, [setUserInfo]);

  //모달 여는 함수
  const handleModalOpen = (content) => {
    setModalContent(content);
    setModalVisible(true);
    //모달 열었을 때 input 창에 기존 nickname 채워져 있기
    // setNewNickname(userInfo.nickname);
    setNewNickname("");
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setModalContent("");
  };

  // 닉네임 수정 하고 저장 눌렀을 때 실행되는 함수
  const handleSaveNickname = async () => {
    try {
      await updateUserNickname(newNickname);
      setUserInfo((prevState) => ({
        ...prevState,
        nickname: newNickname,
      }));
      handleModalClose();
    } catch (error) {
      console.log();
      console.error("닉네임 수정 실패 ", error);
    }
  };
  return (
    <>
      <B1>


      <ProfileWrapper>
        <ProfileImage src={userInfo.profileImageUrl} alt="profile" />
      </ProfileWrapper>
        <div>
      <Nickname onClick={() => handleModalOpen("닉네임 수정")}>
        {userInfo.nickname}
      </Nickname>
      <Email>{userInfo.email}</Email>
      <ModalOverlay isVisible={modalVisible}>
        <ModalContent>
          <CloseButton onClick={handleModalClose}>X</CloseButton>
          {modalContent}
          {modalContent === "닉네임 수정" && (
            <>
              <Input
                type="text"
                placeholder={userInfo.nickname}
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
              />
              <SaveButton onClick={handleSaveNickname}>저장</SaveButton>
            </>
          )}
        </ModalContent>
      </ModalOverlay>
        </div>
      </B1>
    </>
  );
}

export default ProfileBox;
