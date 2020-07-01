import React,{useState} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LineCharts = (props) => {
  const chart = () => {
    let votes = [];
    let id = [];
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
              name: 'Votes'
            }
          ],
          xAxis: {
            categories: id,
            name: 'ID'
          },
          yAxis: {
            title: {
              text: "Votes"
          }
          }
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