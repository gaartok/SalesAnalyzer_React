import React from 'react';
import ItemsSelector from './ItemsSelector';
import './SalesAnalyzer.css';


class AreaSettings extends React.Component {
   constructor(props) {
      super(props);
      this.handleSizeChanged = this.handleSizeChanged.bind(this);
      this.handleTypesChanged = this.handleTypesChanged.bind(this);
      this.handleGraphTypeChanged = this.handleGraphTypeChanged.bind(this);
      this.handleDateRangeChanged = this.handleDateRangeChanged.bind(this);
      this.state = {
         baseURL: props.baseURL,
         initialDateInterval: props.initialDateInterval,
         handleSizeChangedCallback: props.handleSizeChangedCallback,
         handleTypesChangedCallback: props.handleTypesChangedCallback,
         handleGraphTypeChangedCallback: props.handleGraphTypeChangedCallback,
         handleDateRangeChangedCallback: props.handleDateRangeChangedCallback
      };
    }


    handleSizeChanged(valueArray) {
//      console.log("AreaSettings handleSizeChanged  ", valueArray);
      if (this.state.handleSizeChangedCallback) {
         this.state.handleSizeChangedCallback(valueArray);
      }
   }


   handleTypesChanged(valueArray) {
//      console.log("AreaSettings handleTypesChanged ", valueArray);

      // 0: Object { value: "44", label: "Batch 80" }
      // 1: Object { value: "45", label: "Cliffside Hopped Up" }
      // 2: Object { value: "32", label: "Cliffside Pinky Out Stout" }
      if (this.state.handleTypesChangedCallback) {
         this.state.handleTypesChangedCallback(valueArray);
      }
   }


   handleGraphTypeChanged(valueArray) {
//      console.log("AreaSettings handleGraphTypeChanged");
//      console.log(valueArray);
      if (this.state.handleGraphTypeChangedCallback) {
         this.state.handleGraphTypeChangedCallback(valueArray);
      }
   }


   handleDateRangeChanged(startDate, endDate) {
//      console.log("AreaSettings handleDateRangeChanged: ", startDate, " ", endDate);
      if (this.state.handleDateRangeChangedCallback) {
         this.state.handleDateRangeChangedCallback(startDate, endDate);
      }
   }
   

   render() {
      let returnVal = 
         <div className="areaSettings">
            <ItemsSelector 
               baseURL={this.state.baseURL}
               initialDateInterval={this.state.initialDateInterval} 
               handleSizeChangedCallback={this.handleSizeChanged}
               handleTypesChangedCallback={this.handleTypesChanged} 
               handleGraphTypeChangedCallback={this.handleGraphTypeChanged} 
               handleDateRangeChangedCallback={this.handleDateRangeChanged} 
            />
         </div>

      return returnVal;
   }
}

export default AreaSettings;
