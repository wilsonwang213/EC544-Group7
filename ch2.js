var SerialPort = require("serialport");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var inString;
var sum = 0.00;
var i = 1;
var excStr = "temperature exception!";
var f = new Array(3);
var tmp = new Array(3);
f[0] = 1;
f[1] = 1;
f[2] = 1;


var portName = process.argv[2],
portConfig = {
  baudRate: 9600,
  parser: SerialPort.parsers.readline("\n")
};

var sp;

sp = new SerialPort.SerialPort(portName, portConfig);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    sp.write(msg + "\n");
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

sp.on("open", function () {
  console.log('open');
  sp.on('data', function(data) {
    console.log('data received: ' + data);  //capture the messgae in serialport
    var temp = new Number((parseFloat)(data));
    var index = parseInt(temp/100);
    if (f[index]==0)
    {
    	var cnt = 0;
    	var sum = 0;
    	for (var i=0; i<3; i++)
    	{
    		if (tmp[i]!=1)
    		{
    			cnt++;
    			sum+=tmp[i];
    		}
    	}
    	sum/=cnt;
    	io.emit("chat message", "Average Temperature:" + sum.toFixed(2).toString());
 		for (var i=0; i<3; i++)
 		{
 			f[i] = 1;
 			tmp[i] = 0;
 		}
    }
    tmp[index] = temp%100;
    f[index]--;


    // -- io.emit("chat message", "Temperature: " + data);
    // -- if (temp > 80 || temp < 30) {
    // --   io.emit("chat message", "Warning: temperature exception!");
    // --   flag++;
    // --   temp = 0;
    // -- } 
    // -- sum += temp;  // accumulate temperature of each sensors

    // -- while(i==3){   //calculate the average Temperature
    // --     sum = sum / (3 - flag);  
        
    // --     var num = new Number(sum);
    // --     io.emit("chat message", "Average Temperature: " + num.toFixed(2).toString());  //keep two digits of the average temp
    // --     i=0;
    // --     sum = 0.00;
    // -- }
    // -- i++;
  });
});