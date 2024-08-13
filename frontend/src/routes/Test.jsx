import React from "react";
import styled, { keyframes } from "styled-components";

const WavyAni = keyframes`
    0% {
        --_i: calc(0 * var(--s));
    }
    12.5% {
        --_i: calc(0.5 * var(--s));
    }
    25% {
        --_i: calc(1 * var(--s));
    }
    37.5% {
        --_i: calc(1.5 * var(--s));
    }
    50% {
        --_i: calc(2 * var(--s));
    }
    62.5% {
        --_i: calc(2.5 * var(--s));
    }
    75% {
        --_i: calc(3 * var(--s));
    }
    87.5% {
        --_i: calc(3.5 * var(--s));
    }
    100% {
        --_i: calc(4 * var(--s));
    }
`;

const WavyButton = styled.button`
  --s: 0.2em; /* control the wave*/

  padding: 0.4em 0.5em;
  background-color: #000;
  color: #ffe845;
  --_s: calc(var(--s) * 4) 51% repeat-x;
  --_r: calc(1.345 * var(--s)) at left 50%;
  --_g1: #000 99%, #0000 101%;
  --_g2: #0000 99%, #000 101%;
  --mask: radial-gradient(var(--_r) top calc(var(--s) * 1.9), var(--_g1))
      calc(50% - 2 * var(--s) - var(--_i, 0px)) 0 / var(--_s),
    radial-gradient(var(--_r) top calc(var(--s) * -0.9), var(--_g2))
      calc(50% - var(--_i, 0px)) var(--s) / var(--_s),
    radial-gradient(var(--_r) bottom calc(var(--s) * 1.9), var(--_g1))
      calc(50% - 2 * var(--s) + var(--_i, 0px)) 100% / var(--_s),
    radial-gradient(var(--_r) bottom calc(var(--s) * -0.9), var(--_g2))
      calc(50% + var(--_i, 0px)) calc(100% - var(--s)) / var(--_s);
  -webkit-mask: var(--mask);
  mask: var(--mask);
  cursor: pointer;
  font-family: "DungGeunMo";
  font-weight: bold;
  font-size: 4rem;
  margin: 0;
  border: none;
  animation: ${WavyAni} 0.3s linear infinite paused;

  &:hover {
    animation-play-state: running;
    background-color: #000;
    color: #ffe845;
  }

  &:active {
    background-image: linear-gradient(#0004 0 0);
  }

  &:focus-visible {
    -webkit-mask: none;
    outline-offset: 0.1em;
    padding: 0.2em 0.5em;
    margin: 0.2em 0;
  }
`;

const Div = styled.div`
  height: 100vh;
  margin: 0;
  display: grid;
  grid-template-columns: auto auto;
  gap: 20px;
  place-content: center;
`;

function App() {
  return (
    <Div>
      <WavyButton>카카오톡으로 로그인</WavyButton>
    </Div>
  );
}

export default App;
