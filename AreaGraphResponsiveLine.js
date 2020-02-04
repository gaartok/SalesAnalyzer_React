import React from "react";
//import { ResponsiveLine } from '@nivo/line'
import { ResponsiveLineCanvas } from '@nivo/line'
//import './AreaGraph.css';


// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

/*
let testData = [
   {
      "id":"TestData", 
      "data": [
         {"x":"2018-03-30","y":"16"},
         {"x":"2018-03-31","y":"32"},
         {"x":"2018-04-06","y":"18"},
         {"x":"2018-04-07","y":"33"},
         {"x":"2018-04-13","y":"15"},
         {"x":"2018-04-14","y":"29"},
         {"x":"2018-04-20","y":"8" },
         {"x":"2018-04-21","y":"25"},
         {"x":"2018-04-27","y":"24"},
         {"x":"2018-04-28","y":"29"},
         {"x":"2018-05-04","y":"14"},
         {"x":"2018-05-05","y":"7" },
         {"x":"2018-05-11","y":"25"}
      ]
   }
];
*/



class AreaGraphResponsiveLine extends React.Component {
   constructor(props , context){
      super(props ,context);
      this.state = {

      }
   }


   render() {
      let theData = [];

      if (this.props.dataArray.length > 0) {
         theData = this.props.dataArray;
      }

      console.log("Line render");

      return(
//         <div className="lineChart">
            <ResponsiveLineCanvas
               data={theData}
               margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
/*
               xScale={{
                type: 'time',
                format: '%Y-%m-%d',
//                format: '%Y-%b',
//                format: '%Y',
                precision: 'day'
              }}
*/
/*
               xScale={{
                  type: 'time',
                  format: '%Y-%m-%d',
                  precision: 'day',
               }}
               xFormat="time:%Y-%m-%d"
*/               
               yScale={{ type: 'linear', stacked: true, min: 0 }}

               enableArea={false}
               curve="linear"
               axisTop={null}

               axisRight={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  format: '.2s',
//                  legend: 'Quantity (ounces)',
                  legendOffset: 0
               }}

               axisBottom={{
//                  format: '%b %d',
//                  format: '%Y-%m-%d',
                  type: 'time',
                  tickValues: 'every 7 days',
//                  legend: 'time scale',
                  legendOffset: -12,                  
/*
                     tickSize: 5,
                     tickPadding: 5,
                     tickRotation: 0,
                     format: '.2f', 
*/
                     tickRotation: 45,
//                     legend: 'date',
//                     legendOffset: 36,
//                     legendPosition: 'middle'
               }}
               axisLeft={{
                     tickSize: 5,
                     tickPadding: 5,
                     tickRotation: 0,
                     format: '.2s',
                     legend: 'Quantity (ounces)',
                     legendOffset: -40,
                     legendPosition: 'middle'
               }}
               enableGridX={false}
               colors={{ scheme: 'spectral' }}
               lineWidth={1}
               enablePoints={true}
               pointSize={4}
//               pointSize={4}
               pointColor={{ theme: 'background' }}
               pointBorderWidth={1}
               pointBorderColor={{ from: 'serieColor' }}
               enablePointLabel={false}
               pointLabel="y"
               pointLabelYOffset={-12}
               useMesh={true}
//               gridXValues={[ 0, 20, 40, 60, 80, 100, 120 ]}
//               gridYValues={[ 0, 500, 1000, 1500, 2000, 2500 ]}
               legends={[
                     {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 140,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 12,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',

                        effects: [
                           {
                           on: 'hover',
                           style: {
                              itemBackground: 'rgba(0, 0, 0, .03)',
                              itemOpacity: 1
                           }
                           }
                        ]

                     }
               ]}
            />
//         </ div>
      )
   }
}


export default AreaGraphResponsiveLine
