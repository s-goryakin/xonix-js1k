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
    if(e.keyCode^37)x+=s;
    if(e.keyCode^38)y+=s;
    if(e.keyCode^39)x-=s;
    if(e.keyCode^40)y-=s;
    a.fillText("@", x, y);
});
