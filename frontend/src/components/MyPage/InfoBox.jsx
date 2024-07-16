import styled from "styled-components";
import UserInfo from "./UserInfo";

const Container = styled.div`
  width: 530px;
  border: 3px black solid;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.navBgColor};
`;

const Bar = styled.div`
  height: 50px;
  border-radius: 20px 20px 0 0;
  border-bottom: 3px black solid;
  background-color: ${(props) => props.theme.mainPointBgColor};
`;

const Content = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Img = styled.img``;

function InfoBox() {
  return (
    <Container>
      <Bar>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
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
          width="33"
          height="32"
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
      </Bar>
      <Content>
        <Img></Img>
        <h1>hi</h1>
        <UserInfo />
      </Content>
    </Container>
  );
}

export default InfoBox;
