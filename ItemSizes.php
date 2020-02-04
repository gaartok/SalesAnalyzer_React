<?php
include("DBUtils.php");

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Methods: PUT, GET, POST");

$response = "[";

//$debugFileOut = fopen("debug.txt", "wt");

set_time_limit(300);    // increase the execution timeout
    
$db = ConnectToDB('SalesAnalyzer');

$sqlQuery = "SELECT ID, name, ounces FROM sizes ORDER BY name";
$result = $db->query($sqlQuery);
$sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
if ($result)
   {
   if (($rowData = $result->fetch_assoc()) != NULL)
      {
      $response .= '{"ID":"' . $rowData['ID'] . '","Name":"' . htmlentities($rowData['name']) . '","Ounces":"' . htmlentities($rowData['ounces']) . '"}';
      while (($rowData = $result->fetch_assoc()) != NULL)
         {
         $response .= ',{"ID":"' . $rowData['ID'] . '","Name":"' . htmlentities($rowData['name']) . '","Ounces":"' . htmlentities($rowData['ounces']) . '"}';
         }
      }
   }

$response .= ']';

echo $response;
 
//fclose($debugFileOut);

?>
