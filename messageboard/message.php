<?php

// get the name from cookie
print "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Message Page</title>
        <script language="javascript" type="text/javascript">
        var loadTimer = null;
        var request;
        var datasize;
        var lastMsgID;

        function load() {
            var username = document.getElementById("username");

            loadTimer = null;
            datasize = 0;
            lastMsgID = 0;

            var node = document.getElementById("chatroom");
            node.style.setProperty("visibility", "visible", null);

            getUpdate();
        }

        function unload() {
            var username = document.getElementById("username");
            if (username.value != "") {
                request =new XMLHttpRequest();
                request.open("POST", "logout.php", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(null);
                username.value = "";
            }
            if (loadTimer != null) {
                loadTimer = null;
                clearTimeout("load()", 100);
            }
        }

        function getUpdate() {
            request =new XMLHttpRequest();
            request.onreadystatechange = stateChange;
            request.open("POST", "server.php", true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("datasize=" + datasize);
        }

        function stateChange() {
            if (request.readyState == 4 && request.status == 200 && request.responseText) {
                var xmlDoc;
                try {
                    xmlDoc =new XMLHttpRequest();
                    xmlDoc.loadXML(request.responseText);
                } catch (e) {
                    var parser = new DOMParser();
                    xmlDoc = parser.parseFromString(request.responseText, "text/xml");
                }
                datasize = request.responseText.length;
                updateChat(xmlDoc);
                getUpdate();
            }
        }
        var currentnode=0;
        function updateChat(xmlDoc) {
            var node = document.getElementById("chatroom");
            node.style.setProperty("visibility", "visible", null);
            var messages = xmlDoc.getElementsByTagName("message");
            for (i=currentnode;i<messages.length;i++){
                showMessage(messages[i].getAttribute("name"),messages[i].innerHTML,messages[i].getAttribute("color"))
            }
            currentnode=messages.length;

        }

        function showMessage(nameStr, contentStr, color){
            var node = document.getElementById("chatroom");
            node.style.setProperty("visibility", "visible", null);
           
            var node = document.getElementById("chattext");
            var nameNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

            nameNode.setAttribute("x", 100);
            nameNode.setAttribute("dy", 35);
            
            nameNode.appendChild(document.createTextNode(nameStr));

            node.appendChild(nameNode);

            var httpindex = contentStr.indexOf("http://");

            if(contentStr.includes("http://")){
                var stringsplit = contentStr.split("http://");
                var contentStr="";

                for(var i=1;i<stringsplit.length;++i){
                    stringsplit[i] = "http://"+stringsplit[i];
                    var substring;
                    if (stringsplit[i].indexOf(" ")!=-1){
                        substring = stringsplit[i].substring(0,stringsplit[i].indexOf(" "));
                    }
                    else
                        substring = stringsplit[i];

                    var targetstring = '<a style="text-decoration: underline;" xlink:href="' + substring + '" target="_blank">' + substring + '</a>';
                    stringsplit[i] = stringsplit[i].replace(substring,targetstring);
                }

                for(var i=0;i<stringsplit.length;++i){
                contentStr += stringsplit[i];
                }
            }

        	var conetentNode = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        	conetentNode.innerHTML=contentStr;

            conetentNode.setAttribute("x", 300);
            var style = "fill:"+color;
            conetentNode.setAttribute("style", style);
            nameNode.setAttribute("style", style);
            node.appendChild(conetentNode);
        }
        </script>
    </head>

    <body style="text-align: left" onload="load()" background="img/chbg.gif">
    <svg width="800px" height="2000px"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xhtml="http://www.w3.org/1999/xhtml"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:a="http://www.adobe.com/svg10-extensions" a:timeline="independent"
    >
    <def>
    <pattern id="backgroundimg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <image xlink:href="img/chbg.gif" x="0" y="0" width="100" height="100"/>
    </pattern>
    </def>

        <g id="chatroom" >                
        <rect width="800" height="2000" style="fill:url(#backgroundimg);stroke:red;stroke-width:2"/>
        <text x="400" y="40" style="fill:red;font-size:30px;font-weight:bold;text-anchor:middle">Message Board</text> 
        <text id="chattext" y="45" style="font-size: 30px;font-weight:bold"/>
      </g>
  </svg>
  
         <form action="">
            <input type="hidden" value="<?php print $name; ?>" id="username" />
        </form>

    </body>
</html>
