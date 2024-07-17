import styled from "styled-components";
import UserInfo from "./UserInfo";
import { useState } from "react";
import GameHistory from "./GameHistory";

const Container = styled.div`
  box-shadow: 4px 4px 10px 0px #000;
  width: 350px;
  height: 550px;
  border: 3px black solid;
  border-radius: 20px;
  display: flex;
  flex-direction: column;

  background-color: ${(props) => props.theme.navBgColor};
`;

const Bar = styled.div`
  height: 40px;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 10px;
  border-radius: 20px 20px 0 0;
  border-bottom: 3px black solid;
  background-color: ${(props) => props.theme.mainPointBgColor};
  svg {
    margin-left: 5px;
  }
`;

const Main = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const Btns = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  background-color: #bcbcbc;
  border-radius: 15px;
  padding: 0 10px;
`;

const Switch = styled.input.attrs({ type: "checkbox" })`
  height: 25px;
  width: 45px;
  background-color: ${(props) => props.theme.mainBgColor}; /* 기본 배경색 */
  border-radius: 1em; /* 둥근 모서리 */
  position: relative;
  cursor: pointer;
  transition: background-position 0.15s ease-in-out;
  appearance: none;
  outline: none;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0.25em;
    width: 1em;
    height: 1em;
    background-color: ${(props) =>
      props.theme.btnColor}; /* 스위치 원을 노란색으로 변경 */
    border-radius: 50%;
    transform: translateY(-50%);
    transition: left 0.15s ease-in-out;
  }

  &:checked {
    background-color: ${(props) =>
      props.theme.btnColor}; /* 체크된 상태의 배경색 (부트스트랩 기본) */
    background-position: right center;

    &:before {
      left: calc(100% - 1.25em); /* 스위치 원의 위치 조정 */
      background-color: ${(props) =>
        props.theme.mainBgColor}; /* 체크된 상태의 배경색 (부트스트랩 기본) */
    }
  }
`;
const Content = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImgBox = styled.div`
  height: 200px;
  width: 200px;
  margin-bottom: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.btnColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid black;
`;
const Img = styled.img`
  height: 180px;
  width: 180px;
  border-radius: 50%;
`;

const Label = styled.label`
  color: white;
  width: 75px;
  text-align: center;
  padding: 1px;
  border-radius: 20px;
`;

function InfoBox() {
  const [userOn, setUserOn] = useState(true);
  const toggleUserGame = () => setUserOn((prev) => !prev);
  return (
    <Container>
      <Bar>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 32 32"
          fill="none"
        >
          <g filter="url(#filter0_d_72_155)">
            <rect width="29.271" height="30" rx="5" fill="#FFD459" />
          </g>
          <line
            x1="7.58875"
            y1="14.8055"
            x2="20.5981"
            y2="14.8055"
            stroke="black"
            stroke-width="1.5"
          />
          <defs>
            <filter
              id="filter0_d_72_155"
              x="0"
              y="0"
              width="31.271"
              height="32"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="2" dy="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_72_155"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_72_155"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 33 32"
          fill="none"
        >
          <g filter="url(#filter0_d_72_152)">
            <rect
              x="0.94397"
              width="29.271"
              height="30"
              rx="5"
              fill="#FFD459"
            />
          </g>
          <rect
            x="11.4509"
            y="10.75"
            width="9.34112"
            height="9.61111"
            stroke="black"
            stroke-width="1.5"
          />
          <defs>
            <filter
              id="filter0_d_72_152"
              x="0.94397"
              y="0"
              width="31.271"
              height="32"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="2" dy="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_72_152"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_72_152"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 33 32"
          fill="none"
        >
          <g filter="url(#filter0_d_131_93)">
            <rect
              x="0.971924"
              width="29.271"
              height="30"
              rx="5"
              fill="#FFD459"
            />
          </g>
          <line
            x1="8.53033"
            y1="8.46967"
            x2="22.0396"
            y2="21.9789"
            stroke="black"
            stroke-width="1.5"
          />
          <line
            x1="8.46967"
            y1="21.9789"
            x2="21.9789"
            y2="8.46966"
            stroke="black"
            stroke-width="1.5"
          />
          <defs>
            <filter
              id="filter0_d_131_93"
              x="0.971924"
              y="0"
              width="31.271"
              height="32"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="2" dy="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_131_93"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_131_93"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </Bar>
      <Main>
        <ImgBox>
          <Img></Img>
        </ImgBox>
        <Btns>
          <Label for="switch">내 정보</Label>
          <Switch onClick={toggleUserGame} id="switch" />
          <Label for="switch">게임 승률</Label>
        </Btns>
        <Content>{userOn ? <UserInfo /> : <GameHistory />}</Content>
      </Main>
    </Container>
  );
}

export default InfoBox;
