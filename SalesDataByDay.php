<?php
include("DBUtils.php");

$msgOut = " ";
$errorOccurred = false;
$status = "Success";
$jsonOut = false;


header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: *');
header("Access-Control-Allow-Methods: PUT, GET, POST");


if ($jsonOut)
   {
   header('Content-Type: application/json; charset=utf-8');
   $response = '[';
   }
else
   {
   header('Content-Type: text/xml');
   $response =  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
   $response .= '<SalesData>';
   }


//$debugFileOut = fopen("debug.txt", "wt");

set_time_limit(300);    // increase the execution timeout

$itemID = 0;
if (isset($_GET['itemID']))
   {
   $itemID = $_GET['itemID'];
   }

$db = ConnectToDB('SalesAnalyzer');

if (!$jsonOut)
   {
   $response .= '<Sales>';
   }

//fwrite($debugFileOut, $response . "\n");


function FormatNextLine($jsonOut, $rowData)
   {
   if ($jsonOut)
      {
      $nextItem = '{' .
//                     '"ID":"' . $rowData['ID'] . '",' .
                     '"itemID":"' . $rowData['itemID'] . '",' .
                     '"totalOunces":"' . $rowData['totalOunces'] . '",' .
//                     '"sizeID":"' . $rowData['sizeID'] . '",' .
//                     '"checkNumber":"' . $rowData['checkNumber'] . '",' .
//                     '"cost":"' . $rowData['cost'] . '",' .
//                     '"quantity":"' . $rowData['quantity'] . '",' .
//                     '"itemComps":"' . $rowData['itemComps'] . '",' .
//                     '"tabComps":"' . $rowData['tabComps'] . '",' .
//                     '"itemAmount":"' . $rowData['itemAmount'] . '",' .
//                     '"amount":"' . $rowData['amount'] . '",' .
//                     '"includedTax":"' . $rowData['includedTax'] . '",' .
//                     '"addonTax":"' . $rowData['addonTax'] . '",' .
//                     '"employeeID":"' . $rowData['employeeID'] . '",' .
                     '"saleDate":"' . $rowData['saleDate'] . '"' .
                  '}';
      }
   else
      {
      $nextItem = '<NextSale>' .
//                     '<ID>' . $rowData['ID'] . '</ID>' .
                     '<itemID>' . $rowData['itemID'] . '</itemID>' .
                     '<totalOunces>' . $rowData['totalOunces'] . '</totalOunces>' .
//                     '<sizeID>' . $rowData['sizeID'] . '</sizeID>' .
//                     '<checkNumber>' . $rowData['checkNumber'] . '</checkNumber>' .
//                     '<cost>' . $rowData['cost'] . '</cost>' .
//                     '<quantity>' . $rowData['quantity'] . '</quantity>' .
//                     '<itemComps>' . $rowData['itemComps'] . '</itemComps>' .
//                     '<tabComps>' . $rowData['tabComps'] . '</tabComps>' .
//                     '<itemAmount>' . $rowData['itemAmount'] . '</itemAmount>' .
//                     '<amount>' . $rowData['amount'] . '</amount>' .
//                     '<includedTax>' . $rowData['includedTax'] . '</includedTax>' .
//                     '<addonTax>' . $rowData['addonTax'] . '</addonTax>' .
//                     '<employeeID>' . $rowData['employeeID'] . '</employeeID>' .
                     '<saleDate>' . $rowData['saleDate'] . '</saleDate>' .
                  '</NextSale>';
      }

   return $nextItem;
   }


/*
SELECT 
   sales.quantity,
   sales.sizeID
FROM
   sales
WHERE
   (sales.itemID = 31) AND 
   (DATE(sales.saleTime) = '2018-09-14')
*/   

// SELECT ID,itemID,sizeID,SUM(quantity) AS quantity,DATE(saleTime) AS saleDate FROM sales WHERE (itemID = 31) AND (DATE(sales.saleTime) = '2018-09-14') GROUP BY saleDate,sizeID ORDER BY saleDate

//$sqlQuery = "SELECT ID,itemID,sizeID,checkNumber,cost,SUM(quantity) AS quantity,itemComps,tabComps,itemAmount,amount,includedTax,addonTax,employeeID,DATE(saleTime) AS saleDate " .
//            "FROM sales WHERE (itemID = $itemID) GROUP BY saleDate,sizeID ORDER BY saleDate";
//$sqlQuery = "SELECT ID,itemID,sizeID,checkNumber,cost,SUM(quantity) AS quantity,itemComps,tabComps,itemAmount,amount,includedTax,addonTax,employeeID,DATE(saleTime) AS saleDate " .
//            "FROM sales WHERE (itemID = $itemID) AND (DATE(sales.saleTime) = '2018-09-14') GROUP BY saleDate,sizeID ORDER BY saleDate";

$sqlQuery = "SELECT itemID,SUM(ounces * quantity) AS totalOunces,saleDate FROM
            (
            SELECT sales.ID AS ID,sales.itemID AS itemID,sales.sizeID,sizes.ounces AS ounces,SUM(quantity) AS quantity,DATE(saleTime) AS saleDate 
            FROM sales 
            LEFT JOIN sizes ON sizes.ID = sales.sizeID
            WHERE (sales.itemID = $itemID)
            GROUP BY saleDate,sizeID
                ) sizeSales
            GROUP BY saleDate
            ORDER BY saleDate";

$result = $db->query($sqlQuery);
if ($result)
   {
   if (($rowData = $result->fetch_assoc()) != NULL)
      {
      $nextItem = FormatNextLine($jsonOut, $rowData);
//      fwrite($debugFileOut, $nextItem . "\n");
      $response .= $nextItem;

      while (($rowData = $result->fetch_assoc()) != NULL)
         {
         $nextItem = "," . FormatNextLine($jsonOut, $rowData);
//         fwrite($debugFileOut, $nextItem . "\n");
         $response .= $nextItem;
         }
      }
   }

if ($jsonOut)
   {
   $nextItem = ']';
   }
else
   {
   $nextItem  = '</Sales>';
   $nextItem .= '<Status>' . $status . '</Status>';
   $nextItem .= '<msg>' . $msgOut . '</msg>';
   $nextItem .= '</SalesData>';
   }

$response .= $nextItem;
 
//fwrite($debugFileOut, $nextItem . "\n");
//fclose($debugFileOut);

echo $response;
?>
