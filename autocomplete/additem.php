<?php

$message="error: please fill in all inputs";

if(isset($_POST["name"])&&isset($_POST["category"])&&isset($_POST["description"])){
	$label=$_POST["name"];
	$category=$_POST["category"];
	$description=$_POST["description"];
	require "mysql_connect.php";
	$query = "INSERT INTO search_data (id, label, category, description) VALUES (NULL, \"".$label."\", \"".$category."\", \"".$description."\");";
	if($conn->query($query))
		$message="success!";
	else
		$message="error! Query execution failed!";

	$conn->close();
}

?>

<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="stylesheet.css">
</head>
<body>
<p><?php echo $message ?></p>
<a href="autocomplete.php">go back</a>
</body>
</html>