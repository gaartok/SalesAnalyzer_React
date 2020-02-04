import React from 'react';
import './SalesAnalyzer.css';



function AreaHeading() {
   let returnVal = 
      <div className="areaHeading">
         <p>This page will graph sales data from the tap room of a brewery.<br />
            Select an item from the Sizes dropdown, then multiple items may be selected from the Types dropdown.<br />
            The Line graph type is still a work in progress and does not work 100% properly.
         </p>
      </div>

   return returnVal;
}

export default AreaHeading;
