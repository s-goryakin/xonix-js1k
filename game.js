wi=70;
he=40;
s=10;
c.width=wi*s;
c.height=he*s;
c.style.border="red 1px solid";
w=window;
o=[]; // enemies
timer="";
delay = 50;
m=[]; // gaming field

Mro=Math.round;
Mra=Math.random;
//TODO: colors 
// blue -- water -- 0033ff (03f) -- #2
// gray -- land -- 999999 (999) -- #1
// green -- player -- 339900 (390) --#4
// red -- AI -- ff0000 (f00) -- #3
// yellow -- path	-- ffff00 (ff0) --5

/*
Object description:
o = { 
	t:type, // 0 - user, 1 - land, 2 - sea
	c:color, // #390 - user, #f00 - AI
	v:vector, // 0 - stop, 1 - left, 2 - up, 3 - right, 4 - down, 5 - left-up, 6 - up-right, 7 - right-down, 8 - down-left
	x:x, // x-coordinate
	y:y // y-coordinate
};
area (surface) description:
0 - outer space :)
1 - land
2 - sea
3 - sand // user moves over the sea
*/
// process all routine for starting level
function startLevel(level)
{
	
	u = { // user
		t:0,
		c:4,
		x:wi/2,
		y:he-2
	};
	
	createObjects(1, (level>7?7:level)); // max land enemies count is 7
	createObjects(2, level+1);

	changeObjectPosition(u, u.x, u.y)
	for(var i in o) {
		t=o[i];
		changeObjectPosition(t, t.x, t.y);
	}
//	console.log(o);
}

// initialize game object and store it in the objects array
function createObjects(type, count)
{
	for(i=0;i<count;i++)
	{
		v = Mro(Mra() * 3) + 5;
		coords = getRandCoords(type);
		o.push({
			t:type,
			c:3,
			v:v>6?v+2:v,
			x:coords.x,
			y:coords.y
		});
	}
}

// return the type of surface for specified coordinates
function getAreaType(x,y){
	// check current matrix here

	/// todo: add all other types
	if (x < 0 || y < 0 || x >= wi || y >= he)
		return 0;
	else
	{
//		console.log(typeof m[x]);
//		if (typeof m[x] == "undefined" || typeof m[x][y] == "undefined")
//			console.log("Trying to get area type ");
//		if (typeof x == "undefined" || typeof y == "undefined")
//			console.log("Trying to get area type ");
		return m[x][y];
	}
}

function enemyCanBeHere(x, y, type)
{
	if (type == 1)
		return getAreaType(x, y) == 1;

	return !(getAreaType(x, y) == 1);
}

function moveUser()
{
	if (u.v)
	{
		x=!((u.v-1)*(u.v-3))?u.v-2:0;
		y=!((u.v-2)*(u.v-4))?u.v-3:0;
		if (getAreaType(u.x+x, u.y+y)) {
			(getAreaType(u.x+x, u.y+y)==2)?u.l=1:0;
			changeObjectPosition(u,u.x+x,u.y+y);
		} else {
			u.l=u.v=0;
		}
	}
	if(u.l && getAreaType(u.x, u.y)==1) {
		u.v=u.l=0;
		fillMap();
	}
}

function moveEnemy(t)
{
	createNewEnemyVector(t);
	
	kx = getKX(t);
	ky = getKY(t);

	if (enemyCanBeHere(t.x+kx, t.y+ky, t.t))
		changeObjectPosition(t, t.x+kx, t.y+ky);

	checkGameOver(t);
}

function checkGameOver(t)
{
	if (t.x == u.x && t.y == u.y || getAreaType(t.x, t.y) == 3)
		gameOver();
}

function createNewEnemyVector(t)
{
	kx = getKX(t);
	ky = getKY(t);
	v = t.v;
	
	if (!enemyCanBeHere(t.x+kx, t.y, t.t))
		invertX(t);
		
	if (!enemyCanBeHere(t.x, t.y+ky, t.t))
		invertY(t);
	
	if (v == t.v && !enemyCanBeHere(t.x+kx, t.y+ky, t.t)) // we need to check if we already changed the vector
	{
		invertX(t);
		invertY(t);
	}

	return;
}

function getKY(t)
{
	return (t.v & 4) / 4 - (t.v & 8) / 8;
}
function getKX(t)
{
	return (t.v & 1) / 1 - (t.v & 2) / 2;
}

function invertX(t)
{
	var y = (t.v & 4) + (t.v & 8);
	t.v = y + !(t.v&1)*1 + !(t.v&2)*2;
}
function invertY(t)
{
	var x = (t.v & 1) + (t.v & 2);
	t.v = x + !(t.v&4)*4 + !(t.v&8)*8;
}

function changeEnemyVector(o,inv){
	if (inv.x)
		o.v = 8 - (o.v+1)%4;
	if (inv.y)
		o.v = 13 - o.v;
}


// Used only for start level
function getRandCoords(type){

	do {
		n = {x:Mro(Mra()*wi),y:Mro(Mra()*he)}
	} while (getAreaType(n.x, n.y) != type);

	return n;
}

// draw object at new coordinates and delete it from old coordinates
function changeObjectPosition(o,x2,y2){
	// Delete old item first
	if ((!o.t && m[o.x][o.y] == 2) || (m[o.x][o.y] == 3))
	{
		c = 5;
		m[o.x][o.y] = 3;
	}
	else
	{
		c = m[o.x][o.y] == 1 ? 1 : 2;
	}
	drawBlock(o.x, o.y, c);
	// Draw new item
	drawBlock(x2, y2, o.c);
	o.x = x2;
	o.y = y2;
}

function togglePause(){
	if (!timer){
		timer = setInterval(function(){
			moveUser();
			for(var a in o) {
				moveEnemy(o[a]);
			}
		}, delay);
	}else{
		clearInterval(timer);
		timer = "";
	}
}

function generateMap() {
	i=wi-1;
	while(i>=0) {
		map=[];
		j=he-1;
		while(j>=0) {
			k=2;
			if(j<2||j>he-3||i<2||i>wi-3) k=1;
			map.push(k);
			drawBlock(i,j,k)
			j--;
		}
		m.push(map);
		i--;
	}
}

function gameOver() {
	togglePause();
	a.fillStyle="red";
	a.fillRect(0,0,wi*s,he*s);
	a.fillStyle="white";
	a.font = "25px Arial";
	a.fillText("You have died of dysentery", ((wi-25)/2*s), (he/2*s));
}

function fillMap2() {
	for(var a in o) {
		tmp_array = [];
		tmp_array.push({x: o[a].x, y: o[a].y});
		while(tmp_array.length > 0) {
			tmp_el = tmp_array.shift();
			x=tmp_el.x;
			y=tmp_el.y;
			if (x-1 && x+1 < wi && y-1 && y+1 < he) {
				if (m[x-1][y]==2) {
					tmp_array.push({x: x-1, y: y});
					m[x-1][y]=9;
				}
				if (m[x+1][y]==2) {
					tmp_array.push({x: x+1, y: y});
					m[x+1][y]=9
				}
				if (m[x][y-1]==2) {
					tmp_array.push({x: x, y: y-1});
					m[x][y-1]=9;
				}
				if (m[x][y+1]==2) {
					tmp_array.push({x: x, y: y+1});
					m[x][y+1]=9;
				}
				if (m[x-1][y+1]==2) {
					tmp_array.push({x: x-1, y: y+1});
					m[x-1][y+1]=9;
				}
				if (m[x-1][y-1]==2) {
					tmp_array.push({x: x-1, y: y-1});
					m[x-1][y-1]=9;
				}
				if (m[x+1][y+1]==2) {
					tmp_array.push({x: x+1, y: y+1});
					m[x+1][y+1]=9;
				}
				if (m[x+1][y-1]==2) {
					tmp_array.push({x: x+1, y: y-1});
					m[x+1][y-1]=9;
				}
			}
		}
		
	}
	
	i=wi-1;
	while(i>=0) {
		j=he-1;
		while(j>=0) {
			if (m[i][j] > 1 && m[i][j] < 4)
			{
				m[i][j] = 1;
				drawBlock(i, j, 1);
			}
			if (m[i][j]==9) {
				m[i][j] = 2;
			}
			j--;
		}
		i--;
	}
}


function fillMap()
{
	for(var i in o) {
		backupSea(o[i].x, o[i].y);
	}
	togglePause();
	fillLand();
}

function backupSea(x, y)
{
	type = getAreaType(x, y);
	if (type != 2)
		return;
	
	m[x][y] = 9;
	drawBlock(x, y, 9);
	coords = [
		 {x:x+1, y:y}
		,{x:x-1, y:y}
		,{x:x, y:y+1}
		,{x:x, y:y-1}
	];
	for (i in coords)
	{
		backupSea(coords[i].x, coords[i].y);
	}
}

function fillLand()
{
	i=wi-1;
	while(i>=0) {
		j=he-1;
		while(j>=0) {
			if (m[i][j] > 1 && m[i][j] < 4)
			{
				m[i][j] = 1;
				drawBlock(i, j, 1);
			}
			if (m[i][j]==9) {
				m[i][j] = 2;
			}
			j--;
		}
		i--;
	}
}


function drawBlock(x,y,c){
//	a.fillStyle=(c==1)?"#999":((c==2)?"#03f":((c==3)?"red":((c==4)?"#390":"#ff0")));
	a.fillStyle=(c==1)?"#999":((c==2)?"#03f":((c==3)?"red":((c==4)?"#390":((c==9)?"#fff":"#ff0"))));
	a.fillRect(x*s,y*s,s,s);
}

w.onload = function(){
	generateMap();
	startLevel(1);
	w.addEventListener('keydown', function(e) {
		
		// we need to change vector or user object here
		kc=e.keyCode
		if (36<kc && kc<41)
			u.v = kc-36;
		
		if (kc == 80 || kc == 32) // "P" or "Space"
			togglePause();

	}, false);

	togglePause();
}