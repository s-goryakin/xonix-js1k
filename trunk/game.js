wi=490;
he=290;
s=10;
a.canvas.width=wi;
a.canvas.height=he;
w=window;
o = []; // game objects
timer = "";
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
	m:mark, // @ - user, x - land, o - sea
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
	
	o[0] = { // user
		t:0,
		m:"@",
		c:"#390",
		v:0,
		x:25,
		y:28
	};
//	createObjects(1, (level>7?7:level)); // max land enemies count is 7
	createObjects(2, level);
	
	for (i=0;i<o.length;i++)
	{
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
			m:(type==1)?"X":"O",
			c:"#f00",
			v:Math.floor(Math.random() * 3) + 5, // 5..8
			x:coords.x,
			y:coords.y
		});
	}
}

// return the type of surface for specified coordinates
function getAreaType(x,y)
{
	// check current matrix here

	/// todo: add all other types
	
	if (x < 0 || y < 0 || x > 49 || y > 29)
		return 0;
	else
		return 2;


}

// check if area is the same type with specified one
// return 1 is they are equal and -1 if not
function verifyAreaType(x,y,type)
{
	return (getAreaType(x,y) == type ? 1 : -1);
}

function moveObject(o)
{
	if (o.t) // not user
		moveEnemy(o);
	else
		moveUser(o);
	
}

function moveUser(o)
{
	
	// process moving user here

	// check outer space
	// check passing land-sea or sea-land border
	if (o.v)
	{
		x=!((o.v-1)*(o.v-3))?o.v-2:0;
		y=!((o.v-2)*(o.v-4))?o.v-3:0;
		console.log(o.x,o.y,wi/s,he/s);
		((o.x+x<1)||(o.x+x>=wi/s-1))?(o.v=0):0;
		changeObjectPosition(o, o.x+x, o.y+y);
	}
}

function moveEnemy(o)
{
	/// todo: check if (x, y+k) and (x+k, y) are of the same type, but (x+k, y+k) is not
	v = o.v-4; // v = [1..4]

	var k;
	var n = {};
	if (o.v < 7) // vector is 5 or 6
	{
		k = -1;
	}
	else // vector is 7 or 8
	{
		k = 1;
	}
	invert_y = verifyAreaType(o.x, o.y + k, o.t) == -1;
	n.y = o.y + verifyAreaType(o.x, o.y + k, o.t) * k;
	
	if ((o.v-6)*(o.v-7)) // vector is 5 or 8
	{
		k = -1;
	} else {
		k = 1;
	}

	invert_x = verifyAreaType(o.x + k, o.y, o.t) == -1;
	n.x = o.x + verifyAreaType(o.x + k, o.y, o.t) * k;
	
	changeEnemyVector(o, invert_x, invert_y);
	changeObjectPosition(o, n.x, n.y);

}

function changeEnemyVector(o, invert_x, invert_y)
{
	v = o.v;
	if (invert_x)
	{
		if (o.v < 7)
			o.v = ((o.v - 5) * -1) + 6;
		else
			o.v = ((o.v - 7) * -1) + 8;
	}

	if (invert_y)
	{
		o.v = ((o.v+2))%4 + 5;
	}
}


// Used only for start level
function getRandCoords(type)
{
	if (type==1)
		return {x:1,y:1};
	else
		return {x:25,y:15};
}

// draw object at new coordinates and delete it from old coordinates
function changeObjectPosition(o, x2, y2)
{
   // Delete old item first
   a.clearRect(o.x*s, o.y*s, s, s);

   // Draw new item
   a.fillStyle = o.c;
   a.fillRect(x2*s, y2*s, s, s);
	o.x=x2;o.y=y2;
}

function run()
{
	timer = setInterval(function(){
		for(var a in o) {
			moveObject(o[a]);
		}
	}, 50);
}

function stop()
{
	clearInterval(timer);
}

w.onload = function(){
	startLevel(1);
	w.addEventListener('keydown', function(e) {
		
		// we need to change vector or user object here
		
		/// todo: check previous vector and if it's opposite then just stop
		
		// key codes are: 37 - left, 38 - up, 39 - right, 40 - down
		kc=e.keyCode
		o[0].v=(36<kc && kc<41) ? kc-36 : o[0].v;

		if (kc == 32)
			stop();
		if (kc == 13)
			run();

	}, false);

	run();
}