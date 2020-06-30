import React,{useState, useEffect} from "react";
import { Line } from "react-chartjs-2";

// line chart using chart.js node package
const LineChart = (props) => {
  const [maxVote, setMaxVote] = useState(5);
  const [items, setItems] = useState(props.data || []);
  
  // chart package object preparing method
  const chart = () => {
    let votes = [];
    let id = [];
        for (const dataObj of props.data) {
          
            
          votes.push(parseInt(dataObj.points));
          id.push(parseInt(dataObj.objectID));
        }
        setMaxVote(Math.max(...votes));
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
  const yScale = {yAxes: [{
      ticks: {
          min: 0, // it is for ignoring negative step.
          beginAtZero: true,
          max: maxVote,
          stepSize: Math.floor(maxVote / props.data.length) * 5
      }
  }]
};
  
  // useEffect(() => {
  //   chart();
  // },[items])
  return (
    <div>
      <div>
        <Line
          data={chart}
          width={600}
          height={400}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: yScale
          }}
        />
      </div>
    </div>
  );
};

export default LineChart;
