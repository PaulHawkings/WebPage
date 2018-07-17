<?php

print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <link rel="stylesheet" type="text/css" href="stylesheet_mess.css">

        <title>Add Message Page</title>
        <script type="text/javascript">

        function load() {
        }

        function select(color){
            var colorselect = document.getElementById("color");
            colorselect.value=color;
            var style="color:"+color;
            document.getElementById("colormessage").setAttribute("style",style);
        }

        function showonlineuser(){
            window.open('userlist.php');
        }

        </script>
    </head>

    <body style="text-align: left" onload="load()">
        <form action="add_message.php" method="post">
            <table border="0" cellspacing="5" cellpadding="0">
                <tr>
                    <td>What is your alias?</td>
                </tr>
                <tr>
                    <td><input class="text" type="text" name="name" id="name" style= "width: 150px" /></td>
                </tr>
                    <td>What is your message?</td>
                </tr>
                <tr>
                    <td><input class="text" type="text" name="message" id="msg" style= "width: 600px" /></td>
                </tr>
                <tr>
                    <td><input class="button" type="submit" value="Send Your Message" style="width: 200px;font-size: 18px" /></td>
                </tr>
                <tr>
                <td id="colormessage">Select your color:      
                    <div style="position:relative">
                        <div style="background-color:black;left:0px" onclick="select('black')"></div>
                        <div style="background-color:yellow;left:50px" onclick="select('yellow')"></div>
                        <div style="background-color:green;left:100px" onclick="select('green')"></div>
                        <div style="background-color:cyan;left:150px" onclick="select('cyan')"></div>
                        <div style="background-color:blue;left:200px" onclick="select('blue')"></div>
                        <div style="background-color:magenta;left:250px" onclick="select('magenta')">
                    </div>
                    </td>
                </tr>
            </table>
            <input type="hidden" name="color" id="color" value="black" />
        </form>

    </body>
</html>
