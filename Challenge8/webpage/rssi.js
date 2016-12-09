var SerialPort = require("serialport");
var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var xbee_api = require('xbee-api');
var fs = require('fs');
var sampleDelay = 2000;
var answer = 1;
var postion = 0;
var KNN = require('ml-knn');
var C = xbee_api.constants;
var XBeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

var i = 0;
var pre = 0;
var portName1 = process.argv[2],
portConfig1 = {
  baudRate: 9600,
  // parser: SerialPort.parsers.readline("\n")
  parser: XBeeAPI.rawParser()
};

var portName2 = process.argv[3],
portConfig2 = {
  baudRate: 9600,
  parser: XBeeAPI.rawParser()
};

var sp1;
var sp2;
var CARStatus = '0';

sp1 = new SerialPort.SerialPort(portName1, portConfig1);
sp2 = new SerialPort.SerialPort(portName2, portConfig2);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// app.use('/default', express.static(__dirname + '/default'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/images',express.static(__dirname + '/images'));
app.use('/',express.static(__dirname + '/'));
app.use('/css',express.static(__dirname + '/css'));


app.get('/default.css',function(req, res){
  res.sendfile('default.css');
});

app.get('/fonts.css',function(req, res){
  res.sendfile('fonts.css');
});

io.on('connection', function(socket){
  console.log('client connected');
  io.emit('updated remoteCar', CARStatus);
  socket.on('disconnect', function(){
    console.log('client disconnected');
  });
  socket.on('remoteCar', function(msg){
    CARStatus = msg;
    sp1.write(msg);
    // sp1.write(postion + "\n");
    console.log('message: ' + msg); // + msg
    io.emit('updated remoteCar', msg);
  });
  // socket.on('location',function(location){
  //
  // });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

sp1.on("open", function () {
  console.log('open');
  sp1.on('data', function(receivedStatus) {
      io.emit('updated remoteCar', receivedStatus);
      console.log('received: ' + receivedStatus);
      CARStatus = receivedStatus;
  });
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




    // [76,57,45,69],
    // [75,57,47,71],
    // [66,57,47,72],
    // [72,53,46,73],
    // [74,58,46,67],
    // [70,57,44,71],
// [75,53,51,75],//
// [73,52,43,70],
// [67,52,45,74],
// [72,52,45,66],
// [68,53,44,66],


[75,45,41,67],
[78,47,38,81],
[69,41,36,76],
[75,50,38,63],
[80,64,45,75],
[84,54,40,69],
[79,63,41,70],
[82,66,42,83],
[76,78,39,77],
[80,55,43,75],

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
    // [77,42,42,80],[76,40,43,83],
    // [80,40,47,82],[75,41,42,82],
    // [79,41,43,84],
    // [72,36,49,81],[72,36,48,78],[70,37,48,75],[74,36,44,76],[72,37,47,75],
    // [74,36,45,77],[72,37,46,74],
    // [73,37,44,77],
    // [74,36,46,73],[75,36,43,75],
    [84,53,47,85],
[83,54,47,85],
[79,47,48,78],
[81,49,49,83],
//5

[71,36,45,69],
[74,36,46,70],
[73,37,48,70],
[74,38,47,70],
[74,39,47,70],
// [73,36,46,71],
// [74,36,47,70],
// [73,36,45,70],
// [74,36,46,69],
// [71,36,47,71],
[69,41,46,75],
[69,43,45,75],
[68,40,47,75],
[69,41,45,76],
[66,42,46,76],
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
[1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
    4,
    // 5,5,5,5,5,5,5,5,5,5,
    6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,9];


knn.train(trainingSet, predictions);

knn.k = 3;

var sum = 0;
var dataset = [[0,0,0,0]];
var dataset1 = [[0,0,0,0]];
var dataset2 = [[0,0,0,0]];
var dataset3 = [[0,0,0,0]];
var datasetavg = [[0,0,0,0]];
// var dataset = [[0,0,0,0]];

//Note that with the XBeeAPI parser, the serialport's "data" event will not fire when messages are received


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
  sp2.write(XBeeAPI.buildFrame(RSSIRequestPacket));
  console.log("**********************************************************");
  // if(answer == 5) {
  //    sp1.write("7");
  // }
    io.emit('location', answer);
  //   //console.log("dataset: " + dataset);
    console.log("answer: " + answer);
  // //}
  // writer.write({start: "START", Beacon:"", data: ""});
}

sp2.on("open", function () {
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
      i++;

    }
    if(frame.data[1] == 2)
    {

      dataset[0][1] = frame.data[0];
      //console.log("Beacon 2 : " + dataset[0][1]);
      i++;
    }
    if(frame.data[1] == 3)
    {

      dataset[0][2] = frame.data[0];
      //console.log("Beacon 3 : " + dataset[0][2]);
      i++;
    }
    if(frame.data[1] == 4)
    {

      dataset[0][3] = frame.data[0];
      //console.log("Beacon 4 : " + dataset[0][3]);
      i++;
    }

    if(i == 4) {
//       writer.write({Beacon1:dataset[0][0], Beacon2:dataset[0][1], Beacon3:dataset[0][2], Beacon4:dataset[0][3] })
      i = 0;



    sum++;
    if (sum<3)
    {
      switch(sum)
      {
        case 1:
          dataset1 = dataset;
          break;
        case 2:
          dataset2 = dataset1;
          dataset1 = dataset;
          break;
      }
      answer = knn.predict(dataset);
        pre = answer;
      //io.emit('location', ans);
      //console.log("answer: " + ans);
  }
  else
  {
    dataset3 = dataset2;
    dataset2 = dataset1;
    dataset1 = dataset;
    var d1 = 0;
    var d2 = 0;
    var d3 = 0;
    var d4 = 0;
    d1 = dataset1[0][0] + dataset2[0][0] + dataset3[0][0];
    d2 = dataset1[0][1] + dataset2[0][1] + dataset3[0][1];
    d3 = dataset1[0][2] + dataset2[0][2] + dataset3[0][2];
    d4 = dataset1[0][3] + dataset2[0][3] + dataset3[0][3];
    datasetavg[0][0] = d1/3;
    datasetavg[0][1] = d2/3;
    datasetavg[0][2] = d3/3;
    datasetavg[0][3] = d4/3;
    answer = knn.predict(datasetavg);
        if (answer=="-1")
        {
            answer = pre;
        }
        else
        {
        if (pre<=2 && answer>=7)
        {
            answer = pre==1?8:pre-1;
        }
        else if (pre>=7 && answer<=3)
        {
            answer = pre==8?1:parseInt(pre)+1;
        }
        else if (answer>pre)
        {
            //console.log("!!!answer: " + answer);
            answer = parseInt(pre) + 1;
            //console.log("!!!answer: " + answer);
            if (answer>8) answer = 1;
        }
        else if (answer<pre)
        {
            answer = pre - 1;
            if (answer<1) answer = 1;
        }
        }
        pre = answer;
    //io.emit('location', ans);
    //console.log("answer: " + ans);
  }
    //if(answer > 0 && answer < 25) {
      io.emit('location', answer);
      //console.log("dataset: " + dataset);
      console.log("answer: " + answer);
      console.log("**********************************************************");
}

    //answer = knn.predict(dataset);
    // io.emit('location', answer);
    // console.log("answer: " + answer);
  }
});
