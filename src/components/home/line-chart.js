import React from "react";
import { Line } from "react-chartjs-2";

// line chart using chart.js node package
const LineChart = (props) => {
  // chart package object preparing method
  const chart = () => {
    let votes = [];
    let id = [];

        for (const dataObj of props.data) {
          votes.push(parseInt(dataObj.points));
          id.push(parseInt(dataObj.objectID));
        }
        let chartData = {
          labels: id,
          datasets: [
            {
              label: "Votes",
              data: votes,
              borderWidth: 4
            },
            {
                label: "ID",
                data: id,
                borderWidth: 4
              }
          ]
        };
    return chartData;
  };

  return (
    <div>
      <div>
        <Line
          data={chart}
          width={600}
          height={400}
          options={{
            responsive: true,
            maintainAspectRatio: false
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;
