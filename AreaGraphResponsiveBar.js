import React from "react";
import { ResponsiveBar } from '@nivo/bar'
//import './AreaGraph.css';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.


/*

const responsiveBarData = {
   keys: [ 'hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut' ],
   data: [
   {
     "country": "AD",
     "hot dog": 69,
     "burger": 159,
     "sandwich": 26,
     "kebab": 118,
     "fries": 123,
     "donut": 23,
   },
   {
     "country": "AE",
     "hot dog": 132,
     "burger": 133,
     "sandwich": 60,
     "kebab": 150,
     "fries": 151,
     "donut": 113,
   },
   {
     "country": "AF",
     "hot dog": 17,
     "burger": 106,
     "sandwich": 102,
     "kebab": 70,
     "fries": 176,
     "donut": 7,
   },
   {
     "country": "AG",
     "hot dog": 130,
     "burger": 115,
     "sandwich": 115,
     "kebab": 16,
     "fries": 185,
     "donut": 160,
   },
   {
     "country": "AI",
     "hot dog": 9,
     "burger": 70,
     "sandwich": 194,
     "kebab": 156,
     "fries": 5,
     "donut": 196,
   },
   {
     "country": "AL",
     "hot dog": 103,
     "burger": 130,
     "sandwich": 156,
     "kebab": 137,
     "fries": 63,
     "donut": 13,
   },
   {
     "country": "AM",
     "hot dog": 38,
     "burger": 85,
     "sandwich": 5,
     "kebab": 85,
     "fries": 119,
     "donut": 46,
   }
 ]

}

*/


class AreaGraph extends React.Component {
   constructor(props, context){
      super(props, context);
      this.state = {

      }
   }


render() {
   let theData = { keys: [], data: [] };

//   console.log("dataArray = ", this.props.dataArray);
   if (this.props.dataArray.data) {
      theData = this.props.dataArray;
//      console.log("theData = ", theData);
   }

   return(
//      <div className="lineChart">
         <ResponsiveBar
            data={theData.data}
            keys={theData.keys}
            indexBy="date"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            colors={{ scheme: 'nivo' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 45,
                  type: 'time',
                  precision: 'every 7 days',
//                  legend: 'date',
                  legendPosition: 'middle',
                  legendOffset: 32
            }}
            axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Quantity (ounces)',
                  legendPosition: 'middle',
                  legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            legends={[
                  {
                     dataFrom: 'keys',
                     anchor: 'bottom-right',
                     direction: 'column',
                     justify: false,
                     translateX: 120,
                     translateY: 0,
                     itemsSpacing: 2,
                     itemWidth: 100,
                     itemHeight: 20,
                     itemDirection: 'left-to-right',
                     itemOpacity: 0.85,
                     symbolSize: 20,
                     effects: [
                        {
                           on: 'hover',
                           style: {
                              itemOpacity: 1
                           }
                        }
                     ]
                  }
            ]}
            animate={false}
            motionStiffness={90}
            motionDamping={15}
         />         
//      </div>
   );
}
}


export default AreaGraph


