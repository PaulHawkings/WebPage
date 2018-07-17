<?php

if (!isset($_POST["order"]) || $_POST["order"]=="") {
	die("error");
}

$xml = simplexml_load_file("orders.xml");
$order = $xml->orders;

$order->addChild("order",$_POST["order"]);

$xml->asXML("orders.xml");

echo "Done";

?>