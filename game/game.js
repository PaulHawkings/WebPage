// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}

Player.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 520);     // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var gameInterval = null;                    // The interval

var playerd = 1;
var gameend = false;

var cantp = true;
var time;
var thetimer;
var score = 0;
var win=false;

var level = 1;

var CANDYVALUE = 100;
var CANDYSIZE = 20;
var ENEMYVALUE = 100;
var ENEMYSIZE = 40;
var NUMBEROFENEMY = 5;
var currentcandys = 8;
var cheatmode = false;
var NUMBEROFBULLET = 6;
var bulletcount;
var currentlv = 1;
var smokeb = true;
var monsterspeed = .3;
var enemycanshoot = false;
var playername = "Anonymous";

var BULLET_SIZE = new Size(10, 10); // The size of a bullet
var BULLET_SPEED = 10.0;            // The speed of a bullet
                                    //  = pixels it moves each game loop
var BULLET_MAXTRAVEL = 250;
var SHOOT_INTERVAL = 200.0;         // The period when shooting is disabled
var canShoot = true;                // A flag indicating whether the player can shoot a bullet

var psi=0;							//rotation

var platincrement=1;

function load(evt) {
    svgdoc = evt.target.ownerDocument;

    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);

    cleanUpGroup("platforms", true);

    player = new Player();

    startprep();
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
    removestart();
	playBGM();
}


function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}


function keydown(evt) {
	if(!gameend){
	    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

	    switch (keyCode) {
	        case "A".charCodeAt(0):
	            player.motion = motionType.LEFT;
	            if(playerd == 1) playerd=0;

	            break;

	        case "D".charCodeAt(0):
	            player.motion = motionType.RIGHT;
	            if(playerd == 0) playerd=1;

	            break;

	        case "K".charCodeAt(0):
	            if (player.isOnPlatform()){
	            	player.verticalSpeed = JUMP_SPEED;
	                svgdoc.getElementById("jump").load();
	                svgdoc.getElementById("jump").play();
	            }
	            break;

	        case "J".charCodeAt(0):
	        	if (canShoot) shootBullet();
	        	break;

	        case "O".charCodeAt(0):
		        if(!cheatmode){
		            cheatmode=true;
                    svgdoc.getElementById("bsymbol").style.fill="DarkRed";
                }
		        break;

	        case "P".charCodeAt(0):
		        if(cheatmode){
		            cheatmode=false;
                    svgdoc.getElementById("bsymbol").style.fill="black";
                }
		        break;
	    }
	}
}



function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;

    }
}

function gamePlay() {
	collisionDetection();
	dplatform();
	updatescore();
	checkgamewin();
    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();

    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    moveBullets();
    enemyshoot();
	updateScreen();

}



function updateScreen() {

    movingplatform();
    enemymove();
    var p1 = svgdoc.getElementById("batman");
    if(!player.isOnPlatform()&&!gameend){
    	p1.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#batmanmodel2");
    }
    if(player.isOnPlatform()&&!gameend){
    	p1.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#batmanmodel1");
    }
    if(playerd==0){
    	p1.setAttribute("x", "-40");
	    p1.setAttribute("transform", "scale(-1, 1)");
        }
    if(playerd==1){
	    var npx = player.position.x+40;
	    p1.setAttribute("x", "0");
	    p1.setAttribute("transform", " ");
        }
    player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
}

function addenemy(n){
    var mons = svgdoc.getElementById("monsters");
    no_of_mons = mons.childNodes.length;
    for (var i = 0; i < no_of_mons; i++) {
        var mon = mons.childNodes.item(0);
        mons.removeChild(mon);
    }
    var bulls = svgdoc.getElementById("bullets");
    no_of_bulls = bulls.childNodes.length;
    for (var i = 0; i < no_of_bulls; i++) {
        var bull = bulls.childNodes.item(0);
        bulls.removeChild(bull);
    }

	for(i=0;i<n;++i){
        var x=Math.random()*560;
        var y=Math.random()*520;
        while(x<100&&y>450){
            x=Math.random()*560;
            y=Math.random()*520;
        }

        var des = Math.floor(Math.random()*560)*1000+Math.floor(Math.random()*520);
		var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
		svgdoc.getElementById("monsters").appendChild(monster);
		monster.setAttribute("x", x);
		monster.setAttribute("y", y);
		monster.setAttribute("z", des);
		monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
	}

    // the shooting enemy
    svgdoc.getElementById("monsters").childNodes.item(1).setAttribute("id", "senemy");
}


function addcandy(n){
    var cans = svgdoc.getElementById("candys");
    no_of_cans = cans.childNodes.length;
    for (var i = 0; i < no_of_cans; i++) {
        var can = cans.childNodes.item(0);
        cans.removeChild(can);
    }
    for(i=0;i<n;++i){
        var x=Math.random()*580;
        var y=Math.random()*540;
         while (candycollision(x,y)){
            x=Math.random()*580;
            y=Math.random()*540;
         }
        candycollision(x,y);
        var candy = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
        svgdoc.getElementById("candys").appendChild(candy);
        candy.setAttribute("x", x);
        candy.setAttribute("y", y);
        candy.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#candy");
    }
}



function shootBullet() {
    if(bulletcount!=0||cheatmode){
        svgdoc.getElementById("shoot").load();
        svgdoc.getElementById("shoot").play();
        canShoot = false;
        setTimeout("canShoot = true", SHOOT_INTERVAL);
        var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
        bullet.setAttribute("x", player.position.x);
        bullet.setAttribute("y", player.position.y);
        if(playerd==1)
            var z = player.position.x + BULLET_MAXTRAVEL + 1000;
        else
            var z = -(player.position.x - BULLET_MAXTRAVEL + 1000);
        bullet.setAttribute("z", z);
        bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
        svgdoc.getElementById("bullets").appendChild(bullet);
        if (!cheatmode)
            --bulletcount;
        svgdoc.getElementById("noofbullet").innerHTML=bulletcount;
    }
}
function moveBullets() {
    // Go through all bullets
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        var currentx = parseFloat(node.getAttribute("x"));
        var currenty = parseFloat(node.getAttribute("y"));
        //node.setAttribute("transform", "rotate()");
        var cx = currentx+20, cy=currenty+20;
        var rotate = "rotate("+psi+"," + cx + "," + cy+")";
        node.setAttribute("transform", rotate);
        psi += 80;
        var z = parseFloat(node.getAttribute("z"));
        // Update the position of the bullet
        if (z>0){
            if(currentx>(z-1000)){
                node.setAttribute("z", 0);
            }
            tempx = currentx+BULLET_SPEED;
            node.setAttribute("x", tempx);
        }
        else if(z<0){
            if(currentx<(-z-1000)){
                node.setAttribute("z", 0);
            }
            tempx = currentx-BULLET_SPEED;
            node.setAttribute("x", tempx);
        }
        else if (z==0){
            var dx = (player.position.x -  currentx);
            var dy = (player.position.y -  currenty);
            var R = Math.sqrt(dx*dx+dy*dy);
            if (Math.abs(dx)<4&&Math.abs(dy)<4){
                bullets.removeChild(node);
                return;
            }
            if (dx>0){
                var tempx = currentx + BULLET_SPEED/R*dx;
            }
            else{
                var tempx = currentx - BULLET_SPEED/R*Math.abs(dx); 
            }
            if (dy>0){
                var tempy = currenty + BULLET_SPEED/R*dy; 
            }
            else{
                var tempy = currenty - BULLET_SPEED/R*Math.abs(dy); 
            }
            node.setAttribute("x", tempx);
            node.setAttribute("y", tempy);
        }
    }
}


function collisionDetection() {
    var monsters = svgdoc.getElementById("monsters");
//MONSTER//////////////////////////////////////
    if(!cheatmode){
        for (var i = 0; i < monsters.childNodes.length; i++) {
            var monster = monsters.childNodes.item(i);
            var mx=parseInt(monster.getAttribute("x"))
            var my=parseInt(monster.getAttribute("y"));
            var px=player.position.x;
            var py=player.position.y;
            var dx=Math.abs(mx - px);
            var dy=Math.abs(my - py);
            if (dx<35&&dy<35){
                playerdie();
            }
        }

    //enemybullethir//////////////////////////////////////
        var ebullet = svgdoc.getElementById("enemybullets").childNodes.item(0);
        if(ebullet!=null){
            var ebx=ebullet.getAttribute("x");
            var eby=ebullet.getAttribute("y");
            var dx=Math.abs(player.position.x-ebx);
            var dy=Math.abs(player.position.y-eby);
            if(dx<30&&dy<30)
                playerdie();
        }
    }

//BULLETHITS//////////////////////////////////////
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var bx=parseInt(bullet.getAttribute("x"));
        var by=parseInt(bullet.getAttribute("y"));
        if(monsters.childNodes.length!=0){
        	for (var j = 0; j < monsters.childNodes.length; j++) {
	        	var monster = monsters.childNodes.item(j);
	        	var mx=parseInt(monster.getAttribute("x"));
	        	var my=parseInt(monster.getAttribute("y"));
	        	var dx=Math.abs(mx - bx);
	        	var dy=Math.abs(my - by);

	        	if(dx<10&&dy<30){
	        		playjokerdie();
	        		monsters.removeChild(monster);
                    score+=ENEMYVALUE;
                    j--;
	        	}
	        }
	    }
    }

//PORTAL//////////////////////////////////////
    var portal1 = svgdoc.getElementById("portal1");
    var portal2 = svgdoc.getElementById("portal2");

	ptx1=parseInt(portal1.getAttribute("x"))+20;
	pty1=parseInt(portal1.getAttribute("y"))+40;
	ptx2=parseInt(portal2.getAttribute("x"))+20;
	pty2=parseInt(portal2.getAttribute("y"))+40;
    dx1=Math.abs((player.position.x +PLAYER_SIZE.w*.5) - ptx1);
    dy1=Math.abs((player.position.y -PLAYER_SIZE.h*.5) - pty1);
    dx2=Math.abs((player.position.x +PLAYER_SIZE.w*.5) - ptx2);
    dy2=Math.abs((player.position.y -PLAYER_SIZE.h*.5) - pty2);
    if (dx1<20&&dy1<50&&cantp==true){
    	cantp = false;
    	setTimeout("cantp = true", 2000);
    	player.position.x=ptx2-20;
    	player.position.y=pty2-40;
        svgdoc.getElementById("tp").play();
    }
    if (dx2<20&&dy2<50&&cantp==true){
    	cantp = false;
    	setTimeout("cantp = true", 2000);
    	player.position.x=ptx1-20;
    	player.position.y=pty1-40;
        svgdoc.getElementById("tp").play();
    }

//CANDY//////////////////////////////////////
    var candys = svgdoc.getElementById("candys");
    for (var i = 0; i < candys.childNodes.length; i++) {
        var candy = candys.childNodes.item(i);
        var mx=parseInt(candy.getAttribute("x"))+CANDYSIZE*.5;
        var my=parseInt(candy.getAttribute("y"))+CANDYSIZE*.5;
        var dx=Math.abs(mx - (player.position.x+PLAYER_SIZE.w*.5) );
        var dy=Math.abs(my - (player.position.y+PLAYER_SIZE.h*.5) );
        if (dx<20&&dy<20){
            svgdoc.getElementById("ding").load();
            svgdoc.getElementById("ding").play();
	        candys.removeChild(candy);
	        i--;
	    	score += CANDYVALUE;
	    	--currentcandys;
	    }
    }
}

function dplatform(){
	var platforms = svgdoc.getElementById("platforms");
	for (var i = 0; i < platforms.childNodes.length; i++) {
	    var platform = platforms.childNodes.item(i);
	    if (platform.getAttribute("type") == "disappearing") {
	        var platformOpacity = parseFloat(platform.style.getPropertyValue("opacity"));
	        px=player.position.x+20;
	        py=player.position.y+20;
	        plx=parseInt(platform.getAttribute("x"))+40;
	        ply=parseInt(platform.getAttribute("y"))+10;
	        dx=Math.abs(px-plx);
	        dy=ply-py;
	        if (dx<60&&dy<40&&dy>0&&player.isOnPlatform()){
	        	platformOpacity -= 0.05;
	        	platform.style.setProperty("opacity", platformOpacity, null);
	        }
	        if(platformOpacity==0&&platform.getAttribute("x")<800){
                svgdoc.getElementById("slip").play();
	        	platform.setAttribute("x",900);
	        	platform.setAttribute("y",900);
	        }
	    }
    }
}

function removestart(){
	var gamearea = svgdoc.getElementById("gamearea");
	var start = svgdoc.getElementById("start");
	gamearea.removeChild(start);
}

function inputname(){
	var aname = prompt("Your name", playername);
	if (aname!=null&&aname!=""){
        playername = aname;
        svgdoc.getElementById("username").innerHTML = playername;
    }
}

function playerdie(){
	svgdoc.getElementById("BGM").pause();
	setTimeout("svgdoc.getElementById('BGM').play();",12000);
	svgdoc.getElementById("gameover").play();
	gameend=true;
	clearTimeout(gameInterval);
    clearTimeout(thetimer);
	svgdoc.getElementById("playerdie").setAttribute("style","visibility:visible");
    svgdoc.getElementById("batman").setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#batmanmodeldie");
    win=false;
    level = 1;
    var scs = svgdoc.getElementById("highscoretext");
    no_of_scs = scs.childNodes.length;
    for (var i = 0; i < no_of_scs; i++) {
        var sc = scs.childNodes.item(0);
        scs.removeChild(sc);
    }
    // Get the high score table from cookies
    var table = getHighScoreTable();
    var record = new ScoreRecord(playername, score);
    var pos = table.length;
    for (var i = 0; i < table.length; i++) {
        if (record.score > table[i].score) {
            pos = i;
            break;
        }
    }

    table.splice(pos, 0, record);

    setHighScoreTable(table);

    showHighScoreTable(table);

	svgdoc.getElementById("highscoretext").childNodes.item(2*pos).setAttribute("style", "fill:red");
    svgdoc.getElementById("highscoretext").childNodes.item(2*pos+1).setAttribute("style", "fill:red");
}


function movingplatform(){
	var mplatform = svgdoc.getElementById("mplatform");
	var mplatformp = svgdoc.getElementById("mplatformp");
	var mpx=parseInt(mplatform.getAttribute("x"));
	var mpy=parseInt(mplatform.getAttribute("y"));
	var dx=Math.abs(player.position.x-20-mpx);
	var dy=Math.abs(mpy - player.position.y-20);
	if(platincrement== -1 &&mpy==300) platincrement = 1;
	if(platincrement== 1 &&mpy==500) platincrement = -1;
	mpy+=platincrement;
	mplatform.setAttribute("y",mpy);
	mplatformp.setAttribute("y",mpy);
	if (dx<60&&dy<25){
		player.position.y+=platincrement;
	}
}

function timer(){
	--time;
	var timer=svgdoc.getElementById("timer");
	if(time<10){
		timer.innerHTML="0"+time;
	}

	else timer.innerHTML=time;

	if (time==0) {
		playerdie();
	}

}


function updatescore(){
    var scorev=svgdoc.getElementById("score");
	if(score!=0){
		scorev.innerHTML=score;
	    scorev.setAttribute("x",30)
    }
    scorev.innerHTML=score;
}

function won(){
	var won = svgdoc.getElementById("won");
	won.setAttribute("style","visibility:visible");
	score+=time*10;
	score+=level*1000;
	gameend=true;
    svgdoc.getElementById("BGM").pause();
    setTimeout("svgdoc.getElementById('BGM').play();",13000);
    svgdoc.getElementById("win").play();
    clearTimeout(gameInterval);
    clearTimeout(thetimer);
    win=true;
    updatescore();
    ++level;
}

function checkgamewin(){
	var door = svgdoc.getElementById("door");
	var exit = svgdoc.getElementById("theexit");
	if (currentcandys==0){
		door.setAttribute("style","visibility:hidden");
	}
	var exitx=parseInt(exit.getAttribute("x"));
	var exity=parseInt(exit.getAttribute("y"));
	var dx=Math.abs(player.position.x - exitx);
	var dy=Math.abs(player.position.y - exity);
	if(dx<30&&dy<50&&currentcandys==0){
		won();
	}
}

function candycollision(x,y){
    var platforms = svgdoc.getElementById("platforms");

    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var platx = parseInt(node.getAttribute("x"));
        var platy = parseInt(node.getAttribute("y"));
        var platw = parseInt(node.getAttribute("width"));
        var plath = parseInt(node.getAttribute("height"));

        var platmx = platx+platw*0.5;
        var platmy = platy+plath*0.5;

        var candyx = x + CANDYSIZE*0.5;
        var candyy = y + CANDYSIZE*0.5;

        var dx = Math.abs(platmx-candyx);
        var dy = Math.abs(platmy-candyy);

        var mdx = (platw + CANDYSIZE)*0.5;
        var mdy = (plath + CANDYSIZE)*0.5;

        if(dx<mdx&&dy<mdy)
            return true;

        if(x<20||y<20)
            return true;
    }

    return false;
}


function playBGM() {
	var bgm = svgdoc.getElementById("BGM");
	bgm.volume=0.2;
	bgm.loop=true;
	bgm.play();
    svgdoc.getElementById("jump").volume=0.1;
    svgdoc.getElementById("shoot").volume=0.1;
    svgdoc.getElementById("jokerdie1").volume=0.15;
    svgdoc.getElementById("jokerdie2").volume=0.15;
    svgdoc.getElementById("hit").volume=0.1;
    svgdoc.getElementById("die1").volume=0.2;
    svgdoc.getElementById("die2").volume=0.2;
    svgdoc.getElementById("tp").volume=0.3;
    svgdoc.getElementById("slip").volume=0.2;
    svgdoc.getElementById("ding").volume=0.3;
    svgdoc.getElementById("gameover").volume=0.8;
    svgdoc.getElementById("win").volume=0.8;
    //svgdoc.getElementById("smokebomb").volume=1;
}


function playjokerdie(){
    svgdoc.getElementById("jokerdie1").load();
    svgdoc.getElementById("jokerdie2").load();
	if (Math.random()>0.5)
		svgdoc.getElementById("jokerdie1").play();
	else
		svgdoc.getElementById("jokerdie2").play();
	svgdoc.getElementById("hit").load();
    svgdoc.getElementById("hit").play();
}

function startprep(){
	var ebs = svgdoc.getElementById("enemybullets");
    if(ebs.childNodes.length!=0)
        ebs.removeChild(ebs.childNodes.item(0));
	enemycanshoot=false;
	setTimeout("enemycanshoot=true;",2000);
	svgdoc.getElementById("dp1").setAttribute("x",300);
	svgdoc.getElementById("dp1").setAttribute("y",140);
	svgdoc.getElementById("dp1").style.setProperty("opacity", 1.0, null);
	svgdoc.getElementById("dp2").setAttribute("x",280);
	svgdoc.getElementById("dp2").setAttribute("y",440);
	svgdoc.getElementById("dp2").style.setProperty("opacity", 1.0, null);
	svgdoc.getElementById("dp3").setAttribute("x",0);
	svgdoc.getElementById("dp3").setAttribute("y",200);
	svgdoc.getElementById("dp3").style.setProperty("opacity", 1.0, null)
	svgdoc.getElementById("level").innerHTML=level;
	svgdoc.getElementById("timer").innerHTML=60;
    if(!win){
        score=0;
        NUMBEROFENEMY=5;
        NUMBEROFBULLET = 6;
        monsterspeed=0.3;
    }
    if(win){
        NUMBEROFENEMY+=1;
        --NUMBEROFBULLET;
        monsterspeed+=0.2;
    }
    //NUMBEROFCANDY=8;
    currentcandys=8;
    addenemy(NUMBEROFENEMY);
    addcandy(currentcandys);
    svgdoc.getElementById("win").load();
    svgdoc.getElementById("door").setAttribute("style","visibility:visible");
    svgdoc.getElementById("playerdie").setAttribute("style","visibility:hidden");
    svgdoc.getElementById("won").setAttribute("style","visibility:hidden");
    svgdoc.getElementById("highscoretable").setAttribute("style","visibility:hidden");
    svgdoc.getElementById("gameover").load();
    svgdoc.getElementById("BGM").play();
    gameend=false;
    smokeb=true;
    clearTimeout(gameInterval);
    clearTimeout(thetimer);
    time=60;
    bulletcount=NUMBEROFBULLET;
    svgdoc.getElementById("noofbullet").innerHTML=bulletcount;
    thetimer = setInterval("timer()", 1000);
}

function enemymove(){
	var monsters = svgdoc.getElementById("monsters");
	for (var i = 0; i < monsters.childNodes.length; i++) {
	    var monster = monsters.childNodes.item(i);
	    var des = parseFloat(monster.getAttribute("z"));
		var randomx = Math.floor(des/1000);
		var randomy = Math.floor(des-randomx*1000);
	    var mx = parseFloat(monster.getAttribute("x"));
	    var my = parseFloat(monster.getAttribute("y"));
	    var dx=Math.abs(randomx-mx);
	    var dy=Math.abs(randomy-my);
	    var R = dx*dx+dy*dy;
	    R = Math.sqrt(R);
	    if((randomx-mx)>0){
	    	mx+=monsterspeed/R*dx;
	    	monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster2");
	    }
	    if((randomx-mx)<0){
			mx-=monsterspeed/R*dx;
			monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
	    }
		if((randomy-my)>0)
	    	my+=monsterspeed/R*dy;
	    if((randomy-my)<0)
	    	my-=monsterspeed/R*dy;
	    if(Math.abs(mx-randomx)>monsterspeed){
	    	monster.setAttribute("x",mx);
	    	monster.setAttribute("y",my);
		}
		else{
			var des = Math.floor(Math.random()*560)*1000+Math.floor(Math.random()*520);;
			monster.setAttribute("z",des);
		}
	}
}

function togglesb(){
    if(svgdoc.getElementById("highscoretable").getAttribute("style")=="visibility:hidden")
        svgdoc.getElementById("highscoretable").setAttribute("style","visibility:visible");
    else
        svgdoc.getElementById("highscoretable").setAttribute("style","visibility:hidden");
}

function restart(){
    player = new Player();
    startprep();
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}


function enemyshoot() {
    if(enemycanshoot&&svgdoc.getElementById("enemybullets").childNodes.length==0){
        enemycanshoot=false;
        var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
        senemy = svgdoc.getElementById("senemy");
        if(senemy!=null){
            var des = parseFloat(senemy.getAttribute("z"));
            var desx = Math.floor(des/1000);
            var bulletdirection = desx - parseFloat(senemy.getAttribute("x"));
            bullet.setAttribute("x", parseFloat(senemy.getAttribute("x")));
            bullet.setAttribute("y", parseFloat(senemy.getAttribute("y")));
            if (bulletdirection>0)
                bullet.setAttribute("z", 1);
            else
                bullet.setAttribute("z", 0);
            bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#jbullet");
            svgdoc.getElementById("enemybullets").appendChild(bullet);
        }
    }

    var bullets = svgdoc.getElementById("enemybullets");
    var node = bullets.childNodes.item(0);
    if(node!=null){
        var currentx = parseInt(node.getAttribute("x"));
        if (parseInt(node.getAttribute("z"))==1){
            tempx = currentx+BULLET_SPEED;
            node.setAttribute("x", tempx);
            }
        else{
            node.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#jbulletr");
            tempx = currentx-BULLET_SPEED;
            node.setAttribute("x", tempx);
        }
        if (currentx<-40||currentx>600){
            bullets.removeChild(node);
            setTimeout("enemycanshoot=true",1000);
        }
    }
}

