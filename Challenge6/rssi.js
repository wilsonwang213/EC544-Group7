var SerialPort = require("serialport");
var app = require('express')();
var xbee_api = require('xbee-api');

var csvWriter = require('csv-write-stream');
var fs = require('fs');
// var writer = csvWriter();
// writer.pipe(fs.createWriteStream('out.csv'));

var i = 1;
var j = 1;
var m = 1;
var n = 1;
var answer = 1;

var C = xbee_api.constants;
var XBeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

var portName = process.argv[2];

var sampleDelay = 2000;

var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var KNN = require('ml-knn');

app.use('/fonts', express.static(__dirname + 'webpage/fonts'));
app.use('/images', express.static(__dirname + '/webpage/images'));
app.use('/', express.static(__dirname + '/webpage'));


app.get('/localization', function(req, res){
  res.sendfile('webpage/index.html');
});

var knn = new KNN();
var trainingSet =[
    [54,78,80,40],
[46,85,80,40],
[47,80,81,40],
[59,85,78,42],
[46,79,78,43],
[40,85,80,45],
[45,78,76,43],
[38,83,71,43],
[41,82,75,44],
[39,82,71,45],
//1

[51,78,67,38],
[43,78,68,37],
[45,75,66,37],
[48,73,68,37],
[47,76,63,37],
[52,73,68,43],
[48,82,64,45],
[49,82,66,42],
[50,83,63,45],
[52,79,67,48],
//2

[60,72,81,53],
[64,82,75,49],
[57,75,74,55],
[58,64,63,62],
[65,67,60,63],
[68,65,61,65],
[62,70,57,69],
[70,58,44,67],
[72,60,45,61],
[73,59,46,62],
//3




    [76,57,45,69],[75,57,47,71],[66,57,47,72],[72,53,46,73],[74,58,46,67],[70,57,44,71],
[75,53,51,75],
[73,52,43,70],
[67,52,45,74],
[72,52,45,66],
[68,53,44,66],
// [70,53,45,68],
// [72,56,48,67],
// [82,56,49,64],
// [70,55,48,75],
// [83,60,44,67],
// [79,54,49,71],
// [75,55,49,70],
// [77,57,45,65],
// [83,57,44,65],
// [75,57,44,70],
// [74,60,55,64],
// [67,60,53,61],
// [67,53,49,65],
// [71,66,43,73],
// [70,60,47,62],
// [75,52,49,71],
// [73,52,49,71],
// [68,56,51,71],
// [70,58,51,70],
// [69,51,64,68],
// [74,57,48,66],
// [71,64,42,66],
// [72,59,47,70],
// [74,61,43,71],
// [77,60,53,70],
// [83,53,44,69],
// [78,54,51,68],
// [77,54,47,72],
//4


    // [73,45,45,71],[78,45,45,70],[75,45,46,70],[72,44,46,70],[75,45,48,69],
    [76,46,46,71],[77,46,47,69],
    // [76,43,42,70],[77,43,43,69],[79,43,49,70],
    // [79,43,49,77],[81,45,48,76],[80,45,43,82],[78,42,44,78],[81,42,44,74],
    [81,42,43,75],[77,42,43,76],
    // [80,42,43,79],[75,47,46,79],[74,45,45,76],
    // [79,42,39,82],[76,41,41,82],[77,40,44,83],[79,42,43,83],[76,41,43,83],
    [77,42,42,80],[76,40,43,83],
    [80,40,47,82],[75,41,42,82],
    // [79,41,43,84],
    // [72,36,49,81],[72,36,48,78],[70,37,48,75],[74,36,44,76],[72,37,47,75],
    [74,36,45,77],[72,37,46,74],
    // [73,37,44,77],
    // [74,36,46,73],[75,36,43,75],
//5

[71,36,45,69],
[74,36,46,70],
[73,37,48,70],
[74,36,47,70],
[74,36,47,70],
[73,36,46,71],
[74,36,47,70],
[73,36,45,70],
[74,36,46,69],
[71,36,47,71],
//6


[65,46,64,70],
[64,47,73,74],
[63,48,67,74],
[61,49,61,74],
[57,52,64,81],
[52,55,64,73],
[50,57,63,77],
[46,63,79,51],
[44,69,76,51],
[44,72,74,54],
//7


[35,67,75,51],
[34,65,78,52],
[34,63,74,57],
[35,64,76,47],
[35,64,73,48],
[35,63,80,48],
[35,63,82,51],
[35,63,79,55],
[35,63,78,51],
[35,63,80,51]
//8

];

var predictions =
[1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,
    5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8];


knn.train(trainingSet, predictions);

knn.k = 1;

var dataset = [[0,0,0,0]];

//Note that with the XBeeAPI parser, the serialport's "data" event will not fire when messages are received!
portConfig = {
  baudRate: 9600,
  parser: XBeeAPI.rawParser()
};

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  });
});

http.listen(3000, function(){
  //listen on localhost port 4000
  console.log('listening on *:3000');
});


var sp;
sp = new SerialPort.SerialPort(portName, portConfig);


//Create a packet to be sent to all other XBEE units on the PAN.
// The value of 'data' is meaningless, for now.
var RSSIRequestPacket = {
  type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
  destination64: "000000000000ffff",
  broadcastRadius: 0x01,
  options: 0x00,
  data: "test"
}

var requestRSSI = function(){
  sp.write(XBeeAPI.buildFrame(RSSIRequestPacket));
  // console.log("**********************************************************");
  // //if(answer > 0 && answer < 51) {
  //   io.emit('location', answer);
  //   //console.log("dataset: " + dataset);
  //   console.log("answer: " + answer);
  // //}
  // writer.write({start: "START", Beacon:"", data: ""});
}

sp.on("open", function () {
  console.log('open');
  requestRSSI();
  setInterval(requestRSSI, sampleDelay);
});

XBeeAPI.on("frame_object", function(frame) {
  if (frame.type == 144){
    console.log("Beacon ID: " + frame.data[1] + ", RSSI: " + (frame.data[0]));
    if(frame.data[1] == 1)
    {

      dataset[0][0] = frame.data[0];
      //console.log("Beacon 1 : " + dataset[0][0]);
    //   writer.write({start: "", Beacon:"1", data: dataset[0][0]});
      i++;

    }
    if(frame.data[1] == 2)
    {

      dataset[0][1] = frame.data[0];
      //console.log("Beacon 2 : " + dataset[0][1]);
    //   writer.write({Beacon:"2", data: dataset[0][1]});
      j++;
    }
    if(frame.data[1] == 3)
    {

      dataset[0][2] = frame.data[0];
      //console.log("Beacon 3 : " + dataset[0][2]);
    //   writer.write({Beacon:"3", data: dataset[0][2]});
      m++;
    }
    if(frame.data[1] == 4)
    {

      dataset[0][3] = frame.data[0];
      //console.log("Beacon 4 : " + dataset[0][3]);
    //   writer.write({Beacon:"4", data: dataset[0][3]});
      n++;
    }

    answer = knn.predict(dataset);
    io.emit('location', answer);
    console.log("answer: " + answer);
    console.log("**********************************************************");
  }
});
