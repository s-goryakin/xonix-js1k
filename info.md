game colors.
  * blue -- water -- 0033ff (03f)
  * gray -- land -- 999999 (999)
  * green -- player -- 339900 (390)
  * red -- AI -- ff0000 (f00)
  * yellow -- path  -- ffff00 (ff0)

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