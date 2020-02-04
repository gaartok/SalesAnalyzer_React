import React from 'react';
import xmlObject from './xmlObject';
import axios from 'axios';
import AreaHeading from './AreaHeading';
//import AreaInput from './AreaInput';
import AreaSettings from './AreaSettings';
import ErrorBoundary from './ErrorBoundary';
//import AreaGraphResponsiveBump from './AreaGraphResponsiveBump';
import AreaGraphResponsiveBar from './AreaGraphResponsiveBar';
import AreaGraphResponsiveLine from './AreaGraphResponsiveLine';
import subDays from 'date-fns/subDays'
//import formatISO from 'date-fns/formatISO';
import './SalesAnalyzer.css';

// baseURL gets set in the constructor for this class. 
// Its value gets set to either productionBaseURL or devBaseURL
let baseURL = "Unknown";

// Pointer to location of php files on your local development server
let devBaseURL = "http://localhost/greygames/public_html/thoughtwaves/src/SalesAnalyzer/";

// Pointer to location of php files on the production server
let productionBaseURL = "http://thoughtwaves.com/portfolio/static/php/SalesAnalyzer/";

// Sets default Start Date: how many days back to display, from "today"
let initialDateInterval = 90;

let defaultGraphType = "Bar";



class SalesAnalyzer extends React.Component {
   constructor(props) {
      super(props);

//      console.log(window.location.href);

      if (window.location.href.indexOf("localhost") !== -1) {
//         console.log("Using devBaseURL");
         baseURL = devBaseURL;
      }
      else {
//         console.log("Using productionBaseURL");
         baseURL = productionBaseURL;
      }

      this.handleTypesChanged = this.handleTypesChanged.bind(this);
      this.handleGraphTypeChanged = this.handleGraphTypeChanged.bind(this);
      this.handleDateRangeChanged = this.handleDateRangeChanged.bind(this);
      this.state = {
         graphType: defaultGraphType,
         dataArrayLineComplete: [],
         dataArrayLineFiltered: [],
         dataArrayBarFiltered: [],
//         sizesArray: [],
         loadedDataNames: [],
         startDate : subDays(new Date(), initialDateInterval),
         endDate : new Date(),
//         graphDiv: null,
         graphSize: { "width": 1000, "height": 300 }
      }
    }



/*

const dataResponsiveLine = [
   {
   "id": "beer1",
   "color": "hsl(355, 70%, 50%)",
   "data": [ 
      ​{ x: "2018-03-02", y: 50 },
      ​{ x: "2018-03-03", y: 26 },
      ​{ x: "2018-03-04", y: null },
      ​{ x: "2018-03-05", y: 70 },
      ​{ x: "2018-03-06", y: 16 }
      ]
   },

   {
   "id": "beer2",
   "color": "hsl(355, 70%, 50%)",
   "data": [ 
      ​{ x: "2018-03-02", y: 50 },
      ​{ x: "2018-03-03", y: 26 },
      ​{ x: "2018-03-04", y: 85 },
      ​{ x: "2018-03-05", y: 70 },
      ​{ x: "2018-03-06", y: null }
      ]
   },

   {
   "id": "beer3",
   "color": "hsl(355, 70%, 50%)",
   "data": [ 
      ​{ x: "2018-03-02", y: null },
      ​{ x: "2018-03-03", y: null },
      ​{ x: "2018-03-04", y: 85 },
      ​{ x: "2018-03-05", y: 70 },
      ​{ x: "2018-03-06", y: 16 }
      ]
   },
]

*/



convertInputDataToResponsiveLine(theData) {
   let convertedArray = [];
   let dataLen = theData.length;
   for (var i = 0; i < dataLen; i++) {
      convertedArray.push({ "x" : theData[i].saleDate, "y" : parseInt(theData[i].totalOunces) });
      }

//   console.log("convertInputData ", convertedArray);
   return convertedArray;
}



/*


   {
   "id": "beer1",
   "color": "hsl(355, 70%, 50%)",
   "data": [ 
      ​{ x: "2018-03-02", y: 50 },
      ​{ x: "2018-03-03", y: 26 },
      ​{ x: "2018-03-04", y: null },
      ​{ x: "2018-03-05", y: 70 },
      ​{ x: "2018-03-06", y: 16 }
      ]
   },


const responsiveBarData = {
   keys: [ 'Synaptik Misfire', 'Hopped Up', 'Enlightenment' ],
   data: [
   {
     "date": "2018-03-02",
     "Synaptik Misfire": 159,
     "Hopped Up": 26,
     "Enlightenment": 118
   },
   {
     "date": "2018-03-03",
     "Synaptik Misfire": 85,
     "Hopped Up": 5,
     "Enlightenment": 85,
   }
 ]

}
*/


   // convertAndFilterDataArrayLineToDataArrayBar assumes that normalizeDataArray has already been called,
   // and that every data array in each of the items is the same length.
   convertAndFilterDataArrayLineToDataArrayBar(theData, startDate, endDate) {
      let keys = [];
      let data = [];
      let nextDataItem = {};
      let nextItemIndex = 0;
      let typeCount = theData.length;

//      console.log("convertAndFilterDataArrayLineToDataArrayBar theData = ", theData);

      for (nextItemIndex = 0; nextItemIndex < typeCount; nextItemIndex++) {
         keys.push(theData[nextItemIndex].id);
      }

      let startDateTime = startDate.getTime();
      let endDateTime = endDate.getTime();
//      console.log("startDate = ", startDateTime);
//      console.log("endDate = ", endDateTime);
      
      let dataCount = theData[0].data.length;
      for (var nextDataIndex = 0; nextDataIndex < dataCount; nextDataIndex++) {
         let nextDateTime = new Date(theData[0].data[nextDataIndex].x).getTime();
//         console.log("nextDate = ", nextDateTime);
         if ((nextDateTime >= startDateTime) && (nextDateTime <= endDateTime)) {
//            console.log("Keeping");
            nextDataItem = { "date": theData[0].data[nextDataIndex].x };
            for (nextItemIndex = 0; nextItemIndex < typeCount; nextItemIndex++) {
               nextDataItem[theData[nextItemIndex].id] = theData[nextItemIndex].data[nextDataIndex].y;
            }

         data.push(nextDataItem);
         }
      }

      let barData = { keys: keys, data: data };
//      console.log("convertAndFilterDataArrayLineToDataArrayBar ", barData);
      return barData;
   }



   filterDataArrayLine(nextConvertedLineData, startDate, endDate) {
      let startDateTime = startDate.getTime();
      let endDateTime = endDate.getTime();
      let filteredArray = [];

      let dataCount = nextConvertedLineData.length;
      for (var nextDataIndex = 0; nextDataIndex < dataCount; nextDataIndex++) {
         let nextDateTime = new Date(nextConvertedLineData[nextDataIndex].x).getTime();
//         console.log("nextDate = ", nextDateTime);
         if ((nextDateTime >= startDateTime) && (nextDateTime <= endDateTime)) {
//            console.log("Keeping");
            filteredArray.push(nextConvertedLineData[nextDataIndex]);
            }
         }

      return filteredArray;
   }


   isXValInDataArray(xVal, dataArray) {
      let nextIndex = 0;
      let arraySize = dataArray.length;
      for (nextIndex = 0; nextIndex < arraySize; nextIndex++) {
//         console.log("Comparing ", xVal, " to ", dataArray[nextIndex].x);
         if (dataArray[nextIndex].x === xVal) {
//            console.log("  Match");
            return true;
         }
      }

//      console.log("  No Match");
      return false;
   }



   normalizeDataArray(dataArray) {
      let arrayCount = dataArray.length;
      let sourceArrayIndex;

      if (arrayCount < 2) {
         return dataArray;
      }

      for (sourceArrayIndex = 0; sourceArrayIndex < arrayCount; sourceArrayIndex++) {
         let sourceArrayDataSize = dataArray[sourceArrayIndex].data.length;
//         console.log("sourceArray = ", dataArray[sourceArrayIndex].id, "  length = ", sourceArrayDataSize);
         for (var destArrayIndex = 0; destArrayIndex < arrayCount; destArrayIndex++) {
            if (sourceArrayIndex !== destArrayIndex) {
//               console.log("destArray = ", dataArray[destArrayIndex].id);
               for (var i = 0; i < sourceArrayDataSize; i++) {
//                  console.log(dataArray[sourceArrayIndex].data[i].x);
                  if (!this.isXValInDataArray(dataArray[sourceArrayIndex].data[i].x, dataArray[destArrayIndex].data)) {
                     dataArray[destArrayIndex].data.push({ "x" : dataArray[sourceArrayIndex].data[i].x, "y" : null });
                  }
               }
            }
         }
      }

      for (sourceArrayIndex = 0; sourceArrayIndex < arrayCount; sourceArrayIndex++) {
         dataArray[sourceArrayIndex].data.sort(function(a, b) { return a.x > b.x }); 
      }
      return dataArray;
   }


   
   getSalesData = async (nextIndex, nextItemData) => {
      if (!nextItemData || !nextItemData[nextIndex]) {
         this.setState({ dataArray:[] });
         return;
      }
      let salesDataURL = baseURL + "SalesDataByDay.php?itemID=" + nextItemData[nextIndex].value;
//                                  "&startDate=" + formatISO(this.state.startDate, { representation: 'date' }) +
//                                  "&endDate=" + formatISO(this.state.endDate, { representation: 'date' });

//      console.log("getSalesData");
//      console.log("nextIndex = ", nextIndex);
//      console.log("nextItemData = ", nextItemData);
//      console.log("salesDataURL = ", salesDataURL);

      return await axios.get(salesDataURL)
      .then(function (response) {
         let parser = new DOMParser();
         let xmlDoc = parser.parseFromString(response.data, "text/xml");
//         console.log("xmlDoc = ", xmlDoc);
         let xmlData = new xmlObject();
         let dataArray = [];
         xmlData.fromXML(xmlDoc);
         let itemTypes = xmlData.getFirstObject("Sales");
         let nextObject = itemTypes.getFirstObject("NextSale");
         while (nextObject) {
            let totalOunces = nextObject.getFirstObject("totalOunces").value;
            let saleDate = nextObject.getFirstObject("saleDate").value;
            dataArray.push({ 
                           totalOunces: totalOunces,
                           saleDate: saleDate
                           });

            nextObject = itemTypes.getNextObject("NextSale");
         }

//         console.log("dataArray = ", dataArray);
         let dataArrayAllLine = this.state.dataArrayLineComplete;
         let nextConvertedLineData = this.convertInputDataToResponsiveLine(dataArray);
         dataArrayAllLine.push({ id:nextItemData[nextIndex].label, data: nextConvertedLineData });
//         console.log("dataArrayAllLine = ", dataArrayAllLine);
         let normalizedData = this.normalizeDataArray(dataArrayAllLine);
//         console.log("normalizedData = ", normalizedData);
         this.setState({ dataArrayLineComplete:normalizedData });

         let barData = this.convertAndFilterDataArrayLineToDataArrayBar(normalizedData, this.state.startDate, this.state.endDate);
//         console.log("barData = ", barData);
         this.setState({ dataArrayBarFiltered: barData });

         let dataArrayAllLineFiltered = this.state.dataArrayLineFiltered;
         let nextFilteredLineData = this.filterDataArrayLine(nextConvertedLineData, this.state.startDate, this.state.endDate);
         dataArrayAllLineFiltered.push({ id:nextItemData[nextIndex].label, data: nextFilteredLineData });
         this.setState({ dataArrayLineFiltered: dataArrayAllLineFiltered });
      }.bind(this))
      .catch(function (error) {
         console.log(error);
      });
   };

   

   isIDInDataArray(dataName) {
      let nextIndex = 0;
      let arraySize = this.state.dataArrayLineComplete.length;
      for (nextIndex = 0; nextIndex < arraySize; nextIndex++) {
         if (this.state.dataArrayLineComplete[nextIndex].id === dataName) {
            return true;
         }
      }

      return false;
   }


   // Format of dataIn:  { itemID, itemName, salesData }
   handleSizeChanged(dataIn) {
//      console.log("App handleSizeChanged: ", dataIn);
   }


   handleTypesChanged(dataIn) {
//      console.log("App handleTypesChanged");
//      console.log("dataIn = ", dataIn);
//      console.log("dataArrayLineComplete = ", this.state.dataArrayLineComplete);

      if (!dataIn || (dataIn.length === 0)) {
         // All Types were removed.
         this.setState({ dataArrayLineComplete:[] });
         this.setState({ dataArrayLineFiltered:[] });
         this.setState({ dataArrayBarFiltered:[] });
         this.setState({ loadedDataNames:[] });
         return;
      }

      // Add any new Types
      let nextDataInIndex = 0;
      let dataInSize = dataIn.length;
      for (nextDataInIndex = 0; nextDataInIndex < dataInSize; nextDataInIndex++) {
         if (!this.isIDInDataArray(dataIn[nextDataInIndex].label)) {
            this.getSalesData(nextDataInIndex, dataIn);
         }
      }

      // Remove any deleted Types.  
      // If we got here, only a single Type at a time will be removed.
      let foundInArray = false;
      let arrayLineSize = this.state.dataArrayLineComplete.length;
      for (let nextLineIndex = 0; nextLineIndex < arrayLineSize; nextLineIndex++) {
         foundInArray = false;
         for (nextDataInIndex = 0; (nextDataInIndex < dataInSize) && !foundInArray; nextDataInIndex++) {
            if (this.state.dataArrayLineComplete[nextLineIndex].id === dataIn[nextDataInIndex].label) {
               foundInArray = true;
            }
         }

         if (foundInArray === false) {
            // Array has been removed.
//            console.log("Array has been removed: ", this.state.dataArrayLineComplete[nextLineIndex].id);
            let tempArray = this.state.dataArrayLineComplete;
            tempArray.splice(nextLineIndex, 1);
            this.setState({dataArrayLineComplete : tempArray });

            // Use handleDateRangeChanged to rebuild the other arrays.
            this.handleDateRangeChanged(this.state.startDate, this.state.endDate);
            return;
         }
      }
   }


   handleGraphTypeChanged(dataIn) {
//      console.log("App handleGraphTypeChanged ", dataIn);
      this.setState({ graphType: dataIn.label });
   }
   


   handleDateRangeChanged(startDate, endDate) {
//      console.log("SalesAnalyzer handleDateRangeChanged ", startDate, " ", endDate);
      this.setState({ startDate: startDate });
      this.setState({ endDate: endDate });

      let barData = this.convertAndFilterDataArrayLineToDataArrayBar(this.state.dataArrayLineComplete, startDate, endDate);
      this.setState({ dataArrayBarFiltered: barData });

      let nextIndex = 0;
      let dataArrayAllLineFiltered = [];
      let arraySize = this.state.dataArrayLineComplete.length;
      for (nextIndex = 0; nextIndex < arraySize; nextIndex++) {
         let nextFilteredLineData = this.filterDataArrayLine(this.state.dataArrayLineComplete[nextIndex], startDate, endDate);
         dataArrayAllLineFiltered.push(nextFilteredLineData);
      }
      this.setState({ dataArrayLineFiltered: dataArrayAllLineFiltered });
   }


   componentDidMount() {
//      console.log("SalesAnalyzer componentDidMount");

/*
      let graphDivWidth = document.getElementById('areaGraph').clientWidth;
      let graphDivHeight = document.getElementById('areaGraph').clientHeight;
      this.setState({ graphSize: { "width": graphDivWidth, "height": graphDivHeight } });
//      if (document.getElementById("areaGraph")) {
         console.log("Setting areaGraph size: ", graphDivWidth, ", ", graphDivHeight);
         document.getElementById("areaGraph").style.width = graphDivWidth;
         document.getElementById("areaGraph").style.height = graphDivHeight;
//      }
*/  
/*
      if (this.state.graphDiv) {
         let graphDivHeight = this.state.graphDiv.clientHeight;
         let graphDivWidth = this.state.graphDiv.clientWidth;
//      let graphDivHeight = document.getElementById('areaGraph').clientHeight;
//      let graphDivWidth = document.getElementById('areaGraph').clientWidth;
         document.getElementById('lineChart').clientHeight = graphDivHeight;
         document.getElementById('lineChart').clientHeight = graphDivWidth;
         this.setState({ graphSize: { "width": graphDivWidth, "height": graphDivHeight } });
      }
*/
   }


//   <AreaInput baseURL={baseURL} />


   render() {
//      console.log("SalesAnalyzer render");

/*
      if (document.getElementById("areaGraph")) {
         const element = document.querySelector('#areaGraph');
         const style = getComputedStyle(element);
         console.log("style = ", style);
         console.log("height = ", document.getElementById("areaGraph").style.height);
      }
*/

      let returnVal =
         <div className="entirePage">
            <AreaHeading />
            <AreaSettings 
               initialDateInterval = {initialDateInterval}
               handleSizeChangedCallback={this.handleSizeChanged}
               handleTypesChangedCallback={this.handleTypesChanged}
               handleGraphTypeChangedCallback={this.handleGraphTypeChanged}
               handleDateRangeChangedCallback={this.handleDateRangeChanged}
               baseURL={baseURL}
            />
            <ErrorBoundary>
               <div id="areaGraph" className="areaGraph">
                  { this.state.graphType === 'Line' ? <AreaGraphResponsiveLine dataArray={this.state.dataArrayLineFiltered} graphSize={this.state.graphSize} />
                  : this.state.graphType === 'Bar' ?  <AreaGraphResponsiveBar dataArray={this.state.dataArrayBarFiltered} graphSize={this.state.graphSize} />
                  : <p>Please choose a graph type</p>
                  }
               </div>
            </ErrorBoundary>
         </div>

      return returnVal;
   }
}

export default SalesAnalyzer;

