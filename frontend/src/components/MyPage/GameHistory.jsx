import { useState } from "react";
import ApexChart from "react-apexcharts";

function GameHistory() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="radialBar"
          series={[76, 67]}
          options={{
            theme: {
              mode: "light",
            },
            chart: {
              height: 390,
              type: "radialBar",
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            plotOptions: {
              radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                  margin: 5,
                  size: "30%",
                  background: "transparent",
                  image: undefined,
                },
                dataLabels: {
                  name: {
                    show: false,
                  },
                  value: {
                    show: false,
                  },
                },
                barLabels: {
                  enabled: true,
                  useSeriesColors: true,
                  offsetX: -8,
                  fontSize: "16px",
                  formatter: function (seriesName, opts) {
                    return (
                      seriesName +
                      ": " +
                      opts.w.globals.series[opts.seriesIndex] +
                      "%"
                    );
                  },
                },
              },
            },
            colors: [`#61B752`, "#fc94c0"],
            labels: ["틀린그림찾기", "숫자카드"],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: false,
                  },
                },
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default GameHistory;
