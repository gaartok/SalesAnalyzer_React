import React from 'react';
import Select from 'react-select';


class ItemSizesSelect extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         itemChangedHandler:props.handler
      }
   }


   handleChange(selectedOption) {
//      console.log("ItemsSelector handleChange  selected=");
      if (selectedOption) {
         let valueArray = [];
         selectedOption.forEach(nextItem => valueArray.push(nextItem.value));
//         console.log(valueArray);
         if (this.state.itemChangedHandler) {
            this.state.itemChangedHandler(valueArray);
         }
      }
   }


   render() {
      let returnVal = 
         <Select
            className="basic-multi-select itemSizes"
            isMulti
            name="sizes"
            onChange={this.handleChange.bind(this)}
            closeMenuOnSelect={false}
            options={this.props.options}
            classNamePrefix="select"
         />

//   console.log("ItemSizes render");
   return returnVal;
   }
}

export default ItemSizesSelect;
