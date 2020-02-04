<?php

//echo "_SERVER (DBUtils) = <br />";
//var_export($_SERVER);
//exit;


// Figure out what server we're running on: Dedicated, cron task, or Local
function GetServerName()
   {
   global $baseURL;
   global $baseDirectory;

   if (isset($_SERVER['DOCUMENT_ROOT']) && $_SERVER['DOCUMENT_ROOT'] == 'C:/sandbox/web')          // VM
      {
      $baseURL = "http://localhost/greygames/public_html/thoughtwaves/";
      $baseDirectory = "C:/sandbox/web/GreyGames/public_html/thoughtwaves/";
      return 'Local';
      }
   else if (isset($_SERVER['DOCUMENT_ROOT']) && $_SERVER['DOCUMENT_ROOT'] == '/home/greyga2/public_html/thoughtwaves')     // thoughtwaves.com
      {
      $baseURL = "http://thoughtwaves.com/portfolio/static/php/SalesAnalyzer/";
      $baseDirectory = "/home/greyga2/public_html/thoughtwaves/portfolio/static/php/SalesAnalyzer/";
      return 'Thoughtwaves';
      }
   else
      {
      echo "_SERVER = ";
      var_export($_SERVER);
      echo "<br />\n";
      return 'Unknown';
      }
   }



function ConnectToDB($appName)
	{
   $db = NULL;

	$si = function_exists('mysqli_connect');
	if (!$si)
		{
		echo "<br />Whoops! MySQLi does not appear to be compiled or enabled properly!<br />";
		return;
		}
 
   $serverName = GetServerName();

   if ($serverName == 'Local')
      {
      $iniFileName = "../../../../demoAppsConfig.ini";
      $iniArray = parse_ini_file($iniFileName, true);
      $db = new mysqli('localhost', $iniArray[$appName]['dbUserName'], $iniArray[$appName]['dbPassword'], $iniArray[$appName]['dbName']);
      if ($db->connect_errno) 
         {
         echo "Connect failed: " . $db->connect_error;
         return NULL;
         }
      }
   else if ($serverName == 'Thoughtwaves')
      {
      $iniFileName = "../../../../../../demoAppsConfig.ini";
      $iniArray = parse_ini_file($iniFileName, true);
//      echo "pwd = " . getcwd();
//      echo "   iniArray = ";
//      var_export($iniArray);
//      echo "   dbName = '" . $iniArray[$appName]['dbName'] . "'";
//      echo "   dbUserName = '" . $iniArray[$appName]['dbUserName'] . "'";
      $db = new mysqli('localhost', $iniArray[$appName]['dbUserName'], $iniArray[$appName]['dbPassword'], $iniArray[$appName]['dbName']);
      if ($db->connect_errno) 
         {
         echo "   Connect failed: " . $db->connect_error;
         return NULL;
         }
      }
    else
      {   
		echo "Unknown server: " . $serverName . " cannot connect to database!";
		return NULL;
		}


//   echo "db=";
//   var_export($db);
//   echo "<br /><br />";

   if (empty($db))
      {
      echo "<b>ERROR: Could not connect to database!</b>";
      return NULL;
      }

   $db->query("SET NAMES 'utf8'");
   mysqli_autocommit($db, FALSE);
	return $db;
	}



function DisplayMySQLErrors($db, $sqlQuery, $result, $dontQuit, $fileName, $lineNumber)
	{
	$mySqlErr = mysqli_connect_errno();

   $smallQuery = substr($sqlQuery, 0, 1024);

	if ($mySqlErr != 0)
		{
      $message = mysqli_connect_error();
//      echo "<br />SQL Error: ", $message, "<br />";
//      echo "In file ", $fileName, ", at line number ", $lineNumber, "<br />";
//      echo "sqlQuery = ", $smallQuery, "<br />";

		mysqli_rollback($db);

      if ($dontQuit == 'TRUE')
         {
         return $message;
         }
      else
         {
         $db->close();
         exit;
         }
      }

	return 0;
	}


?>
