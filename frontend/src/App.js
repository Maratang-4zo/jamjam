import { createGlobalStyle, ThemeProvider } from "styled-components";
import { defaultTheme } from "./theme";
import Router from "./Router";
import { NavermapsProvider } from "react-naver-maps";
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil"; // RecoilRoot import
import SnapshotDebugger from "./utils/SnapShot";
// 기본 CSS 초기화하는 세팅
const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
	font-family: 'Source Sans Pro', sans-serif;
  background-color: ${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor}
}
a {
  text-decoration: none;
  color: inherit;
}
`;
function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <RecoilRoot>
          <SnapshotDebugger />
          <CookiesProvider>
            <NavermapsProvider
              ncpClientId={process.env.REACT_APP_NAVER_MAP_CLIENT_ID}
              submodules={["geocoder"]}
            >
              <GlobalStyle />
              <Router />
              {/* <ReactQueryDevtools initialIsOpen={true} /> */}
            </NavermapsProvider>
          </CookiesProvider>
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}

export default App;
