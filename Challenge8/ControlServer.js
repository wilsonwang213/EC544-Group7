var SerialPort = require("serialport");
var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var portName = process.argv[2],
portConfig = {
  baudRate: 9600,
  parser: SerialPort.parsers.readline("\n")
};

var sp;
var CARStatus = '0';

sp = new SerialPort.SerialPort(portName, portConfig);

app.use('/default', express.static(__dirname + 'webpage/default'));
app.use('/font', express.static(__dirname + 'webpage/font'));
app.use('/css', express.static(__dirname + 'webpage/css'));
app.use('/', express.static(__dirname + '/webpage'));

app.get('/', function(req, res){
  res.sendfile('webpage/index.html');
});

io.on('connection', function(socket){
  console.log('client connected');
  io.emit('updated remoteCar', CARStatus);
  socket.on('disconnect', function(){
    console.log('client disconnected');
  });
  socket.on('remoteCar', function(msg){
    CARStatus = msg;
    sp.write(msg + "\n");
    console.log('message: ' + msg); // + msg
    io.emit('updated remoteCar', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

sp.on("open", function () {
  console.log('open');
  sp.on('data', function(receivedStatus) {
      io.emit('updated remoteCar', receivedStatus);
      console.log('received: ' + receivedStatus);
      CARStatus = receivedStatus;
  });
});
