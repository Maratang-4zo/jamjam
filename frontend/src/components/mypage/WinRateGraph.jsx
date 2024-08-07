import React from "react";
import ReactApexChart from "react-apexcharts";

class WinRateGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: props.series,
      options: {
        chart: {
          height: 350,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            strokeWidth: "50%",
            hollow: {
              size: "70%", // 모든 그래프의 hollow size를 동일하게 설정
            },
            dataLabels: {
              name: {
                color: "#000000",
              },
              value: {
                color: "#000000",
              },
              total: {
                show: false, // total 항목을 표시하지 않음
              },
            },
            track: {
              background: "#FFFFFF",
              strokeWidth: "80%",
            },
          },
        },
        colors: ["#000000"],
        labels: [props.label], // props.label을 labels에 설정
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="radialBar"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default WinRateGraph;
