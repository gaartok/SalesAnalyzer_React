import React from 'react';

/* Displays a file selection dialog box, and upon selecting a file, 
   reads the data from the file and passes it to the dataHandler function
*/

function buildFileSelector(dataHandler) {
   const fileSelector = document.createElement('input');
   fileSelector.setAttribute('type', 'file');

   fileSelector.onchange = (ev) => {
      var reader = new FileReader();
      reader.onload = function (event) {
         dataHandler(event.target.result);
      }      
      reader.readAsText(ev.target.files[0]);
   }

   return fileSelector;
 }

 
 class FileDataInput extends React.Component {
   componentDidMount() {
     this.fileSelector = buildFileSelector(this.props.dataHandler);
   }
   
   handleFileSelect = (e) => {
     e.preventDefault();
     this.fileSelector.click();
   }
   
   render(){
     return <button type="button" onClick={this.handleFileSelect}>{this.props.buttonText}</button>
   }
 }
 

 export default FileDataInput;
