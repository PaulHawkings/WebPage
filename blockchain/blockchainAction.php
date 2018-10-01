<?php

function printLog($message)
{
    $logFile = fopen("blockchainData.log", 'w');
    fwrite($logFile, $message);
    fclose($logFile);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET')
{
    $string = file_get_contents("blockchainData.json");
    $blockchainJson = json_decode($string, true);
    $blockCount = count($blockchainJson["blockchain"]);
    echo $blockchainJson["blockchain"][0]["transaction"]["value"];

    $fp = fopen("blockchainData.json", 'w');
    fwrite($fp, json_encode($blockchainJson, JSON_PRETTY_PRINT));
    fclose($fp);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $post = file_get_contents('php://input');

    $string = file_get_contents("blockchainData.json");
    $blockchainJson = json_decode($string, true);
    $blockCount = count($blockchainJson["blockchain"]);

    $blockchainJson["blockchain"][$blockCount] = json_decode($post, JSON_PRETTY_PRINT);

    $fp = fopen("blockchainData.json", 'w');
    fwrite($fp, json_encode($blockchainJson, JSON_PRETTY_PRINT));
    fclose($fp);
}

?>