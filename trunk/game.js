wi=50;
he=30;
s=10;
c.width=wi*s;
c.height=he*s;
c.style.border="red 1px solid";
w=window;
o=[]; // enemies
u={}; // user
timer="";
m=[]; // gaming field
//
//TODO: colors 
// blue -- water -- 0033ff (03f)
// gray -- land -- 999999 (999)
// green -- player -- 339900 (390)
// red -- AI -- ff0000 (f00)
// yellow -- path  -- ffff00 (ff0)
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
		c:"#390",
		x:25,
		y:28
	};
	
	createObjects(1, (level>7?7:level)); // max land enemies count is 7
	createObjects(2, level+2);

	changeObjectPosition(u, u.x, u.y)
	for(var i in o) {
		changeObjectPosition(o[i], o[i].x, o[i].y);
	}
}

// initialize game object and store it in the objects array
function createObjects(type, count)
{
	for(i=0;i<count;i++)
	{
		coords = getRandCoords(type);
		o.push({
			t:type,
			c:"#f00",
			v:Math.round(Math.random() * 3) + 5, // 5..8
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
		return m[x][y];
}

// check if area is the same type with specified one
// return 1 is they are equal and -1 if not
function verifyAreaType(x,y,type)
{
	return (getAreaType(x,y) == type ? 1 : -1);
}

function moveUser()
{
	// process moving user here

	// check passing land-sea or sea-land border
	if (u.v)
	{
		x=!((u.v-1)*(u.v-3))?u.v-2:0;
		y=!((u.v-2)*(u.v-4))?u.v-3:0;
		if (getAreaType(u.x+x, u.y+y)!=0)
			changeObjectPosition(u,u.x+x,u.y+y);
		else
			u.v=0;
	}
}

function moveEnemy(t)
{
//	logObject(o, 1);
	/// todo: check if (x, y+k) and (x+k, y) are of the same type, but (x+k, y+k) is not
	n = {};
	inv = {};
	if (t.v < 7) // vector is 5 or 6
	{
		ky = -1;
	}
	else // vector is 7 or 8
	{
		ky = 1;
	}
	inv.y = verifyAreaType(t.x, t.y + ky, t.t) == -1;
	n.y = t.y + verifyAreaType(t.x, t.y + ky, t.t) * ky;
	
	if ((t.v-6)*(t.v-7)) // vector is 5 or 8
	{
		k = -1;
	} else {
		k = 1;
	}

	inv.x = verifyAreaType(t.x + k, t.y, t.t) == -1;
	n.x = t.x + verifyAreaType(t.x + k, t.y, t.t) * k;
	
	if ((n.x==u.x&&n.y==u.y)||verifyAreaType(t.x + k, t.y+ky, 3)==1)gameOver();
	
	changeEnemyVector(t, inv);
	changeObjectPosition(t, n.x, n.y);
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
		n = {x:Math.round(Math.random()*wi),y:Math.round(Math.random()*he)}
	} while (verifyAreaType(n.x, n.y, type) != 1);

	return n;
}

// draw object at new coordinates and delete it from old coordinates
function changeObjectPosition(o,x2,y2){
	// Delete old item first
	if((!o.t&&m[o.x][o.y]==2)||(m[o.x][o.y]==3)){c="#ff0";m[o.x][o.y]=3;}else c=((m[o.x][o.y]==1)?"#999":"#03f");
	a.fillStyle=c;
	a.fillRect(o.x*s, o.y*s, s, s);

	// Draw new item
	a.fillStyle = o.c;
	a.fillRect(x2*s, y2*s, s, s);
	o.x=x2;o.y=y2;
}

function togglePause(){
	if (!timer){
		timer = setInterval(function(){
			moveUser();
			for(var a in o) {
				moveEnemy(o[a]);
			}
		},50);
	}else{
		clearInterval(timer);
		timer = "";
	}
}

function logObject(o,log_walls){
	console.log(
		'v: '+o.v,
		'x: '+o.x,
		'y: '+o.y
	);
	if (log_walls)
	{
		console.log(
			getAreaType(o.x-1, o.y-1),
			getAreaType(o.x-0, o.y-1),
			getAreaType(o.x+1, o.y-1)
		);
		console.log(
			getAreaType(o.x-1, o.y),
			5,
			getAreaType(o.x+1, o.y)
		);
		console.log(
			getAreaType(o.x-1, o.y+1),
			getAreaType(o.x-0, o.y+1),
			getAreaType(o.x+1, o.y+1)
		);
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
			a.fillStyle=((k==1)?"#999":"#03f");
			a.fillRect(i*s,j*s,s,s);
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
	a.fillText("You have died of dysentery", 80, (he/2*s));
}


w.onload = function(){
	generateMap();
	startLevel(1);
	w.addEventListener('keydown', function(e) {
		
		// we need to change vector or user object here
		
		/// todo: check previous vector and if it's opposite then just stop
		
		// key codes are: 37 - left, 38 - up, 39 - right, 40 - down
		kc=e.keyCode
//		console.log(kc);

		/// todo: decide if we really need the ability to stop
		if (36<kc && kc<41)
			u.v = kc-36;

//		if (36<kc && kc<41)
//			u.v = (u.v && Math.abs(kc-36-u.v)%4)==2 ? 0 : kc-36;

		if (kc == 80 || kc == 32) // "P" or "Space"
			togglePause();

	}, false);

	togglePause();
}