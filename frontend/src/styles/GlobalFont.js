import { createGlobalStyle } from "styled-components";
// import DungGeunMo from "../fonts/DungGeunMo.ttf";
// import OldGalmuri from "../fonts/Galmuri11.ttf";
// import NewGalmuriBold from "../fonts/ONE(Ed.) Galmuri11 Bold.ttf";
// import NewGalmuriRegular from "../fonts/ONE(Ed.) Galmuri11 Regular.ttf";
// import Pixel from "../fonts/pixelroborobo.otf";

const GlobalFont = createGlobalStyle`    
     @font-face {
  font-family: "DungGeunMo"; /* 사용할 폰트의 이름을 정의 */
  src: url("./fonts/DungGeunMo.ttf"); /* 폰트 파일의 위치 */
}

@font-face {
  font-family: "OldGalmuri";
  src: url("./fonts/Galmuri11.ttf");
}

@font-face {
  font-family: "NewGalmuriBold";
  src: url("./fonts/ONE(Ed.) Galmuri11 Bold.ttf");
}

@font-face {
  font-family: "NewGalmuriRegular";
  src: url("./fonts/ONE(Ed.) Galmuri11 Regular.ttf");
}

@font-face {
  font-family: "pixel";
  src: url("./fonts/pixelroborobo.otf");
}
`;

export default GlobalFont;
