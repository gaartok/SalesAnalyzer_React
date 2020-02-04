import React from 'react';
import Select from 'react-select';
import xmlObject from './xmlObject';
import axios from 'axios';
import './ItemsSelector.css';


class ItemsSelector extends React.Component {
   constructor(props) {
      super(props);
      this.handleSizesChanged = this.handleSizesChanged.bind(this);
      this.handleTypesChanged = this.handleTypesChanged.bind(this);
      this.state = {
        sizesListAll: [],
        sizesListSelected: [4, 5, 6],
        typesListAll: [],
        typesListSelected: [],
        handleTypesChangedCallback: props.handleTypesChangedCallback
      };
   }


   getItemSizes = async () => {
      let itemTypeURL = this.state.baseURL + "ItemSizes.php"

//      this.setState({ sizesListAll: [] });
//      this.setState({ sizesListSelected: [] });

      return await axios.get(itemTypeURL)
      .then(function (response) {
         let parser = new DOMParser();
         let xmlDoc = parser.parseFromString(response.data, "text/xml");
         let xmlData = new xmlObject();
         let dataArray = [];
         xmlData.fromXML(xmlDoc);
         let itemTypes = xmlData.getFirstObject("Sizes");
         let nextObject = itemTypes.getFirstObject("Size");
         while (nextObject) {
            let thisItemID = nextObject.getFirstObject("ID").value;
            let thisItemName = nextObject.getFirstObject("Name").value;
            dataArray.push({ value: thisItemID, label: thisItemName });
            nextObject = itemTypes.getNextObject("Size");
         }

         this.setState({ sizesListAll: dataArray })
      }.bind(this))
      .catch(function (error) {
         console.log(error);
      });
   };


   getItemTypes = async (typesArray) => {
      let itemTypeURL = this.state.baseURL + "ItemTypes.php?sizeID=" + typesArray[0];

//      this.setState({ typesListAll: null });
//      this.setState({ typesListSelected: null });

      return await axios.get(itemTypeURL)
      .then(function (response) {
         let parser = new DOMParser();
         let xmlDoc = parser.parseFromString(response.data, "text/xml");
         let xmlData = new xmlObject();
         let dataArray = [];
         xmlData.fromXML(xmlDoc);
         var itemTypes = xmlData.getFirstObject("Types");
         var nextObject = itemTypes.getFirstObject("Type");
         while (nextObject) {
            let thisItemID = nextObject.getFirstObject("ID").value;
            let thisItemName = nextObject.getFirstObject("Name").value;
            dataArray.push({ value: thisItemID, label: thisItemName });
            nextObject = itemTypes.getNextObject("Type");
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
/*
      let typesArray = [];
      console.log(selectedSizes);
      selectedSizes.forEach(nextItem => typesArray.push(nextItem.value));
      this.setState({sizesListSelected: typesArray})
      this.getItemTypes(typesArray);
*/

   let typesArray = [selectedSizes.value];
   this.setState({ sizesListSelected: typesArray })
   this.getItemTypes(typesArray);
   }



   handleTypesChanged(valueArray) {
//      console.log(valueArray);
      this.setState({ typesListSelected: valueArray });
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
