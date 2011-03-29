// a; // reserved
// b; // reserved
// c; // reserved
w=window;

W=70; // main width
H=40; // main height
B=10; // block size

// M; // map field
// E; // enemies
// U; // user
// P; // user start position

D=Math; // alias
r=D.random; // alias
//R=D.round; // alias // now simple use ~~
m=D.min; // alias
I=parseInt; // alias

// i, j; // universal iterators
// k, x, y; // universal map indexes
// v; // universal vector

level=1;
lives=3;
timer="";

_fs="fillStyle";
_fr="fillRect";

//W=11;
//H=10;

c.width=W*B;
c.height=H*B;

P = I(W*H-W*2.5);

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
X = {
	0:-1,
	1:1,
	2:1,
	3:-1
};
Y = {
	0:-1,
	1:-1,
	2:1,
	3:1
};

/*
Object description:
enemies = {
	t:type, // 0 - user, 1 - land, 2 - sea
	c:color, // #390 - user, #f00 - AI
	v:vector, // 0 - stop, 1 - left, 2 - up, 3 - right, 4 - down, 5 - left-up, 6 - up-right, 7 - right-down, 8 - down-left
	k:k, // map index
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
	M=[];
	E=[];
	generateMap(1);
	U = { // user
		t:0,
		c:4,
		k:P
	};

	createObjects(1, (level>5?5:level)); // max land enemies count is 5
	createObjects(2, level+1);
	
	changeObjectPosition(U, U.k)
	for(i in E)
		changeObjectPosition(E[i], E[i].k);
}

// initialize game object and store it in the objects array
function createObjects(type, count)
{
	i = count;
	while (i--)
	{
		// vectors: 1 - left-up, 2 - right-up, 3 - right-down, 4 - left-down
		while (M[k = ~~(r() * W * H)] != type); // getting random coordinates
		E.push({
			t:type,
			c:5,
			v:~~(r() * 3), // getting random vector
			k:k
		});
	}
}

function enemyCanBeHere(index, type)
{
	return !((type==1)^(M[index]==1));
}

function moveUser()
{
	v = U.v;
	if (v)
	{
		// 0 - stop, 1 - left, 2 - up, 3 - right, 4 - down
		k = U.k + ((v-1) * (v-3) ? (v - 3) * W : v - 2);

		if (M[k] == 3) gameOver();
		if (M[k])
			changeObjectPosition(U, k);
		else
			U.v = 0;
	}
}

function moveEnemy(t)
{
	v = t.v;
	y=Y[v]*W;

	if (!enemyCanBeHere(t.k+X[v], t.t))
		t.v = invertX[v];

	if (!enemyCanBeHere(t.k+y, t.t))
		t.v = invertY[v];

	if (v == t.v && !enemyCanBeHere(t.k+X[v]+y, t.t)) // we need to check if we already changed the vector
		t.v = invertY[invertX[v]];

	k = X[t.v] + Y[t.v]*W;

	if (enemyCanBeHere(t.k+k, t.t))
		changeObjectPosition(t, t.k+k);

	if (t.k == U.k || M[t.k] == 3)
		gameOver();
}

// draw object at new coordinates and delete it from old coordinates
//third parameter is GameOver
function changeObjectPosition(t, k2,go)
{
	// Delete old item first
	k = t.k;
	
	prev_color = M[k];
	if (!t.t && M[k] == 2)
		prev_color = M[k] = 3;
	drawBlock(t.k, prev_color);

	// Check if we moving user and crossing sea-land border
	if (!t.t && M[t.k] == 3 * M[k2])
	{
		U.v = 0;
		if(!go)fillMap();
	}

	// Draw new item
	drawBlock(k2, t.c);
	t.k = k2;
}

function togglePause(){
	if (!timer  && lives){
		timer = setInterval(function(){
			moveUser();
			for(i in E) {
				moveEnemy(E[i]);
			}
		}, 50);
	}else{
		clearInterval(timer);
		timer="";
	}
}

function generateMap(redraw) {
	sea_area = 0;
	i = W * H + 1;
	while (i--)
	{
		if (redraw==1)
		{
			j = getMinDistance2Border(i);
			k = j > 3 ? 2 : j > 1 ? 1 : 0;
			drawBlock(i, M[i] = k);
		}
		if(redraw==0)
		{
			if (M[i] > 1 && M[i] < 4)
				drawBlock(i, M[i] = 1);
			
			if (M[i] == 9)
			{
				sea_area++;
				M[i] = 2;
			}
		}
		if(redraw==2 && M[i]>1 && M[i]<4)
			drawBlock(i, M[i]=2);
	}
	return sea_area;
}

function getMinDistance2Border(index)
{
	y = I((index-1) / W);
	y = m(H-y, y+1);

	x = index % W;
	x = m(x, W+1-x);

	return m(x,y);
}

function gameOver() {
	lives--;
	togglePause();
	if(lives>0) {
		changeObjectPosition(U, P,1);
		generateMap(2);
	}
	else {
		a[_fs]="red";
		a[_fr](0,0,W*B,H*B);
		a[_fs]="white";
		a.font = "25px Arial";
		a.fillText("You have died of dysentery", ((W-25)/2*B), (H/2*B));
	}
}

function fillMap() {
	for(i in E) {
		
		if(E[i].t < 2)
			continue;

		tmp_array = [E[i].k];
		while(tmp_array.length > 0)
		{
			k = tmp_array.shift();
			if (M[k])
			{
				near = [k-1, k+1, k-W, k+W];
				for (j in near)
				{
					z=near[j];
					if (M[z] == 2)
					{
						tmp_array.push(z);
						M[z]=9;
					}
				}
			}
		}
	}

	sea_area = generateMap(0);
	whole_sea = (W-6)*(H-6);
	if ((sea_area / whole_sea) < 0.15)
		nextLevel();
}

function nextLevel() {
	togglePause();
	startLevel(level++);
}

function drawBlock(index, color)
{
	// black -- border -- 000000 (000) -- #0
	// gray -- land -- 999999 (999) -- #1
	// blue -- water -- 0033ff (03f) -- #2
	// yellow -- path	-- ffff00 (ff0) --3
	// green -- player -- 339900 (390) --#4
	// red -- AI -- ff0000 (f00) -- #5

	colors = {
		0:'000',
		1:'999',
		2:'03f',
		3:'ff0',
		4:'390',
		5:'f00',
		9:'fff'
	};
	
	a[_fs] = "#"+colors[I(color)];

	x = index % W ? index % W : W; // probably we don't need to check X to be zero. it's border there and we don't need to draw border actually
	y = I((index-1) / W);
	a[_fr]((x-1)*B,y*B,B,B);
}

w.onload = function(){
	startLevel(level);
	w.addEventListener('keydown', function(e) {

		// we need to change vector or user object here
		kc=e.keyCode
		if (36<kc && kc<41)
			U.v = kc-36;

		if (kc == 80 || kc == 32) // "P" or "Space"
			togglePause();

	}, false);

	togglePause();
}