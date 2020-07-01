import React,{useState} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LineCharts = (props) => {
  const [maxVote, setMaxVote] = useState(5);
  let options;

  const chart = () => {
    let votes = [];
    let id = [];
    debugger
        for (const dataObj of props.data) {
          votes.push(parseInt(dataObj.points));
          id.push(parseInt(dataObj.objectID));
        }
        let options = {
          chart: {
            type: "spline"
          },
          title: {
            text: "Votes chart"
          },
          series: [
            {
              data: votes,
              name: 'ID'
            }
          ],
          xAxis: {
            categories: id,
            name:'Votes'
          },
        };
        return  <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />;
  };
  return (<div>
   {chart()}
  </div>
  );
};
export default LineCharts;