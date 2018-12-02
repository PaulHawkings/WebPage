<?php

function printLog($message)
{
    $logFile = fopen("blockchainData.log", 'a');
    fwrite($logFile, $message . "\n");
    fclose($logFile);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    if (isset($_GET['usr']))
    {
        printLog("IN");
        // Get user balance
        $string = file_get_contents("blockchainData.json");
        $blockchainJson = json_decode($string, true);

        foreach ($blockchainJson["blockchain"] as $transaction)
        {
            printLog($transaction["timestamp"]);
        }
        echo $_GET['usr'];
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $data = file_get_contents('php://input');

    $string = file_get_contents("blockchainData.json");
    $blockchainJson = json_decode($string, true);
    $blockCount = count($blockchainJson["blockchain"]);

    $blockchainJson["blockchain"][$blockCount] = json_decode($data, JSON_PRETTY_PRINT);

    $fp = fopen("blockchainData.json", 'w');
    fwrite($fp, json_encode($blockchainJson, JSON_PRETTY_PRINT));
    fclose($fp);
}

?>