import React from 'react';
import Select from 'react-select';
import DateRangePicker from './DateRangePicker';
import axios from 'axios';
import './ItemsSelector.css';

let itemsSelectorFragment = "Items Selector Fragment";


class ItemsSelector extends React.Component {
   constructor(props) {
      super(props);
      this.handleSizeChanged = this.handleSizeChanged.bind(this);
      this.handleTypesChanged = this.handleTypesChanged.bind(this);
      this.handleGraphTypeChanged = this.handleGraphTypeChanged.bind(this);
      this.handleDateRangeChanged = this.handleDateRangeChanged.bind(this);
      this.state = {
        baseURL: props.baseURL,
        initialDateInterval: props.initialDateInterval,
        sizesListAll: [],
        typesListAll: [],
        handleTypesChangedCallback: props.handleTypesChangedCallback,
        handleSizeChangedCallback: props.handleSizeChangedCallback,
        handleGraphTypeChangedCallback: props.handleGraphTypeChangedCallback,
        handleDateRangeChangedCallback: props.handleDateRangeChangedCallback,
        graphTypes: [ { value: "1", label: "Line" },  { value: "2", label: "Bar" } ]
      };
   }



   getItemSizes = async () => {
//   getItemSizes() {
      let itemSizesURL = this.state.baseURL + "ItemSizes.php"
      let jsonHeaders = new Headers({ 
         'Content-Type': 'application/json',
         'redirect': 'error',
         'mode': 'cors'
      });

//      console.log("getItemSizes: itemSizesURL = ", itemSizesURL);

      fetch(itemSizesURL, { 
         method: 'GET',
         headers: jsonHeaders })
      .then((response) => {
         if (response.ok) {
//            console.log(response);
            response.text().then((data) => {
//               console.log(data);
               let jsonData = JSON.parse(data);
//               console.log(jsonData);
               let dataArray = [];
               for (let i = 0, length = jsonData.length; i < length; i++) {
                  dataArray.push({ value: jsonData[i].ID, label: jsonData[i].Name });
               }

               this.setState({ sizesListAll: dataArray })
            });
         }
         else {
            console.log("Error retrieving data. Status = ", response.status);
         }
      }, (err) => {
         console.log(err);
        });
   }



   getItemTypes = async (typesArray) => {
      let itemTypeURL = this.state.baseURL + "ItemTypes.php?sizeID=" + typesArray[0];

      return await axios.get(itemTypeURL)
      .then(function (response) {
         let dataArray = [];
         for (let i = 0, length = response.data.length; i < length; i++) {
            dataArray.push({ value: response.data[i].ID, label: response.data[i].Name });
         }

//         console.log("getItemTypes: ", dataArray);
         this.setState({ typesListAll: dataArray });
      }.bind(this))
      .catch(function (error) {
         console.log(error);
      });
   };


   componentDidMount() {
      this.getItemSizes();
   }   


   handleSizeChanged(selectedSizes) {
//      console.log("ItemsSelector handleSizeChanged: ", selectedSizes);
      let typesArray = [selectedSizes.value];
      this.getItemTypes(typesArray);
      if (this.state.handleSizeChangedCallback) {
         this.state.handleSizeChangedCallback(selectedSizes);
      }
   }



   handleTypesChanged(valueArray) {
//      console.log("ItemsSelector handleTypesChanged: ", valueArray);
      if (this.state.handleTypesChangedCallback) {
         this.state.handleTypesChangedCallback(valueArray);
      }
   }


   handleGraphTypeChanged(valueArray) {
//      console.log("ItemsSelector handleGraphTypeChanged: ", valueArray);
      if (this.state.handleGraphTypeChangedCallback) {
         this.state.handleGraphTypeChangedCallback(valueArray);
      }
   }


   handleDateRangeChanged(startDate, endDate) {
//      console.log("ItemsSelector handleDateRangeChanged: ", startDate, " ", endDate);
      if (this.state.handleDateRangeChangedCallback) {
         this.state.handleDateRangeChangedCallback(startDate, endDate);
      }
   }


   render() {
      let returnVal = 
         <React.Fragment key={itemsSelectorFragment}>
            <span className="itemsSelector">
               <label>Sizes</label>
               <Select
                  className="itemSizes"
                  name="sizes"
                  classNamePrefix="select"
                  closeMenuOnSelect={true}
                  onChange={this.handleSizeChanged}
                  options={this.state.sizesListAll}
               />

               <label>Types</label>
               <Select
                  className="basic-multi-select itemTypes"
                  isMulti
                  name="sizes"
                  classNamePrefix="select"
                  closeMenuOnSelect={false}
                  onChange={this.handleTypesChanged}
                  options={this.state.typesListAll}
               />

               <label>Graph Type</label>
               <Select
                  defaultValue={this.state.graphTypes[1]}
//               defaultValue={this.props.graphType}
                  className="graphTypes"
                  name="graphType"
                  classNamePrefix="select"
                  closeMenuOnSelect={true}
                  onChange={this.handleGraphTypeChanged}
                  options={this.state.graphTypes}
               />
               <DateRangePicker 
                  initialDateInterval={this.state.initialDateInterval} 
                  handleDateRangeChangedCallback={this.handleDateRangeChanged} 
               />
            </span>
         </ React.Fragment>

      return returnVal;
   }
}

export default ItemsSelector;
