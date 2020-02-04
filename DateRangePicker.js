import React from 'react';
import DatePicker from 'react-datepicker';  // https://reactdatepicker.com/
//import { compareAsc, format } from 'date-fns'
import subDays from 'date-fns/subDays'
import "react-datepicker/dist/react-datepicker.css";
import './DateRangePicker.css';


let dateRangePickerFragment = "Date Range Picker Fragment";


class ItemTypesSelect extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         startDate : subDays(new Date(), props.initialDateInterval),
         endDate : new Date(),
         handleDateRangeChangedCallback: props.handleDateRangeChangedCallback
      }
   }


   setStartDate(newStartDate) {
//      console.log("DateRangePicker setStartDate ", newStartDate);

      this.setState({ startDate: newStartDate });

      if (this.state.handleDateRangeChangedCallback) {
         this.state.handleDateRangeChangedCallback(newStartDate, this.state.endDate);
      }
   }


   setEndDate(newEndDate) {
//      console.log("DateRangePicker setEndDate ", newEndDate);

      this.setState({ endDate: newEndDate });

      if (this.state.handleDateRangeChangedCallback) {
         this.state.handleDateRangeChangedCallback(this.state.startDate, newEndDate);
      }
   }

   

   render() {
      let today = new Date();

      let returnVal = 
      <React.Fragment key={dateRangePickerFragment}>
         <span className="dateRangePicker">
            <label className="labelStart">Start Date</label>
            <DatePicker
               className="datePickerStart"
               selected={this.state.startDate}
               onChange={date => this.setStartDate(date)}
               selectsStart
               startDate={this.state.startDate}
               endDate={this.state.endDate}
               maxDate={this.state.endDate}
               todayButton="Today"
            />
            <label className="labelEnd">End Date</label>
            <DatePicker
               className="datePickerEnd"
               selected={this.state.endDate}
               onChange={date => this.setEndDate(date)}
               selectsEnd
               startDate={this.state.startDate}
               endDate={this.state.endDate}
               minDate={this.state.startDate}
               maxDate={today}
               todayButton="Today"
            />
         </span>
      </ React.Fragment>

//   console.log("ItemTypes render");
   return returnVal;
   }
}

export default ItemTypesSelect;
