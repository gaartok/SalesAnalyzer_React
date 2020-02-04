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
$response .= '<ItemSizes>';


//$debugFileOut = fopen("debug.txt", "wt");

set_time_limit(300);    // increase the execution timeout

    
$db = ConnectToDB('SalesAnalyzer');
$response .= '<Sizes>';

$sqlQuery = "SELECT ID, name FROM sizes ORDER BY name";
$result = $db->query($sqlQuery);
$sqlError = DisplayMySQLErrors($db, $sqlQuery, $result, 'TRUE', __FILE__, __LINE__);
if ($result)
   {
   while(($rowData = $result->fetch_assoc()) != NULL)
      {
      $nextItem = '<Size><ID>' . $rowData['ID'] . '</ID><Name>' . htmlentities($rowData['name']) . '</Name></Size>';
      $response .= $nextItem;
//      fwrite($debugFileOut, $nextItem . "\n");
   }
   }


$response .= '</Sizes>';
$response .= '<Status>' . $status . '</Status>';
$response .= '<msg>' . $msgOut . '</msg>';
$response .= '</ItemSizes>';

echo $response;
 
//fclose($debugFileOut);

?>
