function Corner(a,b,c){
    this.x = a;
    this.y = b;
    this.z = c;
}

var object = {corners:[ //ett objekt med formen av en triangel
    new Corner(0,2,1),
    new Corner(0,2,0),
    new Corner(1,2,1)
]};

var cam = { // definerar kamerans start värden
    x:0,
    y:0,
    z:1,
    angle:{x:0,z:0},
    fov:{x:(Math.PI/3.6),z:(Math.PI/3.6)}
};

var scrn_w = 800; // skärmens bred och höjd i pixlar

function distance_from_middle(corner){ // returnerar en koordinats avstånd från mitten av skärmen (både X och Y)
    var dx = cam.x - corner.x;
    var dy = cam.y - corner.y;
    var dz = cam.z - corner.z;
    var hypotinusa_x = Math.sqrt(dy*dy + dz*dz);
    var hypotinusa_z = Math.sqrt(dy*dy + dx*dx);
    var d = Math.sqrt(dx*dx + dy*dy + dz*dz);
    var vx = cam.angle.x - Math.atan(dx/hypotinusa_x);
    var vz = cam.angle.z - Math.atan(dz/hypotinusa_z);
    var c = (scrn_w*d)/2;
    var bx = Math.sqrt((Math.cos(vx)*d)*(Math.cos(vx)*d)+dz*dz);
    var bz = Math.sqrt((Math.cos(vz)*d)*(Math.cos(vz)*d)+dx*dx);
    return [400-(Math.sin(vx)*c)/(bx*Math.tan(cam.fov.x)),400-(Math.sin(vz)*c)/(bz*Math.tan(cam.fov.z))];
}

var a = document.getElementById("mycanvas").getContext("2d");

function draw_polygon(object){ // ritar ut en polygon (3 hörn) i Canvas
    a.clearRect(0,0,800,800);
    a.beginPath();
    var coords;
    coords = distance_from_middle(object.corners[0]);
    a.moveTo(coords[0],coords[1]);
    coords = distance_from_middle(object.corners[1]);
    a.lineTo(coords[0],coords[1]);
    coords = distance_from_middle(object.corners[2]);
    a.lineTo(coords[0],coords[1]);
    a.closePath();
    a.fillStyle = "red";
    a.fill();
    a.stroke();
}

function focus_on_obj(){ //gör så att "cam" vinklar riktas mot "object"
    cam.angle.z = -Math.atan((cam.z-object.corners[0].z)/(cam.y-object.corners[0].y));
}
var angle = 0;
function turn_object(){ //vrider på triangeln för att skapa rörelse
    object.corners[2].x = Math.cos(angle);
    object.corners[2].y = 2+Math.sin(angle);
    angle += 0.1;
}

setInterval(function(){ //kallar på funktioner 10 gånger per sekund för att uppdatera bilden på skärmen
    draw_polygon(object);
    turn_object();
},100);

//du kan ändra på kamerans/cam position i konsollen på sidan för att kunna se triangeln från olika håll/vinklar och avstånd.