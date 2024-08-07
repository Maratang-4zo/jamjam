import React from "react";
import ReactApexChart from "react-apexcharts";

class WinRateGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [props.series],
      options: {
        chart: {
          height: 350,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            strokeWidth: "50%",
            hollow: {
              size: `${props.hollowSize}%`, // hollow size를 props로 받아서 설정
            },
            dataLabels: {
              name: {
                color: "#000000",
              },
              value: {
                color: "#000000",
              },
              total: {
                show: true,
                label: "TOTAL",
                color: "#000000",
              },
            },
            track: {
              background: "#FFFFFF",
              strokeWidth: "80%",
            },
          },
        },
        colors: ["#000000"],
        labels: [props.label],
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
