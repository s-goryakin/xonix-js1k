wi=70;
he=40;
//wi=11;
//he=10;
s=10;
c.width=wi*s;
c.height=he*s;
//c.style.border="red 1px solid";
w=window;
level=1;
lives=3;
timer="";
Mro=Math.round;
Mra=Math.random;
_fs="fillStyle";
_fr="fillRect";
user_start = parseInt(wi*he-wi*2.5);

// arrays co invert enemies vectors
invertX = {
	0:1,
	1:0,
	2:3,
	3:2
};
invertY = {
	0:3,
	3:0,
	1:2,
	2:1
};

// arrays to convert vectors to coefficients
v2kx = {
	0:-1,
	1:1,
	2:1,
	3:-1
};
v2ky = {
	0:-1,
	1:-1,
	2:1,
	3:1
};

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
		k:user_start
	};

	createObjects(1, (level>7?7:level)); // max land enemies count is 7
	createObjects(2, level+1);
	
	changeObjectPosition(u, u.k)
	for(var i in o)
		changeObjectPosition(o[i], o[i].k);
}

// initialize game object and store it in the objects array
function createObjects(type, count)
{
	for(i=0;i<count;i++)
	{
		// vectors: 1 - left-up, 2 - right-up, 3 - right-down, 4 - left-down
		while (m[n = Mro(Mra() * wi * he)] != type); // getting random coordinates
		o.push({
			t:type,
			c:3,
			v:(Mro(Mra() * 3)), // getting random vector
			k:n
		});
	}
}

function enemyCanBeHere(k, type)
{
	return !((type==1)^(m[k]==1));
}

function moveUser()
{
	var v = u.v;
	if (v)
	{
		// 0 - stop, 1 - left, 2 - up, 3 - right, 4 - down
		var k = u.k + ((v-1) * (v-3) ? (v - 3) * wi : v - 2);

		if (m[k] == 3) gameOver();
		if (m[k] == 2) u.l = 1;
		if (m[k])
			changeObjectPosition(u, k);
		else
			u.l = u.v = 0;
	}
	if(u.l && m[u.k] == 1)
	{
		u.v = u.l = 0;
		fillMap();
	}
}

function moveEnemy(t)
{
	createNewEnemyVector(t);

	k = v2kx[t.v] + v2ky[t.v]*wi;

	if (enemyCanBeHere(t.k+k, t.t))
		changeObjectPosition(t, t.k+k);

	checkGameOver(t);
}

function checkGameOver(t)
{
	if (t.k == u.k || m[t.k] == 3)
		gameOver();
}

function createNewEnemyVector(t)
{
	v = t.v;
	kx = v2kx[v];
	ky = v2ky[v]*wi;

	if (!enemyCanBeHere(t.k+kx, t.t))
		t.v = invertX[v];

	if (!enemyCanBeHere(t.k+ky, t.t))
		t.v = invertY[v];

	if (v == t.v && !enemyCanBeHere(t.k+kx+ky, t.t)) // we need to check if we already changed the vector
		t.v = invertY[invertX[v]];
}

// draw object at new coordinates and delete it from old coordinates
function changeObjectPosition(t, k2)
{
	// Delete old item first
	z = t.k;
	if ((!t.t && m[z] == 2) || m[z] == 3)
	{
		prev_color = 5;
		m[z] = 3;
	}
	else
	{
		prev_color = m[z] == 1 ? 1 : 2;
	}
	drawBlock(t.k, prev_color);
	// Draw new item
	
	drawBlock(k2, t.c);
	t.k = k2;
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
	f=0;
	for(i = 1; i <= wi * he; i++)
	{
		if (a)
		{
			var d = getMinDistance2Border(i);
			var k = d > 3 ? 2 : d > 1 ? 1 : 0;
			drawBlock(i,m[i] = k);
		}
		else
		{
			if (m[i] > 1 && m[i] < 4)
				drawBlock(i, m[i] = 1);
			
			if (m[i] == 9)
			{
				f++;
				m[i] = 2;
			}
		}
	}
	return f;
}

function getMinDistance2Border(k)
{
	var y = parseInt((k-1) / wi);
	y = Math.min(he-y, y+1);

	var x = k % wi;
	x = Math.min(x, wi+1-x);

	return Math.min(x,y);
}

function gameOver() {
	lives--;
	togglePause();
	if(lives>0) {
		changeObjectPosition(u, user_start);
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
		if(o[a].t<2)
			continue;

		tmp_array = [o[a].k];
		while(tmp_array.length > 0)
		{
			k = tmp_array.shift();
			if (m[k])
			{
				near = [k-1, k+1, k-wi, k+wi];
				for (i in near)
				{
					z=near[i];
					if (m[z] == 2)
					{
						tmp_array.push(z);
						m[z]=9;
					}
				}
			}
		}
	}
	a=(wi-6)*(he-6);
	f=generateMap(0);
	if (15 >= parseInt(f/a*100))
		nextLevel();
}

function nextLevel() {
	togglePause();
	startLevel(level++);
}

function drawBlock(k, color)
{
	// black -- border -- 000000 (000) -- #0
	// gray -- land -- 999999 (999) -- #1
	// blue -- water -- 0033ff (03f) -- #2
	// yellow -- path	-- ffff00 (ff0) --5
	// green -- player -- 339900 (390) --#4
	// red -- AI -- ff0000 (f00) -- #3

	colors = {
		0:'000',
		1:'999',
		2:'03f',
		3:'f00',
		4:'390',
		5:'ff0',
		9:'fff'
	};
	
	a[_fs] = "#"+colors[parseInt(color)];

	var x, y;
	x = k % wi ? k % wi : wi; // probably we don't need to check X to be zero. it's border there and we don't need to draw border actually
	y = parseInt((k-1) / wi);
	a[_fr]((x-1)*s,y*s,s,s);
}

w.onload = function(){
	startLevel(level);
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