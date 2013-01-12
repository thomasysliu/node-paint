/* Instantiate the main application variables
- Create HTTP-Server
- Bind an socket stream to the HTTP-Server
- Include file system methods
*/

var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickTool = new Array();
var clickSize = new Array();
var clickDrag = new Array();

var express = require('express');
var app = require('express').createServer()
, io = require('socket.io').listen(app)
, fs = require('fs')

//var app = require('http').createServer(handler)



app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});



// Bind HTTP-Server on Port 80
app.listen(8888);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/js/paint.js', function (req, res) {
  res.sendfile(__dirname + '/js/paint.js');
});
app.get('/js/paint.js', function (req, res) {
  res.sendfile(__dirname + '/js/paint.js');
});



// Delivering the main site
function handler (req, res) {
fs.readFile(__dirname + '/index.html', function (err, data) {
if (err) {
res.writeHead(500);
return res.end('Error loading index.html');
}
 
res.writeHead(200);
res.end(data);
});
}
 
// Initialize the socket stream
io.sockets.on('connection', function (socket) {
//setInterval(lineGenerator, 500, socket);

  	var i = 0;
	for(; i < clickX.length; i++)
	{	
		socket.emit('addClick', { x: clickX[i], y:clickY[i],Color:clickColor[i],Tool:clickTool[i],Size:clickSize[i],drag:clickDrag[i] });
	}
  socket.emit('mouseup');
  
  console.log("AAAA");
  socket.on('addClick', function (data) {
    //console.log(data);
    socket.broadcast.emit('addClick',data);
    addClick_remote(data.x, data.y, data.drag ,data.Tool,data.Color,data.Size);
  });
   socket.on('mouseup', function (data) {
    //console.log(data);
    socket.broadcast.emit('mouseup');
  });
});


  

  
 // addClick the socket stream

 /**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick_remote(Rx, Ry, Rdragging,RcurTool,RcurColor,RcurSize)
{
	//console.log(Rx,Ry,RcurColor,RcurTool);
	clickX.push(Rx);
	clickY.push(Ry);
	clickTool.push(RcurTool);
	clickColor.push(RcurColor);
	clickSize.push(RcurSize);
	clickDrag.push(Rdragging);
}

 
 
 
// Generating and sending a line
function lineGenerator(socket)
{
x_1 = Math.round(1 + 299*(Math.random()));
x_2 = Math.round(1 + 299*(Math.random()));
y_1 = Math.round(1 + 299*(Math.random()));
y_2 = Math.round(1 + 299*(Math.random()));
socket.emit('news', { x1: x_1, y1: y_1, x2: x_2, y2: y_2 });
}
