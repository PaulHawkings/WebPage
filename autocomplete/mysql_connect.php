<?php
$servername = "localhost";
$username = "id297182_paulhawking";
$password = "95858901";
$dbname = "id297182_mysql";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
?>