<?php

function printLog($message)
{
    $logFile = fopen("blockchainData.log", 'a');
    fwrite($logFile, $message . "\n");
    fclose($logFile);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    printLog("IN");

    if (isset($_GET['usr']))
    {
        // Get user balance
        $username = $_GET['usr'];
        $balance = 0;

        $string = file_get_contents("blockchainData.json");
        $blockchainJson = json_decode($string, true);

        foreach ($blockchainJson["blockchain"] as $block)
        {
            if ($block["transaction"]["from"] == $username)
            {
                printLog("from " . $username . " " . $block["transaction"]["value"]);
                $balance -= $block["transaction"]["value"];
            }
            else if ($block["transaction"]["to"] == $username)
            {
                printLog("to " . $username . " " . $block["transaction"]["value"]);
                $balance += $block["transaction"]["value"];
            }
        }
    }

    echo $balance;
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