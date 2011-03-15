wi=500;
he=500;
s=10;
a.canvas.width = wi;
a.canvas.height = he;
x=100;
y=100;
a.fillText("x", x, y);
w=window;

function changeObjectPosition(o, x1, y1, x2, y2)
{
	// Delete old item first
	a.fillStyle = "#fff";
	// Less filling not fully deleting old text :(
	a.fillText(o, x1, y1);
	a.fillText(o, x1, y1);
	a.fillText(o, x1, y1);
	a.fillText(o, x1, y1);
	a.fillText(o, x1, y1);
	a.fillText(o, x1, y1);

	// Draw new item
	a.fillStyle = "#000";
    a.fillText(o, x2, y2);
}

w.addEventListener('keyup', function(e) {
	kc=e.keyCode
	x1=x;y1=y;
	changeObjectPosition("x",x1,y1,x+=s*((kc==39)-(kc==37)),y+=s*((kc==40)-(kc==38)));
});