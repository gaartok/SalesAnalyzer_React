<?php
include("DBUtils.php");

//$debugging = true;
$debugging = false;

$msgOut = " ";
$errorOccurred = false;
$status = "Success";


if ($debugging)
   {
   echo("<!DOCTYPE html>");
   echo("<html>");
   echo("<head>");
   echo("</head>");
   echo("<body>");
   var_export($_GET);
   echo("<br />");
   echo("<br />");
   }
else
   {
   header('Access-Control-Allow-Origin: *');
   header('Content-Type: text/xml');
   header("Cache-Control: no-cache, must-revalidate");
   }



// Returns the value of the item in the $_GET array.
// If the item does not exist, errorOccurred is set to true and a note is added to msgOut
function GetItemValue($itemName)
   {
   global $errorOccurred;
   global $debugging;
   global $msgOut;
   $itemValue = "";

   if (isset($_GET[$itemName]))
      {
      $itemValue = mysql_real_escape_string($_GET[$itemName]);
      $itemValue = str_replace("$", "", $itemValue);
      if ($debugging)
         {
         echo("$itemName = $itemValue<br />");
         }
      }
   else
      {
      $msgOut .= "Missing $itemName<br />";
      $errorOccurred = true;
      }

   return $itemValue;
   }

    
// Returns the ID from the database which corresponds to the row with the itemName for a name.
// If the row is not found, a new row is created and that new ID is returned.
function GetIDFromName($db, $databaseName, $itemName)
   {
   global $debugging;
   global $errorOccurred;
   global $status;
   $theID = 0;

   $sqlQuery = "SELECT ID FROM $databaseName WHERE name='" . $itemName . "'";
   if ($debugging)
      echo("sqlQuery = " . $sqlQuery . "<br />");
   $result = $db->query($sqlQuery);
   if ($result)
      {
      $rowData = $result->fetch_assoc();
      $theID = (int)$rowData['ID'];
      $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
      if ($sqlError != 0)
         {
         if ($debugging)
            echo("sqlError = " . $sqlError . "<br />");
         $status = "ERROR";
         $errorOccurred = true;
         }
      }

   if ($theID == 0)
      {
      $sqlQuery = "INSERT INTO $databaseName (name) VALUES('" . $itemName . "')";
      if ($debugging)
         echo("sqlQuery = " . $sqlQuery . "<br />");
      $result = $db->query($sqlQuery);
      $theID = mysqli_insert_id($db);
      $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
      if ($sqlError != 0)
         {
         if ($debugging)
            echo("sqlError = " . $sqlError . "<br />");
         $status = "ERROR";
         $errorOccurred = true;
         }
      }
 
   if ($debugging)
      {
      echo("ID = " . $theID . "<br />");
      }

   return $theID;
   }
 

// Truncate all the tables in the database.
function TruncateTables($db)
   {   
   $sqlQuery = "TRUNCATE TABLE sales";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE comps";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE venues";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE employees";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE inventory";
   $db->query($sqlQuery);
   $sqlQuery = "TRUNCATE TABLE sizes";
   $db->query($sqlQuery);
   }




$itemName      = GetItemValue('item');
$venueName     = GetItemValue('venue');
$sizeName      = GetItemValue('size');
$checkNumber   = GetItemValue('checkNumber');
$time          = GetItemValue('time');
$cost          = GetItemValue('cost');
$quantity      = GetItemValue('quantity');
$itemComps     = GetItemValue('itemComps');
$tabComps      = GetItemValue('tabComps');
$itemAmount    = GetItemValue('itemAmount');
$amtLessComps  = GetItemValue('amountLessComps');
$includedTax   = GetItemValue('includedTax');
$compsName     = GetItemValue('comps');
$employeeName  = GetItemValue('employee');
   

// If we found all expected values...
if ($errorOccurred == false)
   {
   $db = ConnectToDB('SalesAnalyzer');

   TruncateTables($db);

   $venueID    = GetIDFromName($db, 'venues', $venueName);
   $employeeID = GetIDFromName($db, 'employees', $employeeName);
   $itemID     = GetIDFromName($db, 'inventory', $itemName);
   $sizeID     = GetIDFromName($db, 'sizes', $sizeName);
   $compsID    = GetIDFromName($db, 'comps', $compsName);

   $theID = 0;

/*
   // TODO: try to figure out if this row is a repeat.  
   //       May not be possible: two rows of a single order can be identical
   $sqlQuery = "SELECT ID FROM sales WHERE name='" . $itemName . "'";
   if ($debugging)
      echo("sqlQuery = " . $sqlQuery . "<br />");
   $result = $db->query($sqlQuery);
   if ($result)
      {
      $rowData = $result->fetch_assoc();
      $theID = (int)$rowData['ID'];
      $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
      if ($sqlError != 0)
         {
         if ($debugging)
            echo("sqlError = " . $sqlError . "<br />");
         $status = "ERROR";
         $errorOccurred = true;
         }
      }
*/

   if ($theID == 0)
      {
      $sqlQuery = "INSERT INTO sales (amount,checkNumber,cost,employeeID,includedTax,inventoryID,itemAmount,itemComps,quantity,sizeID,tabComps,venueID) " . 
                  "VALUES(" . $itemAmount . ", " . $checkNumber . ", " . $cost . ", " . $employeeID . ", " . $includedTax . ", " . $itemID . ", " . $itemAmount . "," .
                          $itemComps . ", " . $quantity . ", " . $sizeID . ", " . $tabComps . ", " . $venueID . ")";
      if ($debugging)
         echo("sqlQuery = " . $sqlQuery . "<br />");
      $result = $db->query($sqlQuery);
      $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
      if ($sqlError != 0)
         {
         if ($debugging)
            echo("sqlError = " . $sqlError . "<br />");
         $status = "ERROR";
         $errorOccurred = true;
         }
      }

   if ($errorOccurred == false)
      {
      if ($debugging)
         echo("<br />mysqli_commit<br />");
      mysqli_commit($db);
      }
   else
      {
      if ($debugging)
         echo("<br />mysqli_rollback<br />");
      mysqli_rollback($db);
      }
   }
else
   {
   $status = "Failed";
   }


if ($debugging)
   {
   echo("status = " . $status . "<br />");
   echo($msgOut . "<br />");
   echo("</body>");
   echo("</html>");
   }
else
   {
   $response =  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
   $response .= '<SaveDataRow>';
   $response .= '<Status>' . $status . '</Status>';
   $response .= '<msg>' . $msgOut . '</msg>';
   $response .= '</SaveDataRow>';
   
   echo $response;
   }

?>
