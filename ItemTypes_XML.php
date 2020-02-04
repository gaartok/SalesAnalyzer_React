<?php
include("DBUtils.php");

$msgOut = " ";
$errorOccurred = false;
$status = "Success";


header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: *');
header('Content-Type: text/xml');
//header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Methods: PUT, GET, POST");

$response =  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
$response .= '<ItemTypes>';


$debugFileOut = fopen("debug.txt", "wt");

set_time_limit(300);    // increase the execution timeout

$sizeID = 0;
if (isset($_GET['sizeID']))
   {
   $sizeID = $_GET['sizeID'];
   fwrite($debugFileOut, "sizeID = " . $_GET['sizeID'] . "\n");
   }

$db = ConnectToDB('SalesAnalyzer');

/*
$sqlQuery = "SELECT ID FROM sizes WHERE name='" . $_GET['sizeName'] . "'";
$result = $db->query($sqlQuery);
if ($result)
   {
   while (($rowData = $result->fetch_assoc()) != NULL)
      {
      $sizeID = $rowData['ID'];
      fwrite($debugFileOut, "sizeID = " . $sizeID . "\n");
      }
   }
*/

$response .= '<Types>';

$sqlQuery = "SELECT temp.itemID AS itemID,items.name AS name FROM (SELECT DISTINCT itemID FROM sales WHERE (sizeID = $sizeID)) AS temp " .
            "LEFT JOIN items ON temp.itemID = items.ID ORDER BY items.name";
$result = $db->query($sqlQuery);
if ($result)
   {
   while (($rowData = $result->fetch_assoc()) != NULL)
      {
      $nextItem = '<Type><ID>' . $rowData['itemID'] . '</ID><Name>' . htmlentities($rowData['name']) . '</Name></Type>';
      $response .= $nextItem;
      fwrite($debugFileOut, $nextItem . "\n");
      }
   }


/*
if ($sizeID != 0)
   {
//   $sqlQuery = "SELECT ID, name FROM items ORDER BY name";
   $result = $db->query($sqlQuery);
   $sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
   if ($result)
      {
      while(($rowData = $result->fetch_assoc()) != NULL)
         {
         $nextItem = '<Type><ID>' . $rowData['ID'] . '</ID><Name>' . htmlentities($rowData['name']) . '</Name></Type>';
         $response .= $nextItem;
         fwrite($debugFileOut, $nextItem . "\n");
         }
      }
   }
*/

$response .= '</Types>';
$response .= '<Status>' . $status . '</Status>';
$response .= '<msg>' . $msgOut . '</msg>';
$response .= '</ItemTypes>';

echo $response;
 
fclose($debugFileOut);

?>
