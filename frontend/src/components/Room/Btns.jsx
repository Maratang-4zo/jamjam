import styled from "styled-components";
import AddIcon from "../../assets/add.png";
import ShareIcon from "../../assets/share.png";

const Container = styled.div`
  display: flex;
  width: 295.973px;
  justify-content: space-between;
  button {
    height: 40px;
    border-radius: 15px;
    /* border: 1px black solid; */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 2px 1px 0px #000000;
  }
  button:active {
    box-shadow: -1px -1px 1px 0px #000000;
  }
  .game {
    width: 120px;
    background-color: ${(props) => props.theme.pointBtnColor};
  }
  .game:hover {
    background-color: ${(props) => props.theme.pointBtnColor}dd;
  }

  .notgame {
    background-color: ${(props) => props.theme.mainBgColor};
    width: 60px;
  }
  .notgame:hover {
    background-color: ${(props) => props.theme.mainBgColor}dd;
  }
`;
function Btns() {
  return (
    <Container>
      <button className="game">GAME</button>
      <button className="notgame">
        <img src={AddIcon} />
      </button>
      <button className="notgame">
        <img src={ShareIcon} />
      </button>
    </Container>
  );
}

export default Btns;
