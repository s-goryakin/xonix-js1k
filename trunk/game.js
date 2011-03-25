wi=70;
he=40;
//wi=10;
//he=5;
s=10;
c.width=wi*s;
c.height=he*s;
c.style.border="red 1px solid";
w=window;
o=[]; // enemies
m=[]; // gaming field
level=1;
lives=3;
timer="";
Mro=Math.round;
Mra=Math.random;
_fs="fillStyle";
_fr="fillRect";
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
function startLevel()
{
	m=[];
	o=[];
	generateMap(1);
	u = { // user
		t:0,
		c:4,
		x:wi/2,
		y:he-2
	};

	createObjects(1, (level>7?7:level)); // max land enemies count is 7
	createObjects(2, level+1);
//	createObjects(2, level);

	changeObjectPosition(u, u.x, u.y)
	for(var i in o) {
		t=o[i];
		changeObjectPosition(t, t.x, t.y);
	}
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
		return m[y*wi+x];
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
		t = getAreaType(u.x+x, u.y+y);
		if (t==3) gameOver();
		if (t) {
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
	z=o.y*wi+o.x;
	//console.log(z);
	if ((!o.t && m[z] == 2) || (m[z] == 3))
	{
		c = 5;
		m[z] = 3;
	}
	else
	{
		c = m[z] == 1 ? 1 : 2;
	}
	drawBlock(o.x, o.y, c);
	// Draw new item
	drawBlock(x2, y2, o.c);
	o.x = x2;
	o.y = y2;
}

function togglePause(){
	if (!timer  && lives){
		timer = setInterval(function(){
			moveUser();
			for(var a in o) {
				moveEnemy(o[a]);
			}
		}, 50);
	}else{
		clearInterval(timer);
		timer="";
	}
}

function generateMap(a) {
	(a==0)?f=0:0;
	for(i=wi*he-1;i>=0;i--){
		x=i%wi;
		y=parseInt(i/wi);
		if (a==1) {
			k=2;
			if(y<2||y>he-3||x<2||x>wi-3) k=1;
			m.push(k);
			drawBlock(x,y,k);
		}
		if(a==0) {
			if (m[i] > 1 && m[i] < 4)
			{
				m[i] = 1;
				drawBlock(x, y, 1);
			}
			if (m[i]==9) {
				f++;
				m[i] = 2;
			}
		}
		if(a==2) {
			if(m[i]!=1) {
				m[i]=2;
				drawBlock(x, y, 2);
			}
		}
	}
	return (a==0)?f:0;
}

function gameOver() {
	lives--;
	togglePause();
	if(lives>0) {
		generateMap(2);
		u.x=wi/2;u.y=he-1;
	}
	else {
		a[_fs]="red";
		a[_fr](0,0,wi*s,he*s);
		a[_fs]="white";
		a.font = "25px Arial";
		a.fillText("You have died of dysentery", ((wi-25)/2*s), (he/2*s));
	}
}

function fillMap() {
	for(var a in o) {
		if(o[a].t<2)continue;
		tmp_array = [];
		tmp_array.push({x: o[a].x, y: o[a].y});
		while(tmp_array.length > 0) {
			tmp_el = tmp_array.shift();
			x=tmp_el.x;
			y=tmp_el.y;
			if (x-1 && x <= wi && y-1 && y <= he) {
				coords = [{x: x-1, y: y}, {x: x+1, y: y}, {x: x, y: y-1}, {x: x, y: y+1}];
				for (i in coords)
				{
					z=coords[i].y*wi+coords[i].x;
					if (m[z] == 2) {
						tmp_array.push({x: coords[i].x, y: coords[i].y});
						m[z]=9;
					}
				}
			}
		}
	}
	a=(wi-4)*(he-4);
	f=generateMap(0);
	b=100-parseInt(f/a*100);
	(b>86)?nextLevel():0;
}

function nextLevel() {
	togglePause();
	startLevel(level++);
}

function drawBlock(x,y,c){
//	a.fillStyle=(c==1)?"#999":((c==2)?"#03f":((c==3)?"red":((c==4)?"#390":"#ff0")));
	a[_fs]=(c==1)?"#999":((c==2)?"#03f":((c==3)?"red":((c==4)?"#390":((c==9)?"#fff":"#ff0"))));
	a[_fr](x*s,y*s,s,s);
}

w.onload = function(){
	startLevel(level);
	w.addEventListener('keydown', function(e) {

		// we need to change vector or user object here
		kc=e.keyCode
		console.log(kc);
		if (36<kc && kc<41)
			u.v = kc-36;

		if (kc == 80 || kc == 32) // "P" or "Space"
			togglePause();

	}, false);

	togglePause();
}