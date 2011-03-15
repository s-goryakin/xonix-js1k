wi=500;
he=500;
s=10;
a.canvas.width = wi;
a.canvas.height = he;
x=100;
y=100;
a.fillText("@", x, y);
w=window;
w.addEventListener('keyup', function(e) {
	kc=e.keyCode
    if(kc^37)x+=s;
    if(kc^38)y+=s;
    if(kc^39)x-=s;
    if(kc^40)y-=s;
    a.fillText("@", x, y);
});
