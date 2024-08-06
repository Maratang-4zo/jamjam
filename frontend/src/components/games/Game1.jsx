import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Mingang from "../../assets/Mingang.png"; // Assuming the correct path

const Block = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  bottom: ${(props) => props.bottom}px;
  transition: bottom 0.1s;
  background-image: url(${Mingang});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const WinMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  color: #ff0000;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const Countdown = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
  font-weight: bold;
  color: #000;
`;

function Game1({ handleClick }) {
  const [bottom, setBottom] = useState(0);
  const [win, setWin] = useState(false);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      handleClick.current = () => {
        if (!win) {
          setBottom((prevBottom) => {
            const newBottom = prevBottom + 10;
            if (newBottom >= 480) {
              // GameScreen height 530px - Block height 50px
              setWin(true);
            }
            return newBottom;
          });
        }
      };
    }
  }, [countdown, handleClick, win]);

  return (
    <>
      {countdown > 0 ? (
        <Countdown>{countdown === 1 ? "START" : countdown - 1}</Countdown>
      ) : (
        <>
          <Block bottom={bottom} />
          <WinMessage show={win}>WIN!!!</WinMessage>
        </>
      )}
    </>
  );
}

export default Game1;
