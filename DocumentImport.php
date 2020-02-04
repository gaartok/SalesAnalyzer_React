<?php
include("DBUtils.php");

$msgOut = " ";
$errorOccurred = false;
$status = "Success";


header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: *');
header('Content-Type: text/xml');
header("Access-Control-Allow-Methods: PUT, GET, POST");


$debugFileOut = fopen("debug.txt", "wt");

//$debugMsg = var_export($_POST['fileData'], true);
//fwrite($debugFileOut, $debugMsg . "\n");

set_time_limit(300);    // increase the execution timeout


    
// Returns the ID from the database which corresponds to the row with the itemName for a name.
// If the row is not found, a new row is created and that new ID is returned.
function GetIDFromName($db, $databaseName, $itemName)
   {
   global $errorOccurred;
   global $status;
   $theID = 0;

   $sqlQuery = "SELECT ID FROM $databaseName WHERE name='" . $itemName . "'";
   $result = $db->query($sqlQuery);
   if ($result)
      {
      $rowData = $result->fetch_assoc();
      $theID = (int)$rowData['ID'];
/*
      $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
      if ($sqlError != 0)
         {
         $status = "ERROR";
         $errorOccurred = true;
         }
*/
      }

   if ($theID == 0)
      {
      $sqlQuery = "INSERT INTO $databaseName (name) VALUES('" . $itemName . "')";
      $result = $db->query($sqlQuery);
      $theID = mysqli_insert_id($db);
/*
      $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
      if ($sqlError != 0)
         {
         $status = "ERROR";
         $errorOccurred = true;
         }
*/
      }
 
   return $theID;
   }
 

// Truncate all the tables in the database.
function TruncateTables($db)
   {   
   $sqlQuery = "TRUNCATE TABLE sales";
   $db->query($sqlQuery);
/*
   $sqlQuery = "TRUNCATE TABLE comps";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE venues";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE employees";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE items";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE sizes";
   $db->query($sqlQuery);
*/
   }





if ($_POST['fileData'])
   {
   $db = ConnectToDB('SalesAnalyzer');

//   TruncateTables($db);
   
   $newString = str_replace("$", "", $_POST['fileData']);
   $dataArray = str_getcsv($newString, "\n\r");
   $lineCount = sizeof($dataArray);

//   $debugMsg = var_export($dataArray, true);
//   fwrite($debugFileOut, $debugMsg . "\n");

//         0           1           2     3    4       5    6         7        8          9         10          11                    12           13         14           15      16        17            18       19
//   0 => 'DESCRIPTION,EXTERNAL ID,VENUE,SIZE,CHECK #,TIME,ITEM COST,QUANTITY,ITEM COMPS,TAB COMPS,ITEM AMOUNT,AMOUNT LESS TAB COMPS,INCLUDED TAX,ADD ON TAX,DEPOSIT/+TAX,TAB TAG,ITEM TAGS,APPLIED COMPS,EMPLOYEE,NOTE',
//   1 => 'Red Ale,,"Bar ",PINT,000500,2017-09-29 17:56:02,4.00,1.0,2.00,0.00,2.00,2.00,0.00,0.00,,,,Friends & Family,"Salters, Henry",',
 

   // Skip the 0 element: that's the header
   // Skip the last element: that's the Total line
   for ($arrayIndex = 1; $arrayIndex < $lineCount - 1; $arrayIndex++) 
      {
      $nextArray = str_getcsv($dataArray[$arrayIndex], ",");
//      $debugMsg = var_export($nextArray, true);
//      fwrite($debugFileOut, $debugMsg . "\n");

/*
      array (
         0 => 'Red Ale',
         1 => '',
         2 => 'Bar ',
         3 => 'PINT',
         4 => '000500',
         5 => '2017-09-29 17:56:02',
         6 => '4.00',
         7 => '1.0',
         8 => '2.00',
         9 => '0.00',
         10 => '2.00',
         11 => '2.00',
         12 => '0.00',
         13 => '0.00',
         14 => '',
         15 => '',
         16 => '',
         17 => 'Friends & Family',
         18 => 'Salters, Henry',
         19 => '',
       )
*/       


      $itemName = mysql_real_escape_string($nextArray[0]);
      $venueName = mysql_real_escape_string($nextArray[2]);
      $sizeName = mysql_real_escape_string($nextArray[3]);
      $checkNumber = mysql_real_escape_string($nextArray[4]);
      $time = mysql_real_escape_string($nextArray[5]);
      $cost = mysql_real_escape_string($nextArray[6]);
      $quantity = mysql_real_escape_string($nextArray[7]);
      $itemComps = mysql_real_escape_string($nextArray[8]);
      $tabComps = mysql_real_escape_string($nextArray[9]);
      $itemAmount = mysql_real_escape_string($nextArray[10]);
      $amtLessComps = mysql_real_escape_string($nextArray[11]);
      $includedTax = mysql_real_escape_string($nextArray[12]);
      $compsName = mysql_real_escape_string($nextArray[17]);
      $employeeName = mysql_real_escape_string($nextArray[18]);


      $venueID    = GetIDFromName($db, 'venues', $venueName);
      $employeeID = GetIDFromName($db, 'employees', $employeeName);
      $itemID     = GetIDFromName($db, 'items', $itemName);
      $sizeID     = GetIDFromName($db, 'sizes', $sizeName);

      if (strlen($compsName) > 0)
         $compsID    = GetIDFromName($db, 'comps', $compsName);
      else
         $compsID    = 0;
   
      $theID = 0;
   
   /*
      // TODO: try to figure out if this row is a repeat.  
      //       May not be possible: two rows of a single order can be identical

      $sqlQuery = "SELECT ID FROM sales WHERE name='" . $itemName . "'";
      $result = $db->query($sqlQuery);
      if ($result)
         {
         $rowData = $result->fetch_assoc();
         $theID = (int)$rowData['ID'];
         $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
         if ($sqlError != 0)
            {
            $status = "ERROR";
            $errorOccurred = true;
            }
         }
   */


      if ($theID == 0)
         {
         $sqlQuery = "INSERT INTO sales (amount,checkNumber,saleTime,cost,employeeID,includedTax,itemID,itemAmount,itemComps,quantity,sizeID,tabComps,venueID) " . 
                     "VALUES(" . $itemAmount . ", " . $checkNumber . ", '" . $time . "', " . $cost . ", " . $employeeID . ", " . $includedTax . ", " . $itemID . ", " . $itemAmount . "," .
                                 $itemComps . ", " . $quantity . ", " . $sizeID . ", " . $tabComps . ", " . $venueID . ")";
//         fwrite($debugFileOut, $sqlQuery . "\n");
         $result = $db->query($sqlQuery);
         $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
         if ($sqlError != 0)
            {
            $status = "ERROR";
            $errorOccurred = true;
            }
         }
      }
   }
else
   {
   }


if ($errorOccurred == false)
   {
   mysqli_commit($db);
   }
else
   {
   mysqli_rollback($db);
   }


$response =  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
$response .= '<SaveDataRow>';
$response .= '<Status>' . $status . '</Status>';
$response .= '<msg>' . $msgOut . '</msg>';
$response .= '</SaveDataRow>';

echo $response;
 
fwrite($debugFileOut, $response . "\n");
fclose($debugFileOut);

?>
