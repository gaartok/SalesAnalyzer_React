import React from "react";
import { ResponsiveAreaBump } from '@nivo/bump';
import './AreaGraph.css';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.




/*
const dataResponsiveAreaBump = [
   {
     "id": "JavaScript",
     "data": [
       {
         "x": 2000,
         "y": 28
       },
       {
         "x": 2001,
         "y": 25
       },
       {
         "x": 2002,
         "y": 13
       },
       {
         "x": 2003,
         "y": 18
       },
       {
         "x": 2004,
         "y": 19
       },
       {
         "x": 2005,
         "y": 15
       }
     ]
   },
   {
     "id": "ReasonML",
     "data": [
       {
         "x": 2000,
         "y": 13
       },
       {
         "x": 2001,
         "y": 20
       },
       {
         "x": 2002,
         "y": 23
       },
       {
         "x": 2003,
         "y": 14
       },
       {
         "x": 2004,
         "y": 19
       },
       {
         "x": 2005,
         "y": 24
       }
     ]
   },
   {
     "id": "TypeScript",
     "data": [
       {
         "x": 2000,
         "y": 22
       },
       {
         "x": 2001,
         "y": 25
       },
       {
         "x": 2002,
         "y": 10
       },
       {
         "x": 2003,
         "y": 29
       },
       {
         "x": 2004,
         "y": 14
       },
       {
         "x": 2005,
         "y": 22
       }
     ]
   },
   {
     "id": "Elm",
     "data": [
       {
         "x": 2000,
         "y": 13
       },
       {
         "x": 2001,
         "y": 12
       },
       {
         "x": 2002,
         "y": 16
       },
       {
         "x": 2003,
         "y": 29
       },
       {
         "x": 2004,
         "y": 25
       },
       {
         "x": 2005,
         "y": 20
       }
     ]
   },
   {
     "id": "CoffeeScript",
     "data": [
       {
         "x": 2000,
         "y": 25
       },
       {
         "x": 2001,
         "y": 10
       },
       {
         "x": 2002,
         "y": 25
       },
       {
         "x": 2003,
         "y": 27
       },
       {
         "x": 2004,
         "y": 30
       },
       {
         "x": 2005,
         "y": 24
       }
     ]
   }
 ];
*/


class AreaGraphResponsiveBump extends React.Component {
   render() {
//      let theData = dataResponsiveAreaBump;
      let theData = [];

//      console.log("AreaGraph render");
//      console.log(this.props.dataArray);

      if (this.props.dataArray.length > 0) {
         theData = this.props.dataArray;
//         console.log("theData = ", theData);
      }

      return(
         <div className="lineChart">
            <ResponsiveAreaBump
               data={ theData }
               margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
               spacing={8}
               colors={{ scheme: 'nivo' }}
               blendMode="multiply"
               startLabel="id"
               axisTop={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: '',
                  legendPosition: 'middle',
                  legendOffset: -36
               }}
               axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: '',
                  legendPosition: 'middle',
                  legendOffset: 32
               }}
            />
         </div>
      );
   }
}

export default AreaGraphResponsiveBump


