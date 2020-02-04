import axios from 'axios';


function fileUploadComplete(wasSuccessful) {
   console.log("fileUploadComplete = ", wasSuccessful);
}


async function uploadFile(baseURL, fileData, pageName) {
   const formData = new FormData();

   formData.append('fileData', fileData);

   let postDataRowURL = baseURL + pageName;

   return await axios.post(postDataRowURL, formData)
   .then(function (response) {
      console.log(response);
      fileUploadComplete(true);
   })
   .catch(function (error) {
      console.log(error);
      fileUploadComplete(false);
   });
   };

   
export default uploadFile;
