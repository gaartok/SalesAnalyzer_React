import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import './ItemsSelector.css';


class ItemsSelector extends React.Component {
   constructor(props) {
      super(props);
      this.handleSizesChanged = this.handleSizesChanged.bind(this);
      this.handleTypesChanged = this.handleTypesChanged.bind(this);
      this.state = {
        sizesListAll: [],
        typesListAll: [],
        handleTypesChangedCallback: props.handleTypesChangedCallback
      };
   }


   getItemSizes = async () => {
      let itemTypeURL = this.state.baseURL + "ItemSizes.php"

      return await axios.get(itemTypeURL)
      .then(function (response) {
         let dataArray = [];
         console.log(response.data);
         for (let i = 0, length = response.data.length; i < length; i++) {
            dataArray.push({ value: response.data[i].ID, label: response.data[i].Name });
         }

         this.setState({ sizesListAll: dataArray })
      }.bind(this))
      .catch(function (error) {
         console.log(error);
      });
   };


   getItemTypes = async (typesArray) => {
      let itemTypeURL = this.state.baseURL + "ItemTypes.php?sizeID=" + typesArray[0];

      return await axios.get(itemTypeURL)
      .then(function (response) {
         let dataArray = [];
         for (let i = 0, length = response.data.length; i < length; i++) {
            dataArray.push({ value: response.data[i].ID, label: response.data[i].Name });
         }

         this.setState({ typesListAll: dataArray });
      }.bind(this))
      .catch(function (error) {
         console.log(error);
      });
   };


   componentDidMount() {
      this.getItemSizes();
   }   


   handleSizesChanged(selectedSizes) {
      let typesArray = [selectedSizes.value];
      this.getItemTypes(typesArray);
   }



   handleTypesChanged(valueArray) {
      if (this.state.handleTypesChangedCallback) {
         this.state.handleTypesChangedCallback(valueArray);
      }
   }


   render() {
      let returnVal = 
         <span className="itemsSelector">
            <label>Sizes</label>
            <Select
               className="itemSizes"
               name="sizes"
               classNamePrefix="select"
               closeMenuOnSelect={true}
               onChange={this.handleSizesChanged}
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
         </span>

      return returnVal;
   }
}

export default ItemsSelector;
