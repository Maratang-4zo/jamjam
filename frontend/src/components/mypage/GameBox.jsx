import React, { useState, useEffect } from "react";
import styled from "styled-components";
import WinRateGraph from "./WinRateGraph";
import { axiosGetWinRate } from "../../apis/loginApi";

const GraphContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

function GameBox() {
  const [winRates, setWinRates] = useState([]);

  useEffect(() => {
    const fetchWinRates = async () => {
      try {
        const winRates = await axiosGetWinRate();
        setWinRates(winRates);
      } catch (error) {
        console.error("승률 가져오기 실패", error);
      }
    };

    fetchWinRates();
  }, []);

  if (winRates.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <GraphContainer>
      {winRates.map((winRate, index) => (
        <WinRateGraph
          key={index}
          series={[winRate.winRate]}
          label={winRate.gameName}
        />
      ))}
    </GraphContainer>
  );
}

export default GameBox;
