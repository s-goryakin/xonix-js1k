wi=490;
he=290;
s=10;
a.canvas.width = wi;
a.canvas.height = he;
w=window;

o = []; // game objects
/*

Object description:
o = { 
	t:type, // 0 - user, 1 - land, 2 - sea
	m:mark, // @ - user, x - land, o - sea
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
		v:0,
		x:25,
		y:28
	};
	createObjects(1, (level>7?7:level)); // max land enemies count is 7
	createObjects(2, level);
	
	for (i=0;i<o.length;i++)
	{
		changeObjectPosition(o[i], o[i].x, o[i].y);
	}
//	console.log(o);
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
}

function moveEnemy(o)
{
	/// todo: check if (x, y+k) and (x+k, y) are of the same type, but (x+k, y+k) is not

//	console.log(o);
	var k; // increment
	if (o.v -7 < 0) // vector is 5 or 6
	{
		k = -1;
	}
	else // vector is 7 or 8
	{
		k = 1;
	}
	var n = {};
	n.y = o.y + verifyAreaType(o.x, o.y + k, o.t);

	if ((o.v-6)*(o.v-7)) // vector is 5 or 8
	{
		k = -1;
	}
	else // vector is 6 or 7
	{
		k = 1;
	}
	n.x = o.x + verifyAreaType(o.x + k, o.y, o.t);
//	console.log(n);
	changeObjectPosition(o, n.x, n.y);
}


// Used only for start level
function getRandCoords(type)
{
	if (type==1)
		return {x:0,y:0};
	else
		return {x:25,y:15};
}

// draw object at new coordinates and delete it from old coordinates
function changeObjectPosition(o, x2, y2)
{
	// Delete old item first
	a.fillStyle = "#fff";
	// Less filling not fully deleting old text :(
	a.fillText(o.m, o.x*s, o.y*s);
	a.fillText(o.m, o.x*s, o.y*s);
	a.fillText(o.m, o.x*s, o.y*s);
	a.fillText(o.m, o.x*s, o.y*s);
	a.fillText(o.m, o.x*s, o.y*s);
	a.fillText(o.m, o.x*s, o.y*s);

	// Draw new item
	a.fillStyle = "#000";
    a.fillText(o.m, x2*s, y2*s);

	o.x=x2;o.y=y2;
}

w.onload = function(){
	startLevel(1);
	w.addEventListener('keydown', function(e) {
		
		// we need to change vector or user object here
		
		/// todo: check previous vector and if it's opposite then just stop
		
		// key codes are: 37 - left, 38 - up, 39 - right, 40 - down
		kc=e.keyCode
		o[0].v=(36<kc && kc<41) ? kc-37 : o[0].v;
//		console.log(o[0].v);
		
		/// todo: move to moveObject() method
		kc=e.keyCode
		changeObjectPosition(o[0],o[0].x+1*((kc==39)-(kc==37)),o[0].y+1*((kc==40)-(kc==38)));
		
	}, false);

	setInterval(function(){
		for(var a in o) {
			moveObject(o[a]);
		}
	}, 250);
}



