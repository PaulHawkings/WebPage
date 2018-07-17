<?php
if (($_POST["name"])=="") {
    header("Location: error.html");
    return;
}

$name = $_POST["name"];

// get the color from cookie
$my_color = $_POST['color'];

// get the message content
$message = $_POST["message"];

if (trim($message) == "") $message = "__EMPTY__";

require_once('xmlHandler.php');

// create the chatroom xml file handler
$xmlh = new xmlHandler("chatroom.xml");
if (!$xmlh->fileExist()) {
    header("Location: error.html");
    exit;
}

$xmlh->openFile();

$messages_element = $xmlh->getElement("messages");

$message_element = $xmlh->addElement($messages_element, "message");

$xmlh->setAttribute($message_element, "name", $name);

$xmlh->addText($message_element, $message);

$xmlh->setAttribute($message_element, "color", $my_color);

$xmlh->saveFile();

header("Location: client.php");

?>
