import React from 'react';
import uploadFile from './uploadFile';
import FileDataInput from './FileDataInput';
import './SalesAnalyzer.css';


class AreaInput extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         baseURL: props.baseURL
      };
   }

   onSubmit = async (fileData) => {
      return await uploadFile(this.state.baseURL, fileData, "DocumentImport.php")
      .then(function (response) {
         console.log(response);
      })
      .catch(function (error) {
         console.log(error);
      });
   };

   render() {
      let importButtonText = "Import";
      let returnVal = 
         <div className="areaInput">
            <p>AreaInput</p>
            <FileDataInput dataHandler={this.onSubmit} buttonText={importButtonText} />
         </div>
      return returnVal;
   }
}
   
   
export default AreaInput;
