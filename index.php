<?php  
session_start();
if(!isset($_SESSION["count"]))
    $_SESSION["count"]=0;
++$_SESSION["count"];

$count = $_SESSION["count"];
$string="";
if($count==1)
    $string = "Welcome to this awesome website stranger!";
elseif  ($count<10)
    $string = "Welcome back! This is the ".$count."th time you have visited this website!";
else
    $string = "Welcome back my old friend! This is the ".$count."th time you have visited this website!";

?>

<!DOCTYPE html>
<html>
<head>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<link rel="stylesheet" type="text/css" href="stylesheet.css">
<script src="jquery-3.1.1.min.js"></script>
<script language="JavaScript" src="game/highscore.js"></script>
<script language="JavaScript" src="game/game.js"></script>


</head>
<body>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="">PaulsDemo</a>
            </div>
            <ul class="nav navbar-nav">
                <li class="active"><a href="">Home</a></li>
                <li ><a href="blockchain.html">Blockchain</a></li>
                <li ><a href="demo.html">Miscellaneous</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <div class="jumbotron">
            <h1>Welcome to my humble little website!</h1>
            <?php echo"<p>".$string."</p>" ?> 
        </div>
    </div>

    <span style="font-size: 10px; color: Grey">This website is made for educational purpose only. I DO NOT own the image, sound effect or other resources on this website.</span>

</body>
</html>
