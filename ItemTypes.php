<?php
include("DBUtils.php");

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Methods: PUT, GET, POST");

$response = '[';

//$debugFileOut = fopen("debug.txt", "wt");

set_time_limit(300);    // increase the execution timeout

$sizeID = 0;
if (isset($_GET['sizeID']))
   {
   $sizeID = $_GET['sizeID'];
//   fwrite($debugFileOut, "sizeID = " . $_GET['sizeID'] . "\n");
   }

$db = ConnectToDB('SalesAnalyzer');

$sqlQuery = "SELECT temp.itemID AS itemID,items.name AS name FROM (SELECT DISTINCT itemID FROM sales WHERE (sizeID = $sizeID)) AS temp " .
            "LEFT JOIN items ON temp.itemID = items.ID ORDER BY items.name";
$result = $db->query($sqlQuery);
if ($result)
   {
   if (($rowData = $result->fetch_assoc()) != NULL)
      {
      $response .= '{"ID":"' . $rowData['itemID'] . '","Name":"' . htmlentities($rowData['name']) . '"}';
      while (($rowData = $result->fetch_assoc()) != NULL)
         {
         $response .= ',{"ID":"' . $rowData['itemID'] . '","Name":"' . htmlentities($rowData['name']) . '"}';
         }
      }
   }

$response .= ']';

echo $response;
 
//fclose($debugFileOut);

?>
