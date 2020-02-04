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
$response .= '<SalesData>';


$debugFileOut = fopen("debug.txt", "wt");

set_time_limit(300);    // increase the execution timeout

$itemID = 0;
if (isset($_GET['itemID']))
   {
   $itemID = $_GET['itemID'];
   fwrite($debugFileOut, "itemID = " . $_GET['itemID'] . "\n");
   }

$db = ConnectToDB('SalesAnalyzer');

$response .= '<Sales>';

$sqlQuery = "SELECT ID,itemID,sizeID,checkNumber,cost,quantity,itemComps,tabComps,itemAmount,amount,includedTax,addonTax,employeeID,saleTime " .
            "FROM sales WHERE (itemID = $itemID) ORDER BY saleTime";
$result = $db->query($sqlQuery);
if ($result)
   {
   while (($rowData = $result->fetch_assoc()) != NULL)
      {
         $nextItem = '<NextSale>' .
                     '<ID>' . $rowData['ID'] . '</ID>' .
                     '<itemID>' . $rowData['itemID'] . '</itemID>' .
                     '<sizeID>' . $rowData['sizeID'] . '</sizeID>' .
                     '<checkNumber>' . $rowData['checkNumber'] . '</checkNumber>' .
                     '<cost>' . $rowData['cost'] . '</cost>' .
                     '<quantity>' . $rowData['quantity'] . '</quantity>' .
                     '<itemComps>' . $rowData['itemComps'] . '</itemComps>' .
                     '<tabComps>' . $rowData['tabComps'] . '</tabComps>' .
                     '<itemAmount>' . $rowData['itemAmount'] . '</itemAmount>' .
                     '<amount>' . $rowData['amount'] . '</amount>' .
                     '<includedTax>' . $rowData['includedTax'] . '</includedTax>' .
                     '<addonTax>' . $rowData['addonTax'] . '</addonTax>' .
                     '<employeeID>' . $rowData['employeeID'] . '</employeeID>' .
                     '<saleTime>' . $rowData['saleTime'] . '</saleTime>' .
                  '</NextSale>';

      $response .= $nextItem;
//      fwrite($debugFileOut, $nextItem . "\n");
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

$response .= '</Sales>';
$response .= '<Status>' . $status . '</Status>';
$response .= '<msg>' . $msgOut . '</msg>';
$response .= '</SalesData>';

echo $response;
 
fclose($debugFileOut);

?>
