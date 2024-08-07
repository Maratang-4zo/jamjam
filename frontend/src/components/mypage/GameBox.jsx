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
        const response = await axiosGetWinRate();
        setWinRates(response.data.winRates); // winRates 배열을 가져온다고 가정
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
          series={winRate.value}
          label={winRate.label}
          hollowSize={winRate.winRate}
        />
      ))}
    </GraphContainer>
  );
}

export default GameBox;
